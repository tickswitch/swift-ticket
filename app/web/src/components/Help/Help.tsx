import { CiCircleQuestion } from "react-icons/ci";
import Collection from "./Collection";
import { SearchIcon } from "./HelpIcons";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LucideMessageCircleMore } from "lucide-react";
import { cn } from "@/lib/utils";
import Messages from "./Messages";

const Help = () => {
  return (
    <div className="max-w-[871px] mx-auto pt-10">
      <div>
        <div className="py-10 flex items-center justify-between rounded-2xl">
          <div className="flex items-center gap-4">
            <Tabs defaultValue="help" className="max-w-5xl px-5 md:px-0 pt-10 md:pt-0">
              <TabsList className="flex flex-col-reverse md:flex-row gap-5 items-center justify-between w-full">
                <div className="flex items-center gap-4">
                  <TabsTrigger 
                    value="help"
                    className={cn(
                      "bg-transparent", 
                      {
                        "bg-primary001": false,  
                        "bg-white": true, 
                      }
                    )}
                  >
                    <button className="flex items-center gap-1 font-medium px-10 h-14 rounded-full focus:text-white">
                      <CiCircleQuestion size={20} />
                      Help
                    </button>
                  </TabsTrigger>
                  <TabsTrigger value="message">
                    <button className="flex items-center gap-1 focus:text-white font-medium px-10 h-14 rounded-full">
                      <LucideMessageCircleMore size={20} />
                      Message
                    </button>
                  </TabsTrigger>
                </div>
                <div className="relative w-full md:w-1/2">
                  <input
                    type="text"
                    placeholder="Search for help"
                    className="flex-1 px-3 py-4 rounded-full bg-white outline-none w-full"
                  />
                  <button className="absolute top-1/2 right-3 -translate-y-1/2">
                    <SearchIcon />
                  </button>
                </div>
              </TabsList>
              <TabsContent value="help">
                <div className="py-10">
                  <Collection />
                </div>
              </TabsContent>
              <TabsContent value="message" className="w-full">
                <div className="pt-10 w-full">
                  <Messages />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help;
