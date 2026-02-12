'use client';

import { useState, useEffect } from 'react';
import { requestNotificationPermission } from '@/lib/firebase/notifications';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';

export function NotificationSettings() {
  const [loading, setLoading] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check current notification permission
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const handleEnableNotifications = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = await requestNotificationPermission();

      if (token) {
        setPermission('granted');
        // Show success message
        alert('Notifications enabled successfully! 🎉');
      } else {
        setError('Failed to enable notifications. Please check your browser settings.');
      }
    } catch (err) {
      console.error('Error enabling notifications:', err);
      setError('An error occurred while enabling notifications.');
    } finally {
      setLoading(false);
    }
  };

  const getPermissionStatus = () => {
    switch (permission) {
      case 'granted':
        return {
          label: 'Enabled',
          icon: 'check_circle',
          color: 'text-green-600 dark:text-green-400',
          bgColor: 'bg-green-50 dark:bg-green-900/20',
        };
      case 'denied':
        return {
          label: 'Blocked',
          icon: 'block',
          color: 'text-red-600 dark:text-red-400',
          bgColor: 'bg-red-50 dark:bg-red-900/20',
        };
      default:
        return {
          label: 'Not enabled',
          icon: 'notifications_off',
          color: 'text-slate-600 dark:text-slate-400',
          bgColor: 'bg-slate-50 dark:bg-slate-800',
        };
    }
  };

  const status = getPermissionStatus();

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
          <Icon name="notifications" className="text-2xl text-primary" />
        </div>

        <div className="flex-1">
          <h3 className="text-lg font-bold mb-2">Push Notifications</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
            Get notified when friends complete challenges, beat your streak, or when
            it's time to log your daily movement.
          </p>

          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${status.bgColor} ${status.color} mb-4`}>
            <Icon name={status.icon} className="text-base" />
            {status.label}
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-600 dark:text-red-400">
              {error}
            </div>
          )}

          {permission === 'denied' && (
            <div className="mb-4 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg text-sm text-amber-700 dark:text-amber-400">
              <strong>Notifications blocked.</strong> To enable, please update your
              browser settings and allow notifications for this site.
            </div>
          )}

          {permission !== 'granted' && permission !== 'denied' && (
            <Button
              onClick={handleEnableNotifications}
              disabled={loading}
              variant="primary"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Enabling...
                </>
              ) : (
                <>
                  <Icon name="notifications_active" />
                  Enable Notifications
                </>
              )}
            </Button>
          )}

          {permission === 'granted' && (
            <div className="text-sm text-green-600 dark:text-green-400 font-medium">
              ✓ You'll receive notifications for important updates
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
