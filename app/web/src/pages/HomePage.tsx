import Banner from "@/components/Common/Banner";
import Container from "@/components/Common/Container";
import Concerts from "@/components/HomePage/Concerts";
import Event from "@/components/HomePage/Event";
import ExploreEvents from "@/components/HomePage/ExploreEvents";
import Feedback from "@/components/HomePage/Feedback";
import SportsEvents from "@/components/HomePage/SportsEvents";
import Trending from "@/components/HomePage/Trending";
import FestivalsForYou from "@/components/HomePage/FestivalsForYou";
import TrustBar from "@/components/HomePage/TrustBar";
import HowItWorksStrip from "@/components/HomePage/HowItWorksStrip";
import { Link } from "react-router";

const HomePage = () => {
  return (
    <>
      <main className="3xl:pb-10 -mt-2 w-[95%] mx-auto 3xl:px-0">
        <Banner />
        <TrustBar />
        <Container>
          <Event />
          <Trending />
          <FestivalsForYou />
          <SportsEvents />
          <Concerts />
          <div className="flex items-center justify-center py-10">
            <Link
              to={"/all-events"}
              className="flex items-center gap-3 bg-primary001/20 px-5 py-2 rounded-full text-primary001 font-semibold"
            >
              <svg
                aria-label="CalendarWeekend"
                width="24"
                height="24"
                fill="currentcolor"
                fill-rule="evenodd"
                clip-rule="evenodd"
                stroke-linejoin="round"
                stroke-miterlimit="1.414"
                xmlns="http://www.w3.org/2000/svg"
                role="presentation"
                focusable="false"
                viewBox="0 0 32 32"
                preserveAspectRatio="xMidYMid meet"
              >
                <path d="M28 14v9a5.006 5.006 0 01-4.783 4.995L23 28H9a5.006 5.006 0 01-4.995-4.783L4 23v-9h24zm-4 3h-1a1 1 0 00-1 1v1a1 1 0 001 1h1a1 1 0 001-1v-1a1 1 0 00-1-1zm-5 0h-1a1 1 0 00-1 1v1a1 1 0 001 1h1a1 1 0 001-1v-1a1 1 0 00-1-1zm3-13a1 1 0 01.993.883L23 5v1a5.006 5.006 0 014.995 4.783L28 11v1H4v-1a5.006 5.006 0 014.783-4.995L9 6V5a1 1 0 011.993-.117L11 5v1h10V5a1 1 0 011-1z"></path>
              </svg>
              Explore more events
            </Link>{" "}
          </div>
        </Container>
        <ExploreEvents />
        <HowItWorksStrip />
        <Container>
          <Feedback />
        </Container>
      </main>
    </>
  );
};
export default HomePage;
