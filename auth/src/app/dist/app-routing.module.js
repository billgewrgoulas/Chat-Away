"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.AppRoutingModule = void 0;
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var chat_area_component_1 = require("./chat-area/chat-area.component");
var home_component_1 = require("./home/home.component");
var login_component_1 = require("./login/login.component");
var not_found_component_1 = require("./not-found/not-found.component");
var auth_guard_service_1 = require("./services/auth-guard.service");
var users_component_1 = require("./users/users.component");
var routes = [
    {
        path: '',
        component: home_component_1.HomeComponent,
        canActivate: [auth_guard_service_1.AuthGuardService],
        children: [
            {
                path: 'chat/:id',
                component: chat_area_component_1.ChatAreaComponent,
                canActivate: [auth_guard_service_1.AuthGuardService],
                outlet: 'chatArea'
            },
        ]
    },
    {
        path: 'logout',
        redirectTo: 'login',
        pathMatch: 'full'
    },
    { path: 'users', component: users_component_1.UsersComponent, canActivate: [auth_guard_service_1.AuthGuardService] },
    { path: 'login', component: login_component_1.LoginComponent },
    { path: '**', component: not_found_component_1.NotFoundComponent, redirectTo: '' },
];
var AppRoutingModule = /** @class */ (function () {
    function AppRoutingModule() {
    }
    AppRoutingModule = __decorate([
        core_1.NgModule({
            imports: [router_1.RouterModule.forRoot(routes)],
            exports: [router_1.RouterModule]
        })
    ], AppRoutingModule);
    return AppRoutingModule;
}());
exports.AppRoutingModule = AppRoutingModule;
