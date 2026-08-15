import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FirestoreService } from '../../services/firestore.service';

@Component({
  selector: 'app-add-warehouse',
  imports: [ReactiveFormsModule],
  templateUrl: './add-warehouse.html',
  styleUrl: './add-warehouse.css',
})
export class AddWarehouse {
  myForm: FormGroup;

  // Inyectamos el servicio
  private firestoreService = inject(FirestoreService);

  constructor(private formBuilder: FormBuilder, private router: Router) {
    this.myForm = this.formBuilder.group({
      nombre: ['', [Validators.required]],
      numero: ['', [Validators.required]],
    });
  }

  goBack() {
    this.router.navigate(['/warehouse']);
  }

  async guardar(){
    if (this.myForm.valid) {
      const currentUserId = localStorage.getItem('currentUserId');
      await this.firestoreService.add('warehouse', {
        ...this.myForm.value,
        createdBy: currentUserId
      });
      alert('Producto agregado correctamente')
      this.myForm.reset();
    }else{
      alert('Formulario vacio')
    }
  }
  goTo(path: string) {
    this.router.navigate([path]);
  }
}
