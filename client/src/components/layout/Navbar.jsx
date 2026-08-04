import { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Bell,
  ChevronRight,
  LogOut,
  Menu,
  Search,
  User,
} from "lucide-react";

import Button from "../ui/Button";
import Drawer from "../ui/Drawer";
import Dropdown, { DropdownDivider, DropdownItem } from "../ui/Dropdown";
import NotificationCard from "../ui/NotificationCard";
import { MENU_ITEMS } from "../../constants/sidebar";
import { useLayout } from "../../hooks/useLayout";
import useAuth from "../../hooks/useAuth";
import { useNotifications } from "../../hooks/useNotifications";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { toggleMobileSidebar } = useLayout();
  const { notifications } = useNotifications({ limit: 10 });
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const currentPage = useMemo(() => {
    const match = MENU_ITEMS.find((item) =>
      location.pathname.startsWith(item.path),
    );
    return match?.title ?? "Dashboard";
  }, [location.pathname]);

  const breadcrumbs = useMemo(() => {
    const segments = location.pathname.split("/").filter(Boolean);
    return segments.map((seg, i) => ({
      label: seg.charAt(0).toUpperCase() + seg.slice(1),
      path: "/" + segments.slice(0, i + 1).join("/"),
    }));
  }, [location.pathname]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const match = MENU_ITEMS.find((item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()),
    );
    if (match) navigate(match.path);
  };

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "U";

  return (
    <>
      <header className="sticky top-0 z-30 flex h-navbar items-center justify-between gap-4 border-b border-secondary-200 bg-white/80 px-4 backdrop-blur-md sm:px-6">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={toggleMobileSidebar}
            aria-label="Open menu"
          >
            <Menu size={20} />
          </Button>

          <div>
            <nav className="mb-0.5 hidden items-center gap-1 text-[13px] text-secondary-400 sm:flex">
              {breadcrumbs.map((crumb, i) => (
                <span key={crumb.path} className="flex items-center gap-1">
                  {i > 0 && <ChevronRight size={12} />}
                  <Link
                    to={crumb.path}
                    className="hover:text-secondary-600"
                  >
                    {crumb.label}
                  </Link>
                </span>
              ))}
            </nav>

            <h2 className="text-xl font-semibold text-secondary-900 sm:text-2xl">
              {currentPage}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <form onSubmit={handleSearch} className="relative hidden md:block">
            <Search
              size={18}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400"
            />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search modules..."
              className="w-56 rounded-xl border border-secondary-300 py-2 pl-10 pr-4 text-[15px] transition-all duration-200 focus:border-primary-600 focus:ring-2 focus:ring-primary-100 lg:w-72"
            />
          </form>

          <button
            type="button"
            onClick={() => setNotificationsOpen(true)}
            className="relative rounded-xl p-2.5 text-secondary-500 transition hover:bg-secondary-100 hover:text-secondary-700"
            aria-label="Notifications"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-danger-600 text-[10px] font-bold text-white">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          <Dropdown
            trigger={
              <button
                type="button"
                className="flex items-center gap-2.5 rounded-xl p-1.5 transition hover:bg-secondary-100"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-100 text-sm font-semibold text-primary-700">
                  {initials}
                </div>
                <div className="hidden text-left lg:block">
                  <p className="text-sm font-medium text-secondary-900">
                    {user?.name ?? "User"}
                  </p>
                  <p className="text-[13px] text-secondary-500">{user?.role}</p>
                </div>
              </button>
            }
          >
            <DropdownItem icon={User} onClick={() => navigate("/dashboard")}>
              Profile
            </DropdownItem>
            <DropdownDivider />
            <DropdownItem icon={LogOut} danger onClick={handleLogout}>
              Sign Out
            </DropdownItem>
          </Dropdown>
        </div>
      </header>

      <Drawer
        open={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
        title="Notifications"
        width="max-w-md"
      >
        <div className="space-y-3">
          {notifications.length === 0 ? (
            <p className="py-8 text-center text-[15px] text-secondary-500">
              No notifications yet
            </p>
          ) : (
            notifications.map((notification) => (
              <NotificationCard
                key={notification._id}
                title={notification.title}
                message={notification.message}
                type={notification.type?.toLowerCase() ?? "info"}
                isRead={notification.isRead}
                createdAt={notification.createdAt}
              />
            ))
          )}
        </div>
      </Drawer>
    </>
  );
};

export default Navbar;
