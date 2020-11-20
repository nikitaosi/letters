import propTypes from 'prop-types';
import React, { Component } from 'react';

import Ad from '../components/ad/Ad';
import Post from '../components/post/Post';

export class SinglePost extends Component {
    static propTypes = {
        params: propTypes.shape({
            postId: propTypes.string.isRequired
        })
    };
    render() {
        return (
            <div className="single-post">
                <Post id={this.props.params.postId} />
                {/* <Ad>
                    url=""
                    imageUrl=""
                </Ad> */}
            </div>
        );
    }
}

export default SinglePost;