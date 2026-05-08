import { Link } from '@inertiajs/react';

interface Props {
    payrolls: any[];
    employees: any[];
    generateForm: any;
}

export default function PayrollVault({ payrolls, employees, generateForm }: Props) {
    const generatePayroll = (e: React.FormEvent) => {
        e.preventDefault();
        generateForm.post('/payrolls', {
            onSuccess: () => generateForm.reset('employee_id'),
        });
    };

    return (
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
    );
}
