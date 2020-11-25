import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import ErrorMessage from './components/error/Error';
import Nav from './components/nav/navbar';
import Loader from './components/Loader';

class App extends Component {
    componentDidMount() {
        const embeddedState = document.getElementById('initialState');
        if (embeddedState) {
            embeddedState.remove();
        }
    }
    render() {
        if (this.props.error) {
            return (
                <div className="app">
                    <ErrorMessage error={this.props.error} />
                </div>
            );
        }
        return (
            <div className="app">
                <Nav handleLogout={() => logUserOut()} user={this.props.user} />
                {this.props.loading ? (
                    <div className="loading">
                        <Loader />
                    </div>
                ) : (
                    this.props.children
                )}
            </div>
        );
    }
}

export const mapStateToProps = state => {
    return {
        error: state.error,
        loading: state.loading
    };
};

export default connect(mapStateToProps)(App);
