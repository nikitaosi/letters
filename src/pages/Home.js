import React, { Component } from 'react';
import parseLinkHeader from 'parse-link-header';
import { connect } from 'react-redux';
import orderBy from 'lodash/orderBy';
import { createError } from '../actions/error';
import { createNewPost, getPostsForPage } from '../actions/posts';
import { showComments } from '../actions/comments';
import { bindActionCreators } from 'redux';

import * as API from '../shared/http';
import Ad from '../components/ad/Ad';
import Post from '../components/post/Post';
import CreatePost from '../components/post/Create';
import Welcome from '../components/welcome/Welcome';

export class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            posts: [],
            error: null,
            endpoint: `${process.env
                .ENDPOINT}/posts?_page=1&_sort=date&_order=DESC&_embed=comments&_expand=user&_embed=likes`
        };

        this.getPosts = this.getPosts.bind(this);
        this.createNewPost = this.createNewPost.bind(this);
    }

    componentDidMount() {
        this.props.actions.getPostsForPage();
    }   
    componentDidCatch(err, info) {
        this.props.actions.createError(err, info);
    }

    getPosts() {
        API.fetchPosts(this.state.endpoint)
            .then(res => {
                return res.json().then(posts => {
                    const links = parseLinkHeader(res.headers.get('Link'));
                    if (links.next) {
                        this.setState(prevState => ({
                            posts: orderBy(prevState.posts.concat(posts), 'date', 'desc'),
                            endpoint: links.next.url,
                        }));
                    }; //#TODO write handling of empty page
                });
            })
            .catch(err => {
                this.setState(() => ({ error: err }));
            });
    }

    createNewPost(post) {
        return API.createPost(post)
            .then(res => res.json())
            .then(newPost => {
                this.setState(prevState => {
                    return {
                        posts: orderBy(prevState.posts.concat(newPost), 
                            'date', 'desc')
                    };
                });
            })
            .catch(err => {
                this.setState(() => ({ error: err }));
            });
    }

    render() {
        return (
                <div className="home">
                    {/* <Welcome key="welcome" /> */}
                    <div>
                    <CreatePost onSubmit={this.props.actions.createNewPost} />
                        {this.props.posts && (
                            <div className="posts">
                                {this.props.posts.map(post => (
                                    <Post 
                                        key={post.id} 
                                        post={post} 
                                        openCommentsDrawer={this.props.actions.showComments}
                                    />
                                ))}
                            </div>
                        )}
                        <button className="block" onClick={this.props.actions.getNextPageOfPosts}>
                            Load more posts
                        </button>
                    </div>
                    {/* <div>
                        <Ad
                            url="https://ifelse.io/book"
                            imageUrl="/static/assets/ads/ria.png"
                        />
                        <Ad
                            url="https://ifelse.io/book"
                            imageUrl="/static/assets/ads/orly.jpg"
                        />
                    </div> */}
                </div>
        )
        }
}

export const mapDispatchToProps = dispatch => {
    return { 
        actions: bindActionCreators(
            {
                createNewPost,
                getPostsForPage,
                showComments,
                createError,
                getNextPageOfPosts: getPostsForPage.bind(this, 'next')
            }, 
            dispatch
        )
    };
};

export const mapStateToProps = state => {
    const posts = orderBy(state.postIds.map(postId => state.posts[postId]), 'date', 'desc');
    return { posts };
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);