import { useForm } from '@inertiajs/react';

interface Props {
    stats: {
        total_employees: number;
        total_payroll: number;
        pending_process: number;
    };
    room: any;
}

export default function Overview({ stats, room }: Props) {
    const codeForm = useForm({});
    const isCodeActive = room?.code && new Date(room?.code_expires_at) > new Date();

    const generateCode = () => {
        codeForm.post('/room/generate-code');
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900">Dashboard Overview</h2>
            <div className="grid sm:grid-cols-3 gap-6">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                    <div className="text-sm font-medium text-slate-500 mb-1">Total Employees</div>
                    <div className="text-3xl font-bold text-slate-900">{stats.total_employees}</div>
                </div>
                <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 shadow-md text-white">
                    <div className="text-sm font-medium text-blue-100 mb-1">Total Payroll (This Month)</div>
                    <div className="text-3xl font-bold">Rp {Number(stats.total_payroll).toLocaleString('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</div>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                    <div className="text-sm font-medium text-slate-500 mb-1">Pending Generation</div>
                    <div className="text-3xl font-bold text-slate-900">{stats.pending_process}</div>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-1">Room Access Code</h3>
                    <p className="text-sm text-slate-500">
                        {isCodeActive
                            ? `Share this code with employees to let them register into your room.`
                            : 'No active room code. Generate one to allow new registrations.'}
                    </p>
                    {isCodeActive && (
                        <div className="mt-3 inline-block px-4 py-2 bg-slate-100 rounded-lg text-lg font-bold text-slate-900 tracking-widest">
                            {room.code}
                        </div>
                    )}
                </div>
                <button
                    onClick={generateCode}
                    disabled={codeForm.processing}
                    className="px-6 py-2.5 bg-slate-900 text-white text-sm font-semibold rounded-full hover:bg-slate-800 transition-colors whitespace-nowrap shadow-sm"
                >
                    {isCodeActive ? 'Rotate Code' : 'Generate Code'}
                </button>
            </div>
        </div>
    );
}
