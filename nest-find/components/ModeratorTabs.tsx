"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
    { href: "/moderator", label: "Pending Listings" },
    { href: "/moderator/reports", label: "Reports" },
];

export default function ModeratorTabs() {
    const pathname = usePathname();

    return (
        <nav className="inline-flex bg-foreground rounded-full p-1 gap-1">
            {TABS.map((tab) => {
                const isActive = pathname === tab.href;
                return (
                    <Link
                        key={tab.href}
                        href={tab.href}
                        className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
                            isActive
                                ? "bg-primary text-primary-foreground"
                                : "text-muted-foreground hover:text-background"
                        }`}
                    >
                        {tab.label}
                    </Link>
                );
            })}
        </nav>
    );
}
