import AppLayout from '@/layouts/AppLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';

interface Employee {
    id: number;
    name: string;
    position: string;
    join_date: string;
    base_salary: number;
    allowance: number;
    deduction: number;
}

interface Props {
    employees: Employee[];
}

export default function EmployeeIndex({ employees }: Props) {
    const [isEditing, setIsEditing] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

    const { data, setData, post, put, delete: destroy, processing, reset, errors } = useForm({
        name: '',
        position: '',
        join_date: '',
        base_salary: 0,
        allowance: 0,
        deduction: 0,
    });

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const handleEdit = (employee: Employee) => {
        setSelectedEmployee(employee);
        setData({
            name: employee.name,
            position: employee.position,
            join_date: employee.join_date,
            base_salary: employee.base_salary,
            allowance: employee.allowance,
            deduction: employee.deduction,
        });
        setIsEditing(true);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setSelectedEmployee(null);
        reset();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedEmployee) {
            put(`/employees/${selectedEmployee.id}`, {
                onSuccess: () => handleCancel(),
            });
        } else {
            post('/employees', {
                onSuccess: () => reset(),
            });
        }
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this employee?')) {
            destroy(`/employees/${id}`);
        }
    };

    return (
        <AppLayout title="Employee Management">
            <Head title="Employees" />

            <div className="grid gap-8 lg:grid-cols-3">
                {/* Form Section */}
                <div className="lg:col-span-1">
                    <div className="sticky top-24 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <h2 className="mb-6 text-lg font-bold text-slate-800">
                            {isEditing ? 'Edit Employee' : 'Add New Employee'}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700">Full Name</label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="mt-1 block w-full rounded-xl border-slate-200 bg-slate-50 px-4 py-2 text-sm transition-focus focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                                    placeholder="e.g. John Doe"
                                />
                                {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700">Position</label>
                                <input
                                    type="text"
                                    value={data.position}
                                    onChange={(e) => setData('position', e.target.value)}
                                    className="mt-1 block w-full rounded-xl border-slate-200 bg-slate-50 px-4 py-2 text-sm transition-focus focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                                    placeholder="e.g. Software Engineer"
                                />
                                {errors.position && <p className="mt-1 text-xs text-red-500">{errors.position}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700">Join Date</label>
                                <input
                                    type="date"
                                    value={data.join_date}
                                    onChange={(e) => setData('join_date', e.target.value)}
                                    className="mt-1 block w-full rounded-xl border-slate-200 bg-slate-50 px-4 py-2 text-sm transition-focus focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                                />
                                {errors.join_date && <p className="mt-1 text-xs text-red-500">{errors.join_date}</p>}
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700">Base Salary</label>
                                    <div className="relative mt-1">
                                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">Rp</span>
                                        <input
                                            type="number"
                                            value={data.base_salary}
                                            onChange={(e) => setData('base_salary', Number(e.target.value))}
                                            className="block w-full rounded-xl border-slate-200 bg-slate-50 pl-10 pr-4 py-2 text-sm transition-focus focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                                        />
                                    </div>
                                    {errors.base_salary && <p className="mt-1 text-xs text-red-500">{errors.base_salary}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700">Allowance</label>
                                    <input
                                        type="number"
                                        value={data.allowance}
                                        onChange={(e) => setData('allowance', Number(e.target.value))}
                                        className="mt-1 block w-full rounded-xl border-slate-200 bg-slate-50 px-4 py-2 text-sm transition-focus focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700">Deduction</label>
                                    <input
                                        type="number"
                                        value={data.deduction}
                                        onChange={(e) => setData('deduction', Number(e.target.value))}
                                        className="mt-1 block w-full rounded-xl border-slate-200 bg-slate-50 px-4 py-2 text-sm transition-focus focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                                    />
                                </div>
                            </div>

                            <div className="flex space-x-3 pt-4">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="flex-1 rounded-xl bg-blue-600 px-4 py-2.5 font-semibold text-white shadow-lg shadow-blue-500/30 transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                                >
                                    {isEditing ? 'Update Employee' : 'Create Employee'}
                                </button>
                                {isEditing && (
                                    <button
                                        type="button"
                                        onClick={handleCancel}
                                        className="rounded-xl border border-slate-200 px-4 py-2.5 font-semibold text-slate-600 transition-colors hover:bg-slate-50"
                                    >
                                        Cancel
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                </div>

                {/* Table Section */}
                <div className="lg:col-span-2">
                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-slate-50 text-slate-500">
                                    <tr>
                                        <th className="px-6 py-4 font-semibold">Employee</th>
                                        <th className="px-6 py-4 font-semibold">Position</th>
                                        <th className="px-6 py-4 font-semibold">Base Salary</th>
                                        <th className="px-6 py-4 font-semibold text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {employees.map((employee) => (
                                        <tr key={employee.id} className="group transition-colors hover:bg-slate-50/50">
                                            <td className="px-6 py-4">
                                                <div className="font-semibold text-slate-900">{employee.name}</div>
                                                <div className="text-xs text-slate-400">Joined {new Date(employee.join_date).toLocaleDateString()}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-600">
                                                    {employee.position}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 font-medium text-slate-700">
                                                {formatCurrency(employee.base_salary)}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end space-x-2 opacity-0 transition-opacity group-hover:opacity-100">
                                                    <button
                                                        onClick={() => handleEdit(employee)}
                                                        className="rounded-lg bg-slate-100 p-2 text-slate-600 hover:bg-blue-100 hover:text-blue-600"
                                                    >
                                                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                                        </svg>
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(employee.id)}
                                                        className="rounded-lg bg-slate-100 p-2 text-slate-600 hover:bg-red-100 hover:text-red-600"
                                                    >
                                                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {employees.length === 0 && (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-12 text-center text-slate-400">
                                                No employees found. Add one to get started!
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
