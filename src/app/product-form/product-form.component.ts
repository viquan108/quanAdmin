import { Component, Input, Output, EventEmitter, SimpleChanges, inject } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule, FormsModule, Validators } from '@angular/forms';
import { CommonService } from '../common.service';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule, MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import {MatSelectModule} from '@angular/material/select';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import { ImgUploadComponent } from '../img-upload/img-upload.component';

import { Dialog } from '@angular/cdk/dialog';
import { DeleteResourceDialogComponent } from '../delete-resource-dialog/delete-resource-dialog.component';


@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    ImgUploadComponent
  ],
  providers: [
    {provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {appearance: 'outline'}}
  ],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.scss'
})
export class ProductFormComponent {

  @Input() formValue:any;
  @Output() onSubmitFormEvent: EventEmitter<any> = new EventEmitter();

  productForm!: FormGroup;

  inputTag!: string;
  tags: string[] = [];
  tagExisted:boolean = false;
  resourcesList: string[] = [];
  fileToUpload: File | null = null;
  resourceBaseUrl:string = 'http://localhost:9090/img/';

  dialog = inject(Dialog);

  constructor( private commonService:CommonService ){
    this.productForm = new FormGroup({
      sku: new FormControl('',[Validators.required]),
      productName: new FormControl('',[Validators.required]),
      description: new FormControl(),
      condition: new FormControl('',[Validators.required]),
      price: new FormControl('',[Validators.required]),
      resources: new FormControl(),
      category: new FormControl(),
      cname: new FormControl(),
      mountType: new FormControl(),
      tags: new FormControl()
    })
  }

  ngOnInit(){
    //patch tags
    // this.tags = JSON.parse(this.productForm.controls['tags'].value)
    // console.log(this.tags);
  }

  ngOnChanges(changes: SimpleChanges) {
    if(Object.keys(changes).includes('formValue')){
      console.log(changes);
      this.productForm.patchValue(this.formValue);

      if(this.productForm.controls['tags'].value){
        // this.tags = JSON.parse(this.productForm.controls['tags'].value)
        this.tags = this.productForm.controls['tags'].value;
      }

      if(this.productForm.controls['resources'].value){
        this.resourcesList = JSON.parse(this.productForm.controls['resources'].value)
      }

    }   
  }

  getFormError(field:any, errorType:any):boolean{
    return ((this.productForm.get(field) as FormControl).hasError(errorType)) || false;
  }

  onAddTag(event:any){
    let keyword = (event as string).toLowerCase().trim();
    if(!this.tags.includes(keyword)){
      this.tags =this.tags.concat([keyword]);
      console.log(this.tags);
      this.productForm.controls['tags'].patchValue(this.tags);
      console.log(this.productForm);
    }else{
      console.log('tag existed');
      this.tagExisted = true;
    }
  }
  deleteTag(tagToDelete:any){
    this.tags = this.tags.filter((t:any) => t!=tagToDelete);
    this.productForm.controls['tags'].patchValue(this.tags);
  }

  handleUploadFile(event:any){
    // $event.target.files
    let files = event.target.files;
    this.fileToUpload = files.item(0);
    if(this.fileToUpload){
      this.commonService.postFile(this.fileToUpload);
    }
  }

  onUploadComplete(uploadedFileName:any){
    console.log(uploadedFileName);
    this.resourcesList.push(uploadedFileName);
    (this.productForm.controls['resources'] as FormControl).patchValue(JSON.stringify(this.resourcesList));
  }

  onDeleteImgRequest(index:number){
    this.openDeleteDialog(index);
  }

  openDeleteDialog(index :number): void {
    const dialogRef = this.dialog.open<string>(DeleteResourceDialogComponent, {
      width: '500px',
      data: {
        index: index,
        fileName: this.resourcesList[index],
        message:"Are you sure you want to delete this resource?"
      },
    });

    dialogRef.closed.subscribe((result:any) => {
      switch(result){
        case 'ok':{
          this.commonService.deleteFile(this.resourcesList[index]).subscribe((data:any)=>{
            if(this.resourcesList.indexOf(data.fileName)!= -1){
              this.resourcesList.splice(this.resourcesList.indexOf(data.fileName), 1); 
              (this.productForm.controls['resources'] as FormControl).patchValue(JSON.stringify(this.resourcesList));
            }
          })

        }
        break;
        case 'cancel':{
          console.log('cancel');
        }
      }
    });
  }

  onSubmit(){
    console.log(this.productForm.value);
    this.onSubmitFormEvent.emit(this.productForm.value);
  }

}
