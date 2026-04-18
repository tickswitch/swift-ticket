import Footer from "@/components/Common/Footer";
import Header from "@/components/Common/Header";
import { useCustomScrollRestoration } from "@/hooks/useCustomScrollRestoration";
import { cn } from "@/lib/utils";
import { Outlet,  useLocation } from "react-router";
// import useCustomScrollRestoration from "@/hooks/useCustomScrollRestoration";

const MainLayout = () => {
  useCustomScrollRestoration();
  const { pathname } = useLocation();
  return (
    <div className="bg-[#F4F4F4] min-h-screen"> 
      <div>
        <Header />
      </div>
      <main className={cn("flex-1 px-5 lg:px-0", pathname === "/" ? "pt-2" : "pt-10")}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
