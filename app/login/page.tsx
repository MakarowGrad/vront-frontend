"use client";

/**
 * Customer Login / Register Page
 * Phone + Password authentication (no SMS)
 */

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Phone, Lock, ArrowRight, AlertCircle, LogIn, Loader2, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { encryptData } from "@/app/lib/crypto";
import { API_BASE } from "@/lib/api";

export default function CustomerLoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [phone, setPhone] = useState("+7");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // If already logged in, redirect to orders
    (async () => {
      const { decryptData } = await import("@/app/lib/crypto");
      const savedPhone = await decryptData(localStorage.getItem("customer_phone") || "");
      if (savedPhone) {
        router.push("/orders");
      }
    })();
  }, [router]);

  const formatPhone = (value: string) => {
    let digits = value.replace(/\D/g, "");
    if (digits.length === 0) return "+7";
    if (!digits.startsWith("7")) {
      digits = "7" + digits;
    }
    digits = digits.slice(0, 11);
    const after7 = digits.slice(1);
    let result = "+7";
    if (after7.length > 0) result += " (" + after7.slice(0, 3);
    if (after7.length >= 3) result += ") " + after7.slice(3, 6);
    if (after7.length >= 6) result += "-" + after7.slice(6, 8);
    if (after7.length >= 8) result += "-" + after7.slice(8, 10);
    return result;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    if (raw.length < 2 || (raw.length === 2 && raw !== "+7")) {
      setPhone("+7");
      return;
    }
    const digits = raw.replace(/\D/g, "");
    if (digits.length <= 11) {
      setPhone(formatPhone(raw));
    }
  };

  const getPlainPhone = (formatted: string) => {
    const digits = formatted.replace(/\D/g, "");
    return digits.length === 11 ? `+${digits}` : formatted;
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError("");

    const plainPhone = getPlainPhone(phone);
    if (plainPhone.replace(/\D/g, "").length < 10) {
      setError("Введите корректный номер телефона");
      return;
    }

    if (password.length < 4) {
      setError("Пароль должен содержать минимум 4 символа");
      return;
    }

    if (mode === "register" && !name.trim()) {
      setError("Введите ваше имя");
      return;
    }

    setIsLoading(true);
    try {
      const endpoint = mode === "login" ? "/customers/login" : "/customers/register";
      const body = mode === "login"
        ? { phone: plainPhone, password }
        : { phone: plainPhone, password, name: name.trim() };

      const res = await fetch(`${API_BASE}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Ошибка");
      }

      // Store encrypted PII
      localStorage.setItem("customer_phone", await encryptData(data.phone));
      if (data.name) localStorage.setItem("customer_name", await encryptData(data.name));

      router.push("/orders");
    } catch (err: any) {
      setError(err.message || "Ошибка");
    } finally {
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
              <LogIn className="w-4 h-4 text-gold" />
            </div>
            <span className="font-serif text-text-primary">
              {mode === "login" ? "Вход" : "Регистрация"}
            </span>
          </div>
          <button
            onClick={() => router.push("/")}
            className="text-sm text-text-secondary hover:text-gold transition-colors"
          >
            На главную
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-sm">
          {/* Logo & Title */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gold/30 to-gold/10 border border-gold/30 flex items-center justify-center mx-auto mb-4">
              <Phone className="w-8 h-8 text-gold" />
            </div>
            <h1 className="font-serif text-2xl text-text-primary mb-2">
              {mode === "login" ? "Вход в аккаунт" : "Создать аккаунт"}
            </h1>
            <p className="text-sm text-text-secondary">
              {mode === "login"
                ? "Введите номер телефона и пароль"
                : "Введите данные для регистрации"}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm animate-in fade-in slide-in-from-top-2 mb-4">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Phone */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-secondary ml-1">
                Телефон <span className="text-error">*</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                <input
                  type="tel"
                  value={phone}
                  onChange={handlePhoneChange}
                  placeholder="+7 (___) ___-__-__"
                  className="w-full pl-12 pr-4 py-4 bg-surface-secondary border border-border rounded-xl text-text-primary placeholder:text-text-muted focus:outline-none focus:border-gold transition-colors"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-secondary ml-1">
                Пароль <span className="text-error">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Минимум 4 символа"
                  className="w-full pl-12 pr-4 py-4 bg-surface-secondary border border-border rounded-xl text-text-primary placeholder:text-text-muted focus:outline-none focus:border-gold transition-colors"
                  required
                  minLength={4}
                />
              </div>
            </div>

            {/* Name (register only) */}
            {mode === "register" && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-secondary ml-1">
                  Имя <span className="text-error">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Как к вам обращаться?"
                    className="w-full pl-12 pr-4 py-4 bg-surface-secondary border border-border rounded-xl text-text-primary placeholder:text-text-muted focus:outline-none focus:border-gold transition-colors"
                    required
                  />
                </div>
              </div>
            )}

            {/* Submit */}
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
                  <span className="text-background-primary">Загрузка...</span>
                </>
              ) : (
                <>
                  <span className="text-background-primary">
                    {mode === "login" ? "Войти" : "Зарегистрироваться"}
                  </span>
                  <ArrowRight className="w-5 h-5 text-background-primary" />
                </>
              )}
            </button>
          </form>

          {/* Toggle mode */}
          <div className="text-center mt-6">
            <button
              type="button"
              onClick={() => {
                setMode(mode === "login" ? "register" : "login");
                setError("");
                setPassword("");
                setName("");
              }}
              className="text-sm text-text-muted hover:text-gold transition-colors"
            >
              {mode === "login"
                ? "Нет аккаунта? Зарегистрироваться"
                : "Уже есть аккаунт? Войти"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
