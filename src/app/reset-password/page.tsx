'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

function ResetPasswordContent() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (password !== confirmPassword) {
        setError("Passwords do not match");
        return;
    }

    if (!token) {
        setError("Missing reset token");
        return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => {
            router.push('/login');
        }, 3000);
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to reset password');
      }
    } catch (err) {
      setError('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded shadow text-center">
                <h2 className="text-xl font-bold text-red-600 mb-2">Invalid Link</h2>
                <p>Missing reset token.</p>
                <Link href="/login" className="text-indigo-600 hover:underline mt-4 block">Go to Login</Link>
            </div>
        </div>
      );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">Reset Password</h2>
        
        {success ? (
            <div className="text-center">
                <div className="mb-4 p-2 bg-green-100 text-green-700 rounded">
                    Password has been reset successfully!
                </div>
                <p className="text-gray-600">Redirecting to login...</p>
                <Link href="/login" className="text-indigo-600 hover:underline mt-4 block">Click here if not redirected</Link>
            </div>
        ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                    <div className="mb-4 p-2 bg-red-100 text-red-700 rounded text-sm">
                        {error}
                    </div>
                )}
                <div>
                    <label className="block text-sm font-medium text-gray-700">New Password</label>
                    <input
                    type="password"
                    required
                    minLength={6}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                    <input
                    type="password"
                    required
                    minLength={6}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
                >
                    {loading ? 'Resetting...' : 'Set New Password'}
                </button>
            </form>
        )}
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gray-100">Loading...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}
