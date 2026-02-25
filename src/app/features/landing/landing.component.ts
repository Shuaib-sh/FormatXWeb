import { Component, OnInit } from '@angular/core';
import { ToolsService } from '../../core/services/tools.service';
import { ToolGroup } from '../../models/tool.model';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {
  toolGroups: ToolGroup[] = [];
  isLoading: boolean = true;

  constructor(private toolsService: ToolsService) { }

  ngOnInit(): void {
    this.loadTools();
  }

  loadTools(): void {
    this.toolsService.getAllTools().subscribe({
      next: (response) => {
        if (response.success) {
          this.toolGroups = response.data;
          this.isLoading = false;
        }
      },
      error: (error) => {
        console.error('Error loading tools:', error);
        this.isLoading = false;
      }
    });
  }

  getIconEmoji(iconName: string): string {
    const iconMap: { [key: string]: string } = {
      'file-text': '📄',
      'code': '{ }',
      'image': '🖼️',
      'file-image': '📸',
      'copy': '📋',
      'scissors': '✂️',
      'align-left': '📏',
      'type': '🔤'
    };
    return iconMap[iconName] || '📄';
  }
}