import { CartService } from './../../services/cart.service';
import { IProduct, ProductApiService } from './../../services/product-api.service';
import { Component, OnInit } from '@angular/core';
import { Cart } from './cart/cart.component';
import { ActivatedRoute } from '@angular/router';
import { ISite, SiteApiService } from 'src/app/services/site-api.service';

const ROWS_HEIGHT: { [coldNumber: number]: number } = {
  1: 400,
  3: 335,
  4: 350
}

@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.scss']
})
export class StoreComponent implements OnInit {
  siteId!: string;
  siteRef!: ISite

  colsView: number = 3;
  rowHeight: number = ROWS_HEIGHT[this.colsView];
  category!: string;

  cart: Cart = { items: [] };

  products!: IProduct[];
  productCategories!: string[];
  sort: string = 'asc';
  count: number = 100;

  constructor(private cartService: CartService, private activateRoute: ActivatedRoute, private siteApi: SiteApiService, private productApi: ProductApiService) { }

  async ngOnInit(): Promise<void> {
    this.cartService.cart.subscribe((_cart) => {
      this.cart = _cart;
      this.cart.itemsQuantity = this.cartService.getItemsQuantity(_cart.items)
    });
    this.siteId = this.activateRoute.snapshot.paramMap.get('siteid') || '';
    this.siteRef = await this.siteApi.getSiteById(this.siteId);
    await this.initProducts();
    this.productCategories = this.productApi.getProductCategories(this.products);
  }

  private async initProducts() {
    this.products = await this.productApi.getProductsWithImages(this.siteId, this.sort, this.count, this.category);
  }

  onColumnsCountChange(colsNumber: number): void {
    this.colsView = colsNumber;
    this.rowHeight = ROWS_HEIGHT[this.colsView];
  }

  onShowCategory(newCategory: string): void {
    this.category = newCategory;
    this.initProducts();
  }

  onAddToCart(product: IProduct): void {
    this.cartService.addToCart({
      id: product.id,
      productImage: product.image,
      name: product.name,
      price: product.price,
      quantity: 1
    });
  }

  onItemsSortChange(newSort: string): void {
    this.sort = newSort;
    this.initProducts();
  }

  onItemsCountChange(newCount: number): void {
    this.count = newCount;
    this.initProducts()
  }

}
