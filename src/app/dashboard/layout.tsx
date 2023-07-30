import { ModeToggle } from "@/components/theme-toggle";
import { MainNav } from "./components/main-nav";
import TeamSwitcher from "./components/team-switcher";
import { UserNav } from "./components/user-nav";
import { getAuthSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAuthSession();
  if (!session) {
    return redirect("/auth");
  }
  return (
    <section>
      {/* Include shared UI here e.g. a header or sidebar */}
      <div className="hidden flex-col md:flex">
        <div className="border-b border-b-red-400 dark:border-b-cyan-600">
          <div className="flex h-16 items-center px-4">
            <TeamSwitcher />
            <MainNav className="mx-6" />
            <div className="ml-auto flex items-center space-x-4">
              <ModeToggle />
              {session && <UserNav user={session?.user} />}
            </div>
          </div>
        </div>
      </div>
      {children}
    </section>
  );
}
