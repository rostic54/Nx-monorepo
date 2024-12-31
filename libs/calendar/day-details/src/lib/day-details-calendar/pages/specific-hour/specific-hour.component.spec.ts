import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecificHourComponent } from './specific-hour.component';

describe('SpecificHourComponent', () => {
  let component: SpecificHourComponent;
  let fixture: ComponentFixture<SpecificHourComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpecificHourComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SpecificHourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
