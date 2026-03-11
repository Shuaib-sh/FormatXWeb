import { Component, ViewChild } from '@angular/core';
import { ToolLayoutComponent } from '../../../shared/components/tool-layout/tool-layout.component';
import { ToolsService } from '../../../core/services/tools.service';

@Component({
  selector: 'app-hl7-parser',
  templateUrl: './hl7-parser.component.html',
  styleUrls: ['./hl7-parser.component.css']
})
export class Hl7ParserComponent {
  @ViewChild(ToolLayoutComponent) toolLayout!: ToolLayoutComponent;

  toolName = 'HL7 Parser';
  toolDescription = 'Parse HL7 v2 messages into structured JSON format.';
  toolIcon = '📄';

  constructor(private toolsService: ToolsService) {}

  handleProcess(input: string): void {
  // Step 1: Replace literal \r\n with actual line breaks
  let processedInput = input
    .replace(/\\r\\n/g, '\r\n')  // Replace \r\n
    .replace(/\\n/g, '\n')       // Replace \n
    .replace(/\\r/g, '\r');      // Replace \r
  
  processedInput = processedInput.replace(/\\\\/g, '\\');
  
  this.toolsService.parseHL7Message(processedInput).subscribe({
    next: (response) => {
      if (response.success) {
        // Format the output as pretty JSON
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