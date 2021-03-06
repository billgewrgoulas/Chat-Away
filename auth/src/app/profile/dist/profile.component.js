"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.ProfileComponent = void 0;
var core_1 = require("@angular/core");
var core_2 = require("@angular/core");
var ProfileComponent = /** @class */ (function () {
    function ProfileComponent(authService, fileService, dataShare, router) {
        this.authService = authService;
        this.fileService = fileService;
        this.dataShare = dataShare;
        this.router = router;
        this.notCheck = new core_2.EventEmitter();
        this.ovCheck = new core_2.EventEmitter();
        this.observers = [];
        this.exp = 'translateX(0px)';
        this.expHeight = '197px';
        this.url = this.authService.getUserInfo().avatar;
        this.name = this.authService.getUserInfo().name;
        this.fadeIn = false;
    }
    ProfileComponent.prototype.ngAfterViewInit = function () {
        this.el = this.preview.nativeElement;
        this.file = this.imgInput.nativeElement;
    };
    ProfileComponent.prototype.ngOnInit = function () {
        var url = localStorage.getItem('url');
        if (url) {
            this.url = url;
        }
        this.dataShare.sendUrl(this.url);
    };
    ProfileComponent.prototype.ngOnDestroy = function () {
        localStorage.removeItem('url');
        this.observers.forEach(function (observer) {
            observer.unsubscribe();
        });
    };
    ProfileComponent.prototype.changeAvatar = function () {
        if (this.isDemo) {
            return;
        }
        this.exp = 'translateX(-297px)';
        this.expHeight = '400px';
    };
    ProfileComponent.prototype.slide = function () {
        var _this = this;
        this.exp = 'translateX(0px)';
        this.expHeight = '197px';
        this.fadeIn = false;
        setTimeout(function () {
            _this.el.style.backgroundImage = 'url(' + _this.url + ')';
        }, 200);
    };
    ProfileComponent.prototype.previewAvatar = function () {
        var _this = this;
        var reader = new FileReader();
        var element = this.el;
        reader.onload = function (e) {
            element.style.backgroundImage = 'url(' + e.target.result + ')';
        };
        reader.readAsDataURL(this.file.files[0]);
        this.fadeIn = true;
        setTimeout(function () {
            _this.fadeIn = false;
        }, 500);
    };
    ProfileComponent.prototype.upload = function () {
        var _this = this;
        if (this.file && this.file.files[0]) {
            var fd = new FormData();
            fd.append('image', this.file.files[0]);
            fd.append('uid', this.authService.getUserInfo().id);
            this.observers.push(this.fileService
                .postAvatar('avatar', fd)
                .subscribe(function (response) {
                if (response === void 0) { response = []; }
                _this.url = response.path;
                _this.slide();
                localStorage.setItem('url', _this.url);
                _this.dataShare.sendUrl(_this.url);
            }));
        }
    };
    ProfileComponent.prototype.profileCheck = function () {
        this.notCheck.emit(true);
        this.ovCheck.emit(!this.prof);
    };
    ProfileComponent.prototype.logout = function () {
        var _this = this;
        this.observers.push(this.authService.logout('logout').subscribe(function () {
            _this.authService.removeUserInfo();
            _this.router.navigateByUrl('logout');
        }));
    };
    Object.defineProperty(ProfileComponent.prototype, "isDemo", {
        get: function () {
            return this.authService.isDemo();
        },
        enumerable: false,
        configurable: true
    });
    __decorate([
        core_1.ViewChild('imagePreview')
    ], ProfileComponent.prototype, "preview");
    __decorate([
        core_1.ViewChild('input')
    ], ProfileComponent.prototype, "imgInput");
    __decorate([
        core_1.Output()
    ], ProfileComponent.prototype, "notCheck");
    __decorate([
        core_1.Output()
    ], ProfileComponent.prototype, "ovCheck");
    __decorate([
        core_1.Input()
    ], ProfileComponent.prototype, "not");
    __decorate([
        core_1.Input()
    ], ProfileComponent.prototype, "prof");
    ProfileComponent = __decorate([
        core_2.Component({
            selector: 'app-profile',
            templateUrl: './profile.component.html',
            styleUrls: ['./profile.component.css']
        })
    ], ProfileComponent);
    return ProfileComponent;
}());
exports.ProfileComponent = ProfileComponent;
