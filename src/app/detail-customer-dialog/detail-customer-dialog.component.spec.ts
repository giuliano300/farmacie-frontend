import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailCustomerDialogComponent } from './detail-customer-dialog.component';

describe('ConfirmDialogComponent', () => {
  let component: DetailCustomerDialogComponent;
  let fixture: ComponentFixture<DetailCustomerDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailCustomerDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailCustomerDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
