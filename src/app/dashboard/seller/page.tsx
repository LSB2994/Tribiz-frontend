"use client";

import { useAuth } from "@/context/auth-context";
import { api } from "@/lib/api";
import { useState, useEffect } from "react";
import { 
  ShoppingBag, 
  Store, 
  TrendingUp, 
  Users, 
  Clock, 
  ArrowUpRight, 
  MoreHorizontal,
  AlertCircle,
  Calendar,
  Package,
  Tag,
  Percent,
  PartyPopper,
  MapPin,
  Edit,
  Trash2,
  Minus,
  PlusCircle,
  Warehouse,
  UserPlus,
  User
} from "lucide-react";
import Link from "next/link";


import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";

export default function SellerDashboard() {
  const { user } = useAuth();
  const [promotions, setPromotions] = useState<any[]>([]);
  const [stockItems, setStockItems] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [stockSummary, setStockSummary] = useState<any>(null);
  const [staff, setStaff] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [promos, lowStock, myEvents, summary, myStaff] = await Promise.all([
          api.promotions.getMyPromotions(),
          api.stock.getLowStock(),
          api.events.getMyEvents(),
          api.stock.getSummary(),
          api.staff.getAll(),
        ]);
        setPromotions(promos);
        setStockItems(lowStock);
        setEvents(myEvents);
        setStockSummary(summary);
        setStaff(myStaff);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  };

  const stats = [
    { title: "Total Sales", value: "$12,450.00", icon: TrendingUp, trend: "+12.5%", color: "text-green-500" },
    { title: "Active Orders", value: "24", icon: ShoppingBag, trend: "+4 this week", color: "text-blue-500" },
    { title: "Low Stock Items", value: "7", icon: Package, trend: "3 critical", color: "text-orange-500" },
    { title: "Total Customers", value: "850", icon: Users, trend: "+15% growth", color: "text-purple-500" },
  ];

  const recentOrders = [
    { id: "ORD-1234", customer: "John Doe", items: 3, total: "$120.50", status: "Pending", date: "10 mins ago" },
    { id: "ORD-1235", customer: "Sarah Smith", items: 1, total: "$45.00", status: "Processing", date: "25 mins ago" },
    { id: "ORD-1236", customer: "Mike Johnson", items: 2, total: "$32.10", status: "Shipped", date: "1 hour ago" },
    { id: "ORD-1237", customer: "Emma Wilson", items: 5, total: "$240.00", status: "Delivered", date: "3 hours ago" },
  ];

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tight">Seller Dashboard</h1>
          <p className="text-muted-foreground mt-2 font-bold">Welcome back, {user?.username}! Here's how your business is doing.</p>
        </div>
        <div className="flex gap-2">
          <Button className="gap-2 font-black" size="lg" asChild>
            <Link href="/dashboard/seller/products/new">
              <Package className="h-5 w-5" /> Add Product
            </Link>
          </Button>

          <Button variant="outline" className="gap-2 font-black" size="lg" asChild>
            <Link href="/dashboard/seller/shops">
              <Store className="h-5 w-5" /> My Shops
            </Link>
          </Button>
          <Button variant="outline" className="gap-2 font-black" size="lg" asChild>
            <Link href="/dashboard/seller/events">
              <Calendar className="h-5 w-5" /> Events
            </Link>
          </Button>
        </div>

      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <Card key={i} className="border border-border bg-card hover:bg-accent transition-all group">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-xs font-black uppercase tracking-[0.25em] text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color} group-hover:scale-110 transition-transform`} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black">{stat.value}</div>
              <p className={`text-[10px] mt-2 font-black uppercase tracking-[0.2em] ${stat.trend.includes('+') ? 'text-green-500' : 'text-muted-foreground'}`}>
                {stat.trend}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 border border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-black">Recent Orders</CardTitle>
              <CardDescription className="font-bold text-muted-foreground">You have {recentOrders.length} orders need fulfillment today.</CardDescription>
            </div>
            <Button variant="ghost" className="font-black">View All</Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-b-2">
                  <TableHead className="font-black text-muted-foreground">Order ID</TableHead>
                  <TableHead className="font-black text-muted-foreground">Customer</TableHead>
                  <TableHead className="font-black text-muted-foreground">Items</TableHead>
                  <TableHead className="font-black text-muted-foreground text-right">Total</TableHead>
                  <TableHead className="font-black text-muted-foreground">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentOrders.map((order) => (
                  <TableRow key={order.id} className="group cursor-pointer hover:bg-accent transition-colors">
                    <TableCell className="font-black">{order.id}</TableCell>
                    <TableCell className="font-bold">{order.customer}</TableCell>
                    <TableCell>{order.items}</TableCell>
                    <TableCell className="text-right font-black">{order.total}</TableCell>
                    <TableCell>
                      <Badge variant={
                        order.status === "Delivered" ? "default" : 
                        order.status === "Shipped" ? "secondary" : 
                        order.status === "Pending" ? "destructive" : "outline"
                      } className="font-bold">
                        {order.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="space-y-8">
          <Card className="border border-border bg-card overflow-hidden relative group">
            <CardHeader className="relative z-10">
              <CardTitle className="text-xl font-black">Stock Alerts</CardTitle>
              <CardDescription className="font-bold text-muted-foreground">7 items are below your secondary threshold.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 relative z-10">
              <div className="bg-muted/30 p-3 rounded-xl border border-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Package className="h-5 w-5 text-orange-500" />
                  <div>
                    <p className="text-sm font-black">Organic Coffee</p>
                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">SKU: CF-001</p>
                  </div>
                </div>
                <Badge variant="destructive" className="font-bold">2 left</Badge>
              </div>
              <div className="bg-muted/30 p-3 rounded-xl border border-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Package className="h-5 w-5 text-orange-500" />
                  <div>
                    <p className="text-sm font-black">Local Honey</p>
                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">SKU: HN-042</p>
                  </div>
                </div>
                <Badge variant="destructive" className="font-bold">5 left</Badge>
              </div>
            </CardContent>
            <CardFooter className="relative z-10">
              <Button className="w-full font-black" variant="link">Manage Stock &gt;</Button>
            </CardFooter>
            <Package className="absolute -right-8 -bottom-8 h-32 w-32 opacity-5 -rotate-12 group-hover:scale-110 transition-transform" />
          </Card>

          <Card className="border border-border bg-card">
            <CardHeader>
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-500" /> Pro Tips
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-3">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <ArrowUpRight className="h-4 w-4 text-primary" />
                </div>
                <p className="text-sm font-bold text-muted-foreground">Items with **BOGO** tags sold 40% faster last month. Consider running a promotion on slow-moving stock.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Management Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Promotion Management */}
        <Card className="border border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-xl font-black flex items-center gap-2">
                <Tag className="h-5 w-5 text-primary" /> Promotions
              </CardTitle>
              <CardDescription className="font-bold text-muted-foreground">Active and scheduled deals</CardDescription>
            </div>
            <Button size="sm" className="font-black gap-1">
              <Percent className="h-4 w-4" /> New Promo
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">Loading...</div>
            ) : promotions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No promotions yet</div>
            ) : (
              promotions.slice(0, 3).map((promo) => (
                <div key={promo.id} className="p-4 rounded-xl border border-border bg-muted/20 hover:bg-accent transition-all">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold">{promo.name}</h4>
                    <Badge variant="outline" className="font-bold text-xs">{promo.type}</Badge>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-lg font-black text-primary">
                      {promo.type === "PERCENTAGE" ? `${promo.value}%` : 
                       promo.type === "FIXED_AMOUNT" ? `$${promo.value}` : 
                       promo.type === "BOGO" ? "BOGO" : promo.value}
                    </span>
                    <span className="text-xs text-muted-foreground font-bold uppercase tracking-widest">{promo.status}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-4 w-4" /> Until {formatDate(promo.endDate)}
                    </span>
                    <span className="font-bold">{promo.usageCount || 0} used</span>
                  </div>
                </div>
              ))
            )}
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full font-black">Manage All Promotions</Button>
          </CardFooter>
        </Card>

        {/* Stock Management */}
        <Card className="border border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-xl font-black flex items-center gap-2">
                <Warehouse className="h-5 w-5 text-primary" /> Stock Management
              </CardTitle>
              <CardDescription className="font-bold text-muted-foreground">Inventory levels and restocking</CardDescription>
            </div>
            <Button size="sm" className="font-black gap-1">
              <PlusCircle className="h-4 w-4" /> Restock
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">Loading...</div>
            ) : stockItems.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No low stock items</div>
            ) : (
              stockItems.slice(0, 3).map((item) => {
                const status = item.quantity === 0 ? "Critical" : 
                               item.quantity <= (item.stockThreshold || 10) ? "Low" : "Good";
                return (
                  <div key={item.id} className="p-4 rounded-xl border border-border bg-muted/20 hover:bg-accent transition-all">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-bold">{item.name}</h4>
                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">SKU: {item.barcode || "N/A"}</p>
                      </div>
                      <Badge 
                        variant={status === "Critical" ? "destructive" : status === "Low" ? "secondary" : "default"}
                        className="font-bold"
                      >
                        {item.quantity} left
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Stock Level</span>
                        <span className="font-bold">Min: {item.stockThreshold || 10}</span>
                      </div>
                      <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${
                            status === "Critical" ? "bg-red-500" : 
                            status === "Low" ? "bg-orange-500" : 
                            "bg-green-500"
                          }`}
                          style={{ width: `${Math.min((item.quantity / (item.stockThreshold || 10)) * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full font-black">Full Inventory Report</Button>
          </CardFooter>
        </Card>

        {/* Event Management */}
        <Card className="border border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-xl font-black flex items-center gap-2">
                <PartyPopper className="h-5 w-5 text-primary" /> Events
              </CardTitle>
              <CardDescription className="font-bold text-muted-foreground">Store events and campaigns</CardDescription>
            </div>
            <Button size="sm" className="font-black gap-1">
              <PlusCircle className="h-4 w-4" /> Create Event
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">Loading...</div>
            ) : events.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No events yet</div>
            ) : (
              events.slice(0, 3).map((event) => (
                <div key={event.id} className="p-4 rounded-xl border border-border bg-muted/20 hover:bg-accent transition-all">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold">{event.title}</h4>
                  </div>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(event.startDate)} at {formatTime(event.startDate)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>{event.location}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Button variant="ghost" size="sm" className="h-8 font-bold">
                      <Edit className="h-4 w-4 mr-1" /> Edit
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 font-bold text-destructive">
                      <Trash2 className="h-4 w-4 mr-1" /> Cancel
                    </Button>
                  </div>
                </div>
              ))
            )}
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full font-black">Manage All Events</Button>
          </CardFooter>
        </Card>

        {/* Staff Management */}
        <Card className="border border-border bg-card">
          <CardHeader>
            <CardTitle className="text-xl font-black flex items-center gap-2">
              <User className="h-5 w-5 text-primary" /> Staff Overview
            </CardTitle>
            <CardDescription className="font-bold text-muted-foreground">Manage your team members</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Staff Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-muted/20 p-4 rounded-xl border border-border">
                <div className="text-2xl font-black">{staff.length}</div>
                <p className="text-sm text-muted-foreground font-bold uppercase tracking-widest">Total Staff</p>
              </div>
              <div className="bg-muted/20 p-4 rounded-xl border border-border">
                <div className="text-2xl font-black">{staff.filter(s => s.status === 'ACTIVE').length}</div>
                <p className="text-sm text-muted-foreground font-bold uppercase tracking-widest">Active Staff</p>
              </div>
            </div>

            {/* Staff Table */}
            <div className="space-y-4">
              {loading ? (
                <div className="text-center py-8 text-muted-foreground">Loading...</div>
              ) : staff.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No staff yet
                  <Button variant="outline" className="mt-4 font-black" size="sm">
                    <UserPlus className="h-4 w-4 mr-2" /> Add First Staff
                  </Button>
                </div>
              ) : (
                <div className="border border-border rounded-xl overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-transparent border-b-2">
                        <TableHead className="font-black text-muted-foreground">Name</TableHead>
                        <TableHead className="font-black text-muted-foreground">Email</TableHead>
                        <TableHead className="font-black text-muted-foreground">Status</TableHead>
                        <TableHead className="font-black text-muted-foreground">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {staff.map((member) => (
                        <TableRow key={member.id} className="group hover:bg-accent transition-colors">
                          <TableCell className="font-bold">
                            {member.firstName} {member.lastName}
                            <div className="text-xs text-muted-foreground font-bold uppercase tracking-widest">@{member.username}</div>
                          </TableCell>
                          <TableCell className="text-sm">{member.email}</TableCell>
                          <TableCell>
                            <Badge variant={member.status === 'ACTIVE' ? "default" : "secondary"} className="font-bold">
                              {member.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-destructive">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full font-black gap-2">
              <UserPlus className="h-4 w-4" /> Add New Staff
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
