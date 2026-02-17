"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { ServiceItem } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft, Loader2, Save, Clock, DollarSign, Scissors, Image as ImageIcon } from "lucide-react";
import Link from "next/link";

export default function NewServicePage() {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [service, setService] = useState<Partial<ServiceItem>>({
    name: "",
    description: "",
    price: 0,
    durationMinutes: 60,
    image: "",
    status: "AVAILABLE"
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const payload = {
        name: service.name || "",
        description: service.description || "",
        price: service.price || 0,
        durationMinutes: service.durationMinutes || 60
      };
      await api.services.create(payload);
      router.push("/dashboard/provider/services");
    } catch (error) {
      console.error("Error creating service:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div className="flex items-center justify-between">
        <Button variant="ghost" className="gap-2" asChild>
          <Link href="/dashboard/provider/services">
            <ArrowLeft className="h-4 w-4" /> Back to Services
          </Link>
        </Button>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight italic text-primary">New Service Listing</h1>
          <p className="text-muted-foreground mt-1 font-medium italic">Define a new service for your customers to book.</p>
        </div>
        <Button 
          className="gap-2 font-bold shadow-lg shadow-primary/20" 
          onClick={handleSave}
          disabled={isSaving}
        >
          {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Publish Service
        </Button>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card className="border-2 shadow-sm">
            <CardHeader className="border-b bg-muted/30">
              <CardTitle className="italic">Service Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="font-bold">Service Title</Label>
                <div className="relative">
                  <Scissors className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="name" 
                    placeholder="e.g. Professional Haircut & Styling"
                    value={service.name} 
                    onChange={(e) => setService({...service, name: e.target.value})}
                    className="pl-10 font-bold"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="font-bold">Detailed Description</Label>
                <Textarea 
                  id="description" 
                  rows={5}
                  placeholder="Describe your service and what's included..."
                  value={service.description} 
                  onChange={(e) => setService({...service, description: e.target.value})}
                  className="font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="price" className="font-bold">Price ($)</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="price" 
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={service.price} 
                      onChange={(e) => setService({...service, price: parseFloat(e.target.value)})}
                      className="pl-10 font-bold text-primary"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration" className="font-bold">Duration (Minutes)</Label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="duration" 
                      type="number"
                      placeholder="60"
                      value={service.durationMinutes} 
                      onChange={(e) => setService({...service, durationMinutes: parseInt(e.target.value)})}
                      className="pl-10 font-medium"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-primary/10 shadow-sm bg-primary/5">
            <CardHeader className="border-b border-primary/10">
              <CardTitle className="italic">Booking Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="space-y-2">
                <Label htmlFor="status" className="font-bold">Visibility Status</Label>
                <Input 
                  id="status" 
                  value={service.status} 
                  onChange={(e) => setService({...service, status: e.target.value})}
                  className="font-medium"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          <Card className="border-2 overflow-hidden shadow-sm">
            <CardHeader className="border-b bg-muted/30">
              <CardTitle className="italic">Service Photo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="aspect-video rounded-2xl bg-muted flex items-center justify-center relative overflow-hidden border-2 shadow-inner group">
                {service.image ? (
                  <img src={service.image} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
                ) : (
                  <ImageIcon className="h-12 w-12 text-muted-foreground" />
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="image" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Image URL</Label>
                <Input 
                  id="image" 
                  placeholder="https://..."
                  value={service.image} 
                  onChange={(e) => setService({...service, image: e.target.value})}
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
