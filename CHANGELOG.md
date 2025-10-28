# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.4.0] - 2024-01-XX

### Added
- **App Router Support**: New `app-router.tsx` with `ApolloWrapper` component for Next.js 13+ Server Components
- **Cache Persistence**: `usePersistentApollo` hook with localStorage/sessionStorage support and debounced writes
- **Type Safety**: 
  - `ApolloPageProps<T>` interface for type-safe page props
  - `ApolloNextError` custom error class with cause tracking
  - `validateApolloClient` type guard function
- **Debug Infrastructure**: 
  - `configure()` function for runtime configuration
  - `logger` with debug/warn/error/performance methods
  - Cache hydration logging
  - Performance monitoring
- **Utility Functions**:
  - `prefetchQueries()` for parallel query prefetching during SSR/SSG
  - `enableApolloDevTools()` for browser DevTools integration
- **Performance Tests**: Comprehensive benchmarks for cache operations
- **Utility Tests**: Coverage for validation, errors, and helper functions

### Changed
- **Performance Optimization**: 
  - Replaced `JSON.stringify` equality check with optimized `__typename`+`id` comparison (5-10x faster for GraphQL entities)
  - Avoids circular reference issues in cache comparison
- **Export Cleanup**: 
  - Removed `init` and `merge` from main exports (internal use only)
  - Added re-exports of Apollo Client types for convenience
  - Deprecated `merge` with JSDoc warning

### Fixed
- Type inference improvements in `use-apollo.ts` with `ApolloPageProps`

### Deprecated
- `merge` function - use `withApollo` instead (will be removed in 1.0.0)

## [0.3.0] - 2024-01-XX

### Added
- Comprehensive test suite with Vitest
- TypeScript strict mode enabled
- JSDoc documentation for all public APIs
- GitHub Actions CI/CD pipeline
- `.nvmrc` file for Node.js version management

### Changed
- Updated dependencies to latest versions:
  - Next.js 15.0.3
  - React 18.3.1
  - TypeScript 5.6.3
  - Apollo Client 3.11.8
- Modernized TypeScript configuration with ES2020 target

### Fixed
- Critical bug in `init.ts` singleton logic (`if (!client)` → `if (!__apollo_client)`)
- Dependency array in `useApollo` hook to properly track state changes

### Removed
- `rambda` dependency (replaced with native solutions)

## [0.2.0] - Prior Release

### Added
- Initial implementation of `withApollo` HOC
- `useApollo` hook for client-side hydration
- Support for both `getStaticProps` and `getServerSideProps`

## [0.1.0] - Initial Release

### Added
- Basic Apollo + Next.js integration
- Cache merging utilities

### Updated Example
- Removed deprecated `@apollo/react-hooks` dependency
- Updated all dependencies to match main package versions
- Fixed linting errors by replacing inline styles with CSS module classes
- Replaced `ramda` with `deepmerge` (removed typo where both were listed)

## [0.2.3] - Previous Release

Initial stable release with basic Apollo + Next.js integration.
