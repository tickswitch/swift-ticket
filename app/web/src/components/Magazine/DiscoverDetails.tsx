import Container from "@/components/Common/Container";
import { useLocation } from "react-router";

const DiscoverDetails = () => {
  const { state } = useLocation();

  console.log(state);
  return (
    <div className="bg-[F4F4F4] py-[50px]">
      <Container>
        <div>
          {/* Title 1 */}
          <div>
            <p className="text-black sm:text-4xl text-2xl font-proximaSemiBold">
              {state.bodyTittle1}
            </p>
            <p className="mt-1 text-[#606060] sm:text-xl text-lg font-proximaRegular 
            ">
              {state.bodyDescription1}
            </p>
          </div>

          {/* Title 2 */}

          <div className="mt-4">
            <p className="text-black sm:text-2xl text-xl font-proximaSemiBold">
              {state.bodyTittle2}
            </p>
            <p className="mt-1 text-[#606060] sm:text-xl text-base font-proximaRegular">
              {state.bodyDescription2}
              <span className=" cursor-pointer text-primary001">
                {" "}
                highlights of the races.sm:
              </span>
            </p>
          </div>

          {/* video 1 */}
          <div>
            {/* Video iframe 1 */}
            <div className="w-full sm:h-[646px] h-[323px]  mt-4">
              <iframe
                className="w-full h-full rounded-xl"
                src={`https://www.youtube.com/embed/${state.videoLink}`}
                title="YouTube Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>

            {/* Title 3*/}
            <div className="mt-4">
              <p className="text-black sm:text-2xl text-xl font-proximaSemiBold">
                {state.vtittle1}
              </p>
              <p className="mt-1 text-[#606060] sm:text-xl text-base font-proximaRegular">
                {state.vPlace1}
              </p>
              <p className="mt-1 text-[#606060] sm:text-xl text-base font-proximaRegular ">
                {state.vdescription1}
              </p>
            </div>

            {/* Title 4*/}
            <div className="mt-4">
              <p className="text-black sm:text-2xl text-xl font-proximaSemiBold">
                {state.vtittle2}
              </p>
              <p className="mt-1 text-[#606060] sm:text-xl text-base font-proximaRegular">
                {state.vPlace2}
              </p>
              <p className="mt-1 text-[#606060] sm:text-xl text-base font-proximaRegular ">
                {state.vdescription2}
              </p>
            </div>

            {/* Title 5 */}
            <div className="mt-6">
              <p className="text-[#606060] sm:text-xl text-base font-proximaRegular">
                Missed out on Melbourne tickets? Buy or sell yours securely on
                <span className="text-primary001 cursor-pointer"> TicketSwap
                </span>
                and be part of the season opener!
              </p>
            </div>

            {/* Title 6 */}
            <div className="mt-4">
              <p className="text-black sm:text-2xl text-xl font-proximaSemiBold">
                Digital Services Act
              </p>
              <p className="mt-1 text-[#606060] sm:text-xl text-base font-proximaRegular ">
                Pursuant to Article 24 (2) of Regulation (EU) 2022/2065 (DSA),
                providers of online platforms are required to publish
                information on the average monthly active recipients of the
                service in the European Union every six months starting from
                February 17, 2023.
              </p>
            </div>

            {/* Title 7 */}
            <div className="mt-6">
              <p className="text-[#606060] sm:text-xl text-base font-proximaRegular ">
                Over the six month period from
                <span className="text-primary001 cursor-pointer">
                  {" "}
                  July 29, 2024 to February 8, 2025,{" "}
                </span>
                the average monthly active recipients of the TicketSwap service
                within the EU was well below 45 million. This information has
                been prepared for Article 24(2) of the DSA. This information may
                differ from user metrics reported in other contexts and should
                not be used for any other purposes.
                <br />
                Any inquiries regarding the Digital Services Act can be directed
                to complaints@ticketswap.com.
              </p>
            </div>
          </div>
          <div>

            
            {/* Video iframe 1 */}
            <div className="w-full sm:h-[646px] h-[323px] mt-4">
              <iframe
                className="w-full h-full rounded-xl"
                src={`https://www.youtube.com/embed/${state.videoLink}`}
                title="YouTube Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>

            {/* Title 3*/}
            <div className="mt-4">
              <p className="text-black sm:text-2xl text-xl font-proximaSemiBold">
                {state.vtittle1}
              </p>
              <p className="mt-1 text-[#606060] sm:text-xl text-base font-proximaRegular">
                {state.vPlace1}
              </p>
              <p className="mt-1 text-[#606060] sm:text-xl text-base font-proximaRegular ">
                {state.vdescription1}
              </p>
            </div>

            {/* Title 4*/}
            <div className="mt-4">
              <p className="text-black sm:text-2xl text-xl font-proximaSemiBold">
                {state.vtittle2}
              </p>
              <p className="mt-1 text-[#606060] sm:text-xl text-base font-proximaRegular">
                {state.vPlace2}
              </p>
              <p className="mt-1 text-[#606060] sm:text-xl text-base font-proximaRegular ">
                {state.vdescription2}
              </p>
            </div>

            {/* Title 5 */}
            <div className="mt-6">
              <p className="text-[#606060] sm:text-xl text-base font-proximaRegular">
                Missed out on Melbourne tickets? Buy or sell yours securely on
                <span className="text-primary001 cursor-pointer">
                  {" "}
                  TicketSwap{" "}
                </span>
                and be part of the season opener!
              </p>
            </div>

            {/* Title 6 */}
            <div className="mt-4">
              <p className="text-black sm:text-2xl text-xl font-proximaSemiBold">
                Digital Services Act
              </p>
              <p className="mt-1 text-[#606060] sm:text-xl text-base font-proximaRegular">
                Pursuant to Article 24 (2) of Regulation (EU) 2022/2065 (DSA),
                providers of online platforms are required to publish
                information on the average monthly active recipients of the
                service in the European Union every six months starting from
                February 17, 2023.
              </p>
            </div>

            {/* Title 7 */}
            <div className="mt-6">
              <p className="text-[#606060] sm:text-xl text-base font-proximaRegular ">
                Over the six month period from
                <span className="text-primary001 cursor-pointer"> July 29, 2024 to February 8, 2025,
                </span>
                the average monthly active recipients of the TicketSwap service
                within the EU was well below 45 million. This information has
                been prepared for Article 24(2) of the DSA. This information may
                differ from user metrics reported in other contexts and should
                not be used for any other purposes.
                <br />
                Any inquiries regarding the Digital Services Act can be directed
                to <span className=" underline text-primary001 cursor-pointer "> complaints@ticketswap.com.</span>
              </p>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default DiscoverDetails;
