import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingComponent } from './features/landing/landing.component';
import { Hl7ParserComponent } from './features/tools/hl7-parser/hl7-parser.component';
import { JsonFormatterComponent } from './features/tools/json-formatter/json-formatter.component';
import { TextToPdfComponent } from './features/tools/text-to-pdf/text-to-pdf.component';
import { PdfToImageComponent } from './features/tools/pdf-to-image/pdf-to-image.component';
import { ImageToPdfComponent } from './features/tools/image-to-pdf/image-to-pdf.component';

const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'tools/hl7-parser', component: Hl7ParserComponent },
  { path: 'tools/json-formatter', component: JsonFormatterComponent },
  { path: 'tools/text-to-pdf', component: TextToPdfComponent },
  { path: 'tools/pdf-to-image', component: PdfToImageComponent },
  { path: 'tools/image-to-pdf', component: ImageToPdfComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
