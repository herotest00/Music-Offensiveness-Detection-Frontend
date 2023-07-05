import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { CustomApiError } from 'src/app/models/api-error';
import { Offensiveness } from 'src/app/models/offensiveness';
import { OffensivenessForUrlResponse } from 'src/app/models/offensiveness-for-url-response';
import { Service } from 'src/app/services/service.service';
import { ValidationService } from 'src/app/services/validation.service';
import { ErrorDialogComponent } from '../error-dialog/error-dialog.component';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  private _youtubeRegExp: RegExp = /((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?/;
  private _serverErrorMessage = "The request could not be processed. Please try again later."
  private _youtubeApiLoaded: boolean = false;

  offensiveness: Offensiveness | null = null;
  detectedImages: Array<object> | null = null;
  showProgressSpinner: boolean = false;
  videoId: string | null = null;

  form = new FormGroup({
    url: new FormControl('', [Validators.required, this._validation_service.isValidFormat(this._youtubeRegExp)]),
  });


  constructor(private _service: Service, private _validation_service: ValidationService, private _dialog: MatDialog) {}

  ngOnInit(): void {
    this.form.get('url')!.valueChanges.subscribe(newValue => {
      this._onUrlChange(newValue);
  });
    this._service.offensivenessForUrlResponse.subscribe({
      next: (data: OffensivenessForUrlResponse) => {
        if (!data.error) {
          this._loadData(data.offensiveness!)
        }
        else {
          this._handleErrorResponse(data.error!);
        }
      }
    })

    if (!this._youtubeApiLoaded) {
      const tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(tag);
      this._youtubeApiLoaded = true;
    }
  }

  onSubmit() {
    this.offensiveness = null;
    this.detectedImages = null;

    this.showProgressSpinner = true;
    this._service.getOffensivenessForUrl(this.form.get("url")!.value!);
  }

  private _onUrlChange(url: string | null) {
    this.videoId = null;
    if (this.form.get('url')!.valid && url != null && url != "") {
      const match = url.match(this._youtubeRegExp);
      if (match) {
        this.videoId = match[5];
      }
    }
  }

  private _loadData(data: Offensiveness) {
    this.showProgressSpinner = false;
    this.offensiveness = data;
    this.detectedImages = data.videoOffensiveness.images.map((image) => {
      return { 
        image: 'data:image/jpeg;base64,' + image,
        thumbImage: 'data:image/jpeg;base64,' + image
       };
    });
  }

  private _handleErrorResponse(error: CustomApiError) {
    this.showProgressSpinner = false;

    console.log(error.message);
    this._dialog.open(ErrorDialogComponent, {
      data: this._serverErrorMessage
    });
  }

  getOffensivenessColor(score: number): string {
    const factor = Math.min(1, score * 1.2);
    const green = Math.round((1 - factor) * 255);
    const red = Math.round(factor * 255);
    return `rgb(${red}, ${green}, 0)`;
  }

}