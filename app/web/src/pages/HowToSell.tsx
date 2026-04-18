import GetApp from "@/components/HowItWorksComponents/GetApp";
import FansOfSwifTickets from "@/components/HowToSellComponents/FansOfSwifTickets";
import Faq from "@/components/HowToSellComponents/Faq";
import SellNow from "@/components/HowToSellComponents/SellNow";
import SellTicket from "@/components/HowToSellComponents/SellTicket";
import SellYourTicket from "@/components/HowToSellComponents/SellYourTicket";



const HowToSell = () => {
  return (
   <div>
    <SellTicket />
    <SellNow />
    <FansOfSwifTickets />
    <SellYourTicket />
    <Faq/>
    <GetApp/>
   

   </div>
  );
};

export default HowToSell;
