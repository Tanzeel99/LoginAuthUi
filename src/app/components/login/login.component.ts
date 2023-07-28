import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators,NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/Auth/auth.service';
import { DataFromTokenService } from 'src/app/services/DataFromToken/data-from-token.service';
import { ResetPasswordService } from 'src/app/services/ResetPassword/reset-password.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit{
  type:string = 'password';
  isText:boolean = false;
  eyeIcon: string = "fa-eye-slash";
  loginForm!:FormGroup;
  formValid: boolean = false;
  public resetPasswordEmail!:string;
  public isValidEmail!:boolean;

  constructor(
     private fb: FormBuilder,
     private auth: AuthService,
     private router:Router,
     private toaster : ToastrService,
     private dataFromToken:DataFromTokenService,
     private resetPassword:ResetPasswordService
  ){}
  
  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username : ['',Validators.required],
      password : ['',Validators.required],
    })
  }
  
  hideShowPass(){
    this.isText = !this.isText;
    this.isText ? this.eyeIcon = "fa-eye" : this.eyeIcon = "fa-eye-slash";
    this.isText ? this.type = "text" : this.type = "password";
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.formValid = true;
      this.auth.login(this.loginForm.value).subscribe({
        next: (res => {
          // this.toaster.success(res.message);
          this.auth.storeToken(res.accessToken);
          this.auth.storeRefreshToken(res.refreshToken);
          const userPayload = this.auth.decodedToken();
          this.dataFromToken.setFullNameForStore(userPayload.unique_name);
          this.dataFromToken.setRoleForStore(userPayload.role);
          this.router.navigate(['dashboard']);
        }), error: (error => {
          // this.toaster.error(error?.error.message)
        })
      })
    }
  }

  checkValidEmail(event:string){
    const value = event;
    const emailPattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,3}$/;
    this.isValidEmail = emailPattern.test(value);
    return this.isValidEmail;
  }

  sendmail(){
    if(this.checkValidEmail(this.resetPasswordEmail)){
      this.resetPassword.sendResetPasswordLink(this.resetPasswordEmail).subscribe({
        next:(res)=>{
          this.resetPasswordEmail = "";
          const cancelBtn = document.getElementById('cancelBtn');
          cancelBtn?.click();
      },
      error:(err)=>{
        this.toaster.error("Something went wrong")
      }})}
    }
}
