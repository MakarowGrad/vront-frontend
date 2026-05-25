"use client";

/**
 * Customer Login Page
 * 2-step SMS OTP authentication
 */

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Phone, ArrowRight, AlertCircle, LogIn, Loader2, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { encryptData } from "@/app/lib/crypto";
import { API_BASE } from "@/lib/api";

export default function CustomerLoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<"phone" | "code">("phone");
  const [phone, setPhone] = useState("+7");
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [devCode, setDevCode] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // SECURITY-FIX-LS-002: Check encrypted phone [2026-05-18]
    (async () => {
      const { decryptData } = await import("@/app/lib/crypto");
      const savedPhone = await decryptData(localStorage.getItem("customer_phone") || "");
      if (savedPhone) {
        router.push("/orders");
      }
    })();
  }, [router]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  useEffect(() => {
    if (step === "code" && inputRef.current) {
      inputRef.current.focus();
    }
  }, [step]);

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

  const handleSendOtp = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError("");

    const plainPhone = getPlainPhone(phone);
    if (plainPhone.replace(/\D/g, "").length < 10) {
      setError("Введите корректный номер телефона");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/customers/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: plainPhone }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Ошибка при отправке кода");
      }

      // DEV: show code on screen since SMS is not connected
      if (data.code) {
        setDevCode(data.code);
      }

      setStep("code");
      setCountdown(60);
    } catch (err: any) {
      setError(err.message || "Ошибка при отправке кода");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError("");

    const plainPhone = getPlainPhone(phone);
    if (code.length !== 6) {
      setError("Введите 6-значный код");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/customers/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: plainPhone, code }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Неверный код");
      }

      // SECURITY-FIX-LS-002: Encrypt PII before storing in localStorage [2026-05-18]
      localStorage.setItem("customer_phone", await encryptData(data.phone));
      if (data.name) localStorage.setItem("customer_name", await encryptData(data.name));

      // Redirect to orders
      router.push("/orders");
    } catch (err: any) {
      setError(err.message || "Неверный код");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = () => {
    if (countdown > 0) return;
    setCode("");
    setDevCode("");
    handleSendOtp();
  };

  const handleBack = () => {
    setStep("phone");
    setCode("");
    setError("");
    setDevCode("");
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
            <span className="font-serif text-text-primary">Вход</span>
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
              {step === "phone" ? "Вход по номеру" : "Код подтверждения"}
            </h1>
            <p className="text-sm text-text-secondary">
              {step === "phone"
                ? "Введите номер телефона для доступа к истории заказов"
                : `Код отправлен на ${phone}`}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm animate-in fade-in slide-in-from-top-2 mb-4">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* DEV: Show code */}
          {devCode && (
            <div className="p-4 rounded-xl bg-gold/10 border border-gold/30 text-center mb-4">
              <p className="text-caption text-gold mb-1">Код для тестирования (SMS не подключён)</p>
              <p className="text-3xl font-mono font-bold text-gold tracking-[0.3em]">{devCode}</p>
            </div>
          )}

          {step === "phone" ? (
            /* Step 1: Phone Input */
            <form onSubmit={handleSendOtp} className="space-y-4">
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
                    <span className="text-background-primary">Отправка...</span>
                  </>
                ) : (
                  <>
                    <span className="text-background-primary">Получить код</span>
                    <ArrowRight className="w-5 h-5 text-background-primary" />
                  </>
                )}
              </button>
            </form>
          ) : (
            /* Step 2: OTP Input */
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-secondary ml-1">
                  Код из SMS <span className="text-error">*</span>
                </label>
                <input
                  ref={inputRef}
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={code}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "").slice(0, 6);
                    setCode(val);
                    if (val.length === 6) {
                      setTimeout(() => handleVerifyOtp(), 100);
                    }
                  }}
                  placeholder="000000"
                  className="w-full px-4 py-4 bg-surface-secondary border border-border rounded-xl text-text-primary text-center text-2xl font-mono tracking-[0.5em] placeholder:text-text-muted placeholder:tracking-normal placeholder:text-base focus:outline-none focus:border-gold transition-colors"
                  autoFocus
                />
              </div>

              <button
                type="submit"
                disabled={isLoading || code.length !== 6}
                className={cn(
                  "w-full flex items-center justify-center gap-2 py-4 rounded-xl font-semibold transition-all",
                  isLoading || code.length !== 6
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
                  <span className="text-background-primary">Войти</span>
                )}
              </button>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={handleBack}
                  className="text-sm text-text-muted hover:text-text-primary transition-colors"
                >
                  Изменить номер
                </button>

                <button
                  type="button"
                  onClick={handleResend}
                  disabled={countdown > 0}
                  className={cn(
                    "text-sm flex items-center gap-1 transition-colors",
                    countdown > 0
                      ? "text-text-muted cursor-not-allowed"
                      : "text-gold hover:text-gold-light"
                  )}
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  {countdown > 0 ? `Повторить через ${countdown}` : "Отправить снова"}
                </button>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
