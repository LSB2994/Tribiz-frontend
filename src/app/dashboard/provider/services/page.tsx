"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";

import { api } from "@/lib/api";
import { ServiceItem } from "@/types";
import { DataTable } from "@/components/dashboard/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Scissors, 
  Clock, 
  MapPin, 
  ArrowLeft,
  Loader2,
  Settings2,
  CalendarCheck
} from "lucide-react";
import Link from "next/link";


export default function ProviderServicesPage() {
  const router = useRouter();
  const [services, setServices] = useState<ServiceItem[]>([]);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchServices() {
      try {
        const data = await api.services.getAll();
        setServices(data);
      } catch (error) {
        console.error("Error fetching services:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchServices();
  }, []);

  const columns = [
    { 
      header: "Service", 
      accessorKey: "name" as keyof ServiceItem,
      cell: (s: ServiceItem) => (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold">
            <Scissors className="h-5 w-5" />
          </div>
          <div>
            <p className="font-extrabold">{s.name}</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Duration: {s.duration || 60} mins</p>
          </div>
        </div>
      )
    },
    { 
      header: "Price", 
      accessorKey: "price" as keyof ServiceItem,
      cell: (s: ServiceItem) => (
        <span className="font-black text-primary">${s.price.toFixed(2)}</span>
      )
    },
    { 
      header: "Location", 
      accessorKey: "location" as keyof ServiceItem,
      cell: (s: ServiceItem) => (
        <div className="flex items-center gap-1.5 text-muted-foreground font-medium text-xs">
          <MapPin className="h-3 w-3" />
          {s.location}
        </div>
      )
    },
    { 
      header: "Schedule", 
      accessorKey: "id" as keyof ServiceItem,
      cell: (s: ServiceItem) => (
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="h-7 px-3 text-[10px] font-bold border-2 rounded-lg gap-1.5 hover:bg-primary hover:text-white transition-all">
            <CalendarCheck className="h-3 w-3" /> Configure Availability
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg">
            <Settings2 className="h-4 w-4" />
          </Button>
        </div>
      )
    },
  ];

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight italic">Service Catalog</h1>
          <p className="text-muted-foreground mt-1 font-medium italic">Define your offerings, durations, and booking rules.</p>
        </div>
        <Button className="gap-2 font-bold shadow-lg shadow-primary/20" size="lg" asChild>
          <Link href="/dashboard/provider/services/new">
            <Plus className="h-5 w-5" /> New Service
          </Link>
        </Button>

      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <DataTable 
          data={services} 
          columns={columns} 
          onEdit={(s) => router.push(`/dashboard/provider/services/${s.id}`)}
          onDelete={(s) => console.log("Delete service", s)}
        />

      )}
    </div>
  );
}
