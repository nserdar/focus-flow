'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { taskService } from '@/lib/services/taskService';
import { goalService } from '@/lib/services/goalService';
import { focusSessionService } from '@/lib/services/focusSessionService';
import { Task, Goal, FocusSession } from '@/types';
import Navbar from '@/components/Navbar';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { CheckCircle2, Clock, Target, TrendingUp } from 'lucide-react';

const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    'TODO': 'Yapılacak',
    'IN_PROGRESS': 'Devam Ediyor',
    'DONE': 'Tamamlandı',
    'CANCELLED': 'İptal Edildi',
  };
  return statusMap[status] || status;
};

const getGoalStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    'NOT_STARTED': 'Başlanmadı',
    'IN_PROGRESS': 'Devam Ediyor',
    'COMPLETED': 'Tamamlandı',
    'CANCELLED': 'İptal Edildi',
  };
  return statusMap[status] || status;
};

export default function DashboardPage() {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [sessions, setSessions] = useState<FocusSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }

    loadData();
  }, [isAuthenticated, router]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [tasksData, goalsData, sessionsData] = await Promise.all([
        taskService.getAll({ page: 0, size: 5, sortBy: 'createdAt', sortDir: 'DESC' }),
        goalService.getAll({ page: 0, size: 5, sortBy: 'createdAt', sortDir: 'DESC' }),
        focusSessionService.getAll({ page: 0, size: 10, sortBy: 'startTime', sortDir: 'DESC' }),
      ]);

      setTasks(Array.isArray(tasksData) ? tasksData : tasksData.content);
      setGoals(Array.isArray(goalsData) ? goalsData : goalsData.content);
      setSessions(Array.isArray(sessionsData) ? sessionsData : sessionsData.content);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">Yükleniyor...</div>
        </div>
      </div>
    );
  }

  const completedTasks = tasks.filter((t) => t.status === 'DONE').length;
  const inProgressTasks = tasks.filter((t) => t.status === 'IN_PROGRESS').length;
  const totalFocusMinutes = sessions.reduce((sum, s) => sum + s.durationSeconds / 60, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Pano</h1>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <CheckCircle2 className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tamamlanan Görevler</p>
                <p className="text-2xl font-bold text-gray-900">{completedTasks}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Devam Eden</p>
                <p className="text-2xl font-bold text-gray-900">{inProgressTasks}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Target className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Aktif Hedefler</p>
                <p className="text-2xl font-bold text-gray-900">{goals.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Odaklanma Süresi</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round(totalFocusMinutes)}d
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Tasks */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Son Görevler</h2>
          </div>
          <div className="p-6">
            {tasks.length === 0 ? (
              <p className="text-gray-500">Henüz görev yok. İlk görevinizi oluşturun!</p>
            ) : (
              <ul className="space-y-4">
                {tasks.map((task) => (
                  <li key={task.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{task.title}</p>
                      <p className="text-sm text-gray-500">
                        {getStatusText(task.status)} • Öncelik: {task.priority}
                      </p>
                    </div>
                    <span className="text-sm text-gray-500">
                      {format(new Date(task.createdAt), 'd MMM yyyy', { locale: tr })}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Recent Goals */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Son Hedefler</h2>
          </div>
          <div className="p-6">
            {goals.length === 0 ? (
              <p className="text-gray-500">Henüz hedef yok. İlk hedefinizi oluşturun!</p>
            ) : (
              <ul className="space-y-4">
                {goals.map((goal) => (
                  <li key={goal.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{goal.title}</p>
                      <p className="text-sm text-gray-500">
                        {getGoalStatusText(goal.status)} • Öncelik: {goal.priority}
                      </p>
                    </div>
                    <span className="text-sm text-gray-500">
                      {format(new Date(goal.createdAt), 'd MMM yyyy', { locale: tr })}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

