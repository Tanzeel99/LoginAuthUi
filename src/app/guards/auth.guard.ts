import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/Auth/auth.service';
import { ToastrService } from 'ngx-toastr';


export const authGuard: CanActivateFn = (route, state) => {
const auth = inject(AuthService);
const router = inject(Router);
const toast = inject(ToastrService);
  let isLoggedIn = auth.isLoggedIn();
  if(isLoggedIn){
    return true;
  }else{
    router.navigate(['login']);
    toast.error("Login failed");
    return false;
  }
};
