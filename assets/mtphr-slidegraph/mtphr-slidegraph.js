/**
 * Metaphor Slide Graph
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
					slide_speed						: 3000,
					slide_ease						: 'easeOutExpo',
					after_load						: function(){}
				};

				// Add any set options
				if (options) {
					$.extend(settings, options);
				}

				var $graph = $(this),
						$fill = $graph.find('.mtphr-slidegraph-fill'),
						$percent = $graph.find('.mtphr-slidegraph-percent'),
						p = $graph.children('input').val();
						
				// Set the percent margin
				$percent.css('margin-left', '-'+($percent.width()/2)+'px');

				// Animate the objects
				$fill.stop().animate( {
					width: p+'%'
				}, settings.slide_speed*(p/100), settings.slide_ease );

				// Animate the objects
				$percent.stop().animate( {
					left: p+'%'
				}, settings.slide_speed*(p/100), settings.slide_ease);

		    // Trigger the afterLoad callback
        settings.after_load.call(this, $graph);

			});
		}
	};





	/**
	 * Setup the class
	 *
	 * @since 1.0.0
	 */
	$.fn.mtphr_slidegraph = function( method ) {

		if ( methods[method] ) {
			return methods[method].apply( this, Array.prototype.slice.call(arguments, 1) );
		} else if ( typeof method === 'object' || !method ) {
			return methods.init.apply( this, arguments );
		} else {
			$.error( 'Method ' +  method + ' does not exist in mtphr_slidegraph' );
		}
	};

})( jQuery );