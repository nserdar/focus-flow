'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { goalService, GoalRequest } from '@/lib/services/goalService';
import { Goal, PageResponse } from '@/types';
import Navbar from '@/components/Navbar';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { Plus, Edit, Trash2, Target } from 'lucide-react';

const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    'NOT_STARTED': 'Başlanmadı',
    'IN_PROGRESS': 'Devam Ediyor',
    'COMPLETED': 'Tamamlandı',
    'CANCELLED': 'İptal Edildi',
  };
  return statusMap[status] || status;
};

export default function GoalsPage() {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [formData, setFormData] = useState<GoalRequest>({
    title: '',
    description: '',
    status: 'NOT_STARTED',
    priority: 2,
  });

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }
    loadGoals();
  }, [isAuthenticated, router]);

  const loadGoals = async () => {
    try {
      setLoading(true);
      const data = await goalService.getAll();
      setGoals(Array.isArray(data) ? data : data.content);
    } catch (error) {
      console.error('Failed to load goals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingGoal) {
        await goalService.update(editingGoal.id, formData);
      } else {
        await goalService.create(formData);
      }
      setShowModal(false);
      setEditingGoal(null);
      setFormData({ title: '', description: '', status: 'NOT_STARTED', priority: 2 });
      loadGoals();
    } catch (error) {
      console.error('Failed to save goal:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Bu hedefi silmek istediğinize emin misiniz?')) return;
    try {
      await goalService.delete(id);
      loadGoals();
    } catch (error) {
      console.error('Failed to delete goal:', error);
    }
  };

  const handleEdit = (goal: Goal) => {
    setEditingGoal(goal);
    setFormData({
      title: goal.title,
      description: goal.description || '',
      status: goal.status,
      priority: goal.priority,
      startDate: goal.startDate,
      endDate: goal.endDate,
      area: goal.area,
    });
    setShowModal(true);
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
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Hedefler</h1>
          <button
            onClick={() => {
              setEditingGoal(null);
              setFormData({ title: '', description: '', status: 'NOT_STARTED', priority: 2 });
              setShowModal(true);
            }}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            <Plus className="mr-2 h-5 w-5" />
            Yeni Hedef
          </button>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            {goals.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Henüz hedef yok. İlk hedefinizi oluşturun!</p>
            ) : (
              <div className="space-y-4">
                {goals.map((goal) => (
                  <div
                    key={goal.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <Target className="h-5 w-5 text-indigo-600" />
                        <h3 className="font-medium text-gray-900">{goal.title}</h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(goal.status)}`}>
                          {getStatusText(goal.status)}
                        </span>
                      </div>
                      {goal.description && (
                        <p className="mt-1 text-sm text-gray-500">{goal.description}</p>
                      )}
                      <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                        <span>Öncelik: {goal.priority}</span>
                        {goal.startDate && (
                          <span>Başlangıç: {format(new Date(goal.startDate), 'd MMM yyyy', { locale: tr })}</span>
                        )}
                        {goal.endDate && (
                          <span>Bitiş: {format(new Date(goal.endDate), 'd MMM yyyy', { locale: tr })}</span>
                        )}
                        {goal.area && <span>Alan: {goal.area}</span>}
                        {goal.tasks && goal.tasks.length > 0 && (
                          <span>Görevler: {goal.tasks.length}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEdit(goal)}
                        className="p-2 text-gray-600 hover:text-indigo-600"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(goal.id)}
                        className="p-2 text-gray-600 hover:text-red-600"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">
                {editingGoal ? 'Hedefi Düzenle' : 'Yeni Hedef'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Başlık
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Açıklama
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Durum
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500"
                    >
                      <option value="NOT_STARTED">Başlanmadı</option>
                      <option value="IN_PROGRESS">Devam Ediyor</option>
                      <option value="COMPLETED">Tamamlandı</option>
                      <option value="CANCELLED">İptal Edildi</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Öncelik
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="4"
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Başlangıç Tarihi
                    </label>
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bitiş Tarihi
                    </label>
                    <input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Alan
                  </label>
                  <input
                    type="text"
                    value={formData.area}
                    onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                    placeholder="örn: İş, Sağlık, Kişisel"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500"
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setEditingGoal(null);
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    İptal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                  >
                    {editingGoal ? 'Güncelle' : 'Oluştur'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

