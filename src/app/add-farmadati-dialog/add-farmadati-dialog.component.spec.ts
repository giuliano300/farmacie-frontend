import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBatchDialogComponent } from './add-farmadati-dialog.component';

describe('AddFarmadatiDialogComponent', () => {
  let component: AddFarmadatiDialogComponent;
  let fixture: ComponentFixture<AddFarmadatiDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddFarmadatiDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddFarmadatiDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
