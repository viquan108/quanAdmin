import { Component, ChangeDetectorRef, inject } from '@angular/core';
import { CommonService } from '../common.service';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatTabsModule} from '@angular/material/tabs';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { ProductSearchComponent } from '../product-search/product-search.component';
import { ProductFormComponent } from '../product-form/product-form.component';
import { OutputViewComponent } from '../output-view/output-view.component';
import { DeleteResourceDialogComponent } from '../delete-resource-dialog/delete-resource-dialog.component';
import { Dialog } from '@angular/cdk/dialog';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-admin-page',
  standalone: true,
  imports: [
    ProductSearchComponent,
    OutputViewComponent,
    ProductFormComponent,
    ReactiveFormsModule,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatTabsModule, 
    MatProgressBarModule
  ],
  templateUrl: './admin-page.component.html',
  styleUrl: './admin-page.component.scss'
})
export class AdminPageComponent {

  //TODO: reset serverresponse and product form when tab change

  // CREATE,UPDATE,DELETE 0,1,2
  currentAction: number = 0;//'CREATE';

  productFormValue:any = {
    id: null,
    sku: null,
    productName: null,
    condition: null,
    price: null,
    resources: null,
    tags: null,
    mountType: null,
    cname:null,
    category: null,
  };

  serverResponse!: string;

  dialog = inject(Dialog);

  tabChangeEvent: Subject<any> = new Subject<any>();

  constructor(
    private commonService: CommonService,
    private cd: ChangeDetectorRef
    ){}

  ngOnInit(){
  }

  ontabChange(event:any){
    this.productFormValue = {
      id: null,
      sku: null,
      productName: null,
      condition: null,
      price: null,
      resources: null,
      tags: null,
      mountType: null,
      cname:null,
      category: null,
    };
    this.currentAction = event.index;
    this.tabChangeEvent.next(this.currentAction);
  }


  onSubmit(event:any){
    Object.assign(this.productFormValue, event); //patch
    // validate
    switch(this.currentAction){
      case 0:{
        this.commonService.createNewEntry(this.productFormValue).subscribe((response:any) => {
          console.log(response);
          this.serverResponse = JSON.stringify(response); // pretty print?
        });
      }
      break;
      case 1:{
          this.commonService.updateEntry(this.productFormValue).subscribe((response:any)=>{
          console.log(response);
          this.serverResponse = JSON.stringify(response);
          });
      }
      break;
      case 2:{
        this.commonService.deleteEntry(this.productFormValue).subscribe((response:any)=>{
        console.log(response);
        this.serverResponse = JSON.stringify(response);
        });
    }
    }


  }

  onSelectProduct(selectedProduct:any){
    //create an object that fit product form 
    let formData: {[key:string]: any} = {};
    Object.keys(this.productFormValue).forEach((key: string) =>{ 
      formData[key] = selectedProduct[key];
    });
    this.productFormValue = formData;

    if(this.currentAction == 2){
      //delete 
      this.openDeleteEntryDialog();
    }
  }

  openDeleteEntryDialog(): void {
    // TODO: refactor into a common function
    const dialogRef = this.dialog.open<string>(DeleteResourceDialogComponent, {
      width: '500px',
      data: {},
    });

    dialogRef.closed.subscribe((result:any) => {
      switch(result){
        case 'ok':{
          this.onSubmit(2);
        }
        break;
        case 'cancel':{
          console.log('cancel');
        }
      }
    });
  }

  ngOnDestroy(){
    this.tabChangeEvent.next('');
    this.tabChangeEvent.complete();
  }
}
