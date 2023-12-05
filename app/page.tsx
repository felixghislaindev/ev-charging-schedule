"use client"
import { ChangeEvent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { setIntensity } from '../redux/carbonIntensitySlice';
import CarbonIntensityInfo from '@/components/CarbonIntensityInfo';
import DateInput from '@/components/DateInput';
import PostalCodeInput from '@/components/PostalCodeInput';
import axios from 'axios';

interface PostcodeData {
  results?: Array<{
    components?: {
      postcode?: string;
    };
  }>;
}

interface SimplifiedCarbonIntensityData {
  data: [
    {
      data: [
        {
          intensity: {
            forecast: number;
            index: string;
          };
        }
      ];
    }
  ];
}

export default function Home() {
  const dispatch = useDispatch();
  
  const { forecast, index } = useSelector((state: RootState) => state.carbonIntensity);


  const [selectedDate, setSelectedDate] = useState<string>('');
  const handleDateChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(event.target.value);
  };

  const [postalCode, setPostalCode] = useState<string>('');
  const handlePostalCodeChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPostalCode(event.target.value);
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const reverseGeoCodeApiKey = process.env.NEXT_PUBLIC_GEOLOCATION_API_KEY;

        try {
          const reverseGeoCodeResponse = await axios.get<PostcodeData>(
            `https://api.opencagedata.com/geocode/v1/json?q=${latitude},${longitude}&key=${reverseGeoCodeApiKey}`
          );

          console.log(reverseGeoCodeResponse);
          const postcode: string | undefined =
            reverseGeoCodeResponse.data.results?.[0]?.components?.postcode;

          if (postcode) {
            console.log('Postcode:', postcode);
            try {
              const response = await axios.get<SimplifiedCarbonIntensityData>(
                `https://api.carbonintensity.org.uk/regional/postcode/${postcode?.split(" ")[0]}`
              );

              const intensity = response.data.data[0].data[0].intensity;
              dispatch(setIntensity({ forecast: intensity.forecast, index: intensity.index }));

              console.log('Intensity Forecast:', intensity.forecast);
              console.log('Intensity Index:', intensity.index);
            } catch (error) {
              console.error('Error fetching carbon intensity data:', error);
            }
          } else {
            console.log('Postcode not found in the response.');
          }
        } catch (error) {
          console.error('Error fetching reverse geocode data:', error);
        }
      },
      (error) => {
        console.error('Error getting geolocation:', error);
      }
    );
  }, [dispatch]);

  return (
    <main>
      <h1 className="text-4xl font-bold mt-6 text-center text-green-500">
        EV Charging Scheduler
      </h1>
      <div className="flex min-h-screen flex-col items-center justify-between p-24">
        <div className="container mx-auto flex">
          <div className="flex-1 px-8">
            <CarbonIntensityInfo index={index} forecast={forecast} />
          </div>
          <div className="flex-1">
            {/* Added the flex-1 class here */}
            <DateInput label="Select Date" value={selectedDate} onChange={handleDateChange} />
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
