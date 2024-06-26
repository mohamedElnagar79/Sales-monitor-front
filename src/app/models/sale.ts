export interface Sale {
  id?: number;
  productId: number;
  productName?: string;
  piecePrice: number;
  quantity: number;
  total: number;
  amountPaid: number;
  remainingBalance: number;
  clientName: string;
  createdAt: Date;
}
