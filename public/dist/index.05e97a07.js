function t(){return(t=Object.assign?Object.assign.bind():function(t){for(var e=1;e<arguments.length;e++){var s=arguments[e];for(var n in s)Object.prototype.hasOwnProperty.call(s,n)&&(t[n]=s[n])}return t}).apply(this,arguments)}var e={strings:["These are the default values...","You know what you should do?","Use your own!","Have a great day!"],stringsElement:null,typeSpeed:0,startDelay:0,backSpeed:0,smartBackspace:!0,shuffle:!1,backDelay:700,fadeOut:!1,fadeOutClass:"typed-fade-out",fadeOutDelay:500,loop:!1,loopCount:1/0,showCursor:!0,cursorChar:"|",autoInsertCss:!0,attr:null,bindInputFocusEvents:!1,contentType:"html",onBegin:function(t){},onComplete:function(t){},preStringTyped:function(t,e){},onStringTyped:function(t,e){},onLastStringBackspaced:function(t){},onTypingPaused:function(t,e){},onTypingResumed:function(t,e){},onReset:function(t){},onStop:function(t,e){},onStart:function(t,e){},onDestroy:function(t){}},s=new/*#__PURE__*/(function(){function s(){}var n=s.prototype;return n.load=function(s,n,i){if(s.el="string"==typeof i?document.querySelector(i):i,s.options=t({},e,n),s.isInput="input"===s.el.tagName.toLowerCase(),s.attr=s.options.attr,s.bindInputFocusEvents=s.options.bindInputFocusEvents,s.showCursor=!s.isInput&&s.options.showCursor,s.cursorChar=s.options.cursorChar,s.cursorBlinking=!0,s.elContent=s.attr?s.el.getAttribute(s.attr):s.el.textContent,s.contentType=s.options.contentType,s.typeSpeed=s.options.typeSpeed,s.startDelay=s.options.startDelay,s.backSpeed=s.options.backSpeed,s.smartBackspace=s.options.smartBackspace,s.backDelay=s.options.backDelay,s.fadeOut=s.options.fadeOut,s.fadeOutClass=s.options.fadeOutClass,s.fadeOutDelay=s.options.fadeOutDelay,s.isPaused=!1,s.strings=s.options.strings.map(function(t){return t.trim()}),s.stringsElement="string"==typeof s.options.stringsElement?document.querySelector(s.options.stringsElement):s.options.stringsElement,s.stringsElement){s.strings=[],s.stringsElement.style.cssText="clip: rect(0 0 0 0);clip-path:inset(50%);height:1px;overflow:hidden;position:absolute;white-space:nowrap;width:1px;";var r=Array.prototype.slice.apply(s.stringsElement.children),o=r.length;if(o)for(var a=0;a<o;a+=1)s.strings.push(r[a].innerHTML.trim())}for(var u in s.strPos=0,s.currentElContent=this.getCurrentElContent(s),s.currentElContent&&s.currentElContent.length>0&&(s.strPos=s.currentElContent.length-1,s.strings.unshift(s.currentElContent)),s.sequence=[],s.strings)s.sequence[u]=u;s.arrayPos=0,s.stopNum=0,s.loop=s.options.loop,s.loopCount=s.options.loopCount,s.curLoop=0,s.shuffle=s.options.shuffle,s.pause={status:!1,typewrite:!0,curString:"",curStrPos:0},s.typingComplete=!1,s.autoInsertCss=s.options.autoInsertCss,s.autoInsertCss&&(this.appendCursorAnimationCss(s),this.appendFadeOutAnimationCss(s))},n.getCurrentElContent=function(t){return t.attr?t.el.getAttribute(t.attr):t.isInput?t.el.value:"html"===t.contentType?t.el.innerHTML:t.el.textContent},n.appendCursorAnimationCss=function(t){var e="data-typed-js-cursor-css";if(t.showCursor&&!document.querySelector("["+e+"]")){var s=document.createElement("style");s.setAttribute(e,"true"),s.innerHTML="\n        .typed-cursor{\n          opacity: 1;\n        }\n        .typed-cursor.typed-cursor--blink{\n          animation: typedjsBlink 0.7s infinite;\n          -webkit-animation: typedjsBlink 0.7s infinite;\n                  animation: typedjsBlink 0.7s infinite;\n        }\n        @keyframes typedjsBlink{\n          50% { opacity: 0.0; }\n        }\n        @-webkit-keyframes typedjsBlink{\n          0% { opacity: 1; }\n          50% { opacity: 0.0; }\n          100% { opacity: 1; }\n        }\n      ",document.body.appendChild(s)}},n.appendFadeOutAnimationCss=function(t){var e="data-typed-fadeout-js-css";if(t.fadeOut&&!document.querySelector("["+e+"]")){var s=document.createElement("style");s.setAttribute(e,"true"),s.innerHTML="\n        .typed-fade-out{\n          opacity: 0;\n          transition: opacity .25s;\n        }\n        .typed-cursor.typed-cursor--blink.typed-fade-out{\n          -webkit-animation: 0;\n          animation: 0;\n        }\n      ",document.body.appendChild(s)}},s}()),n=new/*#__PURE__*/(function(){function t(){}var e=t.prototype;return e.typeHtmlChars=function(t,e,s){if("html"!==s.contentType)return e;var n,i=t.substring(e).charAt(0);if("<"===i||"&"===i){for(n="<"===i?">":";";t.substring(e+1).charAt(0)!==n&&!(1+ ++e>t.length););e++}return e},e.backSpaceHtmlChars=function(t,e,s){if("html"!==s.contentType)return e;var n,i=t.substring(e).charAt(0);if(">"===i||";"===i){for(n=">"===i?"<":"&";t.substring(e-1).charAt(0)!==n&&!(--e<0););e--}return e},t}()),i=/*#__PURE__*/function(){function t(t,e){s.load(this,e,t),this.begin()}var e=t.prototype;return e.toggle=function(){this.pause.status?this.start():this.stop()},e.stop=function(){this.typingComplete||this.pause.status||(this.toggleBlinking(!0),this.pause.status=!0,this.options.onStop(this.arrayPos,this))},e.start=function(){this.typingComplete||this.pause.status&&(this.pause.status=!1,this.pause.typewrite?this.typewrite(this.pause.curString,this.pause.curStrPos):this.backspace(this.pause.curString,this.pause.curStrPos),this.options.onStart(this.arrayPos,this))},e.destroy=function(){this.reset(!1),this.options.onDestroy(this)},e.reset=function(t){void 0===t&&(t=!0),clearInterval(this.timeout),this.replaceText(""),this.cursor&&this.cursor.parentNode&&(this.cursor.parentNode.removeChild(this.cursor),this.cursor=null),this.strPos=0,this.arrayPos=0,this.curLoop=0,t&&(this.insertCursor(),this.options.onReset(this),this.begin())},e.begin=function(){var t=this;this.options.onBegin(this),this.typingComplete=!1,this.shuffleStringsIfNeeded(this),this.insertCursor(),this.bindInputFocusEvents&&this.bindFocusEvents(),this.timeout=setTimeout(function(){0===t.strPos?t.typewrite(t.strings[t.sequence[t.arrayPos]],t.strPos):t.backspace(t.strings[t.sequence[t.arrayPos]],t.strPos)},this.startDelay)},e.typewrite=function(t,e){var s=this;this.fadeOut&&this.el.classList.contains(this.fadeOutClass)&&(this.el.classList.remove(this.fadeOutClass),this.cursor&&this.cursor.classList.remove(this.fadeOutClass));var i=this.humanizer(this.typeSpeed),r=1;!0!==this.pause.status?this.timeout=setTimeout(function(){e=n.typeHtmlChars(t,e,s);var i,o=0,a=t.substring(e);if("^"===a.charAt(0)&&/^\^\d+/.test(a)&&(i=1+(a=/\d+/.exec(a)[0]).length,o=parseInt(a),s.temporaryPause=!0,s.options.onTypingPaused(s.arrayPos,s),t=t.substring(0,e)+t.substring(e+i),s.toggleBlinking(!0)),"`"===a.charAt(0)){for(;"`"!==t.substring(e+r).charAt(0)&&(r++,!(e+r>t.length)););var u=t.substring(0,e),c=t.substring(u.length+1,e+r);t=u+c+t.substring(e+r+1),r--}s.timeout=setTimeout(function(){s.toggleBlinking(!1),e>=t.length?s.doneTyping(t,e):s.keepTyping(t,e,r),s.temporaryPause&&(s.temporaryPause=!1,s.options.onTypingResumed(s.arrayPos,s))},o)},i):this.setPauseStatus(t,e,!0)},e.keepTyping=function(t,e,s){0===e&&(this.toggleBlinking(!1),this.options.preStringTyped(this.arrayPos,this));var n=t.substring(0,e+=s);this.replaceText(n),this.typewrite(t,e)},e.doneTyping=function(t,e){var s=this;this.options.onStringTyped(this.arrayPos,this),this.toggleBlinking(!0),this.arrayPos===this.strings.length-1&&(this.complete(),!1===this.loop||this.curLoop===this.loopCount)||(this.timeout=setTimeout(function(){s.backspace(t,e)},this.backDelay))},e.backspace=function(t,e){var s=this;if(!0!==this.pause.status){if(this.fadeOut)return this.initFadeOut();this.toggleBlinking(!1);var i=this.humanizer(this.backSpeed);this.timeout=setTimeout(function(){e=n.backSpaceHtmlChars(t,e,s);var i=t.substring(0,e);if(s.replaceText(i),s.smartBackspace){var r=s.strings[s.arrayPos+1];s.stopNum=r&&i===r.substring(0,e)?e:0}e>s.stopNum?(e--,s.backspace(t,e)):e<=s.stopNum&&(s.arrayPos++,s.arrayPos===s.strings.length?(s.arrayPos=0,s.options.onLastStringBackspaced(),s.shuffleStringsIfNeeded(),s.begin()):s.typewrite(s.strings[s.sequence[s.arrayPos]],e))},i)}else this.setPauseStatus(t,e,!1)},e.complete=function(){this.options.onComplete(this),this.loop?this.curLoop++:this.typingComplete=!0},e.setPauseStatus=function(t,e,s){this.pause.typewrite=s,this.pause.curString=t,this.pause.curStrPos=e},e.toggleBlinking=function(t){this.cursor&&(this.pause.status||this.cursorBlinking!==t&&(this.cursorBlinking=t,t?this.cursor.classList.add("typed-cursor--blink"):this.cursor.classList.remove("typed-cursor--blink")))},e.humanizer=function(t){return Math.round(Math.random()*t/2)+t},e.shuffleStringsIfNeeded=function(){this.shuffle&&(this.sequence=this.sequence.sort(function(){return Math.random()-.5}))},e.initFadeOut=function(){var t=this;return this.el.className+=" "+this.fadeOutClass,this.cursor&&(this.cursor.className+=" "+this.fadeOutClass),setTimeout(function(){t.arrayPos++,t.replaceText(""),t.strings.length>t.arrayPos?t.typewrite(t.strings[t.sequence[t.arrayPos]],0):(t.typewrite(t.strings[0],0),t.arrayPos=0)},this.fadeOutDelay)},e.replaceText=function(t){this.attr?this.el.setAttribute(this.attr,t):this.isInput?this.el.value=t:"html"===this.contentType?this.el.innerHTML=t:this.el.textContent=t},e.bindFocusEvents=function(){var t=this;this.isInput&&(this.el.addEventListener("focus",function(e){t.stop()}),this.el.addEventListener("blur",function(e){t.el.value&&0!==t.el.value.length||t.start()}))},e.insertCursor=function(){this.showCursor&&(this.cursor||(this.cursor=document.createElement("span"),this.cursor.className="typed-cursor",this.cursor.setAttribute("aria-hidden",!0),this.cursor.innerHTML=this.cursorChar,this.el.parentNode&&this.el.parentNode.insertBefore(this.cursor,this.el.nextSibling)))},t}();const r=document.querySelector(".popUp"),o=document.querySelectorAll("section"),a=document.querySelector("header"),u=document.querySelector(".popupTitle"),c=document.querySelector(".signup-form"),l=document.querySelector(".login-form"),p=document.querySelector(".success"),h=document.querySelector(".signup-btn"),d=document.querySelector(".login-btn"),y=document.querySelector(".get-started"),g=document.querySelector(".fa-bars"),f=document.querySelector(".sidebar"),m=document.querySelector(".login-sidebar"),b=document.querySelector(".signup-sidebar");new i(".typed-text",{strings:[" Student Logs"," ID Management"," School Admins"],typeSpeed:50,backSpeed:50,loop:!0,showCursor:!1});const v=()=>{r.classList.add("slideup"),o.forEach(t=>t.classList.add("blurred")),a.classList.add("blurred")},C=()=>{o.forEach(t=>t.classList.remove("blurred")),r.classList.remove("slideup"),a.classList.remove("blurred")},S=()=>{u.textContent="Sign Up",c.classList.remove("hidden"),l.classList.add("hidden"),p.classList.add("hidden"),v()},k=()=>{u.textContent="Log In",l.classList.remove("hidden"),c.classList.add("hidden"),p.classList.add("hidden"),v()};h.addEventListener("click",S),b.addEventListener("click",()=>{S(),f.classList.remove("sidebar-active")}),d.addEventListener("click",k),m.addEventListener("click",()=>{k(),f.classList.remove("sidebar-active")}),y.addEventListener("click",t=>{t.stopPropagation(),S()}),document.addEventListener("keydown",t=>{"Escape"===t.key&&a.classList.contains("blurred")&&C()}),document.body.addEventListener("click",t=>{t.target.closest("section")&&(a.classList.contains("blurred")&&C(),f.classList.contains("sidebar-active")&&f.classList.remove("sidebar-active"))}),g.addEventListener("click",()=>{f.classList.add("sidebar-active"),o.forEach(t=>t.classList.add("blurred")),a.classList.add("blurred")});const L=()=>{u.textContent="",c.classList.add("hidden"),p.classList.remove("hidden")};c.addEventListener("submit",async t=>{t.preventDefault();let e=Object.fromEntries(new FormData(c).entries());try{let t=await fetch("/users/signup",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(e)}),s=await t.json();console.log(s),"Success"===s.status&&(c.reset(),L(),setTimeout(()=>C(),5e3))}catch(t){console.error(t)}}),l.addEventListener("submit",async t=>{t.preventDefault();let e=Object.fromEntries(new FormData(l).entries());try{let t=await fetch("/users/login",{method:"POST",headers:{"Content-type":"application/json"},body:JSON.stringify(e)}),s=await t.json();console.log(s),"Success"===s.status&&(l.reset(),C())}catch(t){console.error(t)}});
//# sourceMappingURL=index.05e97a07.js.map
