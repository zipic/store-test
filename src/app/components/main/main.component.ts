import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  isOpen$: Observable<boolean> | undefined;

  constructor(private productService: ProductService) {

  }
  ngOnInit(): void {
    this.isOpen$ = this.productService.isOpen$;
    console.log(this.isOpen$)
  }
}
