import { Component, ViewChild } from '@angular/core';
import { ToolLayoutComponent } from '../../../shared/components/tool-layout/tool-layout.component';
import { ToolsService } from '../../../core/services/tools.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-text-to-pdf',
  templateUrl: './text-to-pdf.component.html',
  styleUrls: ['./text-to-pdf.component.css']
})
export class TextToPdfComponent {
  @ViewChild(ToolLayoutComponent) toolLayout!: ToolLayoutComponent;

  toolName = 'Text → PDF';
  toolDescription = 'Convert plain text into downloadable PDF files.';
  toolIcon = '📝';

  constructor(
    private toolsService: ToolsService,
    private toastService: ToastService  // Inject toast service
  ) {}

  handleProcess(input: string): void {
    this.toolsService.textToPDF(input).subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `text-to-pdf-${Date.now()}.pdf`;
        link.click();
        window.URL.revokeObjectURL(url);
        
        this.toastService.success('PDF downloaded successfully!');
        
        this.toolLayout.setOutput('Ready for next conversion.', false);
      },
      error: (error) => {
        console.error('API Error:', error);
        
        let errorMessage = 'An error occurred while generating PDF';
        
        if (error.error instanceof Blob) {
          const reader = new FileReader();
          reader.onload = () => {
            try {
              const errorObj = JSON.parse(reader.result as string);
              errorMessage = errorObj.message || errorMessage;
            } catch {
              errorMessage = 'Failed to generate PDF';
            }
            
            this.toastService.error(errorMessage);
            this.toolLayout.setOutput(errorMessage, true);
          };
          reader.readAsText(error.error);
        } else {

          this.toastService.error(errorMessage);
          this.toolLayout.setOutput(errorMessage, true);
        }
      }
    });
  }
}