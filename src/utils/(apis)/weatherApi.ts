
import { IWeatherData } from '@/(types)/type';
import axios from 'axios';

export const getWeatherData = async (): Promise<IWeatherData[]> => {
  try {
    const response = await axios.get('/api/destination-weather');
    if (response.data.success) {
      return response.data.data;
    } else {
      throw new Error(response.data.message);
    }
  } catch (error) {
    throw new Error("network error");
  }
};
