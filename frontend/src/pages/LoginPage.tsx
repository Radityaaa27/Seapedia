import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Eye, EyeOff, LogIn } from "lucide-react";

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(form);
      toast.success("Welcome back!");
      navigate("/dashboard");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[88vh] flex bg-background">
      {/* Left panel: Decorative */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-950 relative overflow-hidden flex-col justify-between p-12 text-white border-r border-slate-900">
        {/* Ambient Glows */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-orange-500/10 rounded-full blur-[100px] animate-pulse-glow" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-500/10 rounded-full blur-[80px] animate-pulse-glow" style={{ animationDelay: "3s" }} />

        <div className="relative z-10">
          <Link to="/" className="inline-block">
            <span className="text-2xl font-black text-white tracking-tight">
              SEA<span className="text-orange-500">PEDIA</span>
            </span>
          </Link>
        </div>

        <div className="relative z-10 max-w-md my-auto space-y-6 animate-fade-up">
          <h2 className="text-4xl font-extrabold tracking-tight leading-tight">
            Dive Back Into The <br />
            <span className="text-gradient">Premium Marine Hub</span>
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            Log in to manage your digital wallet, check real-time order tracking, explore fresh seafood listings, and handle store sales.
          </p>

          {/* Testimonial preview */}
          <div className="glass-card p-5 rounded-2xl border-white/10 mt-8 space-y-3">
            <p className="text-xs text-slate-300 italic leading-relaxed">
              "SEAPEDIA has transformed how we distribute seafood across major cities. The wallet transfers are instant, and temperature tracking ensures perfect delivery."
            </p>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center font-bold text-xs">
                A
              </div>
              <div>
                <p className="text-xs font-bold">Adi Nugroho</p>
                <p className="text-[10px] text-slate-500">Premium Seafood Distributor</p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-xs text-slate-500">
          © {new Date().getFullYear()} SEAPEDIA. All rights reserved.
        </div>
      </div>

      {/* Right panel: Login form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 md:p-16">
        <div className="w-full max-w-md space-y-6 animate-fade-up">
          <div className="text-center lg:text-left">
            <h1 className="text-2xl font-extrabold tracking-tight">Welcome back</h1>
            <p className="text-sm text-muted-foreground mt-1">Log in to your account to continue</p>
          </div>

          <Card className="border border-border/60 shadow-lg shadow-black/[0.02] rounded-2xl overflow-hidden">
            <CardContent className="p-6 sm:p-8">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="budi@example.com"
                    value={form.email}
                    onChange={handleChange}
                    required
                    autoComplete="email"
                    className="focus-visible:ring-orange-500/20"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="password">Password</Label>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={form.password}
                      onChange={handleChange}
                      required
                      autoComplete="current-password"
                      className="pr-10 focus-visible:ring-orange-500/20"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword
                        ? <EyeOff className="w-4 h-4" />
                        : <Eye className="w-4 h-4" />
                      }
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white rounded-xl py-5 font-bold shadow-md shadow-orange-500/10 hover:shadow-lg transition-all duration-300"
                >
                  {isLoading ? (
                    "Logging in..."
                  ) : (
                    <>
                      <LogIn className="w-4 h-4 mr-2" /> Login to Account
                    </>
                  )}
                </Button>
              </form>

              <p className="text-center text-sm text-muted-foreground mt-6">
                Don't have an account yet?{" "}
                <Link
                  to="/register"
                  className="text-orange-500 font-bold hover:text-orange-600 transition-colors"
                >
                  Register here
                </Link>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;