import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { useContext, useEffect } from "react";
import { AppContext } from "@/context/AppContext";
import { apiService } from "@/api/apiCalling";
import { endpoints } from "@/api/endpoints";
import { authService } from "@/services/auth.service";
import { useSearchParams } from "react-router-dom";

export default function Auth() {
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get("tab") === "register" ? "register" : "login";
  const [activeTab, setActiveTab] = useState(initialTab);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const context = useContext(AppContext);
  const { toast } = useToast();

  // Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Register form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // If we already have a token (e.g. obtained from an OAuth flow), include it
      const existingToken = authService.getToken();
      const config: any = {};
      if (existingToken) {
        config.headers = { Authorization: `Bearer ${existingToken}` };
      }

      const response = await apiService.post<any>(endpoints.login, {
        email: loginEmail,
        password: loginPassword,
      }, [], config);

      console.log('Login response:', response); // Debug log

      if (response?.token) {
        const token = response.token;
        
        // Parse the user data from the response
        let userData = null;
        if (response.user) {
          // Check if response.user is a string containing "UserDto(...)"
          if (typeof response.user === 'string' && response.user.includes('UserDto(')) {
            // Parse the UserDto string format
            const matches = response.user.match(/UserDto\(id=(.*?), name=(.*?), email=(.*?), role=(.*?), verified=(.*?)\)/);
            if (matches) {
              userData = {
                id: matches[1],
                name: matches[2],
                email: matches[3],
                role: matches[4],
                verified: matches[5] === 'true'
              };
            }
          } else {
            // If it's already an object, use it directly
            userData = response.user;
          }
        }

        // If we don't have user data yet, try to get it from /api/users/me
        if (!userData?.id) {
          try {
            const meResp = await apiService.get<any>(endpoints.me, null, [], { headers: { Authorization: `Bearer ${token}` } });
            userData = meResp?.user ?? meResp;
          } catch (meErr) {
            console.warn('Failed to fetch user data from /me endpoint:', meErr);
          }
        }

        // Store the user data and token
        if (userData?.id) {
          await authService.applyAuth(token, userData);
        } else {
          // Fallback: store at least the role if no full user data
          await authService.applyAuth(token, { role: response.role });
        }

        // Update app context and navigate
        await context?.fetchUserData();
        
        toast({
          title: "Success",
          description: "Logged in successfully!"
        });
        navigate("/");
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: response?.error || "Login failed"
        });
      }
    } catch (error: any) {
      console.error('Login error:', error);
      const errorMessage = error?.data?.error || error?.message || "Login failed";
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const payload = {
        name: `${firstName} ${lastName}`.trim(),
        email: registerEmail,
        password: registerPassword,
      };

      await apiService.post<any>(endpoints.register, payload);
      
      // Registration successful (201 Created) - show message and switch to login
      toast({
        title: "Success",
        description: "Registration successful! Please log in to continue."
      });
      setActiveTab("login");
      // Pre-fill login email for convenience
      setLoginEmail(registerEmail);
    } catch (err: any) {
      console.error('Register error', err);
      // Handle specific error cases from backend
      const errorMessage = err?.data?.error === "Email already exists" 
        ? "This email is already registered. Please log in or use a different email."
        : err?.data?.error || "Registration failed. Please try again.";
      
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    context?.login('google');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow">
        <div className="text-center">
          {/* <h2 className="text-3xl font-bold">Welcome to Quantum AI</h2> */}
          <h1 className="text-3xl font-bold">Sign in to your account</h1>
          <h3 className="mt-2 text-sm text-gray-600">Build skills for today, tomorrow, and beyond.</h3>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <form onSubmit={handleLogin} className="space-y-4 mt-4">
              <div>
                <Input
                  type="email"
                  placeholder="Email address"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <Input
                  type="password"
                  placeholder="Password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                />
              </div>
              <div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Signing in..." : "Sign in"}
                </Button>
              </div>
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleGoogleLogin}
              >
                <img src="/google.svg" alt="Google" className="w-5 h-5 mr-2" />
                Sign in with Google
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="register">
            <form onSubmit={handleRegister} className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  placeholder="First name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
                <Input
                  placeholder="Last name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
              <div>
                <Input
                  type="email"
                  placeholder="Email address"
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <Input
                  type="password"
                  placeholder="Password"
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  required
                />
              </div>
              <div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Creating account..." : "Create account"}
                </Button>
              </div>
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleGoogleLogin}
              >
                <img src="/google.svg" alt="Google" className="w-5 h-5 mr-2" />
                Sign in with Google
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}