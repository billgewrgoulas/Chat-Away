import { AfterViewInit, Input } from '@angular/core';
import { HostListener } from '@angular/core';
import {
  Component,
  OnDestroy,
  OnInit,
  Output,
  EventEmitter,
  ViewChild,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { appState } from '../appState';
import { User } from '../Models/user';
import { AuthService } from '../services/auth.service';
import { DataShareService } from '../services/data-share.service';
import { SocketioService } from '../services/socketio.service';
import { UsersService } from '../services/users.service';

@Component({
  selector: 'active-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.css'],
})
export class InfoComponent implements OnInit, OnDestroy {
  @Output() slide: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() slideOpen: boolean = false;

  private custom: any;
  public infoName: string = '';
  public info: string = '';
  public url: any;
  public name: string = '';
  private observers: Subscription[] = [];
  private cid: string = '';
  public open: boolean = false;

  constructor(
    private dataShare: DataShareService,
    private io: SocketioService,
    private auth: AuthService
  ) {}

  ngOnInit() {
    this.observers.push(
      this.dataShare.openList.subscribe((v: any) => {
        this.openList(v);
      })
    );

    //status check
    this.observers.push(
      this.dataShare.status.subscribe((data: any) => {
        if (this.custom || this.cid != data.id) return;
        if (this.info == 'Active now.') {
          this.info = 'Offline.';
        } else {
          this.info = 'Active now.';
        }
      })
    );

    //get current
    this.observers.push(
      this.dataShare.message.subscribe((message: any = []) => {
        this.infoName = message.name;
        this.url = message.avatar;
        this.changeStatus(message.status);
        this.custom = message.custom;
        this.cid = message.id;
      })
    );
  }

  ngOnDestroy() {
    this.observers.forEach((observer) => {
      observer.unsubscribe();
    });
  }

  changeStatus(status: boolean) {
    if (status) {
      this.info = 'Active now.';
    } else {
      this.info = 'Offline.';
    }
  }

  select(index: number) {
    appState.get()[index].tik = !appState.get()[index].tik;
  }

  submit() {
    let members: any[] = [];
    appState.get().forEach((user) => {
      if (user.tik) {
        members.push(user.details.id);
        user.tik = false;
      }
    });
    members.push(this.auth.getUserInfo().id);
    if (members.length < 2 || this.name.length < 2) {
      return;
    }
    this.io.newRoom(members, this.name);
    this.openList(false);
  }

  openList(v: boolean) {
    this.open = v;
    this.name = '';
    if (!this.open) {
      appState.get().forEach((user) => {
        user.tik = false;
      });
    }
  }

  rooms() {
    this.dataShare.openRoomList();
  }

  get usersList() {
    return appState.get();
  }

  slider() {
    this.slide.emit(true);
  }
}
