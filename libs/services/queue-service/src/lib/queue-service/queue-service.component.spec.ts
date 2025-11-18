import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QueueServiceComponent } from './queue-service.component';

describe('QueueServiceComponent', () => {
  let component: QueueServiceComponent;
  let fixture: ComponentFixture<QueueServiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QueueServiceComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(QueueServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
