import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';

interface Props {
    auth: { user: any };
    room: any;
    categories: any[];
    stats: {
        total_employees: number;
        total_payroll: number;
        pending_process: number;
    };
    flash?: { success?: string };
}

export default function Dashboard({ auth, room, categories, stats, flash }: Props) {
    const [activeTab, setActiveTab] = useState('overview');

    const settingsForm = useForm({
        shift_start_time: room?.shift_start_time || '08:00',
        shift_end_time: room?.shift_end_time || '17:00',
        lateness_penalty_per_minute: room?.lateness_penalty_per_minute || 0,
    });

    const codeForm = useForm({});
    
    const categoryForm = useForm({
        name: '',
        type: 'earning',
    });

    const updateSettings = (e: React.FormEvent) => {
        e.preventDefault();
        settingsForm.put('/room/settings');
    };

    const generateCode = () => {
        codeForm.post('/room/generate-code');
    };

    const addCategory = (e: React.FormEvent) => {
        e.preventDefault();
        categoryForm.post('/categories', {
            onSuccess: () => categoryForm.reset('name'),
        });
    };

    const isCodeActive = room?.code && new Date(room?.code_expires_at) > new Date();

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
            <Head title="Admin Dashboard | BayFint" />

            {/* Topbar */}
            <nav className="fixed top-0 z-50 w-full bg-white border-b border-slate-200">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-md">
                            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                        <span className="text-xl font-bold tracking-tight text-slate-900">Bay<span className="text-blue-600">Fint</span></span>
                    </div>
                    <div className="flex items-center space-x-6 text-sm font-medium">
                        <span className="text-slate-500 hidden sm:inline-block">Welcome, {auth.user.name}</span>
                        <Link href="/logout" method="post" as="button" className="text-slate-600 hover:text-blue-600 transition-colors">
                            Sign Out
                        </Link>
                    </div>
                </div>
            </nav>

            <div className="pt-24 pb-12 px-6 max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
                
                {/* Sidebar Navigation */}
                <aside className="lg:w-64 shrink-0">
                    <div className="sticky top-28 bg-white rounded-2xl shadow-sm border border-slate-200 p-4">
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 px-3">Menu</div>
                        <nav className="space-y-1">
                            <button 
                                onClick={() => setActiveTab('overview')}
                                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${activeTab === 'overview' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                                Overview
                            </button>
                            <button 
                                onClick={() => setActiveTab('configuration')}
                                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${activeTab === 'configuration' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                Room Settings
                            </button>
                            <button 
                                onClick={() => setActiveTab('categories')}
                                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${activeTab === 'categories' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                                Payroll Rules
                            </button>
                        </nav>

                        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-8 mb-4 px-3">Management</div>
                        <nav className="space-y-1">
                            <Link 
                                href="/employees"
                                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                                Employees
                            </Link>
                            <Link 
                                href="/payrolls"
                                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                Payroll Vault
                            </Link>
                        </nav>
                    </div>
                </aside>

                {/* Main Content Area */}
                <main className="flex-1 min-w-0">
                    {flash?.success && (
                        <div className="mb-6 rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-emerald-800 flex items-center gap-3">
                            <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            <span className="text-sm font-medium">{flash.success}</span>
                        </div>
                    )}

                    {activeTab === 'overview' && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold text-slate-900">Dashboard Overview</h2>
                            <div className="grid sm:grid-cols-3 gap-6">
                                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                                    <div className="text-sm font-medium text-slate-500 mb-1">Total Employees</div>
                                    <div className="text-3xl font-bold text-slate-900">{stats.total_employees}</div>
                                </div>
                                <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 shadow-md text-white">
                                    <div className="text-sm font-medium text-blue-100 mb-1">Total Payroll (This Month)</div>
                                    <div className="text-3xl font-bold">Rp {stats.total_payroll.toLocaleString()}</div>
                                </div>
                                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                                    <div className="text-sm font-medium text-slate-500 mb-1">Pending Generation</div>
                                    <div className="text-3xl font-bold text-slate-900">{stats.pending_process}</div>
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900 mb-1">Room Access Code</h3>
                                    <p className="text-sm text-slate-500">
                                        {isCodeActive 
                                            ? `Share this code with employees to let them register into your room.`
                                            : 'No active room code. Generate one to allow new registrations.'}
                                    </p>
                                    {isCodeActive && (
                                        <div className="mt-3 inline-block px-4 py-2 bg-slate-100 rounded-lg text-lg font-bold text-slate-900 tracking-widest">
                                            {room.code}
                                        </div>
                                    )}
                                </div>
                                <button 
                                    onClick={generateCode}
                                    disabled={codeForm.processing}
                                    className="px-6 py-2.5 bg-slate-900 text-white text-sm font-semibold rounded-full hover:bg-slate-800 transition-colors whitespace-nowrap shadow-sm"
                                >
                                    {isCodeActive ? 'Rotate Code' : 'Generate Code'}
                                </button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'configuration' && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold text-slate-900">Room Settings</h2>
                            <form onSubmit={updateSettings} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-6">
                                <div className="grid sm:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">Shift Start Time</label>
                                        <input 
                                            type="time" 
                                            value={settingsForm.data.shift_start_time}
                                            onChange={e => settingsForm.setData('shift_start_time', e.target.value)}
                                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">Shift End Time</label>
                                        <input 
                                            type="time" 
                                            value={settingsForm.data.shift_end_time}
                                            onChange={e => settingsForm.setData('shift_end_time', e.target.value)}
                                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                                        />
                                    </div>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Lateness Penalty (Rp / Minute)</label>
                                    <input 
                                        type="number" 
                                        value={settingsForm.data.lateness_penalty_per_minute}
                                        onChange={e => settingsForm.setData('lateness_penalty_per_minute', Number(e.target.value))}
                                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                                    />
                                    <p className="mt-2 text-xs text-slate-500">This amount will be deducted for every minute an employee clocks in late.</p>
                                </div>

                                <div className="pt-4 border-t border-slate-100 flex justify-end">
                                    <button 
                                        type="submit" 
                                        disabled={settingsForm.processing}
                                        className="px-6 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-full hover:bg-blue-700 transition-colors shadow-sm"
                                    >
                                        Save Changes
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {activeTab === 'categories' && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold text-slate-900">Payroll Rules</h2>
                            
                            <form onSubmit={addCategory} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row gap-4 items-end">
                                <div className="flex-1 w-full">
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Rule Name (e.g., Overtime)</label>
                                    <input 
                                        type="text" 
                                        value={categoryForm.data.name}
                                        onChange={e => categoryForm.setData('name', e.target.value)}
                                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                                        required
                                    />
                                </div>
                                <div className="w-full md:w-48">
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Type</label>
                                    <select 
                                        value={categoryForm.data.type}
                                        onChange={e => categoryForm.setData('type', e.target.value)}
                                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                                    >
                                        <option value="earning">Earning (+)</option>
                                        <option value="deduction">Deduction (-)</option>
                                    </select>
                                </div>
                                <button 
                                    type="submit"
                                    disabled={categoryForm.processing}
                                    className="px-6 py-2.5 bg-slate-900 text-white text-sm font-semibold rounded-xl hover:bg-slate-800 transition-colors shadow-sm w-full md:w-auto h-[46px]"
                                >
                                    Add Rule
                                </button>
                            </form>

                            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                                {categories.length === 0 ? (
                                    <div className="p-8 text-center text-sm text-slate-500">No payroll rules configured.</div>
                                ) : (
                                    <div className="divide-y divide-slate-100">
                                        {categories.map(cat => (
                                            <div key={cat.id} className="p-4 flex justify-between items-center hover:bg-slate-50 transition-colors">
                                                <div className="flex items-center gap-3">
                                                    <span className={`w-2 h-2 rounded-full ${cat.type === 'earning' ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                                                    <div>
                                                        <div className="font-semibold text-slate-900">{cat.name}</div>
                                                        <div className="text-xs text-slate-500 capitalize">{cat.type}</div>
                                                    </div>
                                                </div>
                                                <Link 
                                                    href={`/categories/${cat.id}`} 
                                                    method="delete" 
                                                    as="button"
                                                    className="text-xs font-medium text-rose-600 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-lg transition-colors"
                                                >
                                                    Delete
                                                </Link>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
