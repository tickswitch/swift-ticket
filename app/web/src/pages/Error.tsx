import { Button } from "@/components/ui/button";
import { Link } from "react-router";

const Error = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 h-screen">
      <p className="text-4xl font-semibold text-center">
        404 Page not found.!
      </p>
      <Link to={"/"}>
        {" "}
        <Button className="px-4 py-2 rounded-full bg-primary001 font-medium">Back To Home</Button>
      </Link>
    </div>
  );
};

export default Error;
