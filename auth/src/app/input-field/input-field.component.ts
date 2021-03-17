import { AfterViewInit, ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { DataShareService } from '../services/data-share.service';
import { SocketioService } from '../services/socketio.service';

@Component({
  selector: 'input-field',
  templateUrl: './input-field.component.html',
  styleUrls: ['./input-field.component.css'],
})
export class InputFieldComponent implements OnInit {
  private receiver: string = '';
  public comment: string = '';
  constructor(
    private forwardMessage: DataShareService,
    private auth: AuthService,
    private io: SocketioService
  ) {}

  ngOnInit(): void {
    this.forwardMessage.message.subscribe((message: any = []) => {
      if (message.name != 'default') {
        this.receiver = message.id;
      }
    });
  }
  newComment() {
    if (this.comment.trim().length < 2) {
      return;
    }

    //send to chat area
    this.forwardMessage.sendlocal({
      sender: this.auth.getUserInfo().id,
      senderName: this.auth.getUserInfo().name,
      receiver: this.receiver,
      text: this.comment.trim(),
    });

    //emit to server
    this.io.messageSubmit({
      sender: this.auth.getUserInfo().id,
      senderName: this.auth.getUserInfo().name,
      receiver: this.receiver,
      text: this.comment.trim(),
    });
  }
}