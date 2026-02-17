import React from "react";
import { 
  Cpu, 
  Laptop, 
  Smartphone, 
  Shirt, 
  Watch, 
  Footprints, 
  Home, 
  Lamp, 
  Armchair, 
  Flower2, 
  Sparkles, 
  Moon, 
  Terminal, 
  Wrench, 
  Settings, 
  ShoppingBag,
  Store,
  Tag,
  Calendar,
  LucideIcon
} from "lucide-react";

export type CategoryType = 
  | "Electronics" | "Tech" | "Mobile" 
  | "Fashion" | "Clothing" | "Accessories" | "Watches" | "Shoes"
  | "Home" | "Decor" | "Furniture"
  | "Wellness" | "Spa" | "Beauty"
  | "IT" | "Software" | "Hardware"
  | "General" | "Shop" | "Product";

interface BrandIconProps extends React.SVGProps<SVGSVGElement> {
  category?: string;
  fallback?: LucideIcon;
  size?: number;
  className?: string;
}

export const BrandIcon = ({ 
  category = "General", 
  fallback: Fallback = ShoppingBag, 
  size = 20, 
  className 
}: BrandIconProps) => {
  const cat = category.toLowerCase();

  // Mapping logic
  if (cat.includes("electro") || cat.includes("pc") || cat.includes("comput")) return <Laptop size={size} className={className} />;
  if (cat.includes("tech") || cat.includes("cpu")) return <Cpu size={size} className={className} />;
  if (cat.includes("phone") || cat.includes("mobile")) return <Smartphone size={size} className={className} />;
  
  if (cat.includes("fashion") || cat.includes("cloth") || cat.includes("shirt")) return <Shirt size={size} className={className} />;
  if (cat.includes("watch")) return <Watch size={size} className={className} />;
  if (cat.includes("shoe") || cat.includes("foot")) return <Footprints size={size} className={className} />;

  if (cat.includes("decor") || cat.includes("lamp")) return <Lamp size={size} className={className} />;
  if (cat.includes("hom") || cat.includes("furniture")) return <Home size={size} className={className} />;

  if (cat.includes("spa") || cat.includes("massage") || cat.includes("wellnes")) return <Flower2 size={size} className={className} />;
  if (cat.includes("beauty") || cat.includes("skin")) return <Sparkles size={size} className={className} />;

  if (cat.includes("it") || cat.includes("soft") || cat.includes("code")) return <Terminal size={size} className={className} />;
  if (cat.includes("repair") || cat.includes("clean") || cat.includes("fix")) return <Wrench size={size} className={className} />;

  if (cat.includes("shop") || cat.includes("store")) return <Store size={size} className={className} />;
  if (cat.includes("event") || cat.includes("calendar")) return <Calendar size={size} className={className} />;

  return <Fallback size={size} className={className} />;
};
