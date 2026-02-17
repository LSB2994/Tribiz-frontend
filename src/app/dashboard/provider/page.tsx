"use client";

import { useAuth } from "@/context/auth-context";
import { api } from "@/lib/api";
import { useState, useEffect } from "react";
import { 
  Calendar, 
  Users, 
  Clock, 
  TrendingUp, 
  Plus, 
  ArrowUpRight,
  CheckCircle2,
  CalendarDays,
  Scissors,
  Star,
  Store,
  Tag,
  PartyPopper,
  MapPin,
  Edit,
  Trash2,
  MoreHorizontal,
  UserPlus,
  User
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";

export default function ProviderDashboard() {
  const { user } = useAuth();
  const [myShops, setMyShops] = useState<any[]>([]);
  const [promotions, setPromotions] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [staff, setStaff] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch all required data in parallel
        const [shopData, promoData, eventsData, myStaff] = await Promise.all([
          api.shops.getMyShop().catch(() => null),
          api.promotions.getMyPromotions(),
          api.events.getMyEvents(),
          api.staff.getAll(),
        ]);
        
        // Convert single shop to array if exists
        setMyShops(shopData ? [shopData] : []);
        setPromotions(promoData);
        setEvents(eventsData);
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
    { title: "Upcoming Bookings", value: "12", icon: Calendar, trend: "4 today", color: "text-primary" },
    { title: "Capacity Status", value: "85%", icon: Clock, trend: "High demand", color: "text-orange-500" },
    { title: "Avg Rating", value: "4.8", icon: Star, trend: "from 85 reviews", color: "text-amber-500" },
    { title: "Monthly Revenue", value: "$4,250", icon: TrendingUp, trend: "+8.2%", color: "text-green-500" },
  ];

  const todayAppointments = [
    { id: "APT-101", customer: "Alice Johnson", service: "Premium Haircut", time: "14:00", status: "Confirmed" },
    { id: "APT-102", customer: "Bob Brown", service: "Massage Therapy", time: "15:30", status: "Pending" },
    { id: "APT-103", customer: "Charlie Davis", service: "Phone Screen Fix", time: "17:00", status: "In Progress" },
  ];

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tight">Provider Dashboard</h1>
          <p className="text-muted-foreground mt-2 font-bold">Welcome back, {user?.username}! Manage your appointments and services.</p>
        </div>
        <div className="flex gap-2">
          <Button className="gap-2 font-black" size="lg">
            <Plus className="h-5 w-5" /> New Service
          </Button>
          <Button variant="outline" className="gap-2 font-black" size="lg">
            <CalendarDays className="h-5 w-5" /> Schedule
          </Button>
          <Button variant="outline" className="gap-2 font-black" size="lg">
            <Store className="h-5 w-5" /> Shops
          </Button>
          <Button variant="outline" className="gap-2 font-black" size="lg">
            <PartyPopper className="h-5 w-5" /> Events
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <Card key={i} className="border border-border bg-card hover:bg-accent transition-all group overflow-hidden">
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
            <div className={`h-1 w-full mt-4 ${stat.color.replace('text', 'bg').replace('500', '500/20')}`}>
              <div className={`h-full ${stat.color.replace('text', 'bg')} w-2/3 transition-all duration-1000 group-hover:w-full`}></div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 border border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-black">Today's Schedule</CardTitle>
              <CardDescription className="font-bold text-muted-foreground">You have 3 appointments remaining today.</CardDescription>
            </div>
            <Badge variant="outline" className="text-sm py-1 px-4 font-black">Feb 12, 2024</Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            {todayAppointments.map((apt, i) => (
              <div key={apt.id} className="relative group">
                {i !== todayAppointments.length - 1 && (
                  <div className="absolute left-6 top-12 bottom-0 w-0.5 bg-border"></div>
                )}
                <div className="flex gap-6 p-4 rounded-3xl border border-border bg-muted/20 hover:bg-accent transition-all">
                  <div className={`h-12 w-12 rounded-2xl flex items-center justify-center font-bold text-lg shrink-0 ${
                    apt.status === "Confirmed" ? "bg-green-500 text-white" :
                    apt.status === "Pending" ? "bg-orange-500 text-white" :
                    "bg-blue-500 text-white"
                  }`}>
                    {apt.time.split(":")[0]}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-lg">{apt.service}</h4>
                      <Badge variant="outline" className="font-black">{apt.status}</Badge>
                    </div>
                    <p className="text-sm font-medium flex items-center gap-2"><Users className="h-4 w-4 text-muted-foreground" /> {apt.customer}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-2"><Clock className="h-4 w-4" /> {apt.time} - {parseInt(apt.time.split(":")[0]) + 1}:00</p>
                  </div>
                  <div className="flex items-center">
                    <Button variant="ghost" size="icon" className="rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                      <Plus className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
          <CardFooter className="bg-muted/30 border-t justify-between py-4">
            <p className="text-xs text-muted-foreground font-bold">Tip: 2 clients are waiting for confirmation.</p>
            <Button size="sm" className="font-black">View Full Calendar</Button>
          </CardFooter>
        </Card>

        <div className="space-y-8">
          <Card className="border border-border bg-card overflow-hidden relative group">
            <CardHeader>
              <CardTitle className="text-xl font-black">Popular Services</CardTitle>
              <CardDescription className="font-bold text-muted-foreground">Most booked services this week.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm font-bold">
                  <span className="flex items-center gap-2"><Scissors className="h-4 w-4 text-primary" /> Haircut</span>
                  <span>45 bookings</span>
                </div>
                <div className="h-2 w-full bg-muted rounded-full">
                  <div className="h-full bg-primary w-[85%] rounded-full"></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm font-bold">
                  <span className="flex items-center gap-2"><Scissors className="h-4 w-4 text-primary" /> Beard Trim</span>
                  <span>28 bookings</span>
                </div>
                <div className="h-2 w-full bg-muted rounded-full">
                  <div className="h-full bg-primary w-[60%] rounded-full"></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm font-bold">
                  <span className="flex items-center gap-2"><Scissors className="h-4 w-4 text-primary" /> Spa Package</span>
                  <span>12 bookings</span>
                </div>
                <div className="h-2 w-full bg-muted rounded-full">
                  <div className="h-full bg-primary w-[35%] rounded-full"></div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 bg-gradient-to-br from-primary to-primary-foreground text-white overflow-hidden relative group">
            <CardContent className="p-8 space-y-4 relative z-10">
              <CheckCircle2 className="h-10 w-10 text-white/50" />
              <h3 className="text-2xl font-black italic">Excellent Service!</h3>
              <p className="text-white/80 font-medium italic">"Best haircut I've had in years. The provider was professional and the atmosphere was great!"</p>
              <div className="flex gap-1">
                {[1,2,3,4,5].map(i => <Star key={i} className="h-4 w-4 fill-white" />)}
              </div>
            </CardContent>
            <TrendingUp className="absolute -right-12 -bottom-12 h-48 w-48 text-white/10 -rotate-12" />
          </Card>
        </div>
      </div>

      {/* Management Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Shop Management */}
        <Card className="border border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-xl font-black flex items-center gap-2">
                <Store className="h-5 w-5 text-primary" /> My Shops
              </CardTitle>
              <CardDescription className="font-bold text-muted-foreground">Manage your service locations</CardDescription>
            </div>
            <Button size="sm" className="font-black gap-1">
              <Plus className="h-4 w-4" /> Add Shop
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">Loading...</div>
            ) : myShops.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No shop yet. Create one to get started!</div>
            ) : (
              myShops.map((shop) => (
                <div key={shop.id} className="p-4 rounded-xl border border-border bg-muted/20 hover:bg-accent transition-all group">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-lg">{shop.name}</h4>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <MapPin className="h-4 w-4" />
                    <span>{shop.location}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <Badge variant={shop.isOpen ? "default" : "secondary"} className="font-bold">
                      {shop.isOpen ? "Active" : "Closed"}
                    </Badge>
                    <div className="flex items-center gap-1 text-sm">
                      <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                      <span className="font-bold">{shop.rating?.toFixed(1) || "0.0"}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full font-black">Manage All Shops</Button>
          </CardFooter>
        </Card>

        {/* Promotion Management */}
        <Card className="border border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-xl font-black flex items-center gap-2">
                <Tag className="h-5 w-5 text-primary" /> Promotions
              </CardTitle>
              <CardDescription className="font-bold text-muted-foreground">Active deals and offers</CardDescription>
            </div>
            <Button size="sm" className="font-black gap-1">
              <Plus className="h-4 w-4" /> New Promo
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
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" /> Until {formatDate(promo.endDate)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-4 w-4" /> {promo.usageCount || 0} used
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <Badge className={promo.status === "ACTIVE" ? "bg-green-500" : "bg-muted"}>
                      {promo.status}
                    </Badge>
                    <Button variant="ghost" size="sm" className="h-8 font-bold">Edit</Button>
                  </div>
                </div>
              ))
            )}
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full font-black">View All Promotions</Button>
          </CardFooter>
        </Card>

        {/* Event Management */}
        <Card className="border border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-xl font-black flex items-center gap-2">
                <PartyPopper className="h-5 w-5 text-primary" /> Events
              </CardTitle>
              <CardDescription className="font-bold text-muted-foreground">Upcoming events and workshops</CardDescription>
            </div>
            <Button size="sm" className="font-black gap-1">
              <Plus className="h-4 w-4" /> Create Event
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
