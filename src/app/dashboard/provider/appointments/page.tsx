"use client";

import { useAuth } from "@/context/auth-context";
import { DataTable } from "@/components/dashboard/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  Users, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  MoreHorizontal,
  ChevronRight,
  Filter
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProviderAppointmentsPage() {
  const { user } = useAuth();

  const appointments = [
    { id: "APT-101", customer: "Alice Johnson", service: "Premium Haircut", date: "2024-02-12", time: "14:00", status: "Confirmed" },
    { id: "APT-102", customer: "Bob Brown", service: "Massage Therapy", date: "2024-02-12", time: "15:30", status: "Pending" },
    { id: "APT-103", customer: "Charlie Davis", service: "Phone Screen Fix", date: "2024-02-12", time: "17:00", status: "In Progress" },
    { id: "APT-104", customer: "Diana Prince", service: "Hair Coloring", date: "2024-02-13", time: "10:00", status: "Confirmed" },
  ];

  const columns = [
    { 
      header: "Customer", 
      accessorKey: "customer" as keyof typeof appointments[0],
      cell: (apt: any) => (
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center font-bold text-xs">
            {apt.customer.split(' ').map((n: string) => n[0]).join('')}
          </div>
          <span className="font-bold">{apt.customer}</span>
        </div>
      )
    },
    { 
      header: "Service", 
      accessorKey: "service" as keyof typeof appointments[0],
      cell: (apt: any) => <span className="font-medium italic">{apt.service}</span>
    },
    { 
      header: "Date & Time", 
      accessorKey: "date" as keyof typeof appointments[0],
      cell: (apt: any) => (
        <div className="space-y-0.5">
          <p className="font-bold">{apt.date}</p>
          <p className="text-xs text-muted-foreground flex items-center gap-1 font-bold italic">
            <Clock className="h-3 w-3" /> {apt.time}
          </p>
        </div>
      )
    },
    { 
      header: "Status", 
      accessorKey: "status" as keyof typeof appointments[0],
      cell: (apt: any) => (
        <Badge variant={
          apt.status === "Confirmed" ? "default" : 
          apt.status === "Pending" ? "secondary" : "outline"
        } className="font-bold uppercase tracking-tighter text-[10px] px-3">
          {apt.status}
        </Badge>
      )
    },
  ];

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight italic">Appointments</h1>
          <p className="text-muted-foreground mt-1 font-medium italic">Track your upcoming bookings and client requests.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2 font-bold" size="lg">
            <Filter className="h-5 w-5" /> Filter
          </Button>
          <Button className="gap-2 font-bold shadow-lg shadow-primary/20" size="lg">
            <Calendar className="h-5 w-5" /> Monthly Calendar
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-2 border-primary/20 bg-primary/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-bold italic">Total Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black">42</div>
            <p className="text-xs text-muted-foreground font-bold mt-1 text-primary">+8 from last week</p>
          </CardContent>
        </Card>
        <Card className="border-2 border-orange-500/20 bg-orange-500/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-bold italic">Pending Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-orange-500">3</div>
            <p className="text-xs text-muted-foreground font-bold mt-1">Requires immediate action</p>
          </CardContent>
        </Card>
        <Card className="border-2 border-green-500/20 bg-green-500/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-bold italic">Completion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-green-500">96%</div>
            <p className="text-xs text-muted-foreground font-bold mt-1">Excellent performance!</p>
          </CardContent>
        </Card>
      </div>

      <DataTable 
        data={appointments} 
        columns={columns} 
        actions={(apt) => (
          <div className="flex justify-end gap-2">
            {apt.status === "Pending" && (
              <>
                <Button size="sm" variant="outline" className="h-8 border-green-500 text-green-500 hover:bg-green-50 font-bold px-3">Accept</Button>
                <Button size="sm" variant="ghost" className="h-8 text-destructive hover:bg-destructive/5 font-bold px-3">Decline</Button>
              </>
            )}
            <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full">
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        )}
      />
    </div>
  );
}
