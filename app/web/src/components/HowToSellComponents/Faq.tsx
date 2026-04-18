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
                    Ut enim ad minim veniam quis nostrud exercitation ullamco
                    laboris nisi ut aliquip ex ea commodo consequat aute irure
                    dolor
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            <div className="bg-white rounded-2xl sm:px-8 sm:py-5  px-5 py-2    ">
              <Accordion type="single" collapsible>
                <AccordionItem value="item-1">
                  <AccordionTrigger className=" cursor-pointer hover:no-underline  text-[#181818] sm:text-2xl text-xl font-proximaRegular group flex justify-between items-center [&>svg]:hidden after:hidden">
                    <span>When did Webflow was founded?</span>
                    <span>
                      <div className=" w-8 h-8 group-data-[state=open]:bg-primary001 bg-primary001/8 rounded-sm pl-1 pt-1">
                        <Plus className="h-6 w-6 text-[#6F6C90] group-data-[state=open]:hidden" />
                        <Minus className="h-6 w-6 text-white group-data-[state=open]:block hidden " />
                      </div>
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="text-[#606060] sm:text-xl tex-base font-proximaRegular">
                    Ut enim ad minim veniam quis nostrud exercitation ullamco
                    laboris nisi ut aliquip ex ea commodo consequat aute irure
                    dolor
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            <div className="bg-white rounded-2xl sm:px-8 sm:py-5  px-5 py-2      ">
              <Accordion type="single" collapsible>
                <AccordionItem value="item-1">
                  <AccordionTrigger className=" cursor-pointer hover:no-underline  text-[#181818] sm:text-2xl text-xl font-proximaRegular group flex justify-between items-center [&>svg]:hidden after:hidden">
                    <span>Is NoCode the future of the web?</span>
                    <span>
                      <div className=" w-8 h-8 group-data-[state=open]:bg-primary001 bg-primary001/8 rounded-sm pl-1 pt-1">
                        <Plus className="h-6 w-6 text-[#6F6C90] group-data-[state=open]:hidden" />
                        <Minus className="h-6 w-6 text-white group-data-[state=open]:block hidden " />
                      </div>
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="text-[#606060]sm:text-xl tex-base font-proximaRegular">
                    Ut enim ad minim veniam quis nostrud exercitation ullamco
                    laboris nisi ut aliquip ex ea commodo consequat aute irure
                    dolor
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
                    <span>Is NoCode the future of the web?</span>
                    <span>
                      <div className=" w-8 h-8 group-data-[state=open]:bg-primary001 bg-primary001/8 rounded-sm pl-1 pt-1">
                        <Plus className="h-6 w-6 text-[#6F6C90] group-data-[state=open]:hidden" />
                        <Minus className="h-6 w-6 text-white group-data-[state=open]:block hidden " />
                      </div>
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="text-[#606060] sm:text-xl tex-base font-proximaRegular">
                    Ut enim ad minim veniam quis nostrud exercitation ullamco
                    laboris nisi ut aliquip ex ea commodo consequat aute irure
                    dolor
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            <div className="bg-white rounded-2xl sm:px-8 sm:py-5  px-5 py-2  ">
              <Accordion type="single" collapsible>
                <AccordionItem value="item-1">
                  <AccordionTrigger className=" cursor-pointer hover:no-underline  text-[#181818] sm:text-2xl text-xl font-proximaRegular group flex justify-between items-center [&>svg]:hidden after:hidden">
                    <span>How to launch a Webflow website?</span>
                    <span>
                      <div className=" w-8 h-8 group-data-[state=open]:bg-primary001 bg-primary001/8 rounded-sm pl-1 pt-1">
                        <Plus className="h-6 w-6 text-[#6F6C90] group-data-[state=open]:hidden" />
                        <Minus className="h-6 w-6 text-white group-data-[state=open]:block hidden " />
                      </div>
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="text-[#606060] sm:text-xl tex-base font-proximaRegular">
                    Ut enim ad minim veniam quis nostrud exercitation ullamco
                    laboris nisi ut aliquip ex ea commodo consequat aute irure
                    dolor
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            <div className="bg-white rounded-2xl sm:px-8 sm:py-5  px-5 py-2  ">
              <Accordion type="single" collapsible>
                <AccordionItem value="item-1">
                  <AccordionTrigger className=" cursor-pointer hover:no-underline  text-[#181818] sm:text-2xl text-xl font-proximaRegular group flex justify-between items-center [&>svg]:hidden after:hidden">
                    <span>Who are the Webflow founders?</span>
                    <span>
                      <div className=" w-8 h-8 group-data-[state=open]:bg-primary001 bg-primary001/8 rounded-sm pl-1 pt-1">
                        <Plus className="h-6 w-6 text-[#6F6C90] group-data-[state=open]:hidden" />
                        <Minus className="h-6 w-6 text-white group-data-[state=open]:block hidden " />
                      </div>
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="text-[#606060] sm:text-xl tex-base font-proximaRegular">
                    Ut enim ad minim veniam quis nostrud exercitation ullamco
                    laboris nisi ut aliquip ex ea commodo consequat aute irure
                    dolor
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
