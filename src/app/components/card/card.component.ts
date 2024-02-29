import { Component, OnInit } from '@angular/core';
import { Observable, map } from 'rxjs';
import { InBasketProducts } from 'src/app/interfaces/inBasketProducts';
import { Products } from 'src/app/interfaces/products';
import { DataService } from 'src/app/services/data.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {
  products$: Observable<Products[]> = new Observable<Products[]>();
  basketProducts$!: Observable<InBasketProducts[]>;
  isAddedToBasket: boolean = false;

  constructor(
    private dataService: DataService,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.dataService.getData().subscribe(data => {
      this.productService.getProducts(data.slice(3));
      this.productService.filter$.subscribe(value => {
        this.products$ = this.productService.filterProducts(value.toLowerCase());
      });
    });

    this.basketProducts$ = this.productService.basketProducts$;
  }

  addToBasket(product: Products) {
    this.productService.addToBasket(product);
  }

  checkIsAdded(product: Products): Observable<boolean> {
    return this.basketProducts$.pipe(
      map(basketProducts => basketProducts.some(item => item.products.id === product.id))
    );
  }
}
