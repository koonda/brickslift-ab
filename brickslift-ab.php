<?php
/**
 * Plugin Name: BricksLift A/B
 * Plugin URI: https://brickslift.com/
 * Description: A/B testing for Bricks Builder.
 * Version: 0.1.5
 * Author: Adam Kotala
 * Author URI: https://webypolopate.cz
 * License: GPLv2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: brickslift-ab
 * Domain Path: /languages
 * Requires at least: 5.8
 * Requires PHP: 7.4
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// Define constants.
define( 'BLFT_AB_VERSION', '0.1.0' );
define( 'BLFT_AB_PLUGIN_DIR', plugin_dir_path( __FILE__ ) );
define( 'BLFT_AB_PLUGIN_URL', plugin_dir_url( __FILE__ ) );
define( 'BLFT_AB_PLUGIN_FILE', __FILE__ );

// Include the autoloader.
if ( file_exists( BLFT_AB_PLUGIN_DIR . 'vendor/autoload.php' ) ) {
	require_once BLFT_AB_PLUGIN_DIR . 'vendor/autoload.php';
}

use BricksLiftAB\Core\CPTManager;
use BricksLiftAB\Admin\AdminMenu;
use BricksLiftAB\API\TestController;

/**
 * Initialize the plugin.
 * Loads all the plugin classes and hooks.
 */
function blft_ab_init_plugin() {
    if ( class_exists( CPTManager::class ) ) {
        $cpt_manager = new CPTManager();
        $cpt_manager->init();
    } else {
        error_log('[BricksLift A/B] Error: CPTManager class not found.');
    }

    if ( class_exists( AdminMenu::class ) ) {
        $admin_menu = new AdminMenu();
        $admin_menu->init();
    } else {
        error_log('[BricksLift A/B] Error: AdminMenu class not found.');
    }

    // Initialize API controllers
    if ( class_exists( TestController::class ) ) {
        $test_controller = new TestController();
        $test_controller->init();
    } else {
        error_log('[BricksLift A/B] Error: TestController class not found.');
    }

    error_log('[BricksLift A/B] Plugin core components initialized.');
}
add_action( 'plugins_loaded', 'blft_ab_init_plugin' );


// Activation hook for basic setup, like flushing rewrite rules.
function blft_ab_activate() {
    // Ensure CPT is registered before flushing
    if ( class_exists( CPTManager::class ) ) {
        $cpt_manager = new CPTManager();
        $cpt_manager->register_cpt(); // Call directly for activation context
        $cpt_manager->register_meta_fields(); // Also register meta fields
    }
    flush_rewrite_rules();
    error_log('[BricksLift A/B] Plugin activated and rewrite rules flushed.');
}
register_activation_hook( BLFT_AB_PLUGIN_FILE, 'blft_ab_activate' );

// Deactivation hook.
function blft_ab_deactivate() {
    flush_rewrite_rules();
    error_log('[BricksLift A/B] Plugin deactivated and rewrite rules flushed.');
}
register_deactivation_hook( BLFT_AB_PLUGIN_FILE, 'blft_ab_deactivate' );

// Initial plugin load log
error_log('[BricksLift A/B] Plugin loaded: brickslift-ab.php');

?>