"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";

import { api } from "@/lib/api";
import { Product } from "@/types";
import { DataTable } from "@/components/dashboard/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Image as ImageIcon,
  AlertCircle,
  Plus,
  Tag,
  Loader2
} from "lucide-react";
import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SellerProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const data = await api.products.getAll();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const columns = [
    { 
      header: "Product", 
      accessorKey: "name" as keyof Product,
      cell: (p: Product) => (
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center text-muted-foreground overflow-hidden">
            {p.imageUrl ? (
              <img src={p.imageUrl} alt={p.name} className="h-full w-full object-cover" />
            ) : (
              <ImageIcon className="h-6 w-6" />
            )}
          </div>
          <div>
            <p className="font-extrabold">{p.name}</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">{p.category}</p>
          </div>
        </div>
      )
    },
    { 
      header: "Price", 
      accessorKey: "price" as keyof Product,
      cell: (p: Product) => (
        <span className="font-black text-primary">${p.price.toFixed(2)}</span>
      )
    },
    { 
      header: "Stock", 
      accessorKey: "stock" as keyof Product,
      cell: (p: Product) => (
        <div className="flex flex-col gap-1">
          <span className={`font-bold ${p.stock < 5 ? 'text-destructive' : ''}`}>{p.stock} units</span>
          <div className="h-1.5 w-24 bg-muted rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full ${p.stock < 5 ? 'bg-destructive' : 'bg-green-500'}`} 
              style={{ width: `${Math.min(100, (p.stock / 20) * 100)}%` }}
            ></div>
          </div>
        </div>
      )
    },
    { 
      header: "Promotions", 
      accessorKey: "id" as keyof Product,
      cell: (p: Product) => (
        <div className="flex gap-2">
          {p.stock < 10 && (
            <Badge variant="outline" className="text-[10px] text-orange-500 border-orange-500/20 font-bold bg-orange-500/5">
              Low Stock
            </Badge>
          )}
          <Button variant="ghost" size="sm" className="h-7 px-2 text-[10px] font-bold border rounded-lg">
            <Tag className="h-3 w-3 mr-1" /> Add Promo
          </Button>
        </div>
      )
    },
  ];

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight italic">Product Inventory</h1>
          <p className="text-muted-foreground mt-1 font-medium italic">Manage your catalog, prices, and stock levels.</p>
        </div>
        <Button className="gap-2 font-bold shadow-lg shadow-primary/20" size="lg" asChild>
          <Link href="/dashboard/seller/products/new">
            <Plus className="h-5 w-5" /> New Product
          </Link>
        </Button>

      </div>

      <div className="flex gap-4 overflow-x-auto pb-2">
        <Badge className="px-4 py-2 rounded-full cursor-pointer font-bold">All Products (24)</Badge>
        <Badge variant="outline" className="px-4 py-2 rounded-full cursor-pointer font-bold border-2">Clothing (12)</Badge>
        <Badge variant="outline" className="px-4 py-2 rounded-full cursor-pointer font-bold border-2">Accessories (8)</Badge>
        <Badge variant="outline" className="px-4 py-2 rounded-full cursor-pointer font-bold border-2">Tools (4)</Badge>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <DataTable 
          data={products} 
          columns={columns} 
          onEdit={(p) => router.push(`/dashboard/seller/products/${p.id}`)}
          onDelete={(p) => console.log("Delete product", p)}
        />

      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 bg-gradient-to-r from-primary/10 to-transparent border-2 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl font-bold italic">
              <AlertCircle className="h-5 w-5 text-primary" /> Bulk Stock Update
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm font-medium mb-4">Export your CSV file to update stock levels for all items at once.</p>
            <div className="flex gap-3">
              <Button variant="outline" className="font-bold">Download Template</Button>
              <Button className="font-bold">Upload CSV</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
