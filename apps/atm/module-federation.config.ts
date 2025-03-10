import { ModuleFederationConfig } from '@nx/module-federation';

const config: ModuleFederationConfig = {
  name: 'atm',
  exposes: {
    // './Module': 'apps/atm/src/app/app.routes.ts',
    // './Component': 'apps/atm/src/app/app.component.ts',
    './Routes': 'apps/atm/src/app/app.routes.ts',
  },
  // additionalShared: [
  //   { libraryName: '@angular/core', sharedConfig:{ singleton: true, strictVersion: true, requiredVersion: 'auto' }},
  //   { libraryName: '@angular/common', sharedConfig:{ singleton: true, strictVersion: true, requiredVersion: 'auto' }},
  //   { libraryName: '@angular/router', sharedConfig:{ singleton: true, strictVersion: true, requiredVersion: 'auto' }},
  // ]
};

export default config;
