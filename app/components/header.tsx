import { Form, Link, useLocation, useNavigate } from "@remix-run/react";
import { Button, buttonVariants } from "./ui/button";
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
} from "./ui/alertDialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { ArrowLeft, Menu } from "lucide-react";
import { useSidebar } from "~/context/sidebarContext";
import { Input } from "./ui/input";
import { useGlobalSubmittingState } from "remix-utils";
import { useEffect, useRef } from "react";

interface HeaderProps {
  post?: string;
  user?: string;
}

const CreateTagsModal = () => {
  const isBusy = useGlobalSubmittingState().includes("submitting");
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!isBusy) {
      formRef.current?.reset();
    }
  }, [isBusy]);

  return (
    <Dialog>
      <DialogTrigger>
        <Button size={"sm"}>Create Tags</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Tag</DialogTitle>
        </DialogHeader>
        <Form method="post" action="/dashboard/tags" ref={formRef}>
          <Input type="text" name="tag" placeholder="Write tag name" />
          <Button
            type="submit"
            className="mt-4"
            name="action"
            value={"create"}
            disabled={isBusy}
          >
            Create
          </Button>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

function DashboardHeader({ post }: { post: string }) {
  const navigate = useNavigate();
  const { toggleSidebar } = useSidebar();
  const location = useLocation();

  return (
    <div className="flex justify-between items-center w-full max-w-7xl mx-auto px-2">
      <div className="flex gap-2 items-center">
        <Button onClick={toggleSidebar} size={"sm"} variant={"secondary"}>
          <Menu className="h-4 w-4 stroke-1" />
        </Button>
        <p className="capitalize text-sm font-semibold">
          {location.pathname === "/dashboard/tags" ? "Tags" : post}
        </p>
      </div>
      {location.pathname === "/dashboard/tags" ? (
        <CreateTagsModal />
      ) : (
        <Button size={"sm"} onClick={() => navigate("/post")}>
          New Post
        </Button>
      )}
    </div>
  );
}

const CancleUpdateDilaog = () => {
  const navigate = useNavigate();

  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <Button variant={"outline"} size={"sm"}>
          <ArrowLeft className="stroke-1" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you absolutely sure to remove the changes?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => navigate("/dashboard")}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

function BackHeader() {
  return (
    <div className="w-[min(1000px,_100%)] mx-auto flex justify-between">
      <CancleUpdateDilaog />
    </div>
  );
}

function UserHeader({ name }: { name: string }) {
  return (
    <div className="flex justify-between items-center max-w-7xl mx-auto">
      <div>
        <h4 className="font-semibold">{name}</h4>
      </div>
      <Link to={"/dashboard"} className={buttonVariants({ size: "sm" })}>
        {name ? "Dashboard" : "Start now"}
      </Link>
    </div>
  );
}

const Header = ({ post, user }: HeaderProps) => {
  const location = useLocation();

  return (
    <header className="px-2 py-1 border-b border-slate-300 sticky top-0 bg-white/20 z-[1] backdrop-blur">
      {location.pathname.includes("/dashboard") && (
        <DashboardHeader post={post as string} />
      )}
      {(location.pathname.includes("/edit") ||
        location.pathname.includes("/post")) && <BackHeader />}
      {(location.pathname === `/${user}` ||
        location.pathname.includes("/blog")) && (
        <UserHeader name={user as string} />
      )}
    </header>
  );
};

export default Header;
