"use client";
import { useEffect, useState, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { initializeUser } from "@/lib/user";
import { migrateAnonData } from "@/data/storage";
import { analytics } from "@/lib/analytics";

const STORAGE_KEY = "therapy_user_id";
const REDIRECT_PATH_KEY = "quit_redirect_path"; // localStorage key — survives cross-domain redirects

// Returns user id only if it looks like a real numeric ID (4-8 digits), not a UUID
const isRealUserId = (id: string | null): boolean => {
  if (!id) return false;
  return /^\d{4,8}$/.test(id.trim());
};

export const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const [isReady, setIsReady] = useState<boolean>(false);
  const isAuthenticating = useRef(false);
  const pathname = usePathname() || "";
  const router = useRouter();

  useEffect(() => {
    console.log('[AuthGuard] Component mounted');
  }, []);

  // -----------------------------------------------------------------------
  // Strip stale auth params from URL for ALREADY-AUTHENTICATED users.
  // -----------------------------------------------------------------------
  useEffect(() => {
    const savedUserId = localStorage.getItem(STORAGE_KEY);
    if (!isRealUserId(savedUserId)) return;

    const urlParams = new URLSearchParams(window.location.search);
    const hasAuthParams =
      urlParams.has("token") || urlParams.has("userId") || urlParams.has("user_id");
    if (!hasAuthParams) return;

    urlParams.delete("token");
    urlParams.delete("userId");
    urlParams.delete("user_id");
    const cleanSearch = urlParams.toString();
    router.replace(pathname + (cleanSearch ? `?${cleanSearch}` : ""));
  }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  // -----------------------------------------------------------------------
  // Main auth flow — runs ONCE on mount.
  // -----------------------------------------------------------------------
  useEffect(() => {
    const checkAuth = async () => {
      console.log('[AuthGuard] useEffect running');
      if (isAuthenticating.current) {
        console.log('[AuthGuard] Already authenticating, skipping...');
        return;
      }
      isAuthenticating.current = true;

      // 1. Already authenticated — just render
      const savedUserId = localStorage.getItem(STORAGE_KEY);
      if (isRealUserId(savedUserId)) {
        analytics.identifyUser(savedUserId!);
        analytics.trackSessionStarted({ is_returning_user: true, language: navigator.language });
        setIsReady(true);
        return;
      }

      // 2. Check for auth credentials in the URL (returning from auth portal)
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get("token");
      const urlUserId = urlParams.get("userId") || urlParams.get("user_id");

      if (token || urlUserId) {
        if (isRealUserId(urlUserId)) {
          console.log(`[Auth] userId received from URL: ${urlUserId}`);
          localStorage.setItem(STORAGE_KEY, urlUserId!);
          await migrateAnonData(urlUserId!);
          await initializeUser(urlUserId!);
          analytics.identifyUser(urlUserId!);
          analytics.trackSessionStarted({ is_returning_user: false, language: navigator.language });
          setIsReady(true);
          restoreAndNavigate(router, pathname);
          return;
        }

        if (token) {
          try {
            console.log("[Auth] Exchanging token for user_id...");
            const resp = await fetch("https://api.mantracare.com/user/user-info", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ token }),
            });

            if (resp.ok) {
              const data = await resp.json();
              const userId = data.user_id?.toString() || data.id?.toString();
              if (userId) {
                console.log(`[Auth] user_id from API: ${userId}`);
                localStorage.setItem(STORAGE_KEY, userId);
                await migrateAnonData(userId);
                await initializeUser(userId);
                analytics.identifyUser(userId);
                analytics.trackSessionStarted({ is_returning_user: false, language: navigator.language });
                setIsReady(true);
                restoreAndNavigate(router, pathname);
                return;
              }
            }
          } catch (err) {
            console.warn("[Auth] Token exchange failed (CORS?):", err);
          }
        }

        const fallback = urlUserId || token!;
        console.warn(`[Auth] Fallback — using token as ID: ${fallback}`);
        localStorage.setItem(STORAGE_KEY, fallback);
        await migrateAnonData(fallback);
        await initializeUser(fallback);
        analytics.identifyUser(fallback);
        analytics.trackSessionStarted({ is_returning_user: false, language: navigator.language });
        setIsReady(true);
        restoreAndNavigate(router, pathname);
        return;
      }

      const pathToRestore = pathname + window.location.search;
      if (pathToRestore !== "/" && pathToRestore !== "") {
        localStorage.setItem(REDIRECT_PATH_KEY, pathToRestore);
        console.log(`[Auth] Saved path to restore after auth: ${pathToRestore}`);
      }

      const returnUrl = `https://platform.mantracare.com/quit`;
      console.log("[Auth] No session — redirecting to auth portal.");
      window.location.href = `https://web.mantracare.com/app/quit?redirect_url=${encodeURIComponent(returnUrl)}`;
    };

    checkAuth();
  }, []);

  if (!isReady) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return <>{children}</>;
};

function restoreAndNavigate(router: ReturnType<typeof useRouter>, currentPath: string) {
  const savedPath = localStorage.getItem(REDIRECT_PATH_KEY);
  localStorage.removeItem(REDIRECT_PATH_KEY);

  let targetPath = savedPath;
  if (!targetPath) {
    targetPath = currentPath !== "/" && currentPath !== "" ? currentPath : "/";
  }

  const currentFull = window.location.pathname + window.location.search;
  const basename = "/quit";
  const absoluteTarget = basename + (targetPath.startsWith('/') ? targetPath : '/' + targetPath);
  
  if (currentFull !== absoluteTarget) {
    console.log(`[Auth] Restoring to target path: ${targetPath}`);
    router.replace(targetPath);
  } else {
    console.log(`[Auth] Already at target path, skipping redundant navigation.`);
  }
}
