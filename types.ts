
export enum View {
  HOME = 'home',
  ALL_RATES = 'all_rates',
  CALCULATOR = 'calculator',
  HISTORY = 'history',
  CONTACT = 'contact',
  ADMIN = 'admin',
  PRIVACY_POLICY = 'privacy_policy'
}

export interface AppSettings {
  id: string;
  thb_to_mmk_rate: number;
  gold_price_thb: number;
  gold_price_mmk: number; // Added Myanmar gold price
  updated_at: string;
  admin_password_hash: string;
}

export interface HistoricalRate {
  date: string;
  rate: number;
}

export interface CurrencyRates {
  [key: string]: number;
}

export interface ExchangeApiResponse {
  result: string;
  base_code: string;
  conversion_rates: CurrencyRates;
  time_last_update_utc: string;
}
