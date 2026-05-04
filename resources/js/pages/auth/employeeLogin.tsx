import { Head, Link, useForm } from '@inertiajs/react';

export default function EmployeeLogin() {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/employee/login');
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col justify-center py-12 px-6 lg:px-8">
            <Head title="Employee Log In | BayFint" />
            
            <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
                <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30 mx-auto mb-4">
                    <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                </div>
                <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
                    Employee Portal
                </h2>
                <p className="mt-2 text-sm text-slate-600">
                    Log in to access your payslips and attendance
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-6 shadow-xl shadow-slate-200/50 sm:rounded-3xl sm:px-10 border border-slate-100">
                    <form className="space-y-6" onSubmit={submit}>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700">Email address</label>
                            <div className="mt-2">
                                <input
                                    type="email"
                                    required
                                    value={data.email}
                                    onChange={e => setData('email', e.target.value)}
                                    className="appearance-none block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors text-sm"
                                    placeholder="you@example.com"
                                />
                                {errors.email && <p className="mt-2 text-sm text-rose-600">{errors.email}</p>}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700">Password</label>
                            <div className="mt-2">
                                <input
                                    type="password"
                                    required
                                    value={data.password}
                                    onChange={e => setData('password', e.target.value)}
                                    className="appearance-none block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors text-sm"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all disabled:opacity-50"
                            >
                                Enter Portal
                            </button>
                        </div>
                    </form>
                    
                    <div className="mt-8 pt-6 border-t border-slate-100 text-center flex flex-col gap-3">
                        <p className="text-sm text-slate-600">
                            First time here?{' '}
                            <Link href="/employee/register" className="font-semibold text-indigo-600 hover:text-indigo-500">
                                Enroll with Code
                            </Link>
                        </p>
                        <p className="text-sm text-slate-600 border-t border-slate-50 pt-3">
                            Are you an admin?{' '}
                            <Link href="/login" className="font-semibold text-blue-600 hover:text-blue-500">
                                Log in to Admin
                            </Link>
                        </p>
                    </div>
                </div>

                <div className="mt-8 text-center text-sm flex justify-center gap-6">
                    <Link href="/" className="font-medium text-slate-500 hover:text-slate-900 transition-colors">
                        ← Back to home
                    </Link>
                    <Link href="/login" className="font-medium text-slate-500 hover:text-slate-900 transition-colors">
                        Admin Login
                    </Link>
                </div>
            </div>
        </div>
    );
}
