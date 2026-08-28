# Bun Workspaces → Turborepo Migration

## Changes Made

### 1. Root package.json
- Removed `workspaces` field (bun-specific)
- Added turbo dev dependency: `"turbo": "^2.1.3"`
- Added turbo scripts:
  - `turbo run build`
  - `turbo run dev --parallel`
  - `turbo run test`
  - `turbo run lint`
  - `turbo run lint:fix`
  - `turbo run format`
  - `turbo run format:check`

### 2. New turbo.json
Created root `turbo.json` with:
- Task definitions for all npm scripts
- Build outputs caching (dist/** for build task)
- Test output caching (coverage/**)
- Task dependencies (test and build depend on ^build)
- Global dependencies (tsconfig.json, .env files)

### 3. Workspace Structure
- Root workspaces removed from package.json
- Nested workspaces removed from `packages/webext-message/package.json`
- Flat monorepo structure: root → packages/* → examples/*
- All packages auto-discovered by turbo.json presence

### 4. Package Dependencies
- No changes needed to `workspace:*` protocol in package.json files
- Works identically with both bun and turbo

### 5. Configuration Files
- Added `.npmrc` with `legacy-peer-deps=true`
- Updated `.gitignore` to include bun.lock/bun.lockb

## Setup Instructions

1. Remove bun-specific lock files:
   ```bash
   rm bun.lock bun.lockb
   ```

2. Install dependencies with npm/yarn/pnpm:
   ```bash
   npm install
   # or
   pnpm install
   # or
   yarn install
   ```

3. Run commands:
   ```bash
   npm run build      # Builds all packages
   npm run dev        # Runs all dev servers in parallel
   npm run test       # Tests all packages
   npm run lint       # Lints all packages
   ```

## Key Differences from Bun Workspaces

| Feature | Bun | Turbo |
|---------|-----|-------|
| Config | package.json | turbo.json + package.json |
| Task Running | Implicit | Explicit with turbo run |
| Caching | No | Yes (outputs cached) |
| Parallel | Default | Configurable (--parallel flag) |
| CI/CD | Manual | Built-in task graph |

## Turborepo Benefits

1. **Task Graph**: Automatically optimizes build order based on dependencies
2. **Caching**: Skips unchanged packages in CI/CD
3. **Parallel Execution**: Runs independent tasks simultaneously
4. **Better Scaling**: Designed for large monorepos
5. **Vercel Integration**: Works seamlessly with Vercel deployments

## Reverting to Bun (if needed)

1. Restore workspaces field in root package.json
2. Restore workspaces in packages/webext-message/package.json
3. Remove turbo.json
4. Run `bun install` to generate bun.lock
