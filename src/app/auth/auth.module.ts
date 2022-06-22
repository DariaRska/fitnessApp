import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FlexLayoutModule } from "@angular/flex-layout";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MaterialModule } from "../material/material.module";
import { LoginComponent } from "./login/login.component";
import { SignupComponent } from "./signup/signup.component";
import { AngularFireAuthModule } from '@angular/fire/compat/auth';

@NgModule({
    declarations: [
        SignupComponent,
        LoginComponent,
    ],
    // kazdy modul, zeby miec dostep do wszytskiego musi miec swoje importy
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MaterialModule,
        FlexLayoutModule,
        AngularFireAuthModule,
    ],
    exports: []
})
export class AuthModule {}