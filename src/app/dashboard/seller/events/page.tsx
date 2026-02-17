"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { EventItem } from "@/types";
import { DataTable } from "@/components/dashboard/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Calendar, 
  MapPin, 
  ArrowLeft,
  Loader2,
  Clock,
  Users
} from "lucide-react";
import Link from "next/link";

export default function SellerEventsPage() {
  const router = useRouter();
  const [events, setEvents] = useState<EventItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const data = await api.events.getAll();
        setEvents(data);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchEvents();
  }, []);

  const columns = [
    { 
      header: "Event", 
      accessorKey: "title" as keyof EventItem,
      cell: (e: EventItem) => (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold">
            <Calendar className="h-5 w-5" />
          </div>
          <div>
            <p className="font-extrabold">{e.title}</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">{new Date(e.startDate).toLocaleDateString()}</p>
          </div>
        </div>
      )
    },
    { 
      header: "Location", 
      accessorKey: "location" as keyof EventItem,
      cell: (e: EventItem) => (
        <div className="flex items-center gap-1.5 text-muted-foreground font-medium text-xs">
          <MapPin className="h-3 w-3" />
          {e.location}
        </div>
      )
    },
    { 
      header: "Timing", 
      accessorKey: "startDate" as keyof EventItem,
      cell: (e: EventItem) => (
        <div className="flex items-center gap-1.5 text-muted-foreground font-medium text-xs">
          <Clock className="h-3 w-3" />
          {new Date(e.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      )
    },
    { 
      header: "Attendees", 
      accessorKey: "id" as keyof EventItem,
      cell: () => (
        <Badge variant="outline" className="font-bold border-2 text-primary border-primary/20">
          <Users className="h-3 w-3 mr-1" /> 45 Joined
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
          <h1 className="text-4xl font-bold tracking-tight italic">Marketplace Events</h1>
          <p className="text-muted-foreground mt-1 font-medium italic">Organize community events and shop promotions.</p>
        </div>
        <Button className="ml-auto gap-2 font-bold shadow-lg shadow-primary/20" size="lg" asChild>
          <Link href="/dashboard/seller/events/new">
            <Plus className="h-5 w-5" /> Create Event
          </Link>
        </Button>

      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <DataTable 
          data={events} 
          columns={columns} 
          onEdit={(e) => router.push(`/dashboard/seller/events/${e.id}`)}
          onDelete={(e) => console.log("Delete event", e)}
        />
      )}
    </div>
  );
}
