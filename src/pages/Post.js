import propTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { loadPost } from '../actions/posts';
import Ad from '../components/ad/Ad';
import Post from '../components/post/Post';
import Link from '../components/router/Link';
import Loader from '../components/Loader';

export class SinglePost extends Component {
    static propTypes = {
        params: propTypes.shape({
            postId: propTypes.string.isRequired
        })
    };

    componentDidMount() {
        // If we don't have a post yet, dispatch an action to load it
        if (!this.props.post) {
            this.props.actions.loadPost(this.props.router.params.postId);
        }
    }

    render() {
        return (
            <div className="single-post">
               <Link to="/">
                    <div className="back">
                        <i className="fa fa-arrow-left" /> Back
                    </div>
                </Link>
                <Post post={this.props.post} />
                {/* <Ad>
                    url=""
                    imageUrl=""
                </Ad> */}
            </div>
        );
    }
}

export const mapStateToProps = (state, ownProps) => {
    return {
        // try to directly read the post from our store and only fetch all posts in
        // componentDidMount only if we have to
        post: state.posts[ownProps.params.postId]
    };
};
export const mapDispatchToProps = dispatch => {
    return {
        actions: bindActionCreators({ loadPost }, dispatch)
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(SinglePost);