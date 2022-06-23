import { AxiosStatic } from 'axios';

export interface StormGlassForecastResponse {
  hours: StormGlassPoint[];
  meta: StormGlassForecastMeta;
}
export interface ForeCastPoint {
  swellDirection: number;
  swellHeight: number;
  swellPeriod: number;
  time: Date;
  waveDirection: number;
  waveHeight: number;
  windDirection: number;
  windSpeed: number;
}
export interface StormGlassPoint {
  swellDirection: StormGlassForecastSwellDirection;
  swellHeight: StormGlassForecastSwellDirection;
  swellPeriod: StormGlassForecastSwellDirection;
  time: Date;
  waveDirection: StormGlassForecastSwellDirection;
  waveHeight: StormGlassForecastSwellDirection;
  windDirection: StormGlassForecastSwellDirection;
  windSpeed: StormGlassForecastSwellDirection;
}

export interface StormGlassForecastSwellDirection {
  [key: string]: number;
}

export interface StormGlassForecastMeta {
  cost: number;
  dailyQuota: number;
  end: string;
  lat: number;
  lng: number;
  params: string[];
  requestCount: number;
  source: string[];
  start: string;
}

export class StormGlass {
  readonly stormGlassAPIParams =
    'swellDirection,swellHeight,swellPeriod,waveDirection,waveHeight,windDirection,windSpeed';
  readonly stormGlassAPISource = 'noaa';

  constructor(protected request: AxiosStatic) {}

  public async fetchPoints(lat: number, lng: number): Promise<ForeCastPoint[]> {
    const url = `https://api.stormglass.io/v2/weather/point?lat=${lat}&lng=${lng}&params=${this.stormGlassAPIParams}&source=${this.stormGlassAPISource}`;
    const { data } = await this.request.get<StormGlassForecastResponse>(url);
    return this.normalizeResponse(data);
  }

  private normalizeResponse(
    points: StormGlassForecastResponse
  ): ForeCastPoint[] {
    return points.hours.filter(this.isValidPoint.bind(this)).map((point) => ({
      swellDirection: point.swellDirection[this.stormGlassAPISource],
      swellHeight: point.swellHeight[this.stormGlassAPISource],
      swellPeriod: point.swellPeriod[this.stormGlassAPISource],
      time: point.time,
      waveDirection: point.waveDirection[this.stormGlassAPISource],
      waveHeight: point.waveHeight[this.stormGlassAPISource],
      windDirection: point.windDirection[this.stormGlassAPISource],
      windSpeed: point.windSpeed[this.stormGlassAPISource],
    }));
  }
  private isValidPoint(point: Partial<StormGlassPoint>): boolean {
    return !!(
      point.time &&
      point.swellDirection &&
      point.swellHeight &&
      point.swellPeriod &&
      point.waveDirection &&
      point.waveHeight &&
      point.windDirection &&
      point.windSpeed
    );
  }
}
