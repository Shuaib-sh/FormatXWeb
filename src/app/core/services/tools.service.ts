import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, ToolGroup } from 'src/app/models/tool.model';

@Injectable({
  providedIn: 'root'
})
export class ToolsService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getAllTools(): Observable<ApiResponse<ToolGroup[]>> {
    return this.http.get<ApiResponse<ToolGroup[]>>(`${this.apiUrl}/tools`);
  }
  parseHL7Message(input: string): Observable<ApiResponse<any>> {
  return this.http.post<ApiResponse<any>>(`${this.apiUrl}/tools/hl7`, { input });
  }
  formatJSON(input: string, action: 'format' | 'minify' | 'validate'): Observable<ApiResponse<any>> {
  return this.http.post<ApiResponse<any>>(`${this.apiUrl}/tools/json`, { input, action });
  }
  textToPDF(input: string): Observable<Blob> {
  return this.http.post(`${this.apiUrl}/tools/text-to-pdf`, { input }, { responseType: 'blob' });
  }
  pdfToImage(file: File): Observable<ApiResponse<string[]>> {
  const formData = new FormData();
  formData.append('file', file);
  
  return this.http.post<ApiResponse<string[]>>(`${this.apiUrl}/tools/pdf-to-image`, formData);
  }
}
