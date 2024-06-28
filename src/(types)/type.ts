export interface IMonth {
  name: string;
  id: number;
};

export interface IDestinationCategory{
  name:string;
}

export interface IDestination{
  name: string;
  countryCode: string;
  stationID: string;
  }

export interface IDestinationList {
    _id: string;
    name: string;
    countryCode: string;
    stationID: string;
  }


export interface IDestinationContent {
  destination: string;
  weatherInfo: string;
  destinationInfo: string;
  image: string;
  metaTitle: string;
  metaDescription: string;
  metaKeyWords: string;
}

export interface IDestinationContentList {
  _id: string;
  destination: string;
  weatherInfo: string;
  destinationInfo: string;
  image: string;
  metaTitle: string;
  metaDescription: string;
  metaKeyWords: string;
}

export interface IDestinationMonthContent {
  destination: string;
  month: string;
  weatherInfo: string;
  metaTitle: string;
  metaDescription: string;
  metaKeyWords: string;
}

export interface IDestinationMonthContentList {
  _id: string;
  destination: string;
  month: string;
  weatherInfo: string;
  metaTitle: string;
  metaDescription: string;
  metaKeyWords: string;
}

export interface IDestionationFaq {
  destination: string;
  question: string;
  answer: string;
}

export interface IDestionationFaqList {
  _id: string;
  destination: string;
  question: string;
  answer: string;
}

export interface IDestionationMonthFaq {
  destination: string;
  month: string;
  question: string;
  answer: string;
}

export interface IDestionationMonthFaqList {
  _id: string;
  destination: string;
  month: string;
  question: string;
  answer: string;
}


export interface ISuccessFormProp {
  onSuccess: () => void;
}
export interface ISelectedDestination {
  destination: string;
  text: string;
};

export interface IHolidayBlog {
  category: string;
  month: string | null;
  heading: string;
  info: string;
  image: string;
  content: ISelectedDestination[]
}

export interface IHolidayBlogList {
  _id: string;
  category: string;
  month: string | null;
  heading: string;
  info: string;
  image: string;
  content: ISelectedDestination[]
}

export interface IWeatherBlog {
  destination: string,
  heading: string,
  image: string,
}

export interface IWeatherBlogList {
  _id: string,
  destination: string,
  heading: string,
  image: string,
}


export interface ISubNews {
  subHeading: string;
  subImage: string;
  subText: string;
}

export interface INews {
  heading: string;
  image: string;
  info: string;
  subNews: ISubNews[];
}