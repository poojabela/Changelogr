import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../components/ui/alertDialog";
import { Form, useLoaderData } from "@remix-run/react";
import { type ActionArgs, type LoaderArgs } from "@remix-run/node";
import { CreateTags, DeleteTag, FindUserTags } from "~/services/tags.server";
import { authenticator } from "~/services/auth.server";
import { Trash2 } from "lucide-react";

export const loader = async ({ request }: LoaderArgs) => {
  const session = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });

  const tags = await FindUserTags({ userId: session.id as string });

  return { tags };
};

export const action = async ({ request }: ActionArgs) => {
  const session = await authenticator.isAuthenticated(request);

  const form = await request.formData();
  const tag = form.get("tag") as string;
  const action = form.get("action") as string;
  const id = form.get("tag_id") as string;

  if (action === "create") {
    await CreateTags({ name: tag, userId: session?.id as string });
  } else {
    await DeleteTag({ id });
  }

  return null;
};

const DeleteTagsModal = ({ id }: { id: string }) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Trash2 className="w-4 h-4 strke-1" />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you absolutely sure to delete this tag?
          </AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Form method="post">
            <input type="text" hidden name="tag_id" value={id} />
            <AlertDialogAction name={"action"} value={"delete"} type="submit">
              Delete
            </AlertDialogAction>
          </Form>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

const Tags = () => {
  const loaderData = useLoaderData();
  const { tags } = loaderData;

  return (
    <div className="">
      <div className="">
        {tags.map((tag: any) => (
          <div
            className="w-full hover:bg-slate-100 border-b border-slate-300"
            key={tag.id}
          >
            <div className="max-w-7xl mx-auto flex justify-between items-center px-2 py-1">
              <p className="text-sm font-medium">{tag.name}</p>
              <DeleteTagsModal id={tag.id} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tags;
