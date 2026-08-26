import { CommonModule, DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FirestoreService } from '../../services/firestore.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tools',
  imports: [CommonModule, DatePipe],
  templateUrl: './tools.html',
  styleUrl: './tools.css',
})
export class Tools implements OnInit {

  private firestoreService = inject(FirestoreService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  tools: any[] = [];
  stands: any[] = [];
  warehouses: any[] = [];

  async ngOnInit() {
    this.tools = await this.firestoreService.getAll('tools');
    this.stands = await this.firestoreService.getAll('stands');
    this.warehouses = await this.firestoreService.getAll('warehouse');
    this.cdr.detectChanges();
  }

  addTool() {
    this.router.navigate(['/add-tools']);
  }

  editTool(id: string) {
    this.router.navigate(['/edit-tool', id]);
  }

  getStandName(stand_id: string): string {
    const stand = this.stands.find(s => s.id === stand_id);
    return stand ? `Stand_0${stand.numero} — ${stand.stand_name}` : 'Sin estantería';
  }
  
  getWarehouseName(stand_id: string): string {
    const stand = this.stands.find(s => s.id === stand_id);
    if (!stand) return 'Sin bodega';
    const warehouse = this.warehouses.find(w => w.id === stand.warehouse_id);
    return warehouse ? `Bodega_0${warehouse.numero} — ${warehouse.nombre}` : 'Sin bodega';
  }

  goTo(path: string) {
    this.router.navigate([path]);
  }

  viewHistory(id: string) {
    this.router.navigate(['/tool-history', id]);
  }

  async deleteTool(id: string) {
    const confirmar = confirm('¿Estás seguro de eliminar esta herramienta?');
    if (confirmar) {
      await this.firestoreService.delete('tools', id);
      this.tools = this.tools.filter(t => t.id !== id);
      this.cdr.detectChanges();
    }
  }
}