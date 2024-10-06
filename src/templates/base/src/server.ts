import App from './app';
import {
  IndexRoute,
  UserAuthRoute,
  AdminRoute,
  UserRoute,

} from './core/routes';
import { validateEnv } from './core/utils/validateEnv';

validateEnv();

const app = new App([
  new UserAuthRoute(),
  new AdminRoute(), new UserRoute(), new IndexRoute(),
]);

app.listen()


