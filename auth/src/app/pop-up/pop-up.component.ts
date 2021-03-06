import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { Observable } from 'rxjs';
import { Subscription } from 'rxjs';
import { appState } from '../appState';
import { Details } from '../Models/details';
import { User } from '../Models/user';
import { DataShareService } from '../services/data-share.service';
import { SocketioService } from '../services/socketio.service';
import { UsersService } from '../services/users.service';

@Component({
  selector: 'pop-up',
  templateUrl: './pop-up.component.html',
  styleUrls: ['./pop-up.component.css'],
})
export class PopUpComponent implements AfterViewInit {
  //
  @Input() details: Details | undefined;
  @Output() selected: EventEmitter<User> = new EventEmitter<User>();
  @ViewChild('close') button: any;

  private btn!: HTMLElement;
  //private usersPipe$!:Observable<any>;

  constructor(
    private dataShare: DataShareService,
    private io: SocketioService
  ) {}

  ngAfterViewInit() {
    this.btn = this.button.nativeElement;
  }

  submit(index: number) {
    const user: User = appState.get()[index];
    this.io.invite(user.details.id, this.details?.rid);
    this.selected.emit(user);
    this.btn.click();
  }

  get all() {
    return appState.get();
  }
}
