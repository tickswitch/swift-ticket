import { CheckIcon2 } from "./EventsIcons";
import Title from "../Common/Title";
import { Link } from "react-router";
import { GetData } from "@/API/API";
import { useQuery } from "@tanstack/react-query";
import ErrorText from "../Common/ErrorText";
import Loader from "../Common/Loader";
import Container from "../Common/Container";

const AllSportsEvents = () => {

    const latlong = JSON.parse(localStorage.getItem("selectedLocationCoords") || "null");


    const locationQuery = latlong?.lat && latlong?.lon ? `?lat=${latlong.lat}&lng=${latlong.lon}&radius=100` : "";
    const { data, isLoading, error } = useQuery({
        queryKey: ["sports-nearby", latlong?.lat, latlong?.lon],
        queryFn: () => GetData(`events/sports-in-area${locationQuery}`),
    });



    return (
        <Container className="max-w-[80%]">
            <div className="pt-12">
                <div className="flex items-center justify-between">
                    <div>
                        <Title>Sports events in the area</Title>
                        <p className="text-secondaryText001">
                            Head to popular games or events.
                        </p>
                    </div>
                    {/* {data?.length >= 1 && (
          <Button className="px-5 py-2 font-medium rounded-full">
            View All
          </Button>
        )} */}
                </div>
                {isLoading ? (
                    <Loader />
                ) : error ? (
                    <ErrorText>{error?.response?.data?.message || "Something went wrong."}</ErrorText>
                ) : data?.length < 1 ? (
                    <ErrorText>No Sports Found</ErrorText>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 py-5">
                        {data &&
                            data?.map((data, idx) => (
                                <Link
                                    to={`/event-details/${data?.id}`}
                                    key={`index - ${idx}`}
                                    className="h-[98px] w-full bg-primary001/10 px-2 py-2 rounded-2xl flex items-start gap-3 hover:-translate-y-2 transition-all duration-300"
                                >
                                    <img
                                        src={data?.image}
                                        className="w-[78px] h-[80px] rounded-md"
                                    />
                                    <div className="flex items-center justify-between w-full">
                                        <div className="flex flex-col gap-1 w-full">
                                            <div className="flex items-center justify-between w-full">
                                                <p className="font-semibold text-base md:text-lg line-clamp-1">
                                                    {data?.title}
                                                </p>
                                            </div>
                                            <p className="text-secondaryText001 text-sm">
                                                {data?.location}
                                            </p>
                                            <p className="text-primary001 flex items-center gap-2 font-semibold text-sm">
                                                <CheckIcon2 /> {data?.date} {data?.time}
                                            </p>
                                        </div>
                                        {/* <button>
                  <BookmarkIcon2 />
                </button> */}
                                    </div>
                                </Link>
                            ))}
                    </div>
                )}
            </div></Container>
    );
};

export default AllSportsEvents;
