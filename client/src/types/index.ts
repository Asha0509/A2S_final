export interface PropertyFilters {
  purpose?: 'buy' | 'rent' | 'land';
  minPrice?: number;
  maxPrice?: number;
  location?: string;
  propertyType?: string;
  facing?: string;
  amenities?: string[];
}

export interface DesignElement {
  id: string;
  type: 'furniture' | 'color' | 'material';
  category: string;
  name: string;
  position?: { x: number; y: number };
  imageUrl?: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  suggestions?: Array<{
    type: 'property' | 'design' | 'action';
    id?: string;
    title: string;
    description?: string;
    location?: string;
    price?: number;
    image?: string;
    action: string;
  }>;
}

export interface TimeSlot {
  time: string;
  available: boolean;
}

export interface FormData {
  [key: string]: any;
}
