import { Head, Link } from '@inertiajs/react';

interface Payroll {
    id: number;
    month: number;
    year: number;
    days_present: number;
    total_salary: number;
    employee: {
        name: string;
        position: string;
        base_salary: number;
        allowance: number;
        deduction: number;
    };
    created_at: string;
}

interface Props {
    payroll: Payroll;
}

export default function Payslip({ payroll }: Props) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="min-h-screen bg-slate-100 py-12 font-sans text-slate-900 print:bg-white print:py-0">
            <Head title={`Payslip - ${payroll.employee.name} - ${monthNames[payroll.month - 1]} ${payroll.year}`} />

            <div className="mx-auto max-w-3xl">
                {/* Actions (Hidden on print) */}
                <div className="mb-6 flex items-center justify-between px-4 print:hidden">
                    <Link
                        href="/payrolls"
                        className="flex items-center text-sm font-medium text-slate-600 hover:text-blue-600"
                    >
                        <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Payroll List
                    </Link>
                    <button
                        onClick={handlePrint}
                        className="rounded-xl bg-blue-600 px-6 py-2.5 font-bold text-white shadow-lg shadow-blue-500/30 transition-transform hover:scale-105 active:scale-95"
                    >
                        Print Payslip
                    </button>
                </div>

                {/* Payslip Document */}
                <div className="overflow-hidden rounded-2xl bg-white shadow-xl shadow-slate-200/50 print:rounded-none print:shadow-none">
                    {/* Header */}
                    <div className="border-b border-slate-100 bg-slate-50/50 px-10 py-12">
                        <div className="flex items-start justify-between">
                            <div>
                                <h1 className="text-3xl font-black tracking-tight text-slate-900">
                                    BAY<span className="text-blue-600">FINT</span>
                                </h1>
                                <p className="mt-1 text-sm text-slate-400 font-medium">Payroll Service System</p>
                            </div>
                            <div className="text-right">
                                <h2 className="text-xl font-bold text-slate-800 uppercase tracking-wider">Salary Slip</h2>
                                <p className="text-sm text-slate-500 font-medium">{monthNames[payroll.month - 1]} {payroll.year}</p>
                            </div>
                        </div>

                        <div className="mt-12 grid grid-cols-2 gap-8">
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Employee Details</p>
                                <div className="mt-2">
                                    <p className="text-lg font-bold text-slate-900">{payroll.employee.name}</p>
                                    <p className="text-sm text-slate-600">{payroll.employee.position}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Payment Info</p>
                                <div className="mt-2">
                                    <p className="text-sm text-slate-600">ID: #PAY-{payroll.id.toString().padStart(5, '0')}</p>
                                    <p className="text-sm text-slate-600">Date: {new Date(payroll.created_at).toLocaleDateString()}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Breakdown */}
                    <div className="px-10 py-10">
                        <div className="grid grid-cols-2 gap-12">
                            {/* Earnings */}
                            <div>
                                <h3 className="border-b border-slate-200 pb-2 text-sm font-bold text-slate-800 uppercase tracking-wide">Earnings</h3>
                                <div className="mt-4 space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-500">Base Salary</span>
                                        <span className="font-semibold text-slate-700">{formatCurrency(payroll.employee.base_salary)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-500">Allowances</span>
                                        <span className="font-semibold text-slate-700">{formatCurrency(payroll.employee.allowance)}</span>
                                    </div>
                                    <div className="mt-4 border-t border-slate-100 pt-3 flex justify-between font-bold text-slate-900">
                                        <span>Total Earnings</span>
                                        <span>{formatCurrency(Number(payroll.employee.base_salary) + Number(payroll.employee.allowance))}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Deductions */}
                            <div>
                                <h3 className="border-b border-slate-200 pb-2 text-sm font-bold text-slate-800 uppercase tracking-wide">Deductions</h3>
                                <div className="mt-4 space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-500">Fixed Deductions</span>
                                        <span className="font-semibold text-red-600">({formatCurrency(payroll.employee.deduction)})</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-500">Absence Deductions</span>
                                        <span className="font-semibold text-slate-400">-</span>
                                    </div>
                                    <div className="mt-4 border-t border-slate-100 pt-3 flex justify-between font-bold text-slate-900">
                                        <span>Total Deductions</span>
                                        <span className="text-red-600">{formatCurrency(payroll.employee.deduction)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Attendance Summary */}
                        <div className="mt-12 rounded-xl bg-slate-50 p-6 flex justify-between items-center border border-slate-100">
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Attendance Record</p>
                                <p className="mt-1 text-sm font-bold text-slate-700">{payroll.days_present} Days Present</p>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Net Take-Home Pay</p>
                                <p className="mt-1 text-2xl font-black text-blue-600">{formatCurrency(payroll.total_salary)}</p>
                            </div>
                        </div>

                        {/* Signature Area */}
                        <div className="mt-20 flex justify-between px-4">
                            <div className="text-center">
                                <div className="mb-16 h-px w-48 bg-slate-200" />
                                <p className="text-xs font-bold text-slate-400 uppercase">Employee Signature</p>
                            </div>
                            <div className="text-center">
                                <div className="mb-16 h-px w-48 bg-slate-200" />
                                <p className="text-xs font-bold text-slate-400 uppercase">Finance Admin</p>
                            </div>
                        </div>
                    </div>

                    {/* Footer Note */}
                    <div className="bg-slate-50/50 px-10 py-6 text-center text-[10px] text-slate-400 font-medium">
                        This is a computer-generated payslip and does not require a physical signature.
                        <br />Generated via BayFint Payroll Service.
                    </div>
                </div>
            </div>
        </div>
    );
}
