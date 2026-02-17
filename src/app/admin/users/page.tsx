"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { User } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shield, Users } from "lucide-react";

const AVAILABLE_ROLES = ["CUSTOMER", "SELLER", "SERVICE_PROVIDER", "ADMIN", "STAFF"];

export default function UserManagementPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoles, setSelectedRoles] = useState<{ [key: number]: string[] }>({});

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await api.admin.users.getAll();
      setUsers(data);
      
      // Initialize selected roles
      const initialRoles: { [key: number]: string[] } = {};
      data.forEach((user: User) => {
        initialRoles[user.id] = user.roles || [];
      });
      setSelectedRoles(initialRoles);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateUserRoles = async (userId: number, roles: string[]) => {
    try {
      await api.admin.users.updateRoles(userId, roles);
      
      // Update local state
      setUsers(users.map(user => 
        user.id === userId ? { ...user, roles } : user
      ));
    } catch (error) {
      console.error("Failed to update user roles:", error);
    }
  };

  const handleRoleChange = (userId: number, newRole: string) => {
    const currentRoles = selectedRoles[userId] || [];
    const updatedRoles = currentRoles.includes(newRole)
      ? currentRoles.filter(r => r !== newRole)
      : [...currentRoles, newRole];
    
    setSelectedRoles({ ...selectedRoles, [userId]: updatedRoles });
    updateUserRoles(userId, updatedRoles);
  };

  if (loading) {
    return <div className="flex justify-center py-20">Loading users...</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center gap-3 mb-8">
        <Users className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold">User Management</h1>
      </div>

      <div className="grid gap-6">
        {users.map((user) => (
          <Card key={user.id} className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div>
                  <div className="font-semibold">{user.username}</div>
                  <div className="text-sm text-muted-foreground">{user.email}</div>
                </div>
                <Shield className="h-5 w-5 text-muted-foreground" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Current Roles:</label>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {(user.roles || []).map((role) => (
                      <Badge key={role} variant="secondary">
                        {role}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Manage Roles:</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {AVAILABLE_ROLES.map((role) => (
                      <div key={role} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`role-${user.id}-${role}`}
                          checked={(selectedRoles[user.id] || []).includes(role)}
                          onChange={() => handleRoleChange(user.id, role)}
                          className="rounded"
                        />
                        <label 
                          htmlFor={`role-${user.id}-${role}`}
                          className="text-sm cursor-pointer"
                        >
                          {role}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
