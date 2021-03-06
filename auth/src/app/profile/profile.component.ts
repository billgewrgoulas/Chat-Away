import { Input, OnDestroy, Output, ViewChild } from '@angular/core';
import { AfterViewInit, Component, OnInit, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { DataShareService } from '../services/data-share.service';
import { FileService } from '../services/file.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('imagePreview') preview: any;
  @ViewChild('input') imgInput: any;
  @Output() notCheck: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() ovCheck: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() not: any;
  @Input() prof: any;

  private el: any;
  private observers: Subscription[] = [];
  public file: any;
  public exp: string = 'translateX(0px)';
  public expHeight: string = '197px';
  public url: string = this.authService.getUserInfo().avatar;
  public name: string = this.authService.getUserInfo().name;
  public fadeIn: boolean = false;

  constructor(
    private authService: AuthService,
    private fileService: FileService,
    private dataShare: DataShareService,
    private router: Router
  ) {}

  ngAfterViewInit(): void {
    this.el = this.preview.nativeElement;
    this.file = this.imgInput.nativeElement;
  }

  ngOnInit(): void {
    let url = localStorage.getItem('url');
    if (url) {
      this.url = url;
    }
    this.dataShare.sendUrl(this.url);
  }

  ngOnDestroy() {
    localStorage.removeItem('url');
    this.observers.forEach((observer) => {
      observer.unsubscribe();
    });
  }

  changeAvatar() {
    if (this.isDemo) {
      return;
    }
    this.exp = 'translateX(-297px)';
    this.expHeight = '400px';
  }

  slide() {
    this.exp = 'translateX(0px)';
    this.expHeight = '197px';
    this.fadeIn = false;
    setTimeout(() => {
      this.el.style.backgroundImage = 'url(' + this.url + ')';
    }, 200);
  }

  previewAvatar() {
    let reader = new FileReader();
    let element = this.el;
    reader.onload = function (e: any) {
      element.style.backgroundImage = 'url(' + e.target.result + ')';
    };
    reader.readAsDataURL(this.file.files[0]);
    this.fadeIn = true;
    setTimeout(() => {
      this.fadeIn = false;
    }, 500);
  }

  upload() {
    if (this.file && this.file.files[0]) {
      const fd = new FormData();
      fd.append('image', this.file.files[0]);
      fd.append('uid', this.authService.getUserInfo().id);
      this.observers.push(
        this.fileService
          .postAvatar('avatar', fd)
          .subscribe((response: any = []) => {
            this.url = response.path;
            this.slide();
            localStorage.setItem('url', this.url);
            this.dataShare.sendUrl(this.url);
          })
      );
    }
  }

  profileCheck() {
    this.notCheck.emit(true);
    this.ovCheck.emit(!this.prof);
  }

  logout() {
    this.observers.push(
      this.authService.logout('logout').subscribe(() => {
        this.authService.removeUserInfo();
        this.router.navigateByUrl('logout');
      })
    );
  }

  get isDemo() {
    return this.authService.isDemo();
  }
}
