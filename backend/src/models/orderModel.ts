import pool from '../config/db';
   import { IOrder, IOrderItem } from '../types';

   export const createOrder = async (userId: number, orderItems: IOrderItem[]): Promise<IOrder> => {
     const client = await pool.connect();
     try {
       await client.query('BEGIN');

       const itemValues = orderItems.map((item) => [item.product_id, item.quantity, item.price_at_time]);
       const itemInserts = orderItems.map((_, index) => `($1, $${index * 3 + 2}, $${index * 3 + 3}, $${index * 3 + 4})`).join(',');
       const itemQuery = `INSERT INTO order_items (order_id, product_id, quantity, price_at_time) VALUES ${itemInserts} RETURNING id, order_id, product_id, quantity, price_at_time`;
       const total = orderItems.reduce((sum, item) => sum + item.quantity * item.price_at_time, 0);

       const orderResult = await client.query(
         'INSERT INTO orders (user_id, total, status) VALUES ($1, $2, $3) RETURNING *',
         [userId, total, 'pending']
       );
       const order = orderResult.rows[0];

       const itemParams = [order.id, ...itemValues.flat()];
       const itemResult = await client.query(itemQuery, itemParams);
       const items = itemResult.rows;

       await client.query('COMMIT');
       return { ...order, order_items: items };
     } catch (error) {
       await client.query('ROLLBACK');
       console.error('Error in createOrder:', error);
       throw new Error('Failed to create order');
     } finally {
       client.release();
     }
   };

   export const getAllOrdersWithDetails = async (userId: number): Promise<IOrder[]> => {
     try {
       const result = await pool.query(
         `SELECT o.id, o.user_id, o.total, o.status, o.created_at,
                oi.id AS item_id, oi.product_id, oi.quantity, oi.price_at_time
          FROM orders o
          LEFT JOIN order_items oi ON o.id = oi.order_id
          WHERE o.user_id = $1`,
         [userId]
       );
       const ordersMap: { [key: number]: IOrder } = {};
       result.rows.forEach(row => {
         if (!ordersMap[row.id]) {
           ordersMap[row.id] = {
             id: row.id,
             user_id: row.user_id,
             total: row.total,
             status: row.status,
             created_at: row.created_at,
             order_items: [],
           };
         }
         if (row.item_id) {
           ordersMap[row.id].order_items.push({
             id: row.item_id,
             order_id: row.id,
             product_id: row.product_id,
             quantity: row.quantity,
             price_at_time: row.price_at_time,
           });
         }
       });
       return Object.values(ordersMap);
     } catch (error) {
       console.error('Error in getAllOrdersWithDetails:', error);
       throw new Error('Failed to fetch orders');
     }
   };