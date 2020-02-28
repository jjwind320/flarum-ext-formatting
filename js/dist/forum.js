module.exports=function(t){var i={};function e(n){if(i[n])return i[n].exports;var a=i[n]={i:n,l:!1,exports:{}};return t[n].call(a.exports,a,a.exports,e),a.l=!0,a.exports}return e.m=t,e.c=i,e.d=function(t,i,n){e.o(t,i)||Object.defineProperty(t,i,{enumerable:!0,get:n})},e.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},e.t=function(t,i){if(1&i&&(t=e(t)),8&i)return t;if(4&i&&"object"==typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(e.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&i&&"string"!=typeof t)for(var a in t)e.d(n,a,function(i){return t[i]}.bind(null,a));return n},e.n=function(t){var i=t&&t.__esModule?function(){return t.default}:function(){return t};return e.d(i,"a",i),i},e.o=function(t,i){return Object.prototype.hasOwnProperty.call(t,i)},e.p="",e(e.s=6)}([,function(t,i){t.exports=flarum.core.compat.extend},function(t,i){t.exports=flarum.core.compat["components/CommentPost"]},function(t,i){t.exports=flarum.core.compat.ForumApplication},,,function(t,i,e){"use strict";e.r(i);var n=e(1),a=e(2),o=e.n(a),r=e(3),s=e.n(r),h=function(t){function i(i){this.album=[],this.currentImageIndex=void 0,this.init(),this.options=t.extend({},this.constructor.defaults),this.option(i)}return i.defaults={albumLabel:"Image %1 of %2",alwaysShowNavOnTouchDevices:!1,fadeDuration:600,fitImagesInViewport:!0,imageFadeDuration:600,positionFromTop:50,resizeDuration:700,showImageNumberLabel:!0,wrapAround:!1,disableScrolling:!1,sanitizeTitle:!1},i.prototype.option=function(i){t.extend(this.options,i)},i.prototype.imageCountLabel=function(t,i){return this.options.albumLabel.replace(/%1/g,t).replace(/%2/g,i)},i.prototype.init=function(){var i=this;t(document).ready((function(){i.enable(),i.build()}))},i.prototype.enable=function(){var i=this;t("body").on("click","a[rel^=lightbox], area[rel^=lightbox], a[data-lightbox], area[data-lightbox]",(function(e){return i.start(t(e.currentTarget)),!1}))},i.prototype.build=function(){if(!(t("#lightbox").length>0)){var i=this;t('<div id="lightboxOverlay" tabindex="-1" class="lightboxOverlay"></div><div id="lightbox" tabindex="-1" class="lightbox"><div class="lb-outerContainer"><div class="lb-container"><img class="lb-image" src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" alt=""/><div class="lb-nav"><a class="lb-prev" aria-label="Previous image" href="" ></a><a class="lb-next" aria-label="Next image" href="" ></a></div><div class="lb-loader"><a class="lb-cancel"></a></div></div></div><div class="lb-dataContainer"><div class="lb-data"><div class="lb-details"><span class="lb-caption"></span><span class="lb-number"></span></div><div class="lb-closeContainer"><a class="lb-close"></a></div></div></div></div>').appendTo(t("body")),this.$lightbox=t("#lightbox"),this.$overlay=t("#lightboxOverlay"),this.$outerContainer=this.$lightbox.find(".lb-outerContainer"),this.$container=this.$lightbox.find(".lb-container"),this.$image=this.$lightbox.find(".lb-image"),this.$nav=this.$lightbox.find(".lb-nav"),this.containerPadding={top:parseInt(this.$container.css("padding-top"),10),right:parseInt(this.$container.css("padding-right"),10),bottom:parseInt(this.$container.css("padding-bottom"),10),left:parseInt(this.$container.css("padding-left"),10)},this.imageBorderWidth={top:parseInt(this.$image.css("border-top-width"),10),right:parseInt(this.$image.css("border-right-width"),10),bottom:parseInt(this.$image.css("border-bottom-width"),10),left:parseInt(this.$image.css("border-left-width"),10)},this.$overlay.hide().on("click",(function(){return i.end(),!1})),this.$lightbox.hide().on("click",(function(e){"lightbox"===t(e.target).attr("id")&&i.end()})),this.$outerContainer.on("click",(function(e){return"lightbox"===t(e.target).attr("id")&&i.end(),!1})),this.$lightbox.find(".lb-prev").on("click",(function(){return 0===i.currentImageIndex?i.changeImage(i.album.length-1):i.changeImage(i.currentImageIndex-1),!1})),this.$lightbox.find(".lb-next").on("click",(function(){return i.currentImageIndex===i.album.length-1?i.changeImage(0):i.changeImage(i.currentImageIndex+1),!1})),this.$nav.on("mousedown",(function(t){3===t.which&&(i.$nav.css("pointer-events","none"),i.$lightbox.one("contextmenu",(function(){setTimeout(function(){this.$nav.css("pointer-events","auto")}.bind(i),0)})))})),this.$lightbox.find(".lb-loader, .lb-close").on("click",(function(){return i.end(),!1}))}},i.prototype.start=function(i){var e=this,n=t(window);n.on("resize",t.proxy(this.sizeOverlay,this)),this.sizeOverlay(),this.album=[];var a=0;function o(t){e.album.push({alt:t.attr("data-alt"),link:t.attr("href"),title:t.attr("data-title")||t.attr("title")})}var r,s=i.attr("data-lightbox");if(s){r=t(i.prop("tagName")+'[data-lightbox="'+s+'"]');for(var h=0;h<r.length;h=++h)o(t(r[h])),r[h]===i[0]&&(a=h)}else if("lightbox"===i.attr("rel"))o(i);else{r=t(i.prop("tagName")+'[rel="'+i.attr("rel")+'"]');for(var l=0;l<r.length;l=++l)o(t(r[l])),r[l]===i[0]&&(a=l)}var d=n.scrollTop()+this.options.positionFromTop,c=n.scrollLeft();this.$lightbox.css({top:d+"px",left:c+"px"}).fadeIn(this.options.fadeDuration),this.options.disableScrolling&&t("body").addClass("lb-disable-scrolling"),this.changeImage(a)},i.prototype.changeImage=function(i){var e=this,n=this.album[i].link,a=n.split(".").slice(-1)[0],o=this.$lightbox.find(".lb-image");this.disableKeyboardNav(),this.$overlay.fadeIn(this.options.fadeDuration),t(".lb-loader").fadeIn("slow"),this.$lightbox.find(".lb-image, .lb-nav, .lb-prev, .lb-next, .lb-dataContainer, .lb-numbers, .lb-caption").hide(),this.$outerContainer.addClass("animating");var r=new Image;r.onload=function(){var s,h,l,d,c,g;o.attr({alt:e.album[i].alt,src:n}),t(r),o.width(r.width),o.height(r.height),g=t(window).width(),c=t(window).height(),d=g-e.containerPadding.left-e.containerPadding.right-e.imageBorderWidth.left-e.imageBorderWidth.right-20,l=c-e.containerPadding.top-e.containerPadding.bottom-e.imageBorderWidth.top-e.imageBorderWidth.bottom-e.options.positionFromTop-70,"svg"===a&&(0!==r.width&&0!==r.height||(o.width(d),o.height(l))),e.options.fitImagesInViewport?(e.options.maxWidth&&e.options.maxWidth<d&&(d=e.options.maxWidth),e.options.maxHeight&&e.options.maxHeight<l&&(l=e.options.maxHeight)):(d=e.options.maxWidth||r.width||d,l=e.options.maxHeight||r.height||l),(r.width>d||r.height>l)&&(r.width/d>r.height/l?(h=d,s=parseInt(r.height/(r.width/h),10),o.width(h),o.height(s)):(s=l,h=parseInt(r.width/(r.height/s),10),o.width(h),o.height(s))),e.sizeContainer(o.width(),o.height())},r.src=this.album[i].link,this.currentImageIndex=i},i.prototype.sizeOverlay=function(){var i=this;setTimeout((function(){i.$overlay.width(t(document).width()).height(t(document).height())}),0)},i.prototype.sizeContainer=function(t,i){var e=this,n=this.$outerContainer.outerWidth(),a=this.$outerContainer.outerHeight(),o=t+this.containerPadding.left+this.containerPadding.right+this.imageBorderWidth.left+this.imageBorderWidth.right,r=i+this.containerPadding.top+this.containerPadding.bottom+this.imageBorderWidth.top+this.imageBorderWidth.bottom;function s(){e.$lightbox.find(".lb-dataContainer").width(o),e.$lightbox.find(".lb-prevLink").height(r),e.$lightbox.find(".lb-nextLink").height(r),e.$overlay.focus(),e.showImage()}n!==o||a!==r?this.$outerContainer.animate({width:o,height:r},this.options.resizeDuration,"swing",(function(){s()})):s()},i.prototype.showImage=function(){this.$lightbox.find(".lb-loader").stop(!0).hide(),this.$lightbox.find(".lb-image").fadeIn(this.options.imageFadeDuration),this.updateNav(),this.updateDetails(),this.preloadNeighboringImages(),this.enableKeyboardNav()},i.prototype.updateNav=function(){var t=!1;try{document.createEvent("TouchEvent"),t=!!this.options.alwaysShowNavOnTouchDevices}catch(t){}this.$lightbox.find(".lb-nav").show(),this.album.length>1&&(this.options.wrapAround?(t&&this.$lightbox.find(".lb-prev, .lb-next").css("opacity","1"),this.$lightbox.find(".lb-prev, .lb-next").show()):(this.currentImageIndex>0&&(this.$lightbox.find(".lb-prev").show(),t&&this.$lightbox.find(".lb-prev").css("opacity","1")),this.currentImageIndex<this.album.length-1&&(this.$lightbox.find(".lb-next").show(),t&&this.$lightbox.find(".lb-next").css("opacity","1"))))},i.prototype.updateDetails=function(){var t=this;if(void 0!==this.album[this.currentImageIndex].title&&""!==this.album[this.currentImageIndex].title){var i=this.$lightbox.find(".lb-caption");this.options.sanitizeTitle?i.text(this.album[this.currentImageIndex].title):i.html(this.album[this.currentImageIndex].title),i.fadeIn("fast")}if(this.album.length>1&&this.options.showImageNumberLabel){var e=this.imageCountLabel(this.currentImageIndex+1,this.album.length);this.$lightbox.find(".lb-number").text(e).fadeIn("fast")}else this.$lightbox.find(".lb-number").hide();this.$outerContainer.removeClass("animating"),this.$lightbox.find(".lb-dataContainer").fadeIn(this.options.resizeDuration,(function(){return t.sizeOverlay()}))},i.prototype.preloadNeighboringImages=function(){this.album.length>this.currentImageIndex+1&&((new Image).src=this.album[this.currentImageIndex+1].link);this.currentImageIndex>0&&((new Image).src=this.album[this.currentImageIndex-1].link)},i.prototype.enableKeyboardNav=function(){this.$lightbox.on("keyup.keyboard",t.proxy(this.keyboardAction,this)),this.$overlay.on("keyup.keyboard",t.proxy(this.keyboardAction,this))},i.prototype.disableKeyboardNav=function(){this.$lightbox.off(".keyboard"),this.$overlay.off(".keyboard")},i.prototype.keyboardAction=function(t){var i=t.keyCode;27===i?(t.stopPropagation(),this.end()):37===i?0!==this.currentImageIndex?this.changeImage(this.currentImageIndex-1):this.options.wrapAround&&this.album.length>1&&this.changeImage(this.album.length-1):39===i&&(this.currentImageIndex!==this.album.length-1?this.changeImage(this.currentImageIndex+1):this.options.wrapAround&&this.album.length>1&&this.changeImage(0))},i.prototype.end=function(){this.disableKeyboardNav(),t(window).off("resize",this.sizeOverlay),this.$lightbox.fadeOut(this.options.fadeDuration),this.$overlay.fadeOut(this.options.fadeDuration),this.options.disableScrolling&&t("body").removeClass("lb-disable-scrolling")},new i}(window.jQuery);app.initializers.add("jjwind320-formatting",(function(){Object(n.extend)(o.a.prototype,"config",(function(){var t=arguments[1];if(!t){this.$("a.jj-f-a").filter((function(){return this.hostname&&this.hostname!==location.hostname})).addClass("jj-f-a-ext").on("click",(function(){var t=$(this).attr("href");return window.setTimeout((function(){window.open(t,"_blank")}),0),!1})),this.$("div.Post-body").addClass("jj-f-post-body");var i="micromessenger"==window.navigator.userAgent.toLowerCase().match(/MicroMessenger/i);if(i)this.$("img.jj-f-img, img.raw-image").each((function(){$(this).on("click",(function(){var t=$(this).attr("src")||"",i=$(this).parents("article.CommentPost").find("img.jj-f-img, img.raw-image").map((function(){return $(this).attr("src")})).get()||[];wx.ready((function(){wx.previewImage({current:t,urls:i})}))}))}));else{var e=this.props.post.data.id;this.$("img.jj-f-img, img.raw-image").each((function(){var t='<a class="jj-f-img-a" href="'+$(this).attr("src")+'" data-lightbox="post-'+e+'" data-alt="'+($(this).attr("alt")||"")+'" data-title=""></a>';$(this).wrap(t)})),h.option({albumLabel:"%1 / %2"})}}})),Object(n.extend)(s.a.prototype,"mount",(function(){if(console.log("============> Yin shaobin add somethings here!!!"),"micromessenger"==window.navigator.userAgent.toLowerCase().match(/MicroMessenger/i)){$(document.body).on("jj-f-location:changed",(function(){m.request({method:"GET",url:"http://api.film.rimag.com.cn/api/weixin/GetJsSdkUiPackage?url="+encodeURIComponent(location.href.split("#")[0]),withCredentials:!0}).then((function(t){wx.config({debug:!1,appId:t.data.jsSdkUiPackage.appId,timestamp:t.data.jsSdkUiPackage.timestamp,nonceStr:t.data.jsSdkUiPackage.nonceStr,signature:t.data.jsSdkUiPackage.signature,jsApiList:["previewImage","updateAppMessageShareData","updateTimelineShareData"]})}))})).trigger("jj-f-location:changed"),function(t){var i=t.pushState;t.pushState=function(e){"function"==typeof t.onpushstate&&t.onpushstate({state:e});var n=location.href.split("#")[0],a=i.apply(t,arguments),o=location.href.split("#")[0];return n!=o&&setTimeout((function(){$(document.body).trigger("jj-f-location:changed")}),0),a};var e=t.replaceState;t.replaceState=function(i){"function"==typeof t.onreplaceState&&t.onreplaceState({state:i});var n=location.href.split("#")[0],a=e.apply(t,arguments),o=location.href.split("#")[0];return n!=o&&setTimeout((function(){$(document.body).trigger("jj-f-location:changed")}),0),a}}(window.history)}}))}))}]);
//# sourceMappingURL=forum.js.map