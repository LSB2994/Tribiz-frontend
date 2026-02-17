"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Shop } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Loader2, Save, MapPin, Phone, Store, Image as ImageIcon } from "lucide-react";
import Link from "next/link";

export default function EditShopPage() {
  const { id } = useParams();
  const router = useRouter();
  const [shop, setShop] = useState<Shop | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function fetchShop() {
      try {
        const data = await api.shops.getById(Number(id));
        setShop(data);
      } catch (error) {
        console.error("Error fetching shop:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchShop();
  }, [id]);

  const handleSave = async (e: React.FormEvent) => {

    e.preventDefault();
    if (!shop) return;
    
    setIsSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log("Saving shop:", shop);
      router.push("/dashboard/seller/shops");
    } catch (error) {
      console.error("Error saving shop:", error);
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

  if (!shop) {
    return <div className="text-center py-20">Shop not found.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div className="flex items-center justify-between">
        <Button variant="ghost" className="gap-2" asChild>
          <Link href="/dashboard/seller/shops">
            <ArrowLeft className="h-4 w-4" /> Back to My Shops
          </Link>
        </Button>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight italic">Edit Shop Profile</h1>
          <p className="text-muted-foreground mt-1 font-medium italic">Manage your shop's online presence and contact details.</p>
        </div>
        <Button 
          className="gap-2 font-bold shadow-lg shadow-primary/20" 
          onClick={handleSave}
          disabled={isSaving}
        >
          {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Update Shop
        </Button>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="italic">Shop Identity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="font-bold">Business Name</Label>
                <div className="relative">
                  <Store className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="name" 
                    value={shop.name} 
                    onChange={(e) => setShop({...shop, name: e.target.value})}
                    className="pl-10 font-extrabold text-xl"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="font-bold">About Business</Label>
                <Textarea 
                  id="description" 
                  rows={4}
                  value={shop.description || ""} 
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setShop({...shop, description: e.target.value})}
                  className="font-medium"
                />
              </div>


              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-2xl border-2">
                <div className="space-y-0.5">
                  <Label className="text-lg font-extrabold italic">Shop Open Status</Label>
                  <p className="text-sm text-muted-foreground">Toggle this if you are temporarily closed or away.</p>
                </div>
                <Switch 
                  checked={shop.isOpen} 
                  onCheckedChange={(checked: boolean) => setShop({...shop, isOpen: checked})} 
                />

              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-primary/20">
            <CardHeader>
              <CardTitle className="italic">Contact & Location</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="location" className="font-bold">Primary Location</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="location" 
                    value={shop.location} 
                    onChange={(e) => setShop({...shop, location: e.target.value})}
                    className="pl-10 font-medium"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact" className="font-bold">Contact Info / Phone</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="contact" 
                    value={shop.contactInfo} 
                    onChange={(e) => setShop({...shop, contactInfo: e.target.value})}
                    className="pl-10 font-medium"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          <Card className="border-2 overflow-hidden">
            <CardHeader>
              <CardTitle className="italic">Branding</CardTitle>
              <CardDescription>Shop cover photo for the marketplace.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="aspect-video rounded-2xl bg-muted flex items-center justify-center relative overflow-hidden border-2 shadow-inner group">
                {shop.image ? (
                  <img src={shop.image} alt={shop.name} className="absolute inset-0 w-full h-full object-cover" />
                ) : (
                  <ImageIcon className="h-12 w-12 text-muted-foreground" />
                )}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <Button variant="secondary" size="sm" className="font-bold">Update Cover</Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="image" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Cover Image URL</Label>
                <Input 
                  id="image" 
                  value={shop.image || ""} 
                  onChange={(e) => setShop({...shop, image: e.target.value})}
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
