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
  city: string;
  date: string;
  icon: string;
  description: string;
  temp: number;
  wind: string;
  humidity: string;
  
  

  constructor (city:string, date:string, icon:string,description:string,temp:number,wind:string,humidity:string) {
    this.city = city,
    this.date = date,
    this.icon = icon,
    this.description = description,
    this.temp = temp,
    this.wind = wind,
    this.humidity = humidity
  }
}

// TODO: Complete the WeatherService class
class WeatherService {
  // TODO: Define the baseURL, API key, and city name properties
  private baseURL: string;
  private apiKey: string;
  

  constructor () {
    this.baseURL = process.env.API_BASE_URL || 'https://api.openweathermap.org';
    this.apiKey = process.env.API_KEY || '';
    
    
  }
  // TODO: Create fetchLocationData method
  async fetchLocationData(cityName:string): Promise<any> {
    
    try{
      const response = await fetch(
        this.buildGeocodeQuery(cityName)
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
  async destructureLocationData(locationData: any ): Promise<any> {
    
    try {
      const id = locationData.id;
      const cityName = locationData.name;
      const { lon , lat } = locationData.coord;
      return { id, cityName, lat, lon, };
    } catch (err) {
      console.log('Error destructuring location data:', err);
      throw err;
    }
    
  }
  // TODO: Create buildGeocodeQuery method
  buildGeocodeQuery(cityName:string): string {
    return `${this.baseURL}/data/2.5/weather?q=${cityName}&appid=${this.apiKey}`;
  }
  // TODO: Create buildWeatherQuery method
  buildWeatherQuery(coordinates: Coordinates): string {
    return `${this.baseURL}/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.apiKey}`
  }
  // TODO: Create fetchAndDestructureLocationData method
  async fetchAndDestructureLocationData(cityName:string): Promise<any> {
    
    try{
      const locationData = await this.fetchLocationData(cityName)
      const destructuredData = await this.destructureLocationData(locationData);

      if(!destructuredData) {
        throw new Error('Error fetching location data')
      }  
      return destructuredData;
      
    } catch (err) {
      console.log('Error fetching and destructuring location data:', err);
      throw err;
    }
  }
  // TODO: Create fetchWeatherData method
  async fetchWeatherData(cityName:string): Promise<any> {

    try {
      const locationData = await this.fetchAndDestructureLocationData(cityName)
      // Get the current weather
      const currentWeather = await this.parseCurrentWeather(locationData)
      
      // Get the weather Forecast
      const query =  await fetch(this.buildWeatherQuery(locationData));
      const response: any = await query.json()
      const weatherData = await this.buildForecastArray(currentWeather, response.list)
      
      return weatherData;
    } catch (err) {
      console.log('Error fetching weather data:', err);
      throw err;
    }
  }
  // TODO: Build parseCurrentWeather method
  private async parseCurrentWeather(locationData: any): Promise<Weather> {
    
    const response = await this.fetchLocationData(locationData.cityName);
    try {
      const city = response.name;
      const date = this.convertUnixToDate(response.dt);
      const icon = response.weather[0].icon;
      const description =response.weather[0].description;
      const temp = this.convertKelvinToFahrenheit(response.main.temp);
      const wind =response.wind.speed;
      const humidity = response.main.humidity;

      return new Weather(city, date, icon, description, temp, wind, humidity)
    }
     catch (err){
      console.log('Error parsing current weather data: ', err)
      throw err;
    }
  }
  private convertUnixToDate(unixTimestamp: number): string {
    const date = new Date(unixTimestamp * 1000); // Convert to milliseconds
    return date.toLocaleDateString(); // Format as a human-readable date
  }
  // TODO: Complete buildForecastArray method
  private buildForecastArray(currentWeather: any, weatherData: any[]) {
    
    const  filter = weatherData.filter((data) => data.dt_txt.includes('12:00:00'));
    const forecastArray = filter.map((data) => ({ 
      date: data.dt_txt,
      icon: data.weather[0].icon,
      description: data.weather[0].description,
      temp: this.convertKelvinToFahrenheit(data.main.temp).toFixed(1),
      wind: data.wind.speed.toString(),
      humidity: data.main.humidity.toString()
    }))
    
    return [currentWeather, ...forecastArray];
  }
  private convertKelvinToFahrenheit(kelvin: number): number {
   const f = (kelvin - 273.15) * 9/5 + 32
    return parseFloat(f.toFixed(1));
  }

  // TODO: Complete getWeatherForCity method
  async getWeatherForCity(cityName:string) {
    try {
      const weatherData = await this.fetchWeatherData(cityName);
      // const currentWeather = this.parseCurrentWeather(weatherData);
      return weatherData;
    } catch (err) {
      console.log('Error getting weather for city:', err);
      throw err;
    }
  }
}

export default new WeatherService();
