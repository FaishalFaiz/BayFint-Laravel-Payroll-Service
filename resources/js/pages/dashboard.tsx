import AppLayout from '@/layouts/AppLayout';
import { Head, Link } from '@inertiajs/react';

interface Props {
    stats: {
        total_spending: number;
        total_employees: number;
        processed_payrolls: number;
        month_name: string;
        year: number;
    };
}

export default function Dashboard({ stats }: Props) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    return (
        <AppLayout title="Dashboard Overview">
            <Head title="Dashboard" />

            <div className="grid gap-6 md:grid-cols-3">
                {/* Total Spending Card */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
                    <div className="mb-4 flex items-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <h3 className="text-sm font-medium text-slate-500">Total Spending</h3>
                            <p className="text-xs text-slate-400">{stats.month_name} {stats.year}</p>
                        </div>
                    </div>
                    <div className="flex items-baseline justify-between">
                        <p className="text-2xl font-bold text-slate-900">{formatCurrency(stats.total_spending)}</p>
                    </div>
                </div>

                {/* Total Employees Card */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
                    <div className="mb-4 flex items-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <h3 className="text-sm font-medium text-slate-500">Total Employees</h3>
                            <p className="text-xs text-slate-400">Active profiles</p>
                        </div>
                    </div>
                    <div className="flex items-baseline justify-between">
                        <p className="text-2xl font-bold text-slate-900">{stats.total_employees}</p>
                        <p className="text-sm font-medium text-emerald-600">People</p>
                    </div>
                </div>

                {/* Processed Payrolls Card */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
                    <div className="mb-4 flex items-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
                            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <h3 className="text-sm font-medium text-slate-500">Processed</h3>
                            <p className="text-xs text-slate-400">This month</p>
                        </div>
                    </div>
                    <div className="flex items-baseline justify-between">
                        <p className="text-2xl font-bold text-slate-900">{stats.processed_payrolls}</p>
                        <div className="flex items-center space-x-1">
                            <div className="h-2 w-16 overflow-hidden rounded-full bg-slate-100">
                                <div 
                                    className="h-full bg-amber-500 transition-all" 
                                    style={{ width: `${stats.total_employees > 0 ? (stats.processed_payrolls / stats.total_employees) * 100 : 0}%` }}
                                />
                            </div>
                            <span className="text-xs text-slate-400">
                                {Math.round(stats.total_employees > 0 ? (stats.processed_payrolls / stats.total_employees) * 100 : 0)}%
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions / Welcome */}
            <div className="mt-8 overflow-hidden rounded-2xl bg-blue-600 p-8 text-white shadow-xl shadow-blue-500/20">
                <div className="relative z-10 max-w-2xl">
                    <h2 className="text-3xl font-bold">Welcome back, Admin! 👋</h2>
                    <p className="mt-4 text-blue-100">
                        Everything is running smoothly. You have {stats.total_employees - stats.processed_payrolls} pending payrolls for {stats.month_name}.
                    </p>
                    <div className="mt-6 flex space-x-4">
                        <Link 
                            href="/payrolls"
                            className="rounded-xl bg-white px-6 py-3 font-semibold text-blue-600 transition-transform hover:scale-105 active:scale-95"
                        >
                            Process Payroll
                        </Link>
                        <Link 
                            href="/employees"
                            className="rounded-xl bg-blue-700 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-800"
                        >
                            Manage Employees
                        </Link>
                    </div>
                </div>
                {/* Decorative Elements */}
                <div className="absolute right-0 top-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-blue-500 opacity-20" />
                <div className="absolute bottom-0 right-0 -mb-16 mr-32 h-48 w-48 rounded-full bg-blue-400 opacity-20" />
            </div>
        </AppLayout>
    );
}
