import { type LoaderArgs } from "@remix-run/node";
import { authenticator } from "~/services/auth.server";
import { uniqueUser } from "~/services/user.server";
import Sidebar from "~/components/sidebar";
import { Outlet, useLoaderData, useSearchParams } from "@remix-run/react";
import Header from "~/components/header";

export const loader = async ({ request, params }: LoaderArgs) => {
  const session = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });
  const user = await uniqueUser({ id: session?.id as string });

  return { user };
};

const Dashboard = () => {
  const loaderData = useLoaderData();
  const userName = loaderData.user.name;
  const [searchParams] = useSearchParams();
  const post = searchParams.get("post") as string;

  return (
    <div className="max-w-screen w-full max-h-screen h-screen">
      <div className="flex h-full w-full">
        <Sidebar name={userName} />
        <div className="flex-1 overflow-auto">
          <Header post={post as string} />
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
