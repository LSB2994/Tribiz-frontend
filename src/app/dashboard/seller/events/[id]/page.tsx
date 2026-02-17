"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { EventItem } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft, Loader2, Save, Calendar, MapPin, Image as ImageIcon } from "lucide-react";
import Link from "next/link";

export default function EditEventPage() {
  const { id } = useParams();
  const router = useRouter();
  const [event, setEvent] = useState<EventItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function fetchEvent() {
      try {
        const data = await api.events.getById(Number(id));
        setEvent(data);
      } catch (error) {
        console.error("Error fetching event:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchEvent();
  }, [id]);

  const handleSave = async (e?: React.FormEvent | React.MouseEvent) => {
    e?.preventDefault();
    if (!event) return;
    
    setIsSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log("Saving event:", event);
      router.push("/dashboard/seller/events");
    } catch (error) {
      console.error("Error saving event:", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!event) {
    return <div className="text-center py-20">Event not found.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div className="flex items-center justify-between">
        <Button variant="ghost" className="gap-2" asChild>
          <Link href="/dashboard/seller/events">
            <ArrowLeft className="h-4 w-4" /> Back to Events
          </Link>
        </Button>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight italic">Edit Marketplace Event</h1>
          <p className="text-muted-foreground mt-1 font-medium italic">Update your event details, location, and schedule.</p>
        </div>
        <Button 
          className="gap-2 font-bold shadow-lg shadow-primary/20" 
          onClick={handleSave}
          disabled={isSaving}
        >
          {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save Event
        </Button>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="italic">Event Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="font-bold">Event Title</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="name" 
                    value={event.title} 
                    onChange={(e) => setEvent({ ...event, title: e.target.value })}
                    className="pl-10 font-extrabold"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="font-bold">Detailed Description</Label>
                <Textarea 
                  id="description" 
                  rows={5}
                  value={event.description} 
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setEvent({...event, description: e.target.value})}
                  className="font-medium"
                />
              </div>


              <div className="space-y-2">
                <Label htmlFor="location" className="font-bold">Event Venue / Location</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="location" 
                    value={event.location} 
                    onChange={(e) => setEvent({...event, location: e.target.value})}
                    className="pl-10 font-medium"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="italic">Schedule Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="startDate" className="font-bold">Start Date & Time</Label>
                  <Input 
                    id="startDate" 
                    type="datetime-local"
                    value={event.startDate.split('.')[0]} 
                    onChange={(e) => setEvent({...event, startDate: e.target.value})}
                    className="font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate" className="font-bold">End Date & Time</Label>
                  <Input 
                    id="endDate" 
                    type="datetime-local"
                    value={event.endDate.split('.')[0]} 
                    onChange={(e) => setEvent({...event, endDate: e.target.value})}
                    className="font-medium"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          <Card className="border-2 overflow-hidden">
            <CardHeader>
              <CardTitle className="italic">Banner Image</CardTitle>
              <CardDescription>Hero image for the event page.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="aspect-video rounded-2xl bg-muted flex items-center justify-center relative overflow-hidden border-2 shadow-inner group">
                {event.image ? (
                  <img src={event.image} alt={event.title} className="absolute inset-0 w-full h-full object-cover" />
                ) : (
                  <ImageIcon className="h-12 w-12 text-muted-foreground" />
                )}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <Button variant="secondary" size="sm" className="font-bold">Change Banner</Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="image" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Banner URL</Label>
                <Input 
                  id="image" 
                  value={event.image || ""} 
                  onChange={(e) => setEvent({...event, image: e.target.value})}
                  className="text-xs font-medium"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
}
