import { IDestination, IDestinationContent, IDestinationMonthContent, IDestionationFaq, IDestionationMonthFaq, IWeatherData, IWeatherMonthData } from '@/(types)/type';
import mongoose, {mongo, Schema} from 'mongoose';


const destinationSchema : Schema<IDestination> = new mongoose.Schema({
    name: { type: String, required: true },
    countryCode: { type: String, required: true },
    stationID: { type: String, required: true },
});

export const Destination = mongoose.models.Destination || mongoose.model<IDestination>('Destination', destinationSchema);


const destinationContentSchema: Schema<IDestinationContent> = new mongoose.Schema({
    destination: {
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
    },
    metaTitle: {
        type: String,
        required: true,
    },
    metaDescription: {
        type: String,
        required: true,
    },
    metaKeyWords: {
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