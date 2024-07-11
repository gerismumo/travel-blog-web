"use client"
import React, { useState } from 'react';
import {useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import fontawesome from '@/(icons)/fontawesome';
import toast from 'react-hot-toast';
import axios from 'axios';


const LoginForm: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
        return toast.error('All fields are required');
    }

    setIsLoading(true);

    try {
        const response = await axios.post('/api/auth/sg', { email, password });

        if (response.data.success) {
            toast.success(response.data.message);
            setEmail('');
            setPassword('');
            setTimeout(() => {
              setIsLoading(false); 
              router.push('/dashboard');
            }, 1000)
            
        } else {
            toast.error(response.data.message);
        }
    } catch (error) {
        toast.error("Network error");
        console.log("login error", error);
    } finally {
        setIsLoading(false); 
    }
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
              
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="w-full bg-lightRed hover:bg-lightOrange text-white font-semibold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-lightOrange transition duration-300 ease-in-out"
              disabled={isLoading}
            >
              {isLoading ? <FontAwesomeIcon icon={fontawesome.faSpinner} spin /> : 'Login'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
