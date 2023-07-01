import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CustomApiError } from 'src/app/models/api-error';
import { Offensiveness } from 'src/app/models/offensiveness';
import { OffensivenessForUrlResponse } from 'src/app/models/offensiveness-for-url-response';
import { Service } from 'src/app/services/service.service';
import { ValidationService } from 'src/app/services/validation.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  youtubeRegExp: RegExp = /((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?/;
  formErrorMessage: string | null = null;
  offensiveness: Offensiveness | null = null;
  detectedImages: Array<object> | null = null;
  showProgressSpinner: boolean = false;

  form = new FormGroup({
    url: new FormControl('', [Validators.required, this._validation_service.isValidFormat(this.youtubeRegExp)]),
  });


  constructor(private _service: Service, private _validation_service: ValidationService) {}

  ngOnInit(): void {
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
  }

  onSubmit() {
    this.formErrorMessage = null;
    this.offensiveness = null;
    this.detectedImages = null;

    this.showProgressSpinner = true;
    this._service.getOffensivenessForUrl(this.form.get("url")!.value!);
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
    this.formErrorMessage = error.message;
  }
}
