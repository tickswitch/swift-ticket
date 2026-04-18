import { cn } from "@/lib/utils";
import { Link } from "react-router";

const IdentyVerify = () => {
  return (
    <div className="max-w-2xl mx-auto pt-20 pb-10">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500">
        <Link to={"/profile"}> Account settings</Link> / Identy Verify
      </div>
      {/* Basic Info Section */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-800">
          Identity verification
        </h2>

        <div className="space-y-4 border rounded-2xl ">
          <div className="p-5">
            {/* Email */}
            <div className="flex flex-col items-start gap-3 py-3 border-b">
              <div>
                <div className="font-semibold text-gray-500">
                  Contact details
                </div>
                <div className="text-gray-900">
                  We need to verify your address so we can pay you when your
                  ticket is sold.
                </div>
              </div>
              <Link
                to={"/contact-details"}
                className="text-primary001 text-sm font-medium"
              >
                Add your address
              </Link>
            </div>

            {/* Phone */}
            <div className="flex flex-col items-start gap-3 py-3 border-b w-full">
              <div className={cn("flex items-start justify-between w-full")}>
                <div>
                  <div className="text-sm text-gray-500">Proof of identity</div>
                  <div className="text-gray-900">
                    Passport, driver's licence or other ID
                  </div>
                </div>
                <p className="uppercase text-xs bg-orange-100 px-3 py-1 rounded-full font-semibold text-orage-400">
                  No action needed
                </p>
              </div>
            </div>

            {/* Identity Verification */}
            <div className="flex flex-col items-start gap-3 py-3 w-full">
              <div className={cn("flex items-start justify-between w-full")}>
                <div>
                  <div className="text-sm text-gray-500">
                    Additional verification
                  </div>
                  <div className="text-gray-900">
                    Bank statement, utility bill or other address document
                  </div>
                </div>
                <p className="uppercase text-xs bg-orange-100 px-3 py-1 rounded-full font-semibold text-orage-400">
                  No action needed
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IdentyVerify;
