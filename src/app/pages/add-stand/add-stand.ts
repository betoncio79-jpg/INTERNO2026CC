import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FirestoreService } from '../../services/firestore.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-stand',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './add-stand.html',
  styleUrl: './add-stand.css',
})
export class AddStand implements OnInit {

  myForm: FormGroup;
  warehouses: any[] = [];

  private firestoreService = inject(FirestoreService);
  private cdr = inject(ChangeDetectorRef);

  constructor(private formBuilder: FormBuilder, private router: Router) {
    this.myForm = this.formBuilder.group({
      stand_name:   ['', [Validators.required]],
      warehouse_id: ['', [Validators.required]],
    });
  }

  async ngOnInit() {
    this.warehouses = await this.firestoreService.getAll('warehouse');
    this.cdr.detectChanges();
  }

  goBack() {
    this.router.navigate(['/stand']);
  }

  async guardar() {
    if (this.myForm.valid) {
      const currentUserId = localStorage.getItem('currentUserId');
      await this.firestoreService.add('stands', {
        ...this.myForm.value,
        createdBy: currentUserId
      });
      alert('Estantería agregada correctamente');
      this.myForm.reset();
    } else {
      alert('Formulario vacío');
    }
  }

  goTo(path: string) {
    this.router.navigate([path]);
  }
}
