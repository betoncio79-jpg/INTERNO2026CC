import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FirestoreService } from '../../services/firestore.service';

@Component({
  selector: 'app-edit-tool',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './edit-tool.html',
  styleUrl: './edit-tool.css',
})
export class EditTool implements OnInit {

  myForm: FormGroup;
  warehouses: any[] = [];
  allStands: any[] = [];
  Stands: any[] = [];
  toolId = '';

  private firestoreService = inject(FirestoreService);
  private route = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);

  constructor(private formBuilder: FormBuilder, private router: Router) {
    this.myForm = this.formBuilder.group({
      tool_state:   ['', [Validators.required]],
      warehouse_id: ['', [Validators.required]],
      stand_id:     ['', [Validators.required]],
    });
  }

  async ngOnInit() {
    this.toolId = this.route.snapshot.paramMap.get('id') || '';
    this.warehouses = await this.firestoreService.getAll<any>('warehouse');
    this.allStands = await this.firestoreService.getAll<any>('stands');

    const tools = await this.firestoreService.getAll<any>('tools');
    const tool = tools.find((t: any) => t.id === this.toolId);

    if (tool) {
      // Encuentra la bodega de la estantería actual
      const stand = this.allStands.find(s => s.id === tool.stand_id);
      const warehouseId = stand ? stand.warehouse_id : '';

      // Filtra las estanterías de esa bodega
      this.Stands = this.allStands.filter(s => s.warehouse_id === warehouseId);

      // Precarga los valores actuales
      this.myForm.patchValue({
        tool_state:   tool.tool_state,
        warehouse_id: warehouseId,
        stand_id:     tool.stand_id,
      });
    }
    this.cdr.detectChanges();
  }

  // Cuando cambia la bodega filtra las estanterías
  onWarehouseChange(event: any) {
    const warehouseId = event.target.value;
    this.Stands = this.allStands.filter(s => s.warehouse_id === warehouseId);
    this.myForm.patchValue({ stand_id: '' });
  }

  goBack() {
    this.router.navigate(['/tools']);
  }

  async guardar() {
    if (this.myForm.valid) {
      // Obtiene los datos anteriores de la herramienta
      const tools = await this.firestoreService.getAll<any>('tools');
      const toolAnterior = tools.find((t: any) => t.id === this.toolId);
  
      // Obtiene nombres de estantería y bodega nuevas
      const standNuevo = this.allStands.find(s => s.id === this.myForm.value.stand_id);
      const warehouseNuevo = this.warehouses.find(w => w.id === this.myForm.value.warehouse_id);
  
      // Obtiene nombres de estantería y bodega anteriores
      const standAnterior = this.allStands.find(s => s.id === toolAnterior?.stand_id);
      const warehouseAnterior = this.allStands.find(s => s.id === toolAnterior?.warehouse_id);
  
      // Construye el detalle del cambio
      let detalle = '';
      if (toolAnterior?.tool_state !== this.myForm.value.tool_state) {
        detalle += `Estado cambiado de "${toolAnterior?.tool_state}" a "${this.myForm.value.tool_state}". `;
      }
      if (toolAnterior?.stand_id !== this.myForm.value.stand_id) {
        detalle += `Movida de ${standAnterior?.stand_name || 'Sin estantería'} a ${standNuevo?.stand_name}`;
      }
      if (!detalle) detalle = 'Sin cambios detectados';
  
      await this.firestoreService.update('tools', this.toolId, this.myForm.value);
  
      await this.firestoreService.add('historial', {
        tool_id: this.toolId,
        tool_name: toolAnterior?.tool_name,
        accion: 'Editada',
        fecha: new Date().toISOString(),
        detalle: detalle
      });
  
      alert('Herramienta actualizada correctamente');
      this.router.navigate(['/tools']);
    } else {
      alert('Formulario vacío');
    }
  }
  goTo(path: string) {
    this.router.navigate([path]);
  }
}