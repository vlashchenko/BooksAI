'use client'

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

const withAuth = <P extends object>(WrappedComponent: React.ComponentType<P>) => {
  const AuthComponent = (props: P) => {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
      if (status === 'loading') return; // Do nothing while loading
      if (!session) {
        // Redirect to login if not authenticated
        router.push('/login');
      }
    }, [session, status, router]);

    // Render the wrapped component only if authenticated
    if (session) {
      return <WrappedComponent {...props} />;
    }

    // You can return a loading spinner or null while loading
    return null;
  };

  // Add display name for debugging purposes
  AuthComponent.displayName = `WithAuth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return AuthComponent;
};

export default withAuth;