import { Component, OnInit } from '@angular/core';
import {NgForm} from "@angular/forms";
import {LoginService} from "../shared/services/login.service";
import { Router} from "@angular/router";
import {AlertController, LoadingController} from "@ionic/angular";
import {Constants} from "../shared/constants";
import {ShiftService} from "../shared/services/shift.service";
import {take} from "rxjs/operators";
import {EventTypes} from "../shared/Enums/event-types";
import {HomeItemModel} from "../shared/models/home-item-model";
import {environment} from "../../environments/environment";

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  shifts: HomeItemModel[] = [];

  constructor(
    private loginService: LoginService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private shiftService: ShiftService
  ) {}

  ngOnInit() {
    this.shifts = [];

  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    const email = form.value.email;
    const password = form.value.password;

    this.loadingCtrl
      .create({ keyboardClose: true, message: 'Logging in...' })
      .then((loadingEL) => {
        loadingEL.present();
        this.loginService.login(email, password).subscribe(
          (resData) => {
            loadingEL.dismiss();
            form.reset();
            this.findShift(resData.individualId);
          },
          (errorRes) => {
            console.error(errorRes);
            loadingEL.dismiss();
            if (errorRes.status === 0) {
              this.showAlert('Authentication failed', Constants.noServiceError);
            } else {
              this.showAlert('Authentication failed', errorRes.error);
            }
          }
        );
      });
  }

  findShift(individualId: number) {
    this.shiftService
      .getBookings(individualId)
      .pipe(take(1))
      .subscribe(homeEvents => {
        if (homeEvents.length >= 0) {
          this.shifts = homeEvents.filter(p=>p.eventType == EventTypes.shift && p.campaignID == environment.campaignID);

          this.shiftService.setShifts(this.shifts);

          if (!this.shifts || this.shifts.length == 0){
            this.showAlert('No Shifts', 'No shifts found for today.. please check with your ES');
          }
          else if (this.shifts.length >= 1) {

            this.router.navigate(['/shift']);
          }

        }
      });


  }

  showAlert(title: string, message: string) {
    this.alertCtrl
      .create({ header: title, message, buttons: ['Okay'] })
      .then((alertEl) => alertEl.present());
  }


}
