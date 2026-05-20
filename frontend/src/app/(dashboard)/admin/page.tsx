'use client';

import { useEffect, useState } from 'react';

import toast from 'react-hot-toast';

import { userService } from '@/services/user.service';
import { DashboardStats } from '@/types';
import { Card } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/Spinner';
import { getErrorMessage } from '@/utils/helpers';

const statCards = (stats: DashboardStats) => [
  {
    label: 'Total Users',
    value: stats.totalUsers,
    icon: '👥',
    color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20',
  },
  {
    label: 'Admin Users',
    value: stats.adminCount,
    icon: '🛡️',
    color: 'text-purple-600 bg-purple-50 dark:bg-purple-900/20',
  },
  {
    label: 'Active Users',
    value: stats.activeUsers,
    icon: '✅',
    color: 'text-green-600 bg-green-50 dark:bg-green-900/20',
  },
  {
    label: 'New This Month',
    value: stats.newThisMonth,
    icon: '📈',
    color: 'text-orange-600 bg-orange-50 dark:bg-orange-900/20',
  },
];

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await userService.getDashboardStats();
        setStats(res.data.data ?? null);
      } catch (err) {
        toast.error(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };
    void fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">System overview and analytics</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats &&
          statCards(stats).map(({ label, value, icon, color }) => (
            <Card key={label} className="p-6">
              <div className="flex items-center gap-4">
                <div className={`h-12 w-12 rounded-xl flex items-center justify-center text-xl ${color}`}>
                  {icon}
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
                </div>
              </div>
            </Card>
          ))}
      </div>

      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Quick Actions
        </h2>
        <div className="flex flex-wrap gap-3">
          <a href="/admin/users"
            className="btn-primary text-sm">
            Manage Users
          </a>
        </div>
      </Card>
    </div>
  );
}
