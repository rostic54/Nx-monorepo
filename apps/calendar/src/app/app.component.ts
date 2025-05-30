import { Component, HostBinding } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ThemeToggleComponent } from '@angular-monorepo/ui';
import { ThemeService } from '@angular-monorepo/config';

@Component({
  imports: [RouterModule, ThemeToggleComponent],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  @HostBinding('attr.data-theme') get theme() {
    return this.isDarkTheme ? 'dark' : 'light';
  }
  isDarkTheme = false;

  title = 'calendar';

  constructor(private themeService: ThemeService) {
    this.themeService.darkMode$.subscribe(
      (isDark) => (this.isDarkTheme = isDark)
    );
  }
}
