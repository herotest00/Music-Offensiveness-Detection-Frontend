import { Injectable } from '@angular/core';
import { ConfigurationService } from './configuration.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Subject } from 'rxjs';
import { OffensivenessForUrlResponse } from '../models/offensiveness-for-url-response';
import { Offensiveness } from '../models/offensiveness';
import { Configuration } from '../models/configuration';

@Injectable({
  providedIn: 'root'
})
export class Service {

  private _backendUrl: string | undefined;
  private _cachedOffensivenessForUrl: Offensiveness | null | undefined;
  private _offensivenessForUrlResponse: Subject<OffensivenessForUrlResponse> = new Subject<OffensivenessForUrlResponse>;

  constructor(private _httpClient: HttpClient, private _configurationService: ConfigurationService) {
    this._loadBackendUrl();
   }

  getOffensivenessForUrl(url: string) {
    this._cachedOffensivenessForUrl = null;
    this._httpClient.get<Offensiveness>(`${this._backendUrl}/offensiveness`, { params: { "url": url }}).subscribe({
      next: (data: Offensiveness) => {
        console.log("Response: ", data);
        this._offensivenessForUrlResponse.next({
          error: null,
          offensiveness: data
        });
        this._cachedOffensivenessForUrl = data;
      },
      error: (error: HttpErrorResponse) => {
        console.log(error);
        this._offensivenessForUrlResponse.next({
          error: error.error,
          offensiveness: null
        });
      }
    });
  }

  private _loadBackendUrl() {
    this._configurationService.configuration.subscribe({
      next: (data: Configuration) => {
        this._backendUrl = data.backendUrl;
      }
    });
  }

  get offensivenessForUrl() {
    return this._cachedOffensivenessForUrl!;
  }

  get offensivenessForUrlResponse() {
    return this._offensivenessForUrlResponse;
  }
}
