"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";
import { Shop, Product, ServiceItem, EventItem } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Store, MapPin, Phone, Mail, Globe, Clock, Star, ArrowLeft, ShoppingBag, Scissors, Loader2 } from "lucide-react";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { BrandIcon } from "@/components/brand-icon";
import { useAuth } from "@/context/auth-context";
import { Edit } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";



export default function ShopDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [shop, setShop] = useState<Shop | null>(null);

  const [products, setProducts] = useState<Product[]>([]);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Category Filtering for Products
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    async function fetchShopData() {
      try {
        const [shopData, productsData, servicesData, eventsData] = await Promise.all([
          api.shops.getById(Number(id)),
          api.products.getByShop(Number(id)),
          api.services.getByShop(Number(id)),
          api.events.getByShop(Number(id)),
        ]);
        setShop(shopData);
        setProducts(productsData);
        setServices(servicesData);
        setEvents(eventsData);
      } catch (error) {
        console.error("Error fetching shop details:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchShopData();
  }, [id]);

  // Derived Data
  const promotions = products.filter(p => p.discount > 0 || p.buyOneGetOne);
  const categories = Array.from(new Set(products.map(p => p.category).filter(Boolean)));
  
  const filteredProducts = selectedCategory === "all" 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto space-y-8 pb-20 pt-8">
         <Skeleton className="h-[40vh] w-full rounded-none" />
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-8">
               <Skeleton className="h-20 w-3/4 rounded-none" />
               <Skeleton className="h-40 w-full rounded-none" />
               <Skeleton className="h-[500px] w-full rounded-none" />
            </div>
            <div className="space-y-6">
               <Skeleton className="h-[300px] w-full rounded-none" />
            </div>
         </div>
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="text-center py-32 space-y-6">
        <h2 className="text-4xl font-black uppercase tracking-tighter">Shop not found</h2>
        <Button variant="outline" className="rounded-none font-bold uppercase tracking-widest border-black" asChild>
          <Link href="/shops">Back to Shops</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-20 fade-in">
      <Button variant="link" className="pl-0 gap-2 text-muted-foreground hover:text-foreground font-bold uppercase tracking-widest text-[10px]" asChild>
        <Link href="/shops">
          <ArrowLeft className="h-3 w-3" /> Back to Shops
        </Link>
      </Button>

      {/* Hero Section */}
      <div className="relative h-[40vh] bg-muted overflow-hidden group">
         {shop.image ? (
            <img src={shop.image} alt={shop.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
         ) : (
            <div className="absolute inset-0 bg-black/5 flex items-center justify-center">
               <BrandIcon category="Shop" size={120} className="text-black/10" />
            </div>
         )}
         <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
         
         <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full">
            <div className="flex flex-col md:flex-row justify-between items-end gap-6">
               <div className="space-y-4">
                  <Badge variant={shop.isOpen ? "default" : "secondary"} className="rounded-none font-black text-[10px] tracking-widest uppercase shadow-none border-0">
                     {shop.isOpen ? "Open Now" : "Closed"}
                  </Badge>
                  <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter leading-none">{shop.name}</h1>
                  <div className="flex items-center gap-2 text-white/80 font-bold text-xs uppercase tracking-widest">
                     <MapPin className="h-4 w-4" /> {shop.location}
                  </div>
               </div>
               
               {user && shop.owner?.id === user.id && (
                  <Button variant="outline" size="sm" className="gap-2 rounded-none border-white text-white hover:bg-white hover:text-black font-bold uppercase tracking-widest" asChild>
                    <Link href={`/dashboard/seller/shops/${shop.id}`}>
                      <Edit className="h-4 w-4" /> Edit Shop
                    </Link>
                  </Button>
                )}
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
          
          {/* About Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
               <div className="h-1 w-12 bg-primary" />
               <h3 className="text-lg font-black uppercase tracking-widest">About Us</h3>
            </div>
            <p className="text-xl text-muted-foreground leading-relaxed font-light">
              {shop.description || "Welcome to our local business! We take pride in serving our community with quality and care."}
            </p>
             <div className="flex items-center gap-2 font-bold text-sm">
                <Star className="h-4 w-4 fill-primary text-primary" />
                <span>4.9</span>
                <span className="text-muted-foreground font-normal">(450 reviews)</span>
             </div>
          </div>

          <Tabs defaultValue="products" className="w-full">
            <TabsList className="grid w-full grid-cols-4 h-16 rounded-none bg-muted/30 p-1 gap-1">
              <TabsTrigger value="products" className="rounded-none font-black uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-[10px] md:text-xs">Products ({products.length})</TabsTrigger>
              <TabsTrigger value="services" className="rounded-none font-black uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-[10px] md:text-xs">Services ({services.length})</TabsTrigger>
              <TabsTrigger value="events" className="rounded-none font-black uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-[10px] md:text-xs">Events ({events.length})</TabsTrigger>
              <TabsTrigger value="promotions" className="rounded-none font-black uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-[10px] md:text-xs">Promos ({promotions.length})</TabsTrigger>
            </TabsList>
            
            {/* PRODUCTS TAB */}
            <TabsContent value="products" className="mt-8 space-y-8">
               {/* Category Filter */}
               {categories.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                     <Button 
                        variant={selectedCategory === "all" ? "default" : "outline"}
                        onClick={() => setSelectedCategory("all")}
                        className="rounded-none h-8 text-[10px] font-bold uppercase tracking-widest"
                     >
                        All
                     </Button>
                     {categories.map(cat => (
                        <Button 
                           key={cat}
                           variant={selectedCategory === cat ? "default" : "outline"}
                           onClick={() => setSelectedCategory(cat)}
                           className="rounded-none h-8 text-[10px] font-bold uppercase tracking-widest"
                        >
                           {cat}
                        </Button>
                     ))}
                  </div>
               )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {filteredProducts.length > 0 ? filteredProducts.map((product) => (
                  <Card key={product.id} className="group hover:border-black transition-all border border-transparent bg-muted/20 hover:bg-transparent rounded-none overflow-hidden flex flex-col">
                    <div className="aspect-square bg-white relative overflow-hidden flex items-center justify-center border-b border-black/5">
                      {product.image ? (
                        <img src={product.image} alt={product.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      ) : (
                        <BrandIcon category={product.category} size={60} className="text-black/5" />
                      )}
                      {(product.discount > 0 || product.buyOneGetOne) && (
                         <Badge className="absolute top-2 right-2 rounded-none bg-destructive font-black uppercase tracking-widest text-[9px]">
                            {product.buyOneGetOne ? "BOGO" : `-${product.discount}%`}
                         </Badge>
                      )}
                    </div>
                    <CardHeader className="p-5">
                      <div className="flex justify-between items-start gap-2">
                         <CardTitle className="text-base font-bold uppercase tracking-tight line-clamp-1 group-hover:text-primary transition-colors">{product.name}</CardTitle>
                         <p className="text-lg font-black tracking-tight">${product.price.toFixed(2)}</p>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2 uppercase tracking-wide">{product.description}</p>
                    </CardHeader>
                    <CardFooter className="p-5 pt-0 mt-auto">
                      <Button className="w-full rounded-none font-black uppercase tracking-widest" asChild>
                        <Link href={`/products/${product.id}`}>View Details</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                )) : (
                  <div className="col-span-full py-20 text-center space-y-4 border border-dashed border-black/10 bg-muted/10">
                    <p className="text-muted-foreground font-medium uppercase text-[10px] tracking-[0.3em]">No products found in this category.</p>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* SERVICES TAB */}
            <TabsContent value="services" className="mt-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {services.length > 0 ? services.map((service) => (
                  <Card key={service.id} className="group hover:border-black transition-all border border-transparent bg-muted/20 hover:bg-transparent rounded-none overflow-hidden flex flex-col">
                    <div className="aspect-video bg-white relative overflow-hidden flex items-center justify-center border-b border-black/5">
                       {service.image ? (
                        <img src={service.image} alt={service.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      ) : (
                        <BrandIcon category="Wellness" size={50} className="text-black/5" />
                      )}
                    </div>
                    <CardHeader className="p-5">
                      <div className="flex justify-between items-start gap-2">
                         <CardTitle className="text-base font-bold uppercase tracking-tight line-clamp-1">{service.name}</CardTitle>
                         <div className="text-right">
                           <p className="text-lg font-black tracking-tight">${service.price.toFixed(2)}</p>
                           <p className="text-[10px] font-bold text-muted-foreground uppercase">{service.durationMinutes} min</p>
                         </div>
                      </div>
                    </CardHeader>
                    <CardFooter className="p-5 pt-0 mt-auto">
                      <Button className="w-full rounded-none font-black uppercase tracking-widest" asChild>
                        <Link href={`/services/${service.id}`}>Book Now</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                )) : (
                  <div className="col-span-full py-20 text-center space-y-4 border border-dashed border-black/10 bg-muted/10">
                    <p className="text-muted-foreground font-medium uppercase text-[10px] tracking-[0.3em]">No services offered yet.</p>
                  </div>
                )}
              </div>
            </TabsContent>

             {/* EVENTS TAB */}
            <TabsContent value="events" className="mt-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {events.length > 0 ? events.map((event) => (
                  <Card key={event.id} className="group hover:border-black transition-all border border-transparent bg-muted/20 hover:bg-transparent rounded-none overflow-hidden flex flex-col">
                    <div className="aspect-video bg-white relative overflow-hidden flex items-center justify-center border-b border-black/5">
                       <div className="absolute top-0 left-0 bg-black text-white p-3 z-10">
                          <div className="flex flex-col items-center leading-none">
                             <span className="text-xl font-black">{new Date(event.startDate).getDate()}</span>
                             <span className="text-[9px] font-bold uppercase tracking-widest">{new Date(event.startDate).toLocaleDateString(undefined, { month: 'short' }).toUpperCase()}</span>
                          </div>
                      </div>
                       {event.image ? (
                        <img src={event.image} alt={event.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      ) : (
                         <div className="flex flex-col items-center justify-center p-6 text-center">
                            <Clock className="h-10 w-10 text-black/20 mb-2" />
                         </div>
                      )}
                    </div>
                    <CardHeader className="p-5">
                      <CardTitle className="text-base font-bold uppercase tracking-tight line-clamp-1">{event.title}</CardTitle>
                      <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-1">
                         <Clock className="h-3 w-3" />
                         {new Date(event.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </CardHeader>
                    <CardFooter className="p-5 pt-0 mt-auto">
                      <Button className="w-full rounded-none font-black uppercase tracking-widest" asChild>
                        <Link href={`/events/${event.id}`}>View Details</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                )) : (
                  <div className="col-span-full py-20 text-center space-y-4 border border-dashed border-black/10 bg-muted/10">
                    <p className="text-muted-foreground font-medium uppercase text-[10px] tracking-[0.3em]">No upcoming events.</p>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* PROMOTIONS TAB */}
            <TabsContent value="promotions" className="mt-8">
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {promotions.length > 0 ? promotions.map((product) => (
                  <Card key={product.id} className="group border-2 border-dashed border-primary/20 bg-primary/5 rounded-none overflow-hidden flex flex-col">
                    <div className="p-6 pb-2">
                       <div className="flex justify-between items-start">
                          <div>
                             <Badge className="rounded-none bg-primary font-black uppercase tracking-widest mb-2">
                                {product.buyOneGetOne ? "Buy 1 Get 1" : `Save ${product.discount}%`}
                             </Badge>
                             <CardTitle className="text-xl font-black uppercase tracking-tight">{product.name}</CardTitle>
                          </div>
                          <div className="text-right">
                              <span className="text-sm font-bold text-muted-foreground line-through decoration-destructive decoration-2">
                                 ${product.price.toFixed(2)}
                              </span>
                              <div className="text-2xl font-black text-primary">
                                 ${(product.price * (1 - product.discount / 100)).toFixed(2)}
                              </div>
                          </div>
                       </div>
                       <p className="text-sm text-muted-foreground mt-2 line-clamp-2 uppercase font-medium">{product.description}</p>
                    </div>
                    <CardFooter className="p-6 pt-4 mt-auto">
                      <Button className="w-full rounded-none font-black uppercase tracking-widest" asChild>
                        <Link href={`/products/${product.id}`}>Shop Offer</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                )) : (
                  <div className="col-span-full py-20 text-center space-y-4 border border-dashed border-black/10 bg-muted/10">
                    <p className="text-muted-foreground font-medium uppercase text-[10px] tracking-[0.3em]">No active promotions at this time.</p>
                  </div>
                )}
              </div>
            </TabsContent>

          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          <Card className="rounded-none border-none shadow-none bg-black text-white p-8">
            <h3 className="text-xl font-black uppercase tracking-widest mb-6">Contact</h3>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <MapPin className="h-5 w-5 shrink-0 mt-0.5" />
                <div className="space-y-1">
                   <p className="text-[10px] font-bold uppercase tracking-widest text-white/50">Address</p>
                   <p className="text-sm font-bold uppercase tracking-wide leading-relaxed">{shop.location}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Phone className="h-5 w-5 shrink-0" />
                <div className="space-y-1">
                   <p className="text-[10px] font-bold uppercase tracking-widest text-white/50">Phone</p>
                   <p className="text-sm font-bold uppercase tracking-wide">{shop.contactInfo}</p>
                </div>
              </div>
              <div className="h-px w-full bg-white/20 my-6" />
              
              <h3 className="text-xl font-black uppercase tracking-widest mb-4">Hours</h3>
              <div className="space-y-2 text-sm font-medium uppercase tracking-wide">
                <div className="flex justify-between">
                   <span className="text-white/70">Mon - Fri</span>
                   <span>09:00 - 18:00</span>
                </div>
                <div className="flex justify-between">
                   <span className="text-white/70">Sat</span>
                   <span>10:00 - 16:00</span>
                </div>
                <div className="flex justify-between">
                   <span className="text-white/70">Sun</span>
                   <span className="text-destructive font-bold">Closed</span>
                </div>
              </div>
            </div>
            
             <Button variant="outline" className="w-full mt-8 rounded-none border-white text-white hover:bg-white hover:text-black font-black uppercase tracking-widest">
                Get Directions
             </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
