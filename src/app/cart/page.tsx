"use client";

import { useCart } from "@/context/cart-context";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { BrandIcon } from "@/components/brand-icon";
import { api } from "@/lib/api";


export default function CartPage() {
  const { items, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleCheckout = async () => {
    if (!user) {
      router.push("/login?redirect=/cart");
      return;
    }

    setIsCheckingOut(true);
    try {
      // Mocking order placement
      const orderRequest = {
        items: items.map(item => ({
          productId: item.product.id,
          quantity: item.quantity
        })),
        shippingAddress: user.location || "123 Default St, City"
      };
      
      console.log("Placing order:", orderRequest);
      // Wait for 1.5s to simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      clearCart();
      router.push("/history?success=true");
    } catch (error) {
      console.error("Order failed:", error);
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
        <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center text-primary">
          <ShoppingBag className="h-12 w-12" />
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold">Your cart is empty</h2>
          <p className="text-muted-foreground">Looks like you haven&apos;t added anything to your cart yet.</p>
        </div>
        <Button size="lg" asChild>
          <Link href="/products">Start Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      <h1 className="text-4xl font-bold tracking-tight italic">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <Card key={item.product.id} className="overflow-hidden border-2 hover:border-primary/50 transition-colors">
              <CardContent className="p-6 flex items-center gap-6">
                <div className="h-24 w-24 bg-muted rounded-xl relative overflow-hidden flex items-center justify-center shrink-0 border shadow-inner">
                  {item.product.image ? (
                    <img src={item.product.image} alt={item.product.name} className="absolute inset-0 w-full h-full object-cover" />
                  ) : (
                    <BrandIcon category={item.product.category} size={32} className="text-primary/10" />
                  )}
                </div>
                <div className="flex-1 min-w-0 space-y-1">

                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-bold truncate pr-4">{item.product.name}</h3>
                    <p className="text-xl font-bold text-primary">${(item.product.price * item.quantity).toFixed(2)}</p>
                  </div>
                  <p className="text-sm text-muted-foreground italic">Unit price: ${item.product.price.toFixed(2)}</p>
                  
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center border rounded-lg bg-background">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 rounded-none border-r"
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-12 text-center text-sm font-bold">{item.quantity}</span>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 rounded-none border-l"
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-destructive hover:bg-destructive/10 gap-2"
                      onClick={() => removeFromCart(item.product.id)}
                    >
                      <Trash2 className="h-4 w-4" /> Remove
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          <Button variant="ghost" className="text-muted-foreground hover:text-foreground" onClick={clearCart}>
            Clear Cart
          </Button>
        </div>

        <div className="space-y-6">
          <Card className="border-2 shadow-xl sticky top-24">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span className="text-green-600 font-medium">FREE</span>
              </div>
              <Separator />
              <div className="flex justify-between text-xl font-extrabold">
                <span>Total</span>
                <span className="text-primary">${totalPrice.toFixed(2)}</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full h-14 text-lg font-bold gap-2" 
                size="lg" 
                onClick={handleCheckout}
                disabled={isCheckingOut}
              >
                {isCheckingOut ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" /> Processing...
                  </>
                ) : (
                  <>
                    Proceed to Checkout <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
          
          {!user && (
            <p className="text-center text-sm text-muted-foreground bg-muted p-4 rounded-xl">
              Please <Link href="/login?redirect=/cart" className="text-primary font-bold hover:underline">log in</Link> to complete your purchase.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
