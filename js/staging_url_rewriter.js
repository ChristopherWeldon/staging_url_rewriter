"use strict";

/**
 * Listen for "error" from images, rewrite source (src) to use
 * production url.
 *
 */
Drupal.behaviors.exampleModule = {
    attach: function (context, settings) {
        jQuery(document).ready(function () {
                //List of src's already seen, prevents loop where retries always fail
                var replace_with_production_srcs = [];

                /**
                 * Replace a given image source with the production url.
                 * Adds replaced sources to an array, if it has already been
                 * seen before it will be skipped and nothing will be returned
                 * @param production_base_url string production base URL
                 * @param development_base_url string development base URL
                 * @param src string Image source
                 * @returns string | void
                 */
                function replace_with_production_url(production_base_url, development_base_url, src) {
                    //If it looks like the base URL was not a full path prepend the
                    // current host from the window's location property
                    if (development_base_url.charAt(0) == '/'){
                        development_base_url = window.location.host+development_base_url;
                    }
                    if (replace_with_production_srcs.indexOf(src) === -1) {
                        replace_with_production_srcs.push(src);
                        var new_image_src = src.replace(development_base_url, production_base_url);
                        if (Drupal.settings.staging_url_rewriter.is_debug) {
                            console.log("Dev Base URL: ",development_base_url);
                            console.log("Prod Base URL: ",production_base_url);
                            console.log("Got ", src, " returned ", new_image_src);
                            console.log("Add src to seen src: ", replace_with_production_srcs);
                        }
                        return new_image_src;
                    }
                }

                jQuery("img").error(function (errorData) {
                    var new_image_src = replace_with_production_url(Drupal.settings.staging_url_rewriter.production_base_url,
                        Drupal.settings.basePath, jQuery(this).attr('src'));

                    //Some image sources cannot be re-written, skip if nothing was returned
                    if (new_image_src) {
                        if (Drupal.settings.staging_url_rewriter.is_debug) {
                            console.log("Rewriting Source from: ", jQuery(this).attr('src'), " to: ",
                                new_image_src
                            );
                        }
                        jQuery(this).attr("src", new_image_src);
                    }
                });
            }
        );
    }
};
