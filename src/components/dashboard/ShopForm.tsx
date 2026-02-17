"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Shop } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Store } from "lucide-react";

const shopSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  location: z.string().min(2, "Location must be at least 2 characters"),
  contactInfo: z.string().min(5, "Contact info must be at least 5 characters"),
});

type ShopFormValues = z.infer<typeof shopSchema>;

interface ShopFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: ShopFormValues) => Promise<void>;
  initialData?: Shop | null;
}

export function ShopForm({ open, onOpenChange, onSubmit, initialData }: ShopFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ShopFormValues>({
    resolver: zodResolver(shopSchema),
    defaultValues: {
      name: "",
      location: "",
      contactInfo: "",
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        name: initialData.name,
        location: initialData.location,
        contactInfo: initialData.contactInfo,
      });
    } else {
      form.reset({
        name: "",
        location: "",
        contactInfo: "",
      });
    }
  }, [initialData, form, open]);

  const handleSubmit = async (values: ShopFormValues) => {
    setIsSubmitting(true);
    try {
      await onSubmit(values);
      onOpenChange(false);
      form.reset();
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] border-2">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2 italic">
            <Store className="h-6 w-6 text-primary" />
            {initialData ? "Edit Shop" : "New Shop"}
          </DialogTitle>
          <DialogDescription className="font-medium italic">
            {initialData 
              ? "Update your shop details below." 
              : "Enter details for your new business outlet."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 pt-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">Shop Name</FormLabel>
                  <FormControl>
                    <Input placeholder="My Local Shop" {...field} className="font-medium" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">Location</FormLabel>
                  <FormControl>
                    <Input placeholder="City, Area" {...field} className="font-medium" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contactInfo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">Contact Info</FormLabel>
                  <FormControl>
                    <Input placeholder="Phone, Email, etc." {...field} className="font-medium" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="font-bold">
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="font-bold shadow-lg shadow-primary/20">
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  initialData ? "Save Changes" : "Create Shop"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
