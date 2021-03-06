import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EmailValidators } from './email.validator';
import { mustMatch } from './password.validators';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  public password: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  registerForm = new FormGroup({
    name: new FormControl('', [Validators.minLength(3), Validators.required]),
    email: new FormControl(
      '',
      [Validators.minLength(3), Validators.required, Validators.email],
      EmailValidators.shouldBeUnique
    ),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
    ]),
    password2: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      mustMatch(),
    ]),
  });

  register() {
    //check if the form is valid
    if (this.registerForm.invalid) {
      return;
    }

    this.authService
      .register(
        this.registerForm.value.name,
        this.registerForm.value.email,
        this.registerForm.value.password,
        'register'
      )
      .subscribe((response) => {
        this.closeModal();
        this.router.navigate(['']);
      });
  }

  //register form
  get regName() {
    return this.registerForm.get('name');
  }

  get regEmail() {
    return this.registerForm.get('email');
  }

  get regPassword() {
    return this.registerForm.get('password');
  }

  get regConfirm() {
    return this.registerForm.get('password2');
  }

  private closeModal() {
    const btn = document.querySelector('#closereg') as HTMLElement;
    btn.click();
  }

  onChange() {
    localStorage.setItem('pass', this.password);
  }
}
