import {Bookmark, Search, Share2} from "lucide-react";

const AboutUs = () => {
    const steps = [
        {
            icon: Search,
            title: "Browse & Filter",
            description: "Explore thousands of verified listings. Filter by type, price, location, and amenities."
        },
        {
            icon: Bookmark,
            title: "Save & Compare",
            description: "Save properties you love and revisit them to compare side by side at any time."
        },
        {
            icon: Share2,
            title: "Connect Directly",
            description: "Message or call owners and realtors directly — no middleman, no delays."
        },
    ]

    return (
        <section className="bg-background py-20 px-14">
            <div className="container mx-auto text-center">
                <p className="uppercase font-other text-muted-foreground text-md tracking-widest">
                    Simple Process
                </p>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mt-2">
                    How NestFind Works
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                    {steps.map((step, idx) => (
                        <div key={idx} className="flex flex-col items-center">
                            <div className="rounded-2xl h-20 w-20 bg-foreground flex items-center justify-center mb-5">
                                <step.icon size={36} className="text-primary" />
                            </div>

                            <h3 className="text-3xl font-bold mb-2">
                                {step.title}
                            </h3>

                            <p className="font-other text-muted-foreground text-md leading-relaxed">
                                {step.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default AboutUs
