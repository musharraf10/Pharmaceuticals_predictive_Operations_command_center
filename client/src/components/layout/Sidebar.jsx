import { NavLink } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  X,
} from "lucide-react";

import { MENU_ITEMS } from "../../constants/sidebar";
import useAuth from "../../hooks/useAuth";
import { useLayout } from "../../hooks/useLayout";
import { cn } from "../../utils/cn";

const Sidebar = () => {
  const { role } = useAuth();
  const {
    sidebarCollapsed,
    toggleSidebar,
    mobileSidebarOpen,
    setMobileSidebarOpen,
  } = useLayout();

  const visibleItems = MENU_ITEMS.filter(
    (item) => !role || item.roles.includes(role),
  );

  const sidebarContent = (
    <>
      <div
        className={cn(
          "flex items-center border-b border-secondary-800 px-5 py-5",
          sidebarCollapsed ? "justify-center" : "justify-between",
        )}
      >
        {!sidebarCollapsed && (
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600">
                <Sparkles size={16} className="text-white" />
              </div>
              <h1 className="text-lg font-bold tracking-tight">PharmaOps AI</h1>
            </div>
            <p className="mt-1 text-[13px] text-secondary-400">
              Command Center
            </p>
          </div>
        )}

        <button
          type="button"
          onClick={() => setMobileSidebarOpen(false)}
          className="rounded-lg p-1.5 text-secondary-400 hover:bg-secondary-800 hover:text-white lg:hidden"
          aria-label="Close sidebar"
        >
          <X size={20} />
        </button>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {visibleItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.id}
              to={item.path}
              onClick={() => setMobileSidebarOpen(false)}
              className={({ isActive }) =>
                cn(
                  "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-[15px] font-medium transition-all duration-200",
                  sidebarCollapsed && "justify-center px-2",
                  isActive
                    ? "bg-primary-600/15 text-white"
                    : "text-secondary-300 hover:bg-secondary-800 hover:text-white",
                )
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-primary-500" />
                  )}
                  <Icon size={20} className="shrink-0" />
                  {!sidebarCollapsed && <span>{item.title}</span>}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      <div className="hidden border-t border-secondary-800 p-3 lg:block">
        <button
          type="button"
          onClick={toggleSidebar}
          className={cn(
            "flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-[13px] text-secondary-400 transition hover:bg-secondary-800 hover:text-white",
            sidebarCollapsed && "justify-center",
          )}
          aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {sidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          {!sidebarCollapsed && <span>Collapse</span>}
        </button>
      </div>
    </>
  );

  return (
    <>
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-secondary-900/50 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col bg-secondary-900 text-white transition-all duration-250 lg:sticky lg:top-0 lg:z-auto lg:h-screen",
          sidebarCollapsed ? "w-sidebar-collapsed" : "w-sidebar",
          mobileSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        {sidebarContent}
      </aside>
    </>
  );
};

export default Sidebar;
