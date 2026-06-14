import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.heisel.cotizador',
  appName: 'frontend_cotizador',
  webDir: 'out',

  server: {
    url: 'https://appcotizador-production-f3b0.up.railway.app',
    cleartext: true
  },

  android: {
    allowMixedContent: true
  }
};


export default config;
