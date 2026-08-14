'use client';

import { useEffect, useState } from 'react';

interface Inquiry {
  $id: string;
  name?: string;
  phone: string;
  email?: string;
  intent?: string;
  budget_min?: number;
  budget_max?: number;
  location_preference?: string;
  qualification_status?: string;
  conversation_summary?: string;
  source_page?: string;
  created_at?: string;
}

export default function DashboardPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  // Check if already authenticated
  useEffect(() => {
    const savedAuth = localStorage.getItem('dashboard_auth');
    if (savedAuth === 'true') {
      setAuthenticated(true);
    }
  }, []);

  // Fetch inquiries when authenticated
  useEffect(() => {
    if (authenticated) {
      fetchInquiries();
    }
  }, [authenticated, refreshKey]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsVerifying(true);

    try {
      // Verify password via server API (password never leaves server)
      const response = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setAuthenticated(true);
        localStorage.setItem('dashboard_auth', 'true');
        setPassword(''); // Clear password from state
      } else {
        setError('Invalid password. Please try again.');
        setPassword('');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('An error occurred. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const fetchInquiries = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/inquiries');
      const data = await response.json();
      
      if (data.success && data.documents) {
        setInquiries(data.documents);
      }
    } catch (error) {
      console.error('Failed to fetch inquiries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handleLogout = () => {
    localStorage.removeItem('dashboard_auth');
    setAuthenticated(false);
    setPassword('');
  };

  // Login Screen
  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold mb-2">Agent Dashboard</h1>
          <p className="text-sm text-gray-500 mb-6">Enter your password to access leads</p>
          
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#171817] focus:border-transparent"
                autoFocus
                disabled={isVerifying}
              />
            </div>
            
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}
            
            <button
              type="submit"
              disabled={isVerifying}
              className="w-full bg-[#171817] text-white py-2 rounded-lg hover:bg-[#171817]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isVerifying ? 'Verifying...' : 'Login'}
            </button>
          </form>
          
          <p className="mt-4 text-xs text-gray-400 text-center">
            Secure dashboard access
          </p>
        </div>
      </div>
    );
  }

  // Dashboard Content
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Inquiries Dashboard</h1>
            <p className="text-sm text-gray-500 mt-1">Total: {inquiries.length} inquiries</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleRefresh}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
            >
              🔄 Refresh
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-sm text-gray-500">Total Inquiries</p>
            <p className="text-2xl font-bold">{inquiries.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-sm text-gray-500">Qualified</p>
            <p className="text-2xl font-bold">
              {inquiries.filter(i => i.qualification_status === 'qualified').length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-sm text-gray-500">Contacted</p>
            <p className="text-2xl font-bold">
              {inquiries.filter(i => i.qualification_status === 'contacted').length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-sm text-gray-500">From Chat</p>
            <p className="text-2xl font-bold">
              {inquiries.filter(i => i.source_page === 'chat').length}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Name</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Phone</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Email</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Source</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-gray-500">Loading...</td>
                  </tr>
                ) : inquiries.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                      <div className="text-4xl mb-2">📭</div>
                      <p>No inquiries yet</p>
                      <p className="text-sm text-gray-400 mt-1">Try submitting the inquiry form or using the chat widget</p>
                    </td>
                  </tr>
                ) : (
                  inquiries.map((inquiry) => (
                    <tr key={inquiry.$id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium">{inquiry.name || 'Unknown'}</td>
                      <td className="px-6 py-4">{inquiry.phone || '—'}</td>
                      <td className="px-6 py-4">{inquiry.email || '—'}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          inquiry.source_page === 'chat' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {inquiry.source_page === 'chat' ? '💬 Chat' : '📝 Form'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          inquiry.qualification_status === 'qualified' ? 'bg-green-100 text-green-800' :
                          inquiry.qualification_status === 'contacted' ? 'bg-blue-100 text-blue-800' :
                          inquiry.qualification_status === 'converted' ? 'bg-purple-100 text-purple-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {inquiry.qualification_status || 'new'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {inquiry.created_at ? new Date(inquiry.created_at).toLocaleString() : '—'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
