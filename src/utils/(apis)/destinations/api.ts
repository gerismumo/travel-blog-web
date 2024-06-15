
import axios from 'axios';

export interface IDestinationList {
  _id: string;
  name: string;
}

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
