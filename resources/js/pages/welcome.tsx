import { Head, Link } from '@inertiajs/react';

interface Props {
    auth: {
        user: any;
    };
}

export default function Welcome({ auth }: Props) {
    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-700">
            <Head title="BayFint - Modern Payroll Service" />

            {/* Navigation */}
            <nav className="fixed top-0 z-50 w-full bg-white/70 backdrop-blur-md border-b border-slate-100">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                    <div className="flex items-center">
                        <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 font-bold text-white shadow-lg shadow-blue-500/30">
                            B
                        </div>
                        <span className="text-xl font-black tracking-tight">Bay<span className="text-blue-600">Fint</span></span>
                    </div>
                    <div className="flex items-center space-x-4">
                        {auth.user ? (
                            <Link 
                                href="/dashboard" 
                                className="rounded-full bg-slate-900 px-6 py-2 text-sm font-bold text-white transition-transform hover:scale-105 active:scale-95 shadow-xl shadow-slate-900/20"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link 
                                    href="/login" 
                                    className="text-sm font-bold text-slate-600 hover:text-blue-600"
                                >
                                    Login
                                </Link>
                                <Link 
                                    href="/register" 
                                    className="rounded-full bg-blue-600 px-6 py-2 text-sm font-bold text-white transition-transform hover:scale-105 active:scale-95 shadow-xl shadow-blue-500/20"
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <header className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
                {/* Background Blobs */}
                <div className="absolute top-0 right-0 -mr-24 -mt-24 h-[500px] w-[500px] rounded-full bg-blue-100/50 blur-3xl" />
                <div className="absolute bottom-0 left-0 -ml-24 -mb-24 h-[400px] w-[400px] rounded-full bg-emerald-50/50 blur-3xl" />

                <div className="relative mx-auto max-w-7xl px-6">
                    <div className="max-w-3xl">
                        <span className="inline-flex items-center rounded-full bg-blue-50 px-4 py-1.5 text-xs font-bold text-blue-600 ring-1 ring-inset ring-blue-600/10 mb-6">
                            Project BayFint - SaaS Edition
                        </span>
                        <h1 className="text-5xl font-black tracking-tight text-slate-900 lg:text-7xl">
                            Simplify your <span className="text-blue-600">Payroll</span> workflow.
                        </h1>
                        <p className="mt-8 text-lg text-slate-600 leading-relaxed max-w-2xl">
                            Kelola data karyawan, hitung gaji bulanan, dan cetak slip gaji dengan mudah. 
                            BayFint dirancang untuk memberikan kemudahan bagi admin dalam mengelola operasional sekolah maupun perusahaan kecil.
                        </p>
                        <div className="mt-12 flex flex-col sm:flex-row gap-4">
                            <Link
                                href={auth.user ? "/dashboard" : "/register"}
                                className="inline-flex items-center justify-center rounded-2xl bg-blue-600 px-8 py-4 text-base font-bold text-white shadow-2xl shadow-blue-500/40 transition-all hover:bg-blue-700 hover:scale-105 active:scale-95"
                            >
                                {auth.user ? "Go to Dashboard" : "Start Managing Now"}
                                <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            {/* Features Preview */}
            <section className="bg-white py-24 border-y border-slate-100">
                <div className="mx-auto max-w-7xl px-6">
                    <div className="grid gap-12 lg:grid-cols-3">
                        <div className="group p-8 rounded-3xl border border-slate-100 bg-slate-50/50 transition-all hover:bg-white hover:shadow-xl hover:shadow-slate-200/50">
                            <div className="h-12 w-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white mb-6 shadow-lg shadow-blue-600/20">
                                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">Multi-User Ready</h3>
                            <p className="text-slate-500 leading-relaxed">
                                Setiap pengguna memiliki dashboard dan data privat yang tidak dapat diakses oleh orang lain.
                            </p>
                        </div>

                        <div className="group p-8 rounded-3xl border border-slate-100 bg-slate-50/50 transition-all hover:bg-white hover:shadow-xl hover:shadow-slate-200/50">
                            <div className="h-12 w-12 rounded-2xl bg-emerald-500 flex items-center justify-center text-white mb-6 shadow-lg shadow-emerald-500/20">
                                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">Smart Calculation</h3>
                            <p className="text-slate-500 leading-relaxed">
                                Otomatisasi perhitungan gaji bersih berdasarkan tunjangan, potongan, dan kehadiran bulanan.
                            </p>
                        </div>

                        <div className="group p-8 rounded-3xl border border-slate-100 bg-slate-50/50 transition-all hover:bg-white hover:shadow-xl hover:shadow-slate-200/50">
                            <div className="h-12 w-12 rounded-2xl bg-amber-500 flex items-center justify-center text-white mb-6 shadow-lg shadow-amber-500/20">
                                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">Secure Storage</h3>
                            <p className="text-slate-500 leading-relaxed">
                                Riwayat gaji disimpan dalam bentuk snapshot untuk menjamin integritas data masa lalu.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 border-t border-slate-100">
                <div className="mx-auto max-w-7xl px-6 text-center text-slate-400 text-sm">
                    <p>© 2026 BayFint Payroll Service. Build for School Project.</p>
                </div>
            </footer>
        </div>
    );
}
