import { GetData, PostData } from "@/API/API";
import Loader from "@/components/Common/Loader";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router";

// type email = {
//   email: string;
// };

const Email = () => {
  const [email, setEmail] = useState<string>("");

  const queryClient = useQueryClient();

  type ProfileData = {
    email: string;
  };
  
  // get email
  const { data } = useQuery<ProfileData, Error>({
    queryKey: ["email"],
    queryFn: () => GetData<ProfileData>("profile"),
  });

  const emailUpdate = useMutation({
    mutationKey: ["email-update"],
    mutationFn: (payload: { new_email: string }) =>
      PostData("email/update/request", payload),
    onSuccess: () => {
      toast.success("Email update successfully");
      queryClient.invalidateQueries({ queryKey: ["email"] });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Email update failed");
    },
  });

  const handleEmailUpload = () => {
    emailUpdate.mutate({ new_email: email });
  };

  return (
    <div className="max-w-2xl mx-auto p-6 pt-14 space-y-6">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500">
        <Link to={"/profile"}> Account settings</Link> / Email address
      </div>

      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">Email address</h1>
        <p className="text-gray-600">
          Add your new email address and we'll send a link to your inbox to
          verify it.
        </p>
      </div>

      {/* Email Form */}
      <div className="py-2 space-y-4">
        <div className="space-y-2">
          <input
            type="email"
            id="email"
            onChange={(e) => setEmail(e.target.value)}
            // value={data?.email}
            defaultValue={data?.email || ""}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter your email address"
          />
        </div>

        <div className="flex items-end justify-end">
          <button
            type="submit"
            disabled={!email}
            onClick={handleEmailUpload}
            className="text-white px-6 py-2 rounded-md bg-primary001"
          >
            {emailUpdate.isPending ? (
              <Loader size={20} className="text-white" parentClass="h-10" />
            ) : (
              "Submit"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Email;
