import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Offensiveness } from 'src/app/models/offensiveness';
import { OffensivenessForUrlResponse } from 'src/app/models/offensiveness-for-url-response';
import { Service } from 'src/app/services/service.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  formErrorMessage: string | null = null;
  offensiveness: Offensiveness | null = null;

  public form = new FormGroup({
    url: new FormControl('', Validators.required),
  });

  constructor(private _service: Service) {}

  ngOnInit(): void {
    this._service.offensivenessForUrlResponse.subscribe({
      next: (data: OffensivenessForUrlResponse) => {
        if (!data.error) {
          this.offensiveness = data.offensiveness!;
        }
        else {
          this.formErrorMessage = data.error.message;
        }
      }
    })
  }

  onSubmit() {
    this.formErrorMessage = null;
    this.offensiveness = null;
    this._service.getOffensivenessForUrl(this.form.get("url")!.value!);
  }
}