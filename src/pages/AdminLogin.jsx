import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminLogin } from '../utils/api';
import { useTheme } from '../context/ThemeContext';

const AdminLogin = () => {
    const { isDark } = useTheme();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await adminLogin(formData.email, formData.password);

            if (response.success) {
                navigate('/admin/dashboard');
            } else {
                setError(response.message || 'Credenciales inválidas');
            }
        } catch (err) {
            setError('Error al iniciar sesión. Por favor intenta de nuevo.');
            console.error('Login error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        setError('');
    };

    return (
        <div className="min-h-screen bg-[#050511] flex items-center justify-center px-4 py-12 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-full z-0">
                <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-cyan-500/10 blur-[120px] rounded-full"></div>
                <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full"></div>
                <div className="absolute inset-0 bg-pattern-dark opacity-20"></div>
            </div>

            <div className="max-w-md w-full relative z-10">
                <div className="text-center mb-10">
                    <div className="inline-block p-4 rounded-3xl bg-white/5 border border-white/10 mb-6 backdrop-blur-md shadow-2xl">
                        <span className="text-4xl text-cyan-400">🤖</span>
                    </div>
                    <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">
                        XpertIA <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Admin</span>
                    </h1>
                    <p className="text-slate-500 font-medium uppercase text-xs tracking-[0.2em]">Control Center Access</p>
                </div>

                <div className="bg-[#0f1026]/60 backdrop-blur-xl p-10 rounded-[2.5rem] border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                    {error && (
                        <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 animate-shake">
                            <span className="text-red-400">⚠️</span>
                            <p className="text-red-400 text-sm font-medium">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 ml-1">
                                Email Corporativo
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-slate-600 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 outline-none transition-all"
                                placeholder="tu@empresa.com"
                            />
                        </div>

                        <div>
                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 ml-1">
                                Contraseña
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-slate-600 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 outline-none transition-all pr-14"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-xl text-slate-500 hover:text-cyan-400 border border-transparent hover:border-white/10 hover:bg-white/5 transition-all"
                                    aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                                >
                                    {showPassword ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 19c-7 0-11-7-11-7a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 5c7 0 11 7 11 7a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                                            <line x1="1" y1="1" x2="23" y2="23"></line>
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                            <circle cx="12" cy="12" r="3"></circle>
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-2xl transition-all font-bold shadow-xl shadow-cyan-900/30 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
                        >
                            {isLoading ? 'Inyectando Credenciales...' : 'Acceder al Panel'}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <button
                            onClick={() => navigate('/')}
                            className="text-slate-500 hover:text-cyan-400 transition-colors text-sm font-semibold flex items-center justify-center gap-2 mx-auto px-4 py-2 rounded-xl hover:bg-white/5"
                        >
                            ← Volver al sitio principal
                        </button>
                    </div>
                </div>

                <div className="mt-8 text-center text-[10px] text-slate-600 font-black uppercase tracking-[0.3em]">
                    <p>Acceso Restringido - Sólo Personal Autorizado</p>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
