import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddProductToExcludeDialogComponent } from './add-product-to-exclude-dialog.component';

describe('AddProductToExcludeDialogComponent', () => {
  let component: AddProductToExcludeDialogComponent;
  let fixture: ComponentFixture<AddProductToExcludeDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddProductToExcludeDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddProductToExcludeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
