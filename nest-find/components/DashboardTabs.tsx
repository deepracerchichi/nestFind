"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
    { href: "/dashboard", label: "Overview" },
    { href: "/dashboard/savedlistings", label: "Saved Listings" },
];

export default function DashboardTabs() {
    const pathname = usePathname();

    return (
        <nav className="flex gap-8 border-b border-border">
            {TABS.map((tab) => {
                const isActive = pathname === tab.href;
                return (
                    <Link
                        key={tab.href}
                        href={tab.href}
                        className={`pb-3 text-sm font-medium border-b-2 -mb-px transition-colors ${
                            isActive
                                ? "border-primary text-foreground"
                                : "border-transparent text-muted-foreground hover:text-foreground"
                        }`}
                    >
                        {tab.label}
                    </Link>
                );
            })}
        </nav>
    );
}
