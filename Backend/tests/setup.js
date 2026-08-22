import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import {beforeAll, afterAll, afterEach} from "vitest"
let mongod;

beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    await mongoose.connect(mongod.getUri());
})


afterEach(async () => {
    // wipe all data between tests so one test's leftover data
    // can't silently affect the next test's assertions
    const collections = mongoose.connection.collections;
    for (const key in collections) {
        await collections[key].deleteMany({});
    }
});


afterAll(async () => {
    await mongoose.disconnect();
    await mongod.stop();
});