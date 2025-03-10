import { Component, Inject, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { APP_CONSTATNTS, APP_HOST_CONFIG, AppList, AppHostConfig } from './utils/constants';

@Component({
  imports: [RouterModule, ButtonModule],
  standalone: true,
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  @ViewChild('remoteContainer', { read: ViewContainerRef }) container!: ViewContainerRef;
  
  safeUrl: SafeResourceUrl;
  appsList: AppList[];

  constructor(
    private sanitizer: DomSanitizer,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    @Inject(APP_CONSTATNTS) private appsConstantList: AppList[],
    @Inject(APP_HOST_CONFIG) private appLocalhostConfig: AppHostConfig[]
  ) {
    this.appsList = this.appsConstantList;
  }

  runApp(appName: string) {
    const appHostDetails = this.getAppByName(appName);
    if (!appHostDetails) return;

    this.router.navigate([`/${appName}`]);
    // this.container.clear(); // Clear previous remote component

    //   // Dynamically import the remote module using ES6 import()
    //   const module =  import(`${remoteName}/Component`);

    //   // Determine the component to load based on remoteName
    //   const componentClass =
    //     remoteName === 'calendar'
    //       ? module.CalendarEntryComponent
    //       : module.AtmEntryComponent;

    //   if (!componentClass) {
    //     throw new Error(`No valid component found for ${remoteName}`);
    //   }

    //   // Create and render the component in the container
    //   this.container.createComponent(componentClass);

    // window.open(appHostDetails.apiUrl, '_blank');
  }

  runHere(appName: string) {
    const appHostDetails = this.getAppByName(appName);
    if (!appHostDetails) return;

    this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      appHostDetails.apiUrl
    );

  }

  private getAppByName(appName: string): AppHostConfig | undefined {
    return this.appLocalhostConfig.find((app: AppHostConfig) => app.appName === appName);
  }
}
