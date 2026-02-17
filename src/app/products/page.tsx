"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { api } from "@/lib/api";
import { Product } from "@/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Tag, Search, Filter, Star, ShoppingBag, TrendingUp, Ticket, Flame, ChevronLeft, ChevronRight } from "lucide-react";
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

import { useSearchParams, useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

function ProductsPageContent() {
  const [products, setProducts] = useState<Product[]>([]);
  const [popularProducts, setPopularProducts] = useState<Product[]>([]);
  const [promotionProducts, setPromotionProducts] = useState<Product[]>([]);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [allCategories, setAllCategories] = useState<string[]>([]);
  
  const searchParams = useSearchParams();
  const router = useRouter();
  const categoryFilter = searchParams.get("category") || "all";
  const filterType = searchParams.get("filter") || "all";

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        let productsData;
        
        if (filterType === "popular") {
          productsData = await api.products.getPopular();
        } else if (filterType === "promotions") {
          productsData = await api.products.getPromotions();
        } else {
          productsData = categoryFilter === "all" ? api.products.getAll() : api.products.getByCategory(categoryFilter);
        }
        
        const [all, popular, promotions] = await Promise.all([
          productsData,
          api.products.getPopular(),
          api.products.getPromotions()
        ]);
        
        setProducts(all);
        setPopularProducts(popular);
        setPromotionProducts(promotions);

        // Extract categories if needed (though typically this should be a separate stable call)
        if (categoryFilter === "all" && filterType === "all") {
           const categories = Array.from(new Set(all.map(p => p.category).filter(Boolean))) as string[];
           setAllCategories(categories);
        }

      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [categoryFilter, filterType]);

  const setCategoryFilter = (val: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (val === "all") {
      params.delete("category");
    } else {
      params.set("category", val);
    }
    router.push(`/products?${params.toString()}`);
  };

  const filteredProducts = products.filter(product => {
    return product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
           product.description.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const SectionHeader = ({ title, icon: Icon }: { title: string, icon: any }) => (
     <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-primary text-primary-foreground rounded-none">
           <Icon className="h-5 w-5" />
        </div>
        <h2 className="text-2xl font-black uppercase tracking-tighter">{title}</h2>
     </div>
  );

  const HorizontalProductList = ({ items }: { items: Product[] }) => {
    const scrollRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: "left" | "right") => {
      if (!scrollRef.current) return;
      const amount = 360;
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
            {items.map((product) => (
              <Link key={product.id} href={`/products/${product.id}`} className="group block w-[280px]">
                <Card className="rounded-none border-none shadow-none bg-transparent">
                  <div className="aspect-[3/4] bg-muted relative overflow-hidden mb-3 border border-transparent group-hover:border-black transition-all">
                    {product.discount > 0 && (
                      <div className="absolute top-2 left-2 z-10">
                        <Badge className="bg-primary text-white rounded-none font-black text-[9px] tracking-widest px-2 py-1">-{product.discount}%</Badge>
                      </div>
                    )}
                    {product.image ? (
                      <img src={product.image} alt={product.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    ) : (
                      <div className="absolute inset-0 bg-accent/20 flex items-center justify-center">
                        <ShoppingBag className="text-black/10 h-10 w-10" />
                      </div>
                    )}
                    {product.rating && product.rating > 0 && (
                      <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-white/90 px-2 py-1 text-[10px] font-bold uppercase tracking-widest">
                        <Star className="h-3 w-3 fill-orange-500 text-orange-500" /> {product.rating}
                      </div>
                    )}
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-black uppercase tracking-tight truncate group-hover:text-primary transition-colors flex-1">{product.name}</h3>
                      <span className="text-lg font-black">${product.price.toFixed(2)}</span>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-1">{product.shopName}</p>
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
    if (filterType === "popular") return "Popular Products";
    if (filterType === "promotions") return "Promotion Products";
    return "Our Products";
  };

  return (
    <div className="space-y-12 pb-20 fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b-2 border-black/5 pb-8">
        <div className="space-y-4 max-w-2xl">
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-[0.9]">{getPageTitle().split(' ').map((word, i) => 
            i === 0 ? word : <span key={i} className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-black"> {word}</span>
          )}</h1>
          <p className="text-muted-foreground font-medium uppercase text-xs tracking-[0.3em] leading-relaxed">
             {filterType === "popular" ? "Top-rated products trending in our community" :
              filterType === "promotions" ? "Limited-time offers and special deals" :
              "Browse best products from our local shops. Quality and value effectively curated for you."}
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row w-full md:w-auto gap-4">
           <div className="relative w-full sm:w-[300px]">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
             <Input 
               placeholder="SEARCH PRODUCTS..." 
               className="pl-12 h-14 rounded-none border-black/10 focus-visible:border-black transition-all font-bold text-[10px] tracking-widest uppercase shadow-none bg-muted/20"
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
             />
           </div>
           <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full sm:w-56 h-14 rounded-none border-black/10 focus:ring-0 font-bold text-[10px] tracking-widest uppercase shadow-none bg-muted/20">
               <div className="flex items-center gap-3">
                 <Filter className="h-4 w-4" />
                 <SelectValue placeholder="CATEGORY" />
               </div>
            </SelectTrigger>
            <SelectContent className="rounded-none border-black">
               <SelectItem value="all" className="text-[10px] font-bold uppercase tracking-widest">All Categories</SelectItem>
               {allCategories.map(cat => (
                 <SelectItem key={cat} value={cat.toLowerCase()} className="text-[10px] font-bold uppercase tracking-widest">{cat}</SelectItem>
               ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
          <div className="space-y-8">
            <Skeleton className="h-64 w-full rounded-none" />
            <div className="grid grid-cols-4 gap-8">
               <Skeleton className="h-64 w-full rounded-none" />
               <Skeleton className="h-64 w-full rounded-none" />
               <Skeleton className="h-64 w-full rounded-none" />
               <Skeleton className="h-64 w-full rounded-none" />
            </div>
         </div>
      ) : (
         <>
            {/* Promotions Section */}
            {promotionProducts.length > 0 && (
               <div className="space-y-4">
                  <SectionHeader title="Active Promotions" icon={Ticket} />
                  <HorizontalProductList items={promotionProducts} />
               </div>
            )}

            {/* Popular Section */}
            {popularProducts.length > 0 && (
               <div className="space-y-4">
                   <SectionHeader title="Popular & Trending" icon={Flame} />
                   <HorizontalProductList items={popularProducts} />
               </div>
            )}

            {/* All Products Grid */}
            <div className="space-y-8 pt-8 border-t-2 border-black/5">
               <div className="flex items-center justify-between">
                   <h2 className="text-2xl font-black uppercase tracking-tighter">All Products ({filteredProducts.length})</h2>
                </div>
                
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
               {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => {
                     let CategoryIcon = ShoppingBag;
                     
                     return (
                     <Card key={product.id} className="rounded-none border-none shadow-none group transition-all duration-500 bg-transparent flex flex-col h-full">
                        <div className="aspect-[3/4] bg-muted relative overflow-hidden border border-transparent group-hover:border-black transition-all">
                           {product.discount > 0 && (
                           <Badge className="absolute top-4 left-4 bg-primary text-white z-10 rounded-none font-black text-[10px] tracking-widest px-3 py-1">-{product.discount}% OFF</Badge>
                           )}
                           {product.image ? (
                           <img src={product.image} alt={product.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                           ) : (
                           <div className="absolute inset-0 flex items-center justify-center bg-accent/20">
                              <CategoryIcon className="h-12 w-12 text-primary/20" />
                           </div>
                           )}
                           <div className="absolute inset-0 bg-black/5 group-hover:bg-black/20 transition-colors" />
                           <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-white shadow-xl">
                              <Button className="w-full h-12 rounded-none font-black uppercase tracking-widest text-[10px] bg-black text-white hover:bg-primary transition-all">Add to Cart</Button>
                           </div>
                        </div>

                        <div className="pt-6 space-y-3 flex-1 flex flex-col">
                           <div className="flex justify-between items-start">
                              <span className="text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground flex items-center gap-2">
                                 <BrandIcon category={product.category} size={10} />
                                 {product.category || "General"}
                              </span>
                              {product.rating && (
                                 <div className="flex items-center gap-1 text-orange-500">
                                    <Star className="h-3 w-3 fill-orange-500" />
                                    <span className="text-[10px] font-bold">{product.rating}</span>
                                 </div>
                              )}
                           </div>
                           <h3 className="text-xl font-black uppercase tracking-tight leading-none truncate group-hover:text-primary transition-colors">
                              <Link href={`/products/${product.id}`}>{product.name}</Link>
                           </h3>
                           <div className="flex items-center gap-3">
                              <span className="text-lg font-black">${product.price.toFixed(2)}</span>
                              {product.discount > 0 && (
                                 <span className="text-sm text-muted-foreground line-through decoration-primary/50">${(product.price * (1 + product.discount/100)).toFixed(2)}</span>
                              )}
                           </div>
                        </div>
                     </Card>
                     )
                  })
               ) : (
                  <div className="col-span-full py-32 text-center space-y-8 bg-muted/20 border border-dashed border-black/10">
                     <div className="relative inline-block">
                        <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full" />
                        <Search className="h-20 w-20 mx-auto text-muted-foreground/30 relative z-10" />
                     </div>
                     <div className="space-y-2">
                        <h3 className="text-3xl font-black uppercase tracking-tighter">No items found</h3>
                        <p className="text-muted-foreground font-medium uppercase text-[10px] tracking-[0.3em] max-w-xs mx-auto">We couldn't find any products in this selection at the moment.</p>
                     </div>
                     <Button variant="outline" className="rounded-none h-14 px-10 font-black uppercase tracking-widest text-[10px] border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all" onClick={() => setCategoryFilter("all")}>
                        Explore Full Collection
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

export default function ProductsPage() {
  return (
    <Suspense fallback={null}>
      <ProductsPageContent />
    </Suspense>
  );
}
