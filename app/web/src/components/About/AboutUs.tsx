import { aboutBg } from "@/assets";
import Container from "../Common/Container";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { PostData } from "@/API/API";
import toast from "react-hot-toast";
import Loader from "../Common/Loader";

const AboutUs = () => {

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    company_name: "",
    company_type: "",
    region: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const submit = useMutation({
    mutationKey: ["contactForm"],
    mutationFn: async (payload: typeof formData) => PostData("contact/send", payload),
    onSuccess: () => {
      toast.success("Form submitted successfully");
    },
    onError: () => {
      toast.error("Failed to submit the form. Please try again.");
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);
    submit.mutate(formData);
    setFormData({
      first_name: "",
      last_name: "",
      company_name: "",
      company_type: "",
      region: "",
      email: "",
      phone: "",
      message: "",
    });
  }
  return (
    <div className="bg-[#F4F4F4] py-[50px] hero-orbs">
      <Container>
        <div>
          <p className="text-black sm:text-4xl text-3xl font-proximaSemiBold">
            About SwiftTickets
          </p>
          <p className="text-[#606060] sm:text-xl text-lg font-proximaRegular">
            SwiftTickets is a safe, convenient and fair place to buy and sell
            tickets for concerts, festivals, sports events, theatre and day
            trips. We protect buyers from overpricing by keeping to a maximum
            20% mark-up from the original sales price. In countries where
            specific laws and regulations determine the maximum resale price,
            SwiftTickets adjusts its mark-up accordingly. As a buyer, you know
            you’ll always be paying a fair price for your tickets. Fraud is
            prevented by user-checks and through partnerships and collaborations
            with event organisers.
          </p>
        </div>

        <div className="mt-4">
          <p className="text-black sm:text-2xl text-xl font-proximaSemiBold">

            SwiftTickets Team
          </p>
          <p className="text-[#606060] sm:text-xl text-base font-proximaRegular">

            We started SwiftTickets after watching too many fans get burned by
            scalpers and fake listings on unregulated resale groups. Every
            person on this team has queued for a ticket that never existed.
            That's why we built a platform where every listing is checked
            before it goes live, every price is capped, and every rupee is
            held safely until your ticket is confirmed real — so buying and
            selling tickets in India finally feels as safe as it should.
          </p>
          <div className="mt-4 w-full sm:h-[646px] h-[323px]   ">
            <img className="rounded-xl w-full h-full " src={aboutBg} />
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="w-full max-w-2xl mx-auto pt-20 bg-transparent space-y-5"
        >
          {/* Name fields */}
          <h1 className="text-3xl md:text-5xl font-bold text-center">Get in touch</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="text-sm mb-1">
                First name<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                className="bg-[#f7f9fc] text-black rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-400"
                required
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm mb-1">
                Last name<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                className="bg-[#f7f9fc] text-black rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-400"
                required
              />
            </div>
          </div>

          {/* Company name */}
          <div className="flex flex-col">
            <label className="text-sm mb-1">
              Company name<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="company_name"
              value={formData.company_name}
              onChange={handleChange}
              className="bg-[#f7f9fc] text-black rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-400"
              required
            />
          </div>

          {/* Company Type */}
          <div className="flex flex-col">
            <label className="text-sm mb-1">
              Company Type<span className="text-red-500">*</span>
            </label>
            <select
              name="company_type"
              value={formData.company_type}
              onChange={handleChange}
              className="bg-[#f7f9fc] text-black rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-400"
              required
            >
              <option value="">Please Select</option>
              <option value="startup">Startup</option>
              <option value="agency">Agency</option>
              <option value="enterprise">Enterprise</option>
            </select>
          </div>

          {/* Country/Region */}
          <div className="flex flex-col">
            <label className="text-sm mb-1">
              Country/Region<span className="text-red-500">*</span>
            </label>
            <select
              name="region"
              value={formData.region}
              onChange={handleChange}
              className="bg-[#f7f9fc] text-black rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-400"
              required
            >
              <option value="">Please Select</option>
              <option value="bangladesh">India</option>
              <option value="usa">Bangladesh</option>
              <option value="uk">Pakistan</option>
            </select>
          </div>

          {/* Email */}
          <div className="flex flex-col">
            <label className="text-sm mb-1">
              Email<span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="bg-[#f7f9fc] text-black rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-400"
              required
            />
          </div>

          {/* Phone */}
          <div className="flex flex-col">
            <label className="text-sm mb-1">
              Phone number<span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="bg-[#f7f9fc] text-black rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-400"
              required
            />
          </div>

          {/* Message */}
          <div className="flex flex-col">
            <label className="text-sm mb-1">Message</label>
            <textarea
              name="message"
              rows={3}
              value={formData.message}
              onChange={handleChange}
              className="bg-[#f7f9fc] text-black rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-400"
              placeholder="Type your message..."
            ></textarea>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-md transition-all flex itemcenter justify-center"
          >
            {
              submit.isPending ? <Loader size={20} className="h-fit w-fit" parentClass="w-fit h-fit" /> : "Submit"
            }
          </button>
        </form>

        {/* <div className="mt-4">
          <p className=" text-black sm:text-2xl text-xl font-proximaSemiBold">
            Press & Media Inquiries
          </p>
          <p className="text-[#606060] sm:text-xl text-base font-proximaRegular 
          ">
            For all media requests, please contact us{" "}
            <span className="cursor-pointer underline  underline-offset-3 text-primary001">
              {" "}
              here
            </span>
          </p>
          <p className="text-[#606060] sm:text-xl text-base font-proximaRegular 
          ">
            {" "}
            You can download our press kit{" "}
            <span className="cursor-pointer underline  underline-offset-3 text-primary001">
              {" "}
              here
            </span>
          </p>
        </div>

        <div className="mt-4">
          <p className=" text-black sm:text-2xl text-xl font-proximaSemiBold">
            Events & Sponsorship
          </p>
          <p className="text-[#606060] sm:text-xl text-base font-proximaRegular ">
            For all inquiries relating to brand activations & event sponsorship,
            please contact us{" "}
            <span className="cursor-pointer underline  underline-offset-3 text-primary001">
              {" "}
              here
            </span>
          </p>
        </div>

        <div className="mt-4">
          <p className="  text-black sm:text-2xl text-xl font-proximaSemiBold">
            Join Our Global Community of Live Music Fans!
          </p>
          <p className="text-[#606060] sm:text-xl text-base font-proximaRegular ">
            Check our <span className="cursor-pointer underline  underline-offset-2 text-primary001"> Instagram </span>
            to see what we’ve been up to recently at swapticket
          </p>
        </div>

        <div className="mt-4">
          <p className="text-black sm:text-2xl text-xl font-proximaSemiBold">
            Digital Services Act
          </p>
          <p className="text-[#606060] sm:text-xl text-base font-proximaRegular ">
            Pursuant to Article 24 (2) of Regulation (EU) 2022/2065 (DSA),
            providers of online platforms are required to publish information on
            the average monthly active recipients of the service in the European
            Union every six months starting from February 17, 2023.
          </p>
          <p className="mt-8 text-[#606060] sm:text-xl text-base font-proximaRegular ">
            {" "}
            Over the six month period from July 29, 2024 to February 8, 2025,
            the average monthly active recipients of the swapticket service
            within the EU was well below 45 million. This information has been
            prepared for Article 24(2) of the DSA. This information may differ
            from user metrics reported in other contexts and should not be used
            for any other purposes.
          </p>
          <p className="mt-2 text-[#606060] sm:text-xl text-base font-proximaRegular ">
            {" "}
            Any inquiries regarding the Digital Services Act can be directed to
            complaints@swapticket.com.
          </p>
        </div> */}
      </Container>
    </div>
  );
};

export default AboutUs;
