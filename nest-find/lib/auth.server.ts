import { cookies } from "next/headers";
import type { User } from "@/types/auth";

// Server-only: reads the incoming request's cookies and asks the backend
// who's logged in, so the initial render already knows the answer instead
// of the client fetching it after mount (and flashing a logged-out state).
export async function getServerUser(): Promise<User | null> {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();
    if (!cookieHeader) return null;

    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/me`, {
            headers: { Cookie: cookieHeader },
            cache: "no-store",
        });

        if (!res.ok) return null;

        const data = await res.json();
        return {
            id: data._id,
            username: data.username,
            email: data.email,
            role: data.role,
        };
    } catch {
        return null;
    }
}
