"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/auth-context";
import { api } from "@/lib/api";
import { Shop } from "@/types";
import {
  Users,
  Store,
  ShieldCheck,
  AlertTriangle,
  Search,
  CheckCircle2,
  XCircle,
  Loader2,
  RefreshCcw,
  ExternalLink,
  Crown,
  UserCog,
  Briefcase,
  Trash2,
  MoreHorizontal,
  TrendingUp,
  Activity,
  Eye,
  Ban,
  Unlock,
  Building2,
  PieChart,
  BarChart3,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

type User = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  status: string;
  roles: string[];
  location?: string;
  dateOfBirth?: string;
};

type TabValue = "overview" | "users" | "sellers" | "providers" | "shops" | "verifications";

export default function AdminDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabValue>("overview");
  const [stats, setStats] = useState<any>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [sellers, setSellers] = useState<User[]>([]);
  const [providers, setProviders] = useState<User[]>([]);
  const [allShops, setAllShops] = useState<Shop[]>([]);
  const [pendingShops, setPendingShops] = useState<Shop[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);

  const fetchData = async () => {
    setIsRefreshing(true);
    setAuthError(null);
    try {
      const [statsData, usersData, sellersData, providersData, shopsData, pendingData] =
        await Promise.all([
          api.admin.getStats(),
          api.admin.getUsers(),
          api.admin.getSellers(),
          api.admin.getServiceProviders(),
          api.admin.getAllShops(),
          api.admin.getPendingShops(),
        ]);
      setStats(statsData);
      setAllUsers(usersData);
      setSellers(sellersData);
      setProviders(providersData);
      setAllShops(shopsData);
      setPendingShops(pendingData);
    } catch (error: any) {
      console.error("Error fetching admin data:", error);
      if (error.message?.includes("401")) {
        setAuthError("You are not authorized to access the admin panel. Please log in as an administrator.");
      }
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateUserStatus = async (userId: number, status: string) => {
    try {
      await api.admin.updateUserStatus(userId, status);
      await fetchData();
    } catch (error) {
      console.error("Error updating user status:", error);
    }
  };

  const handleUpdateShopStatus = async (shopId: number, status: "APPROVED" | "REJECTED") => {
    try {
      await api.admin.updateShopStatus(shopId, status);
      await fetchData();
    } catch (error) {
      console.error("Error updating shop status:", error);
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) return;
    try {
      await api.admin.deleteUser(userId);
      await fetchData();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleDeleteShop = async (shopId: number) => {
    if (!confirm("Are you sure you want to delete this shop? This action cannot be undone.")) return;
    try {
      await api.admin.deleteShop(shopId);
      await fetchData();
    } catch (error) {
      console.error("Error deleting shop:", error);
    }
  };

  const getRoleBadge = (roles: string[]) => {
    if (roles?.includes("ADMIN")) return <Badge className="bg-purple-500"><Crown className="h-3 w-3 mr-1" /> Admin</Badge>;
    if (roles?.includes("SELLER")) return <Badge className="bg-blue-500"><Store className="h-3 w-3 mr-1" /> Seller</Badge>;
    if (roles?.includes("SERVICE_PROVIDER")) return <Badge className="bg-orange-500"><Briefcase className="h-3 w-3 mr-1" /> Provider</Badge>;
    return <Badge variant="outline"><UserCog className="h-3 w-3 mr-1" /> Customer</Badge>;
  };

  const filterData = <T extends { name?: string; firstName?: string; lastName?: string; email?: string }>(
    data: T[]
  ) => {
    if (!searchQuery) return data;
    const query = searchQuery.toLowerCase();
    return data.filter((item) =>
      item.name?.toLowerCase().includes(query) ||
      item.firstName?.toLowerCase().includes(query) ||
      item.lastName?.toLowerCase().includes(query) ||
      item.email?.toLowerCase().includes(query)
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-40">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  // Show auth error if user is not authorized
  if (authError) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4">
        <div className="h-20 w-20 rounded-full bg-destructive/10 flex items-center justify-center mb-6">
          <ShieldCheck className="h-10 w-10 text-destructive" />
        </div>
        <h2 className="text-2xl font-black mb-2">Access Denied</h2>
        <p className="text-muted-foreground text-center max-w-md mb-6">{authError}</p>
        <div className="flex gap-3">
          <Button onClick={() => window.location.href = "/login"}>
            Go to Login
          </Button>
          <Button variant="outline" onClick={fetchData}>
            <RefreshCcw className="h-4 w-4 mr-2" /> Retry
          </Button>
        </div>
      </div>
    );
  }

  // Show auth error if user is not authorized
  if (authError) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4">
        <div className="h-20 w-20 rounded-full bg-destructive/10 flex items-center justify-center mb-6">
          <ShieldCheck className="h-10 w-10 text-destructive" />
        </div>
        <h2 className="text-2xl font-black mb-2">Access Denied</h2>
        <p className="text-muted-foreground text-center max-w-md mb-6">{authError}</p>
        <div className="flex gap-3">
          <Button onClick={() => window.location.href = "/login"}>
            Go to Login
          </Button>
          <Button variant="outline" onClick={fetchData}>
            <RefreshCcw className="h-4 w-4 mr-2" /> Retry
          </Button>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Users",
      value: stats?.totalUsers || "0",
      icon: Users,
      trend: `${stats?.activeUsers || 0} active`,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Total Shops",
      value: stats?.totalShops || "0",
      icon: Store,
      trend: `${allShops.filter((s) => s.status === "APPROVED").length} approved`,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      title: "Pending Verifications",
      value: stats?.pendingShops || "0",
      icon: ShieldCheck,
      trend: stats?.pendingShops > 0 ? "Action required" : "All clear",
      color: stats?.pendingShops > 0 ? "text-orange-500" : "text-green-500",
      bgColor: stats?.pendingShops > 0 ? "bg-orange-500/10" : "bg-green-500/10",
    },
    {
      title: "Sellers & Providers",
      value: sellers.length + providers.length,
      icon: Briefcase,
      trend: `${sellers.length} sellers, ${providers.length} providers`,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Professional Welcome Header */}
      <div className="bg-gradient-to-r from-primary/5 via-primary/10 to-purple-500/5 rounded-2xl p-8 border border-primary/10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-6">
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center shadow-lg">
              <ShieldCheck className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                Admin Control Center
              </h1>
              <p className="text-slate-600 dark:text-slate-300 mt-2 font-medium">
                Global system overview and resource management. Monitor platform health, user activity, and business operations.
              </p>
              <div className="flex items-center gap-4 mt-4">
                <Badge className="bg-green-500/10 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                  System Online
                </Badge>
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  Last updated: {new Date().toLocaleTimeString()}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="lg"
              className="rounded-xl shadow-sm border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800"
              onClick={fetchData}
              disabled={isRefreshing}
            >
              <RefreshCcw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
              Refresh Data
            </Button>
          </div>
        </div>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TabValue)} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 gap-1">
          <TabsTrigger value="overview" className="font-bold">
            <PieChart className="h-4 w-4 mr-2" /> Overview
          </TabsTrigger>
          <TabsTrigger value="users" className="font-bold">
            <Users className="h-4 w-4 mr-2" /> All Users
          </TabsTrigger>
          <TabsTrigger value="sellers" className="font-bold">
            <Store className="h-4 w-4 mr-2" /> Sellers
          </TabsTrigger>
          <TabsTrigger value="providers" className="font-bold">
            <Briefcase className="h-4 w-4 mr-2" /> Providers
          </TabsTrigger>
          <TabsTrigger value="shops" className="font-bold">
            <Building2 className="h-4 w-4 mr-2" /> All Shops
          </TabsTrigger>
          <TabsTrigger value="verifications" className="font-bold">
            <ShieldCheck className="h-4 w-4 mr-2" />
            Verifications
            {pendingShops.length > 0 && (
              <Badge variant="destructive" className="ml-2 h-5 w-5 p-0 flex items-center justify-center text-[10px]">
                {pendingShops.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-8">
          {/* Enhanced Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {statCards.map((stat, i) => (
              <Card key={i} className="group relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white dark:bg-slate-800">
                <div className="absolute inset-0 bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 opacity-50"></div>
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-primary/10 to-transparent rounded-bl-3xl"></div>
                <CardHeader className="relative flex flex-row items-center justify-between pb-3 space-y-0">
                  <CardTitle className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                    {stat.title}
                  </CardTitle>
                  <div className={`p-3 rounded-2xl ${stat.bgColor} shadow-sm`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent className="relative">
                  <div className="text-4xl font-black text-slate-900 dark:text-white mb-2">
                    {stat.value}
                  </div>
                  <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-[0.15em] leading-tight">
                    {stat.trend}
                  </p>
                </CardContent>
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Card>
            ))}
          </div>

          {/* Enhanced Activity Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Platform Activity Card */}
            <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-500/10 to-transparent rounded-bl-full"></div>
              <CardHeader className="relative">
                <CardTitle className="text-2xl font-black flex items-center gap-3 text-slate-900 dark:text-white">
                  <div className="p-2 rounded-xl bg-blue-500/20">
                    <Activity className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  Platform Activity
                </CardTitle>
                <CardDescription className="font-semibold text-slate-600 dark:text-slate-300 text-base">
                  Real-time system statistics and user engagement metrics.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-xl bg-white/60 dark:bg-slate-800/60 border border-blue-100 dark:border-blue-800">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-blue-500/20">
                      <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="font-bold text-lg text-slate-900 dark:text-white">Total Customers</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {allUsers.filter((u) => !u.roles?.includes("SELLER") && !u.roles?.includes("SERVICE_PROVIDER")).length} regular users
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-white/80 dark:bg-slate-700/80 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-700">
                    {allUsers.length} total
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-white/60 dark:bg-slate-800/60 border border-green-100 dark:border-green-800">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-green-500/20">
                      <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="font-bold text-lg text-slate-900 dark:text-white">Approved Shops</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {allShops.filter((s) => s.status === "APPROVED").length} active businesses
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-green-500/10 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800">
                    {Math.round((allShops.filter((s) => s.status === "APPROVED").length / (allShops.length || 1)) * 100)}%
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-white/60 dark:bg-slate-800/60 border border-orange-100 dark:border-orange-800">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-orange-500/20">
                      <AlertTriangle className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div>
                      <p className="font-bold text-lg text-slate-900 dark:text-white">Pending Approvals</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {pendingShops.length} shops awaiting verification
                      </p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant={pendingShops.length > 0 ? "default" : "outline"}
                    className="rounded-lg shadow-sm"
                    onClick={() => setActiveTab("verifications")}
                  >
                    Review Now
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Management Card */}
            <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/50 dark:to-pink-950/50">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-purple-500/10 to-transparent rounded-bl-full"></div>
              <CardHeader className="relative">
                <CardTitle className="text-2xl font-black flex items-center gap-3 text-slate-900 dark:text-white">
                  <div className="p-2 rounded-xl bg-purple-500/20">
                    <BarChart3 className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  Quick Management
                </CardTitle>
                <CardDescription className="font-semibold text-slate-600 dark:text-slate-300 text-base">
                  Jump to specific management sections for efficient administration.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  className="h-auto py-6 flex flex-col items-center gap-3 rounded-xl border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 hover:shadow-md transition-all duration-200 group"
                  onClick={() => setActiveTab("users")}
                >
                  <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-700 group-hover:bg-blue-500/20 transition-colors">
                    <Users className="h-6 w-6 text-slate-600 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                  </div>
                  <div className="text-center">
                    <span className="font-bold text-sm">All Users</span>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{allUsers.length} users</p>
                  </div>
                </Button>

                <Button
                  variant="outline"
                  className="h-auto py-6 flex flex-col items-center gap-3 rounded-xl border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 hover:shadow-md transition-all duration-200 group"
                  onClick={() => setActiveTab("sellers")}
                >
                  <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-700 group-hover:bg-green-500/20 transition-colors">
                    <Store className="h-6 w-6 text-slate-600 dark:text-slate-300 group-hover:text-green-600 dark:group-hover:text-green-400" />
                  </div>
                  <div className="text-center">
                    <span className="font-bold text-sm">Sellers</span>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{sellers.length} sellers</p>
                  </div>
                </Button>

                <Button
                  variant="outline"
                  className="h-auto py-6 flex flex-col items-center gap-3 rounded-xl border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 hover:shadow-md transition-all duration-200 group"
                  onClick={() => setActiveTab("providers")}
                >
                  <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-700 group-hover:bg-orange-500/20 transition-colors">
                    <Briefcase className="h-6 w-6 text-slate-600 dark:text-slate-300 group-hover:text-orange-600 dark:group-hover:text-orange-400" />
                  </div>
                  <div className="text-center">
                    <span className="font-bold text-sm">Providers</span>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{providers.length} providers</p>
                  </div>
                </Button>

                <Button
                  variant="outline"
                  className="h-auto py-6 flex flex-col items-center gap-3 rounded-xl border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 hover:shadow-md transition-all duration-200 group"
                  onClick={() => setActiveTab("shops")}
                >
                  <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-700 group-hover:bg-purple-500/20 transition-colors">
                    <Building2 className="h-6 w-6 text-slate-600 dark:text-slate-300 group-hover:text-purple-600 dark:group-hover:text-purple-400" />
                  </div>
                  <div className="text-center">
                    <span className="font-bold text-sm">All Shops</span>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{allShops.length} shops</p>
                  </div>
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users">
          <ManagementTable
            title="All Users"
            description="Manage all platform users"
            data={filterData(allUsers)}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            columns={[
              { header: "User", accessor: (u: User) => `${u.firstName} ${u.lastName}` },
              { header: "Email", accessor: (u: User) => u.email },
              { header: "Role", accessor: (u: User) => getRoleBadge(u.roles) },
              { header: "Status", accessor: (u: User) => (
                <Badge variant={u.status === "ACTIVE" ? "default" : "secondary"}>
                  {u.status}
                </Badge>
              )},
            ]}
            actions={(u: User) => (
              <>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="icon" onClick={() => setSelectedUser(u)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle className="font-black">User Details</DialogTitle>
                      <DialogDescription>Detailed information about this user</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="flex items-center gap-4">
                        <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                          <Users className="h-8 w-8 text-primary" />
                        </div>
                        <div>
                          <p className="font-black text-lg">{u.firstName} {u.lastName}</p>
                          <p className="text-sm text-muted-foreground">@{u.username}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Email</p>
                          <p className="font-bold">{u.email}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Status</p>
                          <p className="font-bold">{u.status}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Role</p>
                          <div className="mt-1">{getRoleBadge(u.roles)}</div>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Location</p>
                          <p className="font-bold">{u.location || "N/A"}</p>
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        variant={u.status === "ACTIVE" ? "destructive" : "default"}
                        onClick={() => handleUpdateUserStatus(u.id, u.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE")}
                      >
                        {u.status === "ACTIVE" ? <Ban className="h-4 w-4 mr-2" /> : <Unlock className="h-4 w-4 mr-2" />}
                        {u.status === "ACTIVE" ? "Suspend User" : "Activate User"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleUpdateUserStatus(u.id, u.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE")}>
                      {u.status === "ACTIVE" ? <Ban className="h-4 w-4 mr-2" /> : <CheckCircle2 className="h-4 w-4 mr-2" />}
                      {u.status === "ACTIVE" ? "Suspend" : "Activate"}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() => handleDeleteUser(u.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}
          />
        </TabsContent>

        {/* Sellers Tab */}
        <TabsContent value="sellers">
          <ManagementTable
            title="Sellers Management"
            description={`Manage ${sellers.length} registered sellers on the platform`}
            data={filterData(sellers)}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            columns={[
              { header: "Seller", accessor: (u: User) => `${u.firstName} ${u.lastName}` },
              { header: "Email", accessor: (u: User) => u.email },
              { header: "Username", accessor: (u: User) => `@${u.username}` },
              { header: "Status", accessor: (u: User) => (
                <Badge variant={u.status === "ACTIVE" ? "default" : "secondary"}>
                  {u.status}
                </Badge>
              )},
            ]}
            actions={(u: User) => (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleUpdateUserStatus(u.id, u.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE")}>
                    {u.status === "ACTIVE" ? <Ban className="h-4 w-4 mr-2" /> : <CheckCircle2 className="h-4 w-4 mr-2" />}
                    {u.status === "ACTIVE" ? "Suspend" : "Activate"}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-destructive"
                    onClick={() => handleDeleteUser(u.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" /> Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          />
        </TabsContent>

        {/* Providers Tab */}
        <TabsContent value="providers">
          <ManagementTable
            title="Service Providers Management"
            description={`Manage ${providers.length} registered service providers`}
            data={filterData(providers)}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            columns={[
              { header: "Provider", accessor: (u: User) => `${u.firstName} ${u.lastName}` },
              { header: "Email", accessor: (u: User) => u.email },
              { header: "Username", accessor: (u: User) => `@${u.username}` },
              { header: "Status", accessor: (u: User) => (
                <Badge variant={u.status === "ACTIVE" ? "default" : "secondary"}>
                  {u.status}
                </Badge>
              )},
            ]}
            actions={(u: User) => (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleUpdateUserStatus(u.id, u.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE")}>
                    {u.status === "ACTIVE" ? <Ban className="h-4 w-4 mr-2" /> : <CheckCircle2 className="h-4 w-4 mr-2" />}
                    {u.status === "ACTIVE" ? "Suspend" : "Activate"}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-destructive"
                    onClick={() => handleDeleteUser(u.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" /> Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          />
        </TabsContent>

        {/* Shops Tab */}
        <TabsContent value="shops">
          <ManagementTable
            title="All Shops"
            description={`Manage ${allShops.length} shops on the platform`}
            data={filterData(allShops)}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            columns={[
              { header: "Shop Name", accessor: (s: Shop) => s.name },
              { header: "Location", accessor: (s: Shop) => (
                <span className="flex items-center gap-1 text-muted-foreground">
                  <MapPin className="h-3 w-3" /> {s.location || "N/A"}
                </span>
              )},
              { header: "Owner", accessor: (s: Shop) => s.owner?.username || "Unknown" },
              { header: "Status", accessor: (s: Shop) => (
                <Badge
                  variant={s.status === "APPROVED" ? "default" : s.status === "PENDING" ? "secondary" : "destructive"}
                >
                  {s.status}
                </Badge>
              )},
              { header: "Rating", accessor: (s: Shop) => (
                <span className="flex items-center gap-1">
                  <TrendingUp className="h-3 w-3 text-amber-500" />
                  {s.rating?.toFixed(1) || "0.0"}
                </span>
              )},
            ]}
            actions={(s: Shop) => (
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" asChild>
                  <Link href={`/shops/${s.id}`} target="_blank">
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {s.status === "PENDING" && (
                      <>
                        <DropdownMenuItem onClick={() => handleUpdateShopStatus(s.id, "APPROVED")}>
                          <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" /> Approve
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleUpdateShopStatus(s.id, "REJECTED")}>
                          <XCircle className="h-4 w-4 mr-2 text-red-500" /> Reject
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() => handleDeleteShop(s.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" /> Delete Shop
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          />
        </TabsContent>

        {/* Verifications Tab */}
        <TabsContent value="verifications">
          <Card className="border border-border bg-card overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between border-b border-border bg-card pb-6">
              <div>
                <CardTitle className="text-2xl font-black flex items-center gap-2">
                  <ShieldCheck className="h-6 w-6 text-primary" /> Verification Queue
                </CardTitle>
                <CardDescription className="font-bold text-muted-foreground mt-1">
                  Review business registration requests for platform approval.
                </CardDescription>
              </div>
              <Badge variant="outline" className="px-3 py-1 font-black">
                {pendingShops.length} Requests
              </Badge>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-b border-border bg-muted/20">
                    <TableHead className="font-black text-muted-foreground pl-6">Business Name</TableHead>
                    <TableHead className="font-black text-muted-foreground">Contact Info</TableHead>
                    <TableHead className="font-black text-muted-foreground">Location</TableHead>
                    <TableHead className="font-black text-muted-foreground">Status</TableHead>
                    <TableHead className="text-right font-black text-muted-foreground pr-6">Approval Flow</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingShops.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-20 text-muted-foreground font-bold italic">
                        <div className="flex flex-col items-center gap-4">
                          <CheckCircle2 className="h-16 w-16 text-green-500/50" />
                          <p>Great job! The verification queue is empty.</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    pendingShops.map((shop) => (
                      <TableRow key={shop.id} className="group hover:bg-accent transition-colors border-b border-border last:border-0">
                        <TableCell className="font-black text-primary pl-6 py-4">
                          <div className="flex flex-col">
                            <span>{shop.name}</span>
                            <span className="text-[10px] font-bold text-muted-foreground italic uppercase">
                              ID: {shop.id}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="font-bold">{shop.contactInfo}</TableCell>
                        <TableCell className="font-bold">
                          <div className="flex items-center gap-1.5 opacity-70">
                            <MapPin className="h-3 w-3" />
                            {shop.location}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className="font-bold text-[10px] border-orange-500/20 text-orange-500 bg-orange-500/5"
                          >
                            {shop.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right pr-6">
                          <div className="flex justify-end gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-9 gap-2 text-green-500 font-black rounded-xl"
                              onClick={() => handleUpdateShopStatus(shop.id, "APPROVED")}
                            >
                              <CheckCircle2 className="h-4 w-4" /> Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-9 gap-2 text-destructive font-black rounded-xl"
                              onClick={() => handleUpdateShopStatus(shop.id, "REJECTED")}
                            >
                              <XCircle className="h-4 w-4" /> Reject
                            </Button>
                            <Button size="icon" variant="ghost" className="h-9 w-9 rounded-xl" asChild>
                              <Link href={`/shops/${shop.id}`} target="_blank">
                                <ExternalLink className="h-4 w-4" />
                              </Link>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Reusable Management Table Component
function ManagementTable<T extends { id: number }>({
  title,
  description,
  data,
  searchQuery,
  setSearchQuery,
  columns,
  actions,
}: {
  title: string;
  description: string;
  data: T[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  columns: { header: string; accessor: (item: T) => React.ReactNode }[];
  actions: (item: T) => React.ReactNode;
}) {
  return (
    <Card className="border border-border bg-card overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between border-b border-border bg-card pb-6">
        <div>
          <CardTitle className="text-2xl font-black flex items-center gap-2">{title}</CardTitle>
          <CardDescription className="font-bold text-muted-foreground mt-1">{description}</CardDescription>
        </div>
        <div className="relative w-64 lg:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            className="w-full pl-10 h-10 rounded-lg border border-border bg-muted/20 px-3 py-2 text-sm font-bold placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-b border-border bg-muted/20">
              {columns.map((col, i) => (
                <TableHead key={i} className="font-black text-muted-foreground pl-6">
                  {col.header}
                </TableHead>
              ))}
              <TableHead className="text-right font-black text-muted-foreground pr-6">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length + 1} className="text-center py-20 text-muted-foreground font-bold italic">
                  {searchQuery ? "No results found for your search." : "No items to display."}
                </TableCell>
              </TableRow>
            ) : (
              data.map((item) => (
                <TableRow key={item.id} className="group hover:bg-accent transition-colors border-b border-border last:border-0">
                  {columns.map((col, i) => (
                    <TableCell key={i} className="font-bold pl-6 py-4">
                      {col.accessor(item)}
                    </TableCell>
                  ))}
                  <TableCell className="text-right pr-6">
                    <div className="flex justify-end items-center gap-2">{actions(item)}</div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

// Simple MapPin icon component
function MapPin(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}
