import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { LogIn, LogOut } from 'lucide-react';

export function LoginButton() {
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  const isAuthenticated = !!identity;
  const disabled = loginStatus === 'logging-in';

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
    } else {
      try {
        await login();
      } catch (error: any) {
        console.error('Login error:', error);
        if (error.message === 'User is already authenticated') {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  return (
    <Button
      onClick={handleAuth}
      disabled={disabled}
      size="sm"
      variant={isAuthenticated ? 'outline' : 'default'}
      className="gap-2"
    >
      {isAuthenticated ? (
        <>
          <LogOut className="w-4 h-4" />
          Sign Out
        </>
      ) : (
        <>
          <LogIn className="w-4 h-4" />
          {loginStatus === 'logging-in' ? 'Signing in...' : 'Sign In'}
        </>
      )}
    </Button>
  );
}
