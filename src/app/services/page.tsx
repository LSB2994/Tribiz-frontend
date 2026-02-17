"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { api } from "@/lib/api";
import { ServiceItem } from "@/types";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Scissors, Clock, Search, Star, Ticket, Flame, CalendarCheck, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { BrandIcon } from "@/components/brand-icon";
import { Skeleton } from "@/components/ui/skeleton";
import { useSearchParams } from "next/navigation";

function ServicesPageContent() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [popularServices, setPopularServices] = useState<ServiceItem[]>([]);
  const [promotionServices, setPromotionServices] = useState<ServiceItem[]>([]);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const searchParams = useSearchParams();
  const filterType = searchParams.get("filter") || "all";

  useEffect(() => {
    async function fetchServices() {
      setIsLoading(true);
      try {
        let servicesData;
        
        if (filterType === "popular") {
          servicesData = await api.services.getPopular();
        } else if (filterType === "promotions") {
          servicesData = await api.services.getPromotions();
        } else {
          servicesData = await api.services.getAll();
        }
        
        const [all, popular, promotions] = await Promise.all([
          servicesData,
          api.services.getPopular(),
          api.services.getPromotions()
        ]);
        
        setServices(all);
        setPopularServices(popular);
        setPromotionServices(promotions);
      } catch (error) {
        console.error("Error fetching services:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchServices();
  }, [filterType]);

  const filteredServices = services.filter(service =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const SectionHeader = ({ title, icon: Icon }: { title: string, icon: any }) => (
     <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-primary text-primary-foreground rounded-none">
           <Icon className="h-5 w-5" />
        </div>
        <h2 className="text-2xl font-black uppercase tracking-tighter">{title}</h2>
     </div>
  );

  const HorizontalServiceList = ({ items }: { items: ServiceItem[] }) => {
    const scrollRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: "left" | "right") => {
      if (!scrollRef.current) return;
      const amount = 420;
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
            {items.map((service) => (
              <Link key={service.id} href={`/services/${service.id}`} className="group block w-[320px]">
                <Card className="rounded-none border-none shadow-none bg-transparent">
                  <div className="aspect-video bg-muted relative overflow-hidden mb-3 border border-transparent group-hover:border-black transition-all">
                    {service.discount && service.discount > 0 ? (
                      <div className="absolute top-2 left-2 z-10">
                        <Badge className="bg-primary text-white rounded-none font-black text-[9px] tracking-widest px-2 py-1">-{service.discount}%</Badge>
                      </div>
                    ) : null}
                    {service.image ? (
                      <img src={service.image} alt={service.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    ) : (
                      <div className="absolute inset-0 bg-accent/20 flex items-center justify-center">
                        <Scissors className="text-black/10 h-10 w-10" />
                      </div>
                    )}
                    {service.rating && service.rating > 0 && (
                      <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-white/90 px-2 py-1 text-[10px] font-bold uppercase tracking-widest">
                        <Star className="h-3 w-3 fill-orange-500 text-orange-500" /> {service.rating}
                      </div>
                    )}
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-black uppercase tracking-tight truncate group-hover:text-primary transition-colors flex-1">{service.name}</h3>
                      <div className="text-right">
                        <span className="text-lg font-black block">${service.price.toFixed(2)}</span>
                        {service.discount && service.discount > 0 && (
                          <span className="text-xs text-muted-foreground line-through block decoration-primary/50">
                            ${(service.price * (1 + service.discount / 100)).toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground text-xs font-medium uppercase tracking-wider">
                      <Clock className="h-3 w-3" /> {service.durationMinutes} mins
                      <span className="text-black/20">|</span>
                      {service.shopName}
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

  const getPageTitle = () => {
    if (filterType === "popular") return "Popular Services";
    if (filterType === "promotions") return "Promotion Services";
    return "Local Services";
  };

  return (
    <div className="space-y-12 pb-20 fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b-2 border-black/5 pb-8">
        <div className="space-y-4 max-w-2xl">
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-[0.9]">{getPageTitle().split(' ').map((word, i) => 
            i === 0 ? word : <span key={i} className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-black"> {word}</span>
          )}</h1>
          <p className="text-muted-foreground font-medium uppercase text-xs tracking-[0.3em] leading-relaxed">
             {filterType === "popular" ? "Top-rated services trending in our community" :
              filterType === "promotions" ? "Limited-time service deals and special offers" :
              "Book best services from trusted local providers. From beauty to repairs, we have it all."}
          </p>
        </div>
        
        <div className="relative w-full sm:w-[350px]">
           <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
           <Input 
             placeholder="SEARCH SERVICES..." 
             className="pl-12 h-14 rounded-none border-black/10 focus-visible:border-black transition-all font-bold text-[10px] tracking-widest uppercase shadow-none bg-muted/20"
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
           />
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
            {promotionServices.length > 0 && (
               <div className="space-y-4">
                  <SectionHeader title="Active Deals" icon={Ticket} />
                  <HorizontalServiceList items={promotionServices} />
               </div>
            )}

            {/* Popular Section */}
            {popularServices.length > 0 && (
               <div className="space-y-4">
                   <SectionHeader title="Top Rated Services" icon={Flame} />
                   <HorizontalServiceList items={popularServices} />
               </div>
            )}

            {/* All Services Grid */}
            <div className="space-y-8 pt-8 border-t-2 border-black/5">
                <div className="flex items-center justify-between">
                   <h2 className="text-2xl font-black uppercase tracking-tighter">All Services ({filteredServices.length})</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredServices.length > 0 ? (
                    filteredServices.map((service) => (
                      <Card key={service.id} className="rounded-none border-none shadow-none group transition-all duration-500 bg-transparent flex flex-col h-full bg-white border border-black/5 hover:border-black/20 p-0">
                         <div className="flex flex-col md:flex-row h-full">
                            <div className="w-full md:w-1/3 aspect-video md:aspect-auto bg-muted relative overflow-hidden group-hover:opacity-90 transition-opacity">
                               {service.image ? (
                                  <img src={service.image} alt={service.name} className="absolute inset-0 w-full h-full object-cover" />
                               ) : (
                                  <div className="absolute inset-0 flex items-center justify-center bg-accent/20">
                                     <Scissors className="h-8 w-8 text-primary/20" />
                                  </div>
                               )}
                               {service.discount && service.discount > 0 && (
                                   <div className="absolute top-2 left-2">
                                     <Badge className="bg-primary text-white rounded-none font-black text-[8px] tracking-widest">-{service.discount}%</Badge>
                                   </div>
                               )}
                            </div>
                            
                            <div className="flex-1 p-6 flex flex-col">
                               <div className="flex justify-between items-start mb-2">
                                  <h3 className="text-xl font-black uppercase tracking-tight hover:text-primary transition-colors line-clamp-1">
                                    <Link href={`/services/${service.id}`}>{service.name}</Link>
                                  </h3>
                                  {service.rating && (
                                    <div className="flex items-center gap-1 text-orange-500 shrink-0 ml-2">
                                       <Star className="h-3 w-3 fill-orange-500" />
                                       <span className="text-[10px] font-bold">{service.rating}</span>
                                    </div>
                                  )}
                               </div>
                               
                               <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">
                                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {service.durationMinutes} min</span>
                                  <span className="w-1 h-1 bg-muted-foreground/30 rounded-full" />
                                  <span>{service.shopName}</span>
                               </div>
                               
                               <p className="text-sm text-muted-foreground line-clamp-2 mb-6 flex-1 italic leading-relaxed">
                                  {service.description}
                               </p>
                               
                               <div className="flex items-center justify-between pt-4 border-t border-black/5 mt-auto">
                                  <div className="flex flex-col">
                                     <span className="text-2xl font-black tracking-tight">${service.price.toFixed(2)}</span>
                                     {service.discount && service.discount > 0 && (
                                        <span className="text-xs text-muted-foreground line-through decoration-primary/50">
                                          ${(service.price * (1 + service.discount/100)).toFixed(2)}
                                        </span>
                                     )}
                                  </div>
                                  <Button className="rounded-none font-black uppercase tracking-widest text-[10px] h-10 px-6" asChild>
                                     <Link href={`/services/${service.id}`}>Book Now</Link>
                                  </Button>
                               </div>
                            </div>
                         </div>
                      </Card>
                    ))
                  ) : (
                    <div className="col-span-full py-32 text-center space-y-8 bg-muted/20 border border-dashed border-black/10">
                       <Search className="h-16 w-16 mx-auto text-muted-foreground/30" />
                       <div className="space-y-2">
                          <h3 className="text-2xl font-black uppercase tracking-tighter">No services found</h3>
                          <p className="text-muted-foreground font-medium uppercase text-[10px] tracking-[0.3em]">Try adjusting your search criteria.</p>
                       </div>
                       <Button variant="outline" className="rounded-none font-black uppercase tracking-widest text-[10px]" onClick={() => setSearchTerm("")}>
                         Clear Search
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

export default function ServicesPage() {
  return (
    <Suspense fallback={null}>
      <ServicesPageContent />
    </Suspense>
  );
}
