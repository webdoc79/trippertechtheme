/**
 * Metaphor Slider
 * Date: 6/25/2014
 *
 * @author Metaphor Creations
 * @version 1.0.0
 *
 **/

( function($) {

	// Enabled strict mode
	"use strict";

	var methods = {

		init : function( options ) {

			return this.each( function(){

				// Create default options
				var settings = {
					slide_speed						: 500,
					slide_ease						: 'easeOutExpo',
					before_change					: function(){},
					after_change					: function(){},
					after_load						: function(){}
				};

				// Add any set options
				if (options) {
					$.extend(settings, options);
				}

				var $slider = $(this),
						$content_wrapper = $slider.find('.mtphr-slider-content-wrapper'),
						$content = $slider.find('.mtphr-slider-content'),
						$navigation = $slider.find('.mtphr-slider-navigation'),
						$prev = $navigation.children('.mtphr-slider-prev'),
						$next = $navigation.children('.mtphr-slider-next'),
						posts = $slider.find( '.mtphr-slider-block' );

				// Useful variables.
        var vars = {
        	slider_width					: $slider.outerWidth(),
        	slider_position				: 0,
        	slider_current				: 0,
        	slide_count						: 0,
	        post_width						: 0,
	        post_margin						: 0,
	        total_posts						: posts.length,
	        content_width					: 0,
	        min_position					: 0
        };

				// Add the vars
				$slider.data('slider:vars', vars);
				
				// Set vars and content width
				mtphr_slider_set_content_width();

				$slider.find( '.mtphr-slider-block' ).each( function(index) {
					$(this).delay(index*200).fadeIn();
				});

				// Remove the nav if less than 2 posts
				if( vars.num_posts < 2 ) {
					$navigation.remove();
				}
				
				// Set the slide count
				mtphr_slider_slide_count();

				// Position the slider
				mtphr_slider_position();

				/**
				 * Find the closest post to the left
				 *
				 * @since 2.0.9
				 */
				function mtphr_slider_position( button ) {

					var position = vars.slider_position;
					if (button == 'prev') {
						vars.slider_current = vars.slider_current-vars.slide_count;
						if( vars.slider_current < 0 ) vars.slider_current = 0;
						position = -(vars.slider_current*(vars.post_width+vars.post_margin));
					}
					if (button == 'next') {
						vars.slider_current = vars.slider_current+vars.slide_count;
						if( vars.slider_current > posts.length-1 ) vars.slider_current = posts.length-1;
						position = -(vars.slider_current*(vars.post_width+vars.post_margin));
					}

					// Enable the buttons
					$prev.removeClass('disabled');
					$next.removeClass('disabled');

					if( position >= 0 ) {
						position = 0;
						$prev.addClass('disabled');
					}
					if( position < vars.min_position ) {
						position = vars.min_position;
						$next.addClass('disabled');
					}
					if( vars.content_width < vars.slider_width ) {
						position = 0;
						$prev.addClass('disabled');
						$next.addClass('disabled');
					}

					// Resave the var
					vars.slider_position = position;

					$content.stop().animate( {
						marginLeft: position+'px'
					}, settings.slide_speed, 'easeOutExpo', function() {
						// Animation complete.
					});

					// Return the position
					return position;
				}
				
				/* --------------------------------------------------------- */
				/* !Set the content width */
				/* --------------------------------------------------------- */
				
				function mtphr_slider_set_content_width() {
					
					// Save vars
					vars.post_width = $(posts[0]).outerWidth();
	        vars.post_margin = parseInt($(posts[0]).css('marginRight').substr(0, $(posts[0]).css('marginRight').length-2)),
					vars.content_width = (vars.total_posts*(vars.post_width+vars.post_margin));
					vars.min_position = vars.slider_width-(vars.content_width-vars.post_margin);
					if( vars.min_position > 0 ) {
						vars.min_position = 0;
					}
	
					// Set the content width
					$content.css('width', vars.content_width+'px');
				}
				
				/**
				 * Set the slide count
				 *
				 * @since 2.0.9
				 */
				function mtphr_slider_slide_count() {
					vars.slide_count = Math.floor( (vars.slider_width+vars.post_margin)/(vars.post_width+vars.post_margin) );
					if( vars.slide_count < 1 ) {
						vars.slide_count = 1;
					}
				}

				/**
				 * Previous button click
				 *
				 * @since 1.0.0
				 */
				$prev.click( function(e) {
					e.preventDefault();
					mtphr_slider_position( 'prev' );
				});

				/**
				 * Next button click
				 *
				 * @since 1.0.0
				 */
				$next.click( function(e) {
					e.preventDefault();
					mtphr_slider_position( 'next' );
				});

				/**
				 * Mobile swipe
				 *
				 * @since 2.0.6
				 */
				$content_wrapper.swipe( {
					triggerOnTouchEnd : true,
	        swipeLeft: function(event, distance, duration, fingerCount, fingerData) {
	          mtphr_slider_position( 'next' );
	        },
	        swipeRight: function(event, distance, duration, fingerCount, fingerData) {
	          mtphr_slider_position( 'prev' );
	        }
	      }); 



		    /**
		     * Resize listener
		     * Reset the ticker width
		     *
		     * @since 1.0.0
		     */
		    $(window).resize( function() {
		    
		    	// Set the content width
		    	mtphr_slider_set_content_width();

			    vars.slider_width = $slider.outerWidth();
			    vars.min_position = vars.slider_width-(vars.content_width-vars.post_margin);
			    if( vars.min_position > 0 ) {
						vars.min_position = 0;
					}

			    // Reset the position
			    mtphr_slider_slide_count();
			    mtphr_slider_position();
		    });




		    // Trigger the afterLoad callback
        settings.after_load.call(this, $slider);

			});
		}
	};





	/**
	 * Setup the class
	 *
	 * @since 1.0.0
	 */
	$.fn.mtphr_slider = function( method ) {

		if ( methods[method] ) {
			return methods[method].apply( this, Array.prototype.slice.call(arguments, 1) );
		} else if ( typeof method === 'object' || !method ) {
			return methods.init.apply( this, arguments );
		} else {
			$.error( 'Method ' +  method + ' does not exist in mtphr_slider' );
		}
	};

})( jQuery );