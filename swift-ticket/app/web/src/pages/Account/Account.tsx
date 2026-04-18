import { cn } from "@/lib/utils";
import { Link } from "react-router";

const Account = () => {


  
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
    

      {/* Basic Info Section */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-800">Basic info</h2>

        <div className="space-y-4 border rounded-2xl ">
          <div className="p-5">
            {/* Email */}
            <div className="flex flex-col items-start gap-3 py-3 border-b">
              <div>
                <div className="font-semibold text-gray-500">Email address</div>
                <div className="text-gray-900">selim.nill@gmail.com</div>
              </div>
              <Link
                to={"/email"}
                className="text-primary001 text-sm font-medium"
              >
                Edit
              </Link>
            </div>

            {/* Phone */}
            <div className="flex flex-col items-start gap-3 py-3 border-b w-full">
              <div className={cn("flex items-start justify-between w-full")}>
                <div>
                  <div className="text-sm text-gray-500">Phone number</div>
                  <div className="text-gray-900">Unverified phone</div>
                </div>
                <p className="uppercase text-xs bg-orange-400 px-3 py-1 rounded-full font-semibold text-orage-400">
                  action needed
                </p>
              </div>
              <Link
                to={"/phone"}
                className="text-primary001 text-sm font-medium"
              >
                Add phone number
              </Link>
            </div>

            {/* Identity Verification */}
            <div className="flex flex-col items-start gap-3 py-3 border-b">
              <div>
                <div className="text-sm text-gray-500">
                  Identity verification
                </div>
                <div className="text-gray-900">Mohammad Selim</div>
              </div>
              <Link
                to={"/identy-verify"}
                className="text-primary001 text-sm font-medium"
              >
                Edit
              </Link>
            </div>

            {/* Social Accounts */}
            <div className="flex flex-col items-start gap-3 py-3">
              <div>
                <div className="text-sm text-gray-500">Social accounts</div>
                <div className="text-gray-900">Facebook</div>
              </div>
              <button className="text-primary001 text-sm font-medium">
                Verify
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* payout details */}

      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-800">Bank details</h2>

        <div className="space-y-4 border rounded-2xl ">
          <div className="p-5">
            {/* Email */}
            <div className="flex flex-col items-start gap-3 py-3">
              <div>
                <div className="font-semibold text-gray-500">Bank details</div>
              </div>
              <Link to={"/bank-details"} className="text-primary001 text-sm font-medium">
                Add
              </Link>
            </div>

            
          </div>
        </div>
      </div>

      {/* Preferences */}
    </div>
  );
};

export default Account;

// <div className="space-y-6">
//     <h2 className="text-xl font-semibold text-gray-800">Payout details</h2>

//     <div className="space-y-4 border rounded-2xl ">
//       <div className="p-5">
//         {/* Email */}
//         <div className="flex flex-col items-start gap-3 py-3 border-b">
//           <div>
//             <div className="font-semibold text-gray-500">Communication</div>
//             <div className="text-gray-900">Adjust your email settings</div>
//           </div>
//           <button className="text-primary001 text-sm font-medium">
//             Edit
//           </button>
//         </div>

//         {/* Phone */}
//         <div className="flex flex-col items-start gap-3 py-3 border-b w-full">
//           <div className={cn("flex items-start justify-between w-full")}>
//             <div>
//               <div className="text-sm text-gray-500">Language</div>
//               <div className="text-gray-900">Polish (Poland)</div>
//             </div>
//           </div>
//           <button className="text-primary001 text-sm font-medium">
//             Edit
//           </button>
//         </div>
//       </div>
//     </div>
//   </div>

{
  /* Privacy */
}

// <div className="space-y-6">
//   <h2 className="text-xl font-semibold text-gray-800">Privacy</h2>

//   <div className="space-y-4 border rounded-2xl ">
//     <div className="p-5">
//       {/* Email */}
//       <div className="flex flex-col items-start gap-3 py-3 border-b">
//         <div>
//           <div className="font-semibold text-gray-500">
//             Privacy settings
//           </div>
//           <div className="text-gray-900">
//             Manage your privacy settings
//           </div>
//         </div>
//         <button className="text-primary001 text-sm font-medium">
//           Edit
//         </button>
//       </div>
//     </div>
//   </div>
// </div>
