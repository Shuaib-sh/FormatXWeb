import { Component, Input, OnInit, OnDestroy, ElementRef, HostListener } from '@angular/core';
import { Router } from '@angular/router';

interface Tool {
  name: string;
  description: string;
  iconName: string;
  routeUrl: string;
}

interface ToolGroup {
  groupName: string;
  tools: Tool[];
}

@Component({
  selector: 'app-spotlight-search',
  templateUrl: './spotlight-search.component.html',
  styleUrls: ['./spotlight-search.component.css']
})
export class SpotlightSearchComponent implements OnDestroy {
  @Input() toolGroups: ToolGroup[] = [];

  isOpen = false;
  query = '';
  selectedGroup: ToolGroup | null = null;
  activeIndex = 0;
  slideDirection: 'in' | 'out' | null = null;

  constructor(private router: Router, private elRef: ElementRef) {}

  // Close on click outside
  @HostListener('document:mousedown', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!this.elRef.nativeElement.contains(event.target)) {
      this.close();
    }
  }

  // Global "/" shortcut
  @HostListener('document:keydown', ['$event'])
  onGlobalKeydown(event: KeyboardEvent) {
    const target = event.target as HTMLElement;
    if (event.key === '/' && !this.isOpen &&
        target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
      event.preventDefault();
      this.open();
    }
  }

  get isSearching(): boolean {
    return this.query.trim().length > 0;
  }

  get filteredResults(): ToolGroup[] {
    if (!this.query.trim()) return [];
    const q = this.query.toLowerCase();
    return this.toolGroups
      .map(group => ({
        ...group,
        tools: group.tools.filter(t =>
          t.name.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q)
        )
      }))
      .filter(g => g.tools.length > 0);
  }

  get navigableItems(): any[] {
    if (this.isSearching) return this.filteredResults.flatMap(g => g.tools);
    if (this.selectedGroup) return this.selectedGroup.tools;
    return this.toolGroups;
  }

  open() {
    this.isOpen = true;
    setTimeout(() => {
      const input = this.elRef.nativeElement.querySelector('.spotlight-input');
      input?.focus();
    }, 50);
  }

  close() {
    this.isOpen = false;
    this.query = '';
    this.selectedGroup = null;
    this.activeIndex = 0;
    this.slideDirection = null;
  }

  selectGroup(group: ToolGroup) {
    this.slideDirection = 'in';
    this.selectedGroup = group;
    this.activeIndex = 0;
    setTimeout(() => this.slideDirection = null, 250);
  }

  goBack() {
    this.slideDirection = 'out';
    setTimeout(() => {
      this.selectedGroup = null;
      this.activeIndex = 0;
      this.slideDirection = null;
    }, 200);
  }

  selectTool(tool: Tool) {
    this.close();
    this.router.navigate([tool.routeUrl]);
  }

  onQueryChange() {
    this.selectedGroup = null;
    this.activeIndex = 0;
  }

  clearQuery(event: MouseEvent) {
    event.stopPropagation();
    this.query = '';
    this.selectedGroup = null;
    const input = this.elRef.nativeElement.querySelector('.spotlight-input');
    input?.focus();
  }

  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      if (this.selectedGroup && !this.isSearching) {
        this.goBack();
      } else {
        this.close();
      }
      return;
    }
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.activeIndex = Math.min(this.activeIndex + 1, this.navigableItems.length - 1);
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.activeIndex = Math.max(this.activeIndex - 1, 0);
    }
    if (event.key === 'Enter') {
      event.preventDefault();
      const item = this.navigableItems[this.activeIndex];
      if (!item) return;
      if ('tools' in item) {
        this.selectGroup(item as ToolGroup);
      } else {
        this.selectTool(item as Tool);
      }
    }
  }

  highlightMatch(text: string): string {
    if (!this.query.trim()) return text;
    const idx = text.toLowerCase().indexOf(this.query.toLowerCase());
    if (idx === -1) return text;
    return (
      text.slice(0, idx) +
      `<mark>${text.slice(idx, idx + this.query.length)}</mark>` +
      text.slice(idx + this.query.length)
    );
  }

  getFlatIndex(groupIndex: number, toolIndex: number): number {
    return this.filteredResults
      .slice(0, groupIndex)
      .reduce((sum, g) => sum + g.tools.length, 0) + toolIndex;
  }

  getIconEmoji(iconName: string): string {
    const map: Record<string, string> = {
      'file-text': '📄', 'braces': '{ }', 'file-output': '📤',
      'image': '🖼️', 'images': '🗂️', 'file-pdf': '📕',
      'code': '</>',  'folder': '📁', 'wrench': '🔧',
      'eraser': '🧹', 'scissors': '✂️', 'refresh-cw': '🔄'
    };
    return map[iconName] || '🔧';
  }

  ngOnDestroy() {}
}