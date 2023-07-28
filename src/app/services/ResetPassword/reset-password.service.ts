import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ResetModel } from 'src/app/models/reset.model';

@Injectable({
  providedIn: 'root'
})
export class ResetPasswordService {
  public baseUrl:string = "https://localhost:7128/api/User/";
  constructor(private http:HttpClient) { }

  sendResetPasswordLink(email:string){
    return this.http.post<any>(`${this.baseUrl}send-reset-email/${email}`,{})
  }

  resetPassword(data:ResetModel){
    return this.http.post<any>(`${this.baseUrl}reset-password`,data)
  }
}
