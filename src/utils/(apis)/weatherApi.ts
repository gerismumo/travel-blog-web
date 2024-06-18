
import { IWeatherDataList } from '@/(types)/type';
import axios from 'axios';

export const getWeatherData = async (): Promise<IWeatherDataList[]> => {
  try {
    const response = await axios.get('/api/weather');
    if (response.data.success) {
      return response.data.data;
    } else {
      throw new Error(response.data.message);
    }
  } catch (error) {
    throw new Error("network error");
  }
};
