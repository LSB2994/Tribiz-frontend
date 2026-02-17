"use client";

import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Clock, 
  Calendar, 
  Plus, 
  Trash2, 
  Save,
  CheckCircle2,
  AlertTriangle
} from "lucide-react";
import { useState } from "react";

export default function ProviderSchedulePage() {
  const { user } = useAuth();
  
  const [workingHours, setWorkingHours] = useState([
    { day: "Monday", open: "08:00", close: "17:00", enabled: true },
    { day: "Tuesday", open: "08:00", close: "17:00", enabled: true },
    { day: "Wednesday", open: "08:00", close: "17:00", enabled: true },
    { day: "Thursday", open: "08:00", close: "17:00", enabled: true },
    { day: "Friday", open: "08:00", close: "17:00", enabled: true },
    { day: "Saturday", open: "09:00", close: "14:00", enabled: true },
    { day: "Sunday", open: "08:00", close: "17:00", enabled: false },
  ]);

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight italic">Working Hours</h1>
          <p className="text-muted-foreground mt-1 font-medium italic">Set your availability and lunch breaks.</p>
        </div>
        <Button className="gap-2 font-bold shadow-lg shadow-primary/20" size="lg">
          <Save className="h-5 w-5" /> Save Changes
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {workingHours.map((wh, i) => (
            <Card key={wh.day} className={`border-2 transition-all ${wh.enabled ? 'bg-card' : 'bg-muted/50 border-dashed opacity-70'}`}>
              <CardContent className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className={`h-12 w-12 rounded-2xl flex items-center justify-center font-black ${wh.enabled ? 'bg-primary text-primary-foreground' : 'bg-muted-foreground/20 text-muted-foreground'}`}>
                    {wh.day[0]}
                  </div>
                  <div>
                    <h3 className="text-xl font-black">{wh.day}</h3>
                    <p className="text-xs font-bold text-muted-foreground italic uppercase tracking-widest">
                      {wh.enabled ? `${wh.open} — ${wh.close}` : "Closed / Day Off"}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  {wh.enabled ? (
                    <div className="flex items-center gap-3">
                      <input type="time" defaultValue={wh.open} className="h-10 px-3 rounded-xl border-2 font-bold bg-muted/20" />
                      <span className="font-bold">—</span>
                      <input type="time" defaultValue={wh.close} className="h-10 px-3 rounded-xl border-2 font-bold bg-muted/20" />
                      <Button variant="ghost" size="icon" className="text-destructive h-10 w-10 rounded-xl" onClick={() => {
                        const newHours = [...workingHours];
                        newHours[i].enabled = false;
                        setWorkingHours(newHours);
                      }}>
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </div>
                  ) : (
                    <Button variant="outline" className="font-bold gap-2 border-2 border-primary/20 text-primary" onClick={() => {
                      const newHours = [...workingHours];
                      newHours[i].enabled = true;
                      setWorkingHours(newHours);
                    }}>
                      <Plus className="h-4 w-4" /> Add Hours
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="space-y-8">
          <Card className="border-2 bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="text-xl font-bold flex items-center gap-2 italic">
                <Clock className="h-5 w-5 text-primary" /> Lunch Breaks
              </CardTitle>
              <CardDescription className="font-medium">Define non-bookable time slots each day.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm font-medium">
              <div className="flex items-center justify-between p-3 bg-background border rounded-2xl">
                <span className="font-bold italic">Standard Lunch</span>
                <Badge variant="secondary" className="font-bold">12:00 - 13:00</Badge>
              </div>
              <Button variant="outline" className="w-full font-bold border-2" size="sm">Add Break Slot</Button>
            </CardContent>
          </Card>

          <Card className="border-2 overflow-hidden relative group">
            <CardHeader className="relative z-10">
              <CardTitle className="text-xl font-bold italic">Vacation Mode</CardTitle>
            </CardHeader>
            <CardContent className="relative z-10 space-y-4">
               <div className="flex items-center gap-3 text-sm font-medium">
                <AlertTriangle className="h-5 w-5 text-orange-500 shrink-0" />
                <p>Heading out? Enable vacation mode to pause all new bookings.</p>
               </div>
               <Button variant="secondary" className="w-full font-bold">Manage Time Off</Button>
            </CardContent>
            <Calendar className="absolute -right-8 -bottom-8 h-32 w-32 opacity-5 rotate-12 group-hover:scale-110 transition-transform" />
          </Card>
        </div>
      </div>
    </div>
  );
}
