import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FirestoreService } from '../../services/firestore.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-tools',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './add-tools.html',
  styleUrl: './add-tools.css',
})
export class AddTools implements OnInit {
  myForm: FormGroup;
  warehouses: any[] = [];
  allStands: any[] = [];
  Stands: any[] = [];

  private firestoreService = inject(FirestoreService);

  constructor(private formBuilder: FormBuilder, private router: Router) {
    this.myForm = this.formBuilder.group({
      tool_name:     ['', [Validators.required]],
      tool_category: ['', [Validators.required]],
      tool_state:    ['Funcional', [Validators.required]],
      warehouse_id:  ['', [Validators.required]],
      stand_id:      ['', [Validators.required]],
    });
  }

  async ngOnInit() {
    // Carga bodegas y estanterías desde Firestore
    this.warehouses = await this.firestoreService.getAll('warehouse');
    this.allStands = await this.firestoreService.getAll('stands');
  }

  // Cuando el usuario selecciona una bodega, filtra sus estanterías
  onWarehouseChange(event: any) {
    const warehouseId = event.target.value;
    this.Stands = this.allStands.filter(s => s.warehouse_id === warehouseId);
    // Resetea la estantería seleccionada
    this.myForm.patchValue({ stand_id: '' });
  }

  goBack() {
    this.router.navigate(['/tools']);
  }

  async guardar() {
    if (this.myForm.valid) {
      const tools = await this.firestoreService.getAll('tools');
      const numero = tools.length + 1;
  
      const docRef = await this.firestoreService.add('tools', {
        ...this.myForm.value,
        numero: numero,
        fecha_creacion: new Date().toISOString()
      });
  
      const stand = this.allStands.find(s => s.id === this.myForm.value.stand_id);
      const warehouse = this.warehouses.find(w => w.id === this.myForm.value.warehouse_id);
      await this.firestoreService.add('historial', {
        tool_id: docRef.id,
        tool_name: this.myForm.value.tool_name,
        accion: 'Registrada',
        fecha: new Date().toISOString(),
        detalle: `Registrada en ${stand?.stand_name} / ${warehouse?.nombre}`
      });
  
      alert('Herramienta agregada correctamente');
      this.myForm.reset();
      this.Stands = [];
    } else {
      alert('Formulario vacío');
    }
  }

  goTo(path: string) {
    this.router.navigate([path]);
  }
}