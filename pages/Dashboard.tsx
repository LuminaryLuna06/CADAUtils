import React from "react";
import { useNavigate } from "react-router-dom";
import { NAV_ITEMS } from "../constants/navigation";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {NAV_ITEMS.filter((i) => i.id !== "dashboard").map((item) => (
          <button
            key={item.id}
            onClick={() => navigate(item.path)}
            className="flex flex-col items-center p-6 bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 hover:border-pink-500/50 dark:hover:border-pink-500/50 rounded-xl transition-all hover:shadow-lg dark:hover:bg-slate-800 group"
          >
            <div className="p-4 rounded-full bg-slate-100 dark:bg-slate-900 group-hover:bg-pink-50 dark:group-hover:bg-pink-500/10 text-pink-600 dark:text-pink-400 mb-4 transition-colors">
              {React.cloneElement(item.icon as React.ReactElement<any>, {
                size: 32,
              })}
            </div>
            <span className="font-semibold text-slate-700 dark:text-slate-200">
              {item.label}
            </span>
            <span className="text-xs text-slate-500 mt-2">{item.category}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
