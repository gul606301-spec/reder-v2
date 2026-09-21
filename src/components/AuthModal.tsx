import React, { useState } from 'react';
import {
  BookOpen,
  ArrowRight,
  Mail,
  Lock,
  Phone,
  User,
  AlertCircle,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { useReader } from '../context/ReaderContext';

interface AuthModalProps {
  forceOpen?: boolean;
  onClose?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ forceOpen, onClose }) => {
  const { profile, accounts, signIn, signUp } = useReader();

  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot'>(() => {
    return Object.keys(accounts || {}).length === 0 ? 'signup' : 'signin';
  });
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');

  // Sign up fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // Status & errors
  const [errorMessage, setErrorMessage] = useState('');
  const [infoMessage, setInfoMessage] = useState('');

  // If already logged in and not forced open, don't show
  if (profile && !forceOpen) return null;

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    const result = signIn(identifier, password);
    if (!result.success) {
      setErrorMessage(result.error || 'Giriş yapılamadı.');
    } else {
      if (onClose) onClose();
    }
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!name.trim() || !email.trim()) {
      setErrorMessage('Lütfen adınızı ve e-posta adresinizi girin.');
      return;
    }

    const data = {
      name: name.trim(),
      email: email.trim(),
      username: username.trim() || name.toLowerCase().replace(/[^a-z0-9_]/g, ''),
      phone: phone.trim(),
      password: newPassword || '123456',
    };

    const result = signUp(data);
    if (!result.success) {
      setErrorMessage(result.error || 'Kayıt tamamlanamadı.');
    } else {
      if (onClose) onClose();
    }
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setInfoMessage(`Şifre sıfırlama bağlantısı ${identifier || 'e-posta adresinize'} iletildi.`);
    setTimeout(() => {
      setMode('signin');
      setInfoMessage('');
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/90 backdrop-blur-md overflow-y-auto">
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl my-8 relative">
        {onClose && profile && (
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-neutral-400 hover:text-white p-1 rounded-lg hover:bg-neutral-800"
          >
            ✕
          </button>
        )}

        {/* Logo & Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 text-neutral-950 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-amber-500/20">
            <BookOpen className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-bold text-white font-serif tracking-tight">
            Reader Hub
          </h2>
          <p className="text-neutral-400 text-xs mt-1">
            Kişisel okuma kütüphaneniz, hedefleriniz ve kitap topluluğu
          </p>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex bg-neutral-950/70 p-1 rounded-xl border border-neutral-800 mb-5">
          <button
            type="button"
            onClick={() => {
              setMode('signin');
              setErrorMessage('');
              setInfoMessage('');
            }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              mode === 'signin'
                ? 'bg-neutral-800 text-amber-400 shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Giriş Yap
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setErrorMessage('');
              setInfoMessage('');
            }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              mode === 'signup'
                ? 'bg-neutral-800 text-amber-400 shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Yeni Hesap Oluştur
          </button>
        </div>

        {/* Alerts */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        {infoMessage && (
          <div className="mb-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-amber-400" />
            <span>{infoMessage}</span>
          </div>
        )}

        {/* 1. SIGN IN FORM */}
        {mode === 'signin' && (
          <form onSubmit={handleSignIn} className="space-y-3.5">
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">
                E-posta, Kullanıcı Adı veya Telefon
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="ornek@eposta.com veya kullaniciadi"
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-xl pl-10 pr-3 py-2.5 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-amber-500"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-medium text-neutral-300">Şifre</label>
                <button
                  type="button"
                  onClick={() => setMode('forgot')}
                  className="text-[11px] text-amber-400/80 hover:text-amber-300"
                >
                  Şifremi Unuttum?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-xl pl-10 pr-3 py-2.5 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold rounded-xl text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-[0.98]"
            >
              <span>Hesabıma Giriş Yap</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* 2. SIGN UP FORM */}
        {mode === 'signup' && (
          <form onSubmit={handleSignUp} className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">Ad Soyad *</label>
              <div className="relative">
                <User className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Adınız Soyadınız"
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-xl pl-10 pr-3 py-2 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-amber-500"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">Kullanıcı Adı</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="kullanici_adiniz"
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">Telefon</label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-3" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+90 5XX ..."
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-xl pl-9 pr-2 py-2 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">E-posta Adresi *</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ornek@eposta.com"
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-xl pl-10 pr-3 py-2 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-amber-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">Şifre Belirleyin</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3" />
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="En az 6 karakter"
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-xl pl-10 pr-3 py-2 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold rounded-xl text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 mt-2"
            >
              <span>Hesap Oluştur</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* 3. FORGOT PASSWORD FORM */}
        {mode === 'forgot' && (
          <form onSubmit={handleForgotSubmit} className="space-y-3.5">
            <h3 className="text-sm font-semibold text-white">Şifre Sıfırlama</h3>
            <p className="text-xs text-neutral-400">
              Kayıtlı e-posta adresinizi girin, size şifre sıfırlama talimatı gönderelim.
            </p>
            <input
              type="email"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="ornek@eposta.com"
              className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
              required
            />
            <button
              type="submit"
              className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold rounded-xl text-sm"
            >
              Sıfırlama Bağlantısı Gönder
            </button>
            <button
              type="button"
              onClick={() => setMode('signin')}
              className="text-xs text-neutral-400 hover:text-white block mx-auto pt-1"
            >
              Giriş Ekranına Dön
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
