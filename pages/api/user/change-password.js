import { getSession } from 'next-auth/client';

import { verifyPassword } from '../../../lib/auth';
import {
  connectDatabase,
  findUserByEmail,
  updateUserPassword,
} from '../../../lib/db-util';

async function handler(req, res) {
  if (req.method !== 'PATCH') {
    res.status(400).json({ message: 'Bad request' });
    return;
  }

  // check for authenticated user
  const session = await getSession({ req: req });
  if (!session) {
    res.status(401).json({ message: 'Not authenticated!' });
    return;
  }

  const userEmail = session.user.email;
  const oldPassword = req.body.oldPassword;
  const newPassword = req.body.newPassword;

  // connect to DB
  let client;
  try {
    client = await connectDatabase();
  } catch (_) {
    throw new Error('Connecting to the database failed!');
  }
  const db = client.db();

  // check if user exists
  const user = await findUserByEmail(db, 'users', userEmail);
  if (!user) {
    res.status(404).json({ message: 'Invalid credentials!' });
    client.close();
    return;
  }

  // check user password
  const currentPassword = user.password;
  const passwordsAreEqual = await verifyPassword(oldPassword, currentPassword);

  if (!passwordsAreEqual) {
    res.status(422).json({ message: 'Invalid password!' });
    client.close();
    return;
  }

  // update user password
  await updateUserPassword(db, 'users', userEmail, newPassword);

  client.close();
  res.status(200).json({ message: 'Password updated!' });
}

export default handler;
