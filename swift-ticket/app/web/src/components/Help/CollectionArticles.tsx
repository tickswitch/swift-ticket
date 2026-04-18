import { CollectionData } from "@/assets/StaticData";
import { ArrowIcon } from "./HelpIcons";
import { Link } from "react-router";

const CollectionArticles = () => {
  return (
    <div className="pt-10">
      <div className="max-w-[872px] mx-auto bg-white  rounded-2xl flex flex-col gap-4">
        {CollectionData?.map((data, idx) => {
          return (
            <div key={idx} className="flex flex-col gap-4  hover:bg-primary001/10 transition-all duration-300 rounded-2xl">
              <Link to={"/article-details"} className="flex items-center justify-between p-5">
                <div>
                  <p className="text-2xl font-semibold">{data?.title}</p>
                  <p className="text-xl text-secondaryText001">
                    {data?.description}
                  </p>
                </div>
                <button>
                  <ArrowIcon />
                </button>
              </Link>
              <hr />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CollectionArticles;
