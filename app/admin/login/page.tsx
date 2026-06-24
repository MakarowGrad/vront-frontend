"use client";

/**
 * Admin Login Page
 * Mobile-optimized authentication for administrators
 */

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Shield,
  Eye,
  EyeOff,
  Lock,
  Mail,
  ArrowRight,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { apiFetch, setAccessToken, getAccessToken } from "@/lib/api";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Note: auto-redirect removed to prevent loop with expired tokens
  // User must explicitly log in

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await apiFetch("/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok || !data.token) {
        setError(data.message || "Неверный email или пароль");
        setIsLoading(false);
        return;
      }

      setAccessToken(data.token.accessToken);
      setIsLoading(false);
      window.location.href = "/admin/dashboard";
    } catch (err) {
      setError("Ошибка соединения с сервером");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background-primary flex flex-col">
      {/* Header */}
      <header className="bg-background-secondary border-b border-border">
        <div className="max-w-[900px] mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gold/20 flex items-center justify-center">
              <Shield className="w-4 h-4 text-gold" />
            </div>
            <span className="font-serif text-text-primary">Админ-панель</span>
          </div>
          <button
            onClick={() => router.push("/")}
            className="text-sm text-text-secondary hover:text-gold transition-colors"
          >
            На сайт
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-sm">
          {/* Logo & Title */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gold/30 to-gold/10 border border-gold/30 flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-gold" />
            </div>
            <h1 className="font-serif text-2xl text-text-primary mb-2">
              Вход для администратора
            </h1>
            <p className="text-sm text-text-secondary">
              Введите данные для доступа к панели управления
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm animate-in fade-in slide-in-from-top-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-secondary ml-1">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder=""
                  className="w-full pl-12 pr-4 py-4 bg-surface-secondary border border-border rounded-xl text-text-primary placeholder:text-text-muted focus:outline-none focus:border-gold transition-colors"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-secondary ml-1">
                Пароль
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder=""
                  className="w-full pl-12 pr-12 py-4 bg-surface-secondary border border-border rounded-xl text-text-primary placeholder:text-text-muted focus:outline-none focus:border-gold transition-colors"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={cn(
                "w-full flex items-center justify-center gap-2 py-4 rounded-xl font-semibold transition-all",
                isLoading
                  ? "bg-gold/50 cursor-not-allowed"
                  : "bg-gold hover:bg-gold-light active:scale-[0.98]"
              )}
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-background-primary/30 border-t-background-primary rounded-full animate-spin" />
                  <span className="text-background-primary">Вход...</span>
                </>
              ) : (
                <>
                  <span className="text-background-primary">Войти</span>
                  <ArrowRight className="w-5 h-5 text-background-primary" />
                </>
              )}
            </button>
          </form>

          {/* Security Note */}
          <div className="mt-8 p-4 bg-surface-secondary rounded-xl border border-border">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-gold shrink-0 mt-0.5" />
              <div className="text-sm text-text-secondary">
                <p className="font-medium text-text-primary mb-1">Безопасность</p>
                <p>
                  Доступ ограничен авторизованным персоналом.
                  Все действия логируются.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center">
        <p className="text-xs text-text-muted">
          © 2026 В СВОЕЙ ТАРЕЛКЕ. Все права защищены.
        </p>
      </footer>
    </div>
  );
}
