/**
 * Metaphor Rotator
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
					rotate_type									: 'fade',
					auto_rotate									: 0,
					delay												: 10,
					rotate_pause								: 0,
					rotate_speed								: 10,
					rotate_ease									: 'easeOutExpo',
					nav_reverse									: 0,
					event_prefix								: 'mtphr_rotator',
					resource_container_class		: '.mtphr-rotator-resource-container',
					resource_class							: '.mtphr-rotator-resource',
					nav_prev_class							: '.mtphr-rotator-nav-prev',
					nav_next_class							: '.mtphr-rotator-nav-next',
					nav_controls_class					: '.mtphr-rotator-navigation',
					before_change								: function(){},
					after_change								: function(){},
					after_load									: function(){}
				};

				// Add any set options
				if (options) {
					$.extend(settings, options);
				}
				
				// Useful variables. Play carefully.
        var vars = {
	        count						: 0,
	        previous				: null,
	        current					: 0,
	        next						: null,
	        reverse					: 0,
	        running					: 0,
	        speed						: settings.rotate_speed,
	        ease						: settings.rotate_ease,
        };

				// Create variables
				var $rotator_container = $(this),
						$rotator = $(this).find(settings.resource_container_class),
						$nav_prev = $(this).find(settings.nav_prev_class),
						$nav_next = $(this).find(settings.nav_next_class),
						$nav_controls = $(this).find(settings.nav_controls_class),
						gallery_width = $rotator.width(),
						gallery_height = 0,
						resources = [],
						gallery_delay,
						rotate_adjustment = settings.rotate_type,
						after_change_timeout,
						gallery_pause = false,
						touch_down_x,
						touch_down_y,
						touch_link = '',
						touch_target = '';

				// Add the vars
				$rotator.data('mtphr:vars', vars);

				// Save the resource count & total
				vars.count = $rotator.find(settings.resource_class).length;

				// Start the first resource
				if( vars.count > 0 ) {
					mtphr_rotator_rotator_setup();
		    }




		    /**
		     * Setup the rotator
		     *
		     * @since 1.0.4
		     */
		    function mtphr_rotator_rotator_setup() {

		    	// Loop through the resource items
					$rotator.find(settings.resource_class).each( function(index) {

						// Add the resource to the array
						resources.push($(this));

					});
					
					// Setup the resource
		    	mtphr_rotator_setup_resource( 0 );

					// Resize the resources
					mtphr_rotator_resize_resources();

					// Find the rotation type and create the dynamic rotation init function
					var rotate_init_name = 'mtphr_rotator_'+settings.rotate_type+'_init';
					var mtphr_rotator_type_init = eval('('+rotate_init_name+')');
					mtphr_rotator_type_init( $rotator, resources, parseInt(settings.rotate_speed*100), settings.rotate_ease );
					mtphr_rotator_update_links( 0 );

					// Start the rotator rotate
					if( settings.auto_rotate ) {
						mtphr_rotator_delay();
					}

					// Clear the loop on mouse hover
					$rotator.hover(
					  function () {
					  	if( settings.auto_rotate && settings.rotate_pause ) {
					    	clearInterval( gallery_delay );
					    }
					  },
					  function () {
					  	if( settings.auto_rotate && settings.rotate_pause ) {
					    	mtphr_rotator_delay();
					    }
					  }
					);

					// Set the init class after the first load
					setTimeout(function() {
						$rotator_container.addClass('mtphr-rotator-init');
					}, parseInt(settings.rotate_speed*100) );
		    }

		    /**
		     * Create the resourceer rotator loop
		     *
		     * @since 1.0.0
		     */
		    function mtphr_rotator_delay() {

			    // Start the resourceer timer
			    clearInterval( gallery_delay );
					gallery_delay = setInterval( function() {

						// Find the new resource
			    	var new_resource = parseInt(vars.current + 1);
						if( new_resource >= vars.count ) {
							new_resource = 0;
						}

						mtphr_rotator_update( new_resource );

			    }, parseInt(settings.delay*1000));
		    }

		    /**
		     * Create the rotator update call
		     *
		     * @since 1.0.0
		     */
		    function mtphr_rotator_update( new_resource ) {

		    	// Clear the interval
		    	if( settings.auto_rotate ) {
			    	clearInterval( gallery_delay );
			    }
			    
			    // Set the next variable
			    vars.next = new_resource;

		    	// Trigger the before change callback
          settings.before_change.call( $rotator_container, $rotator );
          $rotator_container.trigger(settings.event_prefix+'_before_change_single', [vars, resources]);
          $('body').trigger(settings.event_prefix+'_before_change', [$rotator_container, vars, resources]);

          // Set the running variable
          vars.running = 1;

			    // Rotate the current resource out
					mtphr_rotator_out( new_resource );

					// Rotate the new resource in
					mtphr_rotator_in( new_resource );

					// Set the previous & current resource
					vars.previous = vars.current;
					vars.current = new_resource;

					// Trigger the after change callback
					after_change_timeout = setTimeout( function() {
					
						mtphr_rotator_resize();
					
						// Clear the next variable
						vars.next = null;

						settings.after_change.call( $rotator_container, $rotator );
						$rotator_container.trigger(settings.event_prefix+'_after_change_single', [vars, resources]);
						$('body').trigger(settings.event_prefix+'_after_change', [$rotator_container, vars, resources]);

						// Reset the rotator type & variables
						rotate_adjustment = settings.rotate_type;
						vars.reverse = 0;
						vars.running = 0;

						// Restart the interval
						if( settings.auto_rotate ) {
				    	mtphr_rotator_delay();
				    }

					}, parseInt(settings.rotate_speed*100) );
		    }

		    /**
		     * Update the control links
		     *
		     * @since 1.0.0
		     */
		    function mtphr_rotator_update_links( new_resource ) {

			    if( $nav_controls ) {
          	$nav_controls.children('a').removeClass('active');
          	$nav_controls.children('a[href="#'+new_resource+'"]').addClass('active');
          }
		    }
		    
		    /* --------------------------------------------------------- */
		    /* !Setup the resources - 2.0.0 */
		    /* --------------------------------------------------------- */
		    
		    function mtphr_rotator_setup_resource( new_resource ) {
			    
			    var $resource = $(resources[new_resource]);
		    	if( $resource.hasClass('mtphr-rotator-resource-video') && $resource.find('.mejs-container').length == 0  ) {
			    	$resource.children('video').mediaelementplayer({
							width: '100%',
							height: '100%',
							videoVolume: 'horizontal'
						});
		    	} else if( $resource.hasClass('mtphr-rotator-resource-audio') && $resource.find('.mejs-container').length == 0  ) {
			    	$resource.children('audio').mediaelementplayer({
							width: '100%',
							height: '100%'
						});
		    	} else if( $resource.hasClass('mtphr-rotator-resource-youtube') || $resource.hasClass('mtphr-rotator-resource-vimeo')  ) { 		
		    		var w = $rotator.width(),
								h = w/16*9;
						$resource.find('iframe').width(w).height(h);
		    	}
		    }

		    /**
		     * Create the rotator in function calls
		     *
		     * @since 1.0.0
		     */
		    function mtphr_rotator_in( new_resource ) {

		    	// Update the links
		    	mtphr_rotator_update_links( new_resource );
		    	
		    	// Setup the resource
		    	mtphr_rotator_setup_resource( new_resource );

			    // Find the rotation type and create the dynamic rotation in function
					var rotate_in_name = 'mtphr_rotator_'+rotate_adjustment+'_in';
					var mtphr_rotator_type_in = eval('('+rotate_in_name+')');
					mtphr_rotator_type_in( $rotator, $(resources[new_resource]), $(resources[vars.current]), parseInt(settings.rotate_speed*100), settings.rotate_ease );
		    }

		    /**
		     * Create the rotator out function calls
		     *
		     * @since 1.0.0
		     */
		    function mtphr_rotator_out( new_resource ) {

			    // Find the rotation type and create the dynamic rotation out function
					var rotate_out_name = 'mtphr_rotator_'+rotate_adjustment+'_out';
					var mtphr_rotator_type_out = eval('('+rotate_out_name+')');
					mtphr_rotator_type_out( $rotator, $(resources[vars.current]), $(resources[new_resource]), parseInt(settings.rotate_speed*100), settings.rotate_ease );
		    }

		    /**
		     * Resize the rotator resources
		     *
		     * @since 1.0.0
		     */
		    function mtphr_rotator_resize_resources() {

			    for( var i=0; i<vars.count; i++ ) {
				    $(resources[i]).width( gallery_width+'px' );
			    }
			    $rotator.css('height', $(resources[vars.current]).outerHeight(true)+'px');
		    }




			  // Initialize the resources and resourceer
				function mtphr_rotator_fade_init( $rotator, resources, speed, ease ) {

					// Get the first resource
					var $resource = resources[0];

					// Find the width of the resource
					var w = $rotator.width();
					var h = $resource.outerHeight(true);

					// Set the height of the resources
					$rotator.css( 'height', h+'px' );

					// Set the initial position of the width & make sure it's visible
					$resource.css( 'left', 0 );
					$resource.show();

					// If there are any images, reset height after loading
					if( $resource.find('img').length > 0 ) {

						$resource.find('img').each( function(index) {

							jQuery(this).load( function() {

								// Find the height of the resource
								var h = $resource.outerHeight(true);

								// Set the height of the resourceer
								$rotator.css( 'height', h+'px' );
								
								$rotator_container.trigger(settings.event_prefix+'_after_resize', [$rotator_container, vars, resources]);
							});
						});
					}
			  }

				// Show the new resource
				function mtphr_rotator_fade_in( $rotator, $resource, $prev, speed, ease ) {
			    $resource.fadeIn( speed );

			    var h = $resource.outerHeight(true);

					// Resize the resourceer
					$rotator.stop(true,true).animate( {
						height: h+'px'
					}, speed, ease, function() {
					});
			  }

			  // Hide the old resource
			  function mtphr_rotator_fade_out( $rotator, $resource, $next, speed, ease ) {
			    $resource.stop(true,true).fadeOut( speed, function() {
				    $rotator.prepend($resource);
			    });
			  }




			  // Initialize the resources and resourceer
				function mtphr_rotator_slide_left_init( $rotator, resources, speed, ease ) {

					// Get the first resource
					var $resource = resources[0];

					// Find the dimensions of the resource
					var w = $rotator.width();
					var h = $resource.outerHeight(true);

					// Set the height of the resources
					$rotator.css( 'height', h+'px' );

					// Set the initial position of the width & make sure it's visible
					$resource.css( 'left', 0 );
					$resource.show();

					// If there are any images, reset height after loading
					if( $resource.find('img').length > 0 ) {

						$resource.find('img').each( function(index) {

							jQuery(this).load( function() {

								// Find the height of the resource
								var h = $resource.outerHeight(true);

								// Set the height of the resourceer
								$rotator.css( 'height', h+'px' );
							});
						});
					}
			  }

				// Show the new resource
				function mtphr_rotator_slide_left_in( $rotator, $resource, $prev, speed, ease ) {

					// Find the dimensions of the resource
					var w = $rotator.width();
					var h = $resource.outerHeight(true);

					// Set the initial position of the width & make sure it's visible
					$resource.css( 'left', w+'px' );
					$resource.show();

					// Resize the resourceer
					$rotator.stop(true,true).animate( {
						height: h+'px'
					}, speed, ease, function() {
					});

					// Slide the resource in
					$resource.stop(true,true).animate( {
						left: '0'
					}, speed, ease, function() {
					});
			  }

			  // Hide the old resource
			  function mtphr_rotator_slide_left_out( $rotator, $resource, $next, speed, ease ) {

			    // Find the dimensions of the resource
					var w = $rotator.width();
					var h = $resource.outerHeight(true);

					// Slide the resource in
					$resource.stop(true,true).animate( {
						left: '-'+w+'px'
					}, speed, ease, function() {
						// Hide the resource
						$resource.hide();
						$rotator.prepend($resource);
					});
			  }




			  // Initialize the resources and resourceer
				function mtphr_rotator_slide_right_init( $rotator, resources, speed, ease ) {

					// Get the first resource
					var $resource = resources[0];

					// Find the dimensions of the resource
					var w = $rotator.width();
					var h = $resource.outerHeight(true);

					// Set the height of the resourceer
					$rotator.css( 'height', h+'px' );

					// Set the initial position of the width & make sure it's visible
					$resource.css( 'left', 0 );
					$resource.show();

					// If there are any images, reset height after loading
					if( $resource.find('img').length > 0 ) {

						$resource.find('img').each( function(index) {

							jQuery(this).load( function() {

								// Find the height of the resource
								var h = $resource.outerHeight(true);

								// Set the height of the resourceer
								$rotator.css( 'height', h+'px' );
							});
						});
					}
			  }

				// Show the new resource
				function mtphr_rotator_slide_right_in( $rotator, $resource, $prev, speed, ease ) {

					// Find the dimensions of the resource
					var w = $rotator.width();
					var h = $resource.outerHeight(true);

					// Set the initial position of the width & make sure it's visible
					$resource.css( 'left', '-'+w+'px' );
					$resource.show();

					// Resize the resourceer
					$rotator.stop(true,true).animate( {
						height: h+'px'
					}, speed, ease, function() {
					});

					// Slide the resource in
					$resource.stop(true,true).animate( {
						left: '0'
					}, speed, ease, function() {
					});
			  }

			  // Hide the old resource
			  function mtphr_rotator_slide_right_out( $rotator, $resource, $next, speed, ease ) {

			    // Find the dimensions of the resource
					var w = $rotator.width();
					var h = $resource.outerHeight(true);

					// Slide the resource in
					$resource.stop(true,true).animate( {
						left: w+'px'
					}, speed, ease, function() {
						// Hide the resource
						$resource.hide();
						$rotator.prepend($resource);
					});
			  }




			  // Initialize the resources and resourceer
				function mtphr_rotator_slide_down_init( $rotator, resources, speed, ease ) {

					// Get the first resource
					var $resource = resources[0];

					// Find the height of the resource
					var h = $resource.outerHeight(true);

					// Set the height of the resourceer
					$rotator.css( 'height', h+'px' );

					// Set the initial position of the width & make sure it's visible
					$resource.css( 'top', 0 );
					$resource.show();

					// If there are any images, reset height after loading
					if( $resource.find('img').length > 0 ) {

						$resource.find('img').each( function(index) {

							jQuery(this).load( function() {

								// Find the height of the resource
								var h = $resource.outerHeight(true);

								// Set the height of the resourceer
								$rotator.css( 'height', h+'px' );
							});
						});
					}
			  }

				// Show the new resource
				function mtphr_rotator_slide_down_in( $rotator, $resource, $prev, speed, ease ) {

					// Find the height of the resource
					var h = $resource.outerHeight(true);

					// Set the initial position of the width & make sure it's visible
					$resource.css( 'top', '-'+h+'px' );
					$resource.show();

					// Resize the resourceer
					$rotator.stop(true,true).animate( {
						height: h+'px'
					}, speed, ease, function() {
					});

					// Slide the resource in
					$resource.stop(true,true).animate( {
						top: '0'
					}, speed, ease, function() {
					});
			  }

			  // Hide the old resource
			  function mtphr_rotator_slide_down_out( $rotator, $resource, $next, speed, ease ) {

			    // Find the height of the next resource
					var h = $next.outerHeight(true);

					// Slide the resource in
					$resource.stop(true,true).animate( {
						top: h+'px'
					}, speed, ease, function() {
						// Hide the resource
						$resource.hide();
						$rotator.prepend($resource);
					});
			  }




			  // Initialize the resources and resourceer
				function mtphr_rotator_slide_up_init( $rotator, resources, speed, ease ) {

					// Get the first resource
					var $resource = resources[0];

					// Find the height of the resource
					var h = $resource.outerHeight(true);

					// Set the height of the resourceer
					$rotator.css( 'height', h+'px' );

					// Set the initial position of the width & make sure it's visible
					$resource.css( 'top', 0 );
					$resource.show();

					// If there are any images, reset height after loading
					if( $resource.find('img').length > 0 ) {

						$resource.find('img').each( function(index) {

							jQuery(this).load( function() {

								// Find the height of the resource
								var h = $resource.outerHeight(true);

								// Set the height of the resourceer
								$rotator.css( 'height', h+'px' );
							});
						});
					}
			  }

				// Show the new resource
				function mtphr_rotator_slide_up_in( $rotator, $resource, $prev, speed, ease ) {

					// Find the height of the resource
					var h = $resource.outerHeight(true);

					// Set the initial position of the width & make sure it's visible
					$resource.css( 'top', $prev.outerHeight(true)+'px' );
					$resource.show();

					// Resize the resourceer
					$rotator.stop(true,true).animate( {
						height: h+'px'
					}, speed, ease, function() {
					});

					// Slide the resource in
					$resource.stop(true,true).animate( {
						top: '0'
					}, speed, ease, function() {
					});
			  }

			  // Hide the old resource
			  function mtphr_rotator_slide_up_out( $rotator, $resource, $next, speed, ease ) {

			    // Find the height of the next resource
					var h = $resource.outerHeight(true);

					// Slide the resource in
					$resource.stop(true,true).animate( {
						top: '-'+h+'px'
					}, speed, ease, function() {
						// Hide the resource
						$resource.hide();
						$rotator.prepend($resource);
					});
			  }
			  
			  
			  
			  
			  
			  /* --------------------------------------------------------- */
			  /* !Set the next item */
			  /* --------------------------------------------------------- */
			  
			  function mtphr_rotator_next() {
				  
				  if(vars.running) return false;

		    	// Find the new resource
		    	var new_resource = parseInt(vars.current + 1);
					if( new_resource == vars.count ) {
						new_resource = 0;
					}
					mtphr_rotator_update( new_resource );
			  }
			  
			  /* --------------------------------------------------------- */
			  /* !Set the previous item */
			  /* --------------------------------------------------------- */
			  
			  function mtphr_rotator_prev() {
				  
				  if(vars.running) return false;

		    	// Find the new resource
		    	var new_resource = parseInt(vars.current-1);
					if( new_resource < 0 ) {
						new_resource = vars.count-1;
					}
					if( settings.nav_reverse ) {
						if( settings.rotate_type == 'slide_left' ) {
							rotate_adjustment = 'slide_right';
						} else if( settings.rotate_type == 'slide_right' ) {
							rotate_adjustment = 'slide_left';
						} else if( settings.rotate_type == 'slide_down' ) {
							rotate_adjustment = 'slide_up';
						} else if( settings.rotate_type == 'slide_up' ) {
							rotate_adjustment = 'slide_down';
						}
						vars.reverse = 1;
					}
					mtphr_rotator_update( new_resource );
			  }



		    /* --------------------------------------------------------- */
		    /* !Listen for directional navigation clicks */
		    /* --------------------------------------------------------- */
		    
		    if( $nav_prev ) {

		    	$nav_prev.bind('click', function( e ) {
		    		e.preventDefault();
						mtphr_rotator_prev();
		    	});

		    	$nav_next.bind('click', function(e) {
		    		e.preventDefault();
						mtphr_rotator_next();
		    	});
		    }



		    /* --------------------------------------------------------- */
		    /* !Listen for navigation clicks */
		    /* --------------------------------------------------------- */
		    
		    $nav_controls.children('a').bind('click', function( e ) {
	    		e.preventDefault();

	    		// Find the new resource
		    	var new_resource = $(this).attr('href');
		    	new_resource = new_resource.substr(1, new_resource.length);

	    		if(vars.running) return false;
	    		if(new_resource == vars.current) return false;

		    	var reverse = ( new_resource < vars.current ) ? 1 : 0;

	    		if( settings.nav_reverse && reverse ) {
						if( settings.rotate_type == 'slide_left' ) {
							rotate_adjustment = 'slide_right';
						} else if( settings.rotate_type == 'slide_right' ) {
							rotate_adjustment = 'slide_left';
						} else if( settings.rotate_type == 'slide_down' ) {
							rotate_adjustment = 'slide_up';
						} else if( settings.rotate_type == 'slide_up' ) {
							rotate_adjustment = 'slide_down';
						}
						vars.reverse = 1;
					}
					mtphr_rotator_update( new_resource );
	    	});




				/* --------------------------------------------------------- */
				/* !Gallery swipe - 1.0.5 */
				/* --------------------------------------------------------- */
				
				$rotator.swipe( {
					triggerOnTouchEnd : true,
	        swipeLeft: function(event, distance, duration, fingerCount, fingerData) {
	          
	          if(vars.running) return false;

			    	// Find the new resource
			    	var new_resource = parseInt(vars.current + 1);
						if( new_resource == vars.count ) {
							new_resource = 0;
						}
						if( settings.rotate_type == 'slide_left' || settings.rotate_type == 'slide_right' ) {
							rotate_adjustment = 'slide_left';
						}
						mtphr_rotator_update( new_resource );
	        },
	        swipeRight: function(event, distance, duration, fingerCount, fingerData) {
	          
	          if(vars.running) return false;

			    	// Find the new resource
			    	var new_resource = parseInt(vars.current-1);
						if( new_resource < 0 ) {
							new_resource = vars.count-1;
						}
						if( settings.rotate_type == 'slide_left' || settings.rotate_type == 'slide_right' ) {
							rotate_adjustment = 'slide_right';
						}
						if( settings.nav_reverse ) {
							if( settings.rotate_type == 'slide_down' ) {
								rotate_adjustment = 'slide_up';
							} else if( settings.rotate_type == 'slide_up' ) {
								rotate_adjustment = 'slide_down';
							}
							vars.reverse = 1;
						}
						mtphr_rotator_update( new_resource );
	        }
	      });
				
				
				
				/* --------------------------------------------------------- */
		    /* !Listen for external events - 2.0.0 */
		    /* --------------------------------------------------------- */
				
		    $rotator_container.on(settings.event_prefix+'_next', function( e ) {
		    	mtphr_rotator_next();
				});
				
				$rotator_container.on(settings.event_prefix+'_prev', function( e ) {
		    	mtphr_rotator_prev();
				});
			
				$rotator_container.on(settings.event_prefix+'_goto', function( e, pos ) {
		    	mtphr_rotator_update( parseInt(pos) );
				});

				
				
				/* --------------------------------------------------------- */
				/* !iFrame resize */
				/* --------------------------------------------------------- */
				
				function mtphr_rotator_resize_iframe() {
				
					$('.mtphr-galleries-iframe').each( function() {
						
						var w = $(this).parent().width(),
								h = w/16*9;
								
						$(this).width(w).height(h);
					});
				}
				
				
				/* --------------------------------------------------------- */
				/* !Resize */
				/* --------------------------------------------------------- */
				
				function mtphr_rotator_resize() {
					gallery_width = $rotator.width();
			    mtphr_rotator_resize_resources();
			    mtphr_rotator_resize_iframe();
				}





		    /**
		     * Resize listener
		     * Reset the resourceer width
		     *
		     * @since 1.0.0
		     */
		    $(window).resize( function() {
			    mtphr_rotator_resize();
		    });




		    // Trigger the afterLoad callback
        settings.after_load.call($rotator_container, $rotator);
        $rotator_container.trigger(settings.event_prefix+'_after_load_single', [vars, resources]);
        $('body').trigger(settings.event_prefix+'_after_load', [$rotator_container, vars, resources]);

			});
		}
	};




	/**
	 * Setup the class
	 *
	 * @since 1.0.0
	 */
	$.fn.mtphr_rotator = function( method ) {

		if ( methods[method] ) {
			return methods[method].apply( this, Array.prototype.slice.call(arguments, 1) );
		} else if ( typeof method === 'object' || !method ) {
			return methods.init.apply( this, arguments );
		} else {
			$.error( 'Method ' +  method + ' does not exist in mtphr_rotator' );
		}
	};

})( jQuery );