import initialState from '../constants/initialState';
import * as types from '../constants/types';

export function posts(state = initialState.posts, action) {
    switch (action.type) {
        case types.posts.GET: {
            const { posts } = action;
            let nextState = Object.assign({}, state);
            for (const post of posts) {
                if (!nextState[post.id]) {
                    nextState[post.id] = post;
                }
            }
            return nextState;
        }
        case types.posts.CREATE: {
            const { post } = action;
            let nextState =  Object.assign({}, state);
            if (!nextState[post.id]) {
                nextState[post.id] = post;
            }
            return nextState;
        }
        case types.posts.SHOW: {
            let nextState =  Object.assign({}, state);
            nextState[action.postId].showComments = true; 
            return nextState;
        }
        case types.posts.TOGGLE: {
            let nextState =  Object.assign({}, state);
            nextState[action.postId].showComments = !nextState[action.postId].showComments; 
            return nextState;
        }
        case types.posts.LIKE: {
            let nextState =  Object.assign({}, state);
            const oldPost = nextState[action.post.id];
            nextState[action.post.id] = Object.assign({}, oldPost, action.post);
            return nextState;
        }
        case types.posts.UNLIKE: {
            let nextState =  Object.assign({}, state);
            const oldPost = nextState[action.post.id];
            nextState[action.post.id] = Object.assign({}, oldPost, action.post);
            return nextState;
        }
        case types.comments.CREATE: {
            const { comment } = action;
            let nextState = Object.assign({}, state); 
            nextState[comment.postId].comments.push(comment);
            return state;
        }
        default:
            return state;
    }
}

export function postIds(state = initialState.postIds, action) {
    switch (action.type) {
        case types.posts.GET: {
            const nextPostIds = action.posts.map(post => post.id);
            let nextState = Array.from(state);
            for (const post of nextPostIds) {
                if (!state.includes(post)) {
                    nextState.push(post);
                }
            }
            return nextState;
        }
        case types.posts.CREATE: {
            const { post } = action;
            let nextState = Array.from(state);
            if (!state.includes(post.id)) {
                nextState.push(post.id);
            }
            return nextState;
        }
        default:
            return state;
    }
}