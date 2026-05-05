import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface CartItem {
  product_id: string;
  name: string;
  unit_price: number;
  quantity: number;
  image_url?: string;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private _items = new BehaviorSubject<CartItem[]>(this.load());
  readonly items$ = this._items.asObservable();

  get items(): CartItem[] { return this._items.value; }
  get count(): number { return this.items.reduce((s, i) => s + i.quantity, 0); }
  get subtotal(): number { return this.items.reduce((s, i) => s + i.unit_price * i.quantity, 0); }

  add(item: Omit<CartItem, 'quantity'>) {
    const current = [...this.items];
    const existing = current.find(i => i.product_id === item.product_id);
    if (existing) { existing.quantity++; }
    else { current.push({ ...item, quantity: 1 }); }
    this.emit(current);
  }

  setQty(product_id: string, qty: number) {
    if (qty <= 0) { this.remove(product_id); return; }
    const current = this.items.map(i => i.product_id === product_id ? { ...i, quantity: qty } : i);
    this.emit(current);
  }

  remove(product_id: string) {
    this.emit(this.items.filter(i => i.product_id !== product_id));
  }

  clear() { this.emit([]); }

  private emit(items: CartItem[]) {
    this._items.next(items);
    localStorage.setItem('tumomito_cart', JSON.stringify(items));
  }

  private load(): CartItem[] {
    try { return JSON.parse(localStorage.getItem('tumomito_cart') || '[]'); }
    catch { return []; }
  }
}
