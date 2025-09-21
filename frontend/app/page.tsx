'use client'

import { useEffect, useState } from 'react'
import Link from "next/link";

type HelloData = {
  message: string;
};

export default function Home() {
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    fetch('http://localhost:3001/api/v1/hello')
      .then(res => res.json())
      .then(data => setMessage(data.message))
      .catch(err => console.error(err))
  }, []);

  return (
    <>
      <h1 className="text-3xl font-bold mb-6">Next.js + Rails Hands-on</h1>
      <Link href="/users" className="px-6 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600">
        ユーザー追加ページ
      </Link>

      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Rails API Test</h1>
        <p>{message || "Loading..."}</p>
      </div>
    </>
  );
}