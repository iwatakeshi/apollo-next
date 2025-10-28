// Core functionality
export * from "./use-apollo";
export * from "./with-apollo";

// Types and utilities
export * from "./types";
export * from "./utils";
export * from "./config";
export { APOLLO_STATE_PROP_NAME } from "./constants";

// Optional: Persistent cache hook
export * from "./use-persistent-apollo";

// Legacy exports (deprecated - will be removed in future versions)
/** @deprecated Use withApollo instead. Will be removed in v1.0.0 */
export { merge } from "./merge";
