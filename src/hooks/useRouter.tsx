import React, { createContext, useContext, useEffect, useRef, useState } from 'react';

interface RouterContextType {
  currentPath: string;
  previousPath: string | null;
  navigate: (to: string, options?: { replace?: boolean }) => void;
}

const RouterContext = createContext<RouterContextType>({
  currentPath: '/',
  previousPath: null,
  navigate: () => {},
});

function normalizePath(pathname: string): string {
  if (!pathname || pathname === '') return '/';
  // Strip trailing slash except root
  if (pathname.length > 1 && pathname.endsWith('/')) {
    return pathname.slice(0, -1);
  }
  return pathname;
}

export const RouterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return normalizePath(window.location.pathname);
    }
    return '/';
  });
  const [previousPath, setPreviousPath] = useState<string | null>(null);
  const currentPathRef = useRef(currentPath);
  currentPathRef.current = currentPath;

  useEffect(() => {
    const handlePopState = () => {
      const next = normalizePath(window.location.pathname);
      setPreviousPath(currentPathRef.current);
      setCurrentPath(next);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (to: string, options?: { replace?: boolean }) => {
    const target = normalizePath(to);
    if (typeof window !== 'undefined') {
      if (target === currentPathRef.current) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      if (options?.replace) {
        window.history.replaceState(null, '', target);
      } else {
        window.history.pushState(null, '', target);
      }
      setPreviousPath(currentPathRef.current);
      setCurrentPath(target);
    }
  };

  return (
    <RouterContext.Provider value={{ currentPath, previousPath, navigate }}>
      {children}
    </RouterContext.Provider>
  );
};

export function useRouter() {
  return useContext(RouterContext);
}

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  replace?: boolean;
}

export const Link: React.FC<LinkProps> = ({ href, replace, onClick, children, ...rest }) => {
  const { navigate } = useRouter();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onClick) onClick(e);
    // Don't intercept if modifier keys were pressed (open in new tab / window)
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.altKey || e.shiftKey) {
      return;
    }
    e.preventDefault();
    navigate(href, { replace });
  };

  return (
    <a href={href} onClick={handleClick} {...rest}>
      {children}
    </a>
  );
};
