import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-tool-layout',
  templateUrl: './tool-layout.component.html',
  styleUrls: ['./tool-layout.component.css']
})
export class ToolLayoutComponent {
  @Input() toolName: string = '';
  @Input() toolDescription: string = '';
  @Input() toolIcon: string = '';
  @Input() inputPlaceholder: string = 'Enter input...';
  @Input() outputPlaceholder: string = 'Output will appear here...';
  
  @Output() onProcess = new EventEmitter<string>();
  
  inputText: string = '';
  outputText: string = '';
  isProcessing: boolean = false;
  hasProcessed: boolean = false;
  processingTime: number = 0;
  inputSize: number = 0;
  outputSize: number = 0;
  status: 'success' | 'error' | null = null;
  errorMessage: string = '';

  processInput(): void {
    if (!this.inputText.trim()) {
      return;
    }
    
    this.isProcessing = true;
    this.hasProcessed = false;
    const startTime = performance.now();
    
    // Emit the input to parent component for processing
    this.onProcess.emit(this.inputText);
  }

  setOutput(output: string, isError: boolean = false): void {
    const endTime = performance.now();
    this.processingTime = endTime - (performance.now() - 100); // Approximate
    
    this.outputText = output;
    this.isProcessing = false;
    this.hasProcessed = true;
    this.status = isError ? 'error' : 'success';
    
    this.inputSize = new Blob([this.inputText]).size;
    this.outputSize = new Blob([this.outputText]).size;
  }

  copyToClipboard(): void {
    navigator.clipboard.writeText(this.outputText);
    // You can add a toast notification here
  }

  downloadOutput(): void {
    const blob = new Blob([this.outputText], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${this.toolName.toLowerCase().replace(/\s+/g, '-')}-output.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  clearInput(): void {
    this.inputText = '';
    this.outputText = '';
    this.hasProcessed = false;
    this.status = null;
  }
}