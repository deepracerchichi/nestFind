"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const TABS = [
    { href: "/dashboard", label: "Overview" },
    { href: "/dashboard/savedlistings", label: "Saved Listings" },
    { href: "/dashboard/messages", label: "Messages" },
];

export default function DashboardTabs() {
    const pathname = usePathname();
    const { unreadCount } = useAuth();

    return (
        <nav className="inline-flex bg-foreground rounded-full p-1 gap-1">
            {TABS.map((tab) => {
                // Messages has its own nested /[id] route for individual chats,
                // so it stays "active" while viewing any conversation too.
                const isActive =
                    tab.href === "/dashboard/messages"
                        ? pathname.startsWith(tab.href)
                        : pathname === tab.href;
                return (
                    <Link
                        key={tab.href}
                        href={tab.href}
                        className={`flex items-center gap-1.5 px-5 py-2 rounded-full text-sm font-medium transition-colors ${
                            isActive
                                ? "bg-primary text-primary-foreground"
                                : "text-muted-foreground hover:text-background"
                        }`}
                    >
                        {tab.label}
                        {tab.href === "/dashboard/messages" && unreadCount > 0 && (
                            <span className="h-4 min-w-4 px-1 rounded-full bg-primary text-primary-foreground text-[10px] font-semibold flex items-center justify-center">
                                {unreadCount > 9 ? "9+" : unreadCount}
                            </span>
                        )}
                    </Link>
                );
            })}
        </nav>
    );
}
