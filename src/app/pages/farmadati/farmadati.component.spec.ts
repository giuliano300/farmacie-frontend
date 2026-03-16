import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FarmadatiComponent } from './farmadati.component';

describe('FarmadatiComponent', () => {
  let component: FarmadatiComponent;
  let fixture: ComponentFixture<FarmadatiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FarmadatiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FarmadatiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
