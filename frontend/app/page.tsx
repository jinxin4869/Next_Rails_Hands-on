'use client'

import { useEffect, useState } from 'react'

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
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Rails API Test</h1>
      <p>{message || "Loading..."}</p>
    </div>
  );
}