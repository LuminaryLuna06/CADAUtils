import React, { useState, Suspense } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Menu } from "lucide-react";
import { LoadingOverlay, useMantineColorScheme } from "@mantine/core";
import Sidebar from "./Sidebar";
import ThemeToggle from "../ui/ThemeToggle";
import { NAV_ITEMS } from "../../constants/navigation";

const MainLayout: React.FC = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { colorScheme } = useMantineColorScheme();

  const activeTool = NAV_ITEMS.find((i) => i.path === location.pathname);
  const isDark = colorScheme === "dark";

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 overflow-hidden font-sans transition-colors duration-300">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-4 lg:px-8 border-b border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-md"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>
            <h1 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
              {activeTool?.label || "Dashboard"}
            </h1>
          </div>

          <ThemeToggle />
        </header>

        {/* Scrollable Area - Added relative here so LoadingOverlay covers this entire area */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-8 relative">
          <div className="max-w-4xl mx-auto h-full">
            <Suspense
              fallback={
                <LoadingOverlay
                  visible={true}
                  zIndex={100}
                  overlayProps={{
                    radius: "sm",
                    blur: 2,
                    color: isDark ? "#0f172a" : "#f8fafc", // Slate 900 vs Slate 50
                    backgroundOpacity: 0.8,
                  }}
                  loaderProps={{ color: "pink", type: "bars" }}
                />
              }
            >
              <Outlet />
            </Suspense>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
