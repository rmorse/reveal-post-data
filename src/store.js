/**
 */
/**
 * WordPress dependencies
 */
import apiFetch from '@wordpress/api-fetch';
import { createReduxStore, register } from '@wordpress/data';

export const STORE_NAME = 'reveal-post-data';
const actions = {
	setPostData( id, data ) {
		return {
			type: 'SET_POST_DATA',
			id,
			data,
		};
	},
};

function getFromAPI( path ) {
	return {
		type: 'API_FETCH',
		request: { path, method: 'GET' },
	};
}
const DEFAULT_STATE = {
	posts: {},
};
export const defaults = DEFAULT_STATE;
export const taxonomyStore = createReduxStore( STORE_NAME, {
	reducer( state = DEFAULT_STATE, action ) {
		switch ( action.type ) {
			case 'SET_POST_DATA': {
				return {
					...state,
					posts: { 
						...state.posts,
						[ action.id ]: { ...action.data },
					},
				};
			}
		}
		return state;
	},
	actions,
	selectors: {
		getPostData( state, id ) {
			console.log( 'store | getPostData | ', state );
			return state.posts[ id ] ?? undefined;
		},
	},
	controls: {
		API_FETCH( action ) {
			return apiFetch( action.request );
		},
	},
	resolvers: {
		*getPostData( id ) {
			const path = `/reveal-post-data/v1/post/${ id }`;
			const post = yield getFromAPI( path );
			console.log( 'store | *getPostData | ', post );

			return actions.setPostData( id, post );
		},
	},
} );

register( taxonomyStore );
