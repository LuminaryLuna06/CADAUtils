import React from "react";
import { useNavigate } from "react-router-dom";
import { Pin } from "lucide-react";
import { Badge } from "@mantine/core";
import { NAV_ITEMS } from "../constants/navigation";
import { useSettingsContext } from "../contexts/SettingsContext";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { settings, isPinned } = useSettingsContext();

  const pinnedTools = NAV_ITEMS.filter(
    (item) => isPinned(item.id) && item.id !== "dashboard"
  );
  const otherTools = NAV_ITEMS.filter(
    (item) => !isPinned(item.id) && item.id !== "dashboard"
  );

  return (
    <div className="space-y-8">
      <div className="text-center py-12">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
          Welcome to CadaUtils
        </h2>
        <p className="text-slate-600 dark:text-slate-400 max-w-lg mx-auto">
          A comprehensive suite of client-side tools for your daily development
          needs. Secure, fast, and completely offline-capable.
        </p>
      </div>

      {/* Pinned Tools Section */}
      {pinnedTools.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Pin size={18} className="text-slate-600 dark:text-slate-400" />
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              Pinned Tools
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pinnedTools.map((item) => (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                className="relative flex flex-col items-center p-6 bg-white dark:bg-slate-800/50 border-2 rounded-xl transition-all hover:shadow-lg dark:hover:bg-slate-800 group"
                style={{
                  borderColor: `var(--mantine-color-${settings.primaryColor}-3)`,
                }}
              >
                <Badge
                  size="xs"
                  color={settings.primaryColor}
                  variant="filled"
                  className="absolute top-2 right-2"
                  leftSection={<Pin size={10} />}
                >
                  Pinned
                </Badge>
                <div
                  className="p-4 rounded-full mb-4 transition-colors"
                  style={{
                    backgroundColor: `var(--mantine-color-${settings.primaryColor}-1)`,
                    color: `var(--mantine-color-${settings.primaryColor}-6)`,
                  }}
                >
                  {React.cloneElement(item.icon as React.ReactElement<any>, {
                    size: 32,
                  })}
                </div>
                <span className="font-semibold text-slate-700 dark:text-slate-200">
                  {item.label}
                </span>
                <span className="text-xs text-slate-500 mt-2">
                  {item.category}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* All Tools Section */}
      <div>
        {pinnedTools.length > 0 && (
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
            All Tools
          </h3>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {otherTools.map((item) => (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className="flex flex-col items-center p-6 bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-xl transition-all hover:shadow-lg dark:hover:bg-slate-800 group"
              style={{
                ["--hover-border-color" as any]: `var(--mantine-color-${settings.primaryColor}-3)`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = `var(--mantine-color-${settings.primaryColor}-3)`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "";
              }}
            >
              <div
                className="p-4 rounded-full bg-slate-100 dark:bg-slate-900 mb-4 transition-colors"
                style={{
                  ["--group-hover-bg" as any]: `var(--mantine-color-${settings.primaryColor}-1)`,
                  ["--group-hover-color" as any]: `var(--mantine-color-${settings.primaryColor}-6)`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = `var(--mantine-color-${settings.primaryColor}-1)`;
                  e.currentTarget.style.color = `var(--mantine-color-${settings.primaryColor}-6)`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "";
                  e.currentTarget.style.color = "";
                }}
              >
                {React.cloneElement(item.icon as React.ReactElement<any>, {
                  size: 32,
                })}
              </div>
              <span className="font-semibold text-slate-700 dark:text-slate-200">
                {item.label}
              </span>
              <span className="text-xs text-slate-500 mt-2">
                {item.category}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
