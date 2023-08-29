import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { CustomApiError } from 'src/app/models/api-error';
import { Offensiveness } from 'src/app/models/offensiveness';
import { OffensivenessService } from 'src/app/services/offensiveness-service.service';
import { ValidationService } from 'src/app/services/validation.service';
import { ErrorDialogComponent } from '../error-dialog/error-dialog.component';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  private _youtubeRegExp: RegExp = /((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?/;
  private _serverErrorMessage = "The request could not be processed. Please try again later."

  offensiveness: Offensiveness | null = null;
  detectedImages: Array<object> | null = null;
  showProgressSpinner: boolean = false;
  videoId: string | null = null;

  form = new FormGroup({
    url: new FormControl('', [Validators.required, this._validation_service.isValidFormat(this._youtubeRegExp)]),
  });


  constructor(private _offensiveness_service: OffensivenessService, private _validation_service: ValidationService, private _dialog: MatDialog) {}

  ngOnInit(): void {
    this.form.get('url')!.valueChanges.subscribe(newValue => {
      this._extractVideoId(newValue);
    });
    this._loadYoutubeScript();
  }

  onSubmit() {
    this.offensiveness = null;
    this.detectedImages = null;

    this.showProgressSpinner = true;
    this._offensiveness_service.getOffensivenessForUrl(this.form.get('url')!.value!).subscribe({
      next: (data: Offensiveness) => {
          this._loadData(data);
      },
      error: (error: HttpErrorResponse) => {
          this._handleErrorResponse(error.error!);
      }
    });
  }

  private _extractVideoId(url: string | null) {
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

  private _loadYoutubeScript() {
    const tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    document.body.appendChild(tag);
  }

}