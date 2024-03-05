"use server";

import { auth, UserButton } from "@clerk/nextjs";
import { LogIn } from "lucide-react";
import Link from "next/link";

import Onboarding from "@/components/Onboarding";
import { Button } from "@/components/ui/button";

export default async function Home() {
  const { userId } = auth();
  const isAuth = !!userId;

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-row-reverse">
        <div className="m-2">
          <UserButton afterSignOutUrl="" />
        </div>
      </div>
      <div className="flex flex-row h-full w-full justify-center items-center">
        {isAuth ? (
          <Onboarding />
        ) : (
          <Link href="/sign-in">
            <Button>
              Sign In to get started
              <LogIn className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}
