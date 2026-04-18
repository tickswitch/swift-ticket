import {
  CartIrupe,
  cartMinus,
  cartPlus,
  ibutton, 
} from "@/assets";
import Container from "../Common/Container";
import { useLocation, useNavigate, useParams } from "react-router";
import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { GetSingleData, PostData } from "@/API/API";
import { getLocalTime } from "@/lib/getLocalTime";
import { formatEventDate } from "@/lib/formatEventDate";
import toast from "react-hot-toast";
import Loader from "../Common/Loader";
import ErrorText from "../Common/ErrorText";

type Ticket = {
  id: number;
  category: string;
  quantity: number;
  stock: number;
  pricePerTicket: number;
  totalPrice?: number;
  newquantity?: number;
};

const AddCart = () => {
  const { id, name } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, error } = useQuery({
    queryKey: ["tickets-by-types", id, name],
    queryFn: () => GetSingleData(`tickets/${id}`),
  });

  const Add = useMutation({
    mutationKey: ["addtocart"],
    mutationFn: (payload) => PostData("cart/add", payload),
    onSuccess: () => {
      toast.success("Added to cart");
      navigate("/discountcart");
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Add to cart failed");
    },
  });

  const location = useLocation();
  const state = location.state as Ticket;

  const [value, setValue] = useState(state.quantity);

  const decrementQuantity = () => {
    if (value > 1) setValue(value - 1);
  };
  const incrementQuantity = () => {
    if (state.stock > value) setValue(value + 1);
  };

  const goToDiscout = () => {
    const cart = {
      resale_ticket_id: data?.data?.id,
      quantity: data?.data?.quantity,
    };
    Add.mutate(cart);
  };
  return isLoading ? (
    <Loader />
  ) : error ? (
    <ErrorText />
  ) : (
    <div className="bg-[#F4F4F4] pt-[50px]">
      <Container className="lg:px-[225px] 2xl:px-[225px] px-5 ">
        {/* Profile Part */}
        <div className=" flex flex-col items-center justify-center sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-black sm:text-4xl text-3xl  font-proximaSemiBold text-left">
              {data?.data?.quantity} Ticket - {data?.data?.ticket_type}
            </p>
            <p className="text-[#606060] sm:text-xl text-lg  font-proximaRegular text-center">
              {getLocalTime(data?.data?.start_date, data?.data?.time)}{" "}
              {formatEventDate(data?.data?.start_date, data?.data?.time)} •
              Original ticket price: €{data?.data?.original_price}
            </p>
          </div>
          <div className="flex items-center gap-1">
            <div className="flex flex-col items-center">
              <p className="text-[#181818] sm:text-2xl text-xl  font-proximaSemiBold text-nowrap">
                {data?.data?.user?.name}
              </p>
              <p className="text-[#606060] sm:text-lg text-sm font-proximaRegular">
                Ticket Seller
              </p>
            </div>
            <div className="sm:h-[67px] h-[50px] sm:w-[67px] w-[50px] ">
              <img
                className=" rounded-full sm:h-[67px] h-[50px] sm:w-[67px] w-[50px] object-cover"
                src={data?.data?.user?.avatar_url}
              />
            </div>
          </div>
        </div>

        {/* Button Part */}
        <div className="flex flex-col gap-2 sm:flex-row items-center justify-between mt-6 border bg-primary001/10 border-primary001 rounded-md px-5  py-6 ">
          <div className="bg-white flex items-center justify-between gap-3 p-2 border-2 border-[#2FA75F] rounded-md ">
            <button
              onClick={decrementQuantity}
              className="bg-[#2FA75F] sm:p-2 p-1 rounded-sm cursor-pointer"
            >
              <img src={cartMinus} />
            </button>

            <p className="text-[#464646] font-proximaSemiBold sm:text-3xl text-xl">
              {data?.data?.quantity}
            </p>

            <button
              onClick={incrementQuantity}
              className="bg-[#2FA75F] sm:p-2 p-1 rounded-sm cursor-pointer"
            >
              <img src={cartPlus} />
            </button>
          </div>
          {/* Total Price Part */}

          <div className="flex gap-1  items-center">
            <img className="sm:h-8 sm:w-8 h-6 w-6 " src={CartIrupe} />

            <p className="text-[#181818] font-proximaSemiBold sm:text-4xl  text-2xl">
              {data?.data?.price}
            </p>
            <img className="sm:h-8 sm:w-8 h-6 w-6 " src={ibutton} />
          </div>

          <div>
            <button
              onClick={goToDiscout}
              className="bg-primary001 px-5  py-3 rounded-3xl cursor-pointer"
            >
              <p className="text-white font-proximaRegular sm:text-base text-sm text-nowrap">
                {Add.isPending ? (
                  <Loader
                    parentClass="h-7 w-auto"
                    size={30}
                    className="text-white"
                  />
                ) : (
                  <>Add to cart</>
                )}
              </p>
            </button>
          </div>
        </div>

        {/* Text Part */}
        <div className="mt-3">
          <p className="text-[#181818] sm:text-2xl text-xl  font-proximaSemiBold">
            Standard protection
          </p>
          <p className="text-[#606060] sm:text-xl text-sm font-proximaRegular text-justify">
            You’ll get the original tickets as is, plus anti-fraud checks and
            support. Lorem ipsum dolor sit amet consectetur. Et dolor pretium
            sit et. Tellus vitae urna feugiat morbi a eget pharetra eget. Nibh
            massa egestas potenti adipiscing libero urna orci id. Platea nunc
            velit ornare euismod donec ligula nisi.
          </p>
        </div>
      </Container>
    </div>
  );
};

export default AddCart;
