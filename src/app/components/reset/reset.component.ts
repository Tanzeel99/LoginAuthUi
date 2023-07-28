import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ConfirmPassword } from 'src/app/helpers/confirm-password.validator';
import { ResetModel } from 'src/app/models/reset.model';
import { ResetPasswordService } from 'src/app/services/ResetPassword/reset-password.service';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.scss']
})
export class ResetComponent implements OnInit{
  type:string = 'password';
  isText:boolean = false;
  eyeIcon: string = "fa-eye-slash";
  resetForm!:FormGroup;
  emailToReset!:string;
  emailToken!:string;
  resetPass = new ResetModel();
  

  constructor(
    private fb: FormBuilder,
    private activatedoute : ActivatedRoute,
    private resetService: ResetPasswordService,
    private toast:ToastrService,
    private route : Router
  ){

  }

  ngOnInit(): void {
    this.resetForm = this.fb.group({
      currentPassword : ['',Validators.required],
      newPassword : ['',Validators.required],
    },
    {
      validator: ConfirmPassword("currentPassword","newPassword")
    });

    this.activatedoute.queryParams.subscribe(val=>{
      this.emailToReset = val['email'];
      let uriToken = val['code'];
      this.emailToken = uriToken.replace(/ /g,'+');
    })
  }


  hideShowPass(){
    this.isText = !this.isText;
    this.isText ? this.eyeIcon = "fa-eye" : this.eyeIcon = "fa-eye-slash";
    this.isText ? this.type = "text" : this.type = "password";
  }

  onSubmit() {
    if (this.resetForm.valid) {
      this.resetPass.email = this.emailToReset;
      this.resetPass.emailToken = this.emailToken;
      this.resetPass.newPassword = this.resetForm.value.newPassword;
      this.resetPass.confirmPassword = this.resetForm.value.currentPassword;
      this.resetService.resetPassword(this.resetPass).subscribe(res=>{
        this.toast.success("Password Reset Successfully");
        this.route.navigate(['/login']);
      })
    }else{

    }
  }
}
