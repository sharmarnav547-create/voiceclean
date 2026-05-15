import { CreativePricing } from "@/components/ui/creative-pricing";
import { Pencil, Star, Sparkles } from "lucide-react";

const sampleTiers = [
    {
        name: "Creator",
        icon: <Pencil className="w-6 h-6" />,
        price: 29,
        description: "Perfect for short video beginners",
        color: "amber",
        features: [
            "60-second Video Export",
            "10 Trending Templates",
            "Auto Text-to-Speech",
            "Basic Transitions",
        ],
    },
    {
        name: "Influencer",
        icon: <Star className="w-6 h-6" />,
        price: 79,
        description: "For serious content creators",
        color: "blue",
        features: [
            "3-minute Video Export",
            "Voice Effects & Filters",
            "Trending Sound Library",
            "Auto Captions & Subtitles",
        ],
        popular: true,
    },
    {
        name: "Pro Studio",
        icon: <Sparkles className="w-6 h-6" />,
        price: 149,
        description: "For viral content masters",
        color: "purple",
        features: [
            "Multi-clip Editing",
            "Green Screen Effects",
            "Viral Sound Detection",
            "Engagement Analytics",
        ],
    },
];

function CreativePricingDemo() {
    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center py-20 px-4">
            <CreativePricing tiers={sampleTiers} />
        </div>
    );
}

export { CreativePricingDemo };
