import thunk from 'redux-thunk';
import { createStore, compose, applyMiddleware } from 'redux';

import rootReducer from '../reducers/root';
import crashReporting from '../middleware/crash';
import { isServer } from '../utils/environment';

let store;
export default function configureStore(initialState) {
    if (store && !isServer()) {
        return store;
    }
    const hydratedState =
        !isServer() && process.env.NODE_ENV === 'production'
            ? window.__INITIAL_STATE__
            : initialState;
    store = createStore(
        rootReducer,
        hydratedState,
        compose(applyMiddleware(thunk, crashReporting))
    );
    return store;
}
