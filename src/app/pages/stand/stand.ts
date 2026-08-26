import { CommonModule, DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FirestoreService } from '../../services/firestore.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-stand',
  imports: [CommonModule, DatePipe],
  templateUrl: './stand.html',
  styleUrl: './stand.css',
})
export class Stand implements OnInit {

  private firestoreService = inject(FirestoreService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  stands: any[] = [];
  warehouses: any[] = [];

  async ngOnInit() {
    this.stands = await this.firestoreService.getAll('stands');
    this.warehouses = await this.firestoreService.getAll('warehouse');
    this.cdr.detectChanges(); // Fuerza a Angular a actualizar la vista
  }

  addStand() {
    this.router.navigate(['/add-stand']); // Navega a la pantalla de agregar estantería
  }

  getWarehouseName(warehouse_id: string): string {
    const warehouse = this.warehouses.find(w => w.id === warehouse_id);
    return warehouse ? warehouse.nombre : 'Sin bodega';
  }

  goTo(path: string) {
    this.router.navigate([path]);
  }

  async deleteStand(id: string) {
    const confirmar = confirm('¿Estás seguro de eliminar esta estantería?');
    if (confirmar) {
      await this.firestoreService.delete('stands', id);
      this.stands = this.stands.filter(s => s.id !== id);
      this.cdr.detectChanges();
    }
  }
}