import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
  imports: [ RouterModule, ButtonModule],
  standalone: true,
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  runApp(appName: string) {
    const appUrl = `/${appName}`;
    window.open(appUrl, '_blank'); //
  }
}
