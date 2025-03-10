import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToastModule } from 'primeng/toast';
import { HeaderComponent } from '@angular-monorepo/ui'
import { CommonModule } from '@angular/common';
import { SessionService } from '@angular-monorepo/services-atm';
import { Subject, takeUntil } from 'rxjs';

@Component({
  imports: [CommonModule, RouterModule, ProgressSpinnerModule, ToastModule, HeaderComponent],
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'atm';
  isLoading = false;
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private sessionService: SessionService) {
  }

  ngOnInit() {
    this.sessionService.isLoading
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        this.isLoading = result;
  });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
