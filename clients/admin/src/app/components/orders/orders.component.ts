import { IProduct, IProductName } from './../../services/product-api.service';
import { IOrder, OrderApiService, IOrderTable, IOrderUpdate } from './../../services/order-api.service';
import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { ISite, SiteApiService } from 'src/app/services/site-api.service';
import { MatTableDataSource, MatTableDataSourcePaginator } from '@angular/material/table';
import { ProductApiService } from 'src/app/services/product-api.service';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
  sites: ISite[] = [];
  selectedSite: ISite | undefined;

  dataSource: MatTableDataSource<IOrderTable>;
  orders: IOrder[];
  columns: string[] = ['id', 'customer', 'products', 'date', 'actions'];

  @ViewChild(MatSort, { static: true })
  sort!: MatSort;

  @ViewChild(MatPaginator, { static: true })
  paginator!: MatPaginator;

  @ViewChild('deleteOrderDialog') deleteDialog!: TemplateRef<any>;
  orderToDelete: string = '';

  @ViewChild('viewOrderDialog') viewOrderDialog!: TemplateRef<any>;
  public orderViewForm!: FormGroup;

  @ViewChild('editOrderDialog') editOrderDialog!: TemplateRef<any>;
  public orderEditForm!: FormGroup;
  productsToAdd: IProductName[] = [];
  orderIdToEdit: string = '';

  constructor(private productApi: ProductApiService, private siteApi: SiteApiService, private orderApi: OrderApiService, private dialog: MatDialog, private formBuilder: FormBuilder) {
    this.orders = [];
    this.dataSource = new MatTableDataSource(this.orders as unknown as IOrderTable[]);
  }

  ngOnInit(): void { this.refreshPage(); }

  siteChanged(event: any) {
    this.selectedSite = (event.value) as unknown as ISite;
    this.refreshPage();
  }

  applyFilter(event: any) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  async refreshPage() {
    this.siteApi.queryAllSites().then(async sites => {
      sites = sites.sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0))
      this.sites = sites;
      if (!this.selectedSite) this.selectedSite = sites[0];
      this.orders = await this.orderApi.queryAllOrders(this.selectedSite.id);
      this.dataSource = new MatTableDataSource(this.orders.map(o => {
        const orderTable: IOrderTable = {
          id: o.id,
          customerId: o.customerId.email,
          products: o.products.map(p => { return p.fields.find(f => f.key === 'name')?.value || '' }),
          createdAt: new Date(o.createdAt).toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: 'numeric' })
        }
        return orderTable;
      }));
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator as unknown as MatTableDataSourcePaginator;
    })
  }

  // View Order Support
  viewOrder(orderId: string) {
    return Promise.resolve()
      .then(() => {
        return this.dialog.open(this.viewOrderDialog, {
          height: '90%',
          width: '100%'
        })
      })
      .then(() => {
        const order = this.orders.find(o => o.id === orderId);
        const date = new Date(order?.createdAt || new Date())
          .toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: 'numeric' })

        const productFields = order?.products.map(p => {
          const name = p.fields.find(pf => pf.key === 'name')?.value;
          return this.formBuilder.group({ name: [name, []] }) as FormGroup;
        })

        const orderInfoFields = order?.orderInfo.map(o => {
          return this.formBuilder.group({ key: [o.key, []], value: [o.value, []] }) as FormGroup;
        })

        this.orderViewForm = this.formBuilder.group({
          siteName: [this.selectedSite?.name, []],
          id: [order?.id, []],
          customer: [order?.customerId.email, []],
          date: [date, []],
          products: this.formBuilder.array(productFields || []),
          orderInfo: this.formBuilder.array(orderInfoFields || [])
        })
      })
  }

  getProductsViewFields(): FormArray {
    return this.orderViewForm.controls["products"] as FormArray;
  }

  getOrderInfoViewFields(): FormArray {
    return this.orderViewForm.controls["orderInfo"] as FormArray;
  }

  // Edit Order Support
  editOrder(orderId: string) {
    return Promise.resolve()
      .then(() => { return this.productApi.queryAllProducts(this.selectedSite?.id) })
      .then((allProducts) => {
        this.orderIdToEdit = orderId;
        this.productsToAdd = allProducts.map(p => {
          const name = p.fields.find(f => f.key === 'name')?.value;
          return { name: name, ...p } as IProductName;
        });
        const order = this.orders.find(o => o.id === orderId);
        const date = new Date(order?.createdAt || new Date())
          .toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: 'numeric' })

        const productFields = order?.products.map(p => {
          const name = p.fields.find(pf => pf.key === 'name')?.value;
          return this.formBuilder.group({ name: [name, [Validators.required]] }) as FormGroup;
        })

        const orderInfoFields = order?.orderInfo.map(o => {
          return this.formBuilder.group({ key: [o.key, []], value: [o.value, [Validators.required]] }) as FormGroup;
        })

        this.orderEditForm = this.formBuilder.group({
          siteName: [this.selectedSite?.name, []],
          id: [order?.id, []],
          customer: [order?.customerId.email, []],
          date: [date, []],
          products: this.formBuilder.array(productFields || []),
          orderInfo: this.formBuilder.array(orderInfoFields || [])
        })
        return;
      })
      .then(() => {
        return this.dialog.open(this.editOrderDialog, {
          height: '90%',
          width: '100%'
        })
      })

  }

  getProductsEdit(): FormArray {
    return this.orderEditForm.controls["products"] as FormArray;
  }

  productAdded(event: any) {
    const product = (event.value) as unknown as IProduct;
    const productName = product.fields.find(f => f.key === 'name')?.value || '';

    const productForm = this.formBuilder.group({
      name: [productName, []]
    }) as FormGroup;
    this.getProductsEdit().push(productForm);
  }

  deleteProductEdit(index: number) {
    this.getProductsEdit().removeAt(index);
  }

  getOrderInfoEdit(): FormArray {
    return this.orderEditForm.controls["orderInfo"] as FormArray;
  }

  saveEditOrder() {
    if (this.orderIdToEdit) {
      const newOrder: IOrderUpdate = {
        id: this.orderIdToEdit,
        products: this.orderEditForm.value["products"].map((p: any) => {
          return this.productsToAdd.find(prod => prod.name === p.name)?.id || '';
        }).filter((id: string) => id != ''),
        orderInfo: this.orderEditForm.value["orderInfo"]
      }
      this.orderApi.updateOrder(this.orderIdToEdit,newOrder)
        .then(()=>{
          this.refreshPage();
        })
    }
  }

  // Delete Order Support
  deleteOrderFun(orderId: string) {
    this.orderToDelete = orderId;
    this.dialog.open(this.deleteDialog);
  }

  cancelOrderDelete() {
    this.orderToDelete = '';
    this.dialog.closeAll();
    this.refreshPage();
  }

  deleteOrder() {
    if (this.orderToDelete) {
      this.orderApi.deleteOrder(this.orderToDelete)
        .then(() => { return this.refreshPage(); })
        .then(() => { this.cancelOrderDelete(); })
    }
  }

}