import { Link } from "react-router";

const Phone = () => {
  return (
    <div className="max-w-2xl mx-auto p-6 pt-14 space-y-6">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500">
        <Link to={"/profile"}> Account settings</Link> / Phone Number
      </div>

      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">Phone Number</h1>
        <p className="text-gray-600">
          Add your mobile number for verification and important updates by SMS. Your number will always stay private.
        </p>
      </div>

      {/* Email Form */}
      <div className="py-2 space-y-4">
        <div className="space-y-2">
           
          <input
            type="number"
            id="number"
            defaultValue=""
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter your phone number"
          />
        </div>

       <div className="flex items-end justify-end">
         <button
          type="submit"
          className="text-white px-6 py-2 rounded-md bg-primary001"
        >
          Submit
        </button>
       </div>
      </div>
    </div>
  );
};

export default Phone;
