"use client"
import React, { useState } from 'react';
import '@fortawesome/fontawesome-svg-core/styles.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/navigation';




const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate login process
    setTimeout(() => {
      setIsLoading(false);
      router.push('/dashboard');
    }, 2000);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-lightDark">
      <div className="bg-dark p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-white text-3xl font-semibold mb-6 text-center">Admin Login</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className='flex flex-col'>
            <label htmlFor="email" className="block text-lightGrey mb-2">Email</label>
            <input
              type="email"
              id="email"
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className='flex flex-col'>
            <label htmlFor="password" className="block text-lightGrey mb-2">Password</label>
            <input
              type="password"
              id="password"
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="w-full bg-lightRed hover:bg-lightOrange text-white font-semibold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-lightOrange transition duration-300 ease-in-out"
              disabled={isLoading}
            >
              {isLoading ? <FontAwesomeIcon icon={faSpinner} spin /> : 'Login'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
