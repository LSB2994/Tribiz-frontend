"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { EventItem, Comment } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/auth-context";
import { Separator } from "@/components/ui/separator";
import { 
  Calendar, 
  MapPin, 
  Bookmark, 
  MessageSquare, 
  Clock, 
  Share2, 
  ArrowLeft,
  Loader2,
  CalendarDays,
  Send,
  Store,
  Edit,
  Heart,
  Users
} from "lucide-react";
import Link from "next/link";
import { BrandIcon } from "@/components/brand-icon";

import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function EventDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const router = useRouter();
  const [event, setEvent] = useState<EventItem | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  useEffect(() => {
    async function fetchEventData() {
      try {
        const [eventData, commentsData] = await Promise.all([
          api.events.getById(Number(id)),
          api.events.getComments(Number(id))
        ]);
        setEvent(eventData);
        setComments(commentsData);
      } catch (error) {
        console.error("Error fetching event data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchEventData();
  }, [id]);

  const handleSubmitComment = async () => {
    if (!comment.trim() || !user) return;

    setIsSubmittingComment(true);
    try {
      const newComment = await api.events.addComment(Number(id), { content: comment });
      setComments(prev => [newComment, ...prev]);
      setComment("");
    } catch (error) {
      console.error("Error posting comment:", error);
    } finally {
      setIsSubmittingComment(false);
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
    return (
      <div className="text-center py-20 space-y-4">
        <h2 className="text-2xl font-bold">Event not found</h2>
        <Button variant="outline" asChild>
          <Link href="/events">Back to Events</Link>
        </Button>
      </div>
    );
  }

  const startDate = new Date(event.startDate);
  const endDate = new Date(event.endDate);

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      <Button variant="ghost" className="gap-2 -ml-2 text-muted-foreground hover:text-foreground" asChild>
        <Link href="/events">
          <ArrowLeft className="h-4 w-4" /> Back to Events
        </Link>
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="aspect-video rounded-3xl bg-muted flex items-center justify-center relative overflow-hidden border-2 shadow-inner group">
            {event.image ? (
              <img src={event.image} alt={event.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            ) : (
              <BrandIcon category="Event" size={80} className="text-primary/10" />
            )}
          </div>
          <section className="space-y-4">

            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="uppercase tracking-widest text-[10px] flex items-center gap-1">
                <BrandIcon category="Event" size={10} />
                Community
              </Badge>
              <Badge variant="outline" className="uppercase tracking-widest text-[10px]">Free Entrance</Badge>
            </div>

            <div className="flex justify-between items-start gap-4">
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">{event.title}</h1>
              {user && (
                <Button variant="outline" size="sm" className="gap-2 border-2 font-bold" asChild>
                  <Link href={`/dashboard/seller/events/${event.id}`}>
                    <Edit className="h-4 w-4" /> Edit Event
                  </Link>
                </Button>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-6 text-muted-foreground">
              <div className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5 text-primary" />
                <span className="font-medium text-foreground">
                  {startDate.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                <span className="font-medium text-foreground">
                  {startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                <span className="font-medium text-foreground">{event.location}</span>
              </div>
            </div>
          </section>

          <Separator />

          <section className="space-y-4">
            <h2 className="text-2xl font-bold italic">About this event</h2>
            <div className="prose prose-blue max-w-none text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {event.description}
              {"\n\n"}
              Don't miss out on this amazing opportunity to connect with members of your neighborhood and support local entrepreneurs! 
              There will be plenty of food, music, and great conversations.
            </div>
          </section>

          <Separator />

          <section className="space-y-6">
            <h2 className="text-2xl font-bold flex items-center gap-2 italic">
              <MessageSquare className="h-6 w-6 text-primary" /> 
              Comments ({comments.length})
            </h2>
            
            {user ? (
              <div className="flex gap-4">
                <Avatar>
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback>{user.firstName?.[0]}{user.lastName?.[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-4">
                  <div className="relative">
                    <Input 
                      placeholder="Share your thoughts about this event..." 
                      className="pr-12 h-12"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSubmitComment()}
                    />
                    <Button 
                      size="icon" 
                      className="absolute right-1 top-1 h-10 w-10" 
                      disabled={!comment.trim() || isSubmittingComment}
                      onClick={handleSubmitComment}
                    >
                      {isSubmittingComment ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 bg-muted/30 rounded-lg">
                <MessageSquare className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-muted-foreground mb-4">Join the conversation! Sign in to share your thoughts.</p>
                <Button asChild>
                  <Link href="/login">Sign In to Comment</Link>
                </Button>
              </div>
            )}

            <div className="space-y-6">
              {comments.length > 0 ? (
                comments.map((comment) => (
                  <div key={comment.id} className="flex gap-4 group">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={comment.authorAvatar || undefined} />
                      <AvatarFallback>{comment.authorName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-sm">{comment.authorName}</h4>
                        <span className="text-xs text-muted-foreground">
                          {new Date(comment.createdAt).toLocaleDateString()} at {new Date(comment.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground bg-accent/30 p-3 rounded-2xl rounded-tl-none leading-relaxed">
                        {comment.content}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                  <p className="text-muted-foreground">No comments yet. Be the first to share your thoughts!</p>
                </div>
              )}
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <Card className="border-2 shadow-xl sticky top-24">
            <CardHeader>
              <CardTitle className="text-xl">Event Participation</CardTitle>
              <CardDescription>Secure your spot or save for later.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full h-12 text-lg font-bold" size="lg">Join Event</Button>
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  variant={isBookmarked ? "default" : "outline"} 
                  className="gap-2" 
                  onClick={() => setIsBookmarked(!isBookmarked)}
                >
                  <Bookmark className={`h-4 w-4 ${isBookmarked ? "fill-current" : ""}`} /> 
                  {isBookmarked ? "Saved" : "Save"}
                </Button>
                <Button variant="outline" className="gap-2">
                  <Share2 className="h-4 w-4" /> Share
                </Button>
              </div>
            </CardContent>
            <CardFooter className="bg-muted/50 border-t py-4 text-xs text-center text-muted-foreground rounded-b-xl">
              Organized by TriBiz Partner Shop #123
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
