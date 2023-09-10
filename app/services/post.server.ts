import { db } from "~/utils/db.server";
import {
  type Post,
  type FindProps,
  type FindUniqueBlogProps,
} from "./types.server";

export async function createPost(post: Post) {
  const newPost = await db.blog.create({
    data: {
      title: post.title,
      content: post.content,
      contentHTML: post.contentHTML,
      contentText: post.contentText,
      userId: post.userId,
      isPublished: post.isPublished,
      tags: {
        connect: post.tags?.map((tagID) => ({ id: tagID })) ?? [],
      },
    },
  });

  return newPost;
}

export async function findBlogs(post: FindProps) {
  const blogs = await db.blog.findMany({
    where: {
      userId: post.userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return blogs;
}

export async function findUniqueBlog(b: FindUniqueBlogProps) {
  return await db.blog.findUnique({
    where: {
      id: b.id,
    },
    include: {
      tags: true,
    },
  });
}

export async function deleteBlog(b: FindUniqueBlogProps) {
  return db.blog.delete({
    where: {
      id: b.id,
    },
  });
}

async function getDraft({ id }: { id: string }) {
  const blogs = await db.blog.findMany({
    where: {
      userId: id,
      isPublished: false,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return blogs;
}

async function getPublished({ id }: { id: string }) {
  const blogs = await db.blog.findMany({
    where: {
      userId: id,
      isPublished: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return blogs;
}

export async function getBlogsByPublished({
  type,
  id,
}: {
  type?: string;
  id: string;
}) {
  if (type === "draft") return getDraft({ id });
  if (type === "published") return getPublished({ id });

  return findBlogs({ userId: id });
}

export async function UpdateBlog({
  id,
  content,
  contentHTML,
  contentText,
  title,
  isPublished,
}: {
  id: string;
  content: string;
  contentHTML: string;
  contentText: string;
  title: string;
  isPublished: boolean;
}) {
  const blog = db.blog.update({
    data: {
      content,
      contentHTML,
      contentText,
      title,
      isPublished,
    },
    where: {
      id,
    },
  });

  return blog;
}
