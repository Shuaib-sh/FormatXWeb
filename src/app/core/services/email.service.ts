import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface SendEmailRequest {
  to: string;
  subject: string;
  message: string;
  outputContent: string;
}

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  sendEmail(payload: SendEmailRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/Email/send-email`, payload);
  }
}