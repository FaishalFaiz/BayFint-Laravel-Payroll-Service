import { Head, Link, useForm } from '@inertiajs/react';

interface Props {
    employee: any;
    attendances: any[];
    payrolls: any[];
    flash?: { success?: string };
    errors?: any;
}

export default function EmployeeDashboard({ employee, attendances, payrolls, flash, errors }: Props) {
    const clockInForm = useForm({});
    const clockOutForm = useForm({});

    const handleClockIn = () => clockInForm.post('/attendance/clock-in');
    const handleClockOut = () => clockOutForm.post('/attendance/clock-out');

    const todayAttendance = attendances.find(a => new Date(a.date).toDateString() === new Date().toDateString());

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
            <Head title="Employee Portal | BayFint" />

            <nav className="fixed top-0 z-50 w-full bg-white border-b border-slate-200 shadow-sm">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-md">
                            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                        </div>
                        <span className="text-xl font-bold tracking-tight text-slate-900">Bay<span className="text-indigo-600">Fint</span> Portal</span>
                    </div>
                    <div className="flex items-center space-x-6 text-sm font-medium">
                        <span className="text-slate-500 hidden sm:inline-block">Hello, {employee.name}</span>
                        <Link href="/employee/logout" method="post" as="button" className="text-slate-600 hover:text-indigo-600 transition-colors">
                            Sign Out
                        </Link>
                    </div>
                </div>
            </nav>

            <div className="pt-24 pb-12 px-6 max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
                
                <main className="lg:w-2/3 space-y-8">
                    {flash?.success && (
                        <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-emerald-800 flex items-center gap-3">
                            <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            <span className="text-sm font-medium">{flash.success}</span>
                        </div>
                    )}
                    {Object.values(errors || {}).map((err: any, i) => (
                        <div key={i} className="rounded-xl bg-rose-50 border border-rose-200 p-4 text-rose-800 flex items-center gap-3">
                            <svg className="w-5 h-5 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            <span className="text-sm font-medium">{err}</span>
                        </div>
                    ))}

                    {/* Today's Action */}
                    <section className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                            <div>
                                <h2 className="text-sm font-bold text-indigo-600 uppercase tracking-wider mb-2">Today</h2>
                                <div className="text-3xl font-extrabold text-slate-900 mb-1">
                                    {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                                </div>
                                <div className="text-sm font-medium text-slate-500">
                                    Status: <span className={`px-2 py-0.5 rounded-md ${todayAttendance ? (todayAttendance.clock_out ? 'bg-slate-100 text-slate-600' : 'bg-emerald-100 text-emerald-700') : 'bg-amber-100 text-amber-700'}`}>
                                        {todayAttendance ? (todayAttendance.clock_out ? 'Shift Completed' : 'Working') : 'Not Checked In'}
                                    </span>
                                </div>
                            </div>
                            
                            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                                {!todayAttendance && (
                                    <button 
                                        onClick={handleClockIn}
                                        disabled={clockInForm.processing}
                                        className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-500/30 hover:bg-indigo-700 transition-all hover:-translate-y-1 w-full"
                                    >
                                        Clock In Now
                                    </button>
                                )}
                                {todayAttendance && !todayAttendance.clock_out && (
                                    <button 
                                        onClick={handleClockOut}
                                        disabled={clockOutForm.processing}
                                        className="px-8 py-4 bg-white text-indigo-600 border border-indigo-200 rounded-2xl font-bold shadow-sm hover:bg-indigo-50 transition-all hover:-translate-y-1 w-full"
                                    >
                                        Clock Out
                                    </button>
                                )}
                                {todayAttendance && todayAttendance.clock_out && (
                                    <div className="px-8 py-4 bg-slate-100 text-slate-400 rounded-2xl font-bold text-center w-full border border-slate-200">
                                        Shift Completed
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>

                    {/* Attendance History */}
                    <section className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50">
                            <h3 className="font-bold text-slate-900">Recent Attendance</h3>
                        </div>
                        <div className="divide-y divide-slate-100">
                            {attendances.length === 0 ? (
                                <div className="p-8 text-center text-sm text-slate-500">No attendance records found.</div>
                            ) : (
                                attendances.map(a => (
                                    <div key={a.id} className="px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-indigo-50 rounded-xl flex flex-col items-center justify-center text-indigo-700">
                                                <span className="text-sm font-bold leading-none">{new Date(a.date).getDate()}</span>
                                                <span className="text-[10px] font-medium uppercase mt-0.5">{new Date(a.date).toLocaleString('default', { month: 'short' })}</span>
                                            </div>
                                            <div>
                                                <div className="text-sm font-semibold text-slate-900">
                                                    In: {new Date(a.clock_in).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                                    {a.clock_out && ` - Out: ${new Date(a.clock_out).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`}
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            {a.minutes_late > 0 ? (
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-rose-50 text-rose-700 border border-rose-100">
                                                    Late {a.minutes_late} min
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                                                    On Time
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </section>
                </main>

                {/* Sidebar Vault */}
                <aside className="lg:w-1/3">
                    <section className="bg-gradient-to-b from-slate-900 to-slate-800 rounded-3xl p-6 text-white shadow-xl shadow-slate-900/20 sticky top-28">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                                <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                            </div>
                            <h3 className="font-bold text-xl">Payslip Vault</h3>
                        </div>
                        
                        {payrolls.length === 0 ? (
                            <div className="text-center py-6 text-sm text-slate-400 bg-white/5 rounded-2xl border border-white/10">
                                No payslips available.
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {payrolls.map(p => (
                                    <div key={p.id} className="bg-white/10 hover:bg-white/20 transition-colors rounded-2xl p-4 border border-white/5 flex items-center justify-between group cursor-pointer">
                                        <div>
                                            <div className="text-sm font-medium text-slate-300 mb-1">{p.month}/{p.year}</div>
                                            <div className="font-bold text-white tracking-wide">Rp {Number(p.total_salary).toLocaleString('id-ID')}</div>
                                        </div>
                                        <svg className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                </aside>
                
            </div>
        </div>
    );
}
