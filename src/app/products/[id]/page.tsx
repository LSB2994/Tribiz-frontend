"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Product } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  ShoppingCart, 
  ArrowLeft, 
  Loader2, 
  Plus, 
  Minus, 
  Store, 
  ShieldCheck, 
  Truck, 
  RotateCcw,
  Star,
  Tag
} from "lucide-react";
import Link from "next/link";
import { useCart } from "@/context/cart-context";
import { useAuth } from "@/context/auth-context";
import { Card, CardContent } from "@/components/ui/card";
import { BrandIcon } from "@/components/brand-icon";
import { Edit } from "lucide-react";



export default function ProductDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const router = useRouter();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const data = await api.products.getById(Number(id));
        setProduct(data);
      } catch (error) {
        console.error("Error fetching product details:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchProduct();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-20 space-y-4">
        <h2 className="text-2xl font-bold">Product not found</h2>
        <Button variant="outline" asChild>
          <Link href="/products">Back to Products</Link>
        </Button>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
    // Optional: show some success toast or redirect to cart
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20">
      <Button variant="ghost" className="gap-2 -ml-2 text-muted-foreground hover:text-foreground" asChild>
        <Link href="/products">
          <ArrowLeft className="h-4 w-4" /> Back to Products
        </Link>
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
        <div className="space-y-6">
          <div className="aspect-square rounded-3xl bg-muted flex items-center justify-center relative overflow-hidden border-2 shadow-inner group">
            {product.image ? (
              <img src={product.image} alt={product.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 hover:scale-105" />
            ) : (
              <BrandIcon category={product.category} size={160} className="text-primary/10" />
            )}
            {product.discount > 0 && (
              <Badge className="absolute top-8 left-8 bg-destructive text-lg px-4 py-1.5 shadow-xl z-10">
                {product.discount}% OFF
              </Badge>
            )}
          </div>
        </div>


        <div className="space-y-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="font-bold border-primary text-primary px-3 flex items-center gap-2">
                <BrandIcon category={product.category} size={14} />
                {product.category || "General"}
              </Badge>
              <div className="flex items-center gap-1 text-orange-500 font-extrabold ml-auto">
                <Star className="h-4 w-4 fill-orange-500" /> 4.9 (128 reviews)
              </div>
            </div>
            
            <div className="flex justify-between items-start gap-4">
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">{product.name}</h1>
              {user && product.shop?.owner?.id === user.id && (
                <Button variant="outline" size="sm" className="gap-2 border-2 font-bold" asChild>
                  <Link href={`/dashboard/seller/products/${product.id}`}>
                    <Edit className="h-4 w-4" /> Edit Product
                  </Link>
                </Button>
              )}
            </div>
            <div className="flex items-baseline gap-4">

              <span className="text-4xl font-extrabold text-primary">${product.price.toFixed(2)}</span>
              {product.discount > 0 && (
                <span className="text-xl text-muted-foreground line-through decoration-destructive decoration-2">
                  ${(product.price * (1 + product.discount/100)).toFixed(2)}
                </span>
              )}
            </div>
            <p className="text-xl text-muted-foreground leading-relaxed italic">
              {product.description}
            </p>
          </div>

          <Separator />

          <div className="space-y-6">
            <div className="flex items-center gap-6">
              <div className="space-y-2 flex-1">
                <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Quantity</p>
                <div className="flex items-center border-2 rounded-2xl w-fit p-1 bg-muted/50">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-10 w-10 hover:bg-background rounded-xl"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-14 text-center text-xl font-bold">{quantity}</span>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-10 w-10 hover:bg-background rounded-xl"
                    onClick={() => setQuantity(Math.min(product.quantity, quantity + 1))}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Availability</p>
                <p className={`font-bold text-lg ${product.quantity > 0 ? 'text-green-600' : 'text-destructive'}`}>
                  {product.quantity > 0 ? `${product.quantity} units in stock` : 'Out of Stock'}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button 
                size="lg" 
                className="flex-1 h-14 text-lg font-bold gap-3 shadow-xl shadow-primary/20" 
                onClick={handleAddToCart}
                disabled={product.quantity === 0}
              >
                <ShoppingCart className="h-6 w-6" /> Add to Cart
              </Button>
              <Button size="lg" variant="outline" className="flex-1 h-14 text-lg font-bold">
                Buy It Now
              </Button>
            </div>
          </div>

          <Card className="bg-muted/30 border-none rounded-2xl">
            <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center gap-3">
                <Truck className="h-5 w-5 text-primary" />
                <div className="text-xs">
                  <p className="font-bold">Fast & Free Shipping</p>
                  <p className="text-muted-foreground">Orders over $50</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <RotateCcw className="h-5 w-5 text-primary" />
                <div className="text-xs">
                  <p className="font-bold">30-Day Returns</p>
                  <p className="text-muted-foreground">Hassle-free guarantee</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-5 w-5 text-primary" />
                <div className="text-xs">
                  <p className="font-bold">Authentic Product</p>
                  <p className="text-muted-foreground">100% genuine items</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Store className="h-5 w-5 text-primary" />
                <div className="text-xs">
                  <p className="font-bold">Local Pickup</p>
                  <p className="text-muted-foreground">Available in City Center</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
