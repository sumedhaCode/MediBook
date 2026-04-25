// src/pages/LoginPage.tsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, User, Stethoscope, ShieldCheck } from "lucide-react";
import { registerUser } from "@/lib/auth";

const roleConfig = {
  patient: {
    icon: User,
    label: "Patient",
    redirect: "/patient/search",
  },
  doctor: {
    icon: Stethoscope,
    label: "Doctor",
    redirect: "/doctor",
  },
  admin: {
    icon: ShieldCheck,
    label: "Admin",
    redirect: "/admin",
  },
};

export default function LoginPage() {
  const [selectedRole, setSelectedRole] = useState<UserRole>("patient");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [experience, setExperience] = useState("");
  const [location, setLocation] = useState("");
  const [consultation, setConsultation] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const user = await login(email, password);
      navigate(roleConfig[user.role].redirect);
    } catch (error: any) {
      alert(error.response?.data?.error || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const signupData: any = {
        name,
        email,
        password,
        role: selectedRole,
      };

      if (selectedRole === "doctor") {
        signupData.specialty = specialty;
        signupData.experience = Number(experience);
        signupData.location = location;
        signupData.consultation = Number(consultation);
      }

      await registerUser(signupData);
      const user = await login(email, password);
      navigate(roleConfig[user.role].redirect);
    } catch (error: any) {
      alert(error.response?.data?.error || "Signup failed");
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
            <CardTitle className="text-2xl">Welcome to MediBook</CardTitle>
            <CardDescription>
              Sign in to your account to continue
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Tabs defaultValue="login">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              {/* LOGIN TAB (NO ROLE SELECTOR) */}
              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Password</Label>
                    <Input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>

                  <Button className="w-full" disabled={isLoading}>
                    {isLoading ? "Signing In..." : "Sign In"}
                  </Button>
                </form>
              </TabsContent>

              {/* SIGNUP TAB (ROLE SELECTOR HERE ONLY) */}
              <TabsContent value="signup">
                <div className="mb-6">
                  <Label>Select Role</Label>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {(Object.keys(roleConfig) as UserRole[])
                      .filter((role) => role !== "admin")
                      .map((role) => {
                      const config = roleConfig[role];
                      return (
                        <button
                          key={role}
                          type="button"
                          onClick={() => setSelectedRole(role)}
                          className={`p-3 border rounded ${
                            selectedRole === role
                              ? "border-primary bg-secondary"
                              : ""
                          }`}
                        >
                          <config.icon className="mx-auto h-5 w-5" />
                          <p className="text-xs mt-1">{config.label}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <form onSubmit={handleSignup} className="space-y-4">
                  <Input
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                  <Input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <Input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />

                  {selectedRole === "doctor" && (
                    <>
                      <Input
                        placeholder="Specialty"
                        value={specialty}
                        onChange={(e) => setSpecialty(e.target.value)}
                        required
                      />
                      <Input
                        type="number"
                        placeholder="Experience"
                        value={experience}
                        onChange={(e) => setExperience(e.target.value)}
                        required
                      />
                      <Input
                        placeholder="Location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        required
                      />
                      <Input
                        type="number"
                        placeholder="Consultation Fee"
                        value={consultation}
                        onChange={(e) => setConsultation(e.target.value)}
                        required
                      />
                    </>
                  )}

                  <Button className="w-full" disabled={isLoading}>
                    {isLoading ? "Creating..." : "Create Account"}
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