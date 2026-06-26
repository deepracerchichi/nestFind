"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { registerUser } from "@/lib/auth";

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"user" | "admin">("user");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setError("");
    setLoading(true);

    try {
      const { user }= await registerUser(username, email, password, role);
      if (user.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/dashboard")
      }
      router.push("/");
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
      <h1 className="text-2xl font-bold mb-6">Register</h1>

      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      <div className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="border rounded-md p-2 w-full"
        />
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

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setRole("user")}
            className={`border-2 rounded-md p-3 text-sm font-medium transition-colors ${
              role === "user"
                ? "border-blue-600 bg-blue-50 text-blue-600"
                : "border-gray-200 text-gray-500 hover:border-gray-300"
            }`}
          >
            Home Buyer
            <p className="text-xs font-normal mt-1 text-gray-400">Browse & save listings</p>
          </button>
          <button
            type="button"
            onClick={() => setRole("admin")}
            className={`border-2 rounded-md p-3 text-sm font-medium transition-colors ${
              role === "admin"
                ? "border-blue-600 bg-blue-50 text-blue-600"
                : "border-gray-200 text-gray-500 hover:border-gray-300"
            }`}
          >
            Realtor
            <p className="text-xs font-normal mt-1 text-gray-400">Post & manage listings</p>
          </button>
        </div>

        <button
          onClick={handleRegister}
          disabled={loading}
          className="bg-blue-600 text-white rounded-md p-2 hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </div>

      <p className="text-sm mt-4 text-center">
        Already have an account?{" "}
        <Link href="/login" className="text-blue-600 hover:underline">
          Login
        </Link>
      </p>
    </div>
  );
}