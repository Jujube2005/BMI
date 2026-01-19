'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface BMIRecord {
  id: number;
  weight: number;
  height: number;
  bmi: number;
  recorded_at: string;
}

export default function ReportsPage() {
  const [type, setType] = useState('daily');
  const [records, setRecords] = useState<BMIRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchReports(type);
  }, [type]);

  async function fetchReports(reportType: string) {
    setLoading(true);
    try {
      const res = await fetch(`/api/reports?type=${reportType}`);
      if (res.ok) {
        const data = await res.json();
        setRecords(data.records);
      } else {
          if (res.status === 401) router.push('/login');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const downloadCSV = () => {
    const headers = ['Date', 'Weight (kg)', 'Height (cm)', 'BMI'];
    const csvContent = [
      headers.join(','),
      ...records.map(r => [
        new Date(r.recorded_at).toLocaleDateString(),
        r.weight,
        r.height,
        r.bmi.toFixed(2)
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `bmi_report_${type}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const chartData = records.map(r => ({
      date: new Date(r.recorded_at).toLocaleDateString(),
      bmi: parseFloat(r.bmi.toFixed(2))
  }));

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">BMI Reports</h1>
            <button onClick={() => router.push('/')} className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">Back to Dashboard</button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow mb-8">
            <div className="flex flex-wrap gap-4 mb-6">
                <button
                    onClick={() => setType('daily')}
                    className={`px-4 py-2 rounded ${type === 'daily' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                    Daily (Last 7 Days)
                </button>
                <button
                    onClick={() => setType('weekly')}
                    className={`px-4 py-2 rounded ${type === 'weekly' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                    Weekly (This Week)
                </button>
                <button
                    onClick={() => setType('monthly')}
                    className={`px-4 py-2 rounded ${type === 'monthly' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                    Monthly (This Month)
                </button>
                <button
                    onClick={() => setType('yearly')}
                    className={`px-4 py-2 rounded ${type === 'yearly' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                    Yearly (This Year)
                </button>
                 <button
                    onClick={downloadCSV}
                    className="ml-auto px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                    Export CSV
                </button>
            </div>

            {loading ? (
                <div className="text-center py-8">Loading...</div>
            ) : (
                <>
                    <div className="h-80 w-full mb-8">
                        <h3 className="text-lg font-semibold mb-4 text-center">BMI Trend</h3>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis domain={['auto', 'auto']} />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="bmi" stroke="#4f46e5" activeDot={{ r: 8 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date/Time</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Weight (kg)</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Height (cm)</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">BMI</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {records.map((record) => (
                                    <tr key={record.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(record.recorded_at).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.weight}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.height}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-600">
                                            {record.bmi.toFixed(2)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {records.length === 0 && <p className="text-center py-4 text-gray-500">No records found for this period.</p>}
                    </div>
                </>
            )}
        </div>
      </div>
    </div>
  );
}
