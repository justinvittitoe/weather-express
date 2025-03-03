//Imports the environment variables
//imports the fetch function to use for the asynchronous class methods
import dotenv from 'dotenv';
import fetch from 'node-fetch';
dotenv.config();

// TODO: Define an interface for the Coordinates object
// Defines the Coordinates place holder to ensure use in the following WeatherService Method
interface Coordinates {
  lat: number,
  lon: number,
}
// TODO: Define a class for the Weather object
//Weather Class
class Weather {
  temp: number;
  humidity: number;
  wind: number;
  description: string;
  icon: string;

  constructor (temp:number,humidity:number,wind:number,description:string,icon:string) {
    this.temp = temp,
    this.humidity = humidity
    this.wind = wind
    this.description = description
    this.icon = icon
  }
}

// TODO: Complete the WeatherService class
class WeatherService {
  // TODO: Define the baseURL, API key, and city name properties
  private baseURL: string;
  private apiKey: string;
  private cityName: string;
  

  constructor (cityName:string) {
    this.baseURL = process.env.API_BASE_URL || 'https://api.openweathermap.org';
    this.apiKey = process.env.API_KEY || '';
    this.cityName = cityName;
    
  }
  // TODO: Create fetchLocationData method
  async fetchLocationData(): Promise<any> {
    try{
      const response = await fetch(
        this.buildGeocodeQuery()
      );
      const data = await response.json()
      if (!data) {
        throw new Error('Location not found');
      }
      return data;
    }
    catch (err){
      console.log('Error fetching location data.', err);
      throw err;
    }
  }
  // TODO: Create destructureLocationData method
  private  async destructureLocationData(locationData: any ): Promise<Coordinates> {
    try {
      const lat = locationData.lat;
      const lon = locationData.lon;
      return { lat, lon };
    } catch (err) {
      console.log('Error destructuring location data:', err);
      throw err;
    }
    
  }
  // TODO: Create buildGeocodeQuery method
  private buildGeocodeQuery(): string {
    return `${this.baseURL}/geo/1.0/direct?q=${this.cityName}&limit=1&appid=${this.apiKey}`;
  }
  // TODO: Create buildWeatherQuery method
  private buildWeatherQuery(coordinates: Coordinates): string {
    return `${this.baseURL}/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.apiKey}`
  }
  // TODO: Create fetchAndDestructureLocationData method
  private async fetchAndDestructureLocationData(): Promise<Coordinates> {
    try{
      const locationData = await this.fetchLocationData();
      const coordinates = await this.destructureLocationData(locationData);
      if(!coordinates) {
        throw new Error('Error fetching location data')
      }  
      return coordinates;
    } catch (err) {
      console.log('Error fetching and destructuring location data:', err);
      throw err;
    }
  }
  // TODO: Create fetchWeatherData method
  async fetchWeatherData(): Promise<any> {
    try {
      const coordinates = await this.fetchAndDestructureLocationData()
      const query =  this.buildWeatherQuery(coordinates);
      const response = await fetch(query);
      const weatherData = await response.json();
      return weatherData;
    } catch (err) {
      console.log('Error fetching weather data:', err);
      throw err;
    }
  }
  // TODO: Build parseCurrentWeather method
  private parseCurrentWeather(weatherData: any) {
    const { temp , humidity } = weatherData.main;
    const { wind } = weatherData.wind.speed;
    const { description } = weatherData.weather[0].description;
    const { icon } = weatherData.weather[0].icon
    return new Weather(temp, humidity, wind, description, icon)
  }
  // TODO: Complete buildForecastArray method
  private buildForecastArray(currentWeather: Weather, weatherData: any[]) {
    const forecastArray: Weather[] = weatherData.map((data) => ({
      temp: data.main.temp,
      humidity: data.main.humidity,
      wind: data.wind.speed,
      description: data.weather[0].description,
      icon: data.weather[0].icon,
    }));
    return [currentWeather, ...forecastArray];
  }
  // TODO: Complete getWeatherForCity method
  async getWeatherForCity() {
    try {
      const weatherData = await this.fetchWeatherData();
      const currentWeather = this.parseCurrentWeather(weatherData.list[0]);
      const forecastArray = this.buildForecastArray(currentWeather, weatherData.list.slice(1));
      return forecastArray;
    } catch (err) {
      console.log('Error getting weather for city:', err);
      throw err;
    }
  }
}

export default WeatherService;
