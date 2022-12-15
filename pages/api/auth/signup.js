import { getHashPassword } from '../../../lib/auth';
import { findUserByEmail, connectDatabase, insertDocument } from '../../../lib/db-util';

const checkIsValidData = (email, password) =>
  email && email.includes('@') && password && password.trim().length >= 7;

async function handler(req, res) {
  // check if request is of type "POST"
  if (req.method !== 'POST') {
    res.status(400).json({ message: 'Bad request' });
    return;
  }

  const data = req.body;
  const { email, password } = data;

  // check if the credentials are valid
  const isValidCredentials = checkIsValidData(email, password);
  if (!isValidCredentials) {
    res.status(422).json({ message: 'Invalid credentials.' });
    client.close();
    return;
  }

  // connect to DB
  let client;
  try {
    client = await connectDatabase();
  } catch (error) {
    res.status(500).json({ message: 'Connecting to the database failed!' });
    return;
  }
  const db = client.db();

  // check if user exists
  const existingUser = await findUserByEmail(db, 'users', email);
  if (existingUser) {
    res.status(422).json({ message: 'User already exists.' });
    client.close();
    return;
  }

  // create new user
  const hashedPassword = await getHashPassword(password);
  const credentials = { email, password: hashedPassword };
  await insertDocument(db, 'users', credentials);

  res.status(201).json({ message: 'User created!' });
  client.close();
}

export default handler;
