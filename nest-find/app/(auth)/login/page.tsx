"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { loginUser } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError("");
    setLoading(true);

    try {
      const { user } = await loginUser(email, password); //cookie is set automatically by the browser

      if (user.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      setError(axiosErr.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
      <h1 className="text-2xl font-bold mb-6">Login</h1>

      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      <div className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border rounded-md p-2 w-full"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border rounded-md p-2 w-full"
        />
        <button
          onClick={handleLogin}
          disabled={loading}
          className="bg-blue-600 text-white rounded-md p-2 hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </div>

      <p className="text-sm mt-4 text-center">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="text-blue-600 hover:underline">
          Register
        </Link>
      </p>
    </div>
  );
}