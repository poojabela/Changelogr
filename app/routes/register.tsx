import { redirect, type LoaderArgs, type ActionArgs } from "@remix-run/node";
import { authenticator } from "~/services/auth.server";
import { createUserName, uniqueUser } from "~/services/user.server";
import { Button } from "~/components/ui/button";
import { Form, useActionData } from "@remix-run/react";
import { useGlobalSubmittingState } from "remix-utils";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";

export const loader = async ({ request }: LoaderArgs) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });

  const nameExist = await uniqueUser({ id: user.id });

  //@ts-ignore
  if (nameExist.name) return redirect(`/dashboard`);

  return {
    user,
  };
};

export const action = async ({ request }: ActionArgs) => {
  const user = await authenticator.isAuthenticated(request);
  const form = await request.formData();
  const name = form.get("name") as string;

  if (user?.email && name) {
    try {
      return await createUserName({ email: user.email, name });
    } catch (e: any) {
      return {
        error: e.message as string,
      };
    }
  }

  return null;
};

const Dashboard = () => {
  const submitting = useGlobalSubmittingState().includes("submitting");
  const actionData = useActionData<typeof action>();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (actionData && "error" in actionData) {
      setError(actionData.error);
    }
  }, [actionData]);

  return (
    <div className="flex flex-col gap-4 justify-center items-center w-full max-w-screen h-[60vh]">
      <div className="">
        <h1 className="text-center font-semibold text-xl">
          Write a unique name for your account
        </h1>
      </div>
      <Form method="post">
        <div className="max-w-lg w-full h-16 flex items-center justify-between bg-white px-3 rounded-lg border border-gray-300 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 transition-all">
          <div className="flex items-center">
            <label htmlFor="name">pooja.io/</label>
            <input
              type="text"
              name="name"
              placeholder="name"
              className="outline-none placeholder:text-muted-foreground"
            />
          </div>
          <Button type="submit" disabled={submitting}>
            <ArrowRight />
          </Button>
        </div>
      </Form>
      {error && <p className="text-sm text-red-500 font-medium">{error}</p>}
    </div>
  );
};

export default Dashboard;
