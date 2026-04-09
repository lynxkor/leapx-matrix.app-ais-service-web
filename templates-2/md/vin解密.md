
```javascript
<el-form-item label="VIN：">
  <LPEncrypted
  :value.sync="form.vin"
  :decryptMethod="() => getDetailDecryptField(form.id, 'vin')"
  >
  {{ form.vin }}
  </LPEncrypted>
</el-form-item>


```