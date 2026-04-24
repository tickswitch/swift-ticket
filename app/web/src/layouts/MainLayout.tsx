import Footer from "@/components/Common/Footer";
import Header from "@/components/Common/Header";
import { useCustomScrollRestoration } from "@/hooks/useCustomScrollRestoration";
import { cn } from "@/lib/utils";
import { Outlet, useLocation } from "react-router";
// import useCustomScrollRestoration from "@/hooks/useCustomScrollRestoration";

const MainLayout = () => {
  useCustomScrollRestoration();
  const { pathname } = useLocation();
  return (
    <div className="min-h-screen app-bg-gradient relative overflow-x-hidden">
      {/* Fixed decorative background orbs — sit behind all page content */}
      <div className="app-orb-1" aria-hidden="true" />
      <div className="app-orb-2" aria-hidden="true" />

      <Header />
      <main className={cn("relative z-[1] flex-1 px-5 lg:px-0", pathname === "/" ? "pt-2" : "pt-10")}>
        <Outlet />
      </main>
      <div className="relative z-[1]">
        <Footer />
      </div>
    </div>
  );
};

export default MainLayout;
