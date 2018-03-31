jQuery( document ).ready( function($) {


	// Setup strict mode
	(function() {

    "use strict";
			    
	
		var $color_switcher_container = $('<div id="color-switcher-container"></div>'),
				$color_switcher = $('<div id="color-switcher"></div>');
				
		$color_switcher.append('<a id="color-switcher-toggle" href="#"><i class="apex-icon-gear-1 apex-spinner-slow"></i></a> \
			<h3>Color Switcher</h3> \
			<div id="color-swatches" class="clearfix"> \
				<div id="color-swatch-33cccc" class="color-swatch active"><a href="#33cccc"></a></div> \
				<div id="color-swatch-33cc99" class="color-swatch"><a href="#33cc99"></a></div> \
				<div id="color-swatch-cccc33" class="color-swatch"><a href="#cccc33"></a></div> \
				<div id="color-swatch-cc3366" class="color-swatch"><a href="#cc3366"></a></div> \
				<div id="color-swatch-cc3333" class="color-swatch"><a href="#cc3333"></a></div> \
				<div id="color-swatch-cc6633" class="color-swatch"><a href="#cc6633"></a></div> \
			</div> \
			<a id="color-switcher-done" class="btn" href="#">Done</a>'
		);
		
		$color_switcher_container.append($color_switcher);
		$('body').append($color_switcher_container);
		
		
		
		/* --------------------------------------------------------- */
		/* !Convert Hex */
		/* --------------------------------------------------------- */
		
		function color_switcher_convert_hex(hex,opacity){
	    
	    hex = hex.replace('#','');
	    var r = parseInt(hex.substring(0,2), 16),
	    		g = parseInt(hex.substring(2,4), 16),
					b = parseInt(hex.substring(4,6), 16);
	
	    var result = 'rgba('+r+','+g+','+b+','+opacity/100+')';
	    return result;
		}
	
	
		/* --------------------------------------------------------- */
		/* !Text Color */
		/* --------------------------------------------------------- */
		
		function color_switcher_text_color( color ) {
		
			var css = '.no-touch a:hover' +
								',.apex-format-quote .entry-title' +
								',.apex-format-quote .entry-title a' +
								',.apex-format-tweet .entry-title' +
								',.apex-format-tweet .entry-title a' +
								',.entry-featured-data .entry-data' +
								',.entry-featured-icons a:hover i' +
								',.mtphr-slider-header a:hover i' +
								',.mtphr-rotator-footer a:hover i' +
								',.apex-contact-table a' +
								',#apex-totop:hover i' +
								',#site-footer a:hover' +
								',#color-switcher-toggle i' +
								',#color-switcher-toggle:hover i' +
								',.entry-meta a' +
								',.mtphr-rotator-header a:hover i' +
								',.apex-primary-menu-container li.active > a' +
								',.apex-primary-menu-container a:hover' +
								',.entry-comments:hover i' +
								',.search-container button[type="submit"]:hover' +
								',.mtphr-tabbed-posts-widget .entry-meta' +
								',.widget-twitter .twitter-date' +
								',.content-nav li a:hover' +
								',a#apex-totop-float:hover i' +
								'{ color: '+color+'; }';
								
				 css += '.btn' +
				 				',.apex-readmore' + 
				 				',.apex-readmore *' +
				 				',.mtphr-gallery-filter a.btn.active' +
				 				',.mtphr-gallery-filter a.btn:hover' +
				 				',.mtphr-gallery-loadmore a.btn:hover' +
				 				',#color-switcher-done:hover' +
				 				',#respond button[type="submit"].btn:hover' +
				 				',#commentscontainer .apex-reply:hover' +
								'{ color: '+color+' !important; }';
				
			return css;
		}
		
		
		/* --------------------------------------------------------- */
		/* !Background Color */
		/* --------------------------------------------------------- */
		
		function color_switcher_background_color( color ) {
		
			var css = 'a.apex-icon-round:hover i' +
								',.apex-format-quote .entry-featured i' +
								',.apex-format-tweet .entry-featured i' +
								',.mtphr-slidegraph-fill' +
								',a.apex-icon:hover i' +
								',#site-footer .apex-icon:hover i' +
								',.widget-categories a:hover span.count' +
								',.tagcloud a:hover' +
								',.content-nav li span' +
								'{ background-color: '+color+'; }';
								
				 css += '.entry-featured-overlay' +
				 				',.apex-hero-menu-container a:hover' +
								'{ background-color: '+color_switcher_convert_hex(color, 80)+'; }';
								
				 css += '.mtphr-slidegraph-fill-bg' +
								'{ background-color: '+color_switcher_convert_hex(color, 20)+'; }';
								
				 css += 'input.btn[type="submit"]' +
				 				',button.btn[type="submit"]' +
								'{ background-color: '+color_switcher_convert_hex(color, 10)+'; }';
				
			return css;
		}
		
		
		/* --------------------------------------------------------- */
		/* !Border Color */
		/* --------------------------------------------------------- */
		
		function color_switcher_border_color( color ) {
		
			var css = '.apex-hero-menu-container a:hover' +
								',a.apex-icon-round:hover i' +
								',a.apex-icon-round:hover .apex-icon' +
								',.btn' +
								',.apex-format-quote .entry-featured' +
								',.apex-format-tweet .entry-featured' +
								',.mtphr-slider-header a:hover i' +
								',a.apex-icon:hover i' +
								',.mtphr-gallery-filter a.btn.active' +
				 				',.mtphr-gallery-filter a.btn:hover' +
				 				',.mtphr-gallery-loadmore a.btn:hover' +
				 				',.form-control:focus' +
				 				',.btn:hover' +
				 				',#color-switcher-done:hover' +
				 				',.mtphr-rotator-header a:hover i' +
				 				',blockquote' +
				 				',.widget-categories a:hover span.count' +
				 				',.tagcloud a:hover' +
				 				',.content-nav li span' +
				 				',.content-nav li a:hover' +
				 				',#respond button[type="submit"].btn:hover' +
				 				',#commentscontainer .apex-reply:hover' +
				 				',.mtphr-rotator-footer a:hover' +
								'{ border-color: '+color+'; }';
								
				 css += '.section-header-sep span' +
								'{ border-top-color: '+color+'; }';
				
			return css;
		}
		
		
		/* --------------------------------------------------------- */
		/* !Images */
		/* --------------------------------------------------------- */
		
		function color_switcher_images( color ) {
		
			$('img[data-color-switcher-path]').each( function(index) {
			
				var path = $(this).attr('data-color-switcher-path');
				color = color.replace('#', '');
				
				path = path.replace('%', color);

				$(this).attr('src', path);
			});
			
		}
	
		function color_switcher_swap_colors( color ) {
		
			color_switcher_images( color );
			
			var css = '';
			
			css += color_switcher_text_color( color );
			css += color_switcher_background_color( color );
			css += color_switcher_border_color( color );
			
			var $custom_css = $('style.color-switcher-css');
			if( $custom_css.length == 0 ) {
				$custom_css = $('<style class="color-switcher-css"></style>');
				$('head').append($custom_css);
			}
			
			$custom_css.html( css );
		}
	
		function color_switcher_show() {
			$('#color-switcher-toggle').addClass('active');
			$color_switcher_container.stop().animate( {
				left: 0
			}, 1000, 'easeOutExpo', function() {
				// Animation complete.
			});
		}
		
		function color_switcher_hide() {
			$('#color-switcher-toggle').removeClass('active');
			$color_switcher_container.stop().animate( {
				left: '-208px'
			}, 1000, 'easeOutExpo', function() {
				// Animation complete.
			});
		}
			
		
		// If the color switcher exists 
			
		if( $color_switcher.length > 0 ) {
		
			$('#color-switcher-toggle').click( function(e) {
				e.preventDefault();
				
				if( $(this).hasClass('active') ) {
					color_switcher_hide();
				} else {
					color_switcher_show();
				}
	
			});
			
			$('#color-switcher-done').click( function(e) {
				e.preventDefault();
				color_switcher_hide();
			});
			
			$('.color-swatch a').click( function(e) {
				e.preventDefault();
				
				$('.color-swatch').removeClass('active');
				$(this).parent().addClass('active');
				
				color_switcher_swap_colors( $(this).attr('href') );
			});
			
		}
	
	}());

});