import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  serviceBaseUrl: string = 'http://localhost:4300/backend';
  constructor(private http: HttpClient) { }

  createNewEntry(payload:any){
    return this.http.post(`${this.serviceBaseUrl}/storeProductToDb`,payload);
  }

  updateEntry(payload:any){
    return this.http.put(`${this.serviceBaseUrl}/updateProductById`,payload);
  }

  deleteEntry(payload:any){
    return this.http.delete(`${this.serviceBaseUrl}/deleteProductById?id=${payload.id}`,);
  }

  searchEntry(payload:any){
    return this.http.get(`${this.serviceBaseUrl}/findProductBySku?sku=${payload}`);
  }

  postFile(fileToUpload: File){
    const endpoint = 'your-destination-url';
    const formData: FormData = new FormData();
    formData.append('fileKey', fileToUpload, fileToUpload.name);
    // return this.http.post(endpoint, formData);
      // .map(() => { return true; })
      // .catch((e:any) => this.handleError(e));
  }

  uploadFile(file:any, relativePath:any){
    const formData = new FormData()
    formData.append('image', file, relativePath);
    return this.http.post(`${this.serviceBaseUrl}/uploadImg`, formData, { observe: "body", responseType: 'blob' });
  }

  deleteFile(fileName: string){
    return this.http.delete(`${this.serviceBaseUrl}/deleteImg?fileName=${fileName}`);
  }



  // { 
  //   body?: any; 
  //   headers?: HttpHeaders | Record<string, string | string[]> | undefined;
  //   context?: HttpContext | undefined; 
  //   observe?: "body" | undefined; 
  //   params?: HttpParams | Record<string, string | number | boolean | readonly (string | number | boolean)[]> | undefined; 
  //   reportProgress?: boolean | undefined; 
  //   responseType: "blob"; 
  //   withCredentials?: boolean | undefined; 
  //   transferCache?: boolean | { includeHeaders?: string[] | undefined; } | undefined; 
  // }

  // { 
  //   body?: any; 
  //   headers?: HttpHeaders | Record<string, string | string[]> | undefined; 
  //   observe: "events"; 
  //   context?: HttpContext | undefined; 
  //   params?: HttpParams | Record<string, string | number | boolean | readonly (string | number | boolean)[]> | undefined; 
  //   reportProgress?: boolean | undefined; 
  //   responseType: "blob"; 
  //   withCredentials?: boolean | undefined; 
  //   transferCache?: boolean | { includeHeaders?: string[] | undefined; } | undefined; 
  // }

}
