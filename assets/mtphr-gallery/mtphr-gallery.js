/**
 * Metaphor Gallery
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
					layoutMode						: 'perfectMasonry',
					column_width					: '100%',
					column_width_768			:	370,
					column_width_992			:	320,
					column_width_1200			: 400,
					slide_ease						: 'easeOutExpo',
					before_change					: function(){},
					after_change					: function(){},
					after_load						: function(){}
				};

				// Add any set options
				if (options) {
					$.extend(settings, options);
				}

				var $gallery = $(this),
						$container = $gallery.find('.mtphr-gallery-content'),
						$filter = $gallery.find('.mtphr-gallery-filter');
						
				$container.children().each( function() {
				
					$(this).animate( {
						opacity: 1
					}, 500, 'linear', function() {
						// Animation complete.
					});
				
				});


				
				/* --------------------------------------------------------- */
				/* !Setup isotope */
				/* --------------------------------------------------------- */
				
				$container.isotope({
					itemSelector: '.mtphr-gallery-block',
				  layoutMode: settings.layoutMode,
				  masonry: {
				    columnWidth: function() {
					    if( Modernizr.mq('(min-width: 1200px)') ) {
						    return settings.column_width_1200;
					    } else if( Modernizr.mq('(min-width: 992px)') ) {
						    return settings.column_width_992;
						  } else if( Modernizr.mq('(min-width: 768px)') ) {
						    return settings.column_width_768;
					    } else {
						    return column_width;
					    }
				    }
				  }
				});
				
				if( $filter.length > 0 ) {
				
					$filter.find('a').click( function(e) {
						
						e.preventDefault();
						
						$('.mtphr-gallery-filter a').removeClass('active');
						$(this).addClass('active');
						
						$container.isotope({ filter: $(this).attr('data-filter') });
					});
				}

			});
		}
	};





	/**
	 * Setup the class
	 *
	 * @since 1.0.0
	 */
	$.fn.mtphr_gallery = function( method ) {

		if ( methods[method] ) {
			return methods[method].apply( this, Array.prototype.slice.call(arguments, 1) );
		} else if ( typeof method === 'object' || !method ) {
			return methods.init.apply( this, arguments );
		} else {
			$.error( 'Method ' +  method + ' does not exist in mtphr_gallery' );
		}
	};

})( jQuery );