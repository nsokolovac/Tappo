
// Shared types and interfaces for the Tappo application

export type AppView = 'LANDING' | 'DASHBOARD' | 'PROFILE_PREVIEW' | 'LOGIN' | 'REGISTER' | 'PRICING' | 'CREATE_OBJECT';

export interface User {
  email: string;
  name?: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
}

export interface MenuGroup {
  id: string;
  name: string;
  items: MenuItem[];
}

export interface Offer {
  id: string;
  title: string;
  description: string;
  discount: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
}

export interface BusinessProfile {
  id: string;
  ownerEmail: string;
  name: string;
  description: string;
  contact: string;
  location: {
    address: string;
    lat: number;
    lng: number;
  };
  socials: {
    instagram?: string;
    facebook?: string;
    tiktok?: string;
  };
  menuGroups: MenuGroup[];
  offers: Offer[];
  events: Event[];
  gallery: string[];
  coverImage?: string;
  logo?: string;
  subscription?: {
    billingCycle: string;
    nextBillingDate: string;
    pricePerMonth: number;
  };
}
