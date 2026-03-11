import { Component, ViewChild } from '@angular/core';
import { ToolLayoutComponent } from 'src/app/shared/components/tool-layout/tool-layout.component';
import { ToolsService } from 'src/app/core/services/tools.service';

@Component({
  selector: 'app-json-formatter',
  templateUrl: './json-formatter.component.html',
  styleUrls: ['./json-formatter.component.css']
})
export class JsonFormatterComponent {

  @ViewChild(ToolLayoutComponent) toolLayout!: ToolLayoutComponent;

  toolName = 'JSON Formatter';
  toolDescription = 'Pretty print, minify, and validate JSON data.';
  toolIcon = '{ }';
  constructor(private toolsService: ToolsService) {}

  handleProcess(input: string): void {
    this.toolsService.formatJSON(input, 'format').subscribe({
      next: (response) => {
        if (response.success) {
          const output = JSON.stringify(response.data, null, 2);
          this.toolLayout.setOutput(output, false);
        } else {
          const errorMsg = response.errors?.[0]?.message || response.message || 'Processing failed';
          this.toolLayout.setOutput(errorMsg, true);
        }
      },
      error: (error) => {
        console.error('API Error:', error);
        let errorMessage = 'An error occurred while processing';
        if (error.error?.errors?.[0]?.message) {
          errorMessage = error.error.errors[0].message;
        } else if (error.error?.message) {
          errorMessage = error.error.message;
        } else if (error.message) {
          errorMessage = error.message;
        }
        this.toolLayout.setOutput(errorMessage, true);
      }
    });
  }
}
