"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Product } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft, Loader2, Save, Trash2, Tag, DollarSign, Package, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/auth-context";

export default function EditProductPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const data = await api.products.getById(Number(id));
        setProduct(data);
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchProduct();
  }, [id]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;
    
    setIsSaving(true);
    try {
      const payload = {
        name: product.name,
        description: product.description,
        price: product.price,
        quantity: product.quantity,
        image: product.image,
        status: product.status,
        barcode: product.barcode,
        category: product.category,
        discount: product.discount,
        buyOneGetOne: product.buyOneGetOne
      };
      await api.products.update(product.id, payload);
      router.push("/dashboard/seller/products");
    } catch (error) {
      console.error("Error saving product:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!product || !confirm("Are you sure you want to delete this product?")) return;
    
    try {
      await api.products.delete(product.id);
      router.push("/dashboard/seller/products");
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!product) {
    return <div className="text-center py-20">Product not found.</div>;
  }

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
          <h1 className="text-4xl font-bold tracking-tight italic">Edit Product</h1>
          <p className="text-muted-foreground mt-1 font-medium italic">Update your product details and inventory settings.</p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            className="text-destructive border-destructive/20 hover:bg-destructive/10 font-bold"
            onClick={handleDelete}
          >
            <Trash2 className="h-4 w-4 mr-2" /> Delete Product
          </Button>
          <Button 
            className="gap-2 font-bold shadow-lg shadow-primary/20" 
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save Changes
          </Button>
        </div>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="italic">Basic Information</CardTitle>
              <CardDescription>The core details of your product as seen by customers.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="font-bold">Product Name</Label>
                <div className="relative">
                  <Tag className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="name" 
                    value={product.name} 
                    onChange={(e) => setProduct({...product, name: e.target.value})}
                    className="pl-10 font-medium"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="font-bold">Description</Label>
                <Textarea 
                  id="description" 
                  rows={6}
                  value={product.description} 
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setProduct({...product, description: e.target.value})}
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
                      value={product.price} 
                      onChange={(e) => setProduct({...product, price: parseFloat(e.target.value)})}
                      className="pl-10 font-bold text-primary"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category" className="font-bold">Category</Label>
                  <Input 
                    id="category" 
                    value={product.category} 
                    onChange={(e) => setProduct({...product, category: e.target.value})}
                    className="font-medium"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="italic">Inventory & Stock</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="stock" className="font-bold">Available Stock</Label>
                  <div className="relative">
                    <Package className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="stock" 
                      type="number"
                      value={product.stock || 0} 
                      onChange={(e) => setProduct({...product, stock: parseInt(e.target.value)})}
                      className="pl-10 font-bold"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status" className="font-bold">Visibility Status</Label>
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
          <Card className="border-2 overflow-hidden">
            <CardHeader>
              <CardTitle className="italic">Media</CardTitle>
              <CardDescription>Product photo as shown in the store.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="aspect-square rounded-2xl bg-muted flex items-center justify-center relative overflow-hidden border-2 shadow-inner group">
                {product.image ? (
                  <img src={product.image} alt={product.name} className="absolute inset-0 w-full h-full object-cover" />
                ) : (
                  <ImageIcon className="h-12 w-12 text-muted-foreground" />
                )}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <Button variant="secondary" size="sm" className="font-bold">Change Image</Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="image" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Image URL</Label>
                <Input 
                  id="image" 
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
