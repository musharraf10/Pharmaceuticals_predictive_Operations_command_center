import { createContext, useEffect, useMemo, useState } from "react";

const LayoutContext = createContext(null);

export const LayoutProvider = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("pharmaops_theme") || "dark";
  });

  useEffect(() => {
    localStorage.setItem("pharmaops_theme", theme);
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const value = useMemo(
    () => ({
      sidebarCollapsed,
      setSidebarCollapsed,
      toggleSidebar: () => setSidebarCollapsed((v) => !v),
      mobileSidebarOpen,
      setMobileSidebarOpen,
      toggleMobileSidebar: () => setMobileSidebarOpen((v) => !v),
      theme,
      setTheme,
      toggleTheme,
    }),
    [sidebarCollapsed, mobileSidebarOpen, theme],
  );

  return (
    <LayoutContext.Provider value={value}>{children}</LayoutContext.Provider>
  );
};

export default LayoutContext;
