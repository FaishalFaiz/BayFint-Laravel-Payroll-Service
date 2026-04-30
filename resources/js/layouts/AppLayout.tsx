import { Link, usePage } from '@inertiajs/react';
import { ReactNode } from 'react';

interface Props {
    children: ReactNode;
    title?: string;
}

export default function AppLayout({ children, title }: Props) {
    const { auth } = usePage().props as any;

    // Helper to determine if a link is active
    const isActive = (path: string) => {
        if (typeof window === 'undefined') return false;
        return window.location.pathname === path || window.location.pathname.startsWith(path + '/');
    };

    return (
        <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
            {/* Sidebar */}
            <aside className="fixed inset-y-0 left-0 w-64 bg-slate-900 text-white shadow-xl transition-all duration-300">
                <div className="flex h-full flex-col">
                    {/* Logo */}
                    <div className="flex items-center px-6 py-8">
                        <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 font-bold text-white shadow-lg shadow-blue-500/50">
                            B
                        </div>
                        <span className="text-2xl font-extrabold tracking-tight">Bay<span className="text-blue-400">Fint</span></span>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 space-y-2 px-4 py-4">
                        <Link
                            href="/dashboard"
                            className={`flex items-center rounded-lg px-4 py-3 transition-colors hover:bg-slate-800 ${isActive('/dashboard') || window.location.pathname === '/' ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20 hover:bg-blue-600' : 'text-slate-400'}`}
                        >
                            <svg className="mr-3 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                            Dashboard
                        </Link>

                        <Link
                            href="/employees"
                            className={`flex items-center rounded-lg px-4 py-3 transition-colors hover:bg-slate-800 ${isActive('/employees') ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20 hover:bg-blue-600' : 'text-slate-400'}`}
                        >
                            <svg className="mr-3 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                            Employees
                        </Link>

                        <Link
                            href="/payrolls"
                            className={`flex items-center rounded-lg px-4 py-3 transition-colors hover:bg-slate-800 ${isActive('/payrolls') ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20 hover:bg-blue-600' : 'text-slate-400'}`}
                        >
                            <svg className="mr-3 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            Payroll
                        </Link>
                    </nav>

                    <div className="border-t border-slate-800 p-4">
                        <Link
                            href="/logout"
                            method="post"
                            as="button"
                            className="flex w-full items-center rounded-lg px-4 py-3 text-slate-400 transition-colors hover:bg-red-500/10 hover:text-red-400"
                        >
                            <svg className="mr-3 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            Logout
                        </Link>
                    </div>

                    {/* Footer / User */}
                    <div className="border-t border-slate-800 p-6">
                        <div className="flex items-center">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/20 font-bold text-blue-400">
                                {auth.user?.name?.charAt(0)}
                            </div>
                            <div className="ml-3 overflow-hidden">
                                <p className="truncate text-sm font-medium">{auth.user?.name}</p>
                                <p className="truncate text-xs text-slate-500">{auth.user?.email}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="ml-64 flex-1">
                {/* Header */}
                <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 px-8 py-4 backdrop-blur-md">
                    <div className="flex items-center justify-between">
                        <h1 className="text-xl font-bold text-slate-800">{title || 'BayFint'}</h1>
                        <div className="flex items-center space-x-4">
                            <button className="rounded-full bg-slate-100 p-2 text-slate-400 hover:text-slate-600">
                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </header>

                {/* Page Body */}
                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
