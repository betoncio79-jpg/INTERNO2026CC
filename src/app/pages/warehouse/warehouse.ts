import { CommonModule, DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FirestoreService } from '../../services/firestore.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-warehouse',
  imports: [CommonModule, DatePipe],
  templateUrl: './warehouse.html',
  styleUrl: './warehouse.css',
})
export class Warehouse implements OnInit{
  
  
  private firestoreService = inject(FirestoreService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  warehouses: any[] = [];

  async ngOnInit() {
    this.warehouses = await this.firestoreService.getAll('warehouse');
    this.cdr.detectChanges();
  }

  addWarehouse() {
    this.router.navigate(['/add-warehouse']);
  }
  goTo(path: string) {
    this.router.navigate([path]);
  }
}
