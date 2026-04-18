import { GetData } from "@/API/API";
import Container from "@/components/Common/Container";
import Loader from "@/components/Common/Loader";
import DiscountCart from "@/components/DiscountCarts/DiscountCart";
import { useQuery } from "@tanstack/react-query";

const Cart = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["cart"],
    queryFn: () => GetData("cart"),
  });

  console.log("data", data);
  return (
    <div className="min-h-screen pt-16">
      <Container>
        {/* <p className="text-2xl md:text-4xl lg:text-5xl font-semibold">
          Your tickets
        </p> */}

        {isLoading ? (
          <Loader />
        ) : error ? (
          <p className="py-5">Something went wrong.</p>
        ) : (
          <div className="min-h-screen">
            <DiscountCart />
          </div>
        )}
      </Container>
    </div>
  );
};

export default Cart;
