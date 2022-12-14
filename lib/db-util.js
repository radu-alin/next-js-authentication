import { MongoClient } from 'mongodb';

export async function connectDatabase() {
  const username = process.env.MONGO_DB_USERNAME;
  const password = process.env.MONGO_DB_PASSWORD;
  const cluster = process.env.MONGO_DB_CLUSTERNAME;
  const database = process.env.MONGO_DB_DATABASE;

  const connectionString = `mongodb+srv://${username}:${password}@${cluster}.t1jddre.mongodb.net/${database}?retryWrites=true&w=majority`;
  const client = await MongoClient.connect(connectionString);

  return client;
}

export async function insertDocument(client, collection, document) {
  const db = client.db();

  const result = await db.collection(collection).insertOne(document);

  return result;
}
