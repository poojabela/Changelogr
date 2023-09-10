import { Form, Link, useLoaderData } from "@remix-run/react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../components/ui/popover";
import { MoreVertical, FileEdit, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../components/ui/alertDialog";
import { type ActionArgs, type LoaderArgs } from "@remix-run/node";
import { authenticator } from "~/services/auth.server";
import { deleteBlog, getBlogsByPublished } from "~/services/post.server";
import { uniqueUser } from "~/services/user.server";

export const loader = async ({ request }: LoaderArgs) => {
  const session = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });

  const user = await uniqueUser({ id: session?.id as string });

  const url = new URL(request.url);
  const type = url.searchParams.get("post") as string;

  const blogs = await getBlogsByPublished({ type, id: user?.id as string });
  return { blogs };
};

export const action = async ({ request }: ActionArgs) => {
  const form = await request.formData();
  const blogId = form.get("blog_id") as string;

  await deleteBlog({ id: blogId });

  return null;
};

const DeleteDialog = ({ id }: { id: string }) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger className="w-full focus:outline-none">
        <div className="flex gap-1 items-center p-1.5 text-sm hover:bg-red-600/20 hover:text-red-600 rounded-md">
          <Trash2 className="stroke-1 h-4 w-5" />
          <p>Delete</p>
        </div>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you absolutely sure to delete this blog?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete this
            blog.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Form method="post" action="/dashboard?index">
            <AlertDialogAction type="submit" name="blog_id" value={id}>
              Continue
            </AlertDialogAction>
          </Form>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

function MorePopover({ id }: { id: string }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <MoreVertical className="stroke-1 h-4" />
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="">
          <Link to={`/edit/${id}`}>
            <div className="flex gap-1 items-center p-1.5 text-sm hover:bg-slate-100 rounded-md">
              <FileEdit className="stroke-1 h-4 w-5" />
              <p>Edit</p>
            </div>
          </Link>
          <DeleteDialog id={id} />
        </div>
      </PopoverContent>
    </Popover>
  );
}

const DashboardIndex = () => {
  const loaderData = useLoaderData();
  const blogs = loaderData.blogs;

  return (
    <div className="w-[min(800px,_100%)] mx-auto my-10 px-4 ">
      {blogs.map((blog: any) => (
        <div className="relative" key={blog.id}>
          <Link to={`/edit/${blog.id}`}>
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
            </div>
          </Link>
          <div className="absolute right-0 top-0">
            <MorePopover id={blog.id} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardIndex;
