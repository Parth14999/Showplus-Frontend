import React, { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";

export default function AuthModal({ isOpen, onClose }) {
  const [isLogin, setIsLogin] = useState(false); // Default to Sign Up
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const signup = useAuthStore((state) => state.signup);
  const login = useAuthStore((state) => state.login);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    console.log("1. Form submitted with:", { name, email, password, isLogin });

    try {
      if (isLogin) {
        console.log("2. Attempting login...");
        await login(email, password);
      } else {
        console.log("2. Attempting signup...");
        if (typeof signup !== "function") {
          throw new Error("signup is not defined in useAuthStore!");
        }
        await signup(name, email, password);
      }
      console.log("3. Auth successful!");
      onClose();
    } catch (err) {
      console.error("Auth Error:", err);
      setError(err.message || "Authentication failed");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[9999]">
      <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl w-full max-w-md text-white shadow-2xl relative">
        <h2 className="text-2xl font-bold text-center mb-6 text-rose-500">
          {isLogin ? "Welcome Back" : "Create Account"}
        </h2>

        {error && (
          <div className="bg-rose-500/10 border border-rose-500 text-rose-400 p-3 rounded-lg text-sm mb-4 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Full Name
              </label>
              <input
                type="text"
                placeholder="John Doe"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-rose-500"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">
              Email
            </label>
            <input
              type="email"
              placeholder="user@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-rose-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-rose-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-rose-600 hover:bg-rose-500 text-white font-semibold py-3 rounded-xl transition cursor-pointer"
          >
            {isLogin ? "Sign In" : "Sign Up"}
          </button>
        </form>

        <p className="text-center text-xs text-slate-400 mt-6">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-rose-400 hover:underline font-semibold"
          >
            {isLogin ? "Sign Up" : "Sign In"}
          </button>
        </p>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white text-lg font-bold"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
