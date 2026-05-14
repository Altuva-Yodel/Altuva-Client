import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useCustomerStore from '../stores/customerStore';
import useCartStore from '../stores/cartStore';
import Navbar from '../components/basic/Navbar';
import MapSection from '../components/basic/MapSection';
import Footer from '../components/basic/Footer';

const LoginPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/';

    const { login, isLoading, error, clearError } = useCustomerStore();
    const { fetchCart } = useCartStore();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        clearError();
        try {
            await login(email, password);
            await fetchCart();
            navigate(from, { replace: true });
        } catch {
            // error set in store
        }
    };

    return (
        <>
            <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 font-poppins">
                <div className="w-full max-w-md">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome back</h1>
                    <p className="text-gray-500 text-sm mb-8">Sign in to your account</p>

                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                                placeholder="you@example.com"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gray-900 text-white py-3 rounded-lg text-sm font-medium hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {isLoading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>

                    <p className="mt-6 text-center text-sm text-gray-500">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-gray-900 font-medium hover:underline">
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
            <MapSection />
            <Footer />
        </>
    );
};

export default LoginPage;
