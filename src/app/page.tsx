"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/api";
import { Shop, Product, EventItem } from "@/types";
import { MapPin, ArrowRight, ShoppingBag, Store, Calendar, Star, TrendingUp, Users, Building, Award, Zap } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { BrandIcon } from "@/components/brand-icon";
import { DiscoveryBar } from "@/components/discovery-bar";

export default function Home() {
  const [shops, setShops] = useState<Shop[]>([]);
  const [nearbyShops, setNearbyShops] = useState<Shop[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [popularProducts, setPopularProducts] = useState<Product[]>([]);
  const [promotionProducts, setPromotionProducts] = useState<Product[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [location, setLocation] = useState<string | null>(null);
  const [userCoords, setUserCoords] = useState<{lat: number, lng: number} | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [shopsData, productsData, popularProductsData, promotionProductsData, eventsData] = await Promise.all([
          api.shops.getAll(),
          api.products.getAll(),
          api.products.getPopular(),
          api.products.getPromotions(),
          api.events.getAll(),
        ]);
        setShops(shopsData.slice(0, 4));
        setProducts(productsData.slice(0, 8));
        setPopularProducts(popularProductsData.slice(0, 8));
        setPromotionProducts(promotionProductsData.slice(0, 8));
        setEvents(eventsData);
      } catch (error) {
        console.error("Error fetching homepage data:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();

    // Get user location for nearby shops
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setUserCoords({ lat: latitude, lng: longitude });
          setLocation("Current City, Thailand"); // Mocked for now
          
          try {
            const nearby = await api.shops.getNearby(latitude, longitude);
            setNearbyShops(nearby.slice(0, 4));
          } catch (error) {
            console.error("Error fetching nearby shops:", error);
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
          setLocation("Bangkok, Thailand"); // Default location
        }
      );
    } else {
      setLocation("Bangkok, Thailand"); // Default location
    }
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Premium Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-background text-foreground dark:premium-gradient dark:text-white" style={{backgroundImage: "url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')", backgroundSize: 'cover', backgroundPosition: 'center'}}>
        {/* Overlay for readability */}
        <div className="absolute inset-0 bg-black/40 dark:bg-black/60" />
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden opacity-30 dark:opacity-30">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/40 blur-[120px] animate-float" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/20 blur-[120px] animate-float [animation-delay:2s]" />
        </div>

        <div className="container relative z-10 mx-auto px-4 py-20 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-sm font-bold tracking-widest uppercase text-primary-foreground/90">
                <TrendingUp className="h-4 w-4 text-primary" />
                <span>The Community Commerce Hub</span>
              </div>
              
              <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9]">
                DISCOVER <br />
                <span className="text-primary italic">TRIBIZ</span> <br />
                NEAR YOU
              </h1>

              <p className="text-xl md:text-2xl text-muted-foreground dark:text-white/70 max-w-xl mx-auto lg:mx-0 font-medium leading-relaxed">
                Connect with unique local shops, professional services, and vibrant community events. All in one premium marketplace.
              </p>

              <div className="flex flex-wrap gap-4 justify-center lg:justify-start pt-4">
                <Button size="lg" className="h-16 px-10 text-lg font-black uppercase tracking-widest rounded-none bg-foreground text-background hover:bg-foreground/90 dark:bg-white dark:text-black dark:hover:bg-white/90" asChild>
                  <Link href="/products">Shop Now</Link>
                </Button>
                <Button size="lg" variant="outline" className="h-16 px-10 text-lg font-black uppercase tracking-widest rounded-none border-border hover:bg-accent dark:border-white/20 dark:hover:bg-white/10" asChild>
                  <Link href="/shops">Explore Stores</Link>
                </Button>
              </div>

              {location && (
                <div className="flex items-center justify-center lg:justify-start gap-2 text-muted-foreground text-sm font-bold uppercase tracking-widest dark:text-white/50">
                  <MapPin className="h-4 w-4 text-primary" /> Personalized for {location}
                </div>
              )}
            </div>

            <div className="hidden lg:block relative">
              <div className="absolute -inset-4 bg-primary/20 blur-3xl rounded-full" />
              {isLoading ? (
                <Skeleton className="h-[500px] w-full glass-card rounded-none" />
              ) : events.length > 0 ? (
                <Carousel className="w-full">
                  <CarouselContent>
                    {events.map((event) => (
                      <CarouselItem key={event.id}>
                        <div className="glass-card p-10 h-[500px] flex flex-col justify-between border border-border/30 dark:border-white/10 group cursor-pointer transition-all hover:border-border">
                          <div>
                            <Badge className="bg-primary text-white font-black tracking-widest uppercase mb-6 rounded-none">Featured Event</Badge>
                            <h3 className="text-4xl font-black uppercase tracking-tighter leading-none mb-4 group-hover:text-primary transition-colors">{event.title}</h3>
                            <p className="text-lg text-muted-foreground dark:text-white/60 line-clamp-3 font-medium">{event.description}</p>
                          </div>
                          
                          <div className="space-y-6">
                            <div className="flex flex-col gap-3">
                              <div className="flex items-center gap-3 text-sm font-bold uppercase tracking-widest text-muted-foreground dark:text-white/80">
                                <Calendar className="h-5 w-5 text-primary" />
                                {new Date(event.startDate).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                              </div>
                              <div className="flex items-center gap-3 text-sm font-bold uppercase tracking-widest text-muted-foreground dark:text-white/80">
                                <MapPin className="h-5 w-5 text-primary" />
                                {event.location}
                              </div>
                            </div>
                            <Button variant="outline" className="w-full h-14 rounded-none border-border font-black uppercase tracking-widest hover:bg-primary hover:text-primary-foreground dark:border-white/20 dark:hover:text-white" asChild>
                              <Link href={`/events/${event.id}`}>Secure Your Spot</Link>
                            </Button>
                          </div>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <div className="absolute -bottom-12 right-12 flex gap-2">
                    <CarouselPrevious className="static translate-y-0 rounded-none bg-muted/20 border-border hover:bg-muted text-foreground dark:bg-white/5 dark:border-white/10 dark:hover:bg-white/20 dark:text-white" />
                    <CarouselNext className="static translate-y-0 rounded-none bg-muted/20 border-border hover:bg-muted text-foreground dark:bg-white/5 dark:border-white/10 dark:hover:bg-white/20 dark:text-white" />
                  </div>
                </Carousel>
              ) : (
                <div className="glass-card h-[500px] flex items-center justify-center p-12 text-center border-dashed border-border dark:border-white/10">
                  <div className="space-y-4">
                    <Calendar className="h-16 w-16 mx-auto opacity-20" />
                    <p className="text-xl font-black uppercase tracking-tighter opacity-50">No events scheduled today</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Discovery Bar [NEW] */}
      <Suspense fallback={null}>
        <DiscoveryBar />
      </Suspense>

      {/* Community Stats Section */}
      <section className="bg-background border-b border-border">
        <div className="container mx-auto px-4 lg:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12">
            {isLoading ? (
              Array(4).fill(0).map((_, i) => (
                <div key={i} className="flex flex-col items-center justify-center text-center space-y-2">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div>
                    <Skeleton className="h-8 w-16 mb-2" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
              ))
            ) : (
              [
                { label: "Partner Shops", value: "250+", icon: Building },
                { label: "Active Users", value: "10k+", icon: Users },
                { label: "Monthly Events", value: "40+", icon: Calendar },
                { label: "Cities Covered", value: "15+", icon: MapPin },
              ].map((stat, i) => (
                <div key={i} className="flex flex-col items-center justify-center text-center space-y-2 group animate-fade-in-up" style={{ animationDelay: `${i * 100}ms` }}>
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 group-hover:scale-110">
                    <stat.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="text-3xl font-black tracking-tighter">{stat.value}</div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{stat.label}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 lg:px-12 space-y-24 py-24">
        {/* Featured Categories Grid [NEW] */}
        <section className="space-y-12 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="text-center space-y-4">
             <Badge className="rounded-none font-black tracking-widest uppercase animate-scale-in" style={{ animationDelay: '0.4s' }}>Explore Categories</Badge>
             <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter animate-slide-in-right" style={{ animationDelay: '0.6s' }}>Browse Community Favorites</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { name: "Fashion", color: "bg-muted/30" },
              { name: "Electronics", color: "bg-muted/30" },
              { name: "Home Living", color: "bg-muted/30" },
              { name: "Beauty", color: "bg-muted/30" },
              { name: "Events", color: "bg-muted/30" },
              { name: "Services", color: "bg-muted/30" },
            ].map((cat) => (
              <div key={cat.name} className={`group ${cat.color} h-40 flex flex-col items-center justify-center gap-4 transition-all hover:scale-[1.02] border border-border hover:border-foreground/20 cursor-pointer`}>
                <div className="h-12 w-12 rounded-none bg-background border border-border group-hover:bg-foreground group-hover:text-background transition-colors duration-300 flex items-center justify-center">
                  <BrandIcon category={cat.name} size={24} />
                </div>
                <span className="text-xs font-black uppercase tracking-widest">{cat.name}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Popular Products */}
        <section className="space-y-8 animate-fade-in" style={{ animationDelay: '0.8s' }}>
          <div className="flex flex-col md:flex-row justify-between items-end gap-4">
            <div className="space-y-2">
              <h2 className="text-4xl font-black uppercase tracking-tighter">Most Popular Products</h2>
              <div className="h-1 w-20 bg-primary" />
              <p className="text-muted-foreground font-medium uppercase text-xs tracking-widest">Top-rated products from our community</p>
            </div>
            <Button variant="link" className="font-black uppercase tracking-widest text-xs p-0 group" asChild>
              <Link href="/products?filter=popular" className="flex items-center gap-2">View All Popular <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" /></Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {isLoading ? (
              Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-[400px] rounded-none" />)
            ) : popularProducts.map((product) => {
              const category = product.category?.toLowerCase() || "";
              let CategoryIcon = ShoppingBag;
              
              return (
              <Card key={product.id} className="rounded-none border border-border bg-card shadow-none group transition-all duration-300 hover:border-foreground/30">
                <div className="p-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground">{product.category || "General"}</span>
                    <div className="flex items-center gap-1 text-orange-400">
                      <Star className="h-3 w-3 fill-orange-400" />
                      <span className="text-[10px] font-bold">4.8</span>
                    </div>
                  </div>

                  <h3 className="text-lg font-black uppercase tracking-tight leading-tight line-clamp-2 group-hover:text-primary transition-colors min-h-[44px]">
                    {product.name}
                  </h3>

                  <div className="flex items-baseline gap-3">
                    <span className="text-xl font-black">${product.price.toFixed(2)}</span>
                    {product.discount > 0 && (
                      <span className="text-sm text-muted-foreground line-through">${(product.price * (1 + product.discount/100)).toFixed(2)}</span>
                    )}
                  </div>
                </div>

                <div className="relative aspect-[4/5] bg-muted overflow-hidden border-t border-border">
                  {product.discount > 0 && (
                    <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground z-10 rounded-none font-black">-{product.discount}% OFF</Badge>
                  )}
                  {product.image ? (
                    <img src={product.image} alt={product.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-accent/20">
                      <CategoryIcon className="h-12 w-12 text-primary/20" />
                    </div>
                  )}
                </div>
              </Card>
            )})}
          </div>
        </section>

        {/* Promotions Section */}
        <section className="space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-end gap-4">
            <div className="space-y-2">
              <h2 className="text-4xl font-black uppercase tracking-tighter">Hot Deals & Promotions</h2>
              <div className="h-1 w-20 bg-orange-500" />
              <p className="text-muted-foreground font-medium uppercase text-xs tracking-widest">Limited-time offers and special discounts</p>
            </div>
            <Button variant="link" className="font-black uppercase tracking-widest text-xs p-0 group" asChild>
              <Link href="/products?filter=promotions" className="flex items-center gap-2">View All Deals <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" /></Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {isLoading ? (
              Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-[400px] rounded-none" />)
            ) : promotionProducts.length > 0 ? promotionProducts.map((product) => {
              const category = product.category?.toLowerCase() || "";
              let CategoryIcon = ShoppingBag;
              
              return (
              <Card key={product.id} className="rounded-none border border-border bg-card shadow-none group transition-all duration-300 hover:border-foreground/30">
                <div className="p-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground">{product.category || "General"}</span>
                    <div className="flex items-center gap-1 text-orange-400">
                      <Star className="h-3 w-3 fill-orange-400" />
                      <span className="text-[10px] font-bold">4.8</span>
                    </div>
                  </div>

                  <h3 className="text-lg font-black uppercase tracking-tight leading-tight line-clamp-2 group-hover:text-orange-500 transition-colors min-h-[44px]">
                    {product.name}
                  </h3>

                  <div className="flex items-baseline gap-3">
                    <span className="text-xl font-black text-orange-500">${product.price.toFixed(2)}</span>
                    {product.discount > 0 && (
                      <span className="text-sm text-muted-foreground line-through">${(product.price * (1 + product.discount/100)).toFixed(2)}</span>
                    )}
                  </div>
                </div>

                <div className="relative aspect-[4/5] bg-muted overflow-hidden border-t border-border">
                  <Badge className="absolute top-4 left-4 bg-orange-500 text-white z-10 rounded-none font-black">-{product.discount}% OFF</Badge>
                  {product.image ? (
                    <img src={product.image} alt={product.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-accent/20">
                      <CategoryIcon className="h-12 w-12 text-primary/20" />
                    </div>
                  )}
                </div>
              </Card>
            )}) : (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground font-medium">No promotions available at the moment.</p>
              </div>
            )}
          </div>
        </section>

        {/* Testimonials Carousel */}
        <section className="space-y-8 bg-muted/30 py-16 animate-fade-in" style={{ animationDelay: '1.4s' }}>
          <div className="text-center space-y-4">
            <Badge className="rounded-none font-black tracking-widest uppercase animate-scale-in" style={{ animationDelay: '1.6s' }}>Community Voices</Badge>
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter animate-slide-in-right" style={{ animationDelay: '1.8s' }}>What Our Community Says</h2>
            <p className="text-muted-foreground font-medium uppercase text-xs tracking-widest max-w-2xl mx-auto">Real experiences from sellers, service providers, and customers who trust TriBiz</p>
          </div>
          
          <div className="max-w-6xl mx-auto px-4">
            <Carousel className="w-full">
              <CarouselContent>
                {isLoading ? (
                  Array(3).fill(0).map((_, i) => (
                    <CarouselItem key={i} className="md:basis-1/2 lg:basis-1/3">
                      <Card className="rounded-none border border-border bg-card shadow-none h-full">
                        <CardContent className="p-8 space-y-6">
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, j) => (
                              <Skeleton key={j} className="h-5 w-5" />
                            ))}
                          </div>
                          <Skeleton className="h-16 w-full" />
                          <div className="flex items-center gap-4">
                            <Skeleton className="w-12 h-12 rounded-full" />
                            <div className="space-y-2">
                              <Skeleton className="h-4 w-32" />
                              <Skeleton className="h-3 w-24" />
                              <Skeleton className="h-3 w-28" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </CarouselItem>
                  ))
                ) : (
                  [
                    {
                      name: "Sarah Chen",
                      role: "Fashion Boutique Owner",
                      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b1c3?w=150&h=150&fit=crop&crop=face",
                      content: "TriBiz transformed how I connect with customers. The platform's reach and community focus helped my boutique grow 300% in just 6 months.",
                      rating: 5,
                      location: "Bangkok, Thailand"
                    },
                    {
                      name: "Marcus Rodriguez",
                      role: "Professional Photographer",
                      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
                      content: "As a service provider, TriBiz gave me the tools to showcase my work professionally. The booking system is seamless and the community is incredibly supportive.",
                      rating: 5,
                      location: "Manila, Philippines"
                    },
                    {
                      name: "Priya Patel",
                      role: "Handmade Crafts Seller",
                      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
                      content: "The premium marketplace experience made all the difference. My crafts now reach customers who truly appreciate handmade quality. Absolutely love it!",
                      rating: 5,
                      location: "Mumbai, India"
                    },
                    {
                      name: "David Thompson",
                      role: "Tech Startup Founder",
                      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
                      content: "We needed a platform that matched our brand values. TriBiz delivered beyond expectations with their community-first approach and modern design.",
                      rating: 5,
                      location: "Singapore"
                    }
                  ].map((testimonial, i) => (
                    <CarouselItem key={i} className="md:basis-1/2 lg:basis-1/3">
                      <Card className="rounded-none border border-border bg-card shadow-none h-full group hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                        <CardContent className="p-8 space-y-6">
                          <div className="flex items-center gap-1">
                            {[...Array(testimonial.rating)].map((_, i) => (
                              <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400 group-hover:scale-110 transition-transform" style={{ animationDelay: `${i * 100}ms` }} />
                            ))}
                          </div>
                          
                          <blockquote className="text-muted-foreground italic leading-relaxed group-hover:text-foreground transition-colors">
                            "{testimonial.content}"
                          </blockquote>
                          
                          <div className="flex items-center gap-4">
                            <img 
                              src={testimonial.avatar} 
                              alt={testimonial.name}
                              className="w-12 h-12 rounded-full object-cover border-2 border-primary/20 group-hover:border-primary transition-all duration-300 group-hover:scale-105"
                            />
                            <div>
                              <div className="font-black uppercase tracking-widest text-sm group-hover:text-primary transition-colors">{testimonial.name}</div>
                              <div className="text-xs text-muted-foreground font-bold uppercase tracking-widest">{testimonial.role}</div>
                              <div className="text-xs text-primary font-bold uppercase tracking-widest flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {testimonial.location}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </CarouselItem>
                  ))
                )}
              </CarouselContent>
              <div className="flex justify-center gap-2 mt-8">
                <CarouselPrevious className="static translate-y-0 rounded-none bg-muted/20 border-border hover:bg-muted text-foreground dark:bg-white/5 dark:border-white/10 dark:hover:bg-white/20 dark:text-white" />
                <CarouselNext className="static translate-y-0 rounded-none bg-muted/20 border-border hover:bg-muted text-foreground dark:bg-white/5 dark:border-white/10 dark:hover:bg-white/20 dark:text-white" />
              </div>
            </Carousel>
          </div>
        </section>

        {/* Call to Action Section [NEW] */}
        <section className="premium-gradient py-20 px-8 text-white text-center space-y-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">Ready to join the community?</h2>
            <p className="text-white/70 text-lg font-medium">Whether you're looking to shop, sell, or offer professional services, TriBiz is the place for you.</p>
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <Button className="h-14 px-8 rounded-none bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest text-xs" asChild>
                <Link href="/register?role=SELLER">Become a Seller</Link>
              </Button>
              <Button variant="outline" className="h-14 px-8 rounded-none border-white/20 hover:bg-white/10 text-white font-black uppercase tracking-widest text-xs" asChild>
                <Link href="/register">Join as Member</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Nearby Stores */}
        <section className="space-y-8">
          <div className="flex justify-between items-end">
            <div className="space-y-2">
              <h2 className="text-4xl font-black uppercase tracking-tighter">Nearby Stores</h2>
              <div className="h-1 w-20 bg-primary" />
              <p className="text-muted-foreground font-medium uppercase text-xs tracking-widest">Shops closest to {location || "your location"}</p>
            </div>
            <Button variant="ghost" className="font-black uppercase tracking-widest text-xs group" asChild>
              <Link href="/shops?filter=nearby" className="flex items-center gap-2">Explore Nearby <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" /></Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {isLoading ? (
              Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-[350px] rounded-none" />)
            ) : nearbyShops.length > 0 ? nearbyShops.map((shop) => (
              <Card key={shop.id} className="rounded-none border border-muted group hover:border-foreground transition-all duration-300">
                <div className="h-44 bg-muted relative overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-500">
                  {shop.image ? (
                    <img src={shop.image} alt={shop.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-accent/20">
                      <Store className="h-10 w-10 text-primary/10" />
                    </div>
                  )}
                  <div className="absolute top-4 right-4">
                    <Badge className={`${shop.isOpen ? 'bg-green-500' : 'bg-red-500'} text-white font-black text-[10px] rounded-none border-none`}>
                      {shop.isOpen ? "ACTIVE" : "CLOSED"}
                    </Badge>
                  </div>
                </div>
                <div className="p-8 space-y-4">
                  <div className="h-12 w-12 rounded-none bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                    <BrandIcon category="Shop" size={24} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black uppercase tracking-tighter line-clamp-1">{shop.name}</h3>
                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-1">
                      <MapPin className="h-3 w-3 text-primary" /> {shop.location}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2 min-h-[40px] leading-relaxed italic">{shop.description || "A standard-bearer of quality in the community."}</p>
                  <Button variant="outline" className="w-full rounded-none h-12 border-muted hover:border-foreground hover:bg-transparent font-black uppercase tracking-widest text-[10px]" asChild>
                    <Link href={`/shops/${shop.id}`}>View Catalog</Link>
                  </Button>
                </div>
              </Card>
            )) : (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground font-medium">No nearby shops found. Enable location services to see shops near you.</p>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Modern Footer [NEW] */}
      <footer className="bg-foreground text-background pt-24 pb-12">
        <div className="container mx-auto px-4 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
            <div className="space-y-6">
              <Link href="/" className="flex items-center space-x-2 group">
                 <div className="flex flex-col gap-[2px]">
                   <div className="h-[3px] w-6 bg-white group-hover:w-8 transition-all"></div>
                   <div className="h-[3px] w-6 bg-white group-hover:translate-x-1 transition-all"></div>
                   <div className="h-[3px] w-6 bg-white group-hover:translate-x-2 transition-all"></div>
                 </div>
                 <span className="text-3xl font-black tracking-tighter uppercase">triBiz</span>
              </Link>
              <p className="text-background/60 text-sm font-medium leading-relaxed uppercase tracking-wider">
                Reinventing community commerce for the modern era. Premium quality, local connection.
              </p>
            </div>
            
            {[
              { title: "Marketplace", links: ["All Products", "Shops", "Events", "Services"] },
              { title: "Company", links: ["About TriBiz", "Join the Team", "Partner with Us", "Press"] },
              { title: "Support", links: ["Help Center", "Order Tracking", "Returns", "Contact"] },
            ].map((col) => (
              <div key={col.title} className="space-y-6">
                <h4 className="text-xs font-black uppercase tracking-[0.3em] text-primary">{col.title}</h4>
                <ul className="space-y-4">
                  {col.links.map((link) => (
                    <li key={link}>
                      <Link href="#" className="text-background/60 hover:text-background transition-colors text-sm font-bold uppercase tracking-widest">{link}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <div className="pt-12 border-t border-background/10 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-bold uppercase tracking-[0.3em] text-background/50">
            <div>© 2026 TRIBIZ COMMERCE ENGINE. ALL RIGHTS RESERVED.</div>
            <div className="flex gap-8">
              <Link href="#" className="hover:text-background">Privacy Policy</Link>
              <Link href="#" className="hover:text-background">Terms of Service</Link>
              <Link href="#" className="hover:text-background">Legal</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
