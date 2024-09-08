import {Component, Input, OnInit} from '@angular/core';
import {HomeItemModel} from "../shared/models/home-item-model";
import {ActivatedRoute, Router} from "@angular/router";
import {ShiftService} from "../shared/services/shift.service";
import {LoginService} from "../shared/services/login.service";

@Component({
  selector: 'app-shift',
  templateUrl: './shift.page.html',
  styleUrls: ['./shift.page.scss'],
})
export class ShiftPage implements OnInit {
  shifts: HomeItemModel[];

  constructor(private router: Router, private loginService: LoginService, private shiftService: ShiftService) {
  }

  ngOnInit() {
    this.shiftService.getShifts().subscribe({
      next: (shifts) => {
        let today = new Date();
        let shiftsForToday = shifts.filter(s => new Date(s.date).toDateString() == today.toDateString());
        if (shiftsForToday.length >= 1) {
          this.shifts = shifts;
        } else {
          this.loginService.logout();
        }
      }
      ,
      error: (error) => {
        this.loginService.logout();
      }
    });
  }

  selectshift(shift: HomeItemModel) {
    this.shiftService.setCurrentShift(shift);
    this.router.navigate(['/survey']);
  }

}
