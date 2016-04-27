<?php

  namespace Drupal\staging_url_rewriter;

  class StagingUrlRewriter {

    /**
     * Remove update. and staging. from current from the current URL
     *
     * @return string
     */
    public static function gefDefaultProductionUrl() {
      $default_production_url = \Drupal::service('path.current')->getPath();
      $default_production_url = str_replace(
        "update.",
        "",
        $default_production_url
      );
      $default_production_url = str_replace(
        "staging.",
        "",
        $default_production_url
      );

      return $default_production_url;
    }

    public static function isAdminPath() {
      return \Drupal::service('router.admin_context')->isAdminRoute();
    }

    /**
     * Get the settings
     *
     * @array of
     *        settings[staging_url_rewriter_production_url,staging_url_rewriter_debug]
     */
    public static function getSettings() {
      $settings = array();

      $settings['staging_url_rewriter_production_url'] = \Drupal::config('staging_url_rewriter.settings')
        ->get('staging_url_rewriter_production_url');

      if(empty($settings['staging_url_rewriter_production_url'])){
        $settings['staging_url_rewriter_production_url'] = StagingUrlRewriter::gefDefaultProductionUrl();
      }

      $settings['staging_url_rewriter_debug'] = \Drupal::config('staging_url_rewriter.settings')
        ->get('staging_url_rewriter_debug');

      return $settings;
    }
  }