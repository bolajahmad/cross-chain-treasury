
import React, { useState } from 'react';
import { ICONS } from './constants';
import { Menu, X, Wallet } from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

export const RootLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { name: 'Overview', path: '/', icon: ICONS.Dashboard },
    { name: 'Actions', path: '/actions', icon: ICONS.Actions },
    { name: 'Create Action', path: '/create', icon: ICONS.Create },
    { name: 'Admin Control', path: '/admins', icon: ICONS.Admin },
    { name: 'Configuration', path: '/settings', icon: ICONS.Settings },
  ];

  return (
    <div className="min-h-screen flex bg-gray-950 text-gray-100">
      {/* Mobile Sidebar Toggle */}
      <button 
        onClick={() => setSidebarOpen(!isSidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-gray-800 rounded-lg"
      >
        {isSidebarOpen ? <X /> : <Menu />}
      </button>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-gray-900 border-r border-gray-800 transition-transform duration-300 lg:relative lg:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-full flex flex-col p-6">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <span className="text-xl font-bold">H</span>
            </div>
            <span className="text-xl font-bold tracking-tight">HyperFlow</span>
          </div>

          <nav className="flex-1 space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    isActive 
                      ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-600/20' 
                      : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  {item.icon}
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto pt-6 border-t border-gray-800">
            <div className="p-4 bg-gray-800/50 rounded-2xl">
              <div className="flex items-center gap-3 mb-2">
                <Wallet className="w-4 h-4 text-gray-400" />
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Connected Wallet</span>
              </div>
              <p className="text-sm font-mono truncate text-indigo-300">0x71C...492b</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        <header className="sticky top-0 z-30 bg-gray-950/80 backdrop-blur-md border-b border-gray-800 px-8 py-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold">
            {navItems.find(i => i.path === pathname)?.name || 'HyperFlow'}
          </h1>
          <div className="flex items-center gap-4">
             <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs font-medium text-green-500">Base Sepolia Connected</span>
             </div>
             <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-xl text-sm font-semibold transition-colors">
               Connect Wallet
             </button>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
};
