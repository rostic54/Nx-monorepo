import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralDayInfoComponent } from './general-day-info.component';

describe('GeneralDayInfoComponent', () => {
  let component: GeneralDayInfoComponent;
  let fixture: ComponentFixture<GeneralDayInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GeneralDayInfoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GeneralDayInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
