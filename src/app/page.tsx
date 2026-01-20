'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  username: string;
  role: string;
}

interface BMIRecord {
  id: number;
  weight: number;
  height: number;
  bmi: number;
  recorded_at: string;
}

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [records, setRecords] = useState<BMIRecord[]>([]);
  const router = useRouter();

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
          fetchRecords();
        } else {
          router.push('/login');
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, [router]);

  async function fetchRecords() {
      try {
          const res = await fetch('/api/bmi');
          if (res.ok) {
              const data = await res.json();
              setRecords(data.records);
          }
      } catch (error) {
          console.error(error);
      }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/bmi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ weight: parseFloat(weight), height: parseFloat(height) }),
      });
      if (res.ok) {
        setWeight('');
        setHeight('');
        fetchRecords();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600"></div>
    </div>
  );

  if (!user) return null;

  const getBMIStatus = (bmi: number) => {
      if (bmi < 18.5) return { label: "Underweight (ผอม)", color: "text-blue-600 bg-blue-50 border-blue-100" };
      if (bmi < 23) return { label: "Normal (ปกติ)", color: "text-green-600 bg-green-50 border-green-100" };
      if (bmi < 25) return { label: "Overweight (ท้วม)", color: "text-orange-600 bg-orange-50 border-orange-100" };
      return { label: "Obese (อ้วน)", color: "text-red-600 bg-red-50 border-red-100" };
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-3">
                <div className="h-8 w-8 bg-teal-600 rounded-lg flex items-center justify-center text-white font-bold">
                    B
                </div>
                <h1 className="text-xl font-bold text-gray-900 tracking-tight">BMI Tracker</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-semibold">
                    {user.username.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-medium text-gray-700 hidden sm:block">{user.username}</span>
              </div>
              <button 
                onClick={handleLogout} 
                className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Input Form Section */}
            <div className="lg:col-span-4">
                <div className="bg-white p-6 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 sticky top-24">
                    <div className="mb-6">
                        <h2 className="text-xl font-bold text-gray-900">Record New BMI</h2>
                        <p className="text-sm text-gray-500 mt-1">Enter your details to calculate BMI</p>
                    </div>
                    
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label htmlFor="weight" className="block text-sm font-semibold text-gray-700 mb-1">Weight (kg)</label>
                            <div className="relative">
                                <input
                                    id="weight"
                                    type="number"
                                    step="0.1"
                                    required
                                    className="block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-teal-100 focus:border-teal-500 transition-colors"
                                    placeholder="e.g. 70.5"
                                    value={weight}
                                    onChange={(e) => setWeight(e.target.value)}
                                />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="height" className="block text-sm font-semibold text-gray-700 mb-1">Height (cm)</label>
                            <div className="relative">
                                <input
                                    id="height"
                                    type="number"
                                    step="0.1"
                                    required
                                    className="block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-teal-100 focus:border-teal-500 transition-colors"
                                    placeholder="e.g. 175"
                                    value={height}
                                    onChange={(e) => setHeight(e.target.value)}
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-lg shadow-teal-500/30 text-sm font-bold text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all hover:shadow-teal-500/40"
                        >
                            Calculate & Save
                        </button>
                    </form>
                </div>
            </div>

            {/* History List Section */}
            <div className="lg:col-span-8">
                <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">History</h2>
                            <p className="text-sm text-gray-500 mt-1">Your recent BMI records</p>
                        </div>
                        <a href="/reports" className="text-sm font-medium text-teal-600 hover:text-teal-700 hover:bg-teal-50 px-3 py-1.5 rounded-lg transition-colors">
                            View Reports →
                        </a>
                    </div>
                    
                    <div className="overflow-x-auto">
                        {records.length === 0 ? (
                            <div className="p-12 text-center">
                                <div className="mx-auto h-12 w-12 text-gray-300 mb-3">
                                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                </div>
                                <p className="text-gray-500 font-medium">No records found</p>
                                <p className="text-gray-400 text-sm mt-1">Start by adding your weight and height</p>
                            </div>
                        ) : (
                            <table className="min-w-full divide-y divide-gray-100">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">BMI</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Details</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-100">
                                    {records.map((record) => {
                                        const status = getBMIStatus(record.bmi);
                                        return (
                                            <tr key={record.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">
                                                    {new Date(record.recorded_at).toLocaleDateString(undefined, {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="text-lg font-bold text-gray-900">{record.bmi.toFixed(2)}</span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${status.color}`}>
                                                        {status.label}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">
                                                    {record.weight}kg / {record.height}cm
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
        </div>
      </main>
    </div>
  );
}
