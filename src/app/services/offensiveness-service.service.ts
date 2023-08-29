import { Injectable } from '@angular/core';
import { ConfigurationService } from './configuration.service';
import { HttpClient } from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';
import { Offensiveness } from '../models/offensiveness';
import { Configuration } from '../models/configuration';

@Injectable({
  providedIn: 'root'
})
export class OffensivenessService {

  private _backendUrl: string | undefined;
  private _cachedOffensiveness: Map<string, Offensiveness> = new Map<string, Offensiveness>();

  constructor(private _httpClient: HttpClient, private _configurationService: ConfigurationService) {
    this._loadBackendUrl();
   }

  getOffensivenessForUrl(url: string): Observable<Offensiveness> {
    if (this._cachedOffensiveness.has(url)) {
      return of(this._cachedOffensiveness.get(url)!);
    }
    return this._httpClient.get<Offensiveness>(`${this._backendUrl}/offensiveness`, { params: { "url": url }}).pipe(
      tap((data: Offensiveness) => {
        this._cachedOffensiveness.set(url, data);
      })
    );
  }

  private _loadBackendUrl() {
    this._configurationService.configuration.subscribe({
      next: (data: Configuration) => {
        this._backendUrl = data.backendUrl;
      }
    });
  }
}
