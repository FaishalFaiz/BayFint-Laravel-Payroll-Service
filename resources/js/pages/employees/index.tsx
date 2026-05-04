import { Head, Link, useForm } from '@inertiajs/react';
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
    employees: Employee[];
    flash?: { success?: string };
    errors?: any;
}

export default function EmployeesIndex({ employees, flash, errors }: Props) {
    const [editingId, setEditingId] = useState<number | null>(null);

    const editForm = useForm({
        position: '',
        base_salary: 0,
        allowance: 0,
        deduction: 0,
    });

    const startEditing = (emp: Employee) => {
        setEditingId(emp.id);
        editForm.setData({
            position: emp.position,
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

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
            <Head title="Employee Directory | BayFint" />

            <nav className="fixed top-0 z-50 w-full bg-white border-b border-slate-200">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-md">
                            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                        <span className="text-xl font-bold tracking-tight text-slate-900">Bay<span className="text-blue-600">Fint</span></span>
                    </div>
                    <div className="flex items-center space-x-6">
                        <Link href="/dashboard" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">
                            Back to Dashboard
                        </Link>
                    </div>
                </div>
            </nav>

            <div className="pt-24 pb-12 px-6 max-w-7xl mx-auto space-y-8">
                {flash?.success && (
                    <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-emerald-800 flex items-center gap-3 shadow-sm">
                        <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <span className="text-sm font-medium">{flash.success}</span>
                    </div>
                )}
                {Object.values(errors || {}).map((err: any, i) => (
                    <div key={i} className="rounded-xl bg-rose-50 border border-rose-200 p-4 text-rose-800 flex items-center gap-3 shadow-sm">
                        <svg className="w-5 h-5 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <span className="text-sm font-medium">{err}</span>
                    </div>
                ))}

                <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider mb-3">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                            Team Management
                        </div>
                        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900">
                            Employee Directory
                        </h1>
                    </div>
                    <div className="text-sm text-slate-500 bg-slate-50 px-4 py-3 rounded-xl border border-slate-100 max-w-sm">
                        Employees self-register via your <Link href="/dashboard" className="text-blue-600 font-semibold hover:underline">Room Code</Link>. Configure their compensation details below.
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
                                                Editing {emp.name}'s Profile
                                            </h3>
                                        </div>
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-sm font-semibold text-slate-700 mb-1">Position / Job Title</label>
                                                    <input 
                                                        type="text" 
                                                        value={editForm.data.position} 
                                                        onChange={e => editForm.setData('position', e.target.value)}
                                                        className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm"
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-semibold text-slate-700 mb-1">Base Salary (Rp)</label>
                                                    <input 
                                                        type="number" 
                                                        value={editForm.data.base_salary} 
                                                        onChange={e => editForm.setData('base_salary', Number(e.target.value))}
                                                        className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm font-mono"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-sm font-semibold text-emerald-700 mb-1">Fixed Monthly Allowance (+)</label>
                                                    <input 
                                                        type="number" 
                                                        value={editForm.data.allowance} 
                                                        onChange={e => editForm.setData('allowance', Number(e.target.value))}
                                                        className="w-full px-4 py-2.5 bg-white border border-emerald-200 focus:border-emerald-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all shadow-sm font-mono"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-semibold text-rose-700 mb-1">Fixed Monthly Deduction (-)</label>
                                                    <input 
                                                        type="number" 
                                                        value={editForm.data.deduction} 
                                                        onChange={e => editForm.setData('deduction', Number(e.target.value))}
                                                        className="w-full px-4 py-2.5 bg-white border border-rose-200 focus:border-rose-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all shadow-sm font-mono"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-3 mt-8">
                                            <button 
                                                type="submit" 
                                                disabled={editForm.processing}
                                                className="px-6 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-sm"
                                            >
                                                Save Changes
                                            </button>
                                            <button 
                                                type="button" 
                                                onClick={cancelEditing}
                                                className="px-6 py-2.5 bg-white border border-slate-300 text-slate-700 text-sm font-semibold rounded-xl hover:bg-slate-50 transition-colors shadow-sm"
                                            >
                                                Cancel
                                            </button>
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
                                                    <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-xs font-semibold rounded-md border border-slate-200">ID: {emp.id}</span>
                                                </div>
                                                <div className="text-sm font-medium text-slate-600 mb-2">{emp.position || 'No Position Set'}</div>
                                                <div className="text-xs text-slate-400 flex items-center gap-1">
                                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                                    {emp.email}
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="flex flex-col md:flex-row gap-6 md:gap-12 items-start md:items-center w-full md:w-auto">
                                            <div className="space-y-1 bg-slate-50 p-4 rounded-2xl border border-slate-100 w-full md:w-auto min-w-[200px]">
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-slate-500">Base Salary</span>
                                                    <span className="font-bold text-slate-900">Rp {emp.base_salary.toLocaleString()}</span>
                                                </div>
                                                {emp.allowance > 0 && (
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-emerald-600">Allowance</span>
                                                        <span className="font-medium text-emerald-700">+Rp {emp.allowance.toLocaleString()}</span>
                                                    </div>
                                                )}
                                                {emp.deduction > 0 && (
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-rose-600">Deduction</span>
                                                        <span className="font-medium text-rose-700">-Rp {emp.deduction.toLocaleString()}</span>
                                                    </div>
                                                )}
                                            </div>
                                            
                                            <div className="flex md:flex-col gap-3 w-full md:w-auto">
                                                <button 
                                                    onClick={() => startEditing(emp)}
                                                    className="flex-1 md:w-full px-4 py-2 bg-white border border-slate-200 text-slate-700 text-sm font-semibold rounded-xl hover:bg-slate-50 transition-colors shadow-sm text-center"
                                                >
                                                    Edit Profile
                                                </button>
                                                <Link 
                                                    href={`/employees/${emp.id}`}
                                                    method="delete"
                                                    as="button"
                                                    className="flex-1 md:w-full px-4 py-2 bg-rose-50 text-rose-600 text-sm font-semibold rounded-xl hover:bg-rose-100 transition-colors text-center"
                                                >
                                                    Remove
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
