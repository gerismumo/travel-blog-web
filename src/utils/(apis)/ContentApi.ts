import { IDestinationContentList, IDestinationMonthContentList } from "@/(types)/type";
import axios from "axios";

export const getDestinationsInfo = async(): Promise<IDestinationContentList[]> => {
    try {
        const response = await axios.get('/api/content');
        if(response.data.success) {
            return response.data.data;
        }else {
            throw new Error(response.data.message);
        }
    }catch(error: any) {
        throw new Error(error.message);
    }
}

export const getDestinationsMonthInfo = async(): Promise<IDestinationMonthContentList[]> => {
    try {
        const response = await axios.get('/api/content/month');
        if(response.data.success) {
            return response.data.data;
        }else {
            throw new Error(response.data.message);
        }
    }catch(error: any) {
        throw new Error(error.message);
    }
}