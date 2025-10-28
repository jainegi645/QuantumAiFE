import { Navigate } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { AppContext } from '@/context/AppContext';
import { toast } from 'react-toastify';

type Props = {
  children: React.ReactNode;
  allowedRoles?: string | string[]; // if provided, user must have one of these roles
};

export const ProtectedRoute = ({ children, allowedRoles }: Props) => {
  const context = useContext(AppContext);
  const [blocked, setBlocked] = useState<null | 'auth' | 'role'>(null);

  useEffect(() => {
    if (!context) return;
    if (!context.isAuthenticated) setBlocked('auth');
    else if (allowedRoles && !context.hasRole?.(allowedRoles)) setBlocked('role');
    else setBlocked(null);
  }, [context, allowedRoles]);

  if (blocked === 'auth') {
    // Not logged in
    toast.info('Please log in to continue');
    return <Navigate to="/" replace />;
  }

  if (blocked === 'role') {
    // Logged in but not authorized
    toast.error('You are not authorized to access this page');
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};