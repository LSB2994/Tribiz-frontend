"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bookmark, ShoppingBag, Store, Calendar, Trash2, ExternalLink } from "lucide-react";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function BookmarksPage() {
  const [activeTab, setActiveTab] = useState("all");

  const mockBookmarks = [
    { id: 1, type: "product", name: "Premium Coffee Beans", shop: "Central Coffee", price: 15.99 },
    { id: 2, type: "shop", name: "Flower Garden", location: "Downtown", status: "Open" },
    { id: 3, type: "event", name: "Community Music Fest", date: "2024-03-25", location: "City Park" },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Your Bookmarks</h1>
          <p className="text-muted-foreground mt-2">Manage all your saved products, shops, and events.</p>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4 h-12">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="product">Products</TabsTrigger>
          <TabsTrigger value="shop">Shops</TabsTrigger>
          <TabsTrigger value="event">Events</TabsTrigger>
        </TabsList>

        <div className="mt-8 space-y-4">
          {mockBookmarks.length > 0 ? (
            mockBookmarks.map((item) => (
              <Card key={`${item.type}-${item.id}`} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6 flex items-center gap-6">
                  <div className="h-16 w-16 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    {item.type === "product" && <ShoppingBag className="h-8 w-8" />}
                    {item.type === "shop" && <Store className="h-8 w-8" />}
                    {item.type === "event" && <Calendar className="h-8 w-8" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="secondary" className="capitalize text-[10px]">{item.type}</Badge>
                      <h3 className="font-bold text-lg truncate">{item.name}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground truncate italic">
                      {item.type === "product" && `From ${item.shop}`}
                      {item.type === "shop" && item.location}
                      {item.type === "event" && `${item.date} at ${item.location}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10">
                      <Trash2 className="h-5 w-5" />
                    </Button>
                    <Button size="sm" className="gap-2" asChild>
                      <Link href={item.type === "event" ? `/events/${item.id}` : `/${item.type}s`}>
                        View <ExternalLink className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="py-20 text-center space-y-4 border-2 border-dashed rounded-3xl">
              <Bookmark className="h-12 w-12 mx-auto text-muted-foreground opacity-20" />
              <p className="text-xl font-semibold">You haven&apos;t bookmarked anything yet.</p>
              <Button asChild>
                <Link href="/">Start Exploring</Link>
              </Button>
            </div>
          )}
        </div>
      </Tabs>
    </div>
  );
}
