import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PincodeComponent } from './pincode.component';

describe('PincodeComponent', () => {
  let component: PincodeComponent;
  let fixture: ComponentFixture<PincodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PincodeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PincodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
