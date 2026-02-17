"use client";

import { useAuth } from "@/context/auth-context";
import { DataTable } from "@/components/dashboard/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ShoppingBag, 
  User, 
  Clock, 
  CheckCircle2, 
  Package, 
  Truck,
  ArrowRight,
  Filter,
  FileText
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SellerOrdersPage() {
  const { user } = useAuth();

  const orders = [
    { id: "ORD-1234", customer: "John Doe", date: "2024-02-12", total: 120.50, status: "Pending", items: 3 },
    { id: "ORD-1235", customer: "Sarah Smith", date: "2024-02-12", total: 45.00, status: "Processing", items: 1 },
    { id: "ORD-1236", customer: "Mike Johnson", date: "2024-02-11", total: 32.10, status: "Shipped", items: 2 },
    { id: "ORD-1237", customer: "Emma Wilson", date: "2024-02-11", total: 240.00, status: "Delivered", items: 5 },
  ];

  const columns = [
    { 
      header: "Order ID", 
      accessorKey: "id" as keyof typeof orders[0],
      cell: (order: any) => <span className="font-black text-primary">{order.id}</span>
    },
    { 
      header: "Customer", 
      accessorKey: "customer" as keyof typeof orders[0],
      cell: (order: any) => (
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-muted-foreground" />
          <span className="font-bold">{order.customer}</span>
        </div>
      )
    },
    { 
      header: "Items", 
      accessorKey: "items" as keyof typeof orders[0],
      cell: (order: any) => <Badge variant="secondary" className="font-bold">{order.items} Items</Badge>
    },
    { 
      header: "Total", 
      accessorKey: "total" as keyof typeof orders[0],
      cell: (order: any) => <span className="font-black">${order.total.toFixed(2)}</span>
    },
    { 
      header: "Status", 
      accessorKey: "status" as keyof typeof orders[0],
      cell: (order: any) => (
        <Badge variant={
          order.status === "Delivered" ? "default" : 
          order.status === "Pending" ? "destructive" : "secondary"
        } className="font-bold">
          {order.status}
        </Badge>
      )
    },
  ];

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight italic">Customer Orders</h1>
          <p className="text-muted-foreground mt-1 font-medium italic">Track fulfillment status and manage shipmets.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2 font-bold" size="lg">
            <Filter className="h-5 w-5" /> Filter
          </Button>
          <Button className="gap-2 font-bold shadow-lg shadow-primary/20" size="lg">
            <FileText className="h-5 w-5" /> Export Manifest
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-destructive">1</div>
          </CardContent>
        </Card>
        <Card className="border-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Processing</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-primary">1</div>
          </CardContent>
        </Card>
        <Card className="border-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Shipped</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-blue-500">1</div>
          </CardContent>
        </Card>
        <Card className="border-2 border-green-500/20 bg-green-500/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-widest text-green-600">Delivered</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-green-500">24</div>
          </CardContent>
        </Card>
      </div>

      <DataTable 
        data={orders} 
        columns={columns} 
        actions={(order) => (
          <div className="flex justify-end gap-2">
            {order.status === "Pending" && (
              <Button size="sm" className="h-8 font-bold gap-1.5 px-4 shadow-sm">
                <Package className="h-3.5 w-3.5" /> Pack Order
              </Button>
            )}
            {order.status === "Processing" && (
              <Button size="sm" variant="outline" className="h-8 font-bold gap-1.5 px-4 border-2">
                <Truck className="h-3.5 w-3.5" /> Ship Now
              </Button>
            )}
            <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full">
              <ArrowRight className="h-5 w-5" />
            </Button>
          </div>
        )}
      />
    </div>
  );
}
