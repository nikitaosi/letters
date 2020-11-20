import propTypes from 'prop-types'; 
import { Component } from 'react';
import invariant from 'invariant';

class Route extends Component {
    static propTypes = {
        path: propTypes.string,
        component: propTypes.oneOfType([propTypes.element, propTypes.func]),
    };

    render() {
        return invariant(false, "<Route> elements are for config only and shouldn't be rendered");
    }
}

export default Route;