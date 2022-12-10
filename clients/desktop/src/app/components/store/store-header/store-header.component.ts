import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Cart, CartItem } from '../cart/cart.component';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-store-header',
  templateUrl: './store-header.component.html',
  styleUrls: ['./store-header.component.scss']
})
export class StoreHeaderComponent implements OnInit {
  @Input() siteId!: string;

  @Input() siteName: string = "Site Name";

  @Input() displayCart = true;

  @Input() cart: Cart = { items: [], itemsQuantity: 0 };

  constructor(private activateRoute: ActivatedRoute, private cartService: CartService) { }

  ngOnInit(): void {
    this.siteId = this.activateRoute.snapshot.paramMap.get('siteid') || '';
  }

  getTotal(items: CartItem[]): number {
    return this.cartService.getTotal(items);
  }

  onClearCard(): void {
    this.cartService.clearCart();
  }

}
