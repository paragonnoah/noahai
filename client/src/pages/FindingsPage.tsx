import { useParams } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import { trpc } from "@/lib/trpc";

const SEVERITY_COLORS = {
  critical: "bg-red-500/20 text-red-400",
  high: "bg-orange-500/20 text-orange-400",
  medium: "bg-yellow-500/20 text-yellow-400",
  low: "bg-green-500/20 text-green-400",
  info: "bg-blue-500/20 text-blue-400",
};

const STATUS_COLORS = {
  signal: "bg-slate-500/20 text-slate-400",
  validated: "bg-blue-500/20 text-blue-400",
  report_ready: "bg-green-500/20 text-green-400",
  submitted: "bg-purple-500/20 text-purple-400",
  resolved: "bg-slate-500/20 text-slate-400",
};

export default function FindingsPage() {
  const params = useParams<{ programId: string }>();
  const programId = parseInt(params?.programId || "0");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="border-b border-slate-700/50 bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">Findings</h1>
              <p className="text-slate-400">Track and manage discovered vulnerabilities</p>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700 gap-2">
              <Plus className="w-4 h-4" />
              New Finding
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="text-slate-400">No findings yet. Run validation checks to discover vulnerabilities.</p>
        </div>
      </div>
    </div>
  );
}
