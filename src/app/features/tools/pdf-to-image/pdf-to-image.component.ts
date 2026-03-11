import { Component, ViewChild } from '@angular/core';
import { FileToolLayoutComponent } from '../../../shared/components/file-tool-layout/file-tool-layout.component';
import { ToolsService } from '../../../core/services/tools.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-pdf-to-image',
  templateUrl: './pdf-to-image.component.html',
  styleUrls: ['./pdf-to-image.component.css']
})
export class PdfToImageComponent {
  @ViewChild(FileToolLayoutComponent) fileToolLayout!: FileToolLayoutComponent;

  toolName = 'PDF → Image';
  toolDescription = 'Convert PDF documents to image files.';
  toolIcon = '🖼️';

  constructor(
    private toolsService: ToolsService,
    private toastService: ToastService
  ) {}

  handleProcess(file: File): void {
    const startTime = performance.now();
    
    this.toolsService.pdfToImage(file).subscribe({
      next: (response) => {
        const endTime = performance.now();
        const processingTime = endTime - startTime;
        
        if (response.success && response.data) {
          // Convert base64 images to URLs
          const imageUrls = response.data.map((base64: string) => {
            return `data:image/png;base64,${base64}`;
          });
          
          this.fileToolLayout.setImageOutput(imageUrls, false);
          this.fileToolLayout.processingTime = processingTime;
          this.toastService.success(`Converted ${imageUrls.length} page(s) successfully!`);
        } else {
          const errorMsg = response.message || 'Conversion failed';
          this.fileToolLayout.setImageOutput([], true);
          this.toastService.error(errorMsg);
        }
      },
      error: (error) => {
        console.error('API Error:', error);
        
        let errorMessage = 'An error occurred while converting PDF';
        
        if (error.error?.errors?.[0]?.message) {
          errorMessage = error.error.errors[0].message;
        } else if (error.error?.message) {
          errorMessage = error.error.message;
        } else if (error.message) {
          errorMessage = error.message;
        }
        
        this.fileToolLayout.setImageOutput([], true);
        this.toastService.error(errorMessage);
      }
    });
  }
}