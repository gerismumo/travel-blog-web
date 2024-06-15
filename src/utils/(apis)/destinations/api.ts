
import { IDestinationList } from '@/(types)/destination';
import axios from 'axios';



export const getDestinations = async (): Promise<IDestinationList[]> => {
  try {
    const response = await axios.get('/api/destination');
    if (response.data.success) {
      return response.data.destinations;
    } else {
      throw new Error('Failed to fetch destinations');
    }
  } catch (error) {
    throw error;
  }
};
