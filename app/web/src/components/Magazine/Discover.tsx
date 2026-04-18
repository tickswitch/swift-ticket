import { image1, image2 } from "@/assets";
import { useState } from "react";
import { Link } from "react-router";
import Container from "../Common/Container";

type DiscoverProps = {
  data: {
    id: number;
    name: string;
    description: string;
    category: string;
  };
};

const Discover = ({ data }:DiscoverProps) => {
  const [hover, setHover] = useState(false);

  return (
    <div>
      <Container>
        <Link to={`/magazine/${data.id}`} state={data}>
          <div className="mt-4 relative cursor-pointer flex justify-center items-center">
            <div
              className=" relative sm:w-[428px] w-full h-[285px] overflow-hidden rounded-xl"
              onMouseEnter={() => setHover(true)}
              onMouseLeave={() => setHover(false)}
            >
              <img
                className="h-full w-full object-cover transition-all duration-300"
                src={hover ? image2 : image1}
              />

              <div className=" h-full w-full absolute top-0 right-0 left-0 bg-gradient-to-b from-black/20 via-black/40 to-black/62"></div>

              <div className=" absolute top-4 left-4">
                <button className=" cursor-pointer bg-primary001 rounded-4xl  px-4 py-2">
                  <p className="text-white font-proximaRegular text-base">
                    {data.category}
                  </p>
                </button>
              </div>

              <div
                className={`absolute left-5 ${
                  hover ? "bottom-4" : " -bottom-6"
                }`}
              >
                <p className="text-white font-proximaSemiBold text-2xl">
                  {data.name}
                </p>

                <p
                  className={`text-white text-sm font-proximaRegular w-[238px] transition-opacity duration-300 mt-1 ${
                    hover ? " opacity-100" : " opacity-0"
                  }`}
                >
                  {data.description}
                </p>
              </div>
            </div>
          </div>
        </Link>
      </Container>
    </div>
  );
};

export default Discover;
