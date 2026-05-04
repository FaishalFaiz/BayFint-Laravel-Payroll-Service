import { Head, Link, useForm } from '@inertiajs/react';

interface Props {
    employees: { id: number; name: string }[];
    payrolls: any[];
    flash?: { success?: string };
    errors?: any;
}

export default function PayrollsIndex({ employees, payrolls, flash, errors }: Props) {
    const generateForm = useForm({
        employee_id: '',
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
    });

    const generatePayroll = (e: React.FormEvent) => {
        e.preventDefault();
        generateForm.post('/payrolls', {
            onSuccess: () => generateForm.reset('employee_id'),
        });
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
            <Head title="Payroll Vault | BayFint" />

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

            <div className="pt-24 pb-12 px-6 max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
                
                <main className="lg:w-2/3 space-y-6">
                    {flash?.success && (
                        <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-emerald-800 flex items-center gap-3 shadow-sm">
                            <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            <span className="text-sm font-medium">{flash.success}</span>
                        </div>
                    )}
                    {Object.values(errors || {}).map((err: any, i) => (
                        <div className="rounded-xl bg-rose-50 border border-rose-200 p-4 text-rose-800 flex items-center gap-3 shadow-sm">
                            <svg className="w-5 h-5 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            <span className="text-sm font-medium">{err}</span>
                        </div>
                    ))}

                    <header className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-3">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                            Ledger History
                        </div>
                        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-2">
                            Payroll Vault
                        </h1>
                        <p className="text-slate-500">Access and review securely generated, immutable payslip records.</p>
                    </header>

                    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                        {payrolls.length === 0 ? (
                            <div className="p-12 text-center flex flex-col items-center">
                                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 mb-4">
                                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 mb-1">Vault is empty</h3>
                                <p className="text-slate-500">Generate your first payroll from the panel on the right.</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-100">
                                {payrolls.map(payroll => (
                                    <div key={payroll.id} className="p-6 hover:bg-slate-50 transition-colors flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-lg">
                                                {payroll.employee.name.charAt(0)}
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold text-slate-900">{payroll.employee.name}</h3>
                                                <div className="text-sm font-medium text-slate-500 flex items-center gap-2">
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                                    {new Date(payroll.year, payroll.month - 1).toLocaleString('default', { month: 'long' })} {payroll.year}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                                            <div className="text-right">
                                                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Net Pay</div>
                                                <div className="font-bold text-lg text-slate-900">Rp {payroll.total_salary.toLocaleString()}</div>
                                            </div>
                                            <Link 
                                                href={`/payrolls/${payroll.id}`}
                                                className="px-4 py-2 bg-white border border-slate-200 text-slate-700 text-sm font-semibold rounded-xl hover:bg-slate-50 transition-colors shadow-sm"
                                            >
                                                View Slip
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </main>

                <aside className="lg:w-1/3">
                    <div className="sticky top-28">
                        <form onSubmit={generatePayroll} className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 space-y-6">
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-2">
                                    <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                    Generate Payroll
                                </h3>
                                <p className="text-sm text-slate-500">Compile salary, allowances, and penalties into an immutable record.</p>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1">Select Employee</label>
                                    <select 
                                        value={generateForm.data.employee_id}
                                        onChange={e => generateForm.setData('employee_id', e.target.value)}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                                        required
                                    >
                                        <option value="" disabled>-- Choose Personnel --</option>
                                        {employees.map(emp => (
                                            <option key={emp.id} value={emp.id}>{emp.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-1">Month</label>
                                        <select
                                            value={generateForm.data.month}
                                            onChange={e => generateForm.setData('month', Number(e.target.value))}
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                                            required
                                        >
                                            {Array.from({length: 12}, (_, i) => i + 1).map(m => (
                                                <option key={m} value={m}>{new Date(2000, m - 1).toLocaleString('default', {month: 'long'})}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-1">Year</label>
                                        <input 
                                            type="number" 
                                            value={generateForm.data.year}
                                            onChange={e => generateForm.setData('year', Number(e.target.value))}
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <button 
                                type="submit" 
                                disabled={generateForm.processing}
                                className="w-full bg-blue-600 text-white px-6 py-3.5 text-sm font-bold rounded-xl hover:bg-blue-700 transition-all shadow-md shadow-blue-500/30 flex justify-center items-center gap-2"
                            >
                                Execute Compilation
                            </button>
                        </form>
                    </div>
                </aside>

            </div>
        </div>
    );
}
