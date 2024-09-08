import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {HomeItemModel} from "../models/home-item-model";
import {BehaviorSubject, from, of} from "rxjs";
import {map, switchMap} from "rxjs/operators";
import {Preferences} from "@capacitor/preferences";

@Injectable({
  providedIn: 'root'
})
export class ShiftService {
  private shifts: BehaviorSubject<HomeItemModel[]>=new BehaviorSubject<HomeItemModel[]>([]);
  private key = environment.storePrefix + '.' + 'currentShift';

  constructor(private http: HttpClient) { }

  getBookings(individualId: number) {
    return this.http.get<HomeItemModel[]>(`${environment.apiUrl}/Home/today/${individualId}`);
  }

  setCurrentShift(shift: HomeItemModel) {
    Preferences.set({
      key: this.key,
      value: JSON.stringify(shift),
    });
  }
  getCurrentShift() {
    return from(Preferences.get({ key: this.key }))
      .pipe(map( value => {
        if(!value || !value.value){
          return null;
        } else {
          return JSON.parse(value.value) as HomeItemModel;
        }
      }))
  }

  setShifts(shifts: HomeItemModel[])
  {
    localStorage.setItem('shifts',JSON.stringify(shifts));
    this.shifts.next(shifts);
  }
  getShifts(){
    if (this.shifts.value == null || this.shifts.value.length == 0) {
      let shifts = null;

      try {
        shifts = JSON.parse(localStorage.getItem('shifts'));
        this.shifts.next(shifts);
      } catch (error) {
        console.error('Error parsing shifts from local storage', error);
      }
    }
    return this.shifts.asObservable();
  }
  clearShift() {
    if(this.shifts.value.length>=1)
    {
      Preferences.remove({ key: this.key }).then(()=>{
        this.shifts.next([]);
    });
    }

  }
}
