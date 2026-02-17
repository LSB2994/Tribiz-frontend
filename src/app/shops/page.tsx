"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { api } from "@/lib/api";
import { Shop } from "@/types";
import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Store, Search, Filter, Star, Flame, Ticket, ChevronLeft, ChevronRight } from "lucide-react";
import { BrandIcon } from "@/components/brand-icon";
import Link from "next/link";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useSearchParams } from "next/navigation";

function ShopsPageContent() {
  const [shops, setShops] = useState<Shop[]>([]);
  const [popularShops, setPopularShops] = useState<Shop[]>([]);
  const [promotionShops, setPromotionShops] = useState<Shop[]>([]);
  const [nearbyShops, setNearbyShops] = useState<Shop[]>([]);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  const searchParams = useSearchParams();
  const filterType = searchParams.get("filter") || "all";

  useEffect(() => {
    async function fetchShops() {
      try {
        let shopsData;
        
        if (filterType === "popular") {
          shopsData = await api.shops.getPopular();
        } else if (filterType === "promotions") {
          shopsData = await api.shops.getPromotions();
        } else {
          shopsData = await api.shops.getAll();
        }
        
        const [allShops, popular, promotions] = await Promise.all([
           shopsData,
           api.shops.getPopular(),
           api.shops.getPromotions()
        ]);
        
        setShops(allShops);
        setPopularShops(popular);
        setPromotionShops(promotions);

        // Geolocation for Nearby (always fetch nearby for potential use)
        if (navigator.geolocation) {
           navigator.geolocation.getCurrentPosition(async (position) => {
              try {
                 const nearby = await api.shops.getNearby(position.coords.latitude, position.coords.longitude);
                 setNearbyShops(nearby);
              } catch (e) {
                 console.error("Error fetching nearby shops", e);
              }
           }, (error) => {
              console.log("Geolocation not available or denied", error);
           });
        }

      } catch (error) {
        console.error("Error fetching shops:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchShops();
  }, [filterType]);

  const filteredShops = shops.filter(shop => {
    const matchesSearch = shop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         shop.location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const SectionHeader = ({ title, icon: Icon }: { title: string, icon: any }) => (
     <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-primary text-primary-foreground rounded-none">
           <Icon className="h-5 w-5" />
        </div>
        <h2 className="text-2xl font-black uppercase tracking-tighter">{title}</h2>
     </div>
  );

  const HorizontalShopList = ({ items }: { items: Shop[] }) => {
    const scrollRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: "left" | "right") => {
      if (!scrollRef.current) return;
      const amount = 400;
      scrollRef.current.scrollBy({ left: direction === "left" ? -amount : amount, behavior: "smooth" });
    };

    return (
      <div className="relative">
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => scroll("left")}
          className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 rounded-full bg-background/80 backdrop-blur border-black/10"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => scroll("right")}
          className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 rounded-full bg-background/80 backdrop-blur border-black/10"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>

        <div ref={scrollRef} className="w-full overflow-x-auto pb-4 scrollbar-hide group">
          <div className="flex w-max space-x-6 pb-2">
            {items.map((shop) => (
              <Link key={shop.id} href={`/shops/${shop.id}`} className="group block w-[300px]">
                <Card className="rounded-none border-none shadow-none bg-transparent">
                  <div className="aspect-[4/3] bg-muted relative overflow-hidden mb-3 border border-transparent group-hover:border-black transition-all">
                    {shop.image ? (
                      <img src={shop.image} alt={shop.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    ) : (
                      <div className="absolute inset-0 bg-accent/20 flex items-center justify-center">
                        <BrandIcon category="Shop" size={40} className="text-black/10" />
                      </div>
                    )}
                    <div className="absolute top-2 left-2">
                      <Badge variant={shop.isOpen ? "default" : "secondary"} className="rounded-none text-[9px] font-black uppercase tracking-widest shadow-sm">
                        {shop.isOpen ? "Open" : "Closed"}
                      </Badge>
                    </div>
                    {shop.rating && shop.rating > 0 && (
                      <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-white/90 px-2 py-1 text-[10px] font-bold uppercase tracking-widest">
                        <Star className="h-3 w-3 fill-orange-500 text-orange-500" /> {shop.rating}
                      </div>
                    )}
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-lg font-black uppercase tracking-tight truncate group-hover:text-primary transition-colors">{shop.name}</h3>
                    <div className="flex items-center gap-1 text-muted-foreground text-[10px] font-bold uppercase tracking-widest">
                      <MapPin className="h-3 w-3" /> {shop.location}
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-16 pb-20 fade-in">
      
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b-2 border-black/5 pb-8">
        <div className="space-y-4 max-w-2xl">
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-[0.9]">Stores <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-black">& Shops</span></h1>
          <p className="text-muted-foreground font-medium uppercase text-xs tracking-[0.3em] leading-relaxed">
             Explore local businesses in your area. Find the best deals, top-rated services, and hidden gems.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row w-full md:w-auto gap-2">
           <div className="relative w-full sm:w-[300px]">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
             <Input
               placeholder="SEARCH SHOPS..."
               className="pl-12 h-12 rounded-none border-black/10 focus-visible:border-black transition-all font-bold text-[10px] tracking-widest uppercase shadow-none bg-muted/20"
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
             />
           </div>
           <Button className="h-12 w-12 rounded-none p-0" variant="outline">
              <Filter className="h-4 w-4" />
           </Button>
        </div>
      </div>

      {isLoading ? (
         <div className="space-y-8">
            <Skeleton className="h-64 w-full rounded-none" />
            <div className="grid grid-cols-3 gap-8">
               <Skeleton className="h-64 w-full rounded-none" />
               <Skeleton className="h-64 w-full rounded-none" />
               <Skeleton className="h-64 w-full rounded-none" />
            </div>
         </div>
      ) : (
         <>
            {/* Promotions Section */}
            {promotionShops.length > 0 && (
               <div className="space-y-4">
                  <SectionHeader title="Active Promotions" icon={Ticket} />
                  <HorizontalShopList items={promotionShops} />
               </div>
            )}

            {/* Popular Section */}
            {popularShops.length > 0 && (
               <div className="space-y-4">
                   <SectionHeader title="Popular & Trending" icon={Flame} />
                   <HorizontalShopList items={popularShops} />
               </div>
            )}

             {/* Nearby Section */}
            {nearbyShops.length > 0 && (
               <div className="space-y-4">
                   <SectionHeader title="Nearby You" icon={MapPin} />
                   <HorizontalShopList items={nearbyShops} />
               </div>
            )}

            {/* All Shops Grid */}
            <div className="space-y-8 pt-8 border-t-2 border-black/5">
                <div className="flex items-center justify-between">
                   <h2 className="text-2xl font-black uppercase tracking-tighter">All Shops ({filteredShops.length})</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                  {filteredShops.length > 0 ? filteredShops.map((shop) => (
                      <Card key={shop.id} className="rounded-none border-none shadow-none group transition-all duration-500 bg-transparent flex flex-col h-full">
                        <div className="aspect-video bg-muted relative overflow-hidden border border-transparent group-hover:border-black transition-all">
                           <div className="absolute top-4 left-4 z-10">
                              <Badge variant={shop.isOpen ? "default" : "secondary"} className="rounded-none font-black text-[10px] tracking-widest shadow-lg px-3 py-1">
                                 {shop.isOpen ? "OPEN NOW" : "CLOSED"}
                              </Badge>
                           </div>
                           {shop.image ? (
                              <img src={shop.image} alt={shop.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                           ) : (
                              <div className="absolute inset-0 bg-accent/20 flex items-center justify-center">
                                 <BrandIcon category="Shop" size={60} className="text-black/10" />
                              </div>
                           )}
                           
                           {/* Brand Overlay */}
                           <div className="absolute bottom-0 right-0 p-4 bg-white/90 backdrop-blur-sm">
                              <BrandIcon category="Shop" size={24} />
                           </div>
                        </div>
                        
                        <div className="pt-6 space-y-4 flex-1 flex flex-col">
                           <div>
                              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                                 <MapPin className="h-3 w-3" />
                                 <span className="text-[10px] font-bold uppercase tracking-widest">{shop.location}</span>
                              </div>
                              <CardTitle className="text-2xl font-black uppercase tracking-tight hover:text-primary transition-colors line-clamp-1">
                                 <Link href={`/shops/${shop.id}`}>{shop.name}</Link>
                              </CardTitle>
                           </div>
                           
                           <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                              {shop.description || "Leading local shop providing high-quality products and excellent customer service."}
                           </p>
                           
                           <div className="mt-auto pt-4 border-t border-black/5 flex justify-between items-center">
                              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                                 {shop.contactInfo}
                              </span>
                              <Button variant="link" className="h-auto p-0 text-[10px] font-black uppercase tracking-widest text-primary hover:no-underline group-hover:translate-x-1 transition-transform" asChild>
                                 <Link href={`/shops/${shop.id}`}>Visit Details →</Link>
                              </Button>
                           </div>
                        </div>
                     </Card>
                   )) : (
                     <div className="col-span-full py-32 text-center space-y-8 bg-muted/20 border border-dashed border-black/10">
                       <div className="relative inline-block">
                          <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full" />
                          <Search className="h-20 w-20 mx-auto text-muted-foreground/30 relative z-10" />
                       </div>
                       <div className="space-y-2">
                          <h3 className="text-3xl font-black uppercase tracking-tighter">No shops found</h3>
                          <p className="text-muted-foreground font-medium uppercase text-[10px] tracking-[0.3em] max-w-xs mx-auto">We couldn't find any shops matching your criteria.</p>
                       </div>
                       <Button variant="outline" className="rounded-none h-14 px-10 font-black uppercase tracking-widest text-[10px] border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all" onClick={() => { setSearchTerm(""); setCategoryFilter("all"); }}>
                         Clear Filters
                       </Button>
                     </div>
                   )}
                </div>
            </div>
         </>
      )}
    </div>
  );
}

export default function ShopsPage() {
  return (
    <Suspense fallback={null}>
      <ShopsPageContent />
    </Suspense>
  );
}
