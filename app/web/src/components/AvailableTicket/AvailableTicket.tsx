import {
  profile1,
  profile2,
  profile3,
  profile4,
  profile5,
  profile6,
  rupe,
} from "@/assets";
import Container from "@/components/Common/Container";
import { Switch } from "@/components/ui/switch";
import { Link, useParams } from "react-router";
import { TickertAlertIcons } from "../TicketAlerts/TickertAlertIcons";
import { useMutation, useQuery } from "@tanstack/react-query";
import { GetSingleData, PostData } from "@/API/API";
import Loader from "../Common/Loader";
import ErrorText from "../Common/ErrorText";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
 

const tickets = [
  {
    id: 1,
    quantity: 1,
    stock: 2,
    category: "VIP Gallery",
    pricePerTicket: 200.0,
    currencyIcon: rupe,
    image: profile1,
    original_ticket_price: 400.0,
    time: "Today, 9:00 PM",
    name: "Leganes Osasuna",
    place: "Estadio Municipal da Butarque,Leganes",
    totalPrice: 0.0,
    newquantity: 0,
  },
  {
    id: 2,
    quantity: 1,
    stock: 1,
    category: "Regular",
    pricePerTicket: 150.0,
    currencyIcon: rupe,
    image: profile2,
    original_ticket_price: 400.0,
    time: "Today, 9:00 PM",
    name: "Leganes Osasuna",
    place: "Estadio Municipal de Butarque, Leganes",
    totalPrice: 0.0,
  },
  {
    id: 3,
    quantity: 1,
    stock: 3,
    category: "VIP Gallery",
    pricePerTicket: 300.0,
    currencyIcon: rupe,
    image: profile3,
    original_ticket_price: 350.0,
    time: "Today, 7:30 PM",
    name: "Real Zaragoza vs Eibar",
    place: "La Romareda, Zaragoza",
    totalPrice: 0.0,
  },
  {
    id: 4,
    quantity: 1,
    stock: 5,
    category: "Regular",
    pricePerTicket: 150.0,
    currencyIcon: rupe,
    image: profile4,
    original_ticket_price: 420.0,
    time: "Tomorrow, 6:00 PM",
    name: "Malaga CF vs Albacete",
    place: "La Rosaleda, Malaga",
    totalPrice: 0.0,
  },
  {
    id: 5,
    quantity: 1,
    stock: 10,
    category: "VIP Gallery",
    pricePerTicket: 300.0,
    currencyIcon: rupe,
    image: profile5,
    original_ticket_price: 380.0,
    time: "Tomorrow, 8:00 PM",
    name: "Sporting Gijon vs Tenerife",
    place: "El Molinon, Gijon",
    totalPrice: 0.0,
  },
  {
    id: 6,
    quantity: 1,
    stock: 20,
    category: "Regular",
    pricePerTicket: 150.0,
    currencyIcon: rupe,
    image: profile6,
    original_ticket_price: 410.0,
    time: "Today, 10:00 PM",
    name: "Racing Santander vs Huesca",
    place: "Campos de Sport de El Sardinero, Santander",
    totalPrice: 0.0,
  },
];

localStorage.setItem("availableTickets", JSON.stringify(tickets));

const AvailableTicket = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isNotificationOn, setIsNotificationOn] = useState(false);
  const { id, name } = useParams();
  const { data, isLoading, error } = useQuery({
    queryKey: ["tickets-by-types", id, name],
    queryFn: () => GetSingleData(`events/${id}/tickets/${name}`),
  });

  useEffect(() => {
    const savedState = localStorage.getItem(`notification_${id}`);
    if (savedState !== null) {
      setIsNotificationOn(JSON.parse(savedState));
    }
    setIsInitialized(true);
  }, [id]);

  const notification = useMutation({
    mutationKey: ["notification"],
    mutationFn: (payload) => {
      // Replace with your actual API call
      return PostData(`events/notification/${id}`, payload);
      // return Promise.resolve(payload);
    },
    onSuccess: (data) => {
      // Backend sends status: "on" | "off"
      const newState = data?.status === "on";

      setIsNotificationOn(newState);
      localStorage.setItem(`notification_${id}`, JSON.stringify(newState));

      toast.success(
        data?.message ||
          `Notification ${newState ? "enabled" : "disabled"} successfully`
      );
      console.log("Notification response:", data);
    },

    onError: (err) => {
      toast.error(err?.message || "Failed to apply changes");
      // Revert the switch state on error
      setIsNotificationOn((prev) => prev);
    },
  });

  const handleNotificationToggle = (checked) => {
    // Update UI immediately for better UX
    setIsNotificationOn(checked);

    // Send API request with correct notify value
    const notifyValue = checked ? true : false;
    const payload = { notify: notifyValue };

    notification.mutate(payload);
  };

  return isLoading ? (
    <Loader />
  ) : error ? (
    <ErrorText />
  ) : (
    <div className="bg-[#F4F4F4] py-[50px]">
      <Container>
        {/* Tittle */}
        <div className="mx-auto">
          <p className="text-black sm:text-4xl text-3xl font-proximaSemiBold text-center">
            {data?.event?.title}
          </p>
          <p className="text-[#606060] text-center sm:text-xl text-lg font-proximaRegular ">
            {data?.event?.venue}
          </p>
          {/* <p className="text-[#606060] text-center sm:text-xl text-lg font-proximaRegular ">
            902 available * 2931 sold * 2136 wanted
          </p> */}
        </div>

        {/* Ticket Alerts */}

        {/* {isInitialized && (
          <div className="my-6 mx-auto flex justify-between items-center gap-2 sm:p-4 p-3 sm:w-4/6 w-full  border border-[#FF6D00] rounded-xl  bg-[#FF7E35]/10">
            <div className="flex gap-2 items-center justify-center">
              <p className="bg-[#FF7E35] p-4 rounded-md ">
                <TickertAlertIcons />
              </p>
              <div>
                <p className="text-[#606060] sm:text-xl text-lg font-proximaSemiBold">
                  Ticket alerts
                </p>
                <p className="text-[#949494] sm:text-base text-sm font-proximaRegular">
                  Get notified when a ticket becomes available
                </p>
              </div>
            </div>
          </div>
        )} */}
        <div className="flex flex-col sm:flex-row items-center justify-between max-w-6xl gap-5 lg:gap-[300px] bg-[#FF6D00]/10 border border-[#FF6D00] rounded-2xl p-4 mx-auto">
          <div className="flex items-center gap-2 w-full">
            <p className="bg-[#FF7E35] p-4 rounded-md">
              <TickertAlertIcons />
            </p>
            <div className="w-full">
              <p className="text-2xl font-semibold text-[#606060]">
                Ticket alerts
              </p>
              <p className="text-gray-600">
                Get notified when a ticket becomes available
              </p>
            </div>
          </div>
          <Switch
            id="notification-switch"
            on="ON"
            off="OFF"
            checked={isNotificationOn}
            onCheckedChange={handleNotificationToggle}
            disabled={notification.isLoading}
          />
        </div>

        <div className="p-5">
          <p className="text-[#181818] text-2xl font-proximaSemiBold">
            Available
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-2  px-5">
          {data?.tickets?.map((ticket) => {
            console.log("url", ticket?.user?.avatar_url);
            return (
              <Link
                key={ticket.id}
                to={`/addtocart/${ticket?.id}`}
                state={ticket}
              >
                <div className="cursor-pointer mt-3 bg-white h-[98px] w-full rounded-xl px-3 py-2 flex items-center justify-between">
                  <div className=" flex items-center gap-3">
                    <div className="  overflow-hidden">
                      <img
                        className=" rounded-sm w-[78px] h-[78px] object-cover"
                        src={ticket.user?.avatar_url}
                      />
                    </div>
                    <div>
                      <p className="text-black sm:text-xl text-lg  font-proximaSemiBold">
                        {ticket?.per_available_quantity} Tickets
                      </p>
                      <p className="text-[#2FA75F] text-base font-proximaRegular">
                        {ticket.ticket_type}
                      </p>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 ">
                      <p className="text-primary001 sm:text-xl text-lg font-proximaSemiBold">
                        {ticket.price}
                      </p>
                      <img src={ticket?.currencyIcon} />
                    </div>
                    <div>
                      <p className="text-[#606060] font-proximaRegular text-base text-center">
                        Per Ticket
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </Container>
    </div>
  );
};

export default AvailableTicket;
