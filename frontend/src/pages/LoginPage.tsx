import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, User, Stethoscope, ShieldCheck } from "lucide-react";
import { loginUser, registerUser } from "@/lib/auth";

const roleConfig = {
  patient: { icon: User, label: "Patient", color: "text-primary", redirect: "/patient/search" },
  doctor: { icon: Stethoscope, label: "Doctor", color: "text-primary", redirect: "/doctor" },
  admin: { icon: ShieldCheck, label: "Admin", color: "text-primary", redirect: "/admin" },
};

export default function LoginPage() {
  const [selectedRole, setSelectedRole] = useState<UserRole>("patient");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);

  try {
    const res = await loginUser({
      email,
      password,
    });

    console.log("LOGIN RESPONSE:", res.data); // 👈 DEBUG

    const token = res.data.token;
    const user = res.data.user;

    localStorage.setItem("token", token);

    // 🚨 IMPORTANT: check user exists
    if (!user || !user.role) {
      alert("Login failed: no role received");
      return;
    }

    // ✅ ROLE-BASED REDIRECT
    if (user.role === "patient") {
      navigate("/patient/search");
    } else if (user.role === "doctor") {
      navigate("/doctor");
    } else if (user.role === "admin") {
      navigate("/admin");
    }

  } catch (error: any) {
    console.error("Login failed:", error.response?.data || error.message);
    alert(error.response?.data?.error || "Login failed");
  } finally {
    setIsLoading(false);
  }
};

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await registerUser({
  name,
  email,
  password,
  role: selectedRole,
});

      // After signup, automatically login
      const user = await login(email, password);
      navigate(roleConfig[user.role].redirect);
    } catch (error) {
      console.error("Signup failed:", error);
      // TODO: Show error message
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-hero flex flex-col">
      <nav className="px-4 h-16 flex items-center">
        <Link to="/" className="flex items-center gap-2">
          <Heart className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold text-foreground">MediBook</span>
        </Link>
      </nav>

      <div className="flex-1 flex items-center justify-center px-4 pb-12">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Welcome Back</CardTitle>
            <CardDescription>Sign in to your account to continue</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              <div className="mb-6">
                <Label className="text-sm font-medium mb-3 block">Select Role</Label>
                <div className="grid grid-cols-3 gap-2">
                  {(Object.keys(roleConfig) as UserRole[]).map((role) => {
                    const config = roleConfig[role];
                    return (
                      <button
                        key={role}
                        type="button"
                        onClick={() => setSelectedRole(role)}
                        className={`flex flex-col items-center gap-1.5 p-3 rounded-lg border-2 transition-all text-sm ${
                          selectedRole === role
                            ? "border-primary bg-secondary"
                            : "border-border hover:border-primary/30"
                        }`}
                      >
                        <config.icon className={`h-5 w-5 ${selectedRole === role ? "text-primary" : "text-muted-foreground"}`} />
                        <span className={selectedRole === role ? "font-medium text-foreground" : "text-muted-foreground"}>
                          {config.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Signing In..." : "Sign In"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      placeholder="John Smith"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Creating Account..." : "Create Account"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
