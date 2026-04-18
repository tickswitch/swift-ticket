import { CollectionData } from "@/assets/StaticData";
import { ArrowIcon } from "./HelpIcons";
import { Link } from "react-router";
import Title from "../Common/Title";

const Collection = () => {
  return (
    <div className="bg-white rounded-2xl">
      <div>
        <Title className="p-4">
          Any Question? I can help you!
        </Title>
        <p className="py-4 ">
          <hr />
        </p>
        <p className="text-xl md:text-2xl lg:text-[30px] font-semibold text-secondaryText001 p-4">
          10 Collections
        </p>
      </div>
      <div className="pt-4 ">
        {CollectionData?.map((data, idx) => {
          return (
            <Link to={"/collection-articles"} key={idx}
              className="flex items-center justify-between gap-2 px-5 p-4 bg-white text-secondaryText001 border-t border-t-gray-300 cursor-pointer hover:bg-primary001/10 transition-all duration-300"
             
            >
              <div>
                <p className="text-lg sm:text-xl md:text-2xl font-semibold">{data?.title}</p>
                <p className="text-sm sm:text-base md:text-lg lg:text-xl">{data?.description}</p>
                <p className="text-sm md:text-base pt-2">{data?.count}</p>
              </div>
              <button>
                <ArrowIcon />
              </button>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Collection;
