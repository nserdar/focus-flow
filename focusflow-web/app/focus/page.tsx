'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { focusSessionService, FocusSessionRequest } from '@/lib/services/focusSessionService';
import { taskService } from '@/lib/services/taskService';
import { FocusSession, Task, PageResponse } from '@/types';
import Navbar from '@/components/Navbar';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { Play, Square, Clock, CheckCircle2 } from 'lucide-react';

const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    'IN_PROGRESS': 'Devam Ediyor',
    'COMPLETED': 'Tamamlandı',
    'CANCELLED': 'İptal Edildi',
  };
  return statusMap[status] || status;
};

export default function FocusPage() {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [sessions, setSessions] = useState<FocusSession[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSession, setActiveSession] = useState<FocusSession | null>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
  const [duration, setDuration] = useState(25); // minutes
  const [timer, setTimer] = useState(0); // seconds
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }
    loadData();
  }, [isAuthenticated, router]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            handleFinishSession();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timer]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [sessionsData, tasksData] = await Promise.all([
        focusSessionService.getAll({ page: 0, size: 20, sortBy: 'startTime', sortDir: 'DESC' }),
        taskService.getAll(),
      ]);
      setSessions(Array.isArray(sessionsData) ? sessionsData : sessionsData.content);
      setTasks(Array.isArray(tasksData) ? tasksData : tasksData.content);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartSession = async () => {
    if (!selectedTaskId) {
      alert('Lütfen bir görev seçin');
      return;
    }

    try {
      const now = new Date().toISOString();
      const sessionData: FocusSessionRequest = {
        taskId: selectedTaskId,
        startTime: now,
        type: 'POMODORO',
        durationMinutes: duration,
      };
      const session = await focusSessionService.start(sessionData);
      setActiveSession(session);
      setTimer(duration * 60);
      setIsRunning(true);
      loadData();
    } catch (error) {
      console.error('Failed to start session:', error);
      alert('Odaklanma oturumu başlatılamadı');
    }
  };

  const handleFinishSession = async () => {
    if (!activeSession) return;

    try {
      const now = new Date().toISOString();
      await focusSessionService.finish(activeSession.id, {
        taskId: activeSession.taskId,
        startTime: activeSession.startTime,
        endTime: now,
        durationMinutes: Math.floor(timer / 60) || duration,
        type: activeSession.type,
      });
      setActiveSession(null);
      setTimer(0);
      setIsRunning(false);
      loadData();
    } catch (error) {
      console.error('Failed to finish session:', error);
    }
  };

  const handleCancelSession = async () => {
    if (!activeSession) return;

    try {
      await focusSessionService.cancel(activeSession.id);
      setActiveSession(null);
      setTimer(0);
      setIsRunning(false);
      loadData();
    } catch (error) {
      console.error('Failed to cancel session:', error);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Odaklanma Oturumları</h1>

        {/* Focus Timer */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="max-w-md mx-auto">
            <h2 className="text-2xl font-semibold text-center mb-6">Odaklanma Zamanlayıcısı</h2>
            
            {!activeSession ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Görev Seç
                  </label>
                  <select
                    value={selectedTaskId || ''}
                    onChange={(e) => setSelectedTaskId(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500"
                  >
                    <option value="">Bir görev seçin...</option>
                    {tasks
                      .filter((t) => t.status !== 'DONE' && t.status !== 'CANCELLED')
                      .map((task) => (
                        <option key={task.id} value={task.id}>
                          {task.title}
                        </option>
                      ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Süre (dakika)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="120"
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500"
                  />
                </div>
                <button
                  onClick={handleStartSession}
                  disabled={!selectedTaskId}
                  className="w-full flex items-center justify-center px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Play className="mr-2 h-5 w-5" />
                  Odaklanma Oturumunu Başlat
                </button>
              </div>
            ) : (
              <div className="text-center space-y-6">
                <div className="text-6xl font-bold text-indigo-600">
                  {formatTime(timer)}
                </div>
                <div className="flex justify-center space-x-4">
                  {isRunning ? (
                    <button
                      onClick={() => setIsRunning(false)}
                      className="flex items-center px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
                    >
                      <Square className="mr-2 h-5 w-5" />
                      Duraklat
                    </button>
                  ) : (
                    <button
                      onClick={() => setIsRunning(true)}
                      className="flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      <Play className="mr-2 h-5 w-5" />
                      Devam Et
                    </button>
                  )}
                  <button
                    onClick={handleFinishSession}
                    className="flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                  >
                    <CheckCircle2 className="mr-2 h-5 w-5" />
                    Bitir
                  </button>
                  <button
                    onClick={handleCancelSession}
                    className="flex items-center px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    <Square className="mr-2 h-5 w-5" />
                    İptal
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Recent Sessions */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Son Oturumlar</h2>
          </div>
          <div className="p-6">
            {sessions.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Henüz odaklanma oturumu yok. İlk oturumunuzu başlatın!</p>
            ) : (
              <div className="space-y-4">
                {sessions.map((session) => {
                  const task = tasks.find((t) => t.id === session.taskId);
                  return (
                    <div
                      key={session.id}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <Clock className="h-5 w-5 text-indigo-600" />
                          <h3 className="font-medium text-gray-900">
                            {task?.title || `Task #${session.taskId}`}
                          </h3>
                          <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(session.status)}`}>
                            {getStatusText(session.status)}
                          </span>
                        </div>
                        <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                          <span>
                            {format(new Date(session.startTime), 'd MMM yyyy HH:mm', { locale: tr })}
                          </span>
                          {session.endTime && (
                            <span>
                              - {format(new Date(session.endTime), 'HH:mm')}
                            </span>
                          )}
                          <span>
                            Süre: {Math.round(session.durationSeconds / 60)}d
                          </span>
                          {session.type && (
                            <span className="capitalize">{session.type}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

