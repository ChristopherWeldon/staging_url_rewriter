<?php

  /**
   * @file
   * Contains \Drupal\staging_url_rewriter\Form\StagingUrlRewriterForm.
   */

  namespace Drupal\staging_url_rewriter\Form;

  use Drupal\Core\Form\ConfigFormBase;
  use Drupal\Core\Form\FormStateInterface;
  use Drupal\Core\Render\Element;

  class StagingUrlRewriterForm extends ConfigFormBase {

    /**
     * {@inheritdoc}
     */
    public function getFormId() {
      return 'staging_url_rewriter_form';
    }

    /**
     * {@inheritdoc}
     */
    public function submitForm(array &$form, FormStateInterface $form_state) {
      $config = $this->config('staging_url_rewriter.settings');

      foreach (Element::children($form) as $variable) {
        $config->set($variable, $form_state->getValue($form[$variable]['#parents']));
      }
      $config->save();

      if (method_exists($this, '_submitForm')) {
        $this->_submitForm($form, $form_state);
      }

      parent::submitForm($form, $form_state);
    }

    /**
     * {@inheritdoc}
     */
    protected function getEditableConfigNames() {
      return ['staging_url_rewriter.settings'];
    }

    /**
     * @param array                                $form
     * @param \Drupal\Core\Form\FormStateInterface $form_state
     *
     * @return array
     */
    public function buildForm(array $form, \Drupal\Core\Form\FormStateInterface $form_state) {
      $settings = _staging_url_rewriter_get_settings();

      $isDebug = $settings['staging_url_rewriter_debug'];

      if ($isDebug) {
        dpm($settings, "Settings");
      }

      $form['staging_url_rewriter_production_url'] = [
        '#type'          => 'textfield',
        '#title'         => t('Production URL'),
        '#description'   => t('This is the base URL of the production site to try if images result in an error on this site.'),
        '#default_value' => $settings['staging_url_rewriter_production_url'],
        '#size'          => 100,
        '#maxlength'     => 150,
        '#required'      => TRUE,
      ];

      $form['staging_url_rewriter_debug'] = [
        '#type'          => 'checkbox',
        '#title'         => t('Debug Mode'),
        '#default_value' => $settings['staging_url_rewriter_debug'],
        '#description'   => t('Enable debug mode and display technical information on front end'),
        '#required'      => FALSE,
      ];

      return parent::buildForm($form, $form_state);
    }

  }
