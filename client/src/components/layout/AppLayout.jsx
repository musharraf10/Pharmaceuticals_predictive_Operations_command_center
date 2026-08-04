import { Outlet } from "react-router-dom";

import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const AppLayout = () => {
  return (
    <div className="relative flex h-screen overflow-hidden bg-gradient-to-br from-sky-100/70 via-rose-50/60 to-indigo-100/50 dark:bg-gradient-to-br dark:from-slate-950 dark:via-indigo-950/50 dark:to-slate-950 text-secondary-900 dark:text-slate-100 transition-colors duration-300">
      {/* Dynamic Colorful Ambient Screen Background Gradient Orbs (Light & Dark Theme) */}
      <div className="pointer-events-none absolute -top-32 -left-32 h-[450px] w-[450px] rounded-full bg-sky-200/60 dark:bg-sky-500/25 blur-3xl animate-blob" />
      <div className="pointer-events-none absolute top-1/3 -right-32 h-[450px] w-[450px] rounded-full bg-pink-200/60 dark:bg-purple-500/25 blur-3xl animate-blob animation-delay-2000" />
      <div className="pointer-events-none absolute -bottom-32 left-1/3 h-[450px] w-[450px] rounded-full bg-indigo-200/50 dark:bg-indigo-500/20 blur-3xl animate-blob animation-delay-4000" />

      <Sidebar />

      <div className="relative z-10 flex min-w-0 flex-1 flex-col overflow-hidden">
        <Navbar />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-[1600px] animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
