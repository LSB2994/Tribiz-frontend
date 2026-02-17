"use client";

import { useAuth } from "@/context/auth-context";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Calendar, Clock, MapPin, ChevronRight, CheckCircle2, Package, Loader2 } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Suspense } from "react";

function HistoryContent() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const success = searchParams.get("success");

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 text-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary opacity-20" />
        <h2 className="text-2xl font-bold">Please log in to see your history</h2>
        <Button asChild>
          <Link href="/login?redirect=/history">Login Now</Link>
        </Button>
      </div>
    );
  }

  const mockOrders = [
    { id: "ORD-7829", date: "2024-02-10", total: 45.99, status: "Delivered", items: 3 },
    { id: "ORD-9912", date: "2024-01-28", total: 12.50, status: "Cancelled", items: 1 },
  ];

  const mockAppointments = [
    { id: "APT-123", service: "Premium Haircut", shop: "The Barber Shop", date: "2024-02-15", time: "14:30", status: "Upcoming" },
    { id: "APT-456", service: "Phone Repair", shop: "Tech Fix", date: "2024-02-05", time: "11:00", status: "Completed" },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      {success === "true" && (
        <Alert className="bg-green-500/10 border-green-500 text-green-700">
          <CheckCircle2 className="h-4 w-4" />
          <AlertTitle>Success!</AlertTitle>
          <AlertDescription>Your order has been placed successfully. Thank you for shopping with TriBiz!</AlertDescription>
        </Alert>
      )}
      {success === "booking" && (
        <Alert className="bg-green-500/10 border-green-500 text-green-700">
          <CheckCircle2 className="h-4 w-4" />
          <AlertTitle>Booking Confirmed!</AlertTitle>
          <AlertDescription>Your appointment has been scheduled. You can view details in the appointments tab below.</AlertDescription>
        </Alert>
      )}

      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-bold tracking-tight italic text-primary">Your Activity</h1>
          <p className="text-muted-foreground mt-2 font-medium">Tracking your community contributions and purchases.</p>
        </div>
      </div>

      <Tabs defaultValue="orders" className="w-full">
        <TabsList className="grid w-full grid-cols-2 h-14 border-2">
          <TabsTrigger value="orders" className="text-lg font-bold gap-2">
            <Package className="h-5 w-5" /> Orders
          </TabsTrigger>
          <TabsTrigger value="appointments" className="text-lg font-bold gap-2">
            <Calendar className="h-5 w-5" /> Appointments
          </TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="mt-8 space-y-4">
          {mockOrders.length > 0 ? (
            mockOrders.map((order) => (
              <Card key={order.id} className="hover:shadow-md transition-shadow border-2 group">
                <CardContent className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-center gap-6">
                    <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <ShoppingBag className="h-8 w-8" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-muted-foreground">{order.id}</p>
                      <h3 className="text-xl font-extrabold">{new Date(order.date).toLocaleDateString()}</h3>
                      <p className="text-sm font-medium text-muted-foreground italic">{order.items} Items • Total: ${order.total.toFixed(2)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 justify-between md:justify-end">
                    <Badge variant={order.status === "Delivered" ? "default" : "secondary"} className="h-8 px-4 font-bold border-2">
                      {order.status}
                    </Badge>
                    <Button variant="ghost" size="icon" className="rounded-full">
                      <ChevronRight className="h-6 w-6" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="py-20 text-center border-2 border-dashed rounded-3xl opacity-50">
              <Package className="h-12 w-12 mx-auto mb-4" />
              <p className="text-xl font-bold italic">No orders found.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="appointments" className="mt-8 space-y-4">
          {mockAppointments.length > 0 ? (
            mockAppointments.map((apt) => (
              <Card key={apt.id} className="hover:shadow-md transition-shadow border-2 group">
                <CardContent className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-center gap-6">
                    <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <Calendar className="h-8 w-8" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-muted-foreground italic">{apt.shop}</p>
                      <h3 className="text-xl font-extrabold">{apt.service}</h3>
                      <div className="flex items-center gap-4 text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {apt.date} at {apt.time}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 justify-between md:justify-end">
                    <Badge variant={apt.status === "Upcoming" ? "default" : "outline"} className={`h-8 px-4 font-bold border-2 ${apt.status === "Upcoming" ? "bg-orange-500 hover:bg-orange-600 border-none text-white" : ""}`}>
                      {apt.status}
                    </Badge>
                    <Button variant="ghost" size="icon" className="rounded-full">
                      <ChevronRight className="h-6 w-6" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="py-20 text-center border-2 border-dashed rounded-3xl opacity-50">
              <Calendar className="h-12 w-12 mx-auto mb-4" />
              <p className="text-xl font-bold italic">No appointments found.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
        <Card className="bg-primary text-primary-foreground border-none overflow-hidden relative group">
          <CardHeader className="relative z-10">
            <CardTitle className="text-2xl italic font-black">Need of Help?</CardTitle>
            <CardDescription className="text-primary-foreground/70 font-bold">Contact our support for any issues with orders or bookings.</CardDescription>
          </CardHeader>
          <CardContent className="relative z-10">
            <Button variant="outline" className="bg-white text-primary border-none hover:bg-white/90 font-bold">Get Support</Button>
          </CardContent>
          <ShoppingBag className="absolute -right-8 -bottom-8 h-48 w-48 opacity-10 rotate-12 group-hover:scale-110 transition-transform" />
        </Card>
        
        <Card className="bg-muted border-2 overflow-hidden relative group">
          <CardHeader className="relative z-10">
            <CardTitle className="text-2xl italic font-black">Community Wallet</CardTitle>
            <CardDescription className="font-bold">You have 250 TriBiz points! Save more on your next purchase.</CardDescription>
          </CardHeader>
          <CardContent className="relative z-10">
            <Button className="font-bold">View Rewards</Button>
          </CardContent>
          <Clock className="absolute -right-8 -bottom-8 h-48 w-48 opacity-10 -rotate-12 group-hover:scale-110 transition-transform" />
        </Card>
      </div>
    </div>
  );
}

export default function HistoryPage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-20"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>}>
      <HistoryContent />
    </Suspense>
  );
}
