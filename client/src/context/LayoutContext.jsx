import { createContext, useMemo, useState } from "react";

const LayoutContext = createContext(null);

export const LayoutProvider = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const value = useMemo(
    () => ({
      sidebarCollapsed,
      setSidebarCollapsed,
      toggleSidebar: () => setSidebarCollapsed((v) => !v),
      mobileSidebarOpen,
      setMobileSidebarOpen,
      toggleMobileSidebar: () => setMobileSidebarOpen((v) => !v),
    }),
    [sidebarCollapsed, mobileSidebarOpen],
  );

  return (
    <LayoutContext.Provider value={value}>{children}</LayoutContext.Provider>
  );
};

export default LayoutContext;
