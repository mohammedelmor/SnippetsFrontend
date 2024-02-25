import { ReactNode, useEffect } from 'react';
import { useSession, signIn } from 'next-auth/react';

const withAuth = (WrappedComponent: React.ComponentType<any>) => {
    const WithAuthComponent = (props: any): ReactNode => {
        const { data: session, status } = useSession();

        useEffect(() => {
            if (status === 'unauthenticated') {
                signIn();
            }
        }, [status]);

        // If session exists, render the wrapped component
        if (session) {
            return <WrappedComponent {...props} />;
        }

        // If session doesn't exist, redirect to login or show loading
        return null;
    };

    WithAuthComponent.displayName = `WithAuth(${getDisplayName(WrappedComponent)})`;

    return WithAuthComponent;
};

function getDisplayName(WrappedComponent: React.ComponentType<any>) {
    return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

export default withAuth;