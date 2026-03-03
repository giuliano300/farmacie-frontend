import { Component, OnInit } from '@angular/core';
import { Category } from '../../interfaces/Categories';
import { CategorieService } from '../../services/categorie.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MatCardModule], 
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  categories: Category[] = []; 

  constructor(private categorieService: CategorieService, private router: Router) {}

  // Carica le categorie al caricamento del componente
  ngOnInit(): void {
    this.categorieService.getCategorie().subscribe((data: Category[]) => {
      this.categories = data;
    });
  }


  goToCompare(categoryId: string): void {
    this.router.navigate(['/compare'], { queryParams: { categoryId } });
  }
}
