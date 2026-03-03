import { Component, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';

import { CategorieService } from '../services/categorie.service';
import { Router } from '@angular/router';
import { Category } from '../interfaces/Categories';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { CustomDateFormatPipe } from "../custom-date-format.pipe";
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@Component({
    selector: 'app-categories',
    imports: [MatCardModule, MatButtonModule,  MatSlideToggleModule, MatMenuModule, MatPaginatorModule, MatTableModule, MatCheckboxModule, CustomDateFormatPipe],
    templateUrl: './categories.component.html',
    styleUrl: './categories.component.scss'
})
export class CategoriesComponent {

    categories: Category[] = []; 
    displayedColumns: string[] = ['id','name', 'insertDate', 'enabled', 'action'];
    dataSource = new MatTableDataSource<Category>(this.categories);

    constructor(private dialog: MatDialog, private categorieService: CategorieService, private router: Router) {}

    @ViewChild(MatPaginator) paginator!: MatPaginator;

    // Search Filter
    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    ngOnInit(): void {
        this.getCategories();
    }

    getCategories(){
         this.categorieService.getCategorie().subscribe((data: Category[]) => {
            // Aggiungi la proprietà action a ogni categoria esistente
            this.categories = data.map(category => ({
                ...category, 
                action: {
                    edit: 'ri-edit-line',
                    delete: 'ri-delete-bin-line'
                }
            }));
    
            this.dataSource = new MatTableDataSource<Category>(this.categories);
            this.dataSource.paginator = this.paginator;
        });
   }

   enabledDisabled(id:string){
        this.categorieService.enabledDisabledCategorie(id);
   }
        
    removeRequest(id:string){
    
        const dialogRef = this.dialog.open(ConfirmDialogComponent);

        dialogRef.afterClosed().subscribe(result => {
        if (result) 
        {
            this.categorieService.deleteCategorie(id).subscribe((data: boolean) => {
                if(data)
                    this.getCategories();
                else
                    alert('Errore nell\'eliminazione della categoria');
            });
        }
        else 
        {
            console.log('Request removal cancelled');
        }
        });
    }
}
