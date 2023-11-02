import {
  registerApplication,
  start,
  getAppNames,
  navigateToUrl
} from 'single-spa';
import {
  constructApplications,
  constructRoutes,
  constructLayoutEngine
} from 'single-spa-layout';
import microfrontendLayout from './microfrontend-layout.html';
import Emitter from './emitter';

const routes = constructRoutes(microfrontendLayout);

const verifyRoute = (appName: string) => {
  switch (appName) {
    case '@amg/dapp1':
      return '/dapp1';
    case '@amg/dapp2':
      return '/dapp2';
    case '@amg/navbar':
      return '';
  }
};

window.addEventListener('single-spa:app-change', (evt) => {
  const appNames = getAppNames();
  let app = window.location.href.substring(
    window.location.href.lastIndexOf('/') + 1
  );

  if (!appNames.includes(`@amg/${app}`)) {
    navigateToUrl('/');
  }
});

const applications = constructApplications({
  routes,
  loadApp({ name }) {
    return System.import(name);
  }
});

const layoutEngine = constructLayoutEngine({ routes, applications });

applications.forEach((props) =>
  registerApplication({
    ...props,
    customProps: {
      eventEmitter: {
        listenTransaction: (callback) => Emitter.on('transaction', callback),
        listenTransactionResult: (callback) =>
          Emitter.on('transaction-result', callback),
        emitTransaction: (data) => Emitter.emit('transaction', data),
        emitTransactionResult: (data) =>
          Emitter.emit('transaction-result', data)
      }
    }
  })
);
layoutEngine.activate();
start();
