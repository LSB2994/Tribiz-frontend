"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { EventItem } from "@/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Search, Bookmark, MessageSquare, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";

import { Skeleton } from "@/components/ui/skeleton";

export default function EventsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
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

  const filteredEvents = events.filter(event => 
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter">Community Events</h1>
          <div className="h-1 w-20 bg-primary" />
          <p className="text-muted-foreground font-medium uppercase text-[10px] tracking-[0.3em]">Join local happenings and connect with your neighbors.</p>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="SEARCH EVENTS..." 
            className="pl-12 h-14 rounded-none border-black/10 focus-visible:border-black transition-all font-bold text-[10px] tracking-widest uppercase shadow-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {isLoading ? (
          Array(6).fill(0).map((_, i) => (
            <Skeleton key={i} className="h-[350px] rounded-none bg-muted/50" />
          ))
        ) : filteredEvents.length > 0 ? (
          filteredEvents.map((event) => (
            <Card key={event.id} className="rounded-none border-none shadow-none group transition-all duration-500 bg-transparent flex flex-col h-full border-l border-black/5 hover:border-black/20 pl-6 hover:pl-8 active:pl-8">
              <div className="aspect-[16/9] bg-muted relative overflow-hidden mb-6">
                <div className="absolute top-0 left-0 bg-white p-3 z-10 border-b border-r border-black/5">
                  <div className="flex flex-col items-center">
                    <span className="text-2xl font-black leading-none">{new Date(event.startDate).getDate()}</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{new Date(event.startDate).toLocaleDateString(undefined, { month: 'short' }).toUpperCase()}</span>
                  </div>
                </div>
                {/* Image Placeholder or Actual Image would go here */}
                <div className="h-full w-full bg-primary/5 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                   <Calendar className="h-16 w-16 text-primary/20 group-hover:scale-105 transition-transform duration-500" />
                </div>
                 <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors" />
              </div>

              <div className="flex-1 flex flex-col space-y-3">
                <div className="flex items-center gap-2 text-primary font-bold text-[10px] uppercase tracking-widest">
                  <MapPin className="h-3 w-3" />
                  <span>{event.location}</span>
                </div>
                
                <CardTitle className="text-2xl font-black uppercase tracking-tight leading-none group-hover:text-primary transition-colors line-clamp-2">
                  <Link href={`/events/${event.id}`}>{event.title}</Link>
                </CardTitle>
                
                <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                  {event.description}
                </p>
                
                <div className="mt-auto pt-4 flex items-center justify-between text-[10px] font-medium text-muted-foreground border-t border-black/5">
                   <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1.5 uppercase tracking-wider font-bold">
                        <Clock className="h-3 w-3" /> {new Date(event.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <span className="flex items-center gap-1.5 uppercase tracking-wider font-bold">
                        <MessageSquare className="h-3 w-3" /> 12 Comments
                      </span>
                   </div>
                   <Button size="sm" variant="outline" className="h-8 rounded-none border-black hover:bg-black hover:text-white uppercase tracking-widest text-[9px] font-black transition-all" asChild>
                      <Link href={`/events/${event.id}`}>Details</Link>
                   </Button>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <div className="col-span-full py-32 text-center space-y-8 bg-muted/20 border border-dashed border-black/10">
            <div className="relative inline-block">
               <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full" />
               <Search className="h-20 w-20 mx-auto text-muted-foreground/30 relative z-10" />
            </div>
            <div className="space-y-2">
               <h3 className="text-3xl font-black uppercase tracking-tighter">No events found</h3>
               <p className="text-muted-foreground font-medium uppercase text-[10px] tracking-[0.3em] max-w-xs mx-auto">We couldn't find any events matching your search.</p>
            </div>
            <Button variant="outline" className="rounded-none h-14 px-10 font-black uppercase tracking-widest text-[10px] border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all" onClick={() => setSearchTerm("")}>
              Clear Search
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
