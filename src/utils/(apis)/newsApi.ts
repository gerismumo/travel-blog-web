import { INews } from "@/(types)/type";
import axios from "axios";

export const getNews = async (): Promise<INews[]> => {
    try {
      const response = await axios.get('/api/news');
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      throw new Error("network error");
    }
  };