"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
    { href: "/admin", label: "Overview" },
    { href: "/admin/listings", label: "My Listings" },
];

export default function AdminTabs() {
    const pathname = usePathname();

    return (
        <div className="flex items-center justify-between gap-4 flex-wrap">
            <nav className="flex gap-8 border-b border-border flex-1">
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
            <Link
                href="/admin/create-listing"
                className="bg-primary text-primary-foreground px-5 py-2.5 rounded-full text-sm font-medium hover:opacity-90 transition-opacity"
            >
                + Create Listing
            </Link>
        </div>
    );
}
