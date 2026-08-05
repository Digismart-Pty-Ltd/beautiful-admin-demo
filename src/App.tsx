import { useEffect, useRef } from "react";
import { BrowserRouter, Routes, Route, Link, Outlet } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";

import { StoreProvider, useStore } from "@/lib/store";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

import Home from "@/pages/Home";
import Events from "@/pages/Events";
import RunningClub from "@/pages/RunningClub";
import Membership from "@/pages/Membership";
import Join from "@/pages/Join";
import Login from "@/pages/Login";
import Admin from "@/pages/Admin";
import ScrollToTop from "@/components/ScrollToTop";
import NotificationsPage from "@/pages/Notifications";
import Gallery from "@/pages/Gallery";
import Privacy from "@/pages/Privacy";
import Support from "@/pages/Support";

const queryClient = new QueryClient();

function AuthStoreSync() {
  const { user, role, loading } = useAuth();
  const { syncAuthUser } = useStore();

  const syncRef = useRef(syncAuthUser);
  useEffect(() => {
    syncRef.current = syncAuthUser;
  });

  useEffect(() => {
    if (loading) return;
    if (!user) {
      syncRef.current(null, null, null);
      return;
    }
    const profileEmail = user.email;
    if (!profileEmail) return;
    syncRef.current(profileEmail, user.displayName ?? null, role ?? null);
  }, [loading, user, role]);

  return null;
}

function Layout() {
  return (
    <>
      <SiteHeader />
      <Outlet />
      <SiteFooter />
    </>
  );
}

function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold">Page not found</h2>
        <Link
          to="/"
          className="mt-6 inline-flex rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}

export default function App() {
  // iOS PWA bug: env(safe-area-inset-top) can miscalculate on first paint
  // in standalone mode, showing an oversized gap until the page is scrolled.
  // Forcing a tiny scroll on mount triggers the same reflow that fixes it.
  useEffect(() => {
    const t = setTimeout(() => {
      window.scrollTo(0, 1);
      window.scrollTo(0, 0);
    }, 60);
    return () => clearTimeout(t);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <StoreProvider>
          <AuthProvider>
            <AuthStoreSync />
            <ScrollToTop />
            <Routes>
              <Route element={<Layout />}>
                <Route path="/" element={<Home />} />
                <Route path="/events" element={<Events />} />
                <Route path="/running-club" element={<RunningClub />} />
                <Route path="/membership" element={<Membership />} />
                <Route path="/join" element={<Join />} />
                <Route path="/login" element={<Login />} />
                <Route path="/notifications" element={<NotificationsPage />} />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/support" element={<Support />} />
                <Route path="*" element={<NotFound />} />
              </Route>
              {/* Admin has its own layout */}
              <Route path="/admin" element={<Admin />} />
            </Routes>
            <Toaster theme="dark" position="top-center" richColors />
          </AuthProvider>
        </StoreProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}