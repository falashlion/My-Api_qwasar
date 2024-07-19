// Import necessary modules
import redis from 'redis';
import { promisify } from 'util';

// Create Redis client
const redisClient = redis.createClient();

// Promisify Redis client methods
const scanAsync = promisify(redisClient.scan).bind(redisClient);
const delAsync = promisify(redisClient.del).bind(redisClient);

// Function to delete keys with a specified prefix
export default async function deleteKeysWithPrefix(prefix) {
  let cursor = '0';

  // Start scanning
  const scanKeys = async () => {
    try {
      const result = await scanAsync(cursor, 'MATCH', prefix + '*', 'COUNT', 100);
      const [newCursor, keys] = result;

      // Delete keys
      for (const key of keys) {
        await delAsync(key);
      }

      // If the new cursor is '0', we've finished scanning
      if (newCursor === '0') {
      } else {
        // Continue scanning
        cursor = newCursor;
        await scanKeys();
      }
    } catch (err) {
      console.error('Error deleting keys:', err);
      throw err;
    }
  };

  // Start the initial scan
  await scanKeys();
}
