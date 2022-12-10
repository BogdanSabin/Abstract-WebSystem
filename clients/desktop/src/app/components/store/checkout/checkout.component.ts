import { Component, OnInit } from '@angular/core';
import { CartService } from 'src/app/services/cart.service';
import { SiteApiService, ISite } from 'src/app/services/site-api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Cart, CartItem } from '../cart/cart.component';
import { OrderApiService, IOrderCreate } from 'src/app/services/order-api.service';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  siteId!: string;
  siteRef!: ISite;

  cart: Cart = { items: [] };

  public checkOutForm!: FormGroup;

  constructor(private _snakBar: MatSnackBar, private activateRoute: ActivatedRoute, private cartService: CartService, private siteApi: SiteApiService, private orderApi: OrderApiService, private formBuilder: FormBuilder, private router: Router) { }

  async ngOnInit(): Promise<void> {
    this.cartService.cart.subscribe(_cart => {
      this.cart = _cart;
    });

    this.siteId = this.activateRoute.snapshot.paramMap.get('siteid') || '';

    if (!this.cart.items.length) this.router.navigate([`site/${this.siteId}/store`]);
    else {
      this.siteRef = await this.siteApi.getSiteById(this.siteId);

      const orderFields = this.siteRef.ordersSettings.fields.map(o => {
        const validators = [Validators.required];
        if (o.key === 'email') validators.push(Validators.email)
        return this.formBuilder.group({
          key: [o.key, []],
          value: [o.value, validators]
        }) as FormGroup;
      })

      this.checkOutForm = this.formBuilder.group({
        orderFields: this.formBuilder.array(orderFields || [])
      });
    }

  }

  onSubmit() {
    if (this.checkOutForm.invalid) return;
    else {
      this.createOrder({
        siteId: this.siteId,
        products: this.cart.items.map(i => i.id),
        orderInfo: this.checkOutForm.value["orderFields"]
      });
    }
  }

  createOrder(newOrder: IOrderCreate): void {
    this.orderApi.createOrder(newOrder).then(() => {
      return this._snakBar.open(`Order successfully placed!`, 'Ok', { duration: 3000 });
    }).then(() => {
      setTimeout(() => {
        this.cartService.clearCart();
        this.router.navigate([`site/${this.siteId}/store`])
      }, 3000)
    })
  }

  getOrderFields(): FormArray {
    return this.checkOutForm.controls["orderFields"] as FormArray;
  }

  getTotal(items: CartItem[]): number {
    return this.cartService.getTotal(items);
  }


}
