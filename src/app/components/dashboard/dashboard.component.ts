import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/Auth/auth.service';
import { DataFromTokenService } from 'src/app/services/DataFromToken/data-from-token.service';
import { UserService } from 'src/app/services/User/user.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  public users:any = [];
  public fullName : string = "";
  public role!:string;
  
  constructor(
    private auth:AuthService,
    private user:UserService,
    private dataFromToken:DataFromTokenService
    ){}
  ngOnInit(): void {
    this.user.getAllUsers().subscribe((res=>{
      this.users = res;
    }))


    this.dataFromToken.getFullNameFromStore()
    .subscribe(val=>{
      const fullNameFromToken = this.auth.getfullNameFromToken();
      debugger
      this.fullName = val || fullNameFromToken
    });

    this.dataFromToken.getRoleFromStore()
    .subscribe(val=>{
      const roleFromToken = this.auth.getRoleFromToken();
      this.role = val || roleFromToken;
    })
  }
  
  
  signout(){
    this.auth.signOut();
  }
}
