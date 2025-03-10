import { ModuleFederationConfig } from '@nx/module-federation';

const config: ModuleFederationConfig = {
  name: 'calendar',
  exposes: {
    './Routes': 'apps/calendar/src/app/app.routes.ts',
  }
};

export default config;
