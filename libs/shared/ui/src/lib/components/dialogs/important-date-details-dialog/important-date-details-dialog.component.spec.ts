import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportantDateDetailsDialogComponent } from './important-date-details-dialog.component';

describe('ImportantDateDetailsDialogComponent', () => {
  let component: ImportantDateDetailsDialogComponent;
  let fixture: ComponentFixture<ImportantDateDetailsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImportantDateDetailsDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ImportantDateDetailsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
