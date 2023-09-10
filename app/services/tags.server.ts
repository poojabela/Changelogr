import { db } from "~/utils/db.server";

export async function FindUserTags({ userId }: { userId: string }) {
  const tags = await db.tag.findMany({
    where: {
      userId,
    },
  });
  return tags;
}

export async function CreateTags({
  userId,
  name,
}: {
  userId: string;
  name: string;
}) {
  return await db.tag.create({
    data: {
      name,
      userId,
    },
  });
}

export async function DeleteTag({ id }: { id: string }) {
  return await db.tag.delete({
    where: {
      id,
    },
  });
}
