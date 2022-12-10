import { CartItem } from './../components/store/cart/cart.component';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Cart } from '../components/store/cart/cart.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  cart = new BehaviorSubject<Cart>({ items: [] })

  constructor(private _snakBar: MatSnackBar) { }

  addToCart(item: CartItem): void {
    const items = [...this.cart.value.items];
    const itemInCart = items.find(_item => _item.id === item.id);
    if (itemInCart) itemInCart.quantity += 1;
    else items.push(item);

    this.cart.next({ items })
    this._snakBar.open(`Product ${item.name} added to cart.`, 'Ok', { duration: 3000 });
    console.log(this.cart.value);
  }

  getTotal(items: CartItem[]): number {
    return items.map(item => item.price * item.quantity).reduce((prev, current) => prev + current, 0);
  }

  getItemsQuantity(items: CartItem[]): number {
    return items.map(item => item.quantity).reduce((prev, current) => prev + current, 0);
  }

  clearCart(): void {
    this.cart.next({ items: [] });
    this._snakBar.open(`Cart cleared!`, 'Ok', { duration: 3000 });
  }

  removeFromCart(item: CartItem): void {
    const filteredItems = this.cart.value.items.filter(_item => {
      return _item.id !== item.id;
    })

    this.cart.next({ items: filteredItems });
    this._snakBar.open(`Product ${item.name} removed from cart.`, 'Ok', { duration: 3000 });
  }

  removeQuantityFromCart(item: CartItem): void {
    let itemToRemove: CartItem | undefined = undefined;
    console.log(this.cart.value.items);
    let filteredItems = this.cart.value.items.map((_item) => {
      if (_item.id === item.id) {
        _item.quantity--;
        if (_item.quantity === 0) itemToRemove = _item;
      }
      return _item;
    });

    if (itemToRemove) this.removeFromCart(itemToRemove);
    else {
      this.cart.next({ items: filteredItems });
      this._snakBar.open(`One Product ${item.name} removed from cart.`, 'Ok', { duration: 3000 });
    }
  }

}
