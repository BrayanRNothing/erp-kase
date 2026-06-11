import { Outlet, NavLink } from 'react-router-dom';
import { LayoutDashboard, ArrowRightLeft, FileText } from 'lucide-react';

export function Layout() {
  const links = [
    { to: "/dashboard", icon: <LayoutDashboard size={20} />, label: "Dashboard" },
    { to: "/movements", icon: <ArrowRightLeft size={20} />, label: "Movimientos" },
    { to: "/billing", icon: <FileText size={20} />, label: "Facturación" },
  ];

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 flex flex-col p-6 m-4 mr-0 rounded-3xl glass-panel">
        <div className="mb-10 mt-4 px-2">
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">
            Liquid Finance
          </h1>
        </div>
        
        <nav className="flex-1 space-y-2">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => 
                `flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 ${
                  isActive 
                    ? 'bg-white/20 text-white shadow-md shadow-black/10' 
                    : 'text-white/60 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              {link.icon}
              <span className="font-medium">{link.label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8 relative">
        <div className="max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
