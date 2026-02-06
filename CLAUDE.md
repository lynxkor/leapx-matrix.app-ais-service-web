# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is **app-ais-aftersale-front** (AI Service After-Sales Frontend) - an automotive after-sales service management system. It's a Vue 2 SPA that can run both as a standalone application and as a micro-frontend embedded in a Qiankun container.

## Development Commands

### Local Development
```bash
npm run local        # Start dev server (port 7779)
```

### Building
```bash
npm run sit          # Build for SIT environment
npm run uat          # Build for UAT environment
npm run build        # Production build
```

### Code Generation
The project includes a code generator for scaffolding CRUD pages:

```bash
# Generate views and API files for a module
node .\bin\generate.js -- <module-name>
```

This creates:
- `src/views/<module>/index.vue` (list view)
- `src/views/<module>/detail.vue` (detail view)
- `src/views/<module>/edit.vue` (create/edit form)
- `src/api/<module>.js` (API endpoints)
- Router entries in `src/router/index.js`

Templates are stored in `src/templates/` and use Mustache templating.

## Architecture

### Micro-Frontend Mode
The app supports dual deployment modes using Qiankun:
- **Standalone**: Runs independently with full navigation menu
- **Qiankun**: Embedded as a micro-frontend with minimal layout

Key files:
- `src/public-path.js` - Handles webpack public path injection
- `src/main.js` - Exports `bootstrap()`, `mount()`, `unmount()` for micro-frontend lifecycle
- `src/views/layout/index.vue` - Conditionally renders layout based on `window.__POWERED_BY_QIANKUN__`

### View Pattern
All CRUD views follow a consistent three-file pattern:
- **index.vue**: List view with search/filter and VXE Table grid
- **detail.vue**: Read-only detail view
- **edit.vue**: Create/edit form

Routes include metadata for permissions, caching, and navigation:
```javascript
meta: {
  name: 'Page Name',
  keepAlive: true,        // Cache the page
  requiresAuth: true,     // Auth required
  noResourceUrl: true,    // Skip permission check
  moduleKey: 'xxx',       // Permission module key
  isDealer: true          // Dealer-level permission
}
```

### Business Domain Structure
```
src/views/
├── maintain/          # Maintenance operations
│   ├── basic/        # Basic data (dealer teams, work hours, etc.)
│   └── sp/           # Service process (work orders, settlements)
├── sparepart/         # Spare parts management
│   ├── basic/        # Parts master data
│   ├── warehouse/    # Inventory and warehouses
│   ├── inbound/      # Inbound logistics
│   ├── outbound/     # Outbound logistics
│   ├── purchase/     # Purchase orders
│   └── return/       # Returns processing
├── claimreturn/      # Claims and old parts
│   ├── claim/        # Warranty claims (VRT, CCC policies)
│   └── oldpart/      # Old parts returns and destruction
└── datacenter/       # Vehicle profiles and service history
```

### HTTP Layer
- **Axios Config**: `src/axios/index.js`
  - Bearer token authentication via `store.state.user.token`
  - Custom headers: `X-CROSS-NODE-ID`, `Accepte`
  - Response decryption for sensitive endpoints
  - Error handling with Element UI messages

### State Management (Vuex)
Store modules in `src/store/`:
- `user` - Authentication and permissions
- `menu` - Navigation menu data
- `businessData` - Shared business data
- `pageSource` - Page source tracking
- `enum` - Enumerations/dropdowns

### Router Configuration
- **Base Path**: `/service` (configurable via `VUE_APP_ROUTER_BASE`)
- **Mode**: History mode
- **Auth Check**: Route guard validates tokens and permissions in `beforeEach`
- **404 Handling**: Disabled in Qiankun mode to prevent routing conflicts

## Environment Configuration

Environment files define API endpoints and base paths:
- `.env` - Router base path (`/service`)
- `.env.local` - Local development (localhost:8888)
- `.env.development` - SIT environment
- `.env.sit` / `.env.uat` - Environment-specific configs
- `.env.production` - Production settings

Key variables:
```
VUE_APP_ROUTER_BASE=/service
VUE_APP_WORK_ORDER_URL=<backend-api-url>
VUE_APP_USERCENTER=<user-center-url>
VUE_APP_LEAPX_URL=<leapx-portal-url>
```

## Build Configuration

### Dev Server
- Port: 7779
- Proxy: `/gaode` → Gaode Maps API (`https://tsapi.amap.com/`)
- Requires `--openssl-legacy-provider` flag for Node.js compatibility
- Memory increased to 8GB

### Production Build
- UMD format for micro-frontend compatibility
- CDN externals for Vue, Vuex, Vue Router, Axios
- Moment.js locale optimization (keeps `zh-cn` only)
- Console statements removed in production
- Source maps disabled

### Webpack Aliases
```
@ → src/
element-ui → @leapmotor/element-ui
```

## Key Dependencies

- **@leapmotor/element-ui** - Custom Element UI fork
- **@leapmotor/design** - Internal design system
- **vxe-table / vxe-pc-ui** - Advanced table components
- **crypto-js** - Data encryption
- **mustache** - Code generation templates
- **qrcode.vue** - QR code generation
- **vue-print-nb** - Print functionality

## Code Quality

- **ESLint**: Standard config with Vue plugin
- **Husky**: Pre-commit hooks with lint-staged
- **Lint-staged**: Runs ESLint on staged `.{js,vue}` files

## Integration Points

### External APIs
- User Center authentication
- Work order system integration
- Gaode Maps for location services
- SAP integration for warehouse operations

### SSO
Single sign-on support with encrypted credentials for external systems.

## Common Patterns

### API Calls
```javascript
import { someMethod } from '@/api/module';

someMethod(params).then(res => {
  // Handle response
}).catch(err => {
  // Handle error (Element UI message shown automatically)
});
```

### Route Meta Usage
```javascript
// Check if page should be cached
this.$route.meta.keepAlive

// Check if auth required
this.$route.meta.requiresAuth
```

### Store Access
```javascript
// User info
this.$store.state.user.userInfo

// Authentication token
this.$store.state.user.token
```

## Important Notes

- The app uses `window.__POWERED_BY_QIANKUN__` to detect micro-frontend mode
- Routes in Qiankun mode omit the catch-all 404 redirect
- Response decryption is applied to specific API endpoints (e.g., login)
- The layout component shows/hides navigation based on deployment mode
- Watermark component displays user info across all pages in standalone mode
