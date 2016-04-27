"use strict";

/**
 * Listen for "error" from images, rewrite source (src) to use
 * production url.
 *
 */
Drupal.behaviors.exampleModule = {
    attach: function () {
        jQuery(document).ready(function () {
            //List of src's already seen, prevents loop where retries always fail
            var replace_with_production_srcs = [];

            /**
             * Replace a given image source with the production url.
             * Adds replaced sources to an array, if it has already been
             * seen before it will be skipped and nothing will be returned
             * @param production_base_url string production base URL
             * @param development_base_url string development base URL
             * @param current_source string Image source
             * @returns string | void
             */
            function replace_with_production_url(production_base_url, development_base_url, current_source) {

                //If it looks like the base URL was not a full path prepend the
                // current host from the window's location property
                if (development_base_url.charAt(0) === '/') {
                    development_base_url = window.location.protocol + "\/\/" +
                        window.location.host +
                        development_base_url;
                }

                //Check for missing "/"
                if (development_base_url.slice(-1) === "/" && production_base_url.slice(-1) !== "/") {
                    production_base_url = production_base_url + "/";
                }

                if (replace_with_production_srcs.indexOf(current_source) === -1) {
                    replace_with_production_srcs.push(current_source);

                    var new_source = current_source.replace(development_base_url, production_base_url);
                    return new_source;
                }
            }

            /**
             * Handle error for image or error images that are found
             * @param $img jQuery object of the image
             */
            function handleImageError($img) {
                var new_image_src = replace_with_production_url(drupalSettings.staging_url_rewriter.staging_url_rewriter_production_url,
                    drupalSettings.path.baseUrl,
                    $img.attr('src'));

                //Some image sources cannot be re-written, skip if nothing was returned
                if (new_image_src) {
                    if (drupalSettings.staging_url_rewriter.staging_url_rewriter_debug) {
                        console.log("Rewriting Source from: ", $img.attr('src'), " to: ",
                            new_image_src
                        );
                    }
                    $img.attr("src", new_image_src);
                }
            }

            //On error assume the image resulted in a 404, try again using the production url
            jQuery("img").on("error", function () {
                handleImageError(jQuery(this));
            });
        });
    }
};