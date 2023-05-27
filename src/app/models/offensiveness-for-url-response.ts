import { HttpErrorResponse } from "@angular/common/http";
import { Offensiveness } from "./offensiveness";
import { CustomApiError } from "./api-error";

export class OffensivenessForUrlResponse {

    error: CustomApiError | null;
    offensiveness: Offensiveness | null;

    constructor(error: CustomApiError | null, offensiveness: Offensiveness | null) {
        this.error = error;
        this.offensiveness = offensiveness;
    }
}