# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.3.0] - 2025-10-28

### Added
- Comprehensive JSDoc documentation for all exported functions and constants
- Test suite using Vitest with tests for `init`, `useApollo`, `withApollo`, and `merge`
- GitHub Actions CI/CD workflow for automated testing, linting, and npm publishing
- `.nvmrc` file specifying Node.js 20.18.0 for development consistency
- Vitest configuration with code coverage support

### Changed
- **BREAKING**: Updated peer dependencies to Next.js 15.x, React 18.3.x
- Updated all dependencies to latest stable versions:
  - Next.js: 13.4.2 → 15.0.3
  - React: 18.2.0 → 18.3.1
  - TypeScript: latest → 5.6.3
  - GraphQL Codegen: v3.x → v5.x
  - Parcel: 2.8.3 → 2.12.0
  - Prettier: latest → 3.3.3
- Removed `rambda` dependency in favor of native JavaScript functions
- Improved TypeScript configuration with modern ES2020 target and bundler module resolution
- Enhanced `useApollo` hook with proper dependency tracking (`[client, state]` instead of `[getState(props)]`)

### Fixed
- Critical bug in `init.ts` where Apollo client singleton was never set correctly
  - Changed `if (!client) return (__apollo_client = client);` to `if (!__apollo_client) __apollo_client = _client;`
- React hook dependency array in `useApollo` to properly track client and state changes
- Inline style linting errors in example pages by moving styles to CSS modules

### Updated Example
- Removed deprecated `@apollo/react-hooks` dependency
- Updated all dependencies to match main package versions
- Fixed linting errors by replacing inline styles with CSS module classes
- Replaced `ramda` with `deepmerge` (removed typo where both were listed)

## [0.2.3] - Previous Release

Initial stable release with basic Apollo + Next.js integration.
