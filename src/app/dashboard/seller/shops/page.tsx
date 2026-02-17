"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";

import { api } from "@/lib/api";
import { Shop } from "@/types";
import { DataTable } from "@/components/dashboard/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Store, MapPin, CheckCircle2, XCircle, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { ShopForm } from "@/components/dashboard/ShopForm";

export default function SellerShopsPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [shops, setShops] = useState<Shop[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingShop, setEditingShop] = useState<Shop | null>(null);

  const fetchShops = async () => {
    setIsLoading(true);
    try {
      const data = await api.shops.getAll();
      // For now, we show all shops. In a real app with proper multi-tenancy,
      // we'd use api.shops.getMyShop() or similar owner-filtered logic.
      setShops(data);
    } catch (error) {
      console.error("Error fetching shops:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchShops();
  }, []);

  const handleCreateOrUpdate = async (values: any) => {
    try {
      if (editingShop) {
        await api.shops.update(editingShop.id, values);
      } else {
        await api.shops.create(values);
      }
      await fetchShops();
    } catch (error) {
      console.error("Error saving shop:", error);
      throw error;
    }
  };

  const handleDelete = async (shop: Shop) => {
    if (confirm(`Are you sure you want to delete "${shop.name}"?`)) {
      try {
        await api.shops.delete(shop.id);
        await fetchShops();
      } catch (error) {
        console.error("Error deleting shop:", error);
        alert("Failed to delete shop.");
      }
    }
  };

  const openCreateForm = () => {
    setEditingShop(null);
    setIsFormOpen(true);
  };

  const openEditForm = (shop: Shop) => {
    setEditingShop(shop);
    setIsFormOpen(true);
  };

  const columns = [
    { 
      header: "Shop Name", 
      accessorKey: "name" as keyof Shop,
      cell: (shop: Shop) => (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold">
            <Store className="h-5 w-5" />
          </div>
          <span className="font-bold">{shop.name}</span>
        </div>
      )
    },
    { 
      header: "Location", 
      accessorKey: "location" as keyof Shop,
      cell: (shop: Shop) => (
        <div className="flex items-center gap-1.5 text-muted-foreground font-medium">
          <MapPin className="h-3.5 w-3.5" />
          {shop.location}
        </div>
      )
    },
    { 
      header: "Status", 
      accessorKey: "isOpen" as keyof Shop,
      cell: (shop: Shop) => (
        <Badge variant={shop.isOpen ? "default" : "secondary"} className="gap-1 font-bold">
          {shop.isOpen ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
          {shop.isOpen ? "Open" : "Closed"}
        </Badge>
      )
    },
    { 
      header: "Verification", 
      accessorKey: "status" as keyof Shop,
      cell: (shop: Shop) => (
        <Badge variant="outline" className={`font-bold border-2 ${
          shop.status === "APPROVED" ? "text-green-500 border-green-500/20" : 
          shop.status === "PENDING" ? "text-orange-500 border-orange-500/20" : 
          "text-destructive border-destructive/20"
        }`}>
          {shop.status}
        </Badge>
      )
    },
  ];

  return (
    <div className="space-y-8 pb-20">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="rounded-full" asChild>
          <Link href="/dashboard/seller">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-4xl font-bold tracking-tight italic">Manage Shops</h1>
          <p className="text-muted-foreground mt-1 font-medium italic">Create and manage your business outlets.</p>
        </div>
        <Button className="ml-auto gap-2 font-bold shadow-lg shadow-primary/20" size="lg" onClick={openCreateForm}>
          <Plus className="h-5 w-5" /> New Shop
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <DataTable 
          data={shops} 
          columns={columns} 
          onEdit={(shop) => router.push(`/dashboard/seller/shops/${shop.id}`)}
          onDelete={handleDelete}
        />

      )}

      <ShopForm 
        open={isFormOpen} 
        onOpenChange={setIsFormOpen} 
        onSubmit={handleCreateOrUpdate}
        initialData={editingShop}
      />
    </div>
  );
}

