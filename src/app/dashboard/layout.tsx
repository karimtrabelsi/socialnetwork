import { ModeToggle } from "@/components/theme-toggle";
import { MainNav } from "./components/main-nav";
import TeamSwitcher from "./components/team-switcher";
import { UserNav } from "./components/user-nav";

export default function DashboardLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
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
              <UserNav />
            </div>
          </div>
        </div>
      </div>

      {children}
    </section>
  );
}
