import { IDestination, IDestinationContent, IDestinationMonthContent, IWeatherData } from '@/(types)/type';
import mongoose, {mongo, Schema} from 'mongoose';




const destinationSchema : Schema<IDestination> = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  }
});

export const Destination = mongoose.models.Destination || mongoose.model<IDestination>('Destination', destinationSchema);

const destinationWeatherSchema : Schema<IWeatherData> = new mongoose.Schema({
    destinationId: {
        type: String,
        required: true,
    },
    date: {
        type: String,
        required: true,
    },
    airTemperature: {
        type: String,
        required: true,
    },
    waterTemperature: {
        type: String,
        required: true,
    },
    humidity: {
        type: String,
        required: true,
    },
    condition: {
        type: String,
        required: true,
    },
    sunnyHours: {
        type: String,
        required: true,
    }
})



export const DestinationWeatherData = mongoose.models.DestinationWeather || mongoose.model<IWeatherData>('DestinationWeather', destinationWeatherSchema);

const destinationContentSchema: Schema<IDestinationContent> = new mongoose.Schema({
    destinationId: {
        type: String,
        required: true,
    },
    weatherInfo: {
        type: String,
        required: true,
    },
    destinationInfo: {
        type: String,
        required: true,
    }
})

export const DestinationContent = mongoose.models.DestinationContent || mongoose.model<IDestinationContent>('DestinationContent', destinationContentSchema)

const destinationMonthContentSchema: Schema<IDestinationMonthContent> = new mongoose.Schema({
    destinationId: {
        type: String,
        required: true,
    },
    month: {
        type: String,
        required: true,
    },
    weatherInfo: {
        type: String,
        required: true,
    },
    destinationInfo: {
        type: String,
        required: true,
    }
})

export const DestinationMonthContent = mongoose.models.DestinationMonthContent || mongoose.model<IDestinationMonthContent>('DestinationMonthContent', destinationMonthContentSchema)