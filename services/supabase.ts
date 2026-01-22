
import { createClient } from '@supabase/supabase-js';
import { HistoricalRate } from '../types';

const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || '';

export const supabase = (SUPABASE_URL && SUPABASE_ANON_KEY) 
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY) 
  : null;

const SETTINGS_KEY = 'gold_live_settings';

export const getAppSettings = async () => {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('settings')
        .select('*')
        .eq('id', 1)
        .single();
      
      if (!error && data) return data;
    } catch (e) {
      console.error('Supabase connection failed:', e);
    }
  }

  const local = localStorage.getItem(SETTINGS_KEY);
  if (local) return JSON.parse(local);

  return {
    thb_to_mmk_rate: 105.5,
    gold_price_thb: 42500,
    gold_price_mmk: 5200000,
    updated_at: new Date().toISOString()
  };
};

/**
 * Updates the settings in the DB. Used by both Admin and AI Cache.
 */
export const updateAppSettings = async (newThbRate: number, newMmkGold: number, newThbGold?: number) => {
  const now = new Date().toISOString();
  const updatedData: any = {
    thb_to_mmk_rate: newThbRate,
    gold_price_mmk: newMmkGold,
    updated_at: now
  };
  
  if (newThbGold) updatedData.gold_price_thb = newThbGold;

  if (supabase) {
    const { error: updateError } = await supabase
      .from('settings')
      .update(updatedData)
      .eq('id', 1);
    
    if (updateError) throw updateError;

    // Record in history for chart trends
    await supabase.from('rate_history').insert({
      rate: newThbRate,
      gold_price: newThbGold || 0,
      gold_price_mmk: newMmkGold,
      created_at: now
    });
  }

  localStorage.setItem(SETTINGS_KEY, JSON.stringify(updatedData));
  return updatedData;
};

export const getPreviousRates = async () => {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('rate_history')
        .select('rate, gold_price, gold_price_mmk')
        .order('created_at', { ascending: false })
        .limit(2);
      
      if (!error && data && data.length > 1) {
        return data[1];
      }
    } catch (e) {
      console.error('Supabase trend fetch failed:', e);
    }
  }
  return null;
};

export const getHistoricalThbRates = async (): Promise<HistoricalRate[]> => {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('rate_history')
        .select('created_at, rate')
        .order('created_at', { ascending: false })
        .limit(14);
      
      if (!error && data) {
        return data.map((item: any) => ({
          date: new Date(item.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }),
          rate: item.rate
        })).reverse();
      }
    } catch (e) {
      console.error('Supabase history fetch failed:', e);
    }
  }
  return [];
};

export const isSupabaseConnected = () => {
  return !!(SUPABASE_URL && SUPABASE_ANON_KEY);
};
