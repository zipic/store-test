import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { InBasketProducts } from 'src/app/interfaces/inBasketProducts';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  basketProducts$!: Observable<InBasketProducts[]>;
  isOpen: boolean = false;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.basketProducts$ = this.productService.basketProducts$;
  }

  setIsOpen() {
    this.productService.setIsOpen(!this.isOpen)
  }
}
