import {
  AfterViewInit,
  Component,
  ComponentFactoryResolver,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { appState } from '../appState';
import { CommentComponent } from '../comment/comment.component';
import { CommentFactory } from '../commentFactory/factory';
import { Room } from '../Models/room';
import { AuthService } from '../services/auth.service';
import { CommentsService } from '../services/comments.service';
import { DataShareService } from '../services/data-share.service';
import { FileService } from '../services/file.service';
import { ChatDirective } from './chat.directive';

@Component({
  selector: 'chat-area',
  templateUrl: './chat-area.component.html',
  styleUrls: ['./chat-area.component.css'],
})
export class ChatAreaComponent implements OnInit, OnDestroy {
  @ViewChild(ChatDirective, { static: true })
  appChat!: ChatDirective;

  private vc!: ViewContainerRef;
  private activeRoom: any;
  private previousId: string = '';
  private observers: Subscription[] = [];
  private factory: CommentFactory = new CommentFactory(
    this.auth.getUserInfo().id
  );

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private fetchData: DataShareService,
    private commentsService: CommentsService,
    private auth: AuthService
  ) {}

  ngOnDestroy() {
    this.observers.forEach((observer) => {
      observer.unsubscribe();
    });
  }

  ngOnInit() {
    //on room change
    this.observers.push(
      this.fetchData.message.subscribe((data: any) => {
        if (data.id == this.activeRoom) {
          this.fetchData.stopLoading();
          return;
        }
        this.vc = this.appChat.viewContainerRef;
        this.vc.clear();
        this.activeRoom = data.id;
        this.getRoom();
      })
    );

    // local comment
    this.observers.push(
      this.fetchData.local.subscribe((data: any) => {
        this.commentSectionInit(data);
        this.saveLocal(this.activeRoom, data);
      })
    );

    //received comment
    this.observers.push(
      this.fetchData.remote.subscribe((data: any) => {
        if (data.custom) {
          this.saveLocal(data.receiver, data);
          if (data.receiver == this.activeRoom) {
            this.commentSectionInit(data);
          }
        } else {
          this.saveLocal(data.sender, data);
          if (this.activeRoom == data.sender) {
            this.commentSectionInit(data);
          }
        }
      })
    );
  }

  saveLocal(id: string, data: any) {
    appState.getRooms().forEach((room: Room) => {
      if (room.getSender() == id) {
        room.addComment(data);
      }
    });
  }

  renderer(comments: any, rid: string) {
    this.previousId = '';
    this.vc.clear();
    comments.forEach((comment: any) => {
      this.commentSectionInit(comment);
    });
    this.fetchData.stopLoading();
    this.fetchData.sendroomId(rid);
  }

  getRoom() {
    for (const room of appState.getRooms()) {
      if (room.getSender() == this.activeRoom) {
        this.renderer(room.getComments(), room.id);
        return;
      }
    }
    this.fetchFromServer();
  }

  fetchFromServer() {
    this.observers.push(
      this.commentsService
        .getComments('room', {
          receiver: this.activeRoom,
          sender: this.auth.getUserInfo().id,
        })
        .subscribe((response) => {
          let room = new Room(response.comments, response.room, response.rid);
          appState.addRoom(room);
          this.renderer(response.comments, room.id);
        })
    );
  }

  //create a comment instance for each comment
  commentSectionInit(data: any) {
    this.vc = this.appChat.viewContainerRef;
    const componentFactory =
      this.componentFactoryResolver.resolveComponentFactory(CommentComponent);
    const componentRef =
      this.vc.createComponent<CommentComponent>(componentFactory);
    const newComment = this.factory.newComment(this.previousId, data);
    (<CommentComponent>componentRef.instance).data = newComment;
    this.previousId = data.sender;
  }
}
