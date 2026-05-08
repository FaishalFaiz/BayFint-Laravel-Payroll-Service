import { useForm } from '@inertiajs/react';
import { formatDisplay, parseDisplay } from '../../utils/format';

interface Props {
    room: any;
}

export default function RoomSettings({ room }: Props) {
    const settingsForm = useForm({
        name: room?.name || '',
        shift_start_time: room?.shift_start_time || '08:00',
        shift_end_time: room?.shift_end_time || '17:00',
        late_grace_period: room?.late_grace_period || 0,
        overtime_min_duration: room?.overtime_min_duration || 0,
        late_rule_type: room?.late_rule_type || 'variable',
        late_amount: room?.late_amount || 0,
        overtime_rule_type: room?.overtime_rule_type || 'variable',
        overtime_amount: room?.overtime_amount || 0,
        absence_amount: room?.absence_amount || 0,
    });

    const updateSettings = (e: React.FormEvent) => {
        e.preventDefault();
        settingsForm.put('/room/settings');
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900">Room Settings</h2>
            <form onSubmit={updateSettings} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-6">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Workspace Name</label>
                    <input
                        type="text"
                        value={settingsForm.data.name}
                        onChange={e => settingsForm.setData('name', e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                        required
                    />
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Shift Start Time</label>
                        <input
                            type="time"
                            value={settingsForm.data.shift_start_time}
                            onChange={e => settingsForm.setData('shift_start_time', e.target.value)}
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Shift End Time</label>
                        <input
                            type="time"
                            value={settingsForm.data.shift_end_time}
                            onChange={e => settingsForm.setData('shift_end_time', e.target.value)}
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                        />
                    </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
                    <div className="space-y-4">
                        <h3 className="font-bold text-slate-900">Lateness Rules</h3>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Grace Period (Minutes)</label>
                            <input
                                type="number"
                                value={settingsForm.data.late_grace_period}
                                onChange={e => settingsForm.setData('late_grace_period', parseInt(e.target.value))}
                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                            />
                        </div>
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-slate-700 mb-2">Rule Type</label>
                                <select value={settingsForm.data.late_rule_type} onChange={e => settingsForm.setData('late_rule_type', e.target.value)} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl">
                                    <option value="fixed">Fixed Per Incident</option>
                                    <option value="variable">Variable Per Minute</option>
                                </select>
                            </div>
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-slate-700 mb-2">Amount (Rp)</label>
                                <input
                                    type="text"
                                    value={formatDisplay(settingsForm.data.late_amount)}
                                    onChange={e => settingsForm.setData('late_amount', parseDisplay(e.target.value))}
                                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="font-bold text-slate-900">Overtime Rules</h3>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Min Duration (Minutes)</label>
                            <input
                                type="number"
                                value={settingsForm.data.overtime_min_duration}
                                onChange={e => settingsForm.setData('overtime_min_duration', parseInt(e.target.value))}
                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                            />
                        </div>
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-slate-700 mb-2">Rule Type</label>
                                <select value={settingsForm.data.overtime_rule_type} onChange={e => settingsForm.setData('overtime_rule_type', e.target.value)} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl">
                                    <option value="fixed">Fixed Per Incident</option>
                                    <option value="variable">Variable Per Hour</option>
                                </select>
                            </div>
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-slate-700 mb-2">Amount (Rp)</label>
                                <input
                                    type="text"
                                    value={formatDisplay(settingsForm.data.overtime_amount)}
                                    onChange={e => settingsForm.setData('overtime_amount', parseDisplay(e.target.value))}
                                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-4 border-t border-slate-100">
                    <h3 className="font-bold text-slate-900 mb-4">Absence Rules</h3>
                    <div className="max-w-xs">
                        <label className="block text-sm font-medium text-slate-700 mb-2">Deduction per Approved Izin (Rp)</label>
                        <input
                            type="text"
                            value={formatDisplay(settingsForm.data.absence_amount)}
                            onChange={e => settingsForm.setData('absence_amount', parseDisplay(e.target.value))}
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                        />
                    </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-end">
                    <button
                        type="submit"
                        disabled={settingsForm.processing}
                        className="px-6 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-full hover:bg-blue-700 transition-colors shadow-sm"
                    >
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    );
}
