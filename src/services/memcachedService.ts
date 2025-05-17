
import { MemcachedKey, MemcachedServerConfig, MemcachedStats, OperationResult } from "@/types";

// Mock data for demonstration purposes
// In a real application, this would make API calls to a Rust backend
const mockConfig = {
  host: "localhost",
  port: 11211,
  name: "Local Memcached",
  id: "local-1"
};

const mockStats: MemcachedStats = {
  pid: "12345",
  uptime: "86400",
  time: "1621234567",
  version: "1.6.9",
  curr_connections: "10",
  total_connections: "1000",
  curr_items: "1234",
  total_items: "5678",
  bytes: "1000000",
  limit_maxbytes: "67108864",
  get_hits: "10000",
  get_misses: "1000",
  evictions: "100",
  bytes_read: "2000000",
  bytes_written: "1500000",
  cmd_get: "11000", 
  cmd_set: "5678",
  rusage_user: "1.5",
  rusage_system: "1.0"
};

const mockKeys: MemcachedKey[] = [
  {
    key: "user:1001",
    value: JSON.stringify({ id: 1001, name: "John Doe", email: "john@example.com" }),
    size: 76,
    flags: 0,
    expiry: Math.floor(Date.now() / 1000) + 3600,
    cas: "123456789",
    dataType: "json"
  },
  {
    key: "session:abcd1234",
    value: "eyJzZXNzaW9uRGF0YSI6InNvbWUgZGF0YSBoZXJlIn0=",
    size: 42,
    flags: 0,
    expiry: Math.floor(Date.now() / 1000) + 1800,
    cas: "987654321",
    dataType: "string"
  },
  {
    key: "product:5001",
    value: JSON.stringify({ id: 5001, name: "Laptop", price: 999.99 }),
    size: 52,
    flags: 0,
    expiry: Math.floor(Date.now() / 1000) + 86400,
    cas: "456789123",
    dataType: "json"
  },
  {
    key: "counter:visits",
    value: "12345",
    size: 5,
    flags: 0,
    expiry: 0,
    cas: "567891234",
    dataType: "number"
  },
  {
    key: "settings:theme",
    value: "dark",
    size: 4,
    flags: 0,
    expiry: 0,
    cas: "678912345",
    dataType: "string"
  }
];

for (let i = 0; i < 20; i++) {
  mockKeys.push({
    key: `cache:item:${i + 10}`,
    value: JSON.stringify({ data: `Item data ${i}`, timestamp: Date.now() }),
    size: 40 + i,
    flags: 0,
    expiry: i % 3 === 0 ? Math.floor(Date.now() / 1000) - 100 : Math.floor(Date.now() / 1000) + 3600,
    cas: `cas${Date.now() + i}`,
    dataType: i % 2 === 0 ? "json" : "string"
  });
}

export async function getServerConfig(): Promise<MemcachedServerConfig> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockConfig), 300);
  });
}

export async function getServerStats(): Promise<MemcachedStats> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockStats), 500);
  });
}

export async function getAllKeys(): Promise<MemcachedKey[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve([...mockKeys]), 400);
  });
}

export async function getKey(key: string): Promise<MemcachedKey | null> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const found = mockKeys.find(k => k.key === key);
      resolve(found || null);
    }, 200);
  });
}

export async function setKey(key: MemcachedKey): Promise<OperationResult> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = mockKeys.findIndex(k => k.key === key.key);
      if (index >= 0) {
        mockKeys[index] = { ...key };
      } else {
        mockKeys.push({ ...key });
      }
      resolve({ success: true, message: `Key ${key.key} saved successfully` });
    }, 300);
  });
}

export async function deleteKey(key: string): Promise<OperationResult> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = mockKeys.findIndex(k => k.key === key);
      if (index >= 0) {
        mockKeys.splice(index, 1);
        resolve({ success: true, message: `Key ${key} deleted successfully` });
      } else {
        resolve({ success: false, message: `Key ${key} not found` });
      }
    }, 300);
  });
}

export async function flushAll(): Promise<OperationResult> {
  return new Promise((resolve) => {
    setTimeout(() => {
      mockKeys.length = 0;
      resolve({ success: true, message: "All keys flushed successfully" });
    }, 500);
  });
}

export async function exportKeys(): Promise<string> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const exportData = {
        version: 1,
        timestamp: new Date().toISOString(),
        server: `${mockConfig.host}:${mockConfig.port}`,
        keys: mockKeys
      };
      
      resolve(JSON.stringify(exportData, null, 2));
    }, 500);
  });
}

export async function importKeys(jsonData: string): Promise<OperationResult> {
  return new Promise((resolve) => {
    setTimeout(() => {
      try {
        const data = JSON.parse(jsonData);
        
        if (!data.keys || !Array.isArray(data.keys)) {
          throw new Error("Invalid import format");
        }
        
        // Either merge or replace existing keys
        data.keys.forEach((key: MemcachedKey) => {
          const index = mockKeys.findIndex(k => k.key === key.key);
          if (index >= 0) {
            mockKeys[index] = key;
          } else {
            mockKeys.push(key);
          }
        });
        
        resolve({ 
          success: true, 
          message: `Successfully imported ${data.keys.length} keys` 
        });
      } catch (error) {
        resolve({ 
          success: false, 
          message: `Import failed: ${error instanceof Error ? error.message : 'Unknown error'}` 
        });
      }
    }, 600);
  });
}

export function detectDataType(value: string): "string" | "number" | "json" | "binary" {
  if (!isNaN(Number(value))) {
    return "number";
  }
  
  try {
    JSON.parse(value);
    return "json";
  } catch (e) {
    // Check if it might be base64 encoded binary data
    const base64Regex = /^[A-Za-z0-9+/=]+$/;
    if (base64Regex.test(value)) {
      return "binary";
    }
    return "string";
  }
}
