import { MongoClient } from 'mongodb';
import { getHashPassword } from './auth';

export async function connectDatabase() {
  const username = process.env.MONGO_DB_USERNAME;
  const password = process.env.MONGO_DB_PASSWORD;
  const cluster = process.env.MONGO_DB_CLUSTERNAME;
  const database = process.env.MONGO_DB_DATABASE;

  const connectionString = `mongodb+srv://${username}:${password}@${cluster}.t1jddre.mongodb.net/${database}?retryWrites=true&w=majority`;
  return await MongoClient.connect(connectionString);
}

export async function findUserByEmail(db, collection, email) {
  const usersCollection = await db.collection(collection);

  return await usersCollection.findOne({ email: email });
}

export async function insertDocument(db, collection, document) {
  return await db.collection(collection).insertOne(document);
}

export async function updateUserPassword(db, collection, email, newPassword) {
  const usersCollection = await db.collection(collection);
  const hashedPassword = await getHashPassword(newPassword);

  return await usersCollection.updateOne(
    { email, email },
    { $set: { password: hashedPassword } }
  );
}
