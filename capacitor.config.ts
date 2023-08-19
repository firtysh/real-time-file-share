import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'real-time-file-share',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
