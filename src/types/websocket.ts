export type WebSocketMessage = PriceUpdateMessage | NewProductMessage | NotificationMessage

export interface PriceUpdateMessage {
  type: 'price_update';
  productId: number;
  newPrice: number;
  timestamp: string;
}

export interface NewProductMessage {
  type: 'new_product';
  message: string;
  timestamp: string;
}

export interface NotificationMessage {
  type: 'notification';
  title: string;
  message: string;
  timestamp: string;
}
