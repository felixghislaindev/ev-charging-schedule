"use client"
import { ChangeEvent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { setIntensity } from '../redux/carbonIntensitySlice';
import CarbonIntensityInfo from '@/components/CarbonIntensityInfo';
import DateInput from '@/components/DateInput';
import PostalCodeInput from '@/components/PostalCodeInput';
import axios from 'axios';
import { IntensityData, SimplifiedCarbonIntensityData, PostcodeData } from '@/types';


export default function Home() {
  const dispatch = useDispatch();
  const { forecast, index } = useSelector((state: RootState) => state.carbonIntensity);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const formatIntensityMessage = (lowestIntensity: IntensityData | null) => {
    if (!lowestIntensity) {
      return 'No intensity data available.';
    }

    const { from, to, intensity } = lowestIntensity;

    const formattedFrom = new Date(from).toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });

    const formattedTo = new Date(to).toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });

    return `Lowest intensity period: From ${formattedFrom} to ${formattedTo} - Forecast: ${intensity.forecast}, Index: ${intensity.index}`;
  };
  const [lowestIntensityMessage, setLowestIntensityMessage] = useState<string>('');
  const handleDateChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const newDate = event.target.value;
    setSelectedDate(newDate);

    try {
      const response = await axios.get<{ data: IntensityData[] }>(
        `https://api.carbonintensity.org.uk/intensity/date/${newDate}`
      );
    
      const currentDate = new Date();
      const currentHours = currentDate.getHours();
      const currentMinutes = currentDate.getMinutes();
      const currentTime = `${currentHours}:${currentMinutes}`;
    
      const lowestIntensity = response.data.data.reduce(
        (minObject, currentObject) => {
          if (
            !minObject ||
            (currentObject.from < currentTime && currentObject.from > minObject.from) ||
            (currentObject.from >= currentTime && currentObject.from < minObject.from)
          ) {
            return currentObject;
          }
          return minObject;
        },
        null as IntensityData | null
      );
    
      if (lowestIntensity && lowestIntensity.from < currentTime) {
        const nextDay = new Date(currentDate);
        nextDay.setDate(currentDate.getDate() + 1);
        const nextDayFormatted = nextDay.toISOString().split('T')[0];
        
        const nextDayResponse = await axios.get<{ data: IntensityData[] }>(
          `https://api.carbonintensity.org.uk/intensity/date/${nextDayFormatted}`
        );
    
        const nextDayLowestIntensity = nextDayResponse.data.data.reduce(
          (minObject, currentObject) => {
            if (!minObject || currentObject.intensity.forecast < minObject.intensity.forecast) {
              return currentObject;
            }
            return minObject;
          },
          null as IntensityData | null
        );
    
        setLowestIntensityMessage(formatIntensityMessage(nextDayLowestIntensity));
    
        dispatch({
          type: 'SET_INTENSITY',
          payload: {
            forecast: nextDayLowestIntensity?.intensity.forecast || 0,
            index: nextDayLowestIntensity?.intensity.index || '',
          },
        });
      } else {
        setLowestIntensityMessage(formatIntensityMessage(lowestIntensity));
    
        dispatch({
          type: 'SET_INTENSITY',
          payload: {
            forecast: lowestIntensity?.intensity.forecast || 0,
            index: lowestIntensity?.intensity.index || '',
          },
        });
      }
    } catch (error) {
      console.error('Error fetching carbon intensity data:', error);
    }
    
  };

  const [postalCode, setPostalCode] = useState<string>('');
  const handlePostalCodeChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPostalCode(event.target.value);
  };
  const handleSearch = async () => {
    try {
      const response = await axios.get<SimplifiedCarbonIntensityData>(
        `https://api.carbonintensity.org.uk/regional/postcode/${postalCode}`
      );

      const intensity = response.data.data[0].data[0].intensity;
      dispatch(
        setIntensity({ forecast: intensity.forecast, index: intensity.index })
      );

      console.log("Intensity Forecast:", intensity.forecast);
      console.log("Intensity Index:", intensity.index);
    } catch (error) {
      console.error("Error fetching carbon intensity data:", error);
    }
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
            <p className="text-lg font-semi-bold my-4">{lowestIntensityMessage}</p>
          </div>
          <div className="flex-1">
            <DateInput label="Select Date" value={selectedDate} onChange={handleDateChange} />
            <PostalCodeInput
              label="Enter Postal Code"
              value={postalCode}
              onChange={handlePostalCodeChange}
              onSearch={handleSearch}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
