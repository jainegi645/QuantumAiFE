import { Button } from "@/components/ui/button";
import { authService } from "@/services/auth.service";

export const LoginButtons = () => {
  const handleLogin = (provider: string) => {
    authService.login(provider);
  };

  return (
    <div className="flex flex-col gap-4">
      <Button 
        onClick={() => handleLogin('google')}
        className="bg-white text-gray-700 hover:bg-gray-100 border"
      >
        <img src="/google.svg" alt="Google" className="w-5 h-5 mr-2" />
        Continue with Google
      </Button>
      
      <Button 
        onClick={() => handleLogin('github')}
        className="bg-[#24292F] hover:bg-[#24292F]/90"
      >
        <img src="/github.svg" alt="GitHub" className="w-5 h-5 mr-2" />
        Continue with GitHub
      </Button>
    </div>
  );
};