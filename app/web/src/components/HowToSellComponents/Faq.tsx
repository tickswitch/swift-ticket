import { Minus, Plus } from "lucide-react";
import Container from "../Common/Container";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const Faq = () => {
  return (
    <div className="bg-[#F4F4F4] py-8">
      <Container>
        <p className="text-[#181818] sm:text-4xl text-3xl font-proximaSemiBold">
          Frequently asked question
        </p>

        <div className="mt-5 md:flex-row md:justify-between md:items-start gap-5 flex flex-col" >

            <div className="flex flex-col gap-5 justify-between w-full  ">
            <div className="bg-white rounded-2xl sm:px-8 sm:py-5  px-5 py-2    ">
              <Accordion type="single" collapsible>
                <AccordionItem value="item-1">
                  <AccordionTrigger className=" cursor-pointer hover:no-underline  text-[#181818] sm:text-2xl text-xl font-proximaRegular group flex justify-between items-center [&>svg]:hidden after:hidden">
                    <span>How do I sell tickets online?</span>
                    <span>
                      <div className=" w-8 h-8 group-data-[state=open]:bg-primary001 bg-primary001/8 rounded-sm pl-1 pt-1">
                        <Plus className="h-6 w-6 text-[#6F6C90] group-data-[state=open]:hidden" />
                        <Minus className="h-6 w-6 text-white group-data-[state=open]:block hidden " />
                      </div>
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="text-[#606060] sm:text-xl tex-base font-proximaRegular">
                    Upload your ticket, confirm the event and seat details, and
                    set your price — our 9-step wizard walks you through it in
                    a few minutes. Once approved, it's live for buyers.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            <div className="bg-white rounded-2xl sm:px-8 sm:py-5  px-5 py-2    ">
              <Accordion type="single" collapsible>
                <AccordionItem value="item-1">
                  <AccordionTrigger className=" cursor-pointer hover:no-underline  text-[#181818] sm:text-2xl text-xl font-proximaRegular group flex justify-between items-center [&>svg]:hidden after:hidden">
                    <span>Is there a limit on how much I can charge?</span>
                    <span>
                      <div className=" w-8 h-8 group-data-[state=open]:bg-primary001 bg-primary001/8 rounded-sm pl-1 pt-1">
                        <Plus className="h-6 w-6 text-[#6F6C90] group-data-[state=open]:hidden" />
                        <Minus className="h-6 w-6 text-white group-data-[state=open]:block hidden " />
                      </div>
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="text-[#606060] sm:text-xl tex-base font-proximaRegular">
                    Yes — listings are capped at 120% of the ticket's original
                    face value. The cap is enforced automatically when you set
                    your price, so buyers always know they're getting a fair
                    deal.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            <div className="bg-white rounded-2xl sm:px-8 sm:py-5  px-5 py-2      ">
              <Accordion type="single" collapsible>
                <AccordionItem value="item-1">
                  <AccordionTrigger className=" cursor-pointer hover:no-underline  text-[#181818] sm:text-2xl text-xl font-proximaRegular group flex justify-between items-center [&>svg]:hidden after:hidden">
                    <span>What fees do I pay as a seller?</span>
                    <span>
                      <div className=" w-8 h-8 group-data-[state=open]:bg-primary001 bg-primary001/8 rounded-sm pl-1 pt-1">
                        <Plus className="h-6 w-6 text-[#6F6C90] group-data-[state=open]:hidden" />
                        <Minus className="h-6 w-6 text-white group-data-[state=open]:block hidden " />
                      </div>
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="text-[#606060]sm:text-xl tex-base font-proximaRegular">
                    A 6% seller fee (₹25 minimum) is deducted from your payout
                    — it's fixed the moment you list, so there are no surprise
                    deductions later.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            </div>
      


       
            <div className="flex flex-col gap-5 justify-between w-full ">

              <div className="bg-white rounded-2xl sm:px-8 sm:py-5  px-5 py-2  ">
              <Accordion type="single" collapsible>
                <AccordionItem value="item-1">
                  <AccordionTrigger className=" cursor-pointer hover:no-underline  text-[#181818] sm:text-2xl text-xl font-proximaRegular group flex justify-between items-center [&>svg]:hidden after:hidden">
                    <span>When do I get paid?</span>
                    <span>
                      <div className=" w-8 h-8 group-data-[state=open]:bg-primary001 bg-primary001/8 rounded-sm pl-1 pt-1">
                        <Plus className="h-6 w-6 text-[#6F6C90] group-data-[state=open]:hidden" />
                        <Minus className="h-6 w-6 text-white group-data-[state=open]:block hidden " />
                      </div>
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="text-[#606060] sm:text-xl tex-base font-proximaRegular">
                    Your buyer's payment is held in escrow until your ticket is
                    confirmed valid — you're paid out right after that check
                    clears, not before.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            <div className="bg-white rounded-2xl sm:px-8 sm:py-5  px-5 py-2  ">
              <Accordion type="single" collapsible>
                <AccordionItem value="item-1">
                  <AccordionTrigger className=" cursor-pointer hover:no-underline  text-[#181818] sm:text-2xl text-xl font-proximaRegular group flex justify-between items-center [&>svg]:hidden after:hidden">
                    <span>Do I need to upload proof of my ticket?</span>
                    <span>
                      <div className=" w-8 h-8 group-data-[state=open]:bg-primary001 bg-primary001/8 rounded-sm pl-1 pt-1">
                        <Plus className="h-6 w-6 text-[#6F6C90] group-data-[state=open]:hidden" />
                        <Minus className="h-6 w-6 text-white group-data-[state=open]:block hidden " />
                      </div>
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="text-[#606060] sm:text-xl tex-base font-proximaRegular">
                    Yes — every ticket is checked against its original booking
                    before listing and again at the gate, so buyers know
                    what they're getting is real.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            <div className="bg-white rounded-2xl sm:px-8 sm:py-5  px-5 py-2  ">
              <Accordion type="single" collapsible>
                <AccordionItem value="item-1">
                  <AccordionTrigger className=" cursor-pointer hover:no-underline  text-[#181818] sm:text-2xl text-xl font-proximaRegular group flex justify-between items-center [&>svg]:hidden after:hidden">
                    <span>What if my ticket doesn't sell?</span>
                    <span>
                      <div className=" w-8 h-8 group-data-[state=open]:bg-primary001 bg-primary001/8 rounded-sm pl-1 pt-1">
                        <Plus className="h-6 w-6 text-[#6F6C90] group-data-[state=open]:hidden" />
                        <Minus className="h-6 w-6 text-white group-data-[state=open]:block hidden " />
                      </div>
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="text-[#606060] sm:text-xl tex-base font-proximaRegular">
                    You can remove your listing at any time before it sells —
                    there's no penalty for changing your mind.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
            </div>
      

        </div>
      </Container>
    </div>
  );
};

export default Faq;
