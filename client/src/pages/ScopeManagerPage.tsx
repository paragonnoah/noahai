import { useState } from "react";
import { useParams } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Trash2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function ScopeManagerPage() {
  const params = useParams<{ programId: string }>();
  const programId = parseInt(params?.programId || "0");
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    allowedDomains: "",
    excludedDomains: "",
    ipRanges: "",
    specialRules: "",
  });

  const { data: scopes, refetch } = trpc.scopes.listByProgram.useQuery({ programId });
  const createMutation = trpc.scopes.create.useMutation();

  const handleCreate = async () => {
    try {
      const allowedDomains = formData.allowedDomains
        .split("\n")
        .map((d) => d.trim())
        .filter(Boolean);
      const excludedDomains = formData.excludedDomains
        .split("\n")
        .map((d) => d.trim())
        .filter(Boolean);
      const ipRanges = formData.ipRanges
        .split("\n")
        .map((ip) => ip.trim())
        .filter(Boolean);

      await createMutation.mutateAsync({
        programId,
        allowedDomains,
        excludedDomains,
        ipRanges,
        specialRules: formData.specialRules || undefined,
      });

      toast.success("Scope created successfully");
      setFormData({ allowedDomains: "", excludedDomains: "", ipRanges: "", specialRules: "" });
      setOpen(false);
      refetch();
    } catch (error) {
      toast.error("Failed to create scope");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="border-b border-slate-700/50 bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">Scope Manager</h1>
              <p className="text-slate-400">Define allowed domains, IP ranges, and exclusions</p>
            </div>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700 gap-2">
                  <Plus className="w-4 h-4" />
                  New Scope
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-slate-800 border-slate-700 max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="text-white">Create New Scope</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-slate-300">Allowed Domains</label>
                    <Textarea
                      placeholder="*.example.com&#10;api.example.com"
                      value={formData.allowedDomains}
                      onChange={(e) => setFormData({ ...formData, allowedDomains: e.target.value })}
                      className="bg-slate-700 border-slate-600 text-white mt-1 font-mono text-sm"
                      rows={4}
                    />
                    <p className="text-xs text-slate-400 mt-1">One domain per line. Supports wildcards.</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-slate-300">Excluded Domains</label>
                    <Textarea
                      placeholder="internal.example.com&#10;staging.example.com"
                      value={formData.excludedDomains}
                      onChange={(e) => setFormData({ ...formData, excludedDomains: e.target.value })}
                      className="bg-slate-700 border-slate-600 text-white mt-1 font-mono text-sm"
                      rows={3}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-slate-300">IP Ranges (CIDR)</label>
                    <Textarea
                      placeholder="192.168.1.0/24&#10;10.0.0.0/8"
                      value={formData.ipRanges}
                      onChange={(e) => setFormData({ ...formData, ipRanges: e.target.value })}
                      className="bg-slate-700 border-slate-600 text-white mt-1 font-mono text-sm"
                      rows={3}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-slate-300">Special Rules</label>
                    <Textarea
                      placeholder="e.g., Do not test rate limits, No automated scanning"
                      value={formData.specialRules}
                      onChange={(e) => setFormData({ ...formData, specialRules: e.target.value })}
                      className="bg-slate-700 border-slate-600 text-white mt-1"
                      rows={3}
                    />
                  </div>

                  <Button
                    onClick={handleCreate}
                    disabled={createMutation.isPending}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    {createMutation.isPending ? "Creating..." : "Create Scope"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Scopes List */}
      <div className="container mx-auto px-4 py-8">
        {scopes && scopes.length > 0 ? (
          <div className="space-y-6">
            {scopes.map((scope) => (
              <Card key={scope.id} className="bg-slate-800/50 border-slate-700/50">
                <CardHeader>
                  <CardTitle className="text-white">Scope #{scope.id}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {scope.allowedDomains && scope.allowedDomains.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-slate-300 mb-2">Allowed Domains</h4>
                      <div className="bg-slate-900/50 p-3 rounded font-mono text-sm text-slate-300 max-h-24 overflow-y-auto">
                        {(scope.allowedDomains as string[]).join("\n")}
                      </div>
                    </div>
                  )}

                  {scope.excludedDomains && scope.excludedDomains.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-slate-300 mb-2">Excluded Domains</h4>
                      <div className="bg-slate-900/50 p-3 rounded font-mono text-sm text-slate-300 max-h-24 overflow-y-auto">
                        {(scope.excludedDomains as string[]).join("\n")}
                      </div>
                    </div>
                  )}

                  {scope.ipRanges && scope.ipRanges.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-slate-300 mb-2">IP Ranges</h4>
                      <div className="bg-slate-900/50 p-3 rounded font-mono text-sm text-slate-300 max-h-24 overflow-y-auto">
                        {(scope.ipRanges as string[]).join("\n")}
                      </div>
                    </div>
                  )}

                  {scope.specialRules && (
                    <div>
                      <h4 className="text-sm font-semibold text-slate-300 mb-2">Special Rules</h4>
                      <div className="bg-slate-900/50 p-3 rounded text-sm text-slate-300">
                        {scope.specialRules}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-slate-400 mb-4">No scopes defined yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
