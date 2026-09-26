// types/orders.ts
export type OrderStatus = 'pending' | 'processing' | 'on-hold' | 'completed' | 'cancelled' | 'refunded' | 'failed';

export interface WCLineItem {
  id: number;
  name: string;
  quantity: number;
  total: string;
  image?: { src: string };
  product_id: number;
}

export interface WCOrder {
  id: number;
  status: OrderStatus;
  date_created: string;
  total: string;
  line_items: WCLineItem[];
  shipping: {
    first_name: string;
    last_name: string;
    address_1: string;
    city: string;
    country: string;
  };
}