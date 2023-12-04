"use client";
import { ChangeEvent, useState } from "react";
import CarbonIntensityInfo from "@/components/CarbonIntensityInfo";
import DateInput from "@/components/DateInput";
import PostalCodeInput from "@/components/PostalCodeInput";

export default function Home() {
  const [selectedDate, setSelectedDate] = useState<string>("");

  const handleDateChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(event.target.value);
  };
  const [postalCode, setPostalCode] = useState<string>("");

  const handlePostalCodeChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPostalCode(event.target.value);
  };

  return (
    <main>
      <h1 className="text-4xl font-bold mt-6 text-center text-green-500">
        EV Charging Scheduler
      </h1>
      <div className="flex min-h-screen flex-col items-center justify-between p-24">
        <div className="container mx-auto flex">
          <div className="flex-1 px-8">
            <CarbonIntensityInfo />
          </div>
          <div className="flex-1">
            {" "}
            {/* Added the flex-1 class here */}
            <DateInput
              label="Select Date"
              value={selectedDate}
              onChange={handleDateChange}
            />
            <PostalCodeInput
              label="Enter Postal Code"
              value={postalCode}
              onChange={handlePostalCodeChange}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
