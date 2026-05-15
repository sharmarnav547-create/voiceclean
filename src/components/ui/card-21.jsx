import * as React from "react";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

const DestinationCard = React.forwardRef(
  ({ className, imageUrl, location, flag, stats, href, themeColor, ...props }, ref) => {
    return (
      <div
        ref={ref}
        style={{ "--theme-color": themeColor }}
        className={cn("group w-full h-full", className)}
        {...props}
      >
        <a
          href={href}
          className="relative block w-full h-full rounded-2xl overflow-hidden shadow-lg
                     transition-all duration-500 ease-in-out
                     group-hover:scale-105"
          aria-label={`Explore details for ${location}`}
          style={{ boxShadow: `0 0 40px -15px hsl(var(--theme-color) / 0.5)` }}
        >
          {/* Background Image with Parallax Zoom */}
          <div
            className="absolute inset-0 bg-cover bg-center
                       transition-transform duration-500 ease-in-out group-hover:scale-110"
            style={{ backgroundImage: `url(${imageUrl})` }}
          />

          {/* Themed Gradient Overlay */}
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(to top, hsl(var(--theme-color) / 0.9), hsl(var(--theme-color) / 0.6) 30%, transparent 60%)`,
            }}
          />

          {/* Content */}
          <div className="relative flex flex-col justify-end h-full p-6 text-white">
            <h3 className="text-3xl font-bold tracking-tight">
              {location} <span className="text-2xl ml-1">{flag}</span>
            </h3>
            <p className="text-sm text-white/80 mt-1 font-medium">{stats}</p>

            {/* Explore Button */}
            <div className="mt-8 flex items-center justify-between bg-white/10 backdrop-blur-md border border-white/20
                           rounded-lg px-4 py-3
                           transition-all duration-300
                           group-hover:bg-white/20 group-hover:border-white/30">
              <span className="text-sm font-semibold tracking-wide">Explore Now</span>
              <ArrowRight className="h-4 w-4 transform transition-transform duration-300 group-hover:translate-x-1" />
            </div>
          </div>
        </a>
      </div>
    );
  }
);
DestinationCard.displayName = "DestinationCard";

export { DestinationCard };
