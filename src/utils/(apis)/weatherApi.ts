
import { IWeatherBlogList } from '@/(types)/type';
import axios from 'axios';

export const getWeatherBlogCards = async (): Promise<IWeatherBlogList[]> => {
  try {
    const response = await axios.get('/api/weather-blog');
    if (response.data.success) {
      return response.data.data;
    } else {
      throw new Error(response.data.message);
    }
  } catch (error) {
    throw new Error("network error");
  }
};
