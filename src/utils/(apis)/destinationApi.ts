
import { IDestinationList } from '@/(types)/type';
import axios from 'axios';

export const getDestinations = async (): Promise<IDestinationList[]> => {
  try {
    const response = await axios.get('/api/destination');
    if (response.data.success) {
      return response.data.data;
    } else {
      throw new Error(response.data.message);
    }
  } catch (error) {
    throw error;
  }
};
