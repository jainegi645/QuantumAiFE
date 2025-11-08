import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { authService } from '@/services/auth.service';
import { toast } from 'react-toastify';

export const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const code = searchParams.get('code');

  useEffect(() => {
    const handleCallback = async () => {
      if (!code) {
        toast.error('Authentication failed');
        navigate('/');
        return;
      }

      try {
        await authService.handleAuthCallback(code);
        toast.success('Successfully logged in!');
        navigate('/');
      } catch (error: any) {
        toast.error(error.message || 'Authentication failed');
        navigate('/');
      }
    };

    handleCallback();
  }, [code, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-16 h-16 border-4 border-t-blue-500 border-gray-200 rounded-full animate-spin"></div>
    </div>
  );
};