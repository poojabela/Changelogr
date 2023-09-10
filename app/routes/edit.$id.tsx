import { type LoaderArgs, type ActionArgs, redirect } from "@remix-run/node";
import { UpdateBlog, findUniqueBlog } from "~/services/post.server";
import { Button } from "~/components/ui/button";
import { Form, useLoaderData } from "@remix-run/react";
import { useGlobalSubmittingState } from "remix-utils";
import Header from "~/components/header";
import { Editor } from "novel";
import { useState } from "react";

export const loader = async ({ params }: LoaderArgs) => {
  const { id } = params;

  if (id) {
    const blog = await findUniqueBlog({ id });
    return {
      blog,
    };
  }
  return null;
};

export const action = async ({ params, request }: ActionArgs) => {
  const id = params.id as string;
  const form = await request.formData();
  const content = form.get("content") as string;
  const contentHTML = form.get("contentHTML") as string;
  const contentText = form.get("contentText") as string;
  const title = form.get("title") as string;
  const type = form.get("submit") as string;
  let updated: any;

  if (type === "publish") {
    updated = await UpdateBlog({
      id,
      content,
      contentHTML,
      contentText,
      title,
      isPublished: true,
    });
  } else {
    updated = await UpdateBlog({
      id,
      content,
      contentHTML,
      contentText,
      title,
      isPublished: false,
    });
  }

  if (updated) {
    return redirect("/dashboard");
  }

  return null;
};

const Edit = () => {
  const isBusy = useGlobalSubmittingState().includes("submitting");
  const loaderData = useLoaderData();
  const blog = loaderData.blog;
  const [content, setContent] = useState<any>({});
  const [contentHTML, setContentHTML] = useState<string>("");
  const [contentText, setContentText] = useState<string>("");

  return (
    <div className="">
      <Header />
      <div className="w-[min(1000px,_100%)] mx-auto mt-6 p-4">
        <Form className="flex flex-col gap-6 justify-items-start" method="POST">
          <input
            type="text"
            placeholder="Title"
            name="title"
            defaultValue={blog.title}
            className=" placeholder:text-slate-400 font-semibold text-5xl focus:outline-none"
            required
          />

          <Editor
            className="text-md static min-h-[200px]"
            defaultValue={content}
            onUpdate={(editor) => {
              if (editor) {
                setContent(editor.getJSON());
                setContentHTML(editor.getHTML());
                setContentText(editor.getText());
              }
            }}
          />

          <input
            type="text"
            readOnly
            hidden
            value={JSON.stringify(content)}
            name="content"
          />
          <input
            type="text"
            readOnly
            hidden
            value={contentHTML}
            name="contentHTML"
          />
          <input
            type="text"
            readOnly
            hidden
            value={contentText}
            name="contentText"
          />

          <div className="flex gap-4 justify-end">
            <Button
              type="submit"
              disabled={isBusy}
              name="submit"
              value="publish"
            >
              Update and publish
            </Button>
            <Button
              variant={"secondary"}
              type="submit"
              name="submit"
              value="draft"
              disabled={isBusy}
            >
              Save as a draft
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Edit;
