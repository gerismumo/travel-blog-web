export interface IMonth {
  name: string;
  id: number;
};

export interface IDestination{
    name: string;
  }

export interface IDestinationList {
    _id: string;
    name: string;
  }

export interface IWeatherData {
    destinationId: string; 
    date: string;
    airTemperature: string;
    waterTemperature: string;
    humidity: string;
    condition: string;
    sunnyHours: string;
}

export interface IWeatherDataList {
    _id: string;
    destinationId: string; 
    date: string;
    airTemperature: string;
    waterTemperature: string;
    humidity: string;
    condition: string;
    sunnyHours: string;
}

export interface IDestinationContent {
  destinationId: string;
  weatherInfo: string;
  destinationInfo: string;
}

export interface IDestinationMonthContent {
  destinationId: string;
  month: string;
  weatherInfo: string;
  destinationInfo: string;
}