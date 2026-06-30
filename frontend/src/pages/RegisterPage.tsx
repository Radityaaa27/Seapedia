import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Eye, EyeOff, UserPlus } from "lucide-react";

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await register(form);
      toast.success("Account created! Welcome to SEAPEDIA 🎉");
      navigate("/dashboard");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Registration failed. Please try again.");
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
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-500/10 rounded-full blur-[80px] animate-pulse-glow" style={{ animationDelay: "2s" }} />

        <div className="relative z-10">
          <Link to="/" className="inline-block">
            <span className="text-2xl font-black text-white tracking-tight">
              SEA<span className="text-orange-500">PEDIA</span>
            </span>
          </Link>
        </div>

        <div className="relative z-10 max-w-md my-auto space-y-6 animate-fade-up">
          <h2 className="text-4xl font-extrabold tracking-tight leading-tight">
            Create Your Account <br />
            <span className="text-gradient">Begin Your Voyage</span>
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            Join thousands of buyers and sellers across Indonesia. Access exclusive vouchers, top-up your SeaWallet safely, and manage order deliveries smoothly.
          </p>

          {/* Quick Info Grid */}
          <div className="grid grid-cols-2 gap-4 mt-8">
            <div className="bg-slate-900/55 border border-slate-800 p-4 rounded-xl">
              <h4 className="font-bold text-sm text-orange-400">Buyers</h4>
              <p className="text-xs text-slate-400 mt-1">Get 10% off on your first order using code WELCOME10.</p>
            </div>
            <div className="bg-slate-900/55 border border-slate-800 p-4 rounded-xl">
              <h4 className="font-bold text-sm text-amber-400">Sellers</h4>
              <p className="text-xs text-slate-400 mt-1">Lowest marketplace fees & direct driver network integration.</p>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-xs text-slate-500">
          © {new Date().getFullYear()} SEAPEDIA. All rights reserved.
        </div>
      </div>

      {/* Right panel: Register form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12">
        <div className="w-full max-w-md space-y-6 animate-fade-up">
          <div className="text-center lg:text-left">
            <h1 className="text-2xl font-extrabold tracking-tight">Get started</h1>
            <p className="text-sm text-muted-foreground mt-1">Create a new SEAPEDIA account today</p>
          </div>

          <Card className="border border-border/60 shadow-lg shadow-black/[0.02] rounded-2xl overflow-hidden">
            <CardContent className="p-6 sm:p-8">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Budi Santoso"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className="focus-visible:ring-orange-500/20"
                  />
                </div>

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
                  <Label htmlFor="phone">
                    Phone Number <span className="text-muted-foreground font-normal">(optional)</span>
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="08123456789"
                    value={form.phone}
                    onChange={handleChange}
                    className="focus-visible:ring-orange-500/20"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Min. 8 chars, 1 uppercase, 1 number"
                      value={form.password}
                      onChange={handleChange}
                      required
                      autoComplete="new-password"
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
                    "Creating account..."
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4 mr-2" /> Create Free Account
                    </>
                  )}
                </Button>
              </form>

              <p className="text-center text-sm text-muted-foreground mt-6">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-orange-500 font-bold hover:text-orange-600 transition-colors"
                >
                  Login here
                </Link>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;