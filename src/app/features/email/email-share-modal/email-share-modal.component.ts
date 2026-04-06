import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

export interface EmailShareData {
  toolName: string;
  outputContent: string;
}

@Component({
  selector: 'app-email-share-modal',
  templateUrl: './email-share-modal.component.html',
  styleUrls: ['./email-share-modal.component.css']
})
export class EmailShareModalComponent implements OnInit {
  @Input() data!: EmailShareData;
  @Input() fromEmail: string = '';
  @Output() closed = new EventEmitter<void>();
  @Output() sendEmail = new EventEmitter<{
    to: string;
    subject: string;
    message: string;
    outputContent: string;
  }>();

  toEmail: string = '';
  subject: string = '';
  personalMessage: string = '';
  toError: string = '';
  isSending: boolean = false;

  ngOnInit() {
    this.subject = `${this.data.toolName} — Processed Output`;
  }

  get outputPreview(): string {
    return this.data.outputContent.slice(0, 300);
  }

  get characterCount(): number {
    return this.data.outputContent.length;
  }

  validateEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  onToBlur() {
    if (this.toEmail && !this.validateEmail(this.toEmail)) {
      this.toError = 'Please enter a valid email address';
    } else {
      this.toError = '';
    }
  }

  canSend(): boolean {
    return this.toEmail.trim().length > 0 &&
           this.validateEmail(this.toEmail) &&
           !this.isSending;
  }

  onSend() {
    if (!this.canSend()) return;
    this.isSending = true;
    this.sendEmail.emit({
      to: this.toEmail,
      subject: this.subject,
      message: this.personalMessage,
      outputContent: this.data.outputContent
    });
  }

  onClose() {
    this.closed.emit();
  }

  onOverlayClick(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('email-modal-overlay')) {
      this.onClose();
    }
  }

  // Called by parent after API completes
  onSendComplete() {
    this.isSending = false;
  }
}