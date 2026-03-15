import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-multi-file-tool-layout',
  templateUrl: './multi-file-tool-layout.component.html',
  styleUrls: ['./multi-file-tool-layout.component.css']
})
export class MultiFileToolLayoutComponent {
  @Input() toolName: string = '';
  @Input() toolDescription: string = '';
  @Input() toolIcon: string = '';
  @Input() acceptedFileTypes: string = '*/*';
  @Input() maxFiles: number = 10;
  
  @Output() onProcess = new EventEmitter<File[]>();
  
  selectedFiles: File[] = [];
  previewUrls: string[] = [];
  isDragging: boolean = false;
  isProcessing: boolean = false;
  hasProcessed: boolean = false;
  processingTime: number = 0;
  status: 'success' | 'error' | null = null;

  constructor(private toastService: ToastService) {}

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.addFiles(Array.from(input.files));
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
      this.addFiles(Array.from(event.dataTransfer.files));
    }
  }

  addFiles(files: File[]): void {
    // Filter by accepted file types
    const validFiles = files.filter(file => {
      if (this.acceptedFileTypes === '*/*') return true;
      const extensions = this.acceptedFileTypes.split(',').map(ext => ext.trim());
      return extensions.some(ext => file.name.toLowerCase().endsWith(ext.replace('*', '')));
    });

    if (this.selectedFiles.length + validFiles.length > this.maxFiles) {
      this.toastService.warning(`Maximum ${this.maxFiles} files allowed`);
      return;
    }

    // Add files and create previews
    validFiles.forEach(file => {
      this.selectedFiles.push(file);
      
      // Create preview URL for images
      const reader = new FileReader();
      reader.onload = (e) => {
        this.previewUrls.push(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    });

    if (validFiles.length > 0) {
      this.toastService.success(`${validFiles.length} file(s) added`);
    }
  }

  removeFile(index: number): void {
    this.selectedFiles.splice(index, 1);
    this.previewUrls.splice(index, 1);
  }

  clearAllFiles(): void {
    this.selectedFiles = [];
    this.previewUrls = [];
    this.hasProcessed = false;
    this.status = null;
  }

  processFiles(): void {
    if (this.selectedFiles.length === 0) {
      this.toastService.warning('Please select at least one file');
      return;
    }
    
    this.isProcessing = true;
    this.hasProcessed = false;
    
    this.onProcess.emit(this.selectedFiles);
  }

  setProcessingComplete(success: boolean, time: number): void {
    this.isProcessing = false;
    this.hasProcessed = true;
    this.status = success ? 'success' : 'error';
    this.processingTime = time;
  }

  moveFile(fromIndex: number, toIndex: number): void {
    const file = this.selectedFiles.splice(fromIndex, 1)[0];
    const preview = this.previewUrls.splice(fromIndex, 1)[0];
    
    this.selectedFiles.splice(toIndex, 0, file);
    this.previewUrls.splice(toIndex, 0, preview);
  }
}