import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {JwtHelperService} from '@auth0/angular-jwt'
import { TokenAPIModel } from 'src/app/models/token-api.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
private baseUrl:string = "https://localhost:7128/api/User/";
private userPayload:any;

  constructor(private http:HttpClient, private route:Router) { 
    this.userPayload = this.decodedToken();
   }

  login(userData:any){
    return this.http.post<any>(`${this.baseUrl}login`,userData)
  }

  signUp(userData:any){
    return this.http.post<any>(`${this.baseUrl}signup`,userData)
  }

  isLoggedIn():boolean{
    return !!localStorage.getItem("token");
  }

  getToken(){
    return localStorage.getItem("token");
  }

  storeToken(token:string){
    localStorage.setItem("token",token);
  }

  getRefreshToken(){
    return localStorage.getItem("refreshToken");
  }

  storeRefreshToken(refreshToken:string){
    localStorage.setItem("refreshToken",refreshToken);
  }

  signOut(){
    // localStorage.removeItem("token");
    localStorage.clear();
    this.route.navigate(['login']);
  }

  decodedToken(){
    const jwtHelper = new JwtHelperService();
    const token = this.getToken()!;
    return jwtHelper.decodeToken(token)
  }

  getfullNameFromToken(){
    if(this.userPayload)
    return this.userPayload.unique_name;
  }

  getRoleFromToken(){
    if(this.userPayload)
    return this.userPayload.role;
  }

  renewToken(tokenAPI:TokenAPIModel){
    return this.http.post<any>(`${this.baseUrl}refresh`,tokenAPI)

  }
}

