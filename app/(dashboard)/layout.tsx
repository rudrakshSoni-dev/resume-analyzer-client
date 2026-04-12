"use client"
import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Home, FileSearch, Briefcase, Menu, LogOut, Users, Link , File} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getStoredUsers, removeActiveUser, switchToUser } from '../lib/cookies';
import { StoredUser } from '../types';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout, switchUserContext } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [usersList, setUsersList] = useState<StoredUser[]>([]);

  useEffect(() => {
    if (!user) router.push('/');
    setUsersList(getStoredUsers());
  }, [user, router]);

  const navItems = [
    { icon: FileSearch, label: 'Analyze Resume', path: '/analyzer' },
    { icon: Briefcase, label: 'See Jobs', path: '/jobs' },
    { icon: File , label: 'Docs', path:'/docs'}
  ];

  const handleLogout = () => {
    removeActiveUser();
    logout();
    router.push('/');
  };

  const handleSwitchUser = (u: StoredUser) => {
    switchToUser(u.userId);
    switchUserContext(u);
    router.push('/home');
  };

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200">
        <div className="p-6 text-black font-bold text-xl flex items-center gap-2">
          <FileSearch className="w-6 h-6" /> Resume Analyzer
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          {navItems.map((item) => {
            const active = pathname === item.path;
            return (
              <div
                key={item.path}
                onClick={() => router.push(item.path)}
                className={`flex items-center gap-3 px-4 py-3 rounded-md cursor-pointer transition-all
                  ${active
                    ? 'bg-gray-100 border-l-4 border-black text-black font-semibold'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-black'
                  }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </div>
            );
          })}
        </nav>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
          
          <div className="flex items-center md:hidden gap-4">
            <Menu
              className="w-6 h-6 cursor-pointer text-gray-700"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            />
            <span className="text-black font-bold text-lg">Resume AI</span>
          </div>

          <div className="hidden md:block" />

          {/* User Menu */}
          <div className="relative group cursor-pointer">
            <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-bold">
              {user?.name.charAt(0).toUpperCase()}
            </div>

            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 shadow-lg rounded-md hidden group-hover:block z-50">
              
              <div className="p-3 border-b text-sm text-gray-700">
                Signed in as <br />
                <span className="font-semibold">{user?.email}</span>
              </div>

              <div className="p-2">
                <div className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 flex gap-2">
                  <Users className="w-4 h-4" />
                  Switch User (Top 5)
                </div>

                {usersList
                  .filter(u => u.userId !== user?.id)
                  .map(u => (
                    <div
                      key={u.userId}
                      onClick={() => handleSwitchUser(u)}
                      className="px-6 py-1 text-xs text-gray-500 hover:text-black hover:bg-gray-50 truncate"
                    >
                      {u.name}
                    </div>
                  ))}

                <div
                  onClick={handleLogout}
                  className="px-3 py-2 text-sm text-red-600 hover:bg-red-50 flex gap-2 mt-1 border-t"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6 md:p-10">
          {children}
        </main>

        {/* Footer */}
        <footer className="border-t border-gray-200 bg-white p-4 text-center text-sm text-gray-500">
          <div className="flex justify-center gap-4 mb-2">
            <a className="cursor-pointer hover:text-black" href="https://github.com/rudrakshSoni-dev" target="_blank">GitHub</a>
            <a className="cursor-pointer hover:text-black" href="mailto:hello@rudrakshh.live">Email</a>
            <a className="cursor-pointer hover:text-black" href="https://www.linkedin.com/in/rudraksh-soni-7674ab2aa/" target="_blank">LinkedIn</a>
          </div>
          <p>Made with ❤️ by <a className="cursor-pointer hover:text-black" href="http://rudrakshh.live" target="_blank">Rudrakshh</a></p>
        </footer>
      </div>
    </div>
  );
}