import { db } from "~/utils/db.server";
import { type User, type UserEmail } from "./types.server";

export async function createUserEmail(user: UserEmail) {
  const newUser = await db.user.create({
    data: {
      email: user.email,
    },
  });

  return newUser;
}

interface findUser {
  id: string;
}

export async function uniqueUser({ id }: findUser) {
  return await db.user.findUnique({
    where: {
      id,
    },
  });
}

export async function createUserName(user: User) {
  const existingUser = await db.user.findUnique({
    where: {
      name: user.name,
    },
  });

  if (existingUser) {
    throw new Error("Username is already taken.");
  }

  const addName = await db.user.update({
    where: {
      email: user.email,
    },
    data: {
      name: user.name,
    },
  });

  return addName;
}
