import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { LogIn, Mail, Lock, Sun, Moon, UserPlus, Shield } from 'lucide-react';
import toast from 'react-hot-toast';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'merchant' | 'admin'>('merchant');
  const [loading, setLoading] = useState(false);
  const { currentUser, login, register } = useAuth();
  const { theme, toggleTheme } = useTheme();

  if (currentUser) {
    const redirectPath = currentUser.role === 'admin' ? '/admin/dashboard' : '/merchant/dashboard';
    return <Navigate to={redirectPath} replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      if (isRegistering) {
        await register(email, password, selectedRole);
      } else {
        await login(email, password);
      }
    } catch (error) {
      // Error handling is done in the auth functions
    } finally {
      setLoading(false);
    }
  };

  const quickLogin = (userType: 'merchant' | 'admin') => {
    if (userType === 'merchant') {
      setEmail('merchant@grabberr.com');
      setPassword('password123');
    } else {
      setEmail('admin@grabberr.com');
      setPassword('admin123');
    }
    setIsRegistering(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <LogIn className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Grab<span className="text-blue-600">berr</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            {isRegistering ? 'Create your account' : 'Sign in to your account'}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          {/* Mock Authentication Notice */}
          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center mb-2">
              <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2" />
              <h3 className="font-medium text-blue-900 dark:text-blue-300">Demo Mode Active</h3>
            </div>
            <p className="text-sm text-blue-700 dark:text-blue-400">
              ✅ No OTP verification required<br/>
              ✅ Use any email and password (6+ chars)<br/>
              ✅ Instant access to dashboard
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {isRegistering && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Account Type
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedRole('merchant')}
                    className={`p-3 rounded-lg border-2 transition-colors duration-200 ${
                      selectedRole === 'merchant'
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                        : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                    }`}
                  >
                    <div className="text-center">
                      <div className="font-medium">Merchant</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Store Owner</div>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedRole('admin')}
                    className={`p-3 rounded-lg border-2 transition-colors duration-200 ${
                      selectedRole === 'admin'
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                        : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                    }`}
                  >
                    <div className="text-center">
                      <div className="font-medium">Admin</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Platform Admin</div>
                    </div>
                  </button>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter any email (demo mode)"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter any password (6+ chars)"
                  required
                  minLength={6}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
            >
              {loading ? (
                'Processing...'
              ) : (
                <>
                  {isRegistering ? <UserPlus className="w-5 h-5 mr-2" /> : <LogIn className="w-5 h-5 mr-2" />}
                  {isRegistering ? 'Create Account (No OTP)' : 'Sign In (No OTP)'}
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsRegistering(!isRegistering)}
              className="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400"
            >
              {isRegistering ? 'Already have an account? Sign in' : 'Need an account? Register here'}
            </button>
          </div>

          {!isRegistering && (
            <div className="mt-6 text-center">
              <a href="#" className="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400">
                Forgot your password?
              </a>
            </div>
          )}
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={toggleTheme}
            className="inline-flex items-center text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 mr-2" /> : <Moon className="w-4 h-4 mr-2" />}
            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>

        {!isRegistering && (
          <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h3 className="font-medium text-blue-900 dark:text-blue-300 mb-3">Quick Demo Access:</h3>
            <div className="space-y-2">
              <button
                onClick={() => quickLogin('merchant')}
                className="w-full text-left p-2 bg-white dark:bg-gray-700 rounded border hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200"
              >
                <div className="text-sm">
                  <strong>Merchant Demo:</strong> merchant@grabberr.com / password123
                </div>
              </button>
              <button
                onClick={() => quickLogin('admin')}
                className="w-full text-left p-2 bg-white dark:bg-gray-700 rounded border hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200"
              >
                <div className="text-sm">
                  <strong>Admin Demo:</strong> admin@grabberr.com / admin123
                </div>
              </button>
            </div>
            <p className="text-xs text-blue-700 dark:text-blue-400 mt-2">
              ✅ No email verification required - instant access!<br/>
              ✅ Mock OTP: 1234 (if needed)
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;