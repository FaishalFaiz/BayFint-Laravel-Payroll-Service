import AppLayout from '@/layouts/AppLayout';
import { Head, useForm, Link } from '@inertiajs/react';

interface Employee {
    id: number;
    name: string;
}

interface Payroll {
    id: number;
    employee: {
        name: string;
    };
    month: number;
    year: number;
    days_present: number;
    total_salary: number;
}

interface Props {
    payrolls: Payroll[];
    employees: Employee[];
}

export default function PayrollIndex({ payrolls, employees }: Props) {
    const { data, setData, post, processing, reset, errors } = useForm({
        employee_id: '',
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
        days_present: 22,
    });

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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/payrolls', {
            onSuccess: () => reset('employee_id', 'days_present'),
        });
    };

    return (
        <AppLayout title="Monthly Payroll Processing">
            <Head title="Payroll" />

            <div className="grid gap-8 lg:grid-cols-3">
                {/* Generation Form */}
                <div className="lg:col-span-1">
                    <div className="sticky top-24 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <h2 className="mb-6 text-lg font-bold text-slate-800">Process New Payroll</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700">Select Employee</label>
                                <select
                                    value={data.employee_id}
                                    onChange={(e) => setData('employee_id', e.target.value)}
                                    className="mt-1 block w-full rounded-xl border-slate-200 bg-slate-50 px-4 py-2 text-sm transition-focus focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                                >
                                    <option value="">-- Choose Employee --</option>
                                    {employees.map((emp) => (
                                        <option key={emp.id} value={emp.id}>{emp.name}</option>
                                    ))}
                                </select>
                                {errors.employee_id && <p className="mt-1 text-xs text-red-500">{errors.employee_id}</p>}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700">Month</label>
                                    <select
                                        value={data.month}
                                        onChange={(e) => setData('month', Number(e.target.value))}
                                        className="mt-1 block w-full rounded-xl border-slate-200 bg-slate-50 px-4 py-2 text-sm transition-focus focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                                    >
                                        {monthNames.map((name, index) => (
                                            <option key={index} value={index + 1}>{name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700">Year</label>
                                    <input
                                        type="number"
                                        value={data.year}
                                        onChange={(e) => setData('year', Number(e.target.value))}
                                        className="mt-1 block w-full rounded-xl border-slate-200 bg-slate-50 px-4 py-2 text-sm transition-focus focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700">Days Present</label>
                                <input
                                    type="number"
                                    value={data.days_present}
                                    onChange={(e) => setData('days_present', Number(e.target.value))}
                                    className="mt-1 block w-full rounded-xl border-slate-200 bg-slate-50 px-4 py-2 text-sm transition-focus focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                                    placeholder="e.g. 22"
                                />
                                {errors.days_present && <p className="mt-1 text-xs text-red-500">{errors.days_present}</p>}
                            </div>

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full rounded-xl bg-amber-500 px-4 py-3 font-semibold text-white shadow-lg shadow-amber-500/30 transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                                >
                                    Generate & Save
                                </button>
                                <p className="mt-3 text-center text-xs text-slate-400">
                                    Salary will be calculated using the employee's fixed profile data.
                                </p>
                            </div>
                        </form>
                    </div>
                </div>

                {/* History Table */}
                <div className="lg:col-span-2">
                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-slate-50 text-slate-500">
                                    <tr>
                                        <th className="px-6 py-4 font-semibold">Employee</th>
                                        <th className="px-6 py-4 font-semibold">Period</th>
                                        <th className="px-6 py-4 font-semibold">Days</th>
                                        <th className="px-6 py-4 font-semibold">Net Pay</th>
                                        <th className="px-6 py-4 font-semibold text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {payrolls.map((payroll) => (
                                        <tr key={payroll.id} className="transition-colors hover:bg-slate-50/50">
                                            <td className="px-6 py-4 font-semibold text-slate-900">
                                                {payroll.employee.name}
                                            </td>
                                            <td className="px-6 py-4 text-slate-600">
                                                {monthNames[payroll.month - 1]} {payroll.year}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">
                                                    {payroll.days_present} days
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 font-bold text-emerald-600">
                                                {formatCurrency(payroll.total_salary)}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <Link
                                                    href={`/payrolls/${payroll.id}`}
                                                    className="inline-flex items-center rounded-xl bg-blue-50 px-4 py-2 text-xs font-bold text-blue-600 transition-colors hover:bg-blue-600 hover:text-white"
                                                >
                                                    View Payslip
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                    {payrolls.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                                                No payroll records found for this period.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
