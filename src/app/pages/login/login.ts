import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Firestore, collection, query, where, getDocs } from '@angular/fire/firestore';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {
  email = '';
  fullname = '';
  errorMsg = '';

  constructor(private firestore: Firestore, private router: Router) {}

  async login() {
    const usersRef = collection(this.firestore, 'user');
    const q = query(
      usersRef,
      where('email', '==', this.email),
      where('fullname', '==', this.fullname)
    );
    const result = await getDocs(q);

    if (result.empty) {
      this.errorMsg = 'Correo o nombre incorrectos';
      return;
    }

    const userDoc = result.docs[0];
    localStorage.setItem('currentUserId', userDoc.id);
    localStorage.setItem('currentUserName', userDoc.data()['fullname']);
    this.router.navigate(['/home']);
  }
}