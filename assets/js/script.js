var hide_nav = $('body').hasClass('apex-hide-nav'),
		menu_scroll = $('body').hasClass('apex-menu-scroll'),
		$main_menu_container = $('.apex-primary-menu-container'),
		$nav_contents = $('#site-navigation-contents'),
		$mobile_toggle = $('#mobile-menu-toggle'),
		$hero = $('#apex-hero'),
		has_hero = $hero.length > 0,
		$header = $('.apex-header'),
		has_header = $header.length > 0,
		menu_items = $main_menu_container.find('li'),
		menu_sections,
		current_section_id,
		nav_visible = false,
		is_mobile = false,
		window_h,
		nav_h,
		nav_offset,
		hero_h,
		header_h,
		active_menu_offset = 40,
		totop_offset = 300,
		scroll_time = 1200;
		
		
function apex_align_subs_single( $list ) {
	
	"use strict";

	var w = 0;
	
	$list.children('li').children('a').each( function(index) {
		
		jQuery(this).css('width', 'auto');
		if( jQuery(this).outerWidth() > w ) {
			w = jQuery(this).outerWidth();
		}
		jQuery(this).css('width', '100%');
	});
	
	$list.css({
		'width' : w+'px',
		'marginLeft': (1-(w/2))+'px'
	});
}	

function apex_align_subs() {

	"use strict";
	
	jQuery('.apex-primary-menu-container > ul > li > ul').each( function() {	
		apex_align_subs_single( jQuery(this) );
	});
}

function apex_align_subs_mobile() {

	"use strict";
	
	jQuery('.apex-primary-menu-container > ul > li > ul').each( function() {
		jQuery(this).css({
			'width' : 'auto',
			'marginLeft': 0
		});
	});
}
		

// Show the mobile menu
function apex_mobile_menu_show( animate ) {

	"use strict";
	
	if( animate ) {
  	$main_menu_container.stop().slideDown(  700, 'easeOutQuint' );
	} else {
  	$main_menu_container.stop(true, true).show();
  	$main_menu_container.css('height', 'auto');
  }
  
  $mobile_toggle.addClass('active');
}

// Hide the mobile menu
function apex_mobile_menu_hide( animate ) {

	"use strict";
	
	if( animate ) {
  	$main_menu_container.stop().slideUp( 700, 'easeOutQuint' );
	} else {
  	$main_menu_container.stop(true, true).hide();
  	$main_menu_container.css('height', 'auto');
  }
  
  $mobile_toggle.removeClass('active');
}	
	
// Check the hash scroll	
function apex_hash_scroll( path ) {

	"use strict";

	if( menu_scroll ) {

		var hash = path.split('#');
		if( hash.length == 2 ) {
		
			var $article = $('#'+hash[1]),
					top = $article.offset().top - nav_h;
					
			$('html, body').stop().animate({
	        scrollTop: top
	    }, scroll_time, 'easeInOutExpo');
	    
	    if( is_mobile ) {
				apex_mobile_menu_hide( true );
			}	
		}
	}
}


/* --------------------------------------------------------- */
/* !Code to run after document ready */
/* --------------------------------------------------------- */

jQuery( document ).ready( function($) {

	// Setup strict mode
	(function() {

    "use strict";
	
	
		// Always start at top on page load
		$(this).scrollTop(0);
				
		hide_nav = $('body').hasClass('apex-hide-nav');
		menu_scroll = $('body').hasClass('apex-menu-scroll');
		
	
		
		/* --------------------------------------------------------- */
		/* !Main menu position - 1.0.0 */
		/* --------------------------------------------------------- */
	
		function apex_visible_menu_height() {
			$('body').css('paddingTop', nav_h+'px');
		}
		
		function apex_hidden_menu_reset() {
			$nav_contents.stop().css({
				marginTop: -nav_h+'px'
			});
			
			nav_visible = false;
		}
		
		function apex_hidden_menu_display( top ) {
			
			if( !nav_visible && top > nav_offset ) {
				
				nav_visible = true;
				
				$nav_contents.stop().animate( {
					marginTop: 0
				}, 700, 'easeOutQuint', function() {
					nav_h = $nav_contents.outerHeight(true);
				});
				
			} else if( nav_visible && top < nav_offset ) {
				
				nav_visible = false;
	
				$nav_contents.stop().animate( {
					marginTop: '-'+nav_h+'px'
				}, 700, 'easeOutQuint', function() {
					// Animation complete.
				});
				
				if( is_mobile ) {
					apex_mobile_menu_hide( true );
				}
			}
		}
		
		
		
		
		/* --------------------------------------------------------- */
	  /* !Mobile menu toggle - 1.0.0 */
	  /* --------------------------------------------------------- */
	  
	  $mobile_toggle.click( function(e) {
	  	e.preventDefault();
	  	
	  	if( $(this).hasClass('active') ) {
				apex_mobile_menu_hide( true );
			} else {
				apex_mobile_menu_show( true );
			}
	  });
	  
	  
	  
	  /* --------------------------------------------------------- */
	  /* !Main menu hover - 1.0.0 */
	  /* --------------------------------------------------------- */

		jQuery('.apex-primary-menu-container > ul > li').mouseover( function() {
			if( is_mobile == false && $(this).children('ul').length > 0 ) {
				apex_align_subs_single( $(this).children('ul') );
			}
		});
			
	
	
		
		/* --------------------------------------------------------- */
		/* !Menu scroll - 1.0.0 */
		/* --------------------------------------------------------- */
		
		// Map out the menu sections
		if( menu_scroll == 1 ) {
		
			menu_sections = menu_items.map( function() {
				
				if( /#/.test($(this).children('a').attr('href')) ) {
					
			    var $section = $($(this).children('a').attr('href'));
			    if( $section.length > 0 ) {
			    	return $section;
			  	}
		  	}
		  });
		}	
		
		$('.apex-primary-menu-container a, .apex-hero-menu-container a, #logo, #hero-logo a').click( function(e) { 
	
			if( menu_scroll == 1 ) {
	
				var hash = this.href.split('#'),
						scroll = false;
		    
		    if( $(this).attr('href') == 'index.html' || $(this).attr('href') == 'index.html/' || $(this).attr('href') == '/' ) {
		    
		    	e.preventDefault();
			    var top = 0;
			    
			    $('html, body').stop().animate({
			        scrollTop: top
			    }, scroll_time, 'easeInOutExpo');
	
		    } else if( hash.length == 2 ) {
		    	
		    	e.preventDefault();
		    	apex_hash_scroll( $(this).attr('href') );
		    }
			}
	  });
	  
	  $('body').bind('mousewheel', function(e) {
		  $('html, body').stop();
	  });
	  
	  $('#apex-totop, #apex-totop-float').click( function(e) {
		  e.preventDefault();
		  $('html, body').stop().animate({
	        scrollTop: 0
	    }, scroll_time, 'easeInOutExpo');
	  });
	  
	  $(window).scroll( function() {
	  
	  	var scroll_top = $(this).scrollTop();
	  
	  	// Check to show/hide the totop float
	  	if( scroll_top > totop_offset ) {
		  	$('#apex-totop-float').addClass('active');
	  	} else {
		  	$('#apex-totop-float').removeClass('active');
	  	}
			
			// Test wether to hide the nav
			if( hide_nav ) {
				apex_hidden_menu_display( scroll_top );
			}
			
			var current_top = scroll_top + nav_h;
			
			// Get id of current scroll item
			var sections = menu_sections.map( function() {
				if( $(this).offset().top <= (current_top + active_menu_offset) ) {
					return this;
				}
			});
			
			// Get the id of the current section
			var $section = sections[sections.length-1];
			var new_section_id = ($section && $section.length > 0) ? $section.attr('id') : '';
			
			// Set the active class of the menu items
			if( current_section_id !== new_section_id ) {
				current_section_id = new_section_id;
				
				menu_items.removeClass('active');
	
				$main_menu_container.find('a[href="#'+current_section_id+'"]').parent().addClass('active');
			}
			
		});
	 
		/*
	if (window.addEventListener) window.addEventListener('DOMMouseScroll', wheel, false);
		window.onmousewheel = document.onmousewheel = wheel;
		 
		function wheel(event) {
		  var delta = 0;
		  if (event.wheelDelta) delta = event.wheelDelta / 120;
		  else if (event.detail) delta = -event.detail / 3;
		
		  handle(delta);
		  if (event.preventDefault) event.preventDefault();
		  event.returnValue = false;
		}
		 
		function handle(delta) {
		  var time = 1000; // delay time
		  var distance = 300; // delta point 
		  // Dom where it will apply 
		  $('html, body').stop().animate({
			  scrollTop: $(window).scrollTop() - (distance * delta)
		  }, time, 'easeOutExpo' );
		}
	*/
	
	
	
		/* --------------------------------------------------------- */
		/* !Hero functions - 1.0.0 */
		/* --------------------------------------------------------- */
		
	  // Hero resize - 1.0.0
	  function apex_hero_resize() {
	
	  	var h = parseInt(hero_h/2000*75),
	  			content_h = 0;
	
		  $('.apex-hero-element').each( function(index) {
		  	$(this).css({
				  paddingTop : h+'px',
				  paddingBottom : h+'px' 
			  });
			  
			  content_h += $(this).outerHeight(true);
		  });
	
		  var $content = $('.apex-hero-content')
		  		content_h = $content.outerHeight(true);
		  
		  if( content_h > window_h ) {
			  $hero.css({
				  height : content_h+'px'
			  });
		  }
	  }
		  
		 
		// Hero menu animation - 1.0.0
		if( has_hero ) {
	
		  $('.apex-hero-element').each( function(index) {
		  
		  	$(this).delay(index*100).animate( {
		  		opacity: 1,
		  	}, 1000, 'linear');
		  	
		  	if( $(this).hasClass('apex-hero-menu-container') || $(this).find('.apex-hero-menu-container').length > 0 ) {
				  $('.apex-hero-menu-container ul li a').each( function(index) {
				  	
				  	$(this).delay(index*100).animate( {
				  		opacity: 1,
				  	}, 1000, 'linear');
				
				  });
			  }
		  });
	  }
	  
	  
	  /* --------------------------------------------------------- */
	  /* !Entry Featured Toggle - 1.0.0 */
	  /* --------------------------------------------------------- */
	  
	  $('.entry-featured-overlay-toggle').click( function(e) {
	  	e.preventDefault();
	  	
	  	if( $(this).hasClass('active') ) {
				$(this).removeClass('active');
				$(this).html('+');
				$(this).parents('.entry-featured-archive').removeClass('active');
			} else {
				$(this).addClass('active');
				$(this).html('&ndash;');
				$(this).parents('.entry-featured-archive').addClass('active');
			}
	  });
	 
	 
	
	
		/* --------------------------------------------------------- */
		/* !Gallery Load - 1.0.0 */
		/* --------------------------------------------------------- */
		
		var $vertical_placeholder;
		
		var gallery_ajax,
				gallery_open;
		
		function apex_close_gallery( $gallery, $reset, url ) {
			
			$gallery.stop().animate( {
				height: 0
			}, scroll_time, 'easeInOutExpo', function() {
				
				gallery_open = false;
				$gallery.empty();
				$gallery.css('height', '0');
				
				if( url ) {
					apex_load_gallery( $gallery, url );
					
				} else if( $reset.length > 0 ) {
				
					// Set the active classes
					$('.mtphr-gallery-block .entry-featured-archive').removeClass('active');
			
					var top = $reset.offset().top - nav_h;				
					$('html, body').stop().animate({
			      scrollTop: top
			    }, scroll_time, 'easeInOutExpo');
		    }
			});
		}
		
		function apex_load_gallery( $gallery, url ) {
			
			gallery_ajax = $.ajax({
			  url: url,
			  context: document.body
			}).done(function(data) {
				
				var $project = $(data),
						$rotator = $project.find('.mtphr-rotator'),
						top = $gallery.offset().top - nav_h;
				
				gallery_open = true;
				
				$gallery.empty();
				$gallery.append( $project );
				
				$rotator.mtphr_rotator();
	
				$('html, body').stop().animate({
		      scrollTop: top
		    }, scroll_time, 'easeInOutExpo', function() {
			    var h = $project.outerHeight(true);
					$gallery.stop().animate( {
						height: h
					}, scroll_time, 'easeInOutExpo', function() {
						$gallery.css('height', 'auto');
					});
		    });
		    
		    $rotator.find('.mtphr-rotator-close').on( 'click', null, function(e) {
					
					e.preventDefault();
					
					var $reset = $vertical_placeholder;
					if( $vertical_placeholder.is(':visible') ) {
						$reset = $vertical_placeholder.parents('.mtphr-gallery-content');
					} else {
						$reset = $('.mtphr-gallery-block:first');
					}
					apex_close_gallery( $(this).parents('.mtphr-gallery-rotator'), $reset );		
				});
		    
			});
			
		}
		
		function apex_load_gallery_thumbs( $container, url ) {
		
			$.ajax({
			  url: url,
			  context: document.body
			}).done(function(data) {
	
				var $thumbs = $(data);
	
				$container.isotope( 'insert', $thumbs );	
				$container.isotope( 'reloadItems' ).isotope();
				
				$('.mtphr-gallery-block').click( function(e) {
					e.preventDefault();
					apex_gallery_block_click( $(this) );	
				});
			});
		
		}
		
		function apex_gallery_block_click( $block ) {
		
			// Set the active classes
			$('.mtphr-gallery-block .entry-featured-archive').removeClass('active');
			$block.find('.entry-featured-archive').addClass('active');
			
			// Save the vertical placeholder
			$vertical_placeholder = $block;
			
			// Abort any existin ajax
			if( gallery_ajax ) {
				gallery_ajax.abort();
				gallery_ajax = null;
			}
			
			var $gallery = $block.parents('.mtphr-gallery').children('.mtphr-gallery-rotator'),
					url = $block.attr('data-gallery');
			
			if( gallery_open ) {
				apex_close_gallery( $gallery, false, url );
			} else {
				apex_load_gallery( $gallery, url );
			}
		}
		
		$('.mtphr-gallery-block').click( function(e) {
			e.preventDefault();
			apex_gallery_block_click( $(this) );	
		});
		
		$('.mtphr-gallery-loadmore a').click( function(e) {
			e.preventDefault();
			
			var $container = $(this).parent().siblings('.mtphr-gallery-content-wrapper').children('.mtphr-gallery-content');	
			apex_load_gallery_thumbs( $container, $(this).attr('href') );
			
			$(this).fadeOut();
		});
		
		
		
		/* --------------------------------------------------------- */
		/* !Equalize elements - 1.0.0 */
		/* --------------------------------------------------------- */
	
		function apex_equalize( group ) {
			
			var h = 0;
			group.each( function() {
	
				$(this).css('height','auto');
			  var t_h = $(this).height();
			  if(t_h > h) {
					h = t_h;
			  }
			});
			if( is_mobile == false ) {
				group.height(h);
			}
		}
		
		function apex_equalize_elements() {
	
			if( $('.apex-equalize-children').length > 0 ) {
				$('.apex-equalize-children').each( function(index) {
					apex_equalize( $('.apex-equalize-children').children() );
				});
			}
		}
		
		
		
		/* --------------------------------------------------------- */
		/* !Window Listeners - 1.0.0 */
		/* --------------------------------------------------------- */
	
		$( '#hero-rotator' ).on('mtphr_dnt_after_change_single', function( e, vars ) {
			apex_resize();
		});
	
		function apex_resize() {
		
			if( Modernizr.mq('(max-width: 767px)') ) {
				if( is_mobile==false ) {
					is_mobile = true;
					apex_align_subs_mobile();
					apex_mobile_menu_hide();
					apex_equalize_elements();
				}
			} else {
				if( is_mobile==true ) {
					is_mobile = false;
					apex_align_subs();
					apex_mobile_menu_show();
				}
				apex_equalize_elements();
			}
			
			var nav_h_temp = $nav_contents.outerHeight(true);
			if( nav_h_temp != 0 ) {
				nav_h = nav_h_temp;
			}
			window_h = $(window).height();
			
			if( has_hero ) {
			
				// Reset the hero height
				$hero.css({
				  height : '100%'
			  });
				
				hero_h = $hero.outerHeight(true);
				nav_offset = hero_h - nav_h - active_menu_offset;
				apex_hero_resize();
				
			} else if( has_header) {
				header_h = $header.outerHeight(true);
				nav_offset = header_h - nav_h - active_menu_offset;
			}
			
			if( !hide_nav ) {
				apex_visible_menu_height();
			}
		}
	
	
		// Trigger contet resize
		$(window).resize( function() {
			apex_resize();
	  });
	  setTimeout( function() {
	  	apex_resize();
	  }, 100 );
	  
	  apex_align_subs();
	  apex_resize();
	
	  
	  if( hide_nav == 1 ) {
	  	apex_hidden_menu_reset();
	  	
	  	// Make sure the menu is visible
			$nav_contents.css('opacity', 1);
	  }
  
  }());

});



/* --------------------------------------------------------- */
/* !Code to run after page load */
/* --------------------------------------------------------- */


jQuery( window ).load( function() {

	// Setup strict mode
	(function() {

    "use strict";
			
				
		/* --------------------------------------------------------- */
		/* !Scroll to the correct hash */
		/* --------------------------------------------------------- */		
	
		if( menu_scroll == 1 ) {
		  
		  // Scroll to hash
		  setTimeout( function() {
		  	apex_hash_scroll( window.location.hash );
		  }, 100 );
	  }
  
  }());

});
