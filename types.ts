

export type ActivityType = 'transport' | 'food' | 'spot' | 'buy' | 'info';

export type TagType = 'food' | 'buy' | 'tip' | 'alert' | 'spot' | 'info' | 'card';

export interface Tag {
  type: TagType;
  label: string;
}

export interface Activity {
  id: string;
  type: ActivityType;
  time: string; // Planned time for the itinerary
  openingHours?: string; // Official business hours
  title: string;
  description: string;
  locationUrl?: string;
  tags?: Tag[];
  highlight?: boolean;
  
  // Smart Guide Fields
  souvenirs?: string[];     // For Shopping: "Must Buy"
  mustTry?: string[];       // For Food: "Must Eat/Order"
  reservationNote?: string; // For Bookings: "Reservation Code/Time"
  guideTips?: string;       // For Spots: "Guide's Secret Tips"
}

export type WeatherType = 'sunny' | 'cloudy' | 'rainy';

export interface DayPlan {
  id: string;
  date: string;
  weekday: string;
  weather: WeatherType;
  weatherTemp: string;
  activities: Activity[];
  isConditional?: boolean; // For Day 4 logic
}

export interface FlightInfo {
  type: 'Dep' | 'Arr';
  date: string;
  code: string;
  route: string;
}

export interface HotelInfo {
  dates: string;
  name: string;
  area: string;
  url: string;
}

export interface SavedSpot {
  id: string;
  name: string;
  description: string;
  url: string;
  lat: number;
  lng: number;
  architect?: string; // Name of the architect if it's a significant building
}

export type ExpenseCategory = 'food' | 'transport' | 'buy' | 'other';
export type PaymentMethod = 'cash' | 'card';

export interface Expense {
  id: string;
  title: string;
  amount: number;
  category: ExpenseCategory;
  paymentMethod: PaymentMethod;
  date: string;
}
