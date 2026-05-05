import { Head, Link } from '@inertiajs/react';

interface Props {
    auth: {
        user: any;
    };
}

export default function Welcome({ auth }: Props) {
    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
            <Head title="BayFint - Modern Payroll Solutions" />

            {/* Navigation */}
            <nav className="fixed top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-slate-200">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/30">
                            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <span className="text-xl font-bold tracking-tight text-slate-900">Bay<span className="text-blue-600">Fint</span></span>
                    </div>
                    <div className="flex items-center space-x-4">
                        <Link 
                            href="/employee/login" 
                            className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors"
                        >
                            Employee Portal
                        </Link>
                        {auth.user ? (
                            <Link 
                                href="/dashboard" 
                                className="px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-full shadow-md hover:bg-blue-700 transition-all hover:shadow-lg hover:shadow-blue-500/30"
                            >
                                Open Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link 
                                    href="/login" 
                                    className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors"
                                >
                                    Admin Log In
                                </Link>
                                <Link 
                                    href="/register" 
                                    className="px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-full shadow-md hover:bg-blue-700 transition-all hover:shadow-lg hover:shadow-blue-500/30"
                                >
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <header className="relative pt-32 pb-24 overflow-hidden lg:pt-48 lg:pb-32">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]"></div>
                <div className="absolute top-0 right-0 -mr-32 -mt-32 w-96 h-96 rounded-full bg-blue-400/20 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 -ml-32 -mb-32 w-96 h-96 rounded-full bg-indigo-400/20 blur-3xl"></div>

                <div className="mx-auto max-w-7xl px-6 relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-sm font-medium mb-8">
                        <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse"></span>
                        Introducing Next-Gen Payroll
                    </div>
                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-8 leading-tight">
                        Payroll that works <br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">for your business</span>
                    </h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
                        Automate your payroll calculations, manage employee attendances with precision, and distribute payslips instantly. BayFint delivers enterprise-grade financial tools designed for modern teams.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href={auth.user ? "/dashboard" : "/register"}
                            className="inline-flex justify-center items-center px-8 py-4 bg-blue-600 text-white rounded-full font-semibold shadow-xl shadow-blue-500/30 hover:bg-blue-700 transition-all hover:-translate-y-1"
                        >
                            {auth.user ? "Go to Dashboard" : "Build Workspace"}
                            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                        </Link>
                        <Link
                            href="/employee/register"
                            className="inline-flex justify-center items-center px-8 py-4 bg-white text-indigo-600 rounded-full font-semibold border border-indigo-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all shadow-sm"
                        >
                            Join Workspace
                        </Link>
                    </div>
                </div>
            </header>

            {/* Features Section */}
            <section id="features" className="py-24 bg-white relative">
                <div className="mx-auto max-w-7xl px-6">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Everything you need to scale</h2>
                        <p className="text-slate-600 text-lg">Powerful automation and granular controls ensure your payroll is fast, compliant, and completely error-free.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Feature 1 */}
                        <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 hover:-translate-y-1 group">
                            <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">Multi-Tenant Workspaces</h3>
                            <p className="text-slate-600 leading-relaxed">
                                Complete data isolation. Generate secure, time-limited room codes for employees to securely enroll into your specific payroll instance.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 hover:-translate-y-1 group">
                            <div className="w-14 h-14 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">Automated Attendance</h3>
                            <p className="text-slate-600 leading-relaxed">
                                Built-in time tracking. The system automatically calculates tardiness based on your custom shift schedules and applies penalties directly to the payslip.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 hover:-translate-y-1 group">
                            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">Immutable Payslips</h3>
                            <p className="text-slate-600 leading-relaxed">
                                Ledger snapshots guarantee data integrity. Past payrolls are locked as JSON, meaning rule changes today will never corrupt historical records.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
            {/* Workflow Section */}
            <section id="workflow" className="py-24 bg-slate-50 relative overflow-hidden">
                <div className="mx-auto max-w-7xl px-6">
                    <div className="text-center max-w-3xl mx-auto mb-20">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Simplified Workflow</h2>
                        <p className="text-slate-600 text-lg">Getting your team onboarded and paid has never been this straightforward.</p>
                    </div>

                    <div className="relative">
                        {/* Connection Line (Desktop) */}
                        <div className="hidden lg:block absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 -translate-y-1/2 z-0"></div>
                        
                        <div className="grid lg:grid-cols-5 gap-8 relative z-10">
                            {/* Step 1 */}
                            <div className="flex flex-col items-center text-center group">
                                <div className="w-16 h-16 bg-white border-4 border-blue-600 rounded-full flex items-center justify-center text-blue-600 font-bold text-xl mb-6 shadow-xl transition-transform group-hover:scale-110">1</div>
                                <h4 className="font-bold text-slate-900 mb-2">Create Workspace</h4>
                                <p className="text-sm text-slate-500 px-4">Admin registers and initializes a dedicated payroll room for the company.</p>
                            </div>

                            {/* Step 2 */}
                            <div className="flex flex-col items-center text-center group">
                                <div className="w-16 h-16 bg-white border-4 border-slate-200 rounded-full flex items-center justify-center text-slate-400 font-bold text-xl mb-6 shadow-lg transition-transform group-hover:scale-110 group-hover:border-blue-400 group-hover:text-blue-500">2</div>
                                <h4 className="font-bold text-slate-900 mb-2">Generate Access</h4>
                                <p className="text-sm text-slate-500 px-4">Admin generates a secure, time-limited room code for personnel to join.</p>
                            </div>

                            {/* Step 3 */}
                            <div className="flex flex-col items-center text-center group">
                                <div className="w-16 h-16 bg-white border-4 border-slate-200 rounded-full flex items-center justify-center text-slate-400 font-bold text-xl mb-6 shadow-lg transition-transform group-hover:scale-110 group-hover:border-blue-400 group-hover:text-blue-500">3</div>
                                <h4 className="font-bold text-slate-900 mb-2">Team Enrollment</h4>
                                <p className="text-sm text-slate-500 px-4">Employees use the code to register and automatically join your workspace.</p>
                            </div>

                            {/* Step 4 */}
                            <div className="flex flex-col items-center text-center group">
                                <div className="w-16 h-16 bg-white border-4 border-slate-200 rounded-full flex items-center justify-center text-slate-400 font-bold text-xl mb-6 shadow-lg transition-transform group-hover:scale-110 group-hover:border-blue-400 group-hover:text-blue-500">4</div>
                                <h4 className="font-bold text-slate-900 mb-2">Operational Sync</h4>
                                <p className="text-sm text-slate-500 px-4">Employees log attendances daily while Admin configures payroll rules.</p>
                            </div>

                            {/* Step 5 */}
                            <div className="flex flex-col items-center text-center group">
                                <div className="w-16 h-16 bg-blue-600 border-4 border-blue-100 rounded-full flex items-center justify-center text-white font-bold text-xl mb-6 shadow-xl transition-transform group-hover:scale-110">5</div>
                                <h4 className="font-bold text-slate-900 mb-2">Secure Payouts</h4>
                                <p className="text-sm text-slate-500 px-4">Admin generates immutable payslips with automated salary calculations.</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-20 flex flex-col md:flex-row items-center justify-center gap-12 bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
                        <div className="flex flex-col items-center text-center md:items-start md:text-left gap-4 max-w-xs">
                            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900">For Employers</h3>
                            <p className="text-sm text-slate-500">Take full control of your room, generate codes, and manage your personnel data from a single secure dashboard.</p>
                            <Link href="/register" className="text-sm font-bold text-blue-600 hover:text-blue-700">Create Admin Account →</Link>
                        </div>
                        <div className="hidden md:block w-px h-32 bg-slate-100"></div>
                        <div className="flex flex-col items-center text-center md:items-start md:text-left gap-4 max-w-xs">
                            <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" /></svg>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900">For Employees</h3>
                            <p className="text-sm text-slate-500">Join your team instantly using a room code, track your attendance, and access your payslip vault anytime.</p>
                            <Link href="/employee/register" className="text-sm font-bold text-indigo-600 hover:text-indigo-700">Join a Workspace →</Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Dashboard Preview Section */}
            <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10"></div>
                <div className="mx-auto max-w-7xl px-6 relative z-10 flex flex-col lg:flex-row items-center gap-16">
                    <div className="lg:w-1/2">
                        <h2 className="text-3xl md:text-5xl font-bold mb-6">Gain total clarity over your finances.</h2>
                        <p className="text-slate-300 text-lg mb-8 leading-relaxed">
                            Stop using fragmented spreadsheets. BayFint provides a unified command center for admins to oversee capital deployment, manage personnel data, and execute bulk payroll compilations in seconds.
                        </p>
                        <ul className="space-y-4">
                            <li className="flex items-center gap-3">
                                <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">✓</div>
                                <span>Customizable Earning & Deduction Rules</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">✓</div>
                                <span>Real-time Capital Telemetry</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">✓</div>
                                <span>Employee Self-Service Portals</span>
                            </li>
                        </ul>
                    </div>
                    <div className="lg:w-1/2 w-full">
                        <div className="rounded-2xl border border-slate-700 bg-slate-800 p-2 shadow-2xl">
                            <div className="rounded-xl overflow-hidden bg-slate-900 aspect-video flex flex-col">
                                {/* Mock UI Header */}
                                <div className="h-10 border-b border-slate-700 flex items-center px-4 gap-2 bg-slate-800/50">
                                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                                    <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                                    <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                                </div>
                                {/* Mock UI Body */}
                                <div className="flex-1 p-6 flex flex-col gap-4 relative">
                                    <div className="flex gap-4">
                                        <div className="flex-1 h-24 bg-blue-600/20 border border-blue-500/30 rounded-xl"></div>
                                        <div className="flex-1 h-24 bg-indigo-600/20 border border-indigo-500/30 rounded-xl"></div>
                                        <div className="flex-1 h-24 bg-emerald-600/20 border border-emerald-500/30 rounded-xl"></div>
                                    </div>
                                    <div className="flex-1 bg-slate-800 rounded-xl border border-slate-700"></div>
                                    
                                    {/* Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 bg-white border-t border-slate-200">
                <div className="mx-auto max-w-7xl px-6 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                        <span className="text-lg font-bold text-slate-900">BayFint</span>
                    </div>
                    <div className="text-sm text-slate-500">
                        © 2026 BayFint Technologies. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
}
