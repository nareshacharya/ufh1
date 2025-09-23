
'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense, useState } from 'react';
import { setDemoSession } from '@/lib/auth/session';

function LoginContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const redirect = searchParams.get('redirect') || '/';
  const [email, setEmail] = useState('admin@perfumery.com');
  const [password, setPassword] = useState('password123');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Simulate authentication delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Demo validation
      if (email === 'admin@perfumery.com' && password === 'password123') {
        // Set demo session using the session management function
        setDemoSession();
        
        // Store admin session
        localStorage.setItem('demo_session', JSON.stringify({
          user: {
            id: '1',
            email,
            name: 'Admin User',
            role: 'Admin',
            isAuthenticated: true
          },
          timestamp: Date.now()
        }));
        
        // Also set sessionStorage for immediate authentication
        sessionStorage.setItem('demo_authenticated', 'true');
        sessionStorage.setItem('user_role', 'Admin');
        sessionStorage.setItem('user_name', 'Admin User');
        sessionStorage.setItem('user_email', email);
        
        // Force a small delay to ensure session is set
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Redirect to home
        router.push('/');
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      console.error('Login failed:', error);
      alert('Invalid credentials. Please use admin@perfumery.com / password123');
    } finally {
      setLoading(false);
    }
  };

  const handleSSO = () => {
    // Redirect to OAuth callback with redirect parameter
    window.location.href = `/api/auth/callback?redirect=${encodeURIComponent(redirect)}`;
  };

  return (
    <div className="h-screen overflow-hidden relative light-theme">
      {/* Force light theme styles directly */}
      <style jsx global>{`
        .light-theme {
          --bg-primary: 255, 255, 255;
          --bg-secondary: 249, 250, 251;
          --bg-tertiary: 243, 244, 246;
          --fg-primary: 17, 24, 39;
          --fg-secondary: 75, 85, 99;
          --fg-tertiary: 156, 163, 175;
          --border-primary: 229, 231, 235;
          --border-secondary: 243, 244, 246;
          --primary: 147, 51, 234;
          --accent-1: 139, 92, 246;
          --accent-2: 168, 85, 247;
          --success: 34, 197, 94;
          --warning: 245, 158, 11;
          --error: 239, 68, 68;
        }
        
        .light-theme * {
          color-scheme: light !important;
        }
      `}</style>
      
      {/* Full Screen Background */}
      <div className="absolute inset-0">
        <img
          className="h-full w-full object-cover object-center"
          src="https://readdy.ai/api/search-image?query=Modern%20elegant%20perfumery%20laboratory%20with%20sophisticated%20glass%20equipment%2C%20luxury%20fragrance%20development%20workspace%2C%20premium%20laboratory%20setting%20with%20elegant%20lighting%2C%20professional%20perfume%20creation%20environment%2C%20high-end%20cosmetic%20lab%20with%20warm%20ambient%20lighting%2C%20sophisticated%20chemistry%20workspace%20for%20fragrance%20development%2C%20luxury%20perfumery%20research%20facility%20with%20modern%20equipment%20and%20elegant%20design%20elements&width=1920&height=1080&seq=perfumery-lab-full&orientation=landscape"
          alt="Professional perfumery laboratory workspace"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 via-slate-900/50 to-slate-900/10" />
      </div>

      {/* Floating Login Container */}
      <div className="relative z-10 h-screen flex items-center justify-end px-4" style={{ paddingRight: '12rem !important' }}>
        <div className="w-full max-w-sm bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-6 sm:p-8 border-t border-l border-r border-white/20">
          {/* Logo & Title Combined */}
          <div className="text-center mb-6">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg">
                <i className="ri-flask-line text-3xl text-white"></i>
              </div>
            </div>
            <h1 className="font-bold text-3xl text-gray-900 mb-1">Melody</h1>
            <p className="text-base text-gray-900">Perfumery Platform</p>
          </div>

          {/* Login Form */}
          <form className="space-y-3" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all shadow-sm"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all shadow-sm"
                placeholder="Enter your password"
              />
            </div>

            <div className="text-right">
              <a href="#" className="text-sm text-purple-600 hover:text-purple-500 transition-colors font-medium">
                Forgot password?
              </a>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200 whitespace-nowrap cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] shadow-lg"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Signing in...
                  </>
                ) : (
                  'Sign in'
                )}
              </button>
            </div>

            {/* Demo Credentials */}
            <div className="mt-3 p-2 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-xs text-gray-900 font-medium">Demo: admin@perfumery.com / password123</p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-gray-600">Loading...</div>
        </div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
