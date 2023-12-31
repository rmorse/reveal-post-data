<?php
/**
 * Plugin Name:       Reveal Post Data
 * Description:       Adds a button in the editor sidebar to show the raw post data.
 * Requires at least: 6.4
 * Requires PHP:      7.0
 * Version:           0.1.3
 * Author:            Ross Morsali
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       reveal-post-data
 */

// Exit if accessed directly
if ( ! defined( 'ABSPATH' ) ) {
	exit; 
}

/**
 * Load admin JS + CSS files.
 */
function reveal_post_data_init() {
	// Register a script.
	$asset = require 'build/index.asset.php';
	wp_register_script(
		'reveal-post-data',
		plugins_url( 'build/index.js', __FILE__ ),
		$asset['dependencies'],
		$asset['version']
	);
	wp_enqueue_script( 'reveal-post-data' );

	// Register style.
	wp_register_style(
		'reveal-post-data',
		plugins_url( 'build/style-index.css', __FILE__ ),
		array(),
		$asset['version']
	);
	wp_enqueue_style( 'reveal-post-data' );
}
add_action( 'enqueue_block_editor_assets', 'reveal_post_data_init' );


/**
 * Add the rest api route for getting the post data.
 */
function reveal_post_data_add_routes() {
	register_rest_route(
		'reveal-post-data/v1',
		'/post/(?P<id>\d+)',
		array(
			'args' => array(
				'id' => array(
					'description'       => __( 'ID of the post.', 'search-filter' ),
					'type'              => 'number',
					'sanitize_callback' => 'absint',
				),
			),
			array(
				'methods'             => \WP_REST_Server::READABLE,
				'callback'            => 'reveal_post_data_get_post_data',
				'permission_callback' => 'reveal_post_data_rest_api_permissions',
			),
		)
	);
}

add_action( 'rest_api_init', 'reveal_post_data_add_routes' );

/**
 * Check if the user has the correct permissions.
 */
function reveal_post_data_rest_api_permissions() {
	return current_user_can( 'manage_options' );
}

/**
 * Get the post data.
 */
function reveal_post_data_get_post_data( WP_REST_Request $request ) {
	$params = $request->get_params();
	$id = $params['id'];
	$post = get_post( $id );
	
	$taxonomies_list = get_object_taxonomies( $post->post_type );
	$taxonomies = array();
	foreach ( $taxonomies_list as $taxonomy_slug ) {
		// Get the taxonomy label.
		$taxonomy_object = get_taxonomy( $taxonomy_slug );
		// Get the terms related to post.
		$terms = wp_get_post_terms( $id, $taxonomy_slug, array( 'fields' => 'names' ) );
		$taxonomies[ $taxonomy_slug ] = array (
			'terms' => $terms,
			'label' => $taxonomy_object->label,
		);
	}

	$post_data = array(
		'post'     => $post,
		'taxonomy' => $taxonomies,
		'meta'     => get_post_meta( $id ),
	);
	return rest_ensure_response( $post_data );
}

