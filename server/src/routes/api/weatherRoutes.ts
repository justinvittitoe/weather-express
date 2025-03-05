import { Router, type Request, type Response } from 'express';
const router = Router();

import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';



// TODO: POST Request with city name to retrieve weather data
router.post('/', async (req: Request, res:Response) => {
  try {
    const cityName = await req.body.cityName;
    if (!cityName) {
      return res.status(400).json({ error: 'City name is required' });
    }
    // TODO: GET weather data from city name 
    const weatherData = await WeatherService.getWeatherForCity(cityName);
    // TODO: save city to search history
    const locationData = await WeatherService.fetchAndDestructureLocationData(cityName)
    await HistoryService.addCity(locationData)
    console.log(locationData)
    return res.json(weatherData);
  } catch (err) {
    console.log('Error retrieving weather data for the selected city: ', err);
    return res.status(500).json({ error: 'Failed to fetch weather data' });
  }
});
 
//   


// TODO: GET search history
router.get('/history',  async (_req: Request, res: Response) => {

  try {

    const data = await HistoryService.getCities();
    if (!data || data.length === 0) {
      return res.status(200).json({ error: 'No previous history' });
    }
    return res.json(data);
  } catch (err) {
    console.log('Error fetching search history: ', err);
    return res.status(500).json({ error: 'Failed to fetch search history' });
  }
});

// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (req: Request, res: Response) => {
  const identifier = req.params.identifier;

  try {
    if (isNaN(Number(identifier))) {
      // Identifier is a city name
      await HistoryService.removeCityByName(identifier);
      return res.status(200).json({ message: 'City removed from search history by name' });
    } else {
      // Identifier is a city ID
      const id = parseInt(identifier, 10);
      await HistoryService.removeCityById(id);
      return res.status(200).json({ message: 'City removed from search history by ID' });
    }
  } catch (err) {
    console.log('Error removing city from search history: ', err);
    return res.status(500).json({ error: 'Failed to remove city from search history' });
  }
  
  // const id = await parseInt(req.params.id);
  
  // res.json({message: 'City has successfully been deleted'})
  // try {
  //   await HistoryService.removeCity(id);
  //   res.status(200).json({ message: 'City removed from search history' });
  // } catch (err) {
  //   console.log('Error removing city from search history: ', err);
  //   res.status(500).json({ error: 'Failed to remove city from search history' });
  // }
});

export default router;
