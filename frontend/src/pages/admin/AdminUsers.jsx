import { useEffect, useState } from 'react';
import API from '../../services/api';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  useEffect(() => { API.get('/auth/users').then(r => setUsers(r.data.users || [])).catch(() => {}); }, []);

  return (
    <div className="animate-fade-in">
      <h1 className="font-heading text-2xl font-bold text-gray-900 mb-6">Users</h1>
      <div className="card overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Phone</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map(u => (
              <tr key={u._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{u.fullName}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{u.email}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{u.phone || 'N/A'}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{new Date(u.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {users.length === 0 && <p className="text-center py-8 text-gray-500">No users found</p>}
      </div>
    </div>
  );
}
