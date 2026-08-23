import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FirestoreService } from '../../services/firestore.service';

@Component({
  selector: 'app-add-warehouse',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './add-warehouse.html',
  styleUrl: './add-warehouse.css',
})
export class AddWarehouse implements OnInit {
  myForm: FormGroup;

  private firestoreService = inject(FirestoreService);

  constructor(private formBuilder: FormBuilder, private router: Router) {
    this.myForm = this.formBuilder.group({
      nombre: ['', [Validators.required]],
    });
  }

  async ngOnInit() {}

  goBack() {
    this.router.navigate(['/warehouse']);
  }

  async guardar() {
    if (this.myForm.valid) {
      const warehouses = await this.firestoreService.getAll('warehouse');
      const numero = warehouses.length + 1;

      await this.firestoreService.add('warehouse', {
        ...this.myForm.value,
        numero: numero,
        fecha_creacion: new Date().toISOString()
      });

      alert('Bodega agregada correctamente');
      this.myForm.reset();
    } else {
      alert('Formulario vacío');
    }
  }

  goTo(path: string) {
    this.router.navigate([path]);
  }
}