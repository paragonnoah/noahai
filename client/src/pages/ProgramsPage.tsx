import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Trash2, Edit2, ExternalLink } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { toast } from "sonner";

export default function ProgramsPage() {
  const [, navigate] = useLocation();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", platform: "", url: "" });

  const { data: programs, isLoading, refetch } = trpc.programs.list.useQuery();
  const createMutation = trpc.programs.create.useMutation();
  const deleteMutation = trpc.programs.delete.useMutation();

  const handleCreate = async () => {
    if (!formData.name.trim()) {
      toast.error("Program name is required");
      return;
    }

    try {
      await createMutation.mutateAsync(formData);
      toast.success("Program created successfully");
      setFormData({ name: "", platform: "", url: "" });
      setOpen(false);
      refetch();
    } catch (error) {
      toast.error("Failed to create program");
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this program?")) {
      try {
        await deleteMutation.mutateAsync({ id });
        toast.success("Program deleted");
        refetch();
      } catch (error) {
        toast.error("Failed to delete program");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="border-b border-slate-700/50 bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">Bug Bounty Programs</h1>
              <p className="text-slate-400">Manage your active programs and scopes</p>
            </div>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700 gap-2">
                  <Plus className="w-4 h-4" />
                  New Program
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-slate-800 border-slate-700">
                <DialogHeader>
                  <DialogTitle className="text-white">Create New Program</DialogTitle>
                  <DialogDescription>Add a new bug bounty program to track</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-slate-300">Program Name</label>
                    <Input
                      placeholder="e.g., Acme Corp Bug Bounty"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="bg-slate-700 border-slate-600 text-white mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-300">Platform</label>
                    <Input
                      placeholder="e.g., HackerOne, Bugcrowd"
                      value={formData.platform}
                      onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                      className="bg-slate-700 border-slate-600 text-white mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-300">Program URL</label>
                    <Input
                      placeholder="https://..."
                      value={formData.url}
                      onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                      className="bg-slate-700 border-slate-600 text-white mt-1"
                    />
                  </div>
                  <Button
                    onClick={handleCreate}
                    disabled={createMutation.isPending}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    {createMutation.isPending ? "Creating..." : "Create Program"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Programs Grid */}
      <div className="container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="text-center text-slate-400">Loading programs...</div>
        ) : programs && programs.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {programs.map((program) => (
              <Card key={program.id} className="bg-slate-800/50 border-slate-700/50 hover:border-blue-500/50 transition-colors">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-white">{program.name}</CardTitle>
                      <CardDescription className="text-slate-400">{program.platform || "Custom"}</CardDescription>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      program.status === "active" ? "bg-green-500/20 text-green-400" :
                      program.status === "paused" ? "bg-yellow-500/20 text-yellow-400" :
                      "bg-slate-500/20 text-slate-400"
                    }`}>
                      {program.status}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {program.url && (
                      <a
                        href={program.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Visit Program
                      </a>
                    )}
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700"
                        onClick={() => navigate(`/programs/${program.id}/scopes`)}
                      >
                        <Edit2 className="w-4 h-4 mr-1" />
                        Scopes
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700"
                        onClick={() => navigate(`/programs/${program.id}/sessions`)}
                      >
                        Sessions
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        className="border-slate-600"
                        onClick={() => handleDelete(program.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-slate-400 mb-4">No programs yet. Create one to get started.</p>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">Create First Program</Button>
              </DialogTrigger>
            </Dialog>
          </div>
        )}
      </div>
    </div>
  );
}
