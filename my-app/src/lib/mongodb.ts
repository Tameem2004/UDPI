import { MongoClient } from "mongodb";

const uri = "mongodb://localhost:27017"; // local MongoDB
const options = {};

const client = new MongoClient(uri, options);
const clientPromise = client.connect();

export default clientPromise;
