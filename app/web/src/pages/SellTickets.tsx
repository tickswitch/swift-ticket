import Navbar from "@/components/SellTicketsComponents/Navbar";
import { Outlet } from "react-router";

const SellTickets = () => {
  return (
    <div className="bg-[#F4F4F4]">
      <Navbar />
      <div className="min-h-screen">
        <Outlet />
      </div>
    </div>
  );
};

export default SellTickets;
