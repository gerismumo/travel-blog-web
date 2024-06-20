import { IDestination, IDestinationContent, IDestinationMonthContent, IDestionationFaq, IDestionationMonthFaq, IWeatherData, IWeatherMonthData } from '@/(types)/type';
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
    year: {
        type: String,
        required: true,
    },
    month: {
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

const destinationMonthWeatherSchema: Schema<IWeatherMonthData> = new mongoose.Schema({
    destinationId: {
        type: String,
        required: true,
    },
    year: {
        type: Number,
        required: true,
    },
    month: {
        type: Number,
        required: true,
    },
    day: {
        type: Number,
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

export const DestinationMonthWeatherData = mongoose.models.DestinationMonthWeather || mongoose.model<IWeatherMonthData>('DestinationMonthWeather', destinationMonthWeatherSchema);

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
    },
    image: {
        type: String,
        required: true,
    }
})

export const DestinationContent = mongoose.models.DestiInfo || mongoose.model<IDestinationContent>('DestiInfo', destinationContentSchema)

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
    }
})

export const DestinationMonthContent = mongoose.models.DestiMonInfo || mongoose.model<IDestinationMonthContent>('DestiMonInfo', destinationMonthContentSchema);

const destinationFaqSchema: Schema<IDestionationFaq> = new mongoose.Schema({
    destinationId: {
        type: String,
        required: true,
    },
    question: {
        type: String,
        required: true,
    },
    answer: {
        type: String,
        required: true,
    }
})

export const DestinationFaq = mongoose.models.DestiFaq || mongoose.model<IDestionationFaq>('DestiFaq', destinationFaqSchema);

const destinationMonthFaqSchema: Schema<IDestionationMonthFaq> = new mongoose.Schema({
    destinationId: {
        type: String,
        required: true,
    },
    month: {
        type: String,
        required: true,
    },
    question: {
        type: String,
        required: true,
    },
    answer: {
        type: String,
        required: true,
    }
})

export const DestinationMonthFaq = mongoose.models.DestiMonFaq || mongoose.model<IDestionationMonthFaq>('DestiMonFaq', destinationMonthFaqSchema);