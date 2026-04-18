import { useEffect, useRef } from "react";
import { useLocation } from "react-router";

export const useCustomScrollRestoration = () => {
  const { pathname } = useLocation();
  const isRestoringRef = useRef(false);

  useEffect(() => {
    // Save current scroll position before pathname changes
    const currentPath = pathname;
    
    return () => {
      // Save scroll position when leaving the route
      if (!isRestoringRef.current) {
        localStorage.setItem(`scrollPosition_${currentPath}`, window.scrollY.toString());
      }
    };
  }, [pathname]);

  useEffect(() => {
    // Restore scroll position after route change and content render
    const restoreScroll = () => {
      const savedPosition = localStorage.getItem(`scrollPosition_${pathname}`);
      isRestoringRef.current = true;
      
      if (savedPosition) {
        // Use setTimeout to ensure DOM is fully rendered
        setTimeout(() => {
          window.scrollTo(0, parseInt(savedPosition, 10));
          isRestoringRef.current = false;
        }, 0);
      } else {
        // Scroll to top for new routes
        setTimeout(() => {
          window.scrollTo(0, 0);
          isRestoringRef.current = false;
        }, 0);
      }
    };

    restoreScroll();
  }, [pathname]);

  useEffect(() => {
    // Throttled scroll handler to save position
    let timeoutId: NodeJS.Timeout;
    
    const handleScroll = () => {
      if (isRestoringRef.current) return;
      
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        localStorage.setItem(`scrollPosition_${pathname}`, window.scrollY.toString());
      }, 150); // Throttle to avoid excessive localStorage writes
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [pathname]);
};