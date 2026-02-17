"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { ServiceItem } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft, Loader2, Save, Trash2, Clock, DollarSign, Scissors, Image as ImageIcon } from "lucide-react";
import Link from "next/link";

export default function EditServicePage() {
  const { id } = useParams();
  const router = useRouter();
  const [service, setService] = useState<ServiceItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function fetchService() {
      try {
        const data = await api.services.getById(Number(id));
        setService(data);
      } catch (error) {
        console.error("Error fetching service:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchService();
  }, [id]);

  const handleSave = async (e: React.FormEvent) => {

    e.preventDefault();
    if (!service) return;
    
    setIsSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log("Saving service:", service);
      router.push("/dashboard/provider/services");
    } catch (error) {
      console.error("Error saving service:", error);
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

  if (!service) {
    return <div className="text-center py-20">Service not found.</div>;
  }

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
          <h1 className="text-4xl font-bold tracking-tight italic">Edit Service</h1>
          <p className="text-muted-foreground mt-1 font-medium italic">Update your service offerings, pricing, and timing.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="text-destructive border-destructive/20 hover:bg-destructive/10 font-bold">
            <Trash2 className="h-4 w-4 mr-2" /> Delete Service
          </Button>
          <Button 
            className="gap-2 font-bold shadow-lg shadow-primary/20" 
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save Changes
          </Button>
        </div>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="italic">Service Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="font-bold">Service Title</Label>
                <div className="relative">
                  <Scissors className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="name" 
                    value={service.name} 
                    onChange={(e) => setService({...service, name: e.target.value})}
                    className="pl-10 font-bold"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="font-bold">Service Description</Label>
                <Textarea 
                  id="description" 
                  rows={4}
                  value={service.description} 
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setService({...service, description: e.target.value})}
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
                      value={service.price} 
                      onChange={(e) => setService({...service, price: parseFloat(e.target.value)})}
                      className="pl-10 font-bold text-primary"
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
                      value={service.durationMinutes} 
                      onChange={(e) => setService({...service, durationMinutes: parseInt(e.target.value)})}
                      className="pl-10 font-medium"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="italic">Availability</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
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
          <Card className="border-2 overflow-hidden">
            <CardHeader>
              <CardTitle className="italic">Service Imagery</CardTitle>
              <CardDescription>Visual representation of your service.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="aspect-video rounded-2xl bg-muted flex items-center justify-center relative overflow-hidden border-2 shadow-inner group">
                {service.image ? (
                  <img src={service.image} alt={service.name} className="absolute inset-0 w-full h-full object-cover" />
                ) : (
                  <ImageIcon className="h-12 w-12 text-muted-foreground" />
                )}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <Button variant="secondary" size="sm" className="font-bold">Update Photo</Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="image" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Image URL</Label>
                <Input 
                  id="image" 
                  value={service.image || ""} 
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
