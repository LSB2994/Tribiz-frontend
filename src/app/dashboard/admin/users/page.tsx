"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/auth-context";
import { api } from "@/lib/api";
import { DataTable } from "@/components/dashboard/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Shield, 
  Mail, 
  MoreVertical,
  UserPlus,
  Lock,
  Unlock,
  Trash2,
  Loader2,
  AlertCircle
} from "lucide-react";

export default function AdminUsersPage() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionInProgress, setIsActionInProgress] = useState<number | null>(null);

  const fetchUsers = async () => {
    try {
      const data = await api.admin.getUsers();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleStatus = async (userId: number, currentStatus: string) => {
    const newStatus = currentStatus === "ACTIVE" ? "SUSPENDED" : "ACTIVE";
    setIsActionInProgress(userId);
    try {
      await api.admin.updateUserStatus(userId, newStatus);
      await fetchUsers();
    } catch (error) {
      console.error("Error updating user status:", error);
    } finally {
      setIsActionInProgress(null);
    }
  };

  const columns = [
    { 
      header: "User Identity", 
      accessorKey: "username",
      cell: (u: any) => (
        <div className="flex items-center gap-4 py-1">
          <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center font-black text-primary border-2 border-primary/20 shadow-sm">
            {u.username[0].toUpperCase()}
          </div>
          <div>
            <p className="font-extrabold text-base tracking-tight">{u.username}</p>
            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-bold italic uppercase tracking-wider">
              <Mail className="h-3 w-3" />
              {u.email}
            </div>
          </div>
        </div>
      )
    },
    { 
      header: "Platform Roles", 
      accessorKey: "roles",
      cell: (u: any) => (
        <div className="flex flex-wrap gap-1.5">
          {u.roles.map((role: string) => (
            <Badge key={role} variant="outline" className="text-[10px] font-black border-2 bg-muted/30 px-2 py-0.5 uppercase tracking-tighter">
              {role.replace('ROLE_', '')}
            </Badge>
          ))}
        </div>
      )
    },
    { 
      header: "Account State", 
      accessorKey: "status",
      cell: (u: any) => (
        <Badge 
          variant={u.status === "ACTIVE" ? "default" : "secondary"} 
          className={`font-black text-[10px] px-3 py-1 uppercase tracking-widest ${
            u.status === "ACTIVE" 
              ? "bg-green-500 hover:bg-green-600 shadow-md shadow-green-500/10" 
              : "bg-destructive/10 text-destructive border-2 border-destructive/20"
          }`}
        >
          {u.status || "ACTIVE"}
        </Badge>
      )
    },
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-40">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight italic text-primary flex items-center gap-3">
            <Users className="h-8 w-8" /> User Governance
          </h1>
          <p className="text-muted-foreground mt-1 font-medium italic">Global oversight of all TriBiz platform accounts and authorities.</p>
        </div>
        <Button className="gap-2 font-bold shadow-lg shadow-primary/20" size="lg">
          <UserPlus className="h-5 w-5" /> Provision User
        </Button>
      </div>

      <div className="rounded-3xl border-2 shadow-xl overflow-hidden bg-background">
        <DataTable 
          data={users} 
          columns={columns} 
          actions={(u) => (
            <div className="flex justify-end gap-2 pr-4">
              {u.id !== currentUser?.id ? (
                <>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className={`h-9 items-center gap-2 font-bold rounded-xl transition-all ${
                      u.status === "ACTIVE" 
                        ? "text-orange-500 hover:bg-orange-50 hover:text-orange-600" 
                        : "text-green-500 hover:bg-green-50 hover:text-green-600"
                    }`}
                    onClick={() => handleToggleStatus(u.id, u.status || "ACTIVE")}
                    disabled={isActionInProgress === u.id}
                  >
                    {isActionInProgress === u.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      u.status === "ACTIVE" ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />
                    )}
                    {u.status === "ACTIVE" ? "Suspend" : "Activate"}
                  </Button>
                  <Button size="icon" variant="ghost" className="h-9 w-9 text-destructive hover:bg-destructive/5 rounded-xl">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <Badge variant="outline" className="h-9 px-4 font-bold border-2 italic text-muted-foreground uppercase tracking-widest bg-muted/20">
                  Self Account
                </Badge>
              )}
              <Button size="icon" variant="ghost" className="h-9 w-9 hover:bg-muted/50 rounded-xl">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
          )}
        />
      </div>

      <div className="bg-primary/5 border-2 border-primary/10 rounded-3xl p-6 flex items-start gap-4">
        <AlertCircle className="h-6 w-6 text-primary mt-1" />
        <div>
          <h4 className="font-bold text-primary italic">Governance Protocol</h4>
          <p className="text-sm text-muted-foreground font-medium italic mt-1 leading-relaxed">
            Suspended users lose all platform privileges immediately. High-risk actions like account deletion are permament and should only be performed after verification.
          </p>
        </div>
      </div>
    </div>
  );
}
