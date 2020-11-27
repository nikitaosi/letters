import React from 'react';
import { hydrate } from 'react-dom';
import { Provider } from 'react-redux';

import { Router, browserHistory } from 'react-router';
import configureStore from './store/store';
import initialReduxState from './constants/initialState';
import { routes } from './routes';

import './shared/crash';
import './shared/service-worker';
import './shared/vendor';
import './styles/styles.scss';

const store = configureStore(initialReduxState);

hydrate(
    <Provider store={store}>
        <Router history={browserHistory} routes={routes} />
    </Provider>,
    document.getElementById('app')
);
