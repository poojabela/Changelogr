import { type LoaderArgs, type ActionArgs } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import { findBlogs, deleteBlog } from "~/services/post.server";
import { db } from "~/utils/db.server";
import { authenticator } from "~/services/auth.server";
import Header from "~/components/header";

export const loader = async ({ request, params }: LoaderArgs) => {
  const session = await authenticator.isAuthenticated(request);

  const user = await db.user.findUnique({
    where: {
      name: params.id,
    },
  });

  if (!user) {
    throw new Response(null, {
      status: 404,
      statusText: "Not Found",
    });
  }

  const blogs = await findBlogs({ userId: user.id });

  return { blogs, user, session };
};

export const action = async ({ request }: ActionArgs) => {
  const form = await request.formData();
  const blogId = form.get("blog_id") as string;

  await deleteBlog({ id: blogId });

  return null;
};

const User = () => {
  const loaderData = useLoaderData();
  const blogs = loaderData.blogs;
  const user = loaderData.user;

  return (
    <>
      <Header user={user.name} />
      <div className="w-[min(700px,_100%)] mx-auto my-10 px-4 ">
        {blogs.map((blog: any) => (
          <div className="relative" key={blog.id}>
            <Link to={`/blog/${blog.id}`}>
              <div className="hover:bg-slate-100 p-2 rounded-lg duration-200 mb-2">
                <div className="flex justify-between">
                  <h5 className="text-xs font-semibold mb-1">
                    {new Date(blog.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </h5>
                </div>
                <h1 className="font-bold text-xl mb-2">{blog.title}</h1>
                {}
                <p className="opacity-50">{blog.contentText.slice(0, 200)}</p>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </>
  );
};

export default User;
