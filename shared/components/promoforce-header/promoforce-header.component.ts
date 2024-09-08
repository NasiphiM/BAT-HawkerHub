import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import {LoginService} from "../../services/login.service";

@Component({
  selector: 'app-promoforce-header',
  templateUrl: './promoforce-header.component.html',
  styleUrls: ['./promoforce-header.component.scss'],
})
export class PromoforceHeaderComponent implements OnInit {
  @Input() title: string;
  @Input() backButtonDefaultHref = '/home';
  @Input() isModal = false;
  @Input() completed = false;
  @Input() isLogout = false;

  constructor(private modalctrl: ModalController,
              private login: LoginService) { }

  ngOnInit() {
  }

  closeModal(){
    this.modalctrl.dismiss({completed:this.completed});
  }

  onLogout() {
    this.login.logout();
  }
}
