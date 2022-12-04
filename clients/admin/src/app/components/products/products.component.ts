import { ImageHandler, ImageApiService, ImageResourceRef } from './../../services/image-api.service';
import { IProduct, IProductTable, IProductCreate } from './../../services/product-api.service';
import { Component, OnInit, ViewChild, TemplateRef, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { SiteApiService, ISite } from 'src/app/services/site-api.service';
import { ProductApiService } from 'src/app/services/product-api.service';
import { MatTableDataSource, MatTableDataSourcePaginator } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  private DEFAULT_PRIDCUT_IMAGE = '../../../assets/defaultProductImage.jpg';

  sites: ISite[] = [];
  selectedSite: ISite | undefined;

  dataSource: MatTableDataSource<IProductTable>;
  products: IProduct[];
  images: ImageResourceRef[];
  columns: string[] = ['image', 'id', 'fields', 'actions'];

  @ViewChild(MatSort, { static: true })
  sort!: MatSort;

  @ViewChild(MatPaginator, { static: true })
  paginator!: MatPaginator;

  @ViewChild('addNewProductDialog') addProductDialog!: TemplateRef<any>;
  @ViewChild('selectFileInput') selectFileInputVar!: ElementRef;
  public productAddForm!: FormGroup;
  currentImage!: ImageHandler | undefined;

  @ViewChild('deleteProductDialog') deleteDialog!: TemplateRef<any>;
  productToDelete: { name: string, id: string } = { name: '', id: '' };

  @ViewChild('viewProductDialog') viewProductDialog!: TemplateRef<any>;
  public productViewForm!: FormGroup;
  viewImage!: { url: SafeUrl } | undefined;

  @ViewChild('editProductDialog') editProductDialog!: TemplateRef<any>;
  public productEditForm!: FormGroup;
  editImage!: ImageHandler | undefined;
  editProductId!: string;
  @ViewChild('selectEditFileInput') selectFileEditInputVar!: ElementRef;

  constructor(private productApi: ProductApiService, private siteApi: SiteApiService, private imageApi: ImageApiService, private dialog: MatDialog, private formBuilder: FormBuilder, private sanitizer: DomSanitizer) {
    this.products = [];
    this.images = [];
    this.dataSource = new MatTableDataSource(this.products as unknown as IProductTable[]);
  }

  async ngOnInit() {
    this.refreshPage();
  }

  siteChanged(event: any) {
    this.selectedSite = (event.value) as unknown as ISite;
    this.refreshPage();
  }

  async refreshPage() {
    this.siteApi.queryAllSites().then(async sites => {
      sites = sites.sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0))
      this.sites = sites;
      if (!this.selectedSite) this.selectedSite = sites[0];

      this.products = await this.productApi.queryAllProducts(this.selectedSite.id);
      this.images = await this.productApi.getProductImgaes(this.products.map(p => { return p.id }));

      this.dataSource = new MatTableDataSource(this.products.map(p => {
        let fieldsStr = '| '; p.fields.forEach(f => fieldsStr += `${f.key}:${f.value} | `);
        let productImage = this.images.find(i => { return i.refid === p.id });
        let tableProduct: IProductTable = { siteId: p.siteId, fields: fieldsStr, id: p.id, image: productImage?.url || this.DEFAULT_PRIDCUT_IMAGE };
        return tableProduct;
      }));
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator as unknown as MatTableDataSourcePaginator;
    })
  }

  applyFilter(event: any) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  // Create Product Support
  onFileSelected(event: any) {
    if (event.target.files) {
      const file = event.target.files[0];
      this.currentImage = {
        image: file,
        url: this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(file))
      }
    }
  }

  removeImage() {
    this.currentImage = undefined;
    this.selectFileInputVar.nativeElement.value = "";
  }

  addNewProduct() {
    return Promise.resolve()
      .then(() => {
        return this.dialog.open(this.addProductDialog, {
          height: '90%',
          width: '100%'
        })
      })
      .then(() => {
        const productFields = this.selectedSite?.productsSettings.fields.map(f => {
          return this.formBuilder.group({
            key: [f.key, []],
            value: [null, [Validators.required]],
          }) as FormGroup;
        })

        this.productAddForm = this.formBuilder.group({
          siteName: [this.selectedSite?.name, []],
          fields: this.formBuilder.array(productFields || [])
        })
      })
  }

  getProductFields(): FormArray {
    return this.productAddForm.controls["fields"] as FormArray;
  }

  saveProduct() {
    if (this.selectedSite?.id) {
      const product: IProductCreate = {
        siteId: this.selectedSite?.id,
        fields: this.productAddForm.value['fields']
      }
      this.productApi.createProduct(product)
        .then((product) => {
          if (this.currentImage?.image) return this.imageApi.uploadImage('Product', product.id, 'cover', this.currentImage.image)
          else return;
        }).then(() => { this.refreshPage() })
    }
  }

  // View Product Support
  viewProduct(productId: string) {
    return Promise.resolve()
      .then(() => {
        return this.dialog.open(this.viewProductDialog, {
          height: '90%',
          width: '100%'
        })
      })
      .then(() => {
        const product = this.products.find(p => p.id === productId);
        this.viewImage = { url: this.images.find(img => img.refid === productId)?.url || this.DEFAULT_PRIDCUT_IMAGE };
        const productFields = this.selectedSite?.productsSettings.fields.map(f => {
          const value = product?.fields.find(pf => pf.key === f.key)?.value
          return this.formBuilder.group({
            key: [f.key, []],
            value: [value, []],
          }) as FormGroup;
        })

        this.productViewForm = this.formBuilder.group({
          siteName: [this.selectedSite?.name, []],
          fields: this.formBuilder.array(productFields || [])
        })
      })
  }

  getProductViewFields(): FormArray {
    return this.productViewForm.controls["fields"] as FormArray;
  }

  // Edit Product Support
  editProduct(productId: string) {
    return Promise.resolve()
      .then(() => {
        this.editProductId = productId;
        return this.dialog.open(this.editProductDialog, {
          height: '90%',
          width: '100%'
        })
      })
      .then(() => {
        const product = this.products.find(p => p.id === productId);
        this.editImage = { url: this.images.find(img => img.refid === productId)?.url || '', image: null };
        const productFields = this.selectedSite?.productsSettings.fields.map(f => {
          const value = product?.fields.find(pf => pf.key === f.key)?.value
          return this.formBuilder.group({
            key: [f.key, []],
            value: [value, []],
          }) as FormGroup;
        })

        this.productEditForm = this.formBuilder.group({
          siteName: [this.selectedSite?.name, []],
          fields: this.formBuilder.array(productFields || [])
        })
      })
  }

  getProductEditFields(): FormArray {
    return this.productEditForm.controls["fields"] as FormArray;
  }

  editSaveProduct() {
    if (this.selectedSite?.id) {
      const product: IProduct = {
        id: this.editProductId,
        siteId: this.selectedSite?.id,
        fields: this.productEditForm.value['fields']
      }
      this.productApi.updateProduct(this.editProductId, product)
        .then(() => {
          if (this.editImage?.image) return this.imageApi.uploadImage('Product', this.editProductId, 'cover', this.editImage.image)
          else return;
        }).then(() => { this.refreshPage() })
    }
  }

  onFileEditSelected(event: any) {
    if (event.target.files) {
      const file = event.target.files[0];
      this.editImage = {
        image: file,
        url: this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(file))
      }
    }
  }

  removeEditImage() {
    this.editImage = undefined;
    this.selectFileEditInputVar.nativeElement.value = "";
  }

  // Delete Product Support
  deleteProductFun(productId: string) {
    this.productToDelete.id = productId;
    const productName = this.products.find(p => { return p.id === productId })?.fields.find(f => { return f.key === "name" })?.value;
    this.productToDelete.name = productName || '';
    this.dialog.open(this.deleteDialog);
  }

  cancelProductDelete() {
    this.productToDelete.id = '';
    this.productToDelete.name = '';
    this.dialog.closeAll();
  }

  deleteProduct() {
    if (this.productToDelete.id) {
      this.productApi.deleteProduct(this.productToDelete.id)
        .then(() => { return this.refreshPage() })
        .then(() => { this.cancelProductDelete(); })
    }
  }

}
