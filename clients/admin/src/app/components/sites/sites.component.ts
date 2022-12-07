import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { SiteApiService, ISite } from 'src/app/services/site-api.service';
import { MatTableDataSource, MatTableDataSourcePaginator } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';

@Component({
  selector: 'app-sites',
  templateUrl: './sites.component.html',
  styleUrls: ['./sites.component.scss']
})
export class SitesComponent implements OnInit {
  dataSource: MatTableDataSource<ISite>;
  sites: ISite[];
  columns: string[] = ['id', 'name', 'description', 'linkDesktop', 'actions'];

  @ViewChild(MatSort, { static: true })
  sort!: MatSort;

  @ViewChild(MatPaginator, { static: true })
  paginator!: MatPaginator;

  @ViewChild('deleteSiteDialog') deleteDialog!: TemplateRef<any>;
  siteToDelete: { name: string, id: string } = { name: '', id: '' };

  @ViewChild('addNewSiteDialog') addDialog!: TemplateRef<any>;
  public siteAddForm!: FormGroup;

  @ViewChild('viewDialog') viewDialog!: TemplateRef<any>;
  public siteViewForm!: FormGroup;

  @ViewChild('editDialog') editDialog!: TemplateRef<any>;
  public editSiteForm!: FormGroup;
  siteEditId: string = '';

  constructor(private siteApi: SiteApiService, private dialog: MatDialog, private formBuilder: FormBuilder) {
    this.sites = [];
    this.dataSource = new MatTableDataSource(this.sites);
  }

  async ngOnInit() {
    this.refreshPage();
  }

  applyFilter(event: any) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  // Create Site Support
  addNewSite() {
    return Promise.resolve()
      .then(() => {
        return this.dialog.open(this.addDialog, {
          height: '90%',
          width: '100%'
        })
      })
      .then(() => {
        const MandatoryNameProductSettings = this.formBuilder.group({
          key: ['name', [Validators.required]],
          type: ['string', [Validators.required]],
          isMandatory: ['yes', [Validators.required]]
        }) as FormGroup;

        const MandatoryCategoryProductSettings = this.formBuilder.group({
          key: ['category', [Validators.required]],
          type: ['string', [Validators.required]],
          isMandatory: ['yes', [Validators.required]]
        }) as FormGroup;


        const MandatoryPriceProductSettings = this.formBuilder.group({
          key: ['price', [Validators.required]],
          type: ['number', [Validators.required]],
          isMandatory: ['yes', [Validators.required]]
        }) as FormGroup;

        const MandatoryEmailOrderSettings = this.formBuilder.group({
          key: ['email', [Validators.required]],
          type: ['string', [Validators.required]],
          isMandatory: ['yes', [Validators.required]]
        }) as FormGroup;

        this.siteAddForm = this.formBuilder.group({
          name: [null, [Validators.required]],
          description: [null, [Validators.required]],
          productsSettings: this.formBuilder.array([MandatoryNameProductSettings, MandatoryPriceProductSettings, MandatoryCategoryProductSettings]),
          ordersSettings: this.formBuilder.array([MandatoryEmailOrderSettings])
        })
      })
  }

  getProductSettings(): FormArray {
    return this.siteAddForm.controls["productsSettings"] as FormArray;
  }

  addProductSettings() {
    const productSettings = this.formBuilder.group({
      key: [null, [Validators.required]],
      type: ['string', [Validators.required]],
      isMandatory: ['no', [Validators.required]]
    }) as FormGroup;
    this.getProductSettings().push(productSettings);
  }

  deleteProductSetting(index: number) {
    this.getProductSettings().removeAt(index);
  }

  getOrderSettings(): FormArray {
    return this.siteAddForm.controls["ordersSettings"] as FormArray;
  }

  addOrderSettings() {
    const orderSettings = this.formBuilder.group({
      key: [null, [Validators.required]],
      type: ['string', [Validators.required]],
      isMandatory: ['no', [Validators.required]]
    }) as FormGroup;
    this.getOrderSettings().push(orderSettings);
  }


  deleteOrderSetting(index: number) {
    this.getOrderSettings().removeAt(index);
  }

  saveSite() {
    const site: ISite = {
      name: this.siteAddForm.value['name'],
      description: this.siteAddForm.value['description'],
      productsSettings: { fields: this.siteAddForm.value['productsSettings'].map((e: any) => { e.isMandatory = e.isMandatory === "yes"; return e; }) },
      ordersSettings: { fields: this.siteAddForm.value['ordersSettings'].map((e: any) => { e.isMandatory = e.isMandatory === "yes"; return e; }) }
    }
    this.siteApi.createSite(site).then(() => { this.refreshPage() })
  }

  // Delete Site Support

  deleteSiteDialogFun(siteId: string, name: string) {
    this.siteToDelete.id = siteId;
    this.siteToDelete.name = name;
    this.dialog.open(this.deleteDialog);
  }

  cancelDeleteSite() {
    this.siteToDelete.id = '';
    this.siteToDelete.name = '';
    this.dialog.closeAll();
  }

  deleteSite() {
    if (this.siteToDelete.id) {
      this.siteApi.deleteSite(this.siteToDelete.id)
        .then(() => { return this.refreshPage() })
        .then(() => { this.cancelDeleteSite(); })
    }
  }

  // View Site Support

  viewSite(siteId: string) {
    return this.siteApi.getSiteById(siteId)
      .then((site) => {
        return this.initViewFormWithData(site);
      })
      .then(() => {
        return this.dialog.open(this.viewDialog, { height: '90%', width: '100%' });
      })
  }

  getViewProductSettings(): FormArray {
    return this.siteViewForm.controls["productsSettings"] as FormArray;
  }

  getViewOrderSettings(): FormArray {
    return this.siteViewForm.controls["ordersSettings"] as FormArray;
  }

  // Edit Site Support
  editSite(siteId: string) {
    return this.siteApi.getSiteById(siteId)
      .then((site) => {
        return this.initEditFormWithData(site);
      })
      .then(() => {
        this.siteEditId = siteId;
        return this.dialog.open(this.editDialog, { height: '90%', width: '100%' });
      })
  }

  saveEditSite() {
    const site: ISite = {
      name: this.editSiteForm.value['name'],
      description: this.editSiteForm.value['description'],
      productsSettings: { fields: this.editSiteForm.value['productsSettings'].map((e: any) => { e.isMandatory = e.isMandatory === "yes"; return e; }) },
      ordersSettings: { fields: this.editSiteForm.value['ordersSettings'].map((e: any) => { e.isMandatory = e.isMandatory === "yes"; return e; }) }
    }
    this.siteApi.updateSite(this.siteEditId, site).then(() => { this.refreshPage() })
  }

  getEditProductSettings(): FormArray {
    return this.editSiteForm.controls["productsSettings"] as FormArray;
  }

  getEditOrderSettings(): FormArray {
    return this.editSiteForm.controls["ordersSettings"] as FormArray;
  }

  addEditProductSettings() {
    const productSettings = this.formBuilder.group({
      key: [null, [Validators.required]],
      type: ['string', [Validators.required]],
      isMandatory: ['no', [Validators.required]]
    }) as FormGroup;
    this.getEditProductSettings().push(productSettings);
  }

  deleteEditProductSetting(index: number) {
    this.getEditProductSettings().removeAt(index);
  }

  addEditOrderSettings() {
    const orderSettings = this.formBuilder.group({
      key: [null, [Validators.required]],
      type: ['string', [Validators.required]],
      isMandatory: ['no', [Validators.required]]
    }) as FormGroup;
    this.getEditOrderSettings().push(orderSettings);
  }

  deleteEditOrderSetting(index: number) {
    this.getEditOrderSettings().removeAt(index);
  }

  async refreshPage() {
    this.sites = await this.siteApi.queryAllSites();
    this.dataSource = new MatTableDataSource(this.sites);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator as unknown as MatTableDataSourcePaginator;
  }

  private initViewFormWithData(site: ISite) {
    const productSettings = site.productsSettings.fields.map(f => {
      const isMandatory = f.isMandatory ? 'yes' : 'no';
      return this.formBuilder.group({
        key: [f.key, []],
        type: [f.type, []],
        isMandatory: [isMandatory, []]
      }) as FormGroup;
    })

    const orderSettings = site.ordersSettings.fields.map(f => {
      const isMandatory = f.isMandatory ? 'yes' : 'no';
      return this.formBuilder.group({
        key: [f.key, []],
        type: [f.type, []],
        isMandatory: [isMandatory, []]
      }) as FormGroup;
    })

    this.siteViewForm = this.formBuilder.group({
      name: [site.name, []],
      description: [site.description, []],
      productsSettings: this.formBuilder.array(productSettings),
      ordersSettings: this.formBuilder.array(orderSettings)
    })
  }

  private initEditFormWithData(site: ISite) {
    const productSettings = site.productsSettings.fields.map(f => {
      const isMandatory = f.isMandatory ? 'yes' : 'no';
      return this.formBuilder.group({
        key: [f.key, []],
        type: [f.type, []],
        isMandatory: [isMandatory, []]
      }) as FormGroup;
    })

    const orderSettings = site.ordersSettings.fields.map(f => {
      const isMandatory = f.isMandatory ? 'yes' : 'no';
      return this.formBuilder.group({
        key: [f.key, []],
        type: [f.type, []],
        isMandatory: [isMandatory, []]
      }) as FormGroup;
    })

    this.editSiteForm = this.formBuilder.group({
      name: [site.name, []],
      description: [site.description, []],
      productsSettings: this.formBuilder.array(productSettings),
      ordersSettings: this.formBuilder.array(orderSettings)
    })
  }

}
