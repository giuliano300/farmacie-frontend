import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductToExcludeComponent } from './product-to-exclude.component';

describe('ProductToExcludeComponent', () => {
  let component: ProductToExcludeComponent;
  let fixture: ComponentFixture<ProductToExcludeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductToExcludeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductToExcludeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
