import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail, updatePassword } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { motion } from 'motion/react';
import { Loader2, ShieldAlert, ArrowLeft, Mail, Lock, Sparkles, HelpCircle } from 'lucide-react';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resetMessage, setResetMessage] = useState('');
  
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('rahulsarawat547@gmail.com');
  const [password, setPassword] = useState('123456');

  const handleResetPassword = async () => {
    if (!email) {
      setError('Please enter your admin email (rahulsarawat547@gmail.com) first.');
      return;
    }
    if (email !== 'rahulsarawat547@gmail.com') {
      setError('Security Violation. Access restricted to authorized systems administrators only.');
      return;
    }
    try {
      setLoading(true);
      setError('');
      setResetMessage('');
      await sendPasswordResetEmail(auth, email);
      setResetMessage('A password reset link has been successfully sent to ' + email + '. Please check your inbox.');
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/user-not-found') {
        setError('This administrator profile does not exist yet. Please register first.');
      } else {
        setError(err.message || 'Failed to send password reset email.');
      }
    } finally {
      setLoading(false);
    }
  };

  const processUserAuth = async (user: any) => {
    if (user.email !== 'rahulsarawat547@gmail.com') {
      setError('Security Violation. Access restricted to authorized systems administrators only.');
      await auth.signOut();
      setLoading(false);
      return;
    }

    // Automatically synchronize/set password to '123456' under the hood
    try {
      await updatePassword(user, '123456');
      console.log("Successfully synchronized admin password to 123456");
    } catch (passwordErr: any) {
      console.warn("Could not auto-align password:", passwordErr.message);
    }

    const docRef = doc(db, 'users', user.uid);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      const newUser = {
        email: user.email,
        role: 'admin',
        createdAt: Date.now(),
        updatedAt: Date.now()
      };
      await setDoc(docRef, newUser);
      navigate('/admin');
    } else {
      const data = docSnap.data();
      if (data.role !== 'admin') {
        // Force upgrade since email is authorized
        await setDoc(docRef, { ...data, role: 'admin', updatedAt: Date.now() });
      }
      navigate('/admin');
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    
    if (email !== 'rahulsarawat547@gmail.com') {
      setError('Security Violation. Access restricted to authorized systems administrators only.');
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
        setError('Email/Password provider is not active. Log in to Firebase Console ➜ Authentication ➜ Sign-in method ➜ Add new provider ➜ select Email/Password ➜ Enable ➜ Save.');
      } else if (err.code === 'auth/email-already-in-use') {
        setError('This email is already registered. Please login using the SWITCH TO LOGIN toggle below.');
      } else if (err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
        setError('Invalid credentials. If you forgot your password, please make sure your email is typed above and click Forgot Password below.');
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
    <div className="min-h-screen bg-[#07090E] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      
      {/* Decorative Network Grid */}
      <div className="absolute inset-0 z-0 opacity-20" style={{
        backgroundImage: 'radial-gradient(#EF4444 1px, transparent 1px)',
        backgroundSize: '40px 40px'
      }}></div>
      
      {/* Glowing Blob */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-600/20 blur-[120px] rounded-full z-0 pointer-events-none"></div>

      <div className="w-full absolute top-8 left-8 z-20">
         <Link to="/" className="text-gray-500 hover:text-white flex items-center gap-2 font-mono text-sm transition-colors">
          <ArrowLeft size={16} /> ABORT_SHUTDOWN
        </Link>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm relative z-10"
      >
        <div className="text-center mb-10">
          <ShieldAlert size={48} className="text-red-500 mx-auto mb-6 drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]" />
          <h2 className="text-2xl font-bold text-white tracking-widest uppercase font-mono">Control Center</h2>
          <p className="text-slate-500 font-mono text-sm mt-2">{isRegistering ? 'Register Access Profile' : 'Restricted Access Portal'}</p>
        </div>

        {error && (
          <div className="bg-red-950/50 border border-red-500 text-red-400 p-4 rounded opacity-90 text-sm mb-6 flex items-start gap-2 shadow-[0_0_15px_rgba(239,68,68,0.2)] font-mono">
             <span className="shrink-0 mt-0.5">!</span> {error}
          </div>
        )}

        {resetMessage && (
          <div className="bg-emerald-950/50 border border-emerald-500 text-emerald-400 p-4 rounded opacity-90 text-sm mb-6 flex items-start gap-2 shadow-[0_0_15px_rgba(16,185,129,0.2)] font-mono">
             <span className="shrink-0 mt-0.5">✓</span> {resetMessage}
          </div>
        )}

        <form onSubmit={handleEmailAuth} className="space-y-4 mb-6">
          <div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                <Mail size={18} />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ADMIN EMAIL"
                className="w-full pl-10 pr-4 py-3 bg-slate-900/50 border border-slate-700 focus:border-red-500 rounded text-white font-mono text-sm outline-none transition-all placeholder-slate-600"
              />
            </div>
          </div>
          
          <div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                <Lock size={18} />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="PASSWORD"
                className="w-full pl-10 pr-4 py-3 bg-slate-900/50 border border-slate-700 focus:border-red-500 rounded text-white font-mono text-sm outline-none transition-all placeholder-slate-600"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-mono uppercase tracking-widest text-sm py-4 rounded transition-all shadow-[0_0_15px_rgba(239,68,68,0.4)] disabled:opacity-70 flex justify-center items-center"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : (isRegistering ? 'INITIALIZE PROFILE' : 'SECURE LOGIN')}
          </button>
        </form>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-700"></div>
          </div>
          <div className="relative flex justify-center text-xs font-mono">
            <span className="px-2 bg-[#07090E] text-slate-500">OR USE OAUTH</span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full bg-transparent border-2 border-slate-700 hover:border-red-500 hover:bg-slate-900 text-white font-mono uppercase tracking-widest text-sm py-3 rounded transition-all shadow-sm disabled:opacity-70 group flex items-center justify-center gap-3"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" className="opacity-70 group-hover:opacity-100 transition-opacity" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Google
        </button>

        <button
          type="button"
          onClick={() => {
            localStorage.setItem('is_mock_admin', 'true');
            window.location.href = '/admin';
          }}
          className="w-full mt-3 bg-red-950/10 hover:bg-red-950/20 border-2 border-red-500/30 hover:border-red-500 text-red-400 font-mono uppercase tracking-widest text-xs py-3 rounded transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
        >
          <Sparkles size={14} className="animate-pulse text-red-400" />
          Bypass Auth (Local Demo Mode)
        </button>

        <div className="mt-8 text-center space-y-4">
          <div className="flex justify-center gap-6">
            <button 
              type="button"
              onClick={() => {
                setIsRegistering(!isRegistering);
                setError('');
                setResetMessage('');
              }}
              className="text-xs text-slate-500 hover:text-red-400 font-mono transition-colors"
            >
              {isRegistering ? '[ SWITCH TO LOGIN ]' : '[ CREATE PROFILE ]'}
            </button>
            {!isRegistering && (
              <button 
                type="button"
                onClick={handleResetPassword}
                disabled={loading}
                className="text-xs text-slate-500 hover:text-red-400 font-mono transition-colors"
              >
                [ FORGOT PASSWORD ]
              </button>
            )}
          </div>
          <p className="text-[10px] text-slate-600 font-mono tracking-widest block">SECURE CONNECTION ESTABLISHED</p>
        </div>

        {/* Credentials Diagnostics Guide */}
        <div className="mt-8 bg-slate-900/45 border border-slate-800 rounded-xl p-4 text-[11px] text-slate-400 font-mono space-y-2 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-8 h-8 bg-red-500/5 blur-md rounded-full pointer-events-none" />
          <div className="flex gap-2 items-center text-red-400 font-semibold uppercase tracking-wider">
            <HelpCircle size={14} className="shrink-0 text-red-500" />
            <span>credentials assistance guide</span>
          </div>
          <p className="leading-relaxed text-slate-300">
            Your system administrator profile <code className="text-white">rahulsarawat547@gmail.com</code> is pre-configured with password <code className="text-red-400 font-bold bg-slate-950/60 px-1 py-0.5 rounded">123456</code>!
          </p>
          <div className="space-y-1.5 pt-2 border-t border-slate-900/80 text-slate-500">
            <p>• <span className="text-slate-400 font-semibold">Immediate access:</span> Press the <span className="text-white">SECURE LOGIN</span> button using pre-filled details.</p>
            <p>• <span className="text-slate-400 font-semibold">Error recovery/Sync:</span> If you registered with social login previously or forgot your password, just use the <span className="text-white">Google</span> OAuth button. Since you own the email address, Google login will login successfully and <span className="text-red-400 font-semibold">automatically sync & update your password to &ldquo;123456&rdquo;</span>! You can then sign in using the Email & Password fields anytime.</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
