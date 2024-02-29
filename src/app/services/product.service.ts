import { Injectable } from '@angular/core';
import { BehaviorSubject, map, take } from 'rxjs';
import { Products } from '../interfaces/products';
import { InBasketProducts } from '../interfaces/inBasketProducts';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private productSubject = new BehaviorSubject<Products[]>([]);
  products$ = this.productSubject.asObservable();

  private filterSubject = new BehaviorSubject<string>('');
  filter$ = this.filterSubject.asObservable();

  private basketSubjects = new BehaviorSubject<InBasketProducts[]>([])
  basketProducts$ = this.basketSubjects.asObservable();

  private openSubject = new BehaviorSubject<boolean>(false);
  isOpen$ = this.openSubject.asObservable();

  constructor() {
    this.loadBasketFromStorage();
   }

  private loadBasketFromStorage(): void {
    const storedBasket = localStorage.getItem('basketProducts');
    const basketProducts: InBasketProducts[] = storedBasket ? JSON.parse(storedBasket) : [];
    this.basketSubjects.next(basketProducts);
  }

  private saveBasketToStorage(basket: InBasketProducts[]): void {
    localStorage.setItem('basketProducts', JSON.stringify(basket));
  }

  setIsOpen(value: boolean) {
    this.openSubject.next(value);
  }

  getProducts(products: Products[]) {
    this.productSubject.next(products);
  }

  filterProducts(value: string) {
    return this.products$.pipe(map(products => {
      let filteredProducts = [...products];

      if (value === 'name') {
        filteredProducts = filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
      }

      if (value === 'price') {
        filteredProducts = filteredProducts.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
      }

      return filteredProducts;
    }));
  }

  getFilterType(value: string) {
    console.log('Filter Type:', value);
    this.filterSubject.next(value);
  }

  getBasketProducts(basketProducts: InBasketProducts[]) {
    this.basketSubjects.next(basketProducts);
    this.saveBasketToStorage(basketProducts);
  }

  addToBasket(product: Products) {
    this.basketSubjects.pipe(take(1)).subscribe((basketProducts) => {
      const updatedBasket = [...basketProducts];
      const index = updatedBasket.findIndex((p) => p.products.id === product.id);

      if (index !== -1) {
        updatedBasket[index].count++;
      } else {
        updatedBasket.push({
          products: product,
          count: 1,
        });
      }

      this.basketSubjects.next(updatedBasket);
      this.saveBasketToStorage(updatedBasket);
    });
  }

  minusCount(product: Products) {
    this.basketSubjects.pipe(take(1)).subscribe((basketProducts) => {
      const updatedBasket = [...basketProducts];
      const index = updatedBasket.findIndex((p) => p.products.id === product.id);

      if (index !== -1 && updatedBasket[index].count > 1) {
        updatedBasket[index].count--;
        this.saveBasketToStorage(updatedBasket);
      } else {
        updatedBasket.splice(index, 1);
        this.saveBasketToStorage(updatedBasket);
      }
      this.basketSubjects.next(updatedBasket);
    });
  }

  plusCount(product: Products) {
    this.basketSubjects.pipe(take(1)).subscribe((basketProducts) => {
      const updatedBasket = [...basketProducts];
      const index = updatedBasket.findIndex((p) => p.products.id === product.id);

      if (index !== -1) {
        updatedBasket[index].count++;
        this.basketSubjects.next(updatedBasket);
        this.saveBasketToStorage(updatedBasket);
      }
    });
  }

  deleteAll(product: Products) {
    this.basketSubjects.pipe(take(1)).subscribe((basketProducts) => {
      const updatedBasket = [...basketProducts];
      const index = updatedBasket.findIndex((p) => p.products.id === product.id);

      if (index !== -1) {
        updatedBasket[index].count = 0;
        updatedBasket.splice(index, 1);
        this.basketSubjects.next(updatedBasket);
        this.saveBasketToStorage(updatedBasket);
      }
    });
  }
}
