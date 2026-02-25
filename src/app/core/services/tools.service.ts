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
  
}
