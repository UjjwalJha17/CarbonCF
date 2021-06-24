import { Injectable } from '@angular/core';
import{ HttpClientModule, HttpClient } from '@angular/common/http';
import{ Observable } from 'rxjs/Observable'
import { ResourceLoader } from '@angular/compiler';

@Injectable()
export class ManagerService {

  private _url:string="http://localhost:3000/";
  public result:Observable<any>

  constructor(private _http: HttpClient){}

  public getValues(path:string):Observable<any>{
      return this._http.get<any>(this._url+path);
  }
 
}
