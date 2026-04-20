import { useState } from "react";
import { useParams } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Trash2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function SessionProfilesPage() {
  const params = useParams<{ programId: string }>();
  const programId = parseInt(params?.programId || "0");
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    authType: "cookie" as const,
    credentials: "",
    roleLevel: "user" as const,
    description: "",
  });

  const { data: profiles, refetch } = trpc.sessionProfiles.listByProgram.useQuery({ programId });
  const createMutation = trpc.sessionProfiles.create.useMutation();

  const handleCreate = async () => {
    if (!formData.name.trim()) {
      toast.error("Profile name is required");
      return;
    }

    try {
      await createMutation.mutateAsync({
        programId,
        ...formData,
      });

      toast.success("Session profile created");
      setFormData({ name: "", authType: "cookie", credentials: "", roleLevel: "user", description: "" });
      setOpen(false);
      refetch();
    } catch (error) {
      toast.error("Failed to create profile");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="border-b border-slate-700/50 bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">Session Profiles</h1>
              <p className="text-slate-400">Manage authentication for different user roles</p>
            </div>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700 gap-2">
                  <Plus className="w-4 h-4" />
                  New Profile
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-slate-800 border-slate-700 max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="text-white">Create Session Profile</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-slate-300">Profile Name</label>
                    <Input
                      placeholder="e.g., Low Priv User, Admin"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="bg-slate-700 border-slate-600 text-white mt-1"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-slate-300">Auth Type</label>
                    <Select value={formData.authType} onValueChange={(v: any) => setFormData({ ...formData, authType: v })}>
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-white mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-700 border-slate-600">
                        <SelectItem value="cookie">Cookie</SelectItem>
                        <SelectItem value="bearer_token">Bearer Token</SelectItem>
                        <SelectItem value="api_key">API Key</SelectItem>
                        <SelectItem value="oauth">OAuth</SelectItem>
                        <SelectItem value="custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-slate-300">Role Level</label>
                    <Select value={formData.roleLevel} onValueChange={(v: any) => setFormData({ ...formData, roleLevel: v })}>
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-white mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-700 border-slate-600">
                        <SelectItem value="unauthenticated">Unauthenticated</SelectItem>
                        <SelectItem value="user">User</SelectItem>
                        <SelectItem value="moderator">Moderator</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-slate-300">Credentials (JSON)</label>
                    <Textarea
                      placeholder='{"Authorization": "Bearer token123"}'
                      value={formData.credentials}
                      onChange={(e) => setFormData({ ...formData, credentials: e.target.value })}
                      className="bg-slate-700 border-slate-600 text-white mt-1 font-mono text-sm"
                      rows={4}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-slate-300">Description</label>
                    <Textarea
                      placeholder="e.g., Test account for low-privilege access"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="bg-slate-700 border-slate-600 text-white mt-1"
                      rows={2}
                    />
                  </div>

                  <Button
                    onClick={handleCreate}
                    disabled={createMutation.isPending}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    {createMutation.isPending ? "Creating..." : "Create Profile"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {profiles && profiles.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-6">
            {profiles.map((profile) => (
              <Card key={profile.id} className="bg-slate-800/50 border-slate-700/50">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-white">{profile.name}</CardTitle>
                      <CardDescription className="text-slate-400">{profile.authType}</CardDescription>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      profile.roleLevel === "admin" ? "bg-red-500/20 text-red-400" :
                      profile.roleLevel === "moderator" ? "bg-yellow-500/20 text-yellow-400" :
                      profile.roleLevel === "user" ? "bg-blue-500/20 text-blue-400" :
                      "bg-slate-500/20 text-slate-400"
                    }`}>
                      {profile.roleLevel}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  {profile.description && (
                    <p className="text-sm text-slate-400 mb-3">{profile.description}</p>
                  )}
                  <Button size="sm" variant="destructive" className="w-full">
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-slate-400">No session profiles yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
