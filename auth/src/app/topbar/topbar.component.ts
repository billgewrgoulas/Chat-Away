import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { SocketioService } from '../services/socketio.service';
import { Notification } from '../Models/notification';
import { DataShareService } from '../services/data-share.service';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.css'],
})
export class TopbarComponent implements OnInit {
  private authService: AuthService;
  private router: Router;
  private io: SocketioService;
  private dataShareService: DataShareService;
  public notificationList: Notification[] = [];
  public profile: boolean = true;
  public notifications: boolean = true;
  public overlay: boolean = true;

  constructor(
    a: AuthService,
    r: Router,
    io: SocketioService,
    dataShare: DataShareService
  ) {
    this.authService = a;
    this.router = r;
    this.io = io;
    this.dataShareService = dataShare;
  }

  overlayCheck() {
    this.profile = true;
    this.notifications = true;
    this.overlay = true;
  }

  notificationsCheck() {
    this.notifications = !this.notifications;
    this.overlay = false;
    if (!this.profile) {
      this.profile = true;
    }
  }

  profileCheck() {
    this.profile = !this.profile;
    this.overlay = false;
    if (!this.notifications) {
      this.notifications = true;
    }
  }

  get name() {
    return this.authService.getUserInfo().name;
  }

  logout() {
    this.io.disconnectSocket();
    this.authService.logout('logout').subscribe((response: any = []) => {
      console.log(response);
    });
    this.router.navigateByUrl('/login');
  }

  appendNotification(data: any) {
    let notification = new Notification();
    notification.date = Date.now().toString();
    notification.name = data.senderName;
    //notification.id = data.id;
    this.notificationList.push(notification);
  }

  ngOnInit(): void {
    this.dataShareService.remote.subscribe((data: any) => {
      if (data.sender == 'default') return;
      this.appendNotification(data);
    });
  }
}