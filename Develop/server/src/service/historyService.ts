
import {promises as fs} from 'fs';
import path from 'path'

// TODO: Define a City class with name and id properties
interface City {
  name:string;
  localNames: Array<string>
  lat: number;
  lon: number;
  country: string;
  state: string;
}
// TODO: Complete the HistoryService class
class HistoryService {
  
  private filePath: string;

  constructor() {
    this.filePath = path.join(__dirname, 'searchHistory.json');
    
  }
  // TODO: Define a read method that reads from the searchHistory.json file
  private async read(): Promise<City[]> {
    try {
      const historyData = await fs.readFile(this.filePath, 'utf-8');
      return JSON.parse(historyData) as City[];
    } catch (err) {
      console.log('Error reading history data: ', err);
      return [];
    }
  }
  // TODO: Define a write method that writes the updated cities array to the searchHistory.json file
  private async write(cities: City[]): Promise<void> {
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
  async addCity(city: City): Promise<void> {
    try {
      const cities = await this.read();
      cities.push(city);
      await this.write(cities);
    } catch (err) {
      console.log('Error adding city:', err);
      throw err;
    }
  }
  // * BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file
  async removeCity(name: string): Promise<void>{
    try {
      let cities = await this.read();
      cities = cities.filter(city => city.name !== name);
      await this.write(cities);
    } catch (err) {
      console.log('Error removing city:', err)
    }
  }
}

export default HistoryService;
