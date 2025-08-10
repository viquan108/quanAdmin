import { Component, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonService } from '../common.service';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';

@Component({
  selector: 'app-product-search',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatExpansionModule,
  ],
  templateUrl: './product-search.component.html',
  styleUrl: './product-search.component.scss'
})
export class ProductSearchComponent {
  // bring selected entry on top and make search result collapsible

  @Output() onSelectProduct: EventEmitter<any> = new EventEmitter();

  searchForm!:FormGroup;
  searchResult!: [{[key:string]: any}];
  selectedEntry:any;

  expand = false;

  constructor(private commonService: CommonService){}
  
  ngOnInit(){
    this.searchForm = new FormGroup({
      keyword: new FormControl(),
      // type
    })
  }
  onSearch(type:any){
    console.log(this.searchForm);
    console.log(this.searchForm.controls['keyword'].value);
    this.commonService.searchEntry(this.searchForm.controls['keyword'].value).subscribe((response:any) => {
      console.log(response);
      this.searchResult = response;
      this.expand = true;
    });
  }
  selectProduct(selectedProduct:any){
    this.selectedEntry = selectedProduct;
    this.onSelectProduct.emit(selectedProduct);
    this.expand = false;
  }
}
