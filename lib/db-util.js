import { MongoClient } from 'mongodb';

export async function connectDatabase() {
  const username = process.env.MONGO_DB_USERNAME;
  const password = process.env.MONGO_DB_PASSWORD;
  const cluster = process.env.MONGO_DB_CLUSTERNAME;
  const database = process.env.MONGO_DB_DATABASE;

  const connectionString = `mongodb+srv://${username}:${password}@${cluster}.t1jddre.mongodb.net/${database}?retryWrites=true&w=majority`;
  return await MongoClient.connect(connectionString);
}

export async function checkExistingUserByEmail(db, collection, email) {
  const usersCollection = await db.collection(collection);

  return await usersCollection.findOne({ email: email });
}

export async function insertDocument(db, collection, document) {
  return await db.collection(collection).insertOne(document);
}
