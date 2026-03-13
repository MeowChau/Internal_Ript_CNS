import { getStorage, setStorage, removeStorage } from "zmp-sdk";
import { STORAGE_KEYS } from "@/config";

export const StorageService = {
  // Get single value
  async get<T = string>(key: string): Promise<T | null> {
    try {
      const result = await getStorage({ keys: [key] });
      return result[key] || null;
    } catch (error) {
      console.error(`Storage get error for key ${key}:`, error);
      return null;
    }
  },

  // Get multiple values
  async getMultiple<T = Record<string, any>>(keys: string[]): Promise<T> {
    try {
      const result = await getStorage({ keys });
      return result as T;
    } catch (error) {
      console.error("Storage getMultiple error:", error);
      return {} as T;
    }
  },

  // Set single value
  async set(key: string, value: any): Promise<void> {
    try {
      await setStorage({ data: { [key]: value } });
    } catch (error) {
      console.error(`Storage set error for key ${key}:`, error);
      throw error;
    }
  },

  // Set multiple values
  async setMultiple(data: Record<string, any>): Promise<void> {
    try {
      await setStorage({ data });
    } catch (error) {
      console.error("Storage setMultiple error:", error);
      throw error;
    }
  },

  // Remove single value
  async remove(key: string): Promise<void> {
    try {
      await removeStorage({ keys: [key] });
    } catch (error) {
      console.error(`Storage remove error for key ${key}:`, error);
      throw error;
    }
  },

  // Remove multiple values
  async removeMultiple(keys: string[]): Promise<void> {
    try {
      await removeStorage({ keys });
    } catch (error) {
      console.error("Storage removeMultiple error:", error);
      throw error;
    }
  },

  // Clear all
  async clear(): Promise<void> {
    try {
      await removeStorage({ keys: Object.values(STORAGE_KEYS) });
    } catch (error) {
      console.error("Storage clear error:", error);
      throw error;
    }
  },
};
