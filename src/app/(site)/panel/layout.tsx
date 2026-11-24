import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { getCurrentUser } from "@/lib/user-auth";
import { UserPanelSidebar } from "@/components/site/UserPanelSidebar";

export const instant = false;

export default async function UserPanelLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth/login?redirect=/panel");
  }

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col lg:flex-row gap-8 items-start text-right">
        <UserPanelSidebar user={user} />
        <main className="flex-1 w-full min-w-0">{children}</main>
      </div>
    </div>
  );
}
