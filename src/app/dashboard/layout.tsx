"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/auth-context";
// import { ThemeToggle } from "@/components/theme-toggle";
import { 
  LayoutDashboard, 
  Store, 
  Package, 
  ShoppingBag, 
  Calendar, 
  Settings, 
  ArrowLeft,
  ChevronRight,
  TrendingUp,
  Scissors,
  Users,
  User,
  Bell,
  Search,
  Menu,
  X,
  Crown,
  Shield,
  Wrench
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

interface SidebarItem {
  title: string;
  href: string;
  icon: any;
  roles?: string[];
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const router = useRouter();

  const getRoleIcon = (roles: string[]) => {
    if (roles?.includes("ADMIN")) return Crown;
    if (roles?.includes("SELLER")) return Store;
    if (roles?.includes("SERVICE_PROVIDER")) return Wrench;
    return User;
  };

  const getRoleBadge = (roles: string[]) => {
    if (roles?.includes("ADMIN")) return <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0"><Crown className="h-3 w-3 mr-1" /> Admin</Badge>;
    if (roles?.includes("SELLER")) return <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0"><Store className="h-3 w-3 mr-1" /> Seller</Badge>;
    if (roles?.includes("SERVICE_PROVIDER")) return <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0"><Wrench className="h-3 w-3 mr-1" /> Provider</Badge>;
    return <Badge variant="outline"><User className="h-3 w-3 mr-1" /> Customer</Badge>;
  };

  const RoleIcon = user ? getRoleIcon(user.roles) : User;

  const allItems: SidebarItem[] = [
    { title: "Overview", href: "/dashboard", icon: LayoutDashboard },
    
    // Seller items
    { title: "My Shops", href: "/dashboard/seller/shops", icon: Store, roles: ["SELLER", "ROLE_SELLER"] },
    { title: "Products", href: "/dashboard/seller/products", icon: Package, roles: ["SELLER", "ROLE_SELLER"] },
    { title: "Orders", href: "/dashboard/seller/orders", icon: ShoppingBag, roles: ["SELLER", "ROLE_SELLER"] },
    
    // Provider items
    { title: "Services", href: "/dashboard/provider/services", icon: Scissors, roles: ["SERVICE_PROVIDER", "ROLE_SERVICE_PROVIDER", "ROLE_PROVIDER"] },
    { title: "Appointments", href: "/dashboard/provider/appointments", icon: Calendar, roles: ["SERVICE_PROVIDER", "ROLE_SERVICE_PROVIDER", "ROLE_PROVIDER"] },
    { title: "Schedule", href: "/dashboard/provider/schedule", icon: TrendingUp, roles: ["SERVICE_PROVIDER", "ROLE_SERVICE_PROVIDER", "ROLE_PROVIDER"] },
    
    // Admin items
    { title: "User Management", href: "/dashboard/admin/users", icon: Users, roles: ["ADMIN", "ROLE_ADMIN"] },
    { title: "Settings", href: "/dashboard/settings", icon: Settings },

  ];

  const filteredItems = allItems.filter(item => 
    !item.roles || item.roles.some(role => user?.roles.includes(role))
  );

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Professional Sidebar */}
      <aside className="w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 shadow-xl hidden md:flex flex-col">
        {/* Sidebar Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex flex-col gap-[3px]">
              <div className="h-[4px] w-6 bg-gradient-to-r from-primary to-primary/70 rounded-sm"></div>
              <div className="h-[4px] w-10 bg-gradient-to-r from-primary to-primary/70 rounded-sm"></div>
              <div className="h-[4px] w-6 bg-gradient-to-r from-primary to-primary/70 rounded-sm"></div>
            </div>
            <div>
              <h2 className="text-xl font-black tracking-tight">triBiz</h2>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Business Portal</p>
            </div>
          </div>
          
          {/* User Info Card */}
          {user && (
            <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl p-4 border border-primary/20">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 ring-2 ring-primary/20">
                  <AvatarImage src="" alt={user.username} />
                  <AvatarFallback className="bg-primary/10 text-primary font-bold">
                    <RoleIcon className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm truncate">{user.firstName} {user.lastName}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">@{user.username}</p>
                  <div className="mt-1">{getRoleBadge(user.roles)}</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex-1 p-4">
          <nav className="space-y-2">
            {filteredItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 group",
                    isActive 
                      ? "bg-primary text-white shadow-lg shadow-primary/25" 
                      : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                  )}
                >
                  <item.icon className={cn("h-5 w-5 transition-colors", isActive ? "text-white" : "text-slate-500 dark:text-slate-400 group-hover:text-primary")} />
                  {item.title}
                  {isActive && <ChevronRight className="h-4 w-4 ml-auto" />}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          <Button 
            variant="outline" 
            className="w-full justify-start gap-3 h-12 rounded-xl border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
            onClick={() => router.push('/')}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Marketplace
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Professional Header */}
        <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="px-6 md:px-8 py-4 flex items-center justify-between">
            {/* Left Side - Breadcrumbs/Title */}
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="md:hidden" onClick={() => {/* Toggle mobile menu */}}>
                <Menu className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                  {pathname === '/dashboard' ? 'Dashboard' : 
                   pathname.includes('/admin') ? 'Admin Control' :
                   pathname.includes('/seller') ? 'Seller Portal' : 
                   pathname.includes('/provider') ? 'Provider Portal' : 'Dashboard'}
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Welcome back, {user?.firstName || 'User'}
                </p>
              </div>
            </div>

            {/* Right Side - Actions */}
            <div className="flex items-center gap-3">
              {/* Search Bar */}
              <div className="hidden md:flex relative w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input 
                  placeholder="Search dashboard..." 
                  className="pl-10 h-10 rounded-xl border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-900"
                />
              </div>

              {/* Notifications */}
              <Button variant="ghost" size="icon" className="relative h-10 w-10 rounded-xl">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs font-bold flex items-center justify-center rounded-full">
                  3
                </span>
              </Button>

              {/* User Menu */}
              {user && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-10 px-3 rounded-xl gap-3 hover:bg-slate-100 dark:hover:bg-slate-800">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="" alt={user.username} />
                        <AvatarFallback className="bg-primary/10 text-primary font-bold text-sm">
                          {user.firstName?.[0]}{user.lastName?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="hidden md:flex flex-col items-start">
                        <span className="text-sm font-semibold">{user.firstName}</span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">{getRoleBadge(user.roles)}</span>
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 rounded-xl shadow-lg border-slate-200 dark:border-slate-700">
                    <DropdownMenuLabel className="font-semibold">My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="cursor-pointer">
                      <User className="h-4 w-4 mr-3" />
                      Profile Settings
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer">
                      <Shield className="h-4 w-4 mr-3" />
                      Account Security
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="cursor-pointer text-red-600 dark:text-red-400" onClick={logout}>
                      <ArrowLeft className="h-4 w-4 mr-3" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-6 md:p-8 max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
