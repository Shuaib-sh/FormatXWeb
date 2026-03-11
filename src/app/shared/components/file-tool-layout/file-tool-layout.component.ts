import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ToastService } from '../../../core/services/toast.service';


@Component({
  selector: 'app-file-tool-layout',
  templateUrl: './file-tool-layout.component.html',
  styleUrls: ['./file-tool-layout.component.css']
})
export class FileToolLayoutComponent {
  @Input() toolName: string = '';
  @Input() toolDescription: string = '';
  @Input() toolIcon: string = '';
  @Input() acceptedFileTypes: string = '*/*';  // e.g., '.pdf', 'image/*'
  @Input() outputType: 'image' | 'text' | 'download' = 'image';
  
  @Output() onProcess = new EventEmitter<File>();
  constructor(private toastService: ToastService) {}
  
  selectedFile: File | null = null;
  isDragging: boolean = false;
  isProcessing: boolean = false;
  hasProcessed: boolean = false;
  outputImages: string[] = [];  // For image outputs
  outputText: string = '';  // For text outputs
  processingTime: number = 0;
  inputSize: number = 0;
  outputSize: number = 0;
  status: 'success' | 'error' | null = null;

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = false;
    
    if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
      this.selectedFile = event.dataTransfer.files[0];
    }
  }

  processFile(): void {
    if (!this.selectedFile) return;
    
    this.isProcessing = true;
    this.hasProcessed = false;
    this.inputSize = this.selectedFile.size;
    
    // Emit file to parent component
    this.onProcess.emit(this.selectedFile);
  }

  setImageOutput(images: string[], isError: boolean = false): void {
    this.outputImages = images;
    this.isProcessing = false;
    this.hasProcessed = true;
    this.status = isError ? 'error' : 'success';
    this.processingTime = 100; // Will be set by parent
    this.outputSize = images.length;
  }

  setTextOutput(text: string, isError: boolean = false): void {
    this.outputText = text;
    this.isProcessing = false;
    this.hasProcessed = true;
    this.status = isError ? 'error' : 'success';
    this.processingTime = 100;
    this.outputSize = new Blob([text]).size;
  }

  clearFile(): void {
    this.selectedFile = null;
    this.outputImages = [];
    this.outputText = '';
    this.hasProcessed = false;
    this.status = null;
  }

  downloadImage(imageUrl: string, index: number): void {
  try {

    // Safety fix for duplicated prefix
    if (imageUrl.includes('data:image/png;base64,data:image/png;base64,')) {
      imageUrl = imageUrl.replace(
        'data:image/png;base64,data:image/png;base64,',
        'data:image/png;base64,'
      );
    }

    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `page-${index + 1}.png`;

    // Required for Chrome/Edge
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    this.toastService.success(`Page ${index + 1} downloaded`);

  } catch (error) {
    console.error('Download failed:', error);
    this.toastService.error('Download failed');
  }
}

 downloadAllImages(): void {

  if (!this.outputImages?.length) {
    this.toastService.error('No images available');
    return;
  }
  this.outputImages.forEach((url, index) => {
    setTimeout(() => {
      this.downloadImage(url, index);
    }, index * 400);
  });

}
}