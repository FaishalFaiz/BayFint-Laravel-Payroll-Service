import { Head, Link, useForm } from '@inertiajs/react';

export default function AdminRegister() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/register');
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col justify-center py-12 px-6 lg:px-8">
            <Head title="Create Workspace | BayFint" />
            
            <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30 mx-auto mb-4">
                    <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
                    Create a workspace
                </h2>
                <p className="mt-2 text-sm text-slate-600">
                    Start managing your payroll efficiently
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-6 shadow-xl shadow-slate-200/50 sm:rounded-3xl sm:px-10 border border-slate-100">
                    <form className="space-y-5" onSubmit={submit}>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700">Full Name</label>
                            <div className="mt-1.5">
                                <input
                                    type="text"
                                    required
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                    className="appearance-none block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors text-sm"
                                    placeholder="John Doe"
                                />
                                {errors.name && <p className="mt-2 text-sm text-rose-600">{errors.name}</p>}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700">Email address</label>
                            <div className="mt-1.5">
                                <input
                                    type="email"
                                    required
                                    value={data.email}
                                    onChange={e => setData('email', e.target.value)}
                                    className="appearance-none block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors text-sm"
                                    placeholder="admin@company.com"
                                />
                                {errors.email && <p className="mt-2 text-sm text-rose-600">{errors.email}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700">Password</label>
                                <div className="mt-1.5">
                                    <input
                                        type="password"
                                        required
                                        value={data.password}
                                        onChange={e => setData('password', e.target.value)}
                                        className="appearance-none block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors text-sm"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700">Confirm</label>
                                <div className="mt-1.5">
                                    <input
                                        type="password"
                                        required
                                        value={data.password_confirmation}
                                        onChange={e => setData('password_confirmation', e.target.value)}
                                        className="appearance-none block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors text-sm"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all disabled:opacity-50"
                            >
                                Create Workspace
                            </button>
                        </div>
                    </form>
                    
                    <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                        <p className="text-sm text-slate-600">
                            Already have an account?{' '}
                            <Link href="/login" className="font-semibold text-blue-600 hover:text-blue-500">
                                Log in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
