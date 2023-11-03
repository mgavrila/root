import { registerApplication, start } from 'single-spa';
import {
  constructApplications,
  constructRoutes,
  constructLayoutEngine
} from 'single-spa-layout';
import microfrontendLayout from './microfrontend-layout.html';
import Emitter from './emitter';

const routes = constructRoutes(microfrontendLayout);
const emitter = new Emitter();

const applications = constructApplications({
  routes,
  loadApp({ name }) {
    return System.import(name);
  }
});

const layoutEngine = constructLayoutEngine({ routes, applications });

applications.forEach((props) => {
  emitter.registerEvent(props.name);

  let emitterProps: Record<string, any> = {
    listen: (callback) => emitter.on(props.name, callback),
    emit: (data) => emitter.emit(props.name, data)
  };

  if (props.name === '@amg/navbar') {
    emitterProps = {
      listenToAll: (callback) => emitter.listenToAll(callback),
      emitToEvent: (eventName, data) => emitter.emitToEvent(eventName, data)
    };
  }

  registerApplication({
    ...props,
    customProps: {
      eventEmitter: emitterProps
    }
  });
});

System.import('@amg/styleguide').then(() => {
  // Activate the layout engine once the styleguide CSS is loaded
  layoutEngine.activate();
  start();
});
