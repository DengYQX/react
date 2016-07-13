import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import Root from './containers/Root/Root';
import configureStore from './store/configureStore';
import { browserHistory, hashHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import { DEBUG } from 'config';
import 'react-date-picker/base.css';
import 'react-date-picker/index.css';
import 'font-awesome/css/font-awesome.css';
import 'burnish-styles/_bootstrap.scss';
import 'animate.css/animate.css';
import 'styles/main.scss';

// 生产环境不需要/#/的url,需要在nginix 做配置
const target = document.getElementById('root');
const historyMode = DEBUG ? hashHistory : browserHistory;
const store = configureStore(window.INITIAL_STATE, historyMode);
const history = syncHistoryWithStore(historyMode, store);

const node = (
  <Root store={store} history={history} />
);

ReactDOM.render(node, target);
