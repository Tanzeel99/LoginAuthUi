import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/Auth/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { TokenAPIModel } from '../models/token-api.model';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private auth: AuthService,private toast:ToastrService,private route:Router) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = this.auth.getToken();
    if(token){
      request = request.clone({
        setHeaders: {Authorization:`Bearer ${token}`}
      })
    }

    return next.handle(request).pipe(
      catchError((error:any)=>{
      if(error instanceof HttpErrorResponse){
        if(error.status === 401){
          return this.handleError(request,next);
          // this.route.navigate(['login']);
          // this.toast.error("Token expired. Please login again");
        }
      }
      return throwError(()=> new Error("Something went wrong"))
      })
    );
  }
  handleError(req:HttpRequest<any>,next:HttpHandler){
    let tokeApiModel = new TokenAPIModel();
    tokeApiModel.accessToken = this.auth.getToken()!;
    tokeApiModel.refreshToken = this.auth.getRefreshToken()!;
    return this.auth.renewToken(tokeApiModel)
    .pipe(
      switchMap((data:TokenAPIModel)=>{
        this.auth.storeRefreshToken(data.refreshToken);
        this.auth.storeToken(data.accessToken);
        req = req.clone({
          setHeaders: {Authorization:`Bearer ${data.accessToken}`}  // "Bearer "+myToken
        })
        return next.handle(req);
      }),
      catchError((err)=>{
        return throwError(()=>{
          this.toast.error("Token expired. Please login again");
          this.route.navigate(['login'])
        })
      })
    )
  }
}
