import DashboardTabs from "@/components/DashboardTabs";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen flex flex-col">
            <div className="bg-background pt-24 px-6 md:px-14 pb-8">
                <div className="max-w-6xl mx-auto">
                    <DashboardTabs />
                </div>
            </div>
            <div className="bg-foreground flex-1 px-6 md:px-14 pt-8 pb-16">
                <div className="max-w-6xl mx-auto">
                    {children}
                </div>
            </div>
        </div>
    );
}
