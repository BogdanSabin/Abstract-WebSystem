import { SafeUrl } from '@angular/platform-browser';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartService } from 'src/app/services/cart.service';
import { ISite, SiteApiService } from 'src/app/services/site-api.service';

export interface CartItem {
  productImage: string | SafeUrl,
  name: string,
  price: number,
  quantity: number,
  id: string
}

export interface Cart {
  items: CartItem[],
  itemsQuantity?: number
}

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  siteId!: string;
  siteRef!: ISite;

  cart: Cart = { items: [] }

  dataSource: CartItem[] = [];
  displayedColumns: string[] = ['productImage', 'name', 'price', 'quantity', 'total', 'action'];

  constructor(private activateRoute: ActivatedRoute, private cartService: CartService, private siteApi: SiteApiService) { }

  async ngOnInit(): Promise<void> {
    this.cartService.cart.subscribe(_cart => {
      this.cart = _cart;
      this.dataSource = this.cart.items;
    });

    this.siteId = this.activateRoute.snapshot.paramMap.get('siteid') || '';
    this.siteRef = await this.siteApi.getSiteById(this.siteId);
  }

  getTotal(items: CartItem[]): number {
    return this.cartService.getTotal(items);
  }

  onClearCart(): void {
    this.cartService.clearCart();
  }

  onRemoveItem(element: CartItem): void {
    this.cartService.removeFromCart(element);
  }

  onAddQuantity(element: CartItem): void {
    this.cartService.addToCart(element);
  }

  onRemoveQuantity(element: CartItem): void {
    this.cartService.removeQuantityFromCart(element);
  }

}