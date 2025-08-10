import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NgxFileDropModule } from 'ngx-file-drop';

import { NgxFileDropEntry, FileSystemFileEntry, FileSystemDirectoryEntry } from 'ngx-file-drop';
import { CommonModule } from '@angular/common';
import { CommonService } from '../common.service';

import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-img-upload',
  standalone: true,
  imports: [
    NgxFileDropModule,
    CommonModule,
    MatIconModule
  ],
  templateUrl: './img-upload.component.html',
  styleUrl: './img-upload.component.scss'
})
export class ImgUploadComponent {

  @Input() thumbnailsUrl!: string; // = ['www.google.com'];

  @Output() onUploadCompleteEvent: EventEmitter<any> = new EventEmitter();


  public files: NgxFileDropEntry[] = [];
  public resourceList!: string[];

  constructor(private commonService:CommonService){}

  ngOnInit(){
    console.log('img init');
    if(this.thumbnailsUrl){
      this.resourceList = JSON.parse(this.thumbnailsUrl);
      console.log(this.resourceList);
    }
    
  }

  public dropped(files: NgxFileDropEntry[]) {
    const fileNames = this.files.map((file:any)=>file.fileEntry.name);

    this.files = files;
    for (const droppedFile of files) {
      // Is it a file?
      if (droppedFile.fileEntry.isFile) {

        //check if file exist in list
        if(fileNames.includes(droppedFile.fileEntry.name)){
          console.log('file exist in list');
          return;
        }

        // is it a image file?
        // check file size
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {
          // // Headers
          // const headers = new HttpHeaders({
          //   'security-token': 'mytoken'
          // })
          this.commonService.uploadFile(file, droppedFile.relativePath)
            .subscribe((data:any) => {
            data.text().then( (data:any)=>{
              const resJson = JSON.parse(data);
              console.log('resource name:',resJson);
              this.onUploadCompleteEvent.emit(resJson.fileName);
            })
            // if upload success:
            // pull resource data from server or get it locally
            console.log('Uploaded file name:', droppedFile.relativePath);
          })

        });
      } else {
        // It was a directory (empty directories are added, otherwise only files)
        const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
        console.log(droppedFile.relativePath, fileEntry);
      }
    }
  }

  public fileOver(event:any){
    console.log('fileOver')
  }

  public fileLeave(event:any){
    console.log('fileLeave')
  }

}
