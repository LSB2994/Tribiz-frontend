"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { EventItem } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft, Loader2, Save, Calendar as CalendarIcon, MapPin, Image as ImageIcon } from "lucide-react";
import Link from "next/link";

export default function NewEventPage() {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [event, setEvent] = useState<Partial<EventItem>>({
    title: "",
    description: "",
    location: "",
    startDate: "",
    endDate: "",
    image: ""
  });

  const handleSave = async (e?: React.FormEvent | React.MouseEvent) => {
    e?.preventDefault();
    setIsSaving(true);
    try {
      await api.events.create(event);
      router.push("/dashboard/seller/events");
    } catch (error) {
      console.error("Error creating event:", error);
    } finally {
      setIsSaving(false);
    }
  };

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
          <h1 className="text-4xl font-bold tracking-tight italic text-primary">Schedule New Event</h1>
          <p className="text-muted-foreground mt-1 font-medium italic">Create an event to engage with your community and customers.</p>
        </div>
        <Button 
          className="gap-2 font-bold shadow-lg shadow-primary/20" 
          onClick={handleSave}
          disabled={isSaving}
        >
          {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Announce Event
        </Button>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card className="border-2 shadow-sm">
            <CardHeader className="border-b bg-muted/30">
              <CardTitle className="italic">Common Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="font-bold">Event Title</Label>
                <div className="relative">
                  <CalendarIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="name" 
                    placeholder="e.g. Summer Weekend Pop-up Sale"
                    value={event.title || ""} 
                    onChange={(e) => setEvent({ ...event, title: e.target.value })}
                    className="pl-10 font-extrabold text-xl"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="font-bold">Event Description</Label>
                <Textarea 
                  id="description" 
                  rows={5}
                  placeholder="Details about the event, what to expect, etc."
                  value={event.description} 
                  onChange={(e) => setEvent({...event, description: e.target.value})}
                  className="font-medium"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location" className="font-bold">Location / Venue</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="location" 
                    placeholder="e.g. Main Square, Suite 402"
                    value={event.location} 
                    onChange={(e) => setEvent({...event, location: e.target.value})}
                    className="pl-10 font-bold"
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-primary/10 shadow-sm bg-primary/5">
            <CardHeader className="border-b border-primary/10">
              <CardTitle className="italic">Timing & Schedule</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="startDate" className="font-bold">Starts On</Label>
                  <Input 
                    id="startDate" 
                    type="datetime-local"
                    value={event.startDate} 
                    onChange={(e) => setEvent({...event, startDate: e.target.value})}
                    className="font-medium"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate" className="font-bold">Ends On</Label>
                  <Input 
                    id="endDate" 
                    type="datetime-local"
                    value={event.endDate} 
                    onChange={(e) => setEvent({...event, endDate: e.target.value})}
                    className="font-medium"
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          <Card className="border-2 overflow-hidden shadow-sm">
            <CardHeader className="border-b bg-muted/30">
              <CardTitle className="italic">Event Banner</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="aspect-video rounded-2xl bg-muted flex items-center justify-center relative overflow-hidden border-2 shadow-inner group">
                {event.image ? (
                  <img src={event.image} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
                ) : (
                  <ImageIcon className="h-12 w-12 text-muted-foreground" />
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="image" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Banner Image URL</Label>
                <Input 
                  id="image" 
                  placeholder="https://..."
                  value={event.image} 
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
