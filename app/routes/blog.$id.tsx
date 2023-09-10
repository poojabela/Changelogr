import { type LoaderArgs } from "@remix-run/node";
import { ChevronLeft } from "lucide-react";
import { Link, useLoaderData } from "@remix-run/react";
import { findUniqueBlog } from "~/services/post.server";
import { uniqueUser } from "~/services/user.server";
import Header from "~/components/header";

export const loader = async ({ params }: LoaderArgs) => {
  const { id } = params;

  if (id) {
    const blog = await findUniqueBlog({ id });
    const user = await uniqueUser({ id: blog?.userId as string });
    return {
      blog,
      user,
    };
  }
  return null;
};

const BlodDetail = () => {
  const loaderData = useLoaderData();
  const { contentHTML, title, createdAt, tags } = loaderData.blog;
  const { name } = loaderData.user;
  const stc = require("string-to-color");

  return (
    <>
      <Header user={name} />
      <div className="p-4">
        <Link
          to={`/${name}`}
          className="flex gap-2 text-slate-500 hover:text-black"
        >
          <ChevronLeft className="w-5 h-5" />

          <h4 className="text-sm font-semibold ">Go Back</h4>
        </Link>
        <div className="w-[min(700px,_100%)] mx-auto my-10">
          <h5 className="text-xs font-semibold mb-3">
            {new Date(createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </h5>
          <h4 className="font-bold text-2xl mb-3">{title}</h4>
          <div className="mb-4 flex flex-row items-stretch gap-2  text-white font-semibold">
            {tags.map((tag: any) => (
              <div
                className={`py-1 px-2 rounded-full text-sm`}
                key={tag.id}
                style={{
                  backgroundColor: stc(tag.name),
                }}
              >
                <p>{tag.name}</p>
              </div>
            ))}
          </div>
          <div
            className="prose prose-sm prose-neutral"
            dangerouslySetInnerHTML={{
              __html: contentHTML,
            }}
          ></div>
        </div>
      </div>
    </>
  );
};

export default BlodDetail;
