import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FirestoreService } from '../../services/firestore.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tool-search',
  imports: [CommonModule, FormsModule],
  templateUrl: './tool-search.html',
  styleUrl: './tool-search.css',
})
export class ToolSearch implements OnInit {

  private firestoreService = inject(FirestoreService);
  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router);

  // Filtros
  searchText = '';
  filterCategoria = '';
  filterEstado = '';
  filterBodega = '';
  sortOrder = 'asc';

  // Datos
  allTools: any[] = [];
  filteredTools: any[] = [];
  stands: any[] = [];
  warehouses: any[] = [];

  async ngOnInit() {
    this.allTools = await this.firestoreService.getAll<any>('tools');
    this.stands = await this.firestoreService.getAll<any>('stands');
    this.warehouses = await this.firestoreService.getAll<any>('warehouse');
    this.filteredTools = [];
    this.cdr.detectChanges();
  }

  // Aplica todos los filtros combinados y ordena
  search() {
    const text = this.searchText.toLowerCase().trim();

    this.filteredTools = this.allTools.filter(tool => {
      const matchNombre = !text || tool.tool_name?.toLowerCase().includes(text);
      const matchCategoria = !this.filterCategoria ||
        tool.tool_category?.toLowerCase() === this.filterCategoria.toLowerCase();
      const matchEstado = !this.filterEstado || tool.tool_state === this.filterEstado;
      const stand = this.stands.find(s => s.id === tool.stand_id);
      const matchBodega = !this.filterBodega ||
        stand?.warehouse_id === this.filterBodega;
      return matchNombre && matchCategoria && matchEstado && matchBodega;
    });
    this.filteredTools.sort((a, b) => {
      const nameA = a.tool_name?.toLowerCase();
      const nameB = b.tool_name?.toLowerCase();
      return this.sortOrder === 'asc'
        ? nameA.localeCompare(nameB)
        : nameB.localeCompare(nameA);
    });

    this.cdr.detectChanges();
  }

  // Resetea todos los filtros
  resetFiltros() {
    this.searchText = '';
    this.filterCategoria = '';
    this.filterEstado = '';
    this.filterBodega = '';
    this.sortOrder = 'asc';
    this.filteredTools = [];
    this.cdr.detectChanges();
  }

  getStandName(stand_id: string): string {
    const stand = this.stands.find(s => s.id === stand_id);
    return stand ? stand.stand_name : 'Sin estantería';
  }

  getWarehouseName(stand_id: string): string {
    const stand = this.stands.find(s => s.id === stand_id);
    if (!stand) return 'Sin bodega';
    const warehouse = this.warehouses.find(w => w.id === stand.warehouse_id);
    return warehouse ? warehouse.nombre : 'Sin bodega';
  }

  goTo(path: string) {
    this.router.navigate([path]);
  }
}