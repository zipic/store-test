import { Component, OnInit } from '@angular/core';
import { filter } from 'rxjs';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent {
  selectedSort: string = '';

  constructor(private productService: ProductService) {}

  updatedFilterType() {
    this.productService.getFilterType(this.selectedSort);
  }
}
