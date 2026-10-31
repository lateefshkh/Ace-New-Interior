'use client';

import { useCallback, useEffect, useState } from 'react';

const SESSION_KEY = 'dashboard_token';

export function useDashboardAuth() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    const saved = sessionStorage.getItem(SESSION_KEY);
    if (saved) {
      setPassword(saved);
      setAuthenticated(true);
    }
  }, []);

  const authHeaders = useCallback((): HeadersInit => {
    const token = password || sessionStorage.getItem(SESSION_KEY) || '';
    return token ? { Authorization: `Bearer ${token}` } : {};
  }, [password]);

  const login = useCallback(async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError('');
    setIsVerifying(true);

    try {
      const response = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        sessionStorage.setItem(SESSION_KEY, password);
        setAuthenticated(true);
        setPassword('');
      } else {
        setError('Invalid password. Please try again.');
        setPassword('');
      }
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  }, [password]);

  const logout = useCallback(() => {
    sessionStorage.removeItem(SESSION_KEY);
    setAuthenticated(false);
    setPassword('');
  }, []);

  return {
    authenticated,
    password,
    setPassword,
    error,
    isVerifying,
    login,
    logout,
    authHeaders,
  };
}
