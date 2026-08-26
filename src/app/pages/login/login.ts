import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  myForm: FormGroup;
  private auth = inject(Auth);

  constructor(private formBuilder: FormBuilder, private router: Router) {
    this.myForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  async login() {
    if (this.myForm.valid) {
      try {
        await signInWithEmailAndPassword(
          this.auth,
          this.myForm.value.email,
          this.myForm.value.password
        );
        this.router.navigate(['/home']);
      } catch (error) {
        alert('Usuario o contraseña incorrectos');
      }
    } else {
      alert('Completa todos los campos');
    }
  }
}
