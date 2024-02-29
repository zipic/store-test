import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { InBasketProducts } from 'src/app/interfaces/inBasketProducts';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-basket',
  templateUrl: './basket.component.html',
  styleUrls: ['./basket.component.scss']
})
export class BasketComponent implements OnInit {
  basketProducts$: Observable<InBasketProducts[]> | undefined;
  isOpen$!: Observable<boolean>;
  totalAmount!: number;
  totalCount!: number;

  constructor(private productService: ProductService){}

  ngOnInit(): void {
    this.basketProducts$ = this.productService.basketProducts$;
    this.isOpen$ = this.productService.isOpen$;
    this.updateTotal();
  }

  onIncrement(product: InBasketProducts) {
    this.productService.plusCount(product.products);
    this.updateTotal();
  }

  onDecrement(product: InBasketProducts) {
    this.productService.minusCount(product.products)
    this.updateTotal();
  }

  deleteItem(product: InBasketProducts) {
    this.productService.deleteAll(product.products);
    this.updateTotal();
  }

  private updateTotal() {
      if (this.basketProducts$ !== undefined) {
      this.basketProducts$.subscribe(products => {
        this.totalAmount = products
          .reduce((sum, product) => sum + (+product.products.price * product.count), 0);
        this.totalCount = products.reduce((sum, product) => sum + product.count, 0);
      });
    }
  }

  setIsOpen() {
    this.productService.setIsOpen(!this.isOpen$);
  }
}
