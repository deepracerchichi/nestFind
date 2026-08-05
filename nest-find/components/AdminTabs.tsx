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
            {/* <Link
                href="/admin/create-listing"
                className="bg-primary text-primary-foreground px-5 py-2.5 rounded-full text-sm font-medium hover:opacity-90 transition-opacity"
            >
                + Create Listing
            </Link> */}
        </div>
    );
}
