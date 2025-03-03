import { Router, type Request, type Response } from 'express';
const router = Router();

import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';


// TODO: POST Request with city name to retrieve weather data
router.post('/', async (req: Request, res:Response) => {
  const cityName = req.query.city as string;
  if (!cityName) {
    return res.status(400).json({ error: 'City name is required'})
  } 
  // TODO: GET weather data from city name
  try {
    const weatherService = new WeatherService(cityName);
    const locationData = await weatherService.fetchLocationData()
    const weatherData = await weatherService.fetchWeatherData();
    // TODO: save city to search history
    const history = new HistoryService();
    await history.addCity(locationData)

    return res.json(weatherData);
  } catch (err) {
    console.log('Error fetching weather data: ', err);
    return res.status(500).json({error: 'Failed to fetch weather data'})
  } 
});

// TODO: GET search history
router.get('/history', async (res: Response) => {

  try {
    const historyService = new HistoryService();
    const cities = await historyService.getCities();
    res.json(cities);
  } catch (err) {
    console.log('Error fetching search history: ', err);
    res.status(500).json({ error: 'Failed to fetch search history' });
  }
});

// * BONUS TODO: DELETE city from search history
router.delete('/history/:name', async (req: Request, res: Response) => {
  const cityName = req.params.name;
  try {
    const historyService = new HistoryService();
    await historyService.removeCity(cityName);
    res.status(200).json({ message: 'City removed from search history' });
  } catch (err) {
    console.log('Error removing city from search history: ', err);
    res.status(500).json({ error: 'Failed to remove city from search history' });
  }
});

export default router;
