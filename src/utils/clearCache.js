// Import necessary modules
import redis from 'redis';
import { promisify } from 'util';

// Create Redis client
const redisClient = redis.createClient();

// Promisify Redis client methods
const flushallAsync = promisify(redisClient.flushall).bind(redisClient);

// Function to clear cache
export default async function clearCache() {
  try {
    await flushallAsync();
    console.log('Cleared cache successfully');
  } catch (err) {
    console.error('Error clearing cache:', err);
    throw err; // Optionally rethrow the error to handle it elsewhere
  }
}
