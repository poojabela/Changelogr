import { Form, useLoaderData } from "@remix-run/react";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { json, type ActionArgs, type LoaderArgs } from "@remix-run/node";
import { commitSession, getSession } from "~/services/session.server";
import { authenticator } from "~/services/auth.server";
import { useGlobalSubmittingState } from "remix-utils";

export async function loader({ request }: LoaderArgs) {
  const userSession = await authenticator.isAuthenticated(request, {
    successRedirect: "/register",
  });

  const session = await getSession(request.headers.get("Cookie"));
  const hasSentEmail = session.has("auth:otp");

  const email = session.get("auth:email") as string; // Temporary force casting to string.
  const error = session.get(authenticator.sessionErrorKey);

  return json(
    { user: userSession, hasSentEmail, email, error },
    {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    },
  );
}

export async function action({ request }: ActionArgs) {
  await authenticator.authenticate("OTP", request, {
    successRedirect: "/login",
    failureRedirect: "/login",
  });
}

const Login = () => {
  let { user, hasSentEmail, email } = useLoaderData<typeof loader>();
  const isBusy = useGlobalSubmittingState().includes("submitting");

  return (
    <div className="max-w-screen w-full h-[80vh] max-h-screen overflow-none flex flex-col justify-center items-center">
      {/* {error && (
        <>
          <strong className="text-center text-red-500">{error.message}</strong>
          <div className="my-3" />
        </>
      )} */}

      <div className="flex justify-around w-full items-center">
        <div className="w-[400px] hidden lg:block">
          <h1 className="text-2xl font-medium">
            Start managing your logs more effeciently
          </h1>
        </div>
        <div className="border border-slate-300 p-4 rounded w-full max-w-[320px]">
          <h4 className="text-center mb-4 text-xl font-medium">Login in</h4>
          {!user && !hasSentEmail && (
            <Form method="post" className="w-full">
              <Input
                type="email"
                name="email"
                placeholder="Email"
                className="mb-4"
              />
              <Button type="submit" className="w-full" disabled={isBusy}>
                Send Code
              </Button>
            </Form>
          )}

          {hasSentEmail && (
            <div className="flex flex-col items-center">
              <Form method="post" autoComplete="off" className="w-full">
                <Input
                  type="text"
                  name="code"
                  placeholder="code"
                  className="mb-5"
                />
                <Button type="submit" className="w-full" disabled={isBusy}>
                  <span>Continue</span>
                </Button>
              </Form>
              <div className="my-3" />
              <Form method="post" autoComplete="off">
                <input type="hidden" name="email" defaultValue={email} />
                <button
                  type="submit"
                  className="relative flex w-auto flex-row items-center justify-center rounded-xl
					    font-bold text-slate-300 transition hover:scale-105 active:scale-100 active:brightness-90"
                >
                  <span>Request new Code</span>
                </button>
              </Form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
