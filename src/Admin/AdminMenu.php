<?php

namespace BricksLiftAB\Admin;

/**
 * Manages Admin Menu and Pages.
 */
class AdminMenu {

    const PARENT_SLUG = 'brickslift-ab';

    /**
     * Initialize hooks.
     */
    public function init() {
        add_action( 'admin_menu', [ $this, 'add_admin_menu' ] );
        add_action( 'admin_enqueue_scripts', [ $this, 'enqueue_admin_scripts' ] );
    }

    /**
     * Add admin menu pages.
     */
    public function add_admin_menu() {
        add_menu_page(
            __( 'BricksLift A/B', 'brickslift-ab' ),
            __( 'BricksLift A/B', 'brickslift-ab' ),
            'manage_options', // TODO: Define a more specific capability later.
            self::PARENT_SLUG,
            [ $this, 'render_react_app_page' ],
            'dashicons-controls-repeat',
            25 // Position
        );

        // Submenu item that points to the same React app, for consistency.
        // The React router will handle displaying the "All Tests" view.
        add_submenu_page(
            self::PARENT_SLUG,
            __( 'A/B Tests', 'brickslift-ab' ),
            __( 'A/B Tests', 'brickslift-ab' ),
            'manage_options', // TODO: Define a more specific capability later.
            self::PARENT_SLUG, // Parent slug makes it load the same page.
            [ $this, 'render_react_app_page' ]
        );

        // This is where the native CPT list table would be, we hide it by
        // setting 'show_in_menu' to false in CPT registration and manage UI via React.
        // If we still wanted a link to the CPT edit screen for some reason (e.g. quick debug):
        // add_submenu_page(
        //     self::PARENT_SLUG,
        //     __( 'Native Test List (Debug)', 'brickslift-ab' ),
        //     __( 'Native Test List (Debug)', 'brickslift-ab' ),
        //     'manage_options',
        //     'edit.php?post_type=blft_ab_test'
        // );

        error_log( '[BricksLift A/B] Admin menu setup attempted by AdminMenu.' );
    }

    /**
     * Render the HTML container for the React app.
     */
    public function render_react_app_page() {
        echo '<div id="blft-ab-admin-app"></div>';
        error_log( '[BricksLift A/B] React app container rendered by AdminMenu.' );
    }

    /**
     * Enqueue scripts and styles for the admin React app.
     *
     * @param string $hook_suffix The current admin page.
     */
    public function enqueue_admin_scripts( $hook_suffix ) {
        // Only load on our specific admin page.
        // The hook_suffix for a top-level page is 'toplevel_page_{menu_slug}'.
        // For submenu pages, it's '{parent_slug}_page_{submenu_slug}' or based on the top-level if it's the first item.
        if ( 'toplevel_page_' . self::PARENT_SLUG !== $hook_suffix &&
             strpos($hook_suffix, 'brickslift-ab_page_') === false ) { // Catches subpages if we add more distinct ones later
            // A more robust check for our specific page:
            $current_screen = get_current_screen();
            if ( ! $current_screen || $current_screen->id !== 'toplevel_page_' . self::PARENT_SLUG ) {
                 return;
            }
        }
        
        $script_asset_path = BLFT_AB_PLUGIN_DIR . 'admin-app/build/index.asset.php';
        if ( ! file_exists( $script_asset_path ) ) {
            error_log( '[BricksLift A/B] Admin App Error: Script asset file not found at ' . $script_asset_path );
            wp_die( 'BricksLift A/B Error: Admin app asset file not found. Please run `npm run build` in the admin-app directory.' );
            return;
        }
        $script_asset = require( $script_asset_path );

        wp_enqueue_script(
            'brickslift-ab-admin-app',
            BLFT_AB_PLUGIN_URL . 'admin-app/build/index.js',
            $script_asset['dependencies'],
            $script_asset['version'],
            true // In footer
        );

        wp_enqueue_style(
            'brickslift-ab-admin-app-style',
            BLFT_AB_PLUGIN_URL . 'admin-app/build/index.css',
            [], // Dependencies like wp-components if needed
            $script_asset['version']
        );

        // Localize script with data for React app
        wp_localize_script(
            'brickslift-ab-admin-app',
            'blftAbAdmin', // Global JS object name
            [
                'apiUrl' => esc_url_raw( rest_url( 'blft-ab/v1/' ) ),
                'nonce'  => wp_create_nonce( 'wp_rest' ), // WP REST API Nonce
                // Add other necessary data here
            ]
        );
        error_log( '[BricksLift A/B] Admin scripts and styles enqueued by AdminMenu for hook: ' . $hook_suffix );
    }
}