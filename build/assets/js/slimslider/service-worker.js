{
  assets: [
    './main.js',
  ]
}
import {precacheAndRoute} from 'workbox-precaching';

precacheAndRoute(self.__WB_MANIFEST);