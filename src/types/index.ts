
// Server types
export interface MemcachedServerConfig {
  host: string;
  port: number;
  name: string;
  id: string;
}

export interface MemcachedStats {
  pid: string;
  uptime: string;
  time: string;
  version: string;
  curr_connections: string;
  total_connections: string;
  curr_items: string;
  total_items: string;
  bytes: string;
  limit_maxbytes: string;
  get_hits: string;
  get_misses: string;
  evictions: string;
  bytes_read: string;
  bytes_written: string;
  cmd_get: string;
  cmd_set: string;
  [key: string]: string;
}

// Key types
export interface MemcachedKey {
  key: string;
  value: string;
  size: number;
  flags: number;
  expiry: number;
  cas: string;
  dataType: "string" | "number" | "json" | "binary";
}

export interface MemcachedKeyFilter {
  search: string;
  showExpired: boolean;
  dataType?: "string" | "number" | "json" | "binary";
  sortBy: "key" | "size" | "expiry";
  sortDirection: "asc" | "desc";
}

// Operation response types
export interface OperationResult {
  success: boolean;
  message: string;
}

export interface KeyExportData {
  version: number;
  timestamp: string;
  server: string;
  keys: MemcachedKey[];
}
