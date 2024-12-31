import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventBriefInfoComponent } from './event-brief-info.component';

describe('EventBriefInfoComponent', () => {
  let component: EventBriefInfoComponent;
  let fixture: ComponentFixture<EventBriefInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventBriefInfoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EventBriefInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
