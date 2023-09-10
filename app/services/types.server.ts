export interface Mail {
  to: string;
  magicLink?: string;
  code: string;
}

export interface UserEmail {
  email: string;
}

export interface User {
  name: string;
  email: string;
}

export interface Post {
  title: string;
  content: string;
  contentHTML: string;
  contentText: string;
  userId: string;
  isPublished: boolean;
  tags?: string[];
}

export interface FindProps {
  userId: string;
}

export interface FindUniqueBlogProps {
  id: string;
}
