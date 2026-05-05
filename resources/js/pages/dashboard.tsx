import { Head, Link, useForm, router } from '@inertiajs/react';
import { useState } from 'react';

interface Employee {
    id: number;
    name: string;
    email: string;
    position: string;
    join_date: string;
    base_salary: number;
    allowance: number;
    deduction: number;
}

interface Props {
    auth: { user: any };
    room: any;
    employees: Employee[];
    payrolls: any[];
    leaves: any[];
    adjustments: any[];
    stats: {
        total_employees: number;
        total_payroll: number;
        pending_process: number;
    };
    flash?: { success?: string };
}

const formatDisplay = (val: string | number) => {
    if (val === '' || val === 0 || val === '0') {
return '';
}

    const parts = val.toString().split('.');
    const integer = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    return parts.length > 1 ? `${integer},${parts[1]}` : integer;
};

const parseDisplay = (val: string) => {
    // Remove dots (thousands) and replace comma with dot (decimal)
    return val.replace(/\./g, '').replace(',', '.');
};

export default function Dashboard({ auth, room, employees, payrolls, leaves, adjustments, stats, flash }: Props) {
    const [activeTab, setActiveTab] = useState('overview');
    const [editingId, setEditingId] = useState<number | null>(null);

    const settingsForm = useForm({
        name: room?.name || '',
        shift_start_time: room?.shift_start_time || '08:00',
        shift_end_time: room?.shift_end_time || '17:00',
        late_grace_period: room?.late_grace_period || 0,
        overtime_min_duration: room?.overtime_min_duration || 0,
        late_rule_type: room?.late_rule_type || 'variable',
        late_amount: room?.late_amount || 0,
        overtime_rule_type: room?.overtime_rule_type || 'variable',
        overtime_amount: room?.overtime_amount || 0,
        absence_amount: room?.absence_amount || 0,
    });

    const codeForm = useForm({});

    const adjustmentForm = useForm({
        employee_id: '',
        name: '',
        amount: 0 as number | string,
        type: 'allowance',
    });

    const editForm = useForm({
        position: '',
        base_salary: 0 as number | string,
        allowance: 0 as number | string,
        deduction: 0 as number | string,
    });

    const generateForm = useForm({
        employee_id: '',
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
    });

    const updateSettings = (e: React.FormEvent) => {
        e.preventDefault();
        settingsForm.put('/room/settings');
    };

    const generateCode = () => {
        codeForm.post('/room/generate-code');
    };

    const addAdjustment = (e: React.FormEvent) => {
        e.preventDefault();
        adjustmentForm.post('/adjustments', {
            onSuccess: () => adjustmentForm.reset('name', 'amount'),
        });
    };

    const approveLeave = (id: number) => {
        router.patch(`/leaves/${id}`, { status: 'approved' });
    };

    const rejectLeave = (id: number) => {
        router.patch(`/leaves/${id}`, { status: 'rejected' });
    };

    const massReset = () => {
        if (confirm('DANGER: This will delete ALL payslips, custom adjustments, and approved leaves for this month. Continue?')) {
            router.post('/payrolls/mass-reset', { month: generateForm.data.month, year: generateForm.data.year });
        }
    };

    const resetEmployee = (empId: number) => {
        if (confirm('Delete payslip and custom adjustments for this employee?')) {
            router.post('/payrolls/reset-employee', { employee_id: empId, month: generateForm.data.month, year: generateForm.data.year });
        }
    };

    const startEditing = (emp: Employee) => {
        setEditingId(emp.id);
        editForm.setData({
            position: emp.position || '',
            base_salary: emp.base_salary,
            allowance: emp.allowance || 0,
            deduction: emp.deduction || 0,
        });
    };

    const cancelEditing = () => {
        setEditingId(null);
        editForm.reset();
    };

    const saveEdit = (e: React.FormEvent, id: number) => {
        e.preventDefault();
        editForm.put(`/employees/${id}`, {
            onSuccess: () => setEditingId(null)
        });
    };

    const generatePayroll = (e: React.FormEvent) => {
        e.preventDefault();
        generateForm.post('/payrolls', {
            onSuccess: () => generateForm.reset('employee_id'),
        });
    };

    const isCodeActive = room?.code && new Date(room?.code_expires_at) > new Date();

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
            <Head title="Admin Dashboard | BayFint" />

            {/* Topbar */}
            <nav className="fixed top-0 z-50 w-full bg-white border-b border-slate-200">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-md">
                            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                        <span className="text-xl font-bold tracking-tight text-slate-900">Bay<span className="text-blue-600">Fint</span></span>
                    </Link>
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
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
                                History Log
                            </button>
                        </nav>

                        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-8 mb-4 px-3">Management</div>
                        <nav className="space-y-1">
                            <button
                                onClick={() => setActiveTab('employees')}
                                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${activeTab === 'employees' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                                Employees
                            </button>
                            <button
                                onClick={() => setActiveTab('payrolls')}
                                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${activeTab === 'payrolls' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                Payroll Vault
                            </button>
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
                                    <div className="text-3xl font-bold">Rp {Number(stats.total_payroll).toLocaleString('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</div>
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
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Workspace Name</label>
                                    <input
                                        type="text"
                                        value={settingsForm.data.name}
                                        onChange={e => settingsForm.setData('name', e.target.value)}
                                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                                        required
                                    />
                                </div>

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

                                <div className="grid sm:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
                                    <div className="space-y-4">
                                        <h3 className="font-bold text-slate-900">Lateness Rules</h3>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-2">Grace Period (Minutes)</label>
                                            <input
                                                type="number"
                                                value={settingsForm.data.late_grace_period}
                                                onChange={e => settingsForm.setData('late_grace_period', parseInt(e.target.value))}
                                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                                            />
                                        </div>
                                        <div className="flex gap-4">
                                            <div className="flex-1">
                                                <label className="block text-sm font-medium text-slate-700 mb-2">Rule Type</label>
                                                <select value={settingsForm.data.late_rule_type} onChange={e => settingsForm.setData('late_rule_type', e.target.value)} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl">
                                                    <option value="fixed">Fixed Per Incident</option>
                                                    <option value="variable">Variable Per Minute</option>
                                                </select>
                                            </div>
                                            <div className="flex-1">
                                                <label className="block text-sm font-medium text-slate-700 mb-2">Amount (Rp)</label>
                                                <input
                                                    type="text"
                                                    value={formatDisplay(settingsForm.data.late_amount)}
                                                    onChange={e => settingsForm.setData('late_amount', parseDisplay(e.target.value))}
                                                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="font-bold text-slate-900">Overtime Rules</h3>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-2">Min Duration (Minutes)</label>
                                            <input
                                                type="number"
                                                value={settingsForm.data.overtime_min_duration}
                                                onChange={e => settingsForm.setData('overtime_min_duration', parseInt(e.target.value))}
                                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                                            />
                                        </div>
                                        <div className="flex gap-4">
                                            <div className="flex-1">
                                                <label className="block text-sm font-medium text-slate-700 mb-2">Rule Type</label>
                                                <select value={settingsForm.data.overtime_rule_type} onChange={e => settingsForm.setData('overtime_rule_type', e.target.value)} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl">
                                                    <option value="fixed">Fixed Per Incident</option>
                                                    <option value="variable">Variable Per Hour</option>
                                                </select>
                                            </div>
                                            <div className="flex-1">
                                                <label className="block text-sm font-medium text-slate-700 mb-2">Amount (Rp)</label>
                                                <input
                                                    type="text"
                                                    value={formatDisplay(settingsForm.data.overtime_amount)}
                                                    onChange={e => settingsForm.setData('overtime_amount', parseDisplay(e.target.value))}
                                                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-slate-100">
                                    <h3 className="font-bold text-slate-900 mb-4">Absence Rules</h3>
                                    <div className="max-w-xs">
                                        <label className="block text-sm font-medium text-slate-700 mb-2">Deduction per Approved Izin (Rp)</label>
                                        <input
                                            type="text"
                                            value={formatDisplay(settingsForm.data.absence_amount)}
                                            onChange={e => settingsForm.setData('absence_amount', parseDisplay(e.target.value))}
                                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                                        />
                                    </div>
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
                        <div className="space-y-8">
                            <div className="flex justify-between items-center">
                                <h2 className="text-2xl font-bold text-slate-900">History Log & Adjustments</h2>
                                <button 
                                    onClick={massReset}
                                    className="px-4 py-2 bg-rose-50 text-rose-600 text-sm font-bold rounded-xl border border-rose-100 hover:bg-rose-100 transition-colors flex items-center gap-2"
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                    Reset All Month
                                </button>
                            </div>

                            {/* Pending Leaves Section */}
                            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                                <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center gap-2">
                                    <svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    <h3 className="font-bold text-slate-900">Pending Absence Requests</h3>
                                </div>
                                {leaves.filter(l => l.status === 'pending').length === 0 ? (
                                    <div className="p-8 text-center text-sm text-slate-500 italic">No pending requests.</div>
                                ) : (
                                    <div className="divide-y divide-slate-100">
                                        {leaves.filter(l => l.status === 'pending').map(leave => (
                                            <div key={leave.id} className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                                <div>
                                                    <div className="font-bold text-slate-900">{leave.employee.name}</div>
                                                    <div className="text-sm text-slate-500">Date: {new Date(leave.date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })}</div>
                                                    <div className="mt-2 p-3 bg-slate-50 rounded-xl text-sm border border-slate-100">"{leave.reason}"</div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button onClick={() => approveLeave(leave.id)} className="px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-lg hover:bg-emerald-700 transition-colors">Approve</button>
                                                    <button onClick={() => rejectLeave(leave.id)} className="px-4 py-2 bg-white border border-slate-200 text-rose-600 text-xs font-bold rounded-lg hover:bg-slate-50 transition-colors">Reject</button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Custom Adjustment Form */}
                            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6">
                                <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                                    <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                                    Add Custom Adjustment (One-Time)
                                </h3>
                                <form onSubmit={addAdjustment} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Employee</label>
                                        <select value={adjustmentForm.data.employee_id} onChange={e => adjustmentForm.setData('employee_id', e.target.value)} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm" required>
                                            <option value="">-- Select --</option>
                                            {employees.map(emp => <option key={emp.id} value={emp.id}>{emp.name}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Item Name</label>
                                        <input type="text" value={adjustmentForm.data.name} onChange={e => adjustmentForm.setData('name', e.target.value)} placeholder="e.g. THR Lebaran" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm" required />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Type & Amount</label>
                                        <div className="flex gap-2">
                                            <select value={adjustmentForm.data.type} onChange={e => adjustmentForm.setData('type', e.target.value)} className="px-2 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs">
                                                <option value="allowance">+</option>
                                                <option value="deduction">-</option>
                                            </select>
                                            <input type="text" value={formatDisplay(adjustmentForm.data.amount)} onChange={e => adjustmentForm.setData('amount', parseDisplay(e.target.value))} className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono" placeholder="Amount" required />
                                        </div>
                                    </div>
                                    <button type="submit" disabled={adjustmentForm.processing} className="px-6 py-2.5 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-slate-800 transition-colors h-[46px]">Add Log</button>
                                </form>
                            </div>

                            {/* The Performance Log Table */}
                            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-slate-50 border-b border-slate-200">
                                            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Employee</th>
                                            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase text-center">Lateness</th>
                                            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase text-center">Overtime</th>
                                            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase text-center">Approved Izin</th>
                                            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase text-center">Custom Adj</th>
                                            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {employees.map(emp => {
                                            const empLeaves = leaves.filter(l => l.employee_id === emp.id && l.status === 'approved');
                                            const empAdjustments = adjustments.filter(a => a.employee_id === emp.id);
                                            const hasPayslip = payrolls.some(p => p.employee_id === emp.id && p.month === generateForm.data.month && p.year === generateForm.data.year);

                                            return (
                                                <tr key={emp.id} className="hover:bg-slate-50/50 transition-colors">
                                                    <td className="px-6 py-4">
                                                        <div className="font-bold text-slate-900">{emp.name}</div>
                                                        <div className="text-xs text-slate-400">{emp.position}</div>
                                                    </td>
                                                    <td className="px-6 py-4 text-center">
                                                        <span className="px-2.5 py-1 rounded-full bg-rose-50 text-rose-600 text-xs font-bold border border-rose-100">Automated</span>
                                                    </td>
                                                    <td className="px-6 py-4 text-center">
                                                        <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-bold border border-emerald-100">Automated</span>
                                                    </td>
                                                    <td className="px-6 py-4 text-center">
                                                        <div className="font-bold text-slate-900">{empLeaves.length}x</div>
                                                    </td>
                                                    <td className="px-6 py-4 text-center">
                                                        <div className="space-y-1">
                                                            {empAdjustments.map(adj => (
                                                                <div key={adj.id} className="flex items-center justify-center gap-2 group">
                                                                    <span className={`text-xs font-medium ${adj.type === 'allowance' ? 'text-emerald-600' : 'text-rose-600'}`}>
                                                                        {adj.type === 'allowance' ? '+' : '-'}Rp {Number(adj.amount).toLocaleString('id-ID')}
                                                                    </span>
                                                                    <button onClick={() => router.delete(`/adjustments/${adj.id}`)} className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-rose-500 transition-all">
                                                                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                                                    </button>
                                                                </div>
                                                            ))}
                                                            {empAdjustments.length === 0 && <span className="text-xs text-slate-300">-</span>}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <div className="flex justify-end gap-2">
                                                            {hasPayslip && (
                                                                <span className="px-3 py-1 bg-blue-100 text-blue-700 text-[10px] font-bold rounded-lg flex items-center">PAYSLIP GENERATED</span>
                                                            )}
                                                            <button 
                                                                onClick={() => resetEmployee(emp.id)}
                                                                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                                                                title="Reset Logs & Payslip"
                                                            >
                                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === 'employees' && (
                        <div className="space-y-6">
                            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
                                <div>
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider mb-3">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                                        Team Management
                                    </div>
                                    <h1 className="text-3xl font-extrabold text-slate-900">
                                        Employee Directory
                                    </h1>
                                </div>
                            </header>

                            <div className="space-y-4">
                                {employees.length === 0 ? (
                                    <div className="bg-white p-12 text-center rounded-3xl border border-slate-200 shadow-sm flex flex-col items-center">
                                        <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 mb-4">
                                            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                                        </div>
                                        <h3 className="text-lg font-bold text-slate-900 mb-1">No employees found</h3>
                                        <p className="text-slate-500">Your directory is currently empty. Employees will appear here once they register.</p>
                                    </div>
                                ) : (
                                    employees.map(emp => (
                                        <div key={emp.id} className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden transition-all hover:shadow-md">
                                            {editingId === emp.id ? (
                                                <form onSubmit={(e) => saveEdit(e, emp.id)} className="p-6 md:p-8 bg-blue-50/30">
                                                    <div className="mb-6 pb-6 border-b border-slate-200 flex justify-between items-center">
                                                        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                                            <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                                            Editing {emp.name}
                                                        </h3>
                                                    </div>
                                                    <div className="grid md:grid-cols-2 gap-6">
                                                        <div className="space-y-4">
                                                            <div>
                                                                <label className="block text-sm font-semibold text-slate-700 mb-1">Position</label>
                                                                <input 
                                                                    type="text" 
                                                                    value={editForm.data.position} 
                                                                    onChange={e => editForm.setData('position', e.target.value)}
                                                                    className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm"
                                                                    required
                                                                />
                                                            </div>
                                                            <div>
                                                                <label className="block text-sm font-semibold text-slate-700 mb-1">Base Salary</label>
                                                                <div className="relative">
                                                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                                        <span className="text-slate-400 font-bold text-sm">Rp</span>
                                                                    </div>
                                                                    <input 
                                                                        type="text" 
                                                                        value={formatDisplay(editForm.data.base_salary)} 
                                                                        placeholder="0"
                                                                        onChange={e => {
                                                                            const raw = parseDisplay(e.target.value);

                                                                            if (/^[0-9.]*$/.test(raw)) {
                                                                                const parts = raw.split('.');

                                                                                if (parts.length <= 2) {
                                                                                    editForm.setData('base_salary', raw === '' ? 0 : raw);
                                                                                }
                                                                            }
                                                                        }}
                                                                        className="w-full pl-12 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm font-mono"
                                                                        required
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="space-y-4">
                                                            <div>
                                                                <label className="block text-sm font-semibold text-emerald-700 mb-1">Allowance (+)</label>
                                                                <div className="relative">
                                                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                                        <span className="text-emerald-400 font-bold text-sm">Rp</span>
                                                                    </div>
                                                                    <input 
                                                                        type="text" 
                                                                        value={formatDisplay(editForm.data.allowance)} 
                                                                        placeholder="0"
                                                                        onChange={e => {
                                                                            const raw = parseDisplay(e.target.value);

                                                                            if (/^[0-9.]*$/.test(raw)) {
                                                                                const parts = raw.split('.');

                                                                                if (parts.length <= 2) {
                                                                                    editForm.setData('allowance', raw === '' ? 0 : raw);
                                                                                }
                                                                            }
                                                                        }}
                                                                        className="w-full pl-12 pr-4 py-2.5 bg-white border border-emerald-200 focus:border-emerald-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all shadow-sm font-mono"
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <label className="block text-sm font-semibold text-rose-700 mb-1">Deduction (-)</label>
                                                                <div className="relative">
                                                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                                        <span className="text-rose-400 font-bold text-sm">Rp</span>
                                                                    </div>
                                                                    <input 
                                                                        type="text" 
                                                                        value={formatDisplay(editForm.data.deduction)} 
                                                                        placeholder="0"
                                                                        onChange={e => {
                                                                            const raw = parseDisplay(e.target.value);

                                                                            if (/^[0-9.]*$/.test(raw)) {
                                                                                const parts = raw.split('.');

                                                                                if (parts.length <= 2) {
                                                                                    editForm.setData('deduction', raw === '' ? 0 : raw);
                                                                                }
                                                                            }
                                                                        }}
                                                                        className="w-full pl-12 pr-4 py-2.5 bg-white border border-rose-200 focus:border-rose-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all shadow-sm font-mono"
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-3 mt-8">
                                                        <button type="submit" disabled={editForm.processing} className="px-6 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-sm">Save Changes</button>
                                                        <button type="button" onClick={cancelEditing} className="px-6 py-2.5 bg-white border border-slate-300 text-slate-700 text-sm font-semibold rounded-xl hover:bg-slate-50 transition-colors shadow-sm">Cancel</button>
                                                    </div>
                                                </form>
                                            ) : (
                                                <div className="flex flex-col md:flex-row justify-between p-6 md:p-8 gap-6">
                                                    <div className="flex items-start gap-4">
                                                        <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg shrink-0">
                                                            {emp.name.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <div className="flex items-center gap-3 mb-1">
                                                                <h3 className="text-xl font-bold text-slate-900">{emp.name}</h3>
                                                            </div>
                                                            <div className="text-sm font-medium text-slate-600 mb-2">{emp.position || 'No Position Set'}</div>
                                                            <div className="text-xs text-slate-400">{emp.email}</div>
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col md:flex-row gap-6 md:gap-12 items-start md:items-center w-full md:w-auto">
                                                        <div className="space-y-1 bg-slate-50 p-4 rounded-2xl border border-slate-100 w-full md:w-auto min-w-[200px]">
                                                            <div className="flex justify-between text-sm">
                                                                <span className="text-slate-500">Base Salary</span>
                                                                <span className="font-bold text-slate-900">Rp {Number(emp.base_salary).toLocaleString('id-ID')}</span>
                                                            </div>
                                                            <div className="flex justify-between text-sm">
                                                                <span className="text-emerald-600">Allowance</span>
                                                                <span className="font-medium text-emerald-700">+Rp {Number(emp.allowance).toLocaleString('id-ID')}</span>
                                                            </div>
                                                            <div className="flex justify-between text-sm">
                                                                <span className="text-rose-600">Deduction</span>
                                                                <span className="font-medium text-rose-700">-Rp {Number(emp.deduction).toLocaleString('id-ID')}</span>
                                                            </div>
                                                        </div>
                                                        <button onClick={() => startEditing(emp)} className="w-full md:w-auto px-6 py-2.5 bg-white border border-slate-200 text-slate-700 text-sm font-semibold rounded-xl hover:bg-slate-50 transition-colors shadow-sm">Edit Profile</button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'payrolls' && (
                        <div className="space-y-6">
                            <div className="flex flex-col lg:flex-row gap-8">
                                <div className="flex-1 space-y-6">
                                    <header className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
                                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-3">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                            Ledger History
                                        </div>
                                        <h1 className="text-3xl font-extrabold text-slate-900">Payroll Vault</h1>
                                    </header>

                                    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                                        {payrolls.length === 0 ? (
                                            <div className="p-12 text-center text-slate-500">Vault is empty.</div>
                                        ) : (
                                            <div className="divide-y divide-slate-100">
                                                {payrolls.map(payroll => (
                                                    <div key={payroll.id} className="p-6 hover:bg-slate-50 transition-colors flex justify-between items-center">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">{payroll.employee.name.charAt(0)}</div>
                                                            <div>
                                                                <h3 className="font-bold text-slate-900">{payroll.employee.name}</h3>
                                                                <div className="text-xs text-slate-500">{new Date(payroll.year, payroll.month - 1).toLocaleString('default', { month: 'long' })} {payroll.year}</div>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-6">
                                                            <div className="text-right">
                                                                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Net Pay</div>
                                                                <div className="font-bold text-slate-900">Rp {Number(payroll.total_salary).toLocaleString('id-ID')}</div>
                                                            </div>
                                                            <Link href={`/payrolls/${payroll.id}`} className="px-4 py-2 bg-white border border-slate-200 text-slate-700 text-sm font-semibold rounded-xl hover:bg-slate-50 shadow-sm">View Slip</Link>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <aside className="lg:w-80">
                                    <form onSubmit={generatePayroll} className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 space-y-6 sticky top-28">
                                        <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                            <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                            Generate
                                        </h3>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-semibold text-slate-700 mb-1">Employee</label>
                                                <select value={generateForm.data.employee_id} onChange={e => generateForm.setData('employee_id', e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium" required>
                                                    <option value="" disabled>-- Select --</option>
                                                    {employees.map(emp => <option key={emp.id} value={emp.id}>{emp.name}</option>)}
                                                </select>
                                            </div>
                                            <div className="grid grid-cols-1 gap-4">
                                                <div>
                                                    <label className="block text-sm font-semibold text-slate-700 mb-1">Month</label>
                                                    <select value={generateForm.data.month} onChange={e => generateForm.setData('month', Number(e.target.value))} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium" required>
                                                        {Array.from({length: 12}, (_, i) => i + 1).map(m => <option key={m} value={m}>{new Date(2000, m - 1).toLocaleString('default', {month: 'long'})}</option>)}
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-semibold text-slate-700 mb-1">Year</label>
                                                    <input type="number" value={generateForm.data.year} onChange={e => generateForm.setData('year', Number(e.target.value))} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium" required />
                                                </div>
                                            </div>
                                        </div>
                                        <button type="submit" disabled={generateForm.processing} className="w-full bg-blue-600 text-white px-6 py-3.5 text-sm font-bold rounded-xl hover:bg-blue-700 transition-all shadow-md shadow-blue-500/30">Execute</button>
                                    </form>
                                </aside>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
