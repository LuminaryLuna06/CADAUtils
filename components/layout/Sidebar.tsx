import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Wrench, X, Pin } from "lucide-react";
import { ActionIcon, Tooltip } from "@mantine/core";
import { NAV_ITEMS } from "../../constants/navigation";
import { useSettingsContext } from "../../contexts/SettingsContext";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { settings, togglePinTool, isPinned } = useSettingsContext();

  const categories = Array.from(new Set(NAV_ITEMS.map((i) => i.category)));

  // Get pinned tools
  const pinnedTools = NAV_ITEMS.filter(
    (item) => isPinned(item.id) && item.id !== "dashboard"
  );

  return (
    <aside
      className={`
        fixed lg:static inset-y-0 left-0 z-30 w-64 border-r 
        bg-white dark:bg-slate-850 border-slate-200 dark:border-slate-800
        transform transition-transform duration-200 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
    >
      <div className="flex items-center justify-between h-16 px-6 border-b border-slate-200 dark:border-slate-800">
        <div
          className="flex items-center gap-2 font-bold text-xl cursor-pointer transition-colors"
          onClick={() => navigate("/")}
          style={{
            color: `var(--mantine-color-${settings.primaryColor}-6)`,
          }}
        >
          <Wrench className="w-6 h-6" />
          <span>CadaUtils</span>
        </div>
        <button
          className="lg:hidden text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
          onClick={onClose}
        >
          <X size={20} />
        </button>
      </div>

      <nav className="p-4 space-y-6 overflow-y-auto h-[calc(100vh-4rem)]">
        {/* Pinned Tools Section */}
        {pinnedTools.length > 0 && (
          <div>
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 px-2 flex items-center gap-2">
              <Pin size={12} />
              Pinned Tools
            </h3>
            <div className="space-y-1">
              {pinnedTools.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <div key={item.id} className="group">
                    <button
                      onClick={() => {
                        navigate(item.path);
                        onClose();
                      }}
                      className={`
                      w-full flex items-center justify-between gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all border-2
                      ${
                        isActive
                          ? "border-transparent text-slate-900 dark:text-white"
                          : "border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800"
                      }
                    `}
                      style={
                        isActive
                          ? {
                              borderColor: `var(--mantine-color-${settings.primaryColor}-6)`,
                            }
                          : undefined
                      }
                    >
                      <div className="flex items-center gap-3">
                        {item.icon}
                        {item.label}
                      </div>
                      <Tooltip label="Unpin" position="right">
                        <ActionIcon
                          size="xs"
                          variant="subtle"
                          color={settings.primaryColor}
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => {
                            e.stopPropagation();
                            togglePinTool(item.id);
                          }}
                        >
                          <X size={12} />
                        </ActionIcon>
                      </Tooltip>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* All Tools by Category */}
        {categories.map((category) => (
          <div key={category}>
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 px-2">
              {category}
            </h3>
            <div className="space-y-1">
              {NAV_ITEMS.filter((item) => item.category === category).map(
                (item) => {
                  const isActive = location.pathname === item.path;
                  const pinned = isPinned(item.id);
                  return (
                    <div key={item.id} className="group">
                      <button
                        onClick={() => {
                          navigate(item.path);
                          onClose();
                        }}
                        className={`
                        w-full flex items-center justify-between gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all border-2
                        ${
                          isActive
                            ? "border-transparent text-slate-900 dark:text-white"
                            : "border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800"
                        }
                      `}
                        style={
                          isActive
                            ? {
                                borderColor: `var(--mantine-color-${settings.primaryColor}-3)`,
                              }
                            : undefined
                        }
                      >
                        <div className="flex items-center gap-3">
                          {item.icon}
                          {item.label}
                        </div>
                        {item.pin && (
                          <Tooltip
                            label={pinned ? "Unpin" : "Pin"}
                            position="right"
                          >
                            <ActionIcon
                              size="xs"
                              variant="subtle"
                              color={pinned ? settings.primaryColor : "gray"}
                              className="opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={(e) => {
                                e.stopPropagation();
                                togglePinTool(item.id);
                              }}
                            >
                              <Pin
                                size={12}
                                className={pinned ? "fill-current" : ""}
                              />
                            </ActionIcon>
                          </Tooltip>
                        )}
                      </button>
                    </div>
                  );
                }
              )}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
