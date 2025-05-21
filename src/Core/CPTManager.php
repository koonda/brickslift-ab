<?php

namespace BricksLiftAB\Core;

/**
 * Manages Custom Post Types.
 */
class CPTManager {

    /**
     * Initialize hooks.
     */
    public function init() {
        add_action( 'init', [ $this, 'register_cpt' ] );
        add_action( 'init', [ $this, 'register_meta_fields' ] );
    }

    /**
     * Register Custom Post Type: blft_ab_test.
     */
    public function register_cpt() {
        $labels = [
            'name'                  => _x( 'A/B Tests', 'Post type general name', 'brickslift-ab' ),
            'singular_name'         => _x( 'A/B Test', 'Post type singular name', 'brickslift-ab' ),
            'menu_name'             => _x( 'BricksLift A/B', 'Admin Menu text', 'brickslift-ab' ),
            'name_admin_bar'        => _x( 'A/B Test', 'Add New on Toolbar', 'brickslift-ab' ),
            'add_new'               => __( 'Add New', 'brickslift-ab' ),
            'add_new_item'          => __( 'Add New A/B Test', 'brickslift-ab' ),
            'new_item'              => __( 'New A/B Test', 'brickslift-ab' ),
            'edit_item'             => __( 'Edit A/B Test', 'brickslift-ab' ),
            'view_item'             => __( 'View A/B Test', 'brickslift-ab' ),
            'all_items'             => __( 'All A/B Tests', 'brickslift-ab' ),
            'search_items'          => __( 'Search A/B Tests', 'brickslift-ab' ),
            'parent_item_colon'     => __( 'Parent A/B Tests:', 'brickslift-ab' ),
            'not_found'             => __( 'No A/B tests found.', 'brickslift-ab' ),
            'not_found_in_trash'    => __( 'No A/B tests found in Trash.', 'brickslift-ab' ),
            'featured_image'        => _x( 'A/B Test Cover Image', 'Overrides the “Featured Image” phrase for this post type. Added in 4.3', 'brickslift-ab' ),
            'set_featured_image'    => _x( 'Set cover image', 'Overrides the “Set featured image” phrase for this post type. Added in 4.3', 'brickslift-ab' ),
            'remove_featured_image' => _x( 'Remove cover image', 'Overrides the “Remove featured image” phrase for this post type. Added in 4.3', 'brickslift-ab' ),
            'use_featured_image'    => _x( 'Use as cover image', 'Overrides the “Use as featured image” phrase for this post type. Added in 4.3', 'brickslift-ab' ),
            'archives'              => _x( 'A/B Test archives', 'The post type archive label used in nav menus. Default “Post Archives”. Added in 4.4', 'brickslift-ab' ),
            'insert_into_item'      => _x( 'Insert into A/B test', 'Overrides the “Insert into post”/”Insert into page” phrase (used when inserting media into a post). Added in 4.4', 'brickslift-ab' ),
            'uploaded_to_this_item' => _x( 'Uploaded to this A/B test', 'Overrides the “Uploaded to this post”/”Uploaded to this page” phrase (used when viewing media attached to a post). Added in 4.4', 'brickslift-ab' ),
            'filter_items_list'     => _x( 'Filter A/B tests list', 'Screen reader text for the filter links heading on the post type listing screen. Default “Filter posts list”/”Filter pages list”. Added in 4.4', 'brickslift-ab' ),
            'items_list_navigation' => _x( 'A/B tests list navigation', 'Screen reader text for the pagination heading on the post type listing screen. Default “Posts list navigation”/”Pages list navigation”. Added in 4.4', 'brickslift-ab' ),
            'items_list'            => _x( 'A/B tests list', 'Screen reader text for the items list heading on the post type listing screen. Default “Posts list”/”Pages list”. Added in 4.4', 'brickslift-ab' ),
        ];

        $args = [
            'labels'                => $labels,
            'public'                => false,
            'publicly_queryable'    => false,
            'show_ui'               => true, // Keep true to attach React app to its admin page.
            'show_in_menu'          => false, // Will be managed by a custom top-level menu.
            'query_var'             => true,
            'rewrite'               => [ 'slug' => 'blft_ab_test' ],
            'capability_type'       => 'post', // Consider custom capabilities later.
            'map_meta_cap'          => true,
            'has_archive'           => false,
            'hierarchical'          => false,
            'menu_position'         => null,
            'supports'              => [ 'title' ], // 'title' is for internal test name.
            'show_in_rest'          => true,
            'rest_base'             => 'blft_ab_tests',
            'rest_controller_class' => 'WP_REST_Posts_Controller',
        ];

        register_post_type( 'blft_ab_test', $args );
        error_log( '[BricksLift A/B] CPT "blft_ab_test" registration attempted by CPTManager.' );
    }

    /**
     * Register meta fields for blft_ab_test CPT.
     */
    public function register_meta_fields() {
        $meta_fields = [
            '_blft_ab_status'      => [
                'type'              => 'string',
                'description'       => __( 'Status of the A/B test (draft, running, paused, completed).', 'brickslift-ab' ),
                'single'            => true,
                'show_in_rest'      => true,
                'default'           => 'draft',
                'sanitize_callback' => 'sanitize_text_field',
            ],
            '_blft_ab_description' => [
                'type'              => 'string',
                'description'       => __( 'Description of the A/B test.', 'brickslift-ab' ),
                'single'            => true,
                'show_in_rest'      => true,
                'default'           => '',
                'sanitize_callback' => 'sanitize_textarea_field',
            ],
            '_blft_ab_variants'    => [
                'type'              => 'array',
                'description'       => __( 'Variants for the A/B test.', 'brickslift-ab' ),
                'single'            => true,
                'show_in_rest'      => [
                    'schema' => [
                        'type'  => 'array',
                        'items' => [
                            'type'       => 'object',
                            'properties' => [
                                'id'           => [ 'type' => 'string' ],
                                'name'         => [ 'type' => 'string' ],
                                'distribution' => [ 'type' => 'integer' ],
                            ],
                        ],
                    ],
                ],
                'default'           => [],
                // Custom sanitization will be needed in REST controller for array of objects.
            ],
            // Goal Type
            '_blft_ab_goal_type' => [
                'type' => 'string',
                'description' => __('The type of conversion goal.', 'brickslift-ab'),
                'single' => true,
                'show_in_rest' => true,
                'default' => '', // e.g., 'page_visit'
                'sanitize_callback' => 'sanitize_text_field',
            ],
            // Page Visit Goal
            '_blft_ab_goal_pv_url' => [
                'type' => 'string',
                'description' => __('Target URL for page visit goal.', 'brickslift-ab'),
                'single' => true,
                'show_in_rest' => true,
                'default' => '',
                'sanitize_callback' => 'esc_url_raw',
            ],
            '_blft_ab_goal_pv_url_match_type' => [
                'type' => 'string',
                'description' => __('URL match type for page visit goal (exact, contains, starts_with, ends_with).', 'brickslift-ab'),
                'single' => true,
                'show_in_rest' => true,
                'default' => 'exact',
                'sanitize_callback' => 'sanitize_key',
            ],
            // Selector Click Goal
            '_blft_ab_goal_sc_element_selector' => [
                'type' => 'string',
                'description' => __('CSS selector for click goal.', 'brickslift-ab'),
                'single' => true,
                'show_in_rest' => true,
                'default' => '',
                'sanitize_callback' => 'sanitize_text_field', // Consider more specific selector sanitization if needed
            ],
            // Form Submission Goal
            '_blft_ab_goal_fs_form_selector' => [
                'type' => 'string',
                'description' => __('CSS selector for the form.', 'brickslift-ab'),
                'single' => true,
                'show_in_rest' => true,
                'default' => '',
                'sanitize_callback' => 'sanitize_text_field',
            ],
            '_blft_ab_goal_fs_trigger' => [
                'type' => 'string',
                'description' => __('Trigger for form submission goal (submit_event, thank_you_page, success_class).', 'brickslift-ab'),
                'single' => true,
                'show_in_rest' => true,
                'default' => 'submit_event',
                'sanitize_callback' => 'sanitize_key',
            ],
            '_blft_ab_goal_fs_thank_you_url' => [
                'type' => 'string',
                'description' => __('Thank you page URL for form submission goal.', 'brickslift-ab'),
                'single' => true,
                'show_in_rest' => true,
                'default' => '',
                'sanitize_callback' => 'esc_url_raw',
            ],
            '_blft_ab_goal_fs_success_class' => [
                'type' => 'string',
                'description' => __('Success class added to form for form submission goal.', 'brickslift-ab'),
                'single' => true,
                'show_in_rest' => true,
                'default' => '',
                'sanitize_callback' => 'sanitize_html_class',
            ],
            // WooCommerce Add to Cart Goal
            '_blft_ab_goal_wc_any_product' => [
                'type' => 'boolean',
                'description' => __('Track add to cart for any product.', 'brickslift-ab'),
                'single' => true,
                'show_in_rest' => true,
                'default' => true,
                'sanitize_callback' => 'rest_sanitize_boolean',
            ],
            '_blft_ab_goal_wc_product_id' => [
                'type' => 'integer',
                'description' => __('Specific product ID for WooCommerce add to cart goal.', 'brickslift-ab'),
                'single' => true,
                'show_in_rest' => true,
                'default' => 0,
                'sanitize_callback' => 'absint',
            ],
            // Scroll Depth Goal
            '_blft_ab_goal_sd_percentage' => [
                'type' => 'integer',
                'description' => __('Scroll depth percentage.', 'brickslift-ab'),
                'single' => true,
                'show_in_rest' => true,
                'default' => 0,
                'sanitize_callback' => 'absint',
            ],
            // Time on Page Goal
            '_blft_ab_goal_top_seconds' => [
                'type' => 'integer',
                'description' => __('Time on page in seconds.', 'brickslift-ab'),
                'single' => true,
                'show_in_rest' => true,
                'default' => 0,
                'sanitize_callback' => 'absint',
            ],
            // Custom JS Event Goal
            '_blft_ab_goal_cje_event_name' => [
                'type' => 'string',
                'description' => __('Custom JavaScript event name.', 'brickslift-ab'),
                'single' => true,
                'show_in_rest' => true,
                'default' => '',
                'sanitize_callback' => 'sanitize_text_field',
            ],
        ];

        foreach ( $meta_fields as $meta_key => $args ) {
            register_post_meta( 'blft_ab_test', $meta_key, $args );
        }
        error_log( '[BricksLift A/B] Meta fields registration for "blft_ab_test" attempted by CPTManager.' );
    }
}