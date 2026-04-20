import { useParams } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, FileText, Download } from "lucide-react";

export default function ReportsPage() {
  const params = useParams<{ programId: string }>();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="border-b border-slate-700/50 bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">Reports</h1>
              <p className="text-slate-400">Generate and manage vulnerability reports</p>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700 gap-2">
              <Plus className="w-4 h-4" />
              Generate Report
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {[
            { type: "Markdown", icon: FileText, color: "text-blue-400" },
            { type: "HTML", icon: FileText, color: "text-green-400" },
            { type: "Bounty Submission", icon: FileText, color: "text-purple-400" },
          ].map((template) => (
            <Card key={template.type} className="bg-slate-800/50 border-slate-700/50 hover:border-blue-500/50 transition-colors">
              <CardHeader>
                <template.icon className={`w-8 h-8 ${template.color} mb-2`} />
                <CardTitle className="text-white">{template.type}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-400 mb-4">Generate {template.type.toLowerCase()} format</p>
                <Button size="sm" variant="outline" className="w-full border-slate-600 text-slate-300 hover:bg-slate-700">
                  <Download className="w-4 h-4 mr-1" />
                  Create
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center py-12">
          <p className="text-slate-400">No reports generated yet.</p>
        </div>
      </div>
    </div>
  );
}
