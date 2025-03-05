import { fileURLToPath } from 'url';
import {promises as fs} from 'fs';
import path from 'path'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// TODO: Define a City class with name and id properties
interface City {
  id: number;
  name: string;
  lat: number;
  lon:number
}
// TODO: Complete the HistoryService class
class HistoryService {
  
  private filePath: string;

  constructor() {
    this.filePath = path.join(__dirname, 'searchHistory.json');
    
  }
  // TODO: Define a read method that reads from the searchHistory.json file
  async read(): Promise<City[]> {
    try {
      const historyData =  await fs.readFile(this.filePath, 'utf-8')
      if(!historyData) {
        console.log("No previous history.")
        return [];
      }
      return JSON.parse(historyData) as City[];
    } catch (err) {
      console.log('Error reading history data: ', err);
      return [];
    }
  }
  // TODO: Define a write method that writes the updated cities array to the searchHistory.json file
  async write(cities: City[]): Promise<void> {
    try{
      const data = JSON.stringify(cities, null, 2);
      await fs.writeFile(this.filePath, data, 'utf-8');
    } catch (err) {
      console.log('Error writing history data: ', err);
      throw err;
    }
  }
  // TODO: Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
  async getCities(): Promise<City[]> {
    return this.read();
  }
  // TODO Define an addCity method that adds a city to the searchHistory.json file
  async addCity(cityData: City): Promise<void> {
    try {
      const existingCities = await this.getCities();

      //Check for duplicates based on city id
      const isDuplicate = existingCities.some(city => city.id === cityData.id)
      if(isDuplicate) {
        console.log('City already exists in the history.')
        return;
      }
      
      existingCities.push(cityData)
      await this.write(existingCities);
    } catch (err) {
      console.log('Error adding city:', err);
      throw err;
    }
  }
  // * BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file
  async removeCity(id: number): Promise<void>{
    try {
      let cities = await this.read();
      cities = cities.filter(city => city.id !== id);
      await this.write(cities);
    } catch (err) {
      console.log('Error removing city:', err)
    }
  }
  async removeCityById(id: number): Promise<void> {
    try {
      let cities = await this.read();
      cities = cities.filter(city => city.id !== id);
      await this.write(cities);
    } catch (err) {
      console.log('Error removing city by ID:', err);
      throw err;
    }
  }

  async removeCityByName(name: string): Promise<void> {
    try {
      let cities = await this.read();
      cities = cities.filter(city => city.name !== name);
      await this.write(cities);
    } catch (err) {
      console.log('Error removing city by name:', err);
      throw err;
    }
  }
}

export default new HistoryService();
