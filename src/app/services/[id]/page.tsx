"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { ServiceItem } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  MapPin, 
  Clock, 
  Store, 
  Share2, 
  Heart,
  Star,
  CheckCircle2,
  CalendarCheck
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function ServiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [service, setService] = useState<ServiceItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchService() {
      try {
        const id = Number(params.id);
        if (isNaN(id)) return;
        const data = await api.services.getById(id);
        setService(data);
      } catch (error) {
        console.error("Error fetching service:", error);
        toast.error("Failed to load service details");
      } finally {
        setIsLoading(false);
      }
    }
    fetchService();
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="space-y-8 animate-pulse">
        <Skeleton className="h-[400px] w-full rounded-none" />
        <div className="container max-w-4xl mx-auto px-4 -mt-20 relative z-10">
           <Skeleton className="h-64 w-full rounded-none" />
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="container py-20 text-center">
        <h1 className="text-3xl font-black uppercase mb-4">Service Not Found</h1>
        <Button onClick={() => router.back()} variant="outline">Go Back</Button>
      </div>
    );
  }

  const discountedPrice = service.discount && service.discount > 0 
    ? service.price * (1 - service.discount / 100) 
    : null;

  return (
    <div className="pb-20 fade-in">
      {/* Hero Section */}
      <div className="relative h-[50vh] min-h-[400px] bg-black group">
        {service.image ? (
          <img 
            src={service.image} 
            alt={service.name} 
            className="w-full h-full object-cover opacity-60 transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-neutral-900 flex items-center justify-center">
             <Store className="h-20 w-20 text-white/20" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
        
        <div className="absolute top-6 left-6 z-20">
           <Button variant="outline" size="icon" className="rounded-full bg-background/50 backdrop-blur-sm border-none hover:bg-background transition-all" onClick={() => router.back()}>
              <ArrowLeft className="h-5 w-5" />
           </Button>
        </div>
      </div>

      {/* Content Container */}
      <div className="container max-w-6xl mx-auto px-4 -mt-32 relative z-10">
        <div className="bg-background border border-black/10 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.1)] p-6 md:p-10 flex flex-col md:flex-row gap-12">
           
           {/* Left Column: Details */}
           <div className="flex-1 space-y-8">
              <div className="space-y-4">
                 <div className="flex items-center gap-3 text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">
                    <Link href={`/shops/${service.shopId}`} className="hover:text-primary transition-colors flex items-center gap-2">
                       <Store className="h-4 w-4" /> {service.shopName}
                    </Link>
                    <span>/</span>
                    <span className="flex items-center gap-1">
                       <Clock className="h-4 w-4" /> {service.durationMinutes} mins
                    </span>
                 </div>
                 
                 <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-[0.9] text-balance">{service.name}</h1>
                 
                 {service.rating && (
                    <div className="flex items-center gap-2 mt-2">
                       <div className="flex">
                          {[1,2,3,4,5].map(i => (
                             <Star key={i} className={`h-4 w-4 ${i <= Math.round(service.rating || 0) ? "fill-orange-500 text-orange-500" : "text-gray-300"}`} />
                          ))}
                       </div>
                       <span className="text-sm font-bold uppercase tracking-wide text-muted-foreground">({service.reviewCount} reviews)</span>
                    </div>
                 )}
              </div>

              <div className="h-px bg-border my-8" />

              <div className="space-y-4">
                 <h3 className="text-xl font-black uppercase tracking-tight flex items-center gap-2">
                    <span className="w-1 h-6 bg-primary block"/> About this Service
                 </h3>
                 <p className="text-muted-foreground leading-relaxed text-lg font-medium">
                    {service.description || "No description provided for this service."}
                 </p>
              </div>

              <div className="h-px bg-border my-8" />

              <div className="space-y-4">
                 <h3 className="text-xl font-black uppercase tracking-tight flex items-center gap-2">
                    <span className="w-1 h-6 bg-primary block"/> Service Features
                 </h3>
                 <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <li className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                       <CheckCircle2 className="h-5 w-5 text-primary shrink-0" /> 
                       <span className="text-sm font-semibold">Professional Equipment</span>
                    </li>
                    <li className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                       <CheckCircle2 className="h-5 w-5 text-primary shrink-0" /> 
                       <span className="text-sm font-semibold">Expert Staff</span>
                    </li>
                    <li className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                       <CheckCircle2 className="h-5 w-5 text-primary shrink-0" /> 
                       <span className="text-sm font-semibold">Satisfaction Guaranteed</span>
                    </li>
                    <li className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                       <CheckCircle2 className="h-5 w-5 text-primary shrink-0" /> 
                       <span className="text-sm font-semibold">Flexible Scheduling</span>
                    </li>
                 </ul>
              </div>
           </div>

           {/* Right Column: Booking Card */}
           <div className="w-full md:w-[380px] shrink-0">
              <div className="sticky top-24 border border-black/10 p-8 space-y-8 bg-white shadow-2xl relative overflow-hidden">
                 <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-black" />
                 
                 <div>
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">Total Price</p>
                    <div className="flex items-baseline gap-3 flex-wrap">
                       {discountedPrice ? (
                          <>
                             <span className="text-5xl font-black text-primary tracking-tight">${discountedPrice.toFixed(2)}</span>
                             <span className="text-xl text-muted-foreground line-through decoration-black/50 font-bold">${service.price.toFixed(2)}</span>
                          </>
                       ) : (
                          <span className="text-5xl font-black tracking-tight">${service.price.toFixed(2)}</span>
                       )}
                    </div>
                    {service.discount && service.discount > 0 && (
                       <Badge variant="destructive" className="mt-3 rounded-none font-black uppercase tracking-widest text-[10px] py-1">
                          Limited Offer: -{service.discount}% OFF
                       </Badge>
                    )}
                 </div>

                 <div className="space-y-4">
                    <Button className="w-full h-16 text-lg font-black uppercase tracking-widest rounded-none shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all bg-black text-white hover:bg-black/90">
                       Book Appointment
                    </Button>
                    <Button variant="outline" className="w-full h-14 font-black uppercase tracking-widest rounded-none border-2 border-black hover:bg-black hover:text-white transition-colors">
                       Contact Provider
                    </Button>
                 </div>
                 
                 <div className="pt-6 border-t border-black/5 text-center bg-muted/20 -mx-8 -mb-8 pb-6 mt-4">
                    <p className="text-xs text-muted-foreground flex items-center justify-center gap-2 font-bold uppercase tracking-wide">
                       <CalendarCheck className="h-4 w-4" /> Next available: Today, 2:00 PM
                    </p>
                 </div>
              </div>
           </div>

        </div>
      </div>
    </div>
  );
}
