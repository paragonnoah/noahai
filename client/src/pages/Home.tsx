import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { getLoginUrl } from "@/const";
import { Shield, Zap, BarChart3, Lock, Search, FileText } from "lucide-react";
import { useLocation } from "wouter";

export default function Home() {
  const { isAuthenticated } = useAuth();
  const [, navigate] = useLocation();

  if (isAuthenticated) {
    navigate("/dashboard");
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Navigation */}
      <nav className="border-b border-slate-700/50 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-8 h-8 text-blue-500" />
            <span className="text-xl font-bold text-white">ScopeHunter</span>
          </div>
          <a href={getLoginUrl()}>
            <Button className="bg-blue-600 hover:bg-blue-700">Sign In</Button>
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
          Professional Bug Bounty <span className="text-blue-400">Reconnaissance</span> & Validation
        </h1>
        <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
          Organize your security research, discover assets, validate vulnerabilities, and generate professional reports for bug bounty platforms.
        </p>
        <div className="flex gap-4 justify-center">
          <a href={getLoginUrl()}>
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
              Get Started Free
            </Button>
          </a>
          <Button size="lg" variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800">
            Learn More
          </Button>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-white mb-12 text-center">Powerful Features for Researchers</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6 hover:border-blue-500/50 transition-colors">
            <Search className="w-8 h-8 text-blue-400 mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Scope Management</h3>
            <p className="text-slate-400">
              Organize bug bounty programs with domain wildcards, IP ranges, and exclusion rules. Never test out-of-scope.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6 hover:border-blue-500/50 transition-colors">
            <Zap className="w-8 h-8 text-blue-400 mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Asset Discovery</h3>
            <p className="text-slate-400">
              Collect subdomains, endpoints, and technologies from passive sources. Build comprehensive endpoint inventory.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6 hover:border-blue-500/50 transition-colors">
            <Lock className="w-8 h-8 text-blue-400 mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Session Profiles</h3>
            <p className="text-slate-400">
              Store authentication tokens and cookies for different user roles. Test access control safely.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6 hover:border-blue-500/50 transition-colors">
            <Shield className="w-8 h-8 text-blue-400 mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">IDOR/BOLA Validation</h3>
            <p className="text-slate-400">
              Automated differential testing for insecure direct object references and broken access control.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6 hover:border-blue-500/50 transition-colors">
            <BarChart3 className="w-8 h-8 text-blue-400 mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Evidence Collection</h3>
            <p className="text-slate-400">
              Capture screenshots, HTTP requests/responses, and proof-of-concept data. Organize by finding.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6 hover:border-blue-500/50 transition-colors">
            <FileText className="w-8 h-8 text-blue-400 mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Report Generation</h3>
            <p className="text-slate-400">
              Generate Markdown, HTML, and platform-specific submission templates with CVSS scoring.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-lg p-12">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to find vulnerabilities?</h2>
          <p className="text-slate-300 mb-8">
            Start your bug bounty journey with professional tools designed for security researchers.
          </p>
          <a href={getLoginUrl()}>
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              Sign In Now
            </Button>
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-700/50 bg-slate-900/50 py-8">
        <div className="container mx-auto px-4 text-center text-slate-400">
          <p>&copy; 2026 ScopeHunter. Professional bug bounty research platform.</p>
        </div>
      </footer>
    </div>
  );
}
