import Link from "next/link";

export default function Home() {
  return (
    <main>
      <h1>Welcome to Your App</h1>
      <Link href="/login">Login</Link>
      <Link href="/register">Register</Link>
    </main>
  );
}
