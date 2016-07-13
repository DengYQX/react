import React from 'react';
import {
  Route,
  IndexRoute,
} from 'react-router';
import App from './app';
import requireAuthentication from 'utils/requireAuthentication';

export default (
  <Route path="/" component={App}>
    <IndexRoute
      getComponent={(nextState, callback) => {
        require.ensure([], (require) => {
          const View = require('containers/Index/IndexView').default;
          callback(null, View);
        });
      }}
    />
    <Route
      path="truck"
      getComponent={(nextState, callback) => {
        require.ensure([], (require) => {
          const View = require('containers/Dashboard/DashboardView').default;
          callback(null, requireAuthentication(View));
        });
      }}
    />
    <Route
      path="*"
      getComponent={(nextState, callback) => {
        require.ensure([], (require) => {
          callback(null, require('containers/NotFound/index').default);
        });
      }}
    />
  </Route>
);
