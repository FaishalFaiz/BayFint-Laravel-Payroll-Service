import { Head, Link } from '@inertiajs/react';

interface Props {
    payroll: any;
}

export default function Payslip({ payroll }: Props) {
    const d = payroll.details;

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 py-12 px-6 flex justify-center">
            <Head title={`Payslip | ${payroll.employee.name}`} />

            <div className="w-full max-w-3xl">
                {/* Print Controls */}
                <div className="mb-6 flex justify-between items-center print:hidden">
                    <Link 
                        href="/payrolls"
                        className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                        Back to Vault
                    </Link>
                    <button 
                        onClick={() => window.print()}
                        className="flex items-center gap-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-all px-5 py-2.5 rounded-xl shadow-md shadow-blue-500/30"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                        Print Document
                    </button>
                </div>

                {/* Payslip Document */}
                <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden print:shadow-none print:border-none print:rounded-none">
                    
                    {/* Header */}
                    <div className="bg-slate-900 p-8 text-white flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </div>
                            <div>
                                <h1 className="text-2xl font-black tracking-tight">BayFint</h1>
                                <p className="text-slate-400 text-xs font-medium uppercase tracking-widest mt-0.5">Official Payslip</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-3xl font-extrabold text-white">Rp {payroll.total_salary.toLocaleString()}</div>
                            <div className="text-sm font-medium text-blue-300 mt-1">Net Pay Total</div>
                        </div>
                    </div>

                    {/* Metadata Box */}
                    <div className="p-8 border-b border-slate-100 grid md:grid-cols-2 gap-8 bg-slate-50/50">
                        <div>
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Employee Details</h3>
                            <div className="space-y-1">
                                <div className="text-lg font-bold text-slate-900">{payroll.employee.name}</div>
                                <div className="text-sm text-slate-600">{payroll.employee.position}</div>
                                <div className="text-sm text-slate-500 mt-2">ID: #{payroll.employee.id}</div>
                            </div>
                        </div>
                        <div className="md:text-right">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Payment Period</h3>
                            <div className="space-y-1">
                                <div className="text-lg font-bold text-slate-900">
                                    {new Date(payroll.year, payroll.month - 1).toLocaleString('default', { month: 'long' })} {payroll.year}
                                </div>
                                <div className="text-sm text-slate-600">Generated: {new Date(payroll.created_at).toLocaleDateString()}</div>
                                <div className="text-sm text-slate-500 mt-2">
                                    Status: <span className="text-emerald-600 font-semibold uppercase">{payroll.status}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Ledger Details */}
                    <div className="p-8">
                        <div className="rounded-2xl border border-slate-200 overflow-hidden">
                            <div className="bg-slate-50 border-b border-slate-200 px-6 py-3 flex justify-between items-center text-xs font-bold text-slate-500 uppercase tracking-wider">
                                <div>Description</div>
                                <div>Amount</div>
                            </div>
                            
                            <div className="divide-y divide-slate-100">
                                {/* Earnings Section */}
                                <div className="px-6 py-4 flex items-center gap-3 bg-emerald-50/50">
                                    <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                                    <h4 className="font-bold text-emerald-800">Earnings</h4>
                                </div>
                                
                                <div className="px-6 py-4 flex justify-between items-center">
                                    <div className="text-sm font-medium text-slate-700">Base Salary</div>
                                    <div className="font-semibold text-slate-900">Rp {d.base_salary.toLocaleString()}</div>
                                </div>
                                <div className="px-6 py-4 flex justify-between items-center">
                                    <div className="text-sm font-medium text-slate-700">Fixed Allowance</div>
                                    <div className="font-semibold text-slate-900">Rp {d.fixed_allowance.toLocaleString()}</div>
                                </div>

                                {/* Deductions Section */}
                                <div className="px-6 py-4 flex items-center gap-3 bg-rose-50/50">
                                    <svg className="w-5 h-5 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" /></svg>
                                    <h4 className="font-bold text-rose-800">Deductions</h4>
                                </div>

                                <div className="px-6 py-4 flex justify-between items-center">
                                    <div className="text-sm font-medium text-slate-700">Fixed Deduction</div>
                                    <div className="font-semibold text-rose-600">-Rp {d.fixed_deduction.toLocaleString()}</div>
                                </div>
                                <div className="px-6 py-4 flex justify-between items-center">
                                    <div className="text-sm font-medium text-slate-700">Lateness Penalty ({d.days_present} Days Present)</div>
                                    <div className="font-semibold text-rose-600">-Rp {d.total_lateness_penalty.toLocaleString()}</div>
                                </div>
                            </div>
                        </div>

                        {/* Footer Summary */}
                        <div className="mt-8 flex items-center justify-between p-6 bg-blue-50 rounded-2xl border border-blue-100">
                            <div className="text-sm text-blue-800 max-w-sm">
                                This document is an immutable record. For any discrepancies, please contact your administrator.
                            </div>
                            <div className="text-right">
                                <div className="text-sm font-bold text-blue-600 uppercase tracking-wider mb-1">Take Home Pay</div>
                                <div className="text-3xl font-black text-blue-900">Rp {payroll.total_salary.toLocaleString()}</div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
