import { Outlet } from "react-router-dom";

import { LayoutProvider } from "../../context/LayoutContext";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const AppLayout = () => {
  return (
    <LayoutProvider>
      <div className="flex min-h-screen bg-secondary-50">
        <Sidebar />

        <div className="flex min-w-0 flex-1 flex-col">
          <Navbar />

          <main className="flex-1 p-4 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-[1600px] animate-fade-in">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </LayoutProvider>
  );
};

export default AppLayout;
