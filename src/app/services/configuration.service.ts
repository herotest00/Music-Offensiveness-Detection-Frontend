import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Configuration } from '../models/configuration';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {

  private _configUrl = './assets/config/config.json';
  private _configuration = new Subject<Configuration>;

  constructor(private _httpClient: HttpClient) { 
    this.loadConfig();
  }

  loadConfig() {
    this._httpClient.get<Configuration>(this._configUrl).subscribe({
      next: (config) => {
        this._configuration.next(config);
      },
      error: (error) => {
        console.log("Couldn't load configuration");
      }
    });
  }

  get configuration(): Subject<Configuration> {
    return this._configuration!;
  }
}
