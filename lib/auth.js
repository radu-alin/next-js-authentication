import { hash, compare } from 'bcryptjs';

export async function getHashPassword(password1) {
  return await hash(password1, 12);
}

export async function verifyPassword(password, hashedPassword) {
  return await compare(password, hashedPassword);
}
