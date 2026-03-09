import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateProducerDialogComponent } from './add-update-producer-dialog.component';

describe('AddUpdateProducerDialogComponent', () => {
  let component: AddUpdateProducerDialogComponent;
  let fixture: ComponentFixture<AddUpdateProducerDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddUpdateProducerDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddUpdateProducerDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
