import { useAuth } from "@/_core/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Shield, Target, AlertCircle, TrendingUp } from "lucide-react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";

const SEVERITY_COLORS = {
  critical: "#ef4444",
  high: "#f97316",
  medium: "#eab308",
  low: "#84cc16",
  info: "#06b6d4",
};

export default function Dashboard() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const { data: programs } = trpc.programs.list.useQuery();

  const severityData = [
    { name: "Critical", value: 2 },
    { name: "High", value: 5 },
    { name: "Medium", value: 8 },
    { name: "Low", value: 12 },
    { name: "Info", value: 3 },
  ];

  const statusData = [
    { name: "Signal", value: 10 },
    { name: "Validated", value: 12 },
    { name: "Report Ready", value: 8 },
    { name: "Submitted", value: 5 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="border-b border-slate-700/50 bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">Dashboard</h1>
              <p className="text-slate-400">Welcome back, {user?.name || "Researcher"}</p>
            </div>
            <Button
              onClick={() => navigate("/programs")}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Manage Programs
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-300">Active Programs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{programs?.length || 0}</div>
              <p className="text-xs text-slate-400 mt-2">Bug bounty programs</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-300">Total Findings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">30</div>
              <p className="text-xs text-slate-400 mt-2">Across all programs</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-300">Critical Issues</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-400">2</div>
              <p className="text-xs text-slate-400 mt-2">Require immediate action</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-300">Earnings Potential</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-400">$5,000</div>
              <p className="text-xs text-slate-400 mt-2">Estimated bounty value</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Severity Distribution */}
          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardHeader>
              <CardTitle className="text-white">Findings by Severity</CardTitle>
              <CardDescription>Distribution across all findings</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={severityData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {severityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={SEVERITY_COLORS[entry.name.toLowerCase() as keyof typeof SEVERITY_COLORS]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Status Distribution */}
          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardHeader>
              <CardTitle className="text-white">Findings by Status</CardTitle>
              <CardDescription>Progress through validation stages</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={statusData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="name" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569" }} />
                  <Bar dataKey="value" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="bg-slate-800/50 border-slate-700/50 hover:border-blue-500/50 transition-colors cursor-pointer">
            <CardHeader>
              <Target className="w-8 h-8 text-blue-400 mb-2" />
              <CardTitle className="text-white">New Program</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-400 text-sm mb-4">Add a new bug bounty program</p>
              <Button
                size="sm"
                variant="outline"
                className="w-full border-slate-600 text-slate-300 hover:bg-slate-700"
                onClick={() => navigate("/programs")}
              >
                Create
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700/50 hover:border-blue-500/50 transition-colors cursor-pointer">
            <CardHeader>
              <Shield className="w-8 h-8 text-blue-400 mb-2" />
              <CardTitle className="text-white">Validate Finding</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-400 text-sm mb-4">Run IDOR/BOLA checks</p>
              <Button
                size="sm"
                variant="outline"
                className="w-full border-slate-600 text-slate-300 hover:bg-slate-700"
                onClick={() => navigate("/programs")}
              >
                Start
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700/50 hover:border-blue-500/50 transition-colors cursor-pointer">
            <CardHeader>
              <AlertCircle className="w-8 h-8 text-blue-400 mb-2" />
              <CardTitle className="text-white">Generate Report</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-400 text-sm mb-4">Create submission template</p>
              <Button
                size="sm"
                variant="outline"
                className="w-full border-slate-600 text-slate-300 hover:bg-slate-700"
                onClick={() => navigate("/programs")}
              >
                Generate
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
