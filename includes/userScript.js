// ==UserScript==
// ==/UserScript==

	var detect=function (){
				var _apps = {};
	var doc = document;
	var a;

	var metas = doc.getElementsByTagName("meta");
	
	var meta_tests = {
		'generator': {
			'Joomla': /joomla!?\s*([\d\.]+)?/i,
			'vBulletin': /vBulletin\s*(.*)/i,
			'WordPress': /WordPress\s*(.*)/i,
			'XOOPS': /xoops/i,
			'Plone': /plone/i,
			'MediaWiki': /MediaWiki/i,
			'CMSMadeSimple': /CMS Made Simple/i,
			'SilverStripe': /SilverStripe/i,
			'Movable Type': /Movable Type/i,
			'Amiro.CMS': /Amiro/i,
			'Koobi': /koobi/i,
			'bbPress': /bbPress/i,
			'DokuWiki': /dokuWiki/i,
			'TYPO3': /TYPO3/i,
			'PHP-Nuke': /PHP-Nuke/i,
			'DotNetNuke': /DotNetNuke/i,
			'Sitefinity': /Sitefinity\s+(.*)/i,
			'WebGUI': /WebGUI/i,
			'ez Publish': /eZ\s*Publish/i,
			'BIGACE': /BIGACE/i,
			'TypePad': /typepad\.com/i,
			'Blogger': /blogger/i,
			'PrestaShop': /PrestaShop/i,
			'SharePoint': /SharePoint/,
			'JaliosJCMS': /Jalios JCMS/i,
			'ZenCart': /zen-cart/i,
			'WPML': /WPML/i,
			'PivotX': /PivotX/i,
			'OpenACS': /OpenACS/i,
			'AlphaCMS': /alphacms\s+(.*)/i,
			'concrete5': /concrete5 -\s*(.*)$/,
			'Webnode': /Webnode/,
			'GetSimple': /GetSimple/,
			'DataLifeEngine': /DataLife Engine/,
		},
		'copyright': {
			'phpBB': /phpBB/i
		},
		'elggrelease': {
			'Elgg': /.+/
		},
		'powered-by': {
			'Serendipity': /Serendipity/i,
		},
		'author': {
			'Avactis': /Avactis Team/i
		}
	};

	for (var idx in metas)
	{
		var m = metas[idx];
		var name = m.name ? m.name.toLowerCase() : "";

		if (!meta_tests[name]) continue;
		
		for (var t in meta_tests[name])
		{
			if (t in _apps) continue;
			
			var r = meta_tests[name][t].exec(m.content);
			if (r)
			{
				
				_apps[t] = r[1] ? r[1] : -1;
			}
		}
	}

	// 2: detect by script tags
	var scripts = doc.getElementsByTagName("script");
	
	var script_tests = {
		'Google Analytics': /google-analytics.com\/(ga|urchin).js/i,
		'Quantcast': /quantserve\.com\/quant\.js/i,
		'Prototype': /prototype\.js/i,
		'Joomla': /\/components\/com_/,
		'Ubercart': /uc_cart/i,
		'Closure': /\/goog\/base\.js/i,
		'MODx': /\/min\/b=.*f=.*/,
		'MooTools': /mootools/i,
		'Dojo': /dojo(\.xd)?\.js/i,
		'script.aculo.us': /scriptaculous\.js/i,
		'Disqus': /disqus.com\/forums/i,
		'GetSatisfaction': /getsatisfaction\.com\/feedback/i,
		'Wibiya': /wibiya\.com\/Loaders\//i,
		'reCaptcha': /(google\.com\/recaptcha|api\.recaptcha\.net\/)/i,
		'Mollom': /mollom\/mollom\.js/i, // only work on Drupal now
		'ZenPhoto': /zp-core\/js/i,
		'Gallery2': /main\.php\?.*g2_.*/i,
		'AdSense': /pagead\/show_ads\.js/,
		'XenForo': /js\/xenforo\//i,
		'Cappuccino': /Frameworks\/Objective-J\/Objective-J\.js/,
		'Avactis': /\/avactis-themes\//i,
		'Volusion': /a\/j\/javascripts\.js/,
		'AddThis': /addthis\.com\/js/,
		'BuySellAds': /buysellads.com\/.*bsa\.js/,
		'Weebly': /weebly\.com\/weebly\//,
		'Jigsy': /javascripts\/asterion\.js/, // may change later
		'Yola': /analytics\.yola\.net/ // may change later
	};

	for (var idx in scripts)
	{
		var s = scripts[idx];
		if (!s.src) continue;
		s = s.src;

		for (var t in script_tests)
		{
			if (t in _apps) continue;
			if (script_tests[t].test(s))
			{
				_apps[t] = -1;
			}
		}
	}

	// 3: detect by domains

	// 4: detect by regexp
	var text = document.documentElement.outerHTML;
	var text_tests = {
		'SMF': /<script .+\s+var smf_/i,
		'Magento': /var BLANK_URL = '[^>]+js\/blank\.html'/i,
		'Tumblr': /<iframe src=("|')http:\/\/\S+\.tumblr\.com/i,
		'WordPress': /<link rel=("|')stylesheet("|') [^>]+wp-content/i,
		'Closure': /<script[^>]*>.*goog\.require/i,
		'Liferay': /<script[^>]*>.*LifeRay\.currentURL/i,
		'vBulletin': /vbmenu_control/i,
		'MODx': /(<a[^>]+>Powered by MODx<\/a>|var el= \$\('modxhost'\);|<script type=("|')text\/javascript("|')>var MODX_MEDIA_PATH = "media";)/i,
		'miniBB': /<a href=("|')[^>]+minibb.+\s*<!--End of copyright link/i,
		'PHP-Fusion': /(href|src)=["']?infusions\//i, // @todo: recheck this pattern again
		'OpenX': /(href|src)=["'].*delivery\/(afr|ajs|avw|ck)\.php[^"']*/,
		'GetSatisfaction': /asset_host\s*\+\s*"javascripts\/feedback.*\.js/igm, // better recognization
		'Fatwire': /\/Satellite\?|\/ContentServer\?/,
		'Contao': /powered by (TYPOlight|Contao)/i,
		'Moodle' : /<link[^>]*\/theme\/standard\/styles.php".*>|<link[^>]*\/theme\/styles.php\?theme=.*".*>/,
		'1c-bitrix' : /<link[^>]*\/bitrix\/.*?>/i,
		'OpenCMS' : /<link[^>]*\.opencms\..*?>/i,
		'HumansTxt': /<link[^>]*rel=['"]?author['"]?/i,
		'GoogleFontApi': /ref=["']?http:\/\/fonts.googleapis.com\//i,
		'Prostores' : /-legacycss\/Asset">/,
		'osCommerce': /(product_info\.php\?products_id|_eof \/\/-->)/,
		'OpenCart': /index.php\?route=product\/product/,
		'Shibboleth': /<form action="\/idp\/Authn\/UserPassword" method="post">/
	};

	for (t in text_tests)
	{
		if (t in _apps) continue;
		if (text_tests[t].test(text))
		{
			_apps[t] = -1;
		}
	}
	
	// TODO: merge inline detector with version detector
	
	// 5: detect by inline javascript
	var js_tests = {
		
		//start added
		'Mustache':function(){
			
			return window.Mustache !=null;
			
			},
			
			
			'SOCKET.IO':function(){
				return window.io !=null;
				
				},
				'GWT':function (){
					
					
					return window.__gwt_scriptsLoaded !=null;
					},
					'Lightstreamer':function (){
						
						return window.Lightstreamer !=null;
						
						},
						
							'three.js':function (){
								
								return window.THREE !=null;
								},
								'SproutCore':function (){
									
									return window.SC !=null;
									},
									'MochiKit':function (){
										return window.MochiKit !=null;
										},
										'Processing.js':function (){
											
											return window.Processing !=null;
											},
											'Qooxdoo':function (){
												return window.qx !=null;
												},
												'EmbeddedJS':function (){
													
													return window.EJS !=null;
													},
													
														'Knockout.JS':function (){
															return window.ko !=null;
															},
		
			//end added
		'Drupal': function() {
			return window.Drupal != null;
		},
		'TomatoCMS': function() {
			return window.Tomato != null;
		},
		'MojoMotor': function() {
			return window.Mojo != null;
		},
		'ErainCart': function() {
			return window.fn_register_hooks != null;
		},
		'SugarCRM': function() {
			return window.SUGAR != null;
		},
		'YUI': function() {
			return window.YAHOO|window.YUI != null;
		},
		'jQuery': function() {
			return window.jQuery != null;
		},
		
		'jQuery UI': function() {
			return window.jQuery != null && window.jQuery.ui != null;
		},
		'Typekit': function() {
			return window.Typekit != null;
		},
		'Facebook': function() {
			return window.FB != null && window.FB.api != null;
		},
		'ExtJS': function() {
			return window.Ext != null;
		},
		'Modernizr': function() {
			return window.Modernizr != null;
		},
		'Raphael': function() {
			return window.Raphael != null;
		},
		'Cufon': function() {
			return window.Cufon != null;
		},
		'sIFR': function() {
			return window.sIFR != null;
		},
		'Xiti': function() {
			return window.xtsite != null && window.xtpage != null;
		},
		'Piwik': function() {
			return window.Piwik != null;
		},
		'IPB': function() {
			return window.IPBoard != null;
		},
		'MyBB': function() {
			return window.MyBB != null;
		},
		'Clicky': function() {
			return window.clicky != null;
		},
		'Woopra': function() {
			return window.woopraTracker != null;
		},
		'RightJS': function() {		
			return window.RightJS != null;
		},
		'OpenWebAnalytics': function() {
			return window.owa_baseUrl != null;
		},
		'Prettify': function() {
			return window.prettyPrint != null;
		},
		'SiteCatalyst': function() {
			return window.s_account != null;
		},
		'Twitter': function() {
			return window.twttr != null;
		},
		'Coremetrics': function() {
			return window.cmCreatePageviewTag != null;
		},
		'Buzz': function() {
			return window.google_buzz__base_url != null;
		},
		'Plus1': function() {
			return window.gapi && window.gapi.plusone;
		},
		'Google Loader': function() {
			return window.google && window.google.load != null;
		},
		'GoogleMapApi': function() {
			return window.google && window.google.maps != null;
		},
		'Head JS': function() {
			return window.head && window.head.js != null;
		},
		'SWFObject': function() {
			return window.swfobject != null;
		},
		'Chitika': function() {
			return window.ch_client && window.ch_write_iframe;
		},
		'Jimdo': function() {
			return window.jimdoData != null;
		},
		'Webs': function() {
			return window.webs != null;
		},
		'Backbone.js': function() {
			return window.Backbone && typeof(window.Backbone.sync) === 'function';
		},
		'Underscore.js': function() {
			return window._ && typeof(window._.identity) === 'function' 
				&& window._.identity('abc') === 'abc';
		}
	};
	
	for (t in js_tests)
	{
		if (t in _apps) continue;
		if (js_tests[t]())
		{
			
			_apps[t] = -1;
		}

	}

	// 6: detect some script version when available
	var js_versions = {	
	//start added
	'Mustache':function(){
		if(typeof window.Mustache== 'object' && window.Mustache.version!=undefined	)
return window.Mustache.version			
		
		},
		'SOCKET.IO':function (){
			if(typeof window.io=='object' && window.io.version !=undefined)
			return window.io.version
			},
			'Lightstreamer':function (){
				if(typeof window.Lightstreamer=='object'&& window.Lightstreamer.version !=undefined)
				return window.Lightstreamer.version
				
				},
				'MochiKit':function (){
					if(typeof window.MochiKit=='object'){
						var obj=window.MochiKit;
						for(var parts  in obj){
							if(obj[parts].VERSION !=undefined){
								
								var version=obj[parts].VERSION;break;
								
								}	
							
							
							}
												
						}
					return version;
					},
					
		'Processing.js':function (){
			if(typeof window.Processing =='function' && window.Processing.version !=undefined)
			return window.Processing.version
		
			},
		
			
	//end added	
		'Prototype': function() {
			if('Prototype' in window && window.Prototype.Version!=undefined)
				return window.Prototype.Version			
		},
		'script.aculo.us': function() {
			if('Scriptaculous' in window && window.Scriptaculous.Version!=undefined)
				return window.Scriptaculous.Version			
		},
		'jQuery': function() {
			if(typeof window.jQuery == 'function' && window.jQuery.prototype.jquery!=undefined )
			
				return window.jQuery.prototype.jquery;
		},
		'jQuery UI': function() {
			if(typeof window.jQuery == 'function' && window.jQuery.ui && window.jQuery.ui.version!=undefined )
				return window.jQuery.ui.version
		},
		'Dojo': function() {
			if(typeof window.dojo == 'object' && window.dojo.version.toString()!=undefined)
				return window.dojo.version.toString()				
		},
		'YUI': function() {
			if(typeof window.YAHOO == 'object' && window.YAHOO.VERSION!=undefined )
				return window.YAHOO.VERSION
			if('YUI' in window && typeof window.YUI == 'function' && window.YUI().version!=undefined)
				return window.YUI().version
		},
		'MooTools': function() {
			 if(typeof window.MooTools == 'object' && window.MooTools.version!=undefined)
				return window.MooTools.version
		},
		'ExtJS': function() {
			if(typeof window.Ext === 'object' && window.Ext.version!=undefined)
				return window.Ext.version
		},
		'RightJS': function() {
			if('RightJS' in window && window.RightJS.version!=undefined)
				return window.RightJS.version
		},
		'Modernizr': function() {
	
			if(window.Modernizr != null && window.Modernizr._version!=undefined)
				return window.Modernizr._version
		},
		'Raphael': function() {
			if(window.Raphael != null && window.Raphael.version!=undefined)
				return window.Raphael.version
		},
		'Backbone.js': function() {
			if (window.Backbone && window.Backbone.VERSION)
				return window.Backbone.VERSION;
		},
		'Underscore.js': function() {
			if (window._ && window._.VERSION)
				return window._.VERSION;
		}
	};
	
	for (a in _apps)
	{		var infor=true;
		if (_apps[a]==-1 && js_versions[a])
		{
			
			var r = js_versions[a]()
			_apps[a] = r?r:-1
		}
	}
	if(infor)
		return _apps
	else
		return false;	
		}
	
	
	

	var loaded=false;
	var esrc;
	var domready=false;

	var popupMsgHandler = function(e)
	{


	
		opera.postError("User script received from popup: "+e.data.msg);
		//alert("called");
		
		if(e.data.msg=="alert"){
			alert(e.data.content);
			}
		 if(e.data.msg=="backauth"){
			loaded=true;
			esrc=e.source;
			if(domready){
				esrc.postMessage({msg:"data", content: detect(),src:document.location.href});
			
				}
			//alert("hi,ich bin der richtige"+document.location+loaded);
			}
	};
	
	

	opera.extension.onmessage =popupMsgHandler;
window.addEventListener('DOMContentLoaded',function(){
	domready=true;
	if(loaded){
		esrc.postMessage({msg:"data", content: detect(),src:document.location.href});
			
		}
	else{
	opera.extension.postMessage({msg:"auth"});
	}},false);

	window.onunload=function (){if(esrc){esrc.postMessage({msg:"unload"});}};
