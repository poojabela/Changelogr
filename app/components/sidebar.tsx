import { Form, Link, useLocation, useSearchParams } from "@remix-run/react";
import { cx } from "class-variance-authority";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { useSidebar } from "~/context/sidebarContext";

interface sidebarProps {
  name: string;
}

function PopoverLogout({ name }: { name: string }) {
  return (
    <Popover>
      <PopoverTrigger>
        <div className="uppercase text-xs bg-blue-500/20 text-blue-500 rounded-full w-9 h-9 font-medium flex items-center justify-center">
          <p>{name.charAt(0)}</p>
        </div>
      </PopoverTrigger>
      <PopoverContent>
        <Form method="post" action="/logout">
          <button
            type="submit"
            className="text-sm rounded-md px-2 py-1 hover:bg-slate-100 w-full text-start"
          >
            Logout
          </button>
        </Form>
      </PopoverContent>
    </Popover>
  );
}

const Sidebar = ({ name }: sidebarProps) => {
  const [searchParams] = useSearchParams();
  const post = searchParams.get("post");
  const { isSidebarVisible, toggleSidebar } = useSidebar();
  const location = useLocation();

  return (
    <>
      <div
        className={cx(
          "z-[2] absolute inset-0 bg-white/20 backdrop-blur-sm",
          isSidebarVisible ? "md:hidden" : "hidden",
        )}
        onClick={toggleSidebar}
      ></div>
      <aside
        className={cx(
          "fixed z-[3] h-full w-[230px] max-w-[240px] md:relative md:z-0 md:shrink-0 border-r border-slate-300 bg-white",
          isSidebarVisible ? "static" : "hidden",
        )}
      >
        <div className="flex gap-2 items-center border-b border-slate-300 px-4 py-1">
          <PopoverLogout name={name} />
          <h4 className="">{name}</h4>
        </div>
        <div className="p-4 mt-2">
          <h5 className="mb-2 text-sm font-semibold text-slate-800">
            Changelogs
          </h5>
          <Form
            method="get"
            action="/dashboard"
            className="flex flex-col items-start gap-3 text-sm "
          >
            <button
              name="post"
              value={"all"}
              className={cx(
                "hover:bg-blue-400/20 hover:text-blue-500 w-full px-2 py-1 rounded text-start duration-200",
                (location.pathname === "/dashboard" && post === null) ||
                  post === "all"
                  ? "bg-blue-500/20 text-blue-500"
                  : "bg-transparent text-black",
              )}
            >
              All
            </button>
            <button
              name="post"
              value={"draft"}
              className={cx(
                "hover:bg-blue-400/20 hover:text-blue-500 w-full px-2 py-1 rounded text-start duration-200",
                post === "draft"
                  ? "bg-blue-500/20 text-blue-500"
                  : "bg-transparent text-black",
              )}
            >
              Draft
            </button>
            <button
              name="post"
              value={"published"}
              className={cx(
                "hover:bg-blue-400/20 hover:text-blue-500 w-full px-2 py-1 rounded text-start duration-200",
                post === "published"
                  ? "bg-blue-500/20 text-blue-500"
                  : "bg-transparent text-black",
              )}
            >
              Published
            </button>
          </Form>
        </div>
        <div className="p-4">
          <h5 className="mb-2 text-sm font-semibold text-slate-800">View</h5>
          <Link to={`/${name}`} className="text-sm w-full">
            <div className="hover:bg-blue-400/20 hover:text-blue-500 px-2 py-1 rounded duration-200">
              View Profile
            </div>
          </Link>
        </div>
        <div className="p-4">
          <h5 className="mb-2 text-sm font-semibold text-slate-800">Tags</h5>
          <Link to={`/dashboard/tags`} className="text-sm w-full">
            <div
              className={cx(
                "hover:bg-blue-400/20 hover:text-blue-500 w-full px-2 py-1 rounded text-start duration-200",
                location.pathname === "/dashboard/tags"
                  ? "bg-blue-500/20 text-blue-500"
                  : "bg-transparent text-black",
              )}
            >
              All Tags
            </div>
          </Link>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
