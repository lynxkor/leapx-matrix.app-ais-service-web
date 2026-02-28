# Field Type Inference Rules

This document details the rules for inferring field types from user input.

## Inference Priority

1. **Explicit specification** - User provides type in JSON
2. **Field name patterns** - Match key against known patterns
3. **Description patterns** - Match description against known patterns
4. **Default** - String type with input control

## Type Inference Rules

### Date/Time Fields

**Type**: `string`
**Format**: `date-time`
**Control**: `el-date-picker`
**Searchable**: `true` (unless ID field)

**Triggers**:
- Field key contains: `time`, `date`
- Description contains: `时间`, `日期`

**Examples**:
- `createTime` → date-picker
- `updateTime` → date-picker
- `orderDate` → date-picker
- `openDate` → date-picker
- `开业时间` → date-picker
- `创建日期` → date-picker

**Search Form**: Use `daterange` type for search, single `date` for edit form
**Table Display**: Show full datetime string

### Select/Enum Fields

**Type**: `string`
**Control**: `fetch-select` with `enumCode` placeholder
**Searchable**: `true`

**Triggers**:
- Field key contains: `type`, `status`, `state`, `category`
- Description contains: `类型`, `状态`, `分类`

**Examples**:
- `serviceType` → fetch-select (need enum)
- `orderStatus` → fetch-select (need enum)
- `workState` → fetch-select (need enum)
- `region` → fetch-select (need enum)
- `服务类型` → fetch-select (need enum)

**Enum Code Suggestions**:
- `status` → `COMMON_STATUS`, `ENABLE_DISABLE`
- `type` → `{MODULE}_TYPE`
- `category` → `{MODULE}_CATEGORY`

**Post-Generation Reminder**: Always remind user to add enum codes

### Boolean Fields

**Type**: `boolean`
**Control**: `el-radio-group` (edit), `fetch-select` with `yes_no_enum` (search)
**Searchable**: `false` (typically not searched)

**Triggers**:
- Field key contains: `is`, `has`, `can`, `enabled`, `disabled`, `enabled`
- Field type explicitly `boolean`
- Description contains: `是否`, `能否`, `启用`, `禁用`

**Examples**:
- `isEnabled` → radio-group
- `hasPermission` → radio-group
- `canEdit` → radio-group
- `enabled` → radio-group
- `是否启用` → radio-group
- `是否删除` → radio-group

**Search Form**: Use `fetch-select` with `yes_no_enum` options
**Edit Form**: Use `el-radio-group` with 是/否 options
**Table Display**: Show 是/否 text

### Number Fields

**Type**: `number`
**Control**: `el-input`
**Searchable**: `true`

**Triggers**:
- Field key contains: `amount`, `price`, `cost`, `count`, `num`, `quantity`, `age`, `mileage`
- Description contains: `金额`, `价格`, `数量`, `里程`, `年龄`

**Examples**:
- `totalAmount` → el-input (number)
- `unitPrice` → el-input (number)
- `itemCount` → el-input (number)
- `mileage` → el-input (number)
- `金额` → el-input (number)
- `数量` → el-input (number)

**Note**: May need validation rules for min/max values

### Array Fields (Sub-Tables)

**Type**: `array`
**Control**: `EditTable` component
**Visible**: `false` (typically not shown in main table)
**Searchable**: `false`

**Triggers**:
- Field type explicitly `array`
- Description contains: `列表`, `明细`, `项目`, `items`

**Examples**:
- `orderItems` → EditTable (sub-table)
- `details` → EditTable (sub-table)
- `repairItems` → EditTable (sub-table)

**Action**: Prompt user for main-detail table generation

### Default Text Fields

**Type**: `string`
**Control**: `el-input`
**Searchable**: `true`

**Examples**:
- `name`, `code`, `description`
- `联系人`, `电话`, `地址`

## Searchable Inference Rules

### Default: Searchable = true

All fields are searchable by default unless they match exclusion patterns.

### Exclusion Patterns

**Not searchable** when:
- Field ends with: `id`, `Id`, `ID`
- Field contains: `creator`, `modifier`, `createdBy`, `updatedBy`
- Field contains: `remark`, `note`, `comment`
- Field is: `version`, `sort`, `order`
- Field name is: `id`, `createTime`, `updateTime` (system fields)

**Examples of NOT searchable**:
- `id` ✗
- `userId` ✗
- `creator` ✗
- `modifierName` ✗
- `remark` ✗
- `createTime` ✗ (typically use createTimeStart/End)
- `updateTime` ✗

## Visibility Inference Rules

### Default: First 5 fields visible

- Fields 1-5: `visible: true`
- Fields 6+: `visible: false`

### Override Rules

**Always visible**:
- First field (usually identifier)
- Name/title fields
- Code fields
- Status fields

**Always hidden**:
- ID fields (except first if it's the identifier)
- System fields: `createTime`, `updateTime`, `creator`, `modifier`
- Long text fields: `remark`, `description`, `comment`
- Version/sort fields

## Special Cases

### ID Fields

**Pattern**: Ends with `id` or `Id`
**Type**: `string` (usually)
**Visible**: `false` (unless it's the primary identifier)
**Searchable**: `false`

**Example**:
- `id` → visible: true (primary), searchable: false
- `userId` → visible: false, searchable: false
- `orderId` → visible: false, searchable: false

### Code Fields

**Pattern**: Contains `code` or `编码`
**Type**: `string`
**Visible**: `true`
**Searchable**: `true`

**Examples**:
- `storeCode` → visible: true, searchable: true
- `orderNo` → visible: true, searchable: true
- `门店编码` → visible: true, searchable: true

### Description Fields

**Pattern**: Contains `desc` or `描述` or `remark`
**Type**: `string`
**Visible**: `false` (too long for table)
**Searchable**: `false` (rarely searched)

**Examples**:
- `description` → visible: false, searchable: false
- `remark` → visible: false, searchable: false
- `故障描述` → visible: false, searchable: false

### User Reference Fields

**Pattern**: Ends with `Name`, `Name`, contains `user`
**Type**: `string`
**Visible**: `true`
**Searchable**: `true`

**Examples**:
- `creatorName` → visible: true, searchable: true
- `dealerName` → visible: true, searchable: true
- `customerName` → visible: true, searchable: true

## Inference Algorithm

```javascript
function inferFieldType(field) {
  const { key, description, type: explicitType } = field;
  const keyLower = key.toLowerCase();
  const descLower = description?.toLowerCase() || '';

  // 1. Use explicit type if provided
  if (explicitType) {
    return {
      type: explicitType,
      // ... apply control inference based on type
    };
  }

  // 2. Array fields (sub-tables)
  if (keyLower.match(/items|details|list/) || descLower.match(/列表|明细/)) {
    return { type: 'array', visible: false, searchable: false };
  }

  // 3. Boolean fields
  if (keyLower.match(/is|has|can|enabled|disabled/) ||
      descLower.match(/是否|能否|启用|禁用/)) {
    return { type: 'boolean', searchable: false };
  }

  // 4. Date fields
  if (keyLower.match(/time|date/) || descLower.match(/时间|日期/)) {
    return { type: 'string', format: 'date-time', searchable: !keyLower.match(/id$/) };
  }

  // 5. Number fields
  if (keyLower.match(/amount|price|cost|count|num|quantity|mileage/) ||
      descLower.match(/金额|价格|数量|里程/)) {
    return { type: 'number', searchable: true };
  }

  // 6. Select/enum fields
  if (keyLower.match(/type|status|state|category/) ||
      descLower.match(/类型|状态|分类/)) {
    return { type: 'string', control: 'fetch-select', searchable: true };
  }

  // 7. Default: text field
  return { type: 'string', searchable: !keyLower.match(/id$/) };
}
```

## Post-Inference Validation

After inferring types, validate:

1. ✅ At least one field is visible
2. ✅ At least one field is searchable
3. ✅ First field is visible (usually identifier)
4. ✅ No Vue reserved words as field names
5. ✅ Field names are valid JavaScript identifiers

If validation fails, prompt user to correct.