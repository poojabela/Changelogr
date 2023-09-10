import { useState } from "react";
import { Button } from "~/components/ui/button";
import { redirect, type ActionArgs, type LoaderArgs } from "@remix-run/node";
import { authenticator } from "~/services/auth.server";
import { createPost } from "~/services/post.server";
import { Form, useLoaderData } from "@remix-run/react";
import { useGlobalSubmittingState } from "remix-utils";
import Header from "~/components/header";
import { FindUserTags } from "~/services/tags.server";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "../components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../components/ui/popover";

import { Editor } from "novel";
import { cn } from "~/lib/utils";
import { CheckIcon, ChevronsUpDown } from "lucide-react";

export const loader = async ({ request }: LoaderArgs) => {
  const session = await authenticator.isAuthenticated(request, {
    failureRedirect: "/",
  });

  const tags = await FindUserTags({ userId: session.id });

  return { tags };
};

export const action = async ({ request }: ActionArgs) => {
  const session = await authenticator.isAuthenticated(request);
  const form = await request.formData();
  const title = form.get("title") as string;
  const content = form.get("content") as string;
  const contentHTML = form.get("contentHTML") as string;
  const contentText = form.get("contentText") as string;
  const tags = form.getAll("tags") as string[];

  const submit = form.get("submit") as string;
  let created: any;

  if (submit === "publish") {
    created = await createPost({
      content,
      contentHTML,
      contentText,
      title,
      userId: session?.id as string,
      isPublished: true,
      tags,
    });
  } else {
    created = await createPost({
      content,
      contentHTML,
      contentText,
      title,
      userId: session?.id as string,
      isPublished: false,
      tags,
    });
  }

  if (created) {
    return redirect(`/dashboard`);
  }

  return null;
};

function TagCombobox({
  setValues,
  values,
}: {
  setValues: (values: string[]) => void;
  values: string[];
}) {
  const [open, setOpen] = useState(false);
  const { tags } = useLoaderData();

  const toggleValue = (currentValue: string) => {
    if (values.includes(currentValue)) {
      setValues(values.filter((value) => value !== currentValue));
    } else {
      setValues([...values, currentValue]);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          Select tags...
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search framework..." className="h-9" />
          <CommandEmpty>No framework found.</CommandEmpty>
          <CommandGroup>
            {tags.map((tag: any) => (
              <CommandItem
                key={tag.id}
                value={tag.id}
                onSelect={(currentValue: string) => toggleValue(currentValue)}
              >
                {tag.name}
                <CheckIcon
                  className={cn(
                    "ml-auto h-4 w-4",
                    values.includes(tag.id) ? "opacity-100" : "opacity-0",
                  )}
                />
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

const Post = () => {
  const isBusy = useGlobalSubmittingState().includes("submitting");
  const [content, setContent] = useState<any>(undefined);
  const [contentHTML, setContentHTML] = useState<string>("");
  const [contentText, setContentText] = useState<string>("");
  const [values, setValues] = useState<string[]>([]);

  return (
    <>
      <Header />
      <div className="w-[min(1000px,_100%)] mx-auto mt-6 p-4">
        <Form className="flex flex-col gap-6 justify-items-start" method="POST">
          <TagCombobox values={values} setValues={setValues} />
          {values.map((tagID) => (
            <input
              key={tagID}
              type="text"
              name="tags"
              value={tagID}
              readOnly
              hidden
            />
          ))}
          <input
            type="text"
            placeholder="Title"
            name="title"
            className="font-semibold text-5xl focus:outline-none"
            required
          />
          <Editor
            className="text-md static min-h-[200px]"
            defaultValue={{}}
            onUpdate={(editor) => {
              if (editor) {
                setContent(editor.getJSON());
                setContentHTML(editor.getHTML());
                setContentText(editor.getText());
              }
            }}
            storageKey={`${Date.now()}`}
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

          <div className="flex flex-col gap-4 justify-end md:flex-row">
            <Button
              variant={"default"}
              type="submit"
              disabled={isBusy}
              name="submit"
              value="publish"
            >
              Publish
            </Button>
            <Button
              variant={"secondary"}
              type="submit"
              name="submit"
              value="draft"
              disabled={isBusy}
            >
              Draft
            </Button>
          </div>
        </Form>
      </div>
    </>
  );
};

export default Post;
