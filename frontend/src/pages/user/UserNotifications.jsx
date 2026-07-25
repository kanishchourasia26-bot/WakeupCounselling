import { useEffect, useState } from 'react';
import API from '../../services/api';

export default function UserNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const load = () => {
    API.get('/notifications').then(r => { setNotifications(r.data.notifications || []); setUnreadCount(r.data.unreadCount || 0); }).catch(() => {});
  };

  useEffect(() => { load(); }, []);

  const markAllRead = async () => {
    await API.put('/notifications/read-all');
    load();
  };

  const markRead = async (id) => {
    await API.put(`/notifications/${id}/read`);
    load();
  };

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="font-heading text-2xl font-bold text-gray-900">Notifications</h1>
          {unreadCount > 0 && <p className="text-sm text-gray-500">{unreadCount} unread</p>}
        </div>
        {unreadCount > 0 && <button onClick={markAllRead} className="text-teal-600 text-sm font-medium hover:text-teal-700">Mark all as read</button>}
      </div>
      {notifications.length === 0 ? (
        <div className="card p-12 text-center"><p className="text-gray-500">No notifications</p></div>
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => (
            <div key={n._id} onClick={() => !n.isRead && markRead(n._id)}
              className={`card p-5 cursor-pointer transition ${n.isRead ? '' : 'border-l-4 border-l-teal-500 bg-teal-50/50'}`}>
              <div className="flex justify-between items-start">
                <div>
                  <p className={`text-sm ${n.isRead ? 'text-gray-700' : 'font-semibold text-gray-900'}`}>{n.title}</p>
                  <p className="text-sm text-gray-500 mt-1">{n.message}</p>
                </div>
                <span className="text-xs text-gray-400 whitespace-nowrap ml-4">{new Date(n.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
