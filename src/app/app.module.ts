import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './features/auth/login/login.component';
import { LandingComponent } from './features/landing/landing.component';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { ToolCardComponent } from './shared/components/tool-card/tool-card.component';
import { ToolLayoutComponent } from './shared/components/tool-layout/tool-layout.component';
import { Hl7ParserComponent } from './features/tools/hl7-parser/hl7-parser.component';
import { FormsModule } from '@angular/forms';
import { JsonFormatterComponent } from './features/tools/json-formatter/json-formatter.component';
import { SkeletonLoaderComponent } from './shared/components/skeleton-loader/skeleton-loader.component';
import { TextToPdfComponent } from './features/tools/text-to-pdf/text-to-pdf.component';
import { ToastComponent } from './shared/components/toast/toast.component';
import { PdfToImageComponent } from './features/tools/pdf-to-image/pdf-to-image.component';
import { FileToolLayoutComponent } from './shared/components/file-tool-layout/file-tool-layout.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    LandingComponent,
    NavbarComponent,
    ToolCardComponent,
    ToolLayoutComponent,
    Hl7ParserComponent,
    JsonFormatterComponent,
    SkeletonLoaderComponent,
    TextToPdfComponent,
    ToastComponent,
    PdfToImageComponent,
    FileToolLayoutComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule, 
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
