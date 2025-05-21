<?php

namespace BricksLiftAB\API;

use WP_REST_Controller;
use WP_REST_Server;
use WP_Query;
use WP_Error;

/**
 * REST API Controller for A/B Tests.
 */
class TestController extends WP_REST_Controller {

    /**
     * Namespace for the REST API.
     *
     * @var string
     */
    protected $namespace = 'blft-ab/v1';

    /**
     * Rest base for the CPT.
     *
     * @var string
     */
    protected $rest_base = 'tests';

    /**
     * Post type for the controller.
     *
     * @var string
     */
    protected $post_type = 'blft_ab_test';

    /**
     * Initialize hooks.
     */
    public function init() {
        add_action( 'rest_api_init', [ $this, 'register_routes' ] );
        error_log('[BricksLift A/B] TestController initialized, routes to be registered.');
    }

    /**
     * Register the routes for the objects of the controller.
     */
    public function register_routes() {
        register_rest_route(
            $this->namespace,
            '/' . $this->rest_base,
            [
                [
                    'methods'             => WP_REST_Server::READABLE,
                    'callback'            => [ $this, 'get_items' ],
                    'permission_callback' => [ $this, 'get_items_permissions_check' ],
                    'args'                => $this->get_collection_params(),
                ],
                [
                    'methods'             => WP_REST_Server::CREATABLE,
                    'callback'            => [ $this, 'create_item' ],
                    'permission_callback' => [ $this, 'create_item_permissions_check' ],
                    'args'                => $this->get_endpoint_args_for_item_schema( WP_REST_Server::CREATABLE ),
                ],
                'schema' => [ $this, 'get_public_item_schema' ], // Schema for the collection.
            ]
        );

        register_rest_route(
            $this->namespace,
            '/' . $this->rest_base . '/(?P<id>[\d]+)',
            [
                'args'   => [
                    'id' => [
                        'description' => __( 'Unique identifier for the A/B test.', 'brickslift-ab' ),
                        'type'        => 'integer',
                    ],
                ],
                [
                    'methods'             => WP_REST_Server::READABLE,
                    'callback'            => [ $this, 'get_item' ],
                    'permission_callback' => [ $this, 'get_item_permissions_check' ],
                    'args'                => [
                        'context' => $this->get_context_param( [ 'default' => 'view' ] ),
                    ],
                ],
                [
                    'methods'             => WP_REST_Server::EDITABLE,
                    'callback'            => [ $this, 'update_item' ],
                    'permission_callback' => [ $this, 'update_item_permissions_check' ],
                    'args'                => $this->get_endpoint_args_for_item_schema( WP_REST_Server::EDITABLE ),
                ],
                [
                    'methods'             => WP_REST_Server::DELETABLE,
                    'callback'            => [ $this, 'delete_item' ],
                    'permission_callback' => [ $this, 'delete_item_permissions_check' ],
                    'args'                => [
                        'force' => [
                            'type'        => 'boolean',
                            'default'     => false,
                            'description' => __( 'Whether to bypass Trash and force deletion.', 'brickslift-ab' ),
                        ],
                    ],
                ],
                'schema' => [ $this, 'get_public_item_schema' ], // Schema for a single item.
            ]
        );
        error_log('[BricksLift A/B] TestController routes registered.');
    }

    /**
     * Check if a given request has permission to get items.
     *
     * @param \WP_REST_Request $request Full data about the request.
     * @return \WP_Error|bool
     */
    public function get_items_permissions_check( $request ) {
        // TODO: Replace with a more specific capability.
        if ( ! current_user_can( 'manage_options' ) ) {
            return new WP_Error(
                'rest_forbidden',
                esc_html__( 'You do not have permission to view A/B tests.', 'brickslift-ab' ),
                [ 'status' => rest_authorization_required_code() ]
            );
        }
        return true;
    }

    /**
     * Get a collection of items.
     *
     * @param \WP_REST_Request $request Full data about the request.
     * @return \WP_Error|\WP_REST_Response
     */
    public function get_items( $request ) {
        $args = [
            'post_type'      => $this->post_type,
            'posts_per_page' => $request['per_page'],
            'paged'          => $request['page'],
            'orderby'        => $request['orderby'],
            'order'          => $request['order'],
        ];

        if ( ! empty( $request['search'] ) ) {
            $args['s'] = $request['search'];
        }

        $query = new WP_Query( $args );
        $posts = [];

        if ( $query->have_posts() ) {
            foreach ( $query->posts as $post ) {
                $data    = $this->prepare_item_for_response( $post, $request );
                $posts[] = $this->prepare_response_for_collection( $data );
            }
        }

        $total_posts = $query->found_posts;
        $response    = rest_ensure_response( $posts );

        // Set pagination headers.
        $response->header( 'X-WP-Total', (int) $total_posts );
        $max_pages = ceil( $total_posts / (int) $query->query_vars['posts_per_page'] );
        $response->header( 'X-WP-TotalPages', (int) $max_pages );

        return $response;
    }


    /**
     * Check if a given request has permission to get a specific item.
     *
     * @param \WP_REST_Request $request Full data about the request.
     * @return \WP_Error|bool
     */
    public function get_item_permissions_check( $request ) {
        return $this->get_items_permissions_check( $request ); // Same permission for now.
    }

    /**
     * Get one item from the collection.
     *
     * @param \WP_REST_Request $request Full data about the request.
     * @return \WP_Error|\WP_REST_Response
     */
    public function get_item( $request ) {
        $id   = (int) $request['id'];
        $post = get_post( $id );

        if ( ! $post || $post->post_type !== $this->post_type ) {
            return new WP_Error(
                'rest_post_invalid_id',
                __( 'Invalid A/B test ID.', 'brickslift-ab' ),
                [ 'status' => 404 ]
            );
        }

        $data = $this->prepare_item_for_response( $post, $request );
        return rest_ensure_response( $data );
    }

    /**
     * Check if a given request has permission to create an item.
     *
     * @param \WP_REST_Request $request Full data about the request.
     * @return \WP_Error|bool
     */
    public function create_item_permissions_check( $request ) {
         // TODO: Replace with a more specific capability.
        if ( ! current_user_can( 'manage_options' ) ) {
            return new WP_Error(
                'rest_forbidden',
                esc_html__( 'You do not have permission to create A/B tests.', 'brickslift-ab' ),
                [ 'status' => rest_authorization_required_code() ]
            );
        }
        return true;
    }

    /**
     * Create one item from the collection.
     *
     * @param \WP_REST_Request $request Full data about the request.
     * @return \WP_Error|\WP_REST_Response
     */
    public function create_item( $request ) {
        if ( ! empty( $request['id'] ) ) {
            return new WP_Error(
                'rest_post_exists',
                __( 'Cannot create existing A/B test.', 'brickslift-ab' ),
                [ 'status' => 400 ]
            );
        }

        $prepared_post = $this->prepare_item_for_database( $request );
        if ( is_wp_error( $prepared_post ) ) {
            return $prepared_post;
        }

        $post_id = wp_insert_post( $prepared_post, true );

        if ( is_wp_error( $post_id ) ) {
            if ( 'db_insert_error' === $post_id->get_error_code() ) {
                $post_id->add_data( [ 'status' => 500 ] );
            } else {
                $post_id->add_data( [ 'status' => 400 ] );
            }
            return $post_id;
        }
        
        $post = get_post( $post_id );
        $this->update_additional_fields_for_object( $post, $request ); // Save meta

        $request->set_param( 'context', 'edit' );
        $response = $this->prepare_item_for_response( $post, $request );
        $response = rest_ensure_response( $response );
        $response->set_status( 201 );
        $response->header( 'Location', rest_url( sprintf( '%s/%s/%d', $this->namespace, $this->rest_base, $post_id ) ) );

        return $response;
    }

    /**
     * Check if a given request has permission to update a specific item.
     *
     * @param \WP_REST_Request $request Full data about the request.
     * @return \WP_Error|bool
     */
    public function update_item_permissions_check( $request ) {
        return $this->create_item_permissions_check( $request ); // Same permission for now.
    }

    /**
     * Update one item from the collection.
     *
     * @param \WP_REST_Request $request Full data about the request.
     * @return \WP_Error|\WP_REST_Response
     */
    public function update_item( $request ) {
        $id   = (int) $request['id'];
        $post = get_post( $id );

        if ( ! $post || $post->post_type !== $this->post_type ) {
            return new WP_Error(
                'rest_post_invalid_id',
                __( 'Invalid A/B test ID.', 'brickslift-ab' ),
                [ 'status' => 404 ]
            );
        }

        $prepared_post = $this->prepare_item_for_database( $request );
        if ( is_wp_error( $prepared_post ) ) {
            return $prepared_post;
        }

        // Ensure ID is part of the update array.
        $prepared_post['ID'] = $id;

        $post_id = wp_update_post( $prepared_post, true );

        if ( is_wp_error( $post_id ) ) {
            if ( 'db_update_error' === $post_id->get_error_code() ) {
                $post_id->add_data( [ 'status' => 500 ] );
            } else {
                $post_id->add_data( [ 'status' => 400 ] );
            }
            return $post_id;
        }

        $post = get_post( $post_id );
        $this->update_additional_fields_for_object( $post, $request ); // Save meta

        $request->set_param( 'context', 'edit' );
        $response = $this->prepare_item_for_response( $post, $request );
        return rest_ensure_response( $response );
    }

    /**
     * Check if a given request has permission to delete a specific item.
     *
     * @param \WP_REST_Request $request Full data about the request.
     * @return \WP_Error|bool
     */
    public function delete_item_permissions_check( $request ) {
        return $this->create_item_permissions_check( $request ); // Same permission for now.
    }

    /**
     * Delete one item from the collection.
     *
     * @param \WP_REST_Request $request Full data about the request.
     * @return \WP_Error|\WP_REST_Response
     */
    public function delete_item( $request ) {
        $id    = (int) $request['id'];
        $force = (bool) $request['force'];
        $post  = get_post( $id );

        if ( ! $post || $post->post_type !== $this->post_type ) {
            return new WP_Error(
                'rest_post_invalid_id',
                __( 'Invalid A/B test ID.', 'brickslift-ab' ),
                [ 'status' => 404 ]
            );
        }

        $request->set_param( 'context', 'view' ); // Or 'edit' if more data needed before deletion.
        $previous = $this->prepare_item_for_response( $post, $request );

        $result = wp_delete_post( $id, $force );

        if ( ! $result ) {
            return new WP_Error(
                'rest_cannot_delete',
                __( 'The A/B test cannot be deleted.', 'brickslift-ab' ),
                [ 'status' => 500 ]
            );
        }

        $response = new \WP_REST_Response();
        $response->set_data(
            [
                'deleted'  => true,
                'previous' => $previous->get_data(),
            ]
        );
        return $response;
    }

    /**
     * Prepare the item for creation or update.
     *
     * @param \WP_REST_Request $request Request object.
     * @return array|\WP_Error Post data array or WP_Error object.
     */
    protected function prepare_item_for_database( $request ) {
        $prepared_post = [];

        // Post title.
        if ( isset( $request['title'] ) ) {
            if ( is_string( $request['title'] ) ) {
                $prepared_post['post_title'] = $request['title'];
            } elseif ( isset( $request['title']['raw'] ) ) {
                 $prepared_post['post_title'] = $request['title']['raw'];
            }
        }
        
        // Post status - map from our meta to WP post_status if needed, or keep separate.
        // For now, WP post_status will be 'publish' for active tests, 'draft' for drafts.
        // Our '_blft_ab_status' meta will hold 'draft', 'running', 'paused', 'completed'.
        if ( isset( $request['meta'] ) && isset( $request['meta']['_blft_ab_status'] ) ) {
            $blft_status = sanitize_text_field( $request['meta']['_blft_ab_status'] );
            if ( in_array( $blft_status, [ 'running', 'paused', 'completed' ] ) ) {
                $prepared_post['post_status'] = 'publish'; // Active tests are published.
            } else {
                $prepared_post['post_status'] = 'draft'; // Default to draft.
            }
        } elseif ( isset( $request['status'] ) && in_array($request['status'], ['publish', 'draft', 'pending', 'private'] ) ) {
            // If a direct WP status is passed and it's one of the allowed ones for CPT.
            $prepared_post['post_status'] = $request['status'];
        } else {
            // Default status for new posts if not specified.
            if ( empty( $request['id'] ) ) { // Only for new posts
                 $prepared_post['post_status'] = 'draft';
            }
        }


        $prepared_post['post_type'] = $this->post_type;

        return $prepared_post;
    }

    /**
     * Prepare the item for the REST response.
     *
     * @param mixed            $item    WordPress representation of the item.
     * @param \WP_REST_Request $request Request object.
     * @return \WP_REST_Response|\WP_Error Response object on success, or WP_Error object on failure.
     */
    public function prepare_item_for_response( $item, $request ) {
        // $item is a WP_Post object.
        $post_data = [];
        $schema = $this->get_item_schema();

        // Standard WP_Post fields
        if ( isset( $schema['properties']['id'] ) ) {
            $post_data['id'] = $item->ID;
        }
        if ( isset( $schema['properties']['title'] ) ) {
            $post_data['title'] = [
                'raw'      => $item->post_title,
                'rendered' => get_the_title( $item->ID ),
            ];
        }
        if ( isset( $schema['properties']['status'] ) ) {
            $post_data['status'] = $item->post_status; // This is WP post status.
        }
        if ( isset( $schema['properties']['date'] ) ) {
            $post_data['date'] = mysql_to_rfc3339( $item->post_date );
        }
        if ( isset( $schema['properties']['date_gmt'] ) ) {
            $post_data['date_gmt'] = mysql_to_rfc3339( $item->post_date_gmt );
        }
        if ( isset( $schema['properties']['modified'] ) ) {
            $post_data['modified'] = mysql_to_rfc3339( $item->post_modified );
        }
        if ( isset( $schema['properties']['modified_gmt'] ) ) {
            $post_data['modified_gmt'] = mysql_to_rfc3339( $item->post_modified_gmt );
        }


        // Meta fields
        $meta_fields = [ '_blft_ab_status', '_blft_ab_description', '_blft_ab_variants' ];
        $post_data['meta'] = [];
        foreach ( $meta_fields as $meta_key ) {
            if ( isset( $schema['properties']['meta']['properties'][ $meta_key ] ) ) {
                 $meta_value = get_post_meta( $item->ID, $meta_key, true );
                 // Provide default if meta not set, especially for variants array
                if ($meta_key === '_blft_ab_variants' && $meta_value === '') {
                    $meta_value = [];
                } else if ($meta_key === '_blft_ab_status' && $meta_value === '') {
                    $meta_value = 'draft';
                }
                $post_data['meta'][ $meta_key ] = $meta_value;
            }
        }
        
        $context = ! empty( $request['context'] ) ? $request['context'] : 'view';
        $post_data = $this->add_additional_fields_to_object( $post_data, $request );
        $post_data = $this->filter_response_by_context( $post_data, $context );
        
        $response = rest_ensure_response( $post_data );
        $response->add_links( $this->prepare_links( $item ) );

        return $response;
    }

    /**
     * Prepare links for the request.
     *
     * @param \WP_Post $post Post object.
     * @return array Links for the given post.
     */
    protected function prepare_links( $post ) {
        $links = [
            'self'       => [
                'href' => rest_url( sprintf( '%s/%s/%d', $this->namespace, $this->rest_base, $post->ID ) ),
            ],
            'collection' => [
                'href' => rest_url( sprintf( '%s/%s', $this->namespace, $this->rest_base ) ),
            ],
        ];
        return $links;
    }


    /**
     * Update meta fields for the post.
     *
     * @param \WP_Post         $post    The post object.
     * @param \WP_REST_Request $request Request object.
     */
    protected function update_additional_fields_for_object( $post, $request ) {
        $meta_update_allowed = [
            '_blft_ab_status',
            '_blft_ab_description',
            '_blft_ab_variants',
        ];

        if ( isset( $request['meta'] ) && is_array( $request['meta'] ) ) {
            foreach ( $request['meta'] as $key => $value ) {
                if ( in_array( $key, $meta_update_allowed ) ) {
                    // Sanitize based on type defined in CPTManager's register_meta_fields
                    $sanitized_value = $value; // Default to raw value
                    if ( $key === '_blft_ab_status' ) {
                        $sanitized_value = sanitize_text_field( $value );
                        if(!in_array($sanitized_value, ['draft', 'running', 'paused', 'completed'])) {
                            $sanitized_value = 'draft'; // Default if invalid
                        }
                    } elseif ( $key === '_blft_ab_description' ) {
                        $sanitized_value = sanitize_textarea_field( $value );
                    } elseif ( $key === '_blft_ab_variants' ) {
                        // Basic sanitization for variants array
                        if ( is_array( $value ) ) {
                            $sanitized_value = array_map( function( $variant ) {
                                $clean_variant = [];
                                $clean_variant['id'] = isset( $variant['id'] ) ? sanitize_text_field( $variant['id'] ) : wp_generate_uuid4();
                                $clean_variant['name'] = isset( $variant['name'] ) ? sanitize_text_field( $variant['name'] ) : '';
                                $clean_variant['distribution'] = isset( $variant['distribution'] ) ? absint( $variant['distribution'] ) : 0;
                                return $clean_variant;
                            }, $value );
                        } else {
                            $sanitized_value = []; // Default to empty array if not an array
                        }
                    }
                    update_post_meta( $post->ID, $key, $sanitized_value );
                }
            }
        }
    }

    /**
     * Get the query params for collections.
     *
     * @return array
     */
    public function get_collection_params() {
        $params = parent::get_collection_params();
        // Add custom query params if needed
        return $params;
    }

    /**
     * Get the Post's schema, conforming to JSON Schema.
     *
     * @return array
     */
    public function get_item_schema() {
        if ( $this->schema ) {
            return $this->add_additional_fields_schema( $this->schema );
        }

        $schema = [
            '$schema'    => 'http://json-schema.org/draft-04/schema#',
            'title'      => $this->post_type,
            'type'       => 'object',
            'properties' => [
                'id'             => [
                    'description' => __( 'Unique identifier for the A/B test.', 'brickslift-ab' ),
                    'type'        => 'integer',
                    'context'     => [ 'view', 'edit', 'embed' ],
                    'readonly'    => true,
                ],
                'title'          => [
                    'description' => __( 'Title for the A/B test.', 'brickslift-ab' ),
                    'type'        => 'object',
                    'context'     => [ 'view', 'edit', 'embed' ],
                    'properties'  => [
                        'raw'      => [
                            'description' => __( 'Title for the A/B test, as it exists in the database.', 'brickslift-ab' ),
                            'type'        => 'string',
                            'context'     => [ 'edit' ],
                        ],
                        'rendered' => [
                            'description' => __( 'HTML title for the A/B test, transformed for display.', 'brickslift-ab' ),
                            'type'        => 'string',
                            'context'     => [ 'view', 'edit', 'embed' ],
                            'readonly'    => true,
                        ],
                    ],
                    'arg_options' => [ // For creation/update
                        'sanitize_callback' => 'sanitize_text_field',
                    ],
                ],
                'status'         => [ // This is WP post status
                    'description' => __( 'A named status for the A/B test (WP post status).', 'brickslift-ab' ),
                    'type'        => 'string',
                    'enum'        => array_keys( get_post_stati( [ 'internal' => false ] ) ),
                    'context'     => [ 'view', 'edit' ],
                ],
                'date'           => [
                    'description' => __( "The date the A/B test was published, in the site's timezone.", 'brickslift-ab' ),
                    'type'        => 'string',
                    'format'      => 'date-time',
                    'context'     => [ 'view', 'edit', 'embed' ],
                    'readonly'    => true,
                ],
                'date_gmt'       => [
                    'description' => __( 'The date the A/B test was published, as GMT.', 'brickslift-ab' ),
                    'type'        => 'string',
                    'format'      => 'date-time',
                    'context'     => [ 'view', 'edit' ],
                    'readonly'    => true,
                ],
                'modified'       => [
                    'description' => __( "The date the A/B test was last modified, in the site's timezone.", 'brickslift-ab' ),
                    'type'        => 'string',
                    'format'      => 'date-time',
                    'context'     => [ 'view', 'edit' ],
                    'readonly'    => true,
                ],
                'modified_gmt'   => [
                    'description' => __( 'The date the A/B test was last modified, as GMT.', 'brickslift-ab' ),
                    'type'        => 'string',
                    'format'      => 'date-time',
                    'context'     => [ 'view', 'edit' ],
                    'readonly'    => true,
                ],
                'meta'           => [
                    'description' => __( 'Meta fields.', 'brickslift-ab' ),
                    'type'        => 'object',
                    'context'     => [ 'view', 'edit' ],
                    'properties'  => [
                        '_blft_ab_status'      => [
                            'description' => __( 'Status of the A/B test (draft, running, paused, completed).', 'brickslift-ab' ),
                            'type'        => 'string',
                            'enum'        => [ 'draft', 'running', 'paused', 'completed' ],
                            'context'     => [ 'view', 'edit' ],
                            'arg_options' => [
                                'sanitize_callback' => 'sanitize_text_field',
                                'default'           => 'draft',
                            ],
                        ],
                        '_blft_ab_description' => [
                            'description' => __( 'Description of the A/B test.', 'brickslift-ab' ),
                            'type'        => 'string',
                            'context'     => [ 'view', 'edit' ],
                            'arg_options' => [
                                'sanitize_callback' => 'sanitize_textarea_field',
                                'default'           => '',
                            ],
                        ],
                        '_blft_ab_variants'    => [
                            'description' => __( 'Variants for the A/B test.', 'brickslift-ab' ),
                            'type'        => 'array',
                            'context'     => [ 'view', 'edit' ],
                            'items'       => [
                                'type'       => 'object',
                                'properties' => [
                                    'id'           => [ 'type' => 'string', 'description' => 'Unique ID for the variant (e.g., UUID).' ],
                                    'name'         => [ 'type' => 'string', 'description' => 'Name of the variant.' ],
                                    'distribution' => [ 'type' => 'integer', 'description' => 'Distribution percentage for the variant.' ],
                                ],
                            ],
                            'arg_options' => [
                                // Custom sanitization handled in update_additional_fields_for_object
                                'default'           => [],
                            ],
                        ],
                    ],
                ],
            ],
        ];
        $this->schema = $schema;
        return $this->add_additional_fields_schema( $this->schema );
    }
}