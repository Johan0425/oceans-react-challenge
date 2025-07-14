export interface IProduct {
    id?: number;
    name: string;
    description?: string;
    price: number;
    stock: number;
    created_at?: Date;
  }
  
export interface IOrderItem {
    id: number;
    order_id: number;
    product_id: number;
    quantity: number;
    price_at_time: number;
  }
  
export interface IOrder {
    id: number;
    user_id: number;
    total: number;
    status: 'pending' | 'completed' | 'cancelled';
    created_at?: Date;
    order_items: IOrderItem[];
  }