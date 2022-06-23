import stormMock from '@test/fixtures/stormglass_weather_3.json';
import stormMockNormalize from '@test/fixtures/stormglass_normalized_response_3_hours.json';

import { StormGlass } from '@src/clients/stormGlass';
import axios from 'axios';
jest.mock('axios');
describe('StormGlass client', () => {
  const mockedAxios = axios as jest.Mocked<typeof axios>;
  it('should return the normalized forecast from the stormGlasses', async () => {
    const lat = -33.792726;
    const lng = 151.289824;
    const data = { data: stormMock };
    const normalized_data = stormMockNormalize;
    mockedAxios.get.mockReturnValue(Promise.resolve(data));
    const stormGlass = new StormGlass(axios);
    const response = await stormGlass.fetchPoints(lat, lng);
    expect(response).toEqual(normalized_data);
  });
});
