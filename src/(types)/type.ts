export interface IMonth {
  name: string;
  id: number;
};

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

export interface IWeatherData {
    destinationId: string; 
    year: string;
    month: string;
    airTemperature: string;
    waterTemperature: string;
    humidity: string;
    condition: string;
    sunnyHours: string;
}

export interface IWeatherDataList {
    _id: string;
    destinationId: string; 
    year: string;
    month: string;
    airTemperature: string;
    waterTemperature: string;
    humidity: string;
    condition: string;
    sunnyHours: string;
}

export interface IWeatherMonthData {
  destinationId: string;
  year: number;
  month: number;
  day: number;
  airTemperature: string;
  waterTemperature: string;
  humidity: string;
  condition: string;
  sunnyHours: string;
}

export interface IWeatherMonthDataList {
  _id: string;
  destinationId: string;
  year: number;
  month: number;
  day: number;
  airTemperature: string;
  waterTemperature: string;
  humidity: string;
  condition: string;
  sunnyHours: string;
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
  destinationId: string;
  question: string;
  answer: string;
}

export interface IDestionationFaqList {
  _id: string;
  destinationId: string;
  question: string;
  answer: string;
}

export interface IDestionationMonthFaq {
  destinationId: string;
  month: string;
  question: string;
  answer: string;
}

export interface IDestionationMonthFaqList {
  _id: string;
  destinationId: string;
  month: string;
  question: string;
  answer: string;
}


export interface ISuccessFormProp {
  onSuccess: () => void;
}