import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/Auth/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit{
  type:string = 'password';
  isText:boolean = false;
  eyeIcon: string = "fa-eye-slash";
  formValid: boolean = false;
  signUpForm!:FormGroup;

  constructor(
    private fb: FormBuilder,
    private auth:AuthService,
    private router: Router,
    private toaster : ToastrService
  ){

  }

  ngOnInit(): void {
    this.signUpForm = this.fb.group({
      firstname : ['',Validators.required],
      lastname : ['',Validators.required],
      email : ['',Validators.required],
      username : ['',Validators.required],
      password : ['',Validators.required],
    })
  }


  hideShowPass(){
    this.isText = !this.isText;
    this.isText ? this.eyeIcon = "fa-eye" : this.eyeIcon = "fa-eye-slash";
    this.isText ? this.type = "text" : this.type = "password";
  }

  onSubmit(){
    if (this.signUpForm.valid) {
      this.formValid = true;
      this.auth.signUp(this.signUpForm.value).subscribe({
        next: (res => {
          this.toaster.success(res.message);
          this.signUpForm.reset();
          this.router.navigate(['login']);
        }), error: (error => {
          this.toaster.error(error?.error.message)
        })
      })
    }
  }
}

