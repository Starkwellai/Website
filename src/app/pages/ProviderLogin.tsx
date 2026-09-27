import { useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { AlertCircle, ArrowRight, Building2 } from "lucide-react";
import logo from "../../assets/b2725744d7bb552f20e2a7bcebca16e19b4a014d.png";
import { loginProviderAccount } from "../../lib/starkwell";

export function ProviderLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await loginProviderAccount(email, password);
      navigate("/provider-dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong — please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 flex flex-col">
      <header className="bg-white border-b border-blue-100">
        <div className="container mx-auto px-2 md:px-4 py-4">
          <img
            src={logo}
            alt="Starkwell"
            className="h-9 md:h-12 cursor-pointer rounded-[5px]"
            onClick={() => navigate("/")}
          />
        </div>
      </header>

      <main className="container mx-auto px-6 py-16 flex-1 flex items-start justify-center">
        <div className="max-w-md w-full">
          <Card className="shadow-lg border-blue-100">
            <CardHeader className="space-y-1">
              <div className="flex items-center gap-2 mb-2">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Building2 className="size-5 text-blue-600" />
                </div>
                <CardTitle className="text-2xl text-blue-900">Provider sign in</CardTitle>
              </div>
              <CardDescription>Sign in to your Starkwell provider account</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div role="alert" className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-800 text-sm rounded-lg p-3">
                    <AlertCircle className="size-4 mt-0.5 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-blue-900">Email address</Label>
                  <Input
                    id="email" type="email" placeholder="jane@downtownmedical.com"
                    value={email} onChange={(e) => setEmail(e.target.value)} required
                    className="border-blue-200 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-blue-900">Password</Label>
                  <Input
                    id="password" type="password" placeholder="••••••••"
                    value={password} onChange={(e) => setPassword(e.target.value)} required
                    className="border-blue-200 focus:border-blue-500"
                  />
                </div>

                <Button type="submit" disabled={submitting} className="w-full bg-blue-600 hover:bg-blue-700">
                  {submitting ? "Signing in…" : "Sign in"}
                  {!submitting && <ArrowRight className="ml-2 size-4" />}
                </Button>

                <p className="text-xs text-center text-gray-500">
                  Forgot your password? We don't have automated resets yet — email{" "}
                  <a href="mailto:provider-support@starkwell.com" className="text-blue-600 hover:underline font-medium">
                    provider-support@starkwell.com
                  </a>{" "}
                  and we'll reset it by hand.
                </p>

                <p className="text-xs text-center text-gray-500">
                  Don't have an account yet?{" "}
                  <button type="button" onClick={() => navigate("/provider-signup")} className="text-blue-600 hover:underline font-medium">
                    Sign up
                  </button>
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
