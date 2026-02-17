"use client";

import { useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { 
  ChevronLeft, 
  ChevronRight, 
  ShoppingBag, 
  Store, 
  Calendar, 
  Zap, 
  Target,
  Sparkles,
  MapPin,
  Coffee,
  Pizza,
  Car,
  Tent,
  Palette
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";

const categories = [
  { id: "all", name: "All", icon: Sparkles },
  { id: "seafood", name: "Seafood", icon: null },
  { id: "drinks", name: "Drinks", icon: Coffee },
  { id: "pizza", name: "Pizza", icon: Pizza },
  { id: "shops", name: "Shops", icon: Store },
  { id: "toys", name: "Toys", icon: null },
  { id: "motor", name: "Motor", icon: Car },
  { id: "nearby", name: "Nearby", icon: MapPin },
  { id: "fashion", name: "Fashion", icon: ShoppingBag },
  { id: "electronics", name: "Electronics", icon: Zap },
  { id: "home", name: "Home Living", icon: Tent },
  { id: "beauty", name: "Beauty", icon: Palette },
  { id: "services", name: "Services", icon: Target },
];

const entityFilters = [
  { id: "all", name: "All" },
  { id: "services", name: "Services" },
  { id: "products", name: "Products" },
  { id: "shops", name: "Shops" },
  { id: "promotions", name: "Promotions" },
  { id: "popular", name: "Popular" },
  { id: "nearby", name: "Nearby" },
];

export function DiscoveryBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get("category") || "all";
  const [activeFilter, setActiveFilter] = useState("all");
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleFilterClick = (filterId: string) => {
    setActiveFilter(filterId);
    
    // Navigate based on filter type
    if (filterId === "promotions") {
      router.push("/products?filter=promotions");
    } else if (filterId === "popular") {
      router.push("/products?filter=popular");
    } else if (filterId === "nearby") {
      router.push("/shops?filter=nearby");
    } else if (filterId === "services") {
      router.push("/services");
    } else if (filterId === "shops") {
      router.push("/shops");
    } else {
      router.push("/products");
    }
  };

  const handleCategoryClick = (categoryId: string) => {
    if (categoryId === "all") {
      router.push("/products");
    } else {
      router.push(`/products?category=${categoryId}`);
    }
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="w-full bg-white/80 backdrop-blur-md sticky top-20 z-40 border-b border-black/[0.03] py-4">
      <div className="container mx-auto px-4 lg:px-12 space-y-6">
        {/* Category Carousel Row */}
        <div className="relative group">
          <button 
            onClick={() => scroll("left")}
            className="absolute left-[-20px] top-1/2 -translate-y-1/2 z-10 h-10 w-10 bg-white border shadow-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary hover:text-white"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          
          <div 
            ref={scrollRef}
            className="flex items-center space-x-3 overflow-x-auto no-scrollbar scroll-smooth"
          >
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.id)}
                className={cn(
                  "flex-shrink-0 flex items-center gap-2 px-6 py-3 rounded-none text-xs font-black uppercase tracking-widest transition-all duration-300 border",
                  activeCategory === cat.id 
                    ? "bg-black text-white border-black" 
                    : "bg-muted/30 text-muted-foreground border-transparent hover:border-black/10 hover:bg-white hover:text-black"
                )}
              >
                {cat.icon && <cat.icon className="h-3.5 w-3.5" />}
                {cat.name}
              </button>
            ))}
          </div>

          <button 
            onClick={() => scroll("right")}
            className="absolute right-[-20px] top-1/2 -translate-y-1/2 z-10 h-10 w-10 bg-white border shadow-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary hover:text-white"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        {/* Entity Filter Row */}
        <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar py-1">
          {entityFilters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => handleFilterClick(filter.id)}
              className={cn(
                "px-5 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 whitespace-nowrap",
                activeFilter === filter.id 
                  ? "bg-primary text-white" 
                  : "text-black/40 hover:text-black hover:bg-black/5"
              )}
            >
              {filter.name}
            </button>
          ))}
        </div>
      </div>
      
      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
