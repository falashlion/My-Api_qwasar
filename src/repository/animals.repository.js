import deleteKeysWithPatern from"../utils/deleteKeysWithPatern.js";
import paginate from"../utils/pagination.js";
import db from"../models/connection.js";
import userModel from"../models/user.model.js";
import redis from "redis";

//creating redis client for caching
const redisClient = redis.createClient({ host: "localhost", port: 6379 });

class AnimalRepository {
  //cresting new Animal
  static async createAnimal(name, description, userId) {
    const user = await db.users.findByPk(userId);
    if (!user) return null;
    const animal = await db.animals.create({
      name,
      description,
      userId,
    });

    if (!animal) {
      return null;
    }
    return animal;
  }

  //finding Animal by id
  static async findAnimalById(id) {
    const redisKey = `AnimalData:${id}`;
    return new Promise((resolve, reject) => {
      //check if there was an error in redis
      redisClient.on("error", (error) => {
        console.log("Redis client error:", error);
        reject(error);
      });

      redisClient.get(redisKey, async (error, data) => {
        if (data) {
          resolve(JSON.parse(data));
        } else {
          const animal = await db.animals.findByPk(id);

          if (!animal) {
            resolve(null);
          }
          redisClient.setex(redisKey, 180, JSON.stringify(animal));
          resolve(animal);
        }
      });
    });
  }

  //updating Animal
  static async updateAnimal(id, options) {
    //checking if Animal exist first before updating
    const animal = await this.findAnimalById(id);
    if (!animal) {
      return "Animal Not found";
    }

    //updating Animal with the options
    await db.animals.update(options, {
      where: { id: animal.id },
    });

    //getting back the updated Animal to be sure it was updated
    const updatedAnimal = await this.findAnimalById(animal.id);

    return updatedAnimal;
  }

  //getting all Animals
  static async allAnimals(page, size) {
    //creating cache key with the page and size parameters to be unique
    const cacheKey = `AnimalData:${page}:${size}`;

    //getting the validated or appropriet page(offset) and size(limit)
    const pagination = paginate(page, size);
    const validatedSize = pagination.validatedSize;
    const offset = pagination.offset;

    return new Promise((resolve, reject) => {
      // Check if client connection has an error
      redisClient.on("error", (error) => {
        console.log("Redis client error:", error);
        reject(error);
      });

      redisClient.get(cacheKey, async (err, data) => {
        if (err) {
          console.error("Error fetching data from Redis:", err);
          reject(err);
        }

        // Check if the data is already cached
        if (data) {
          resolve(JSON.parse(data));
        } else {
          // Data not cached, fetch from the database
          try {
            const allAnimals = await db.animals.findAndCountAll({
              offset: offset,
              limit: validatedSize,
            });
            //check if no animal in the database
            if (!allAnimals) {
              resolve(null);
            }
            //add the number of pages for this pagination and the current page to the animals object
            allAnimals.numberOfPages = Math.ceil(
              allAnimals.count / validatedSize
            );
            allAnimals.currentPage = page;

            // Set or cache the data in Redis
            redisClient.setex(cacheKey, 180, JSON.stringify(allAnimals));

            resolve(allAnimals);
          } catch (error) {
            console.error("Error fetching data from the database:", error);
            reject(error);
          }
        }
      });
    });
  }

  //getting an animal by name
  static async getAnimalByName(name) {
    const redisKey = `AnimalData:${name}`;

    return new Promise((resolve, reject) => {
      //check if there was an error in redis
      redisClient.on("error", (error) => {
        console.log("Redis client error:", error);
        reject(error);
      });

      redisClient.get(redisKey, async (error, data) => {
        //checking if an error occurred in getting from redis
        if (error) {
          console.log("An error occured getting from redis cache:", error);
          reject(error);
        }
        //checking if data exist in cache
        if (data) {
          resolve(JSON.parse(data));
        } else {
          const animal = await db.animals.findOne({ where: { name: name } });

          //if no animal was found in database
          if (!animal) {
            resolve(null);
          }
          //set the data if found in the cache
          redisClient.setex(redisKey, 180, JSON.stringify(animal));
          resolve(animal);
        }
      });
    });
  }

  //deleting a Animal with id
  static async deleteAnimal(id) {
    try {
      const redisKey = `AnimalData:${id}`;
      const animal = await this.findAnimalById(id);
      if (!animal) {
        return null;
      }

      //getting all pojects
      const deletedNUm = await db.animals.destroy({
        where: {
          id: animal.id,
        },
      });
      if (!deletedNUm) {
        return null;
      }
      redisClient.on("error", (error) => {
        console.log("error when connecting to redis", error);
      });

      //when a value or row is deleted clear the cache with the prefix note not the entire cache
      //redisClient.del(redisKey);
      deleteKeysWithPatern("AnimalData")

      return deletedNUm;
    } catch (error) {
      console.log(error);
    }
  }
}

export default AnimalRepository;
