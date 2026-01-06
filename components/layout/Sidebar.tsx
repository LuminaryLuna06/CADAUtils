import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Wrench, X } from "lucide-react";
import { NAV_ITEMS } from "../../constants/navigation";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const categories = Array.from(new Set(NAV_ITEMS.map((i) => i.category)));

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
          className="flex items-center gap-2 font-bold text-xl text-pink-600 dark:text-pink-500 cursor-pointer"
          onClick={() => navigate("/")}
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
        {categories.map((category) => (
          <div key={category}>
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 px-2">
              {category}
            </h3>
            <div className="space-y-1">
              {NAV_ITEMS.filter((item) => item.category === category).map(
                (item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        navigate(item.path);
                        onClose();
                      }}
                      className={`
                      w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                      ${
                        isActive
                          ? "bg-pink-50 text-pink-600 dark:bg-pink-500/10 dark:text-pink-400"
                          : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800"
                      }
                    `}
                    >
                      {item.icon}
                      {item.label}
                    </button>
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
