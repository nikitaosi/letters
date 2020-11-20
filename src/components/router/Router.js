import propTypes from 'prop-types';

import React, { Component } from 'react';
import enroute from 'enroute';
import invariant from 'invariant'; 

class Router extends Component {
    static propTypes = {
        children: propTypes.object,
        location: propTypes.string.isRequired
    };

    constructor(props){
        super(props);

        this.routes = {};

        this.addRoutes(props.children);
        this.router = enroute(this.routes);
    }

    addRoutes(routes, parent) {
        React.Children.forEach(routes, route => this.addRoute(route, parent));
    }

    cleanPath(path) {
        return path.replace(/\/\//g, '/');
    }

    normalizeRoute(path, parent) {
        if (path[0] === '/') {
            return path;
        }
        if (!parent) {
            return path;
        }
        return `${parent.route}/${path}`;
    }

    addRoute(element, parent) {
        const {component, path, children} = element.props;

        invariant(component, `Route ${path} is missing the "path" property`);
        invariant(typeof path === 'string', `Route ${path} is not a string`);

        const render = (params, renderProps) => {
            const finalProps = Object.assign({ params }, this.props, renderProps);
            const children = React.createElement(component, finalProps);
            return parent ? parent.render(params, { children }) : children;
        };

        const route = this.normalizeRoute(path, parent);

        if (children) {
            this.addRoutes(children, { route, render });
        }

        this.routes[this.cleanPath(route)] = render;
    }

    render() {
        const { location } = this.props
        invariant(location, '<Router/> needs a location to work');
        return this.router(location);
    }
}

export default Router;