import { FormGroup } from "@angular/forms";

export function ConfirmPassword(CurrentPassword:string,NewPassword:string){
    return (formGoup:FormGroup)=>{
        const currentPassword = formGoup.controls[CurrentPassword];
        const newPassword = formGoup.controls[NewPassword];
        if(newPassword.errors && newPassword.errors['confirmPassword']){
            return;
        }
        if(currentPassword.value !== newPassword.value){
            newPassword.setErrors({confirmPassword : true})
        }else{
            newPassword.setErrors({confirmPassword : null})
        }
    }
}