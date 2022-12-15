import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';
import { verifyPassword } from '../../../lib/auth';
import { findUserByEmail, connectDatabase } from '../../../lib/db-util';

export default NextAuth({
  session: {
    jwt: true,
  },
  providers: [
    Providers.Credentials({
      async authorize(credentials) {
        const { email, password } = credentials;

        // connect to DB
        let client;
        try {
          client = await connectDatabase();
        } catch (_) {
          throw new Error('Connecting to the database failed!');
        }
        const db = client.db();

        // check if user exists
        const user = await findUserByEmail(db, 'users', email);
        if (!user) {
          client.close();
          throw new Error('Invalid credentials!');
        }

        // check user password
        const isValidUser = await verifyPassword(password, user.password);
        if (!isValidUser) {
          throw new Error('Invalid credentials!');
        }

        client.close();

        return {
          email: user.email,
        };
      },
    }),
  ],
});
