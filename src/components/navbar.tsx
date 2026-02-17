"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/auth-context";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Store, 
  User as UserIcon, 
  LogOut, 
  History as HistoryIcon, 
  Menu, 
  X, 
  Bell, 
  Bookmark, 
  Tag, 
  Calendar, 
  ShoppingCart,
  LayoutDashboard
} from "lucide-react";
import { useCart } from "@/context/cart-context";
import { Search, Heart, HelpCircle, Truck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

const productCategories = [
  { name: "Fashion", href: "/products?category=fashion", description: "Clothing, shoes, and accessories for all." },
  { name: "Electronics", href: "/products?category=electronics", description: "The latest gadgets, smartphones, and tech." },
  { name: "Home Living", href: "/products?category=home", description: "Furniture, decor, and kitchen essentials." },
  { name: "Beauty", href: "/products?category=beauty", description: "Skincare, makeup, and wellness products." },
];

const serviceCategories = [
  { name: "Professional", href: "/services?category=professional", description: "Legal, accounting, and business consulting." },
  { name: "Technical", href: "/services?category=technical", description: "IT support, web development, and repairs." },
  { name: "Personal", href: "/services?category=personal", description: "Fitness, spa, tutoring, and more." },
];

export function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { totalItems } = useCart();

  const handleLogout = async () => {
    await logout();
    window.location.href = "/";
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b border-border">
      {/* Slim Utility Top Bar */}
      <div className="w-full bg-foreground text-background h-7 hidden md:block">
        <div className="container h-full flex items-center justify-end space-x-6 px-4 lg:px-12">
          {user && (user.roles.includes("SELLER") || user.roles.includes("SERVICE_PROVIDER") || user.roles.includes("ROLE_SELLER") || user.roles.includes("ROLE_SERVICE_PROVIDER")) && (
            <Link href="/dashboard" className="text-[9px] font-black uppercase tracking-[0.2em] text-background/80 hover:text-background transition-colors flex items-center gap-1.5 border-r border-background/10 pr-6 mr-6">
              <LayoutDashboard className="h-2.5 w-2.5" /> business portal
            </Link>
          )}

          <Link href="/help" className="text-[9px] font-black uppercase tracking-[0.2em] text-background/60 hover:text-background transition-colors flex items-center gap-1.5">
            <HelpCircle className="h-2.5 w-2.5" /> help
          </Link>
          <Link href="/orders" className="text-[9px] font-black uppercase tracking-[0.2em] text-background/60 hover:text-background transition-colors flex items-center gap-1.5">
            <Truck className="h-2.5 w-2.5" /> orders
          </Link>
          {!user ? (
            <>
              <Link href="/login" className="text-[9px] font-black uppercase tracking-[0.2em] text-background/60 hover:text-background transition-colors">sign in</Link>
              <Link href="/register" className="text-[9px] font-black uppercase tracking-[0.2em] text-primary transition-colors">join triBiz</Link>
            </>
          ) : (
             <span className="text-[9px] font-black uppercase tracking-[0.2em] text-background/50 lowercase">hi, <span className="text-background">{user.username}</span></span>
          )}
        </div>
      </div>

      {/* Main Header */}
      <div className="w-full">
        <div className="container mx-auto flex h-20 items-center px-4 lg:px-12">
          {/* Logo Side */}
          <div className="flex flex-1 items-center justify-start min-w-[150px]">
            <Link href="/" className="flex items-center space-x-2 group">
               <div className="flex flex-col gap-[3px]">
                 <div className="h-[4px] w-6 bg-foreground group-hover:w-10 transition-all duration-500"></div>
                 <div className="h-[4px] w-10 bg-foreground group-hover:w-6 transition-all duration-500"></div>
                 <div className="h-[4px] w-6 bg-foreground group-hover:translate-x-4 transition-all duration-500"></div>
               </div>
               <span className="text-3xl font-black tracking-tighter uppercase ml-2">triBiz</span>
            </Link>
          </div>

          {/* Center Navigation */}
          <div className="hidden lg:flex flex-[2] justify-center items-center h-full">
            <NavigationMenu>
              <NavigationMenuList className="gap-8">
                {/* Product with Dropdown */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent hover:bg-transparent focus:bg-transparent data-[state=open]:bg-transparent p-0 h-auto text-[11px] font-black uppercase tracking-[0.3em] text-black/40 data-[state=open]:text-black hover:text-black">
                    Product
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] bg-white border-none shadow-2xl">
                      {productCategories.map((item) => (
                        <li key={item.name}>
                          <NavigationMenuLink asChild>
                            <Link
                              href={item.href}
                              className="block select-none space-y-1 rounded-none p-3 leading-none no-underline outline-none transition-colors hover:bg-primary/5 hover:text-primary active:bg-primary/10"
                            >
                              <div className="text-[10px] font-black uppercase tracking-widest">{item.name}</div>
                              <p className="line-clamp-2 text-[10px] leading-snug text-muted-foreground font-medium uppercase tracking-wider">
                                {item.description}
                              </p>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                      ))}
                      <li className="md:col-span-2 pt-2 border-t mt-2">
                        <Link href="/products" className="text-[9px] font-black uppercase tracking-[0.3em] text-primary hover:underline px-3">
                          View All Products →
                        </Link>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* Service with Dropdown */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent hover:bg-transparent focus:bg-transparent data-[state=open]:bg-transparent p-0 h-auto text-[11px] font-black uppercase tracking-[0.3em] text-black/40 data-[state=open]:text-black hover:text-black">
                    Service
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] bg-white border-none shadow-2xl">
                      {serviceCategories.map((item) => (
                        <li key={item.name}>
                          <NavigationMenuLink asChild>
                            <Link
                              href={item.href}
                              className="block select-none space-y-1 rounded-none p-3 leading-none no-underline outline-none transition-colors hover:bg-primary/5 hover:text-primary active:bg-primary/10"
                            >
                              <div className="text-[10px] font-black uppercase tracking-widest">{item.name}</div>
                              <p className="line-clamp-2 text-[10px] leading-snug text-muted-foreground font-medium uppercase tracking-wider">
                                {item.description}
                              </p>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                      ))}
                      <li className="md:col-span-2 pt-2 border-t mt-2">
                        <Link href="/services" className="text-[9px] font-black uppercase tracking-[0.3em] text-primary hover:underline px-3">
                          Discover All Services →
                        </Link>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* Shop - Simple Link */}
                <NavigationMenuItem>
                  <NavigationMenuLink asChild active={pathname === "/shops"}>
                    <Link
                      href="/shops"
                      className={cn(
                        "text-[11px] font-black uppercase tracking-[0.3em] transition-all duration-300",
                        pathname === "/shops" ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      Shop
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>

                {/* Event - Simple Link */}
                <NavigationMenuItem>
                  <NavigationMenuLink asChild active={pathname === "/events"}>
                    <Link
                      href="/events"
                      className={cn(
                        "text-[11px] font-black uppercase tracking-[0.3em] transition-all duration-300",
                        pathname === "/events" ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      Event
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Action Side */}
          <div className="flex flex-1 items-center justify-end space-x-2 md:space-x-6 min-w-[200px]">
            {/* Minimal Search Bar */}
            <div className="hidden md:flex relative group w-40 lg:w-48">
              <Input 
                placeholder="SEARCH" 
                className="h-10 bg-transparent border-none border-b border-border rounded-none px-0 text-[10px] font-bold tracking-widest focus-visible:ring-0 focus-visible:border-foreground transition-all"
              />
              <Search className="absolute right-0 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-foreground transition-colors" />
            </div>

            <div className="flex items-center">
              <ThemeToggle />

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="hover:bg-transparent hover:text-primary transition-colors">
                    <UserIcon className="h-5 w-5 stroke-[2.5]" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 mt-4 rounded-none border-border shadow-2xl p-0 overflow-hidden">
                  {user ? (
                    <>
                      <div className="px-6 py-4 bg-foreground text-background">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-background/60 mb-1">Authenticated As</p>
                        <p className="text-sm font-black uppercase tracking-tight truncate">{user.username}</p>
                      </div>
                      <div className="p-2">
                        <DropdownMenuItem asChild>
                          <Link href="/profile" className="uppercase text-[10px] font-black tracking-widest p-3 cursor-pointer hover:bg-accent">My Profile</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/dashboard" className="uppercase text-[10px] font-black tracking-widest p-3 cursor-pointer text-primary hover:bg-accent">Business Dashboard</Link>
                        </DropdownMenuItem>
                        {user?.roles?.includes("ADMIN") && (
                          <DropdownMenuItem asChild>
                            <Link href="/admin/users" className="uppercase text-[10px] font-black tracking-widest p-3 cursor-pointer text-orange-600 hover:bg-orange-50">User Management</Link>
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator className="bg-border mx-2" />
                        <DropdownMenuItem onClick={handleLogout} className="uppercase text-[10px] font-black tracking-widest p-3 cursor-pointer text-destructive hover:bg-destructive/5">Logout Session</DropdownMenuItem>
                      </div>
                    </>
                  ) : (
                    <div className="p-2">
                      <DropdownMenuItem asChild>
                        <Link href="/login" className="uppercase text-[10px] font-black tracking-widest p-4 cursor-pointer hover:bg-accent text-center w-full block">Sign In</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/register" className="uppercase text-[10px] font-black tracking-widest p-4 cursor-pointer bg-foreground text-background hover:bg-foreground/90 text-center w-full block">Create Account</Link>
                      </DropdownMenuItem>
                    </div>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>

              <Link href="/bookmarks">
                <Button variant="ghost" size="icon" className="hover:bg-transparent hover:text-primary transition-colors">
                  <Heart className="h-5 w-5 stroke-[2.5]" />
                </Button>
              </Link>

              <Link href="/cart">
                <Button variant="ghost" size="icon" className="relative hover:bg-transparent hover:text-primary transition-colors">
                  <ShoppingCart className="h-5 w-5 stroke-[2.5]" />
                  {totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 h-4 w-4 bg-primary text-[8px] font-black text-white flex items-center justify-center rounded-full ring-2 ring-white">
                      {totalItems}
                    </span>
                  )}
                </Button>
              </Link>
              
              <Button variant="ghost" size="icon" className="lg:hidden ml-2">
                <Menu className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
