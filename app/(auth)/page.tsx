"use client"
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import api from '../lib/axios';
import { saveUserToCookies } from '../lib/cookies';
import { useAuth } from '../context/AuthContext';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { toast } from "sonner" // <-- Imported sonner here

export default function AuthHub() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleAuth = async () => {
    setLoading(true);
    try {
      if (isLogin) {
        const { data } = await api.post('/auth/login', { email, password });
        saveUserToCookies(data.user, data.token);
        login(data.user, data.token);
        router.push('/home');
      } else {
        await api.post('/auth/register', { name, email, password });
        router.push(`/verify-email?email=${encodeURIComponent(email)}`);
      }
    } catch (err: any) {
      // Corrected Sonner syntax here!
      toast.error("Error", { 
        description: err.response?.data?.message || "Something went wrong" 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linkedin-bg font-sans">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="bg-white p-8 rounded-lg shadow-md w-full max-w-md border border-gray-200">
        {/* <h1 className='flex justify-center align-center text-2xl font-bold text-gray-800 mb-4'>Welcome to Resume!</h1> */}
        <div className="flex justify-center mb-6 space-x-4 border-b border-gray-200 pb-2">
          <div onClick={() => setIsLogin(true)} className={`cursor-pointer pb-2 ${isLogin ? 'border-b-2 border-linkedin-primary text-linkedin-primary font-semibold' : 'text-gray-500'}`}>Login</div>
          <div onClick={() => setIsLogin(false)} className={`cursor-pointer pb-2 ${!isLogin ? 'border-b-2 border-linkedin-primary text-linkedin-primary font-semibold' : 'text-gray-500'}`}>Register</div>
        </div>

        <div className="space-y-4">
          {!isLogin && (
            <Input placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
          )}
          <Input placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          
          <Button onClick={handleAuth} disabled={loading} className="w-full bg-linkedin-primary hover:bg-linkedin-primary/90 text-white">
            {loading ? "Processing..." : isLogin ? "Sign In" : "Create Account"}
          </Button>
          
          {isLogin && (
            <div className="text-center mt-4">
              <span onClick={() => router.push('/forgot-password')} className="text-linkedin-primary cursor-pointer text-sm hover:underline">Forgot password?</span>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}