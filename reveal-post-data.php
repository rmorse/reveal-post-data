<?php
/**
 * Plugin Name:       Reveal Post Data
 * Description:       Adds a button in the post sidebar to show the post data.
 * Requires at least: 6.1
 * Requires PHP:      7.0
 * Version:           0.1.0
 * Author:            The WordPress Contributors
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       reveal-post-data
 *
 * @package           create-block
 */

/**
 * Registers the block using the metadata loaded from the `block.json` file.
 * Behind the scenes, it registers also all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://developer.wordpress.org/reference/functions/register_block_type/
 */
function reveal_post_data_init() {
	// register_block_type( __DIR__ . '/build' );
	// Register a script:
	$asset = require 'build/index.asset.php';
	wp_register_script(
		'reveal-post-data',
		plugins_url( 'build/index.js', __FILE__ ),
		$asset['dependencies'],
		$asset['version']
	);
	wp_enqueue_script( 'reveal-post-data' );

	// Register style:
	wp_register_style(
		'reveal-post-data',
		plugins_url( 'build/style-index.css', __FILE__ ),
		array(),
		$asset['version']
	);
	wp_enqueue_style( 'reveal-post-data' );
}
add_action( 'admin_enqueue_scripts', 'reveal_post_data_init' );

function reveal_post_data_add_routes() {
	register_rest_route(
		'reveal-post-data/v1',
		'/post/(?P<id>\d+)',
		array(
			'methods'             => \WP_REST_Server::READABLE,
			'callback'            => 'reveal_post_data_get_post_data',
			'args'                => array(
				'context'      => array(
					'type'              => 'string',
					'required'          => true,
					'sanitize_callback' => 'sanitize_text_field',
				),
				'context_path' => array(
					'type'              => 'string',
					'required'          => true,
					'sanitize_callback' => 'sanitize_text_field',
				),
			),
			'permission_callback' => 'reveal_post_data_rest_api_permissions',
		)
	);
}

add_action( 'rest_api_init', array( $this, 'reveal_post_data_add_routes' ) );

function reveal_post_data_rest_api_permissions() {
	return current_user_can( 'manage_options' );
}

function reveal_post_data_get_post_data() {
	
}

