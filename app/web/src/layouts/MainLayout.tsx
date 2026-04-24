import Footer from "@/components/Common/Footer";
import Header from "@/components/Common/Header";
import { useCustomScrollRestoration } from "@/hooks/useCustomScrollRestoration";
import { cn } from "@/lib/utils";
import { Outlet, useLocation } from "react-router";
import { useRef, useEffect } from "react";

const MainLayout = () => {
  useCustomScrollRestoration();
  const { pathname } = useLocation();
  const orb1Ref = useRef<HTMLDivElement>(null);
  const orb2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Respect prefers-reduced-motion
    const mq = window.matchMedia("(prefers-reduced-motion: no-preference)");
    if (!mq.matches) return;

    let rafId = 0;
    let ticking = false;

    const onScroll = () => {
      if (!ticking) {
        rafId = requestAnimationFrame(() => {
          const y = window.scrollY;
          if (orb1Ref.current) {
            orb1Ref.current.style.transform = `translateY(${y * 0.35}px)`;
          }
          if (orb2Ref.current) {
            orb2Ref.current.style.transform = `translateY(${y * -0.25}px)`;
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div className="min-h-screen app-bg-gradient relative overflow-x-hidden">
      {/* Fixed decorative background orbs — sit behind all page content */}
      <div className="app-orb-1" ref={orb1Ref} aria-hidden="true" />
      <div className="app-orb-2" ref={orb2Ref} aria-hidden="true" />

      <Header />
      <main className={cn("relative z-[1] flex-1", pathname === "/" ? "pt-2" : "pt-10 px-5 lg:px-0")}>
        <Outlet />
      </main>
      <div className="relative z-[1]">
        <Footer />
      </div>
    </div>
  );
};

export default MainLayout;
