**Project Onboarding & Development Instructions for "BricksLift A/B" WordPress Plugin**

**To the Orchestrator AI Agent:**

Please review the following project blueprint for the "BricksLift A/B" WordPress plugin. Your first task is to have an **Architect AI Agent** thoroughly analyze this Markdown (`.md`) document and generate a detailed, step-by-step development plan. This plan should break down the project into manageable phases and tasks, suitable for an iterative development process. Each task should clearly define its objectives, key components to be built, and potential challenges.

Following the architect's plan, a **Developer AI Agent** will be responsible for implementing the features. Throughout the development process, the Developer AI Agent must:

1.  **Incorporate Robust Debugging:**
    *   Implement comprehensive `error_log()` statements (or use a dedicated logging utility if one is built, e.g., `BricksLiftAB\Utils\Logger::log('Descriptive message', $data_to_inspect);`) at critical junctures in PHP.
    *   Utilize `console.log()`, `console.warn()`, and `console.error()` extensively in JavaScript and React components for tracing data flow, state changes, and potential issues.
    *   Employ `try...catch` blocks for operations that might fail (e.g., API calls, localStorage access).
    *   Ensure clear error messages are provided to the user or logged for easier debugging.
2.  **Adhere to Coding Standards:** Follow WordPress Coding Standards for PHP, JS, and CSS. Ensure PHP code is compatible with PHP 7.4+.
3.  **Prioritize Security:** Implement security best practices (nonces, sanitization, escaping, capability checks) from the outset for every feature.
4.  **Focus on Performance:** Write efficient code and database queries. Consider performance implications of every decision.
5.  **Iterative GitHub Commits & Releases:**
    *   After completing each significant feature or sub-task as defined by the Architect's plan, commit the changes to a Git repository.
    *   Commit messages should be clear and descriptive (e.g., "Feat: Implement CPT registration for blft_ab_test").
    *   After a set of related features forming a stable version (e.g., v0.1.0 - Core Setup Complete, v0.2.0 - Basic Test Creation UI), create a tagged release in the GitHub repository (e.g., `git tag v0.1.0`, `git push origin v0.1.0`). This will serve as a reference point.
6.  **Maintain Modularity and Reusability:** Design components and functions to be as modular and reusable as possible.

---

**BricksLift A/B - Plugin Blueprint (v1.1)**

**(For the Architect AI Agent to process and create a development plan from)**

## 1. Introduction and Plugin Goals

*   **Plugin Name:** BricksLift A/B (Note: Previously "BricksLift A/B Testing", shortened for simplicity if preferred, or keep longer name for clarity. Let's assume **BricksLift A/B** for internal development and potentially a more descriptive name for public release.)
*   **Primary Goals:** To provide Bricks Builder users with an intuitive and powerful tool for A/B testing elements, sections, and entire Bricks templates directly within the Bricks editor. The plugin will enable:
    *   Easy creation and management of A/B tests.
    *   Definition of multiple content variants.
    *   Flexible setup of conversion goals.
    *   Collection of impression and conversion data.
    *   Display of clear statistics and basic evaluation of variant performance.
    *   Definition of conditions for automatic test termination.
    *   Provision of recommendations for implementing the winning variant.
    *   Ensuring GDPR compliance and minimal impact on website performance.
*   **Target Audience:** WordPress users employing Bricks Builder who aim to optimize their websites and increase conversions (marketers, designers, e-shop owners, agencies).

## 2. Architecture and Technology

*   **Backend:** WordPress, PHP 7.4+
    *   **Test Management:** Custom Post Type (CPT).
        *   **CPT Slug:** `blft_ab_test` (Note: Changed from `blft_test` to be more descriptive)
    *   **Admin Interface:** Fully React-rendered using **MUI (Material-UI)** for components and styling.
        *   **Admin Pages (All React-rendered, no native WP CPT screens):**
            1.  **Dashboard:** Overview of all tests, key aggregate statistics.
            2.  **A/B Tests List:** A dedicated page listing all created A/B tests with sorting, filtering, and quick actions.
            3.  **Create/Edit A/B Test:** A multi-step or tabbed form for defining all test parameters (details, variants, goals, duration, GDPR).
    *   **Communication:** WordPress REST API (for React admin), WordPress AJAX API (for frontend event tracking).
*   **Frontend (Bricks Integration):** Custom Bricks element.
    *   **Element Slug:** `blft_ab_wrapper`
*   **Frontend (Display & Tracking Logic):** Vanilla JavaScript (ES6+).
*   **Database:** WordPress DB (`$wpdb`), custom tables for tracking and aggregated statistics.
*   **Styling:** CSS3 (BEM methodology for custom styles, MUI handles its own styling).
*   **PHP Autoloading:** Composer PSR-4.
*   **Default Language:** English.

## 3. Naming Conventions (Based on BricksLift A/B)

*   **PHP Namespace:** `BricksLiftAB`
*   **Primary Prefix:** `blft_ab_` (e.g., `blft_ab_get_option()`, `_blft_ab_meta_key`)
    *   *Note: This prefix is slightly longer but more explicit for "BricksLift A/B". If `blft_` is strongly preferred for brevity, it can be used, but `blft_ab_` is recommended for clarity given the plugin name.*
*   **PHP Classes:** `CamelCase` within the namespace (e.g., `BricksLiftAB\Core\CPTManager`)
*   **CPT Slug:** `blft_ab_test`
*   **Database Tables:** `{wp_prefix}blft_ab_tracking`, `{wp_prefix}blft_ab_stats_aggregated`
*   **Meta Keys:** `_blft_ab_status`, etc.
*   **JavaScript Global Object:** `BricksLiftAB.Frontend`
*   **HTML Data Attributes:** `data-blft-ab-test-id`, `data-blft-ab-variant-id`
*   **CSS Classes (custom):** `blft-ab-kebab-case-class` (e.g., `blft-ab-variant-hidden`)
*   **REST API Namespace:** `blft-ab/v1`
*   **PHP Constants:** `BLFT_AB_UPPER_SNAKE_CASE` (e.g., `BLFT_AB_VERSION`)

## 4. Data Model

### 4.1. Custom Post Type: `blft_ab_test`
*   **Supports:** `title` (used internally, not necessarily shown in React UI if a custom title field is preferred)
*   **Meta Fields (prefixed with `_blft_ab_`):**
    *   `status`: (string) `draft`, `running`, `paused`, `completed`
    *   `description`: (text)
    *   `variants`: (JSON array) `[{"id": "var_uuid1", "name": "Variant A", "distribution": 50}, ...]`
    *   `goal_type`: (string) `page_visit`, `selector_click`, `form_submission`, `wc_add_to_cart`, `scroll_depth`, `time_on_page`, `custom_js_event`.
    *   **Goal-specific meta fields:**
        *   `goal_pv_url`, `goal_pv_url_match_type`
        *   `goal_sc_element_selector`
        *   `goal_fs_form_selector`, `goal_fs_trigger`, `goal_fs_thank_you_url`, `goal_fs_success_class`
        *   `goal_wc_any_product`, `goal_wc_product_id`
        *   `goal_sd_percentage`
        *   `goal_top_seconds`
        *   `goal_cje_event_name`
    *   `run_tracking_globally`: (boolean)
    *   `gdpr_consent_required`: (boolean)
    *   `gdpr_consent_mechanism`: (string) `none`, `cookie_key`.
    *   `gdpr_consent_key_name`, `gdpr_consent_key_value`
    *   `test_duration_type`: (string) `manual`, `time_based`, `impression_based`, `conversion_based`.
    *   `test_duration_days`, `test_duration_target_impressions`, `test_duration_target_conversions`
    *   `test_start_date`, `test_actual_end_date` (datetimes, auto-set)
    *   `test_winner_variant_id`: (string)

### 4.2. Custom Database Tables
*   **`{wp_prefix}blft_ab_tracking`**: `id`, `test_id` (maps to `blft_ab_test` Post ID), `variant_id`, `visitor_hash`, `event_type`, `event_timestamp`, `page_url`.
*   **`{wp_prefix}blft_ab_stats_aggregated`**: `test_id`, `variant_id`, `stat_date`, `impressions_count`, `conversions_count`.

## 5. Key Functionalities (To be planned step-by-step by Architect AI)

*   **Admin Interface (React with MUI):**
    *   **Dashboard Page:** Overview, aggregate stats.
    *   **A/B Tests List Page:** Table of all tests (using MUI DataGrid or similar), sortable, filterable, with actions (edit, pause, archive, view stats).
    *   **Create/Edit A/B Test Page:** Multi-step or tabbed MUI form for all test parameters.
        *   Step 1: Basic Info (Name, Description).
        *   Step 2: Variants (Define names, distribution percentages).
        *   Step 3: Conversion Goals (Select type, configure specific goal parameters).
        *   Step 4: Settings (Duration, GDPR).
    *   **Individual Test Statistics Page:** Detailed stats for a single test (as outlined in previous detailed prompts - CR, Lift, Trend Chart, Data Table, Winner Indication).
*   **Bricks Builder Integration:** Custom element `blft_ab_wrapper`.
*   **Frontend JavaScript Logic:** Variant selection, display, impression/conversion tracking.
*   **Lifecycle Management:** Test start, pause, (auto)completion, winner evaluation (basic).
*   **Data Processing:** Cron for statistics aggregation.

## 6. Structure (High-Level - Architect AI to detail further based on this)

*   `/brickslift-ab/` (plugin root)
    *   `brickslift-ab.php` (main plugin file)
    *   `composer.json`
    *   `/src/` (PHP classes with `BricksLiftAB` namespace)
        *   `Core/`, `Admin/`, `Frontend/`, `Integrations/Bricks/`, `API/`, `Utils/`
    *   `/admin-app/` (React admin application using MUI)
        *   `/src/` (React components, pages, services, MUI theme setup)
        *   `package.json`, `webpack.config.js` (or use `@wordpress/scripts` if compatible with MUI setup)
    *   `/frontend-assets/` (JS and CSS for the public-facing site)
    *   `/languages/`
    *   `/vendor/`

## 7. Development Process Notes for Developer AI

*   **MUI Integration:** Set up a custom MUI theme for the React admin app to ensure a consistent look and feel. Utilize MUI components extensively (e.g., `Box`, `Container`, `Grid`, `Typography`, `Button`, `TextField`, `Select`, `Table`, `DataGrid`, `Tabs`, `Stepper`, `Charts` - consider MUI X Charts or a library like Recharts/Chart.js wrapped in MUI).
*   **REST API for React Admin:** All data for the React admin (listing tests, fetching a single test for editing, fetching stats) should come from custom WP REST API endpoints. The CPT `blft_ab_test` itself will not be directly managed via its native WordPress admin screens.
*   **State Management in React:** Choose an appropriate state management solution (React Context API for simpler cases, Zustand/Redux for more complex global state if needed).
*   **Error Boundaries:** Implement React Error Boundaries to catch and handle errors gracefully within the admin UI.
*   **Accessibility (a11y):** Ensure the React admin UI built with MUI is accessible.

**Final Instruction to Orchestrator AI:**
Please initiate the process by having the Architect AI generate the detailed, phased development plan. Ensure the plan emphasizes iterative development, frequent debugging, and regular GitHub releases as milestones.