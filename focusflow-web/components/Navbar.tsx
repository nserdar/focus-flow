'use client';

import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { Target, ListTodo, Clock, BarChart3, LogOut, User } from 'lucide-react';

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  if (!isAuthenticated()) {
    return null;
  }

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/dashboard" className="text-2xl font-bold text-indigo-600">
                Focus Flow
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                href="/dashboard"
                className="border-indigo-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                <BarChart3 className="mr-2 h-4 w-4" />
                Pano
              </Link>
              <Link
                href="/tasks"
                className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                <ListTodo className="mr-2 h-4 w-4" />
                Görevler
              </Link>
              <Link
                href="/goals"
                className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                <Target className="mr-2 h-4 w-4" />
                Hedefler
              </Link>
              <Link
                href="/focus"
                className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                <Clock className="mr-2 h-4 w-4" />
                Odaklan
              </Link>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <div className="flex items-center space-x-4">
              <span className="text-gray-700 text-sm flex items-center">
                <User className="mr-2 h-4 w-4" />
                {user?.email}
              </span>
              <button
                onClick={handleLogout}
                className="text-gray-500 hover:text-gray-700 inline-flex items-center text-sm font-medium"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Çıkış
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

