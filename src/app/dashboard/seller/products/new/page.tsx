"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Product } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft, Loader2, Save, Tag, DollarSign, Package, Image as ImageIcon } from "lucide-react";
import Link from "next/link";

export default function NewProductPage() {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [product, setProduct] = useState<Partial<Product>>({
    name: "",
    description: "",
    price: 0,
    stock: 0,
    category: "",
    image: "",
    status: "AVAILABLE",
    discount: 0,
    buyOneGetOne: false
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await api.products.create(product);
      router.push("/dashboard/seller/products");
    } catch (error) {
      console.error("Error creating product:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div className="flex items-center justify-between">
        <Button variant="ghost" className="gap-2" asChild>
          <Link href="/dashboard/seller/products">
            <ArrowLeft className="h-4 w-4" /> Back to Inventory
          </Link>
        </Button>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight italic text-primary">Add New Product</h1>
          <p className="text-muted-foreground mt-1 font-medium italic">List a new item in your store catalog.</p>
        </div>
        <Button 
          className="gap-2 font-bold shadow-lg shadow-primary/20" 
          onClick={handleSave}
          disabled={isSaving}
        >
          {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Create Product
        </Button>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card className="border-2 shadow-sm">
            <CardHeader className="border-b bg-muted/30">
              <CardTitle className="italic">Product Information</CardTitle>
              <CardDescription>Enter the basic details for your new listing.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="font-bold">Product Name</Label>
                <div className="relative">
                  <Tag className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="name" 
                    placeholder="e.g. Organic Local Honey"
                    value={product.name} 
                    onChange={(e) => setProduct({...product, name: e.target.value})}
                    className="pl-10 font-bold"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="font-bold">Description</Label>
                <Textarea 
                  id="description" 
                  rows={6}
                  placeholder="Tell customers about your product..."
                  value={product.description} 
                  onChange={(e) => setProduct({...product, description: e.target.value})}
                  className="font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="price" className="font-bold">Price ($)</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="price" 
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={product.price} 
                      onChange={(e) => setProduct({...product, price: parseFloat(e.target.value)})}
                      className="pl-10 font-bold text-primary"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category" className="font-bold">Category</Label>
                  <Input 
                    id="category" 
                    placeholder="e.g. Food & Drink"
                    value={product.category} 
                    onChange={(e) => setProduct({...product, category: e.target.value})}
                    className="font-medium"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-primary/10 shadow-sm bg-primary/5">
            <CardHeader className="border-b border-primary/10">
              <CardTitle className="italic flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" /> Inventory Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="stock" className="font-bold">Initial Stock Level</Label>
                  <Input 
                    id="stock" 
                    type="number"
                    placeholder="0"
                    value={product.stock} 
                    onChange={(e) => setProduct({...product, stock: parseInt(e.target.value)})}
                    className="font-bold"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status" className="font-bold">Availability</Label>
                  <Input 
                    id="status" 
                    value={product.status} 
                    onChange={(e) => setProduct({...product, status: e.target.value})}
                    className="font-medium"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          <Card className="border-2 overflow-hidden shadow-sm">
            <CardHeader className="border-b bg-muted/30">
              <CardTitle className="italic">Product Media</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="aspect-square rounded-2xl bg-muted flex items-center justify-center relative overflow-hidden border-2 shadow-inner group">
                {product.image ? (
                  <img src={product.image} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
                ) : (
                  <div className="text-center p-4">
                    <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-xs text-muted-foreground font-medium">Image Preview</p>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="image" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Image URL (Unsplash recommended)</Label>
                <Input 
                  id="image" 
                  placeholder="https://images.unsplash.com/..."
                  value={product.image} 
                  onChange={(e) => setProduct({...product, image: e.target.value})}
                  className="text-xs font-medium"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
}
