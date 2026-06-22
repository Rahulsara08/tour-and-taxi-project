import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { motion } from 'motion/react';
import { Loader2, ArrowLeft, Mail, Lock } from 'lucide-react';

export default function CustomerLogin() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const processUserAuth = async (user: any) => {
    const docRef = doc(db, 'users', user.uid);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      const isAdmin = user.email === 'rahulsarawat547@gmail.com';
      const newUser = {
        email: user.email,
        role: isAdmin ? 'admin' : 'customer',
        createdAt: Date.now(),
        updatedAt: Date.now()
      };
      await setDoc(docRef, newUser);
      navigate(isAdmin ? '/admin' : '/');
    } else {
      let data = docSnap.data();
      // Force upgrade if they are the designated admin but currently saved as something else
      if (user.email === 'rahulsarawat547@gmail.com' && data.role !== 'admin') {
        data = { ...data, role: 'admin', updatedAt: Date.now() };
        await setDoc(docRef, data);
      }
      
      if (data.role === 'superadmin' || data.role === 'admin') {
          navigate('/admin');
      } else {
          navigate('/');
      }
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      let result;
      if (isRegistering) {
        result = await createUserWithEmailAndPassword(auth, email, password);
      } else {
        result = await signInWithEmailAndPassword(auth, email, password);
      }
      
      await processUserAuth(result.user);
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/operation-not-allowed') {
        setError('Email/Password sign-in provider is not enabled in your Firebase Console yet. Please go to: Firebase Console ➜ Authentication ➜ Sign-in method ➜ Add new provider ➜ select Email/Password ➜ Enable ➜ Save.');
      } else if (err.code === 'auth/email-already-in-use') {
        setError('This email is already registered. Please sign in instead.');
      } else if (err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
        setError('Invalid email or password.');
      } else {
        setError(err.message || 'Authentication failed');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setError('');
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      await processUserAuth(result.user);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Visual Section - Left Side */}
      <div className="hidden lg:flex w-1/2 relative bg-slate-900">
        <img 
          src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80" 
          alt="Rajasthan Tourism" 
          className="absolute inset-0 w-full h-full object-cover opacity-60"
          referrerPolicy="no-referrer"
          crossOrigin="anonymous"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
        <div className="relative z-10 flex flex-col justify-end p-16 text-white w-full">
          <Link to="/" className="absolute top-12 left-16 text-xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent w-max">
            Shri Gurukripa
          </Link>
          <h1 className="text-5xl font-black mb-4">Your journey begins here.</h1>
          <p className="text-xl text-gray-300 max-w-lg">Unlock seamless booking, secure payments, and premium Rajasthan tours.</p>
        </div>
      </div>

      {/* Login Section - Right Side */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-24 relative">
        <Link to="/" className="lg:hidden absolute top-8 left-8 text-xl font-bold text-orange-600 w-max">
          Shri Gurukripa
        </Link>
        <Link to="/" className="absolute top-8 right-8 text-gray-500 hover:text-gray-900 flex items-center gap-1 font-medium transition-colors">
          <ArrowLeft size={16} /> Back to Home
        </Link>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-sm"
        >
          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">{isRegistering ? 'Create Account' : 'Welcome'}</h2>
            <p className="text-gray-500 font-medium">
              {isRegistering ? 'Sign up to ' : 'Sign in to '}
              book your next ride.
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl text-sm mb-6 flex items-start gap-2">
              <span className="shrink-0 mt-0.5">⚠️</span> {error}
            </div>
          )}

          <form onSubmit={handleEmailAuth} className="space-y-4 mb-6">
            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Mail size={20} />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email Address"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all placeholder-gray-400 text-gray-900"
                />
              </div>
            </div>
            
            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Lock size={20} />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all placeholder-gray-400 text-gray-900"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-md shadow-orange-600/20 disabled:opacity-70 flex justify-center items-center"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : (isRegistering ? 'Register' : 'Sign In')}
            </button>
          </form>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700 font-bold flex items-center justify-center gap-3 py-3 rounded-xl transition-all shadow-sm disabled:opacity-70"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Google
          </button>
          
          <div className="mt-8 pt-4 border-t border-gray-100 text-center">
            <p className="text-sm text-gray-650 font-semibold mb-2">First time visiting our platform?</p>
            <p className="text-xs text-gray-500 font-medium">
              {isRegistering ? "Back to standard " : "Create a new secure email/password account "}
              <button 
                type="button"
                onClick={() => setIsRegistering(!isRegistering)}
                className="text-orange-600 font-bold hover:underline underline-offset-2 ml-1"
              >
                {isRegistering ? "Sign In" : "Sign Up Here"}
              </button>
            </p>
          </div>

        </motion.div>
      </div>
    </div>
  );
}
