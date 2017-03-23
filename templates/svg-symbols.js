;(function(window) {

  var svgSprite = '<svg xmlns="http://www.w3.org/2000/svg"<% if(svgClassname) {%> class="<%= svgClassname %>"<% } %>><% if(defs) {%>' +
'<defs>' +
'<%= defs %>' +
'</defs><% } %>' +
'<% _.forEach( icons, function( icon ){ %>' +
'<symbol id="<%= icon.id %>" viewBox="<%= icon.svg.viewBox %>"<% if (icon.svg.originalAttributes.preserveAspectRatio) {%> preserveAspectRatio="<%= icon.svg.originalAttributes.preserveAspectRatio %>" <% }%>><% if (icon.title) {%>' +
'<title><%= icon.title %></title><% }%>' +
'<%= icon.svg.content %>' +
'</symbol><%}); %></svg>';

  var cssSprite = '<%= noSvgClassname %> <%= iconClassname %>{' +
      'display: inline-block;' +
      '}' +
      '<%= noSvgClassname %> <%= iconClassname %> > * {' +
      'display: none;' +
      '}' +
      '<% _.forEach(icons, function (icon) { %>' +
      '<%= icon.className %> {' +
      'width: <%= icon.width %>' +
      'height: <%= icon.height %>' +
      'background-image: url("data:image/png;base64,<%= icon.pngDatauri %>");' +
      'background-repeat: no-repeat;' +
      'background-position: center center;' +
      'background-size: 100% auto;' +
      '}' +
      '<% }) %>';

  var script = function() {
    var scripts = document.getElementsByTagName('script')
    return scripts[scripts.length - 1]
  }()
  var shouldInjectCss = script.getAttribute("data-injectcss")

  /**
   * document ready
   */
  var ready = function(fn) {
    if (document.addEventListener) {
      if (~["complete", "loaded", "interactive"].indexOf(document.readyState)) {
        setTimeout(fn, 0)
      } else {
        var loadFn = function() {
          document.removeEventListener("DOMContentLoaded", loadFn, false)
          fn()
        }
        document.addEventListener("DOMContentLoaded", loadFn, false)
      }
    } else if (document.attachEvent) {
      IEContentLoaded(window, fn)
    }

    function IEContentLoaded(w, fn) {
      var d = w.document,
        done = false,
        // only fire once
        init = function() {
          if (!done) {
            done = true
            fn()
          }
        }
        // polling for no errors
      var polling = function() {
        try {
          // throws errors until after ondocumentready
          d.documentElement.doScroll('left')
        } catch (e) {
          setTimeout(polling, 50)
          return
        }
        // no errors, fire

        init()
      };

      polling()
        // trying to always fire before onload
      d.onreadystatechange = function() {
        if (d.readyState == 'complete') {
          d.onreadystatechange = null
          init()
        }
      }
    }
  }

  /**
   * Insert el before target
   *
   * @param {Element} el
   * @param {Element} target
   */

  var before = function(el, target) {
    target.parentNode.insertBefore(el, target)
  }

  /**
   * Prepend el to target
   *
   * @param {Element} el
   * @param {Element} target
   */

  var prepend = function(el, target) {
    if (target.firstChild) {
      before(el, target.firstChild)
    } else {
      target.appendChild(el)
    }
  }

  /** 
   * if support svg
   */

	var supportsSvg = function() {
       var div = document.createElement('div');
       div.innerHTML = '<svg/>';
       return (div.firstChild && div.firstChild.namespaceURI) == 'http://www.w3.org/2000/svg';
    };


  function appendSvg() {
    var div, svg

    div = document.createElement('div')
    div.innerHTML = svgSprite
    svgSprite = null
    svg = div.getElementsByTagName('svg')[0]
    if (svg) {
      svg.setAttribute('aria-hidden', 'true')
      svg.style.position = 'absolute'
      svg.style.width = 0
      svg.style.height = 0
      svg.style.overflow = 'hidden'
      prepend(svg, document.body)
    }
  }

  function appendCss() {
  	var style;
    document.documentElement.className += " no-svg";
  	style = document.createElement('style');
  	style.innerText = cssSprite;
  	document.head.appendChild(style);
  	// style.insertAdjacentElement('beforebegin', document.body);
  }

  if (shouldInjectCss && !window.__iconfont__svg__cssinject__) {
    window.__iconfont__svg__cssinject__ = true
    try {
      document.write("<style>.svgfont {display: inline-block;width: 1em;height: 1em;fill: currentColor;vertical-align: -0.1em;font-size:16px;}</style>");
    } catch (e) {
      console && console.log(e)
    }
  }

  function init(){
  	if (supportsSvg()) {
  		appendSvg();
  	} else {
  		appendCss();
  	}
  }

  ready(init)

})(window)