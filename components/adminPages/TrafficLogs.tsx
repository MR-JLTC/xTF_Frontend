import React, { useEffect, useState } from 'react';
import apiClient from '../../services/api';
import { TrafficLog } from '../../types';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { Activity, Globe, Clock, Trash2, RefreshCw } from 'lucide-react';

const TrafficLogs: React.FC = () => {
    const [logs, setLogs] = useState<TrafficLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isLive, setIsLive] = useState(true);

    const fetchLogs = async () => {
        try {
            const response = await apiClient.get('/traffic/logs?limit=50');
            setLogs(response.data);
            setError(null);
        } catch (e) {
            console.error('Failed to fetch traffic logs:', e);
            setError('Failed to fetch traffic logs.');
        } finally {
            setLoading(false);
        }
    };

    const clearLogs = async () => {
        if (!confirm('Are you sure you want to clear all traffic logs?')) return;
        try {
            await apiClient.delete('/traffic/logs');
            setLogs([]);
        } catch (e) {
            alert('Failed to clear logs');
        }
    };

    useEffect(() => {
        fetchLogs();

        let interval: any;
        if (isLive) {
            interval = setInterval(fetchLogs, 5000); // Update every 5 seconds
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isLive]);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">Live Traffic Logs</h1>
                    <p className="text-slate-500 text-sm mt-1">Monitor user activity and visitor IP addresses in real-time.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant={isLive ? 'primary' : 'secondary'}
                        onClick={() => setIsLive(!isLive)}
                        className="flex items-center gap-2"
                    >
                        <RefreshCw className={`h-4 w-4 ${isLive ? 'animate-spin' : ''}`} />
                        {isLive ? 'Live Updates ON' : 'Live Updates OFF'}
                    </Button>
                    <Button variant="danger" onClick={clearLogs} className="flex items-center gap-2">
                        <Trash2 className="h-4 w-4" />
                        Clear Logs
                    </Button>
                </div>
            </div>

            <Card>
                {loading && logs.length === 0 ? (
                    <div className="p-8 text-center text-slate-500">Loading traffic logs...</div>
                ) : error ? (
                    <div className="p-8 text-center text-red-500">{error}</div>
                ) : logs.length === 0 ? (
                    <div className="p-8 text-center text-slate-500">No traffic logs recorded yet.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-200">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Timestamp</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">IP Address</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Activity</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Method/URL</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">User Agent</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-slate-200">
                                {logs.map((log) => (
                                    <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                                            <div className="flex items-center gap-2">
                                                <Clock className="h-3 w-3 opacity-50" />
                                                {new Date(log.timestamp).toLocaleTimeString()}
                                                <span className="text-xs opacity-50 ml-1">
                                                    {new Date(log.timestamp).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 font-mono">
                                            <div className="flex items-center gap-2">
                                                <Globe className="h-3 w-3 text-blue-500" />
                                                {log.ip_address}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                                            <div className="flex items-center gap-2">
                                                <Activity className="h-3 w-3 text-green-500" />
                                                {log.activity}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-500 max-w-xs truncate">
                                            <span className="font-bold text-slate-700 mr-2">{log.method}</span>
                                            {log.url}
                                        </td>
                                        <td className="px-6 py-4 text-xs text-slate-400 max-w-xs truncate" title={log.user_agent}>
                                            {log.user_agent}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </Card>
        </div>
    );
};

export default TrafficLogs;
