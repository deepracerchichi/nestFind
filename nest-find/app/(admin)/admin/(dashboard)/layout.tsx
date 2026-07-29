import AdminTabs from "@/components/AdminTabs";

export default function AdminDashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen pt-24 px-6 md:px-14 pb-16">
            <div className="max-w-6xl mx-auto">
                <div className="mb-8">
                    <AdminTabs />
                </div>
                {children}
            </div>
        </div>
    );
}
