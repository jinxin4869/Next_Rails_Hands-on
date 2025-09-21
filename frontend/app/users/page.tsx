'use client'

import { useEffect, useState } from "react";

type User = {
    id: number;
    name: string;
    email: string;
};

const API_BASE = 'http://localhost:3001';

function UserForm({ initial, onCancel, onSave }: { initial?: Partial<User>, onCancel: () => void, onSave: (payload: { name: string, email: string }, id?: number) => Promise<void> }) {
    const [name, setName] = useState(initial?.name ?? '');
    const [email, setEmail] = useState(initial?.email ?? '');
    const [error, setError] = useState<string | null>(null);

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        if (!name.trim() || !email.trim()) {
            setError("Name and email are required.");
            return;
        }
        try {
            await onSave({ name: name.trim(), email: email.trim() }, (initial as any)?.id);
        } catch (err: any) {
            setError(err?.message || 'Submission failed');
        }
    };

    return (
        <form onSubmit={submit} className="bg-white text-gray-600 p-4 rounded shadow space-y-2">
            {error && <div className="text-red-600">{error}</div>}
            <div>
                <label className="block text-sm font-medium">Name</label>
                <input className="mt-1 block w-full border rounded px-2 py-1" value={name} onChange={e => setName(e.target.value)} />
            </div>
            <div>
                <label className="block text-sm font-medium">Email</label>
                <input className="mt-1 block w-full border rounded px-2 py-1" value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <div className="flex gap-2">
                <button type="submit" className="bg-blue-600 text-white px-3 py-1 rounded">Save</button>
                <button type="button" onClick={onCancel} className="bg-red-500 text-white px-3 py-1 border rounded">Cancel</button>
            </div>
        </form>
    );
}

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [editing, setEditing] = useState<User | null>(null);
    const [showForm, setShowForm] = useState(false);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE}/api/v1/users`);
            const data = await res.json();
            setUsers(data);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleCreateOrUpdate = async (payload: { name: string, email: string }, id?: number) => {
        if (id) {
            const res = await fetch(`${API_BASE}/api/v1/users/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user: payload }),
            });
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err?.errors?.join?.(', ') || 'Update failed');
            }
        } else {
            const res = await fetch(`${API_BASE}/api/v1/users`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user: payload }),
            });
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err?.errors?.join?.(', ') || 'Create failed');
            }
        }
        // refresh list
        setShowForm(false);
        setEditing(null);
        await fetchUsers();
    };

    const handleDelete = async (id: number) => {
        if (!confirm('登録したユーザーを削除しますか？')) return;
        const res = await fetch(`${API_BASE}/api/v1/users/${id}`, { method: 'DELETE' });
        if (res.ok) {
            await fetchUsers();
        } else {
            alert('削除に失敗しました');
        }
    };

    return (
        <div className="p-6 max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Users</h1>

            <div className="mb-4">
                <button onClick={() => { setEditing(null); setShowForm(true); }} className="bg-green-600 text-white px-3 py-1 rounded">新規登録</button>
            </div>

            {showForm && (
                <div className="mb-4">
                    <UserForm initial={editing ?? undefined} onCancel={() => { setShowForm(false); setEditing(null); }} onSave={handleCreateOrUpdate} />
                </div>
            )}

            {loading ? (
                <div>Loading...</div>
            ) : (
                <ul className="space-y-3">
                    {users.map(u => (
                        <li key={u.id} className="bg-white p-3 text-gray-600 rounded shadow flex justify-between items-center">
                            <div>
                                <div className="font-medium">{u.name}</div>
                                <div className="text-sm text-gray-600">{u.email}</div>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => { setEditing(u); setShowForm(true); }} className="px-3 py-1 bg-amber-300 border rounded">編集</button>
                                <button onClick={() => handleDelete(u.id)} className="px-3 py-1 bg-red-600 text-white rounded">削除</button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
