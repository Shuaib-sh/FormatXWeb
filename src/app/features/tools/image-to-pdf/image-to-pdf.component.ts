import { Component, ViewChild } from '@angular/core';
import { MultiFileToolLayoutComponent } from '../../../shared/components/multi-file-tool-layout/multi-file-tool-layout.component';
import { ToolsService } from '../../../core/services/tools.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-image-to-pdf',
  templateUrl: './image-to-pdf.component.html',
  styleUrls: ['./image-to-pdf.component.css']
})
export class ImageToPdfComponent {
  @ViewChild(MultiFileToolLayoutComponent) multiFileLayout!: MultiFileToolLayoutComponent;

  toolName = 'Image → PDF';
  toolDescription = 'Convert images into PDF documents.';
  toolIcon = '📸';

  constructor(
    private toolsService: ToolsService,
    private toastService: ToastService
  ) {}

  handleProcess(files: File[]): void {
    const startTime = performance.now();
    
    this.toolsService.imageToPDF(files).subscribe({
      next: (blob: Blob) => {
        const endTime = performance.now();
        const processingTime = endTime - startTime;
        
        // Create download link for the PDF
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `images-to-pdf-${Date.now()}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        
        // Update status
        this.multiFileLayout.setProcessingComplete(true, processingTime);
        this.toastService.success('PDF created and downloaded successfully!');
      },
      error: (error) => {
        console.error('API Error:', error);
        
        const endTime = performance.now();
        const processingTime = endTime - startTime;
        
        let errorMessage = 'An error occurred while creating PDF';
        
        if (error.error instanceof Blob) {
          const reader = new FileReader();
          reader.onload = () => {
            try {
              const errorObj = JSON.parse(reader.result as string);
              errorMessage = errorObj.message || errorMessage;
            } catch {
              errorMessage = 'Failed to create PDF';
            }
            this.multiFileLayout.setProcessingComplete(false, processingTime);
            this.toastService.error(errorMessage);
          };
          reader.readAsText(error.error);
        } else {
          if (error.error?.errors?.[0]?.message) {
            errorMessage = error.error.errors[0].message;
          } else if (error.error?.message) {
            errorMessage = error.error.message;
          }
          
          this.multiFileLayout.setProcessingComplete(false, processingTime);
          this.toastService.error(errorMessage);
        }
      }
    });
  }
}