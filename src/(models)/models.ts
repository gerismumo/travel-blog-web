import { IDestination, IDestinationContent, IDestinationMonthContent, IDestionationFaq, IDestionationMonthFaq, IHolidayBlog, INews, IThingsToDo, IWeatherBlog } from '@/(types)/type';
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
    destination: {
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

export const DestinationMonthContent = mongoose.models.DestiMonInfo || mongoose.model<IDestinationMonthContent>('DestiMonInfo', destinationMonthContentSchema);

const destinationFaqSchema: Schema<IDestionationFaq> = new mongoose.Schema({
    destination: {
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
    destination: {
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

//blogs

const SelectedDestinationSchema: Schema = new Schema({
    destination: { type: String, required: true },
    text: { type: String, required: true },
});

const HolidayBlogSchema: Schema = new Schema({
    category: { type: String, required: true },
    month: { type: String, default: null },
    heading: { type: String, required: true },
    info: { type: String, required: true },
    image: { type: String, required: true },
    metaTitle: { type: String, required: true},
    metaDescription: { type: String, required: true},
    metaKeyWords: { type: String, required: true},
    content: { type: [SelectedDestinationSchema], required: true },
});

export const HolidayBlog = mongoose.models.HolidayBlog || mongoose.model<IHolidayBlog>('HolidayBlog', HolidayBlogSchema);

const destiWeatherBlogSchema: Schema = new Schema({
    destination: { type: String, required: true},
    heading: {type: String, required: true},
    image: { type: String, required: true}
})

export const DestinationWeatherBlog = mongoose.models.DestinationWeatherBlog || mongoose.model<IWeatherBlog>("DestinationWeatherBlog", destiWeatherBlogSchema);

const SubNewsSchema: Schema = new Schema({
    subHeading: { type: String, required: true },
    subImage: { type: String, required: true },
    subText: { type: String, required: true },
  });
  
  const NewsBlogSchema: Schema = new Schema({
    heading: { type: String, required: true },
    image: { type: String, required: true },
    info: { type: String, required: true },
    metaTitle: { type: String, required: true},
    metaDescription: { type: String, required: true},
    metaKeyWords: { type: String, required: true},
    subNews: { type: [SubNewsSchema], required: true },
  });

  export const NewsBlog = mongoose.models.NewsBlog || mongoose.model<INews>("NewsBlog", NewsBlogSchema);

  const placesToVisit: Schema = new Schema({
    heading: {type: "string", required: true},
    description: {type: "string", required: true},
    image: {type: "string", required: true}
  })

  const ThingsToDoSchema: Schema = new Schema({
    destination: {type: "string", required: true},
    overviewHeading: {type: "string", required: true},
    overviewDescription: {type: "string", required: true},
    image: {type: "string", required: true},
    metaTitle: { type: String, required: true},
    metaDescription: { type: String, required: true},
    metaKeyWords: { type: String, required: true},
    placesToVisit: {type: [placesToVisit], required: true}
  })

  export const ThingsToDo = mongoose.models.ThingsToDo|| mongoose.model<IThingsToDo>("ThingsToDo", ThingsToDoSchema);