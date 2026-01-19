'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [mockLink, setMockLink] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);
    setMockLink('');

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      
      if (res.ok) {
        setMessage(data.message);
        // For demo purposes, we show the link if provided in response (dev mode)
        if (data.mockToken) {
            setMockLink(`http://localhost:3000/reset-password?token=${data.mockToken}`);
        }
      } else {
        setError(data.error || 'Something went wrong');
      }
    } catch (err) {
      setError('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">Forgot Password</h2>
        {message && (
            <div className="mb-4 p-2 bg-green-100 text-green-700 rounded text-sm">
                {message}
            </div>
        )}
        {error && (
            <div className="mb-4 p-2 bg-red-100 text-red-700 rounded text-sm">
                {error}
            </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email Address</label>
            <input
              type="email"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        {mockLink && (
             <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded text-sm break-all">
                <p className="font-bold text-yellow-800 mb-1">DEV MODE - Mock Email Link:</p>
                <Link href={mockLink} className="text-blue-600 underline">{mockLink}</Link>
             </div>
        )}

        <div className="mt-4 text-center">
          <Link href="/login" className="text-sm text-indigo-600 hover:text-indigo-500">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
