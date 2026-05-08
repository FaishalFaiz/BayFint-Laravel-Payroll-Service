import { useForm, router } from '@inertiajs/react';
import { formatDisplay, parseDisplay } from '../../utils/format';

interface Props {
    leaves: any[];
    adjustments: any[];
    employees: any[];
    payrolls: any[];
    generateForm: any;
}

export default function HistoryLog({ leaves, adjustments, employees, payrolls, generateForm }: Props) {
    const adjustmentForm = useForm({
        employee_id: '',
        name: '',
        amount: 0 as number | string,
        type: 'allowance',
    });

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

    return (
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
    );
}
