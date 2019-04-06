parcelRequire=function(e){var r="function"==typeof parcelRequire&&parcelRequire,n="function"==typeof require&&require,i={};function u(e,u){if(e in i)return i[e];var t="function"==typeof parcelRequire&&parcelRequire;if(!u&&t)return t(e,!0);if(r)return r(e,!0);if(n&&"string"==typeof e)return n(e);var o=new Error("Cannot find module '"+e+"'");throw o.code="MODULE_NOT_FOUND",o}return u.register=function(e,r){i[e]=r},i=e(u),u.modules=i,u}(function (require) {var s={};const qa="*";const l=Symbol();const aa=(e,t={})=>{const r=Reflect.ownKeys(e),o=Reflect.ownKeys(t),n=Symbol("isa");function p(t){for(let o of r){const r=Object.getOwnPropertyDescriptor(t.prototype,o);!r||r.configurable?Object.defineProperty(t.prototype,o,{value:e[o],writable:!0}):console.log(`not patching: ${t.name}.${o.toString()}`)}return Object.defineProperty(t.prototype,n,{value:!0}),t}for(let i of o)Object.defineProperty(p,i,{value:t[i],enumerable:t.propertyIsEnumerable(i)});return Object.defineProperty(p,Symbol.hasInstance,{value:e=>!!e[n]}),p};class Da extends Error{constructor(r){super("illegal argument(s)"+(void 0!==r?": "+r:""))}}const x=r=>{throw new Da(r)};class ja extends Error{constructor(r){super(`illegal arity: ${r}`)}}const $=r=>{throw new ja(r)};class Ka extends Error{constructor(t){super("illegal state"+(void 0!==t?": "+t:""))}}const Pa=t=>{throw new Ka(t)};const Z=(t,i)=>{if(t)for(let e,r=0,s=t.length;r<s;r++)if((e=t[r])[0].call(e[1],i),i.canceled)return};const ea=aa({addListener(t,i,e){let r=(this._listeners=this._listeners||{})[t];return r||(r=this._listeners[t]=[]),-1===this.__listener(r,i,e)&&(r.push([i,e]),!0)},removeListener(t,i,e){if(!this._listeners)return!1;const r=this._listeners[t];if(r){const t=this.__listener(r,i,e);if(-1!==t)return r.splice(t,1),!0}return!1},notify(t){this._listeners&&(void 0===t.target&&(t.target=this),Z(this._listeners[t.id],t),Z(this._listeners[qa],t))},__listener(t,i,e){let r=t.length;for(;--r>=0;){const s=t[r];if(s[0]===i&&s[1]===e)break}return r}});const ga=aa({addWatch(t,h){return this._watches=this._watches||{},!this._watches[t]&&(this._watches[t]=h,!0)},removeWatch(t){if(this._watches)return!!this._watches[t]&&(delete this._watches[t],!0)},notifyWatches(t,h){if(!this._watches)return;const e=this._watches;for(let i in e)e[i](i,t,h)}});const F=o=>"function"==typeof o;const U=(n,t)=>null!=n&&"function"==typeof n[t];const c=Array.isArray;const Q=t=>null!=t&&"string"!=typeof t&&"function"==typeof t[Symbol.iterator];const P=Object.getPrototypeOf,rb=e=>{let $;return null!=e&&"object"==typeof e&&(null===($=P(e))||null===P($))};const xb=e=>e instanceof Promise;const f=s=>"string"==typeof s;const da=Array.isArray,ia=f,b=t=>da(t)?t.slice():Object.assign({},t),na=(t,$)=>(e,r)=>(e=b(e),e[t]=$?$(e[t],r):r,e),C=t=>da(t)?t:ia(t)?t.length>0?t.split("."):[]:null!=t?[t]:[];const K=t=>{const $=C(t);let[e,r,a,n]=$;switch($.length){case 0:return t=>t;case 1:return t=>null!=t?t[e]:void 0;case 2:return t=>null!=t&&null!=(t=t[e])?t[r]:void 0;case 3:return t=>null!=t&&null!=(t=t[e])&&null!=(t=t[r])?t[a]:void 0;case 4:return t=>null!=t&&null!=(t=t[e])&&null!=(t=t[r])&&null!=(t=t[a])?t[n]:void 0;default:return t=>{const e=$.length-1;let r=t;for(let a=0;null!=r&&a<=e;a++)r=r[$[a]];return r};}};const A=t=>{const $=C(t);let[e,r,a,n]=$;switch($.length){case 0:return(t,$)=>$;case 1:return(t,$)=>(t=b(t),t[e]=$,t);case 2:return(t,$)=>{let a;return(t=b(t))[e]=a=b(t[e]),a[r]=$,t};case 3:return(t,$)=>{let n,o;return(t=b(t))[e]=n=b(t[e]),n[r]=o=b(n[r]),o[a]=$,t};case 4:return(t,$)=>{let o,s,f;return(t=b(t))[e]=o=b(t[e]),o[r]=s=b(o[r]),s[a]=f=b(s[a]),f[n]=$,t};default:let t;for(let e=$.length;--e>=0;)t=na($[e],t);return t;}};const z=(t,$,e)=>A($)(t,e);const y=(t,$,e,...r)=>A($)(t,e.apply(null,(r.unshift(K($)(t)),r)));const _=Object.getPrototypeOf({}),j=(e,t)=>{let $;return e===t||(null==e?e==t:"function"==typeof e.equiv?e.equiv(t):null==t?e==t:"function"==typeof t.equiv?t.equiv(e):"string"!=typeof e&&"string"!=typeof t&&(null!=($=Object.getPrototypeOf(e))&&$!==_||null!=($=Object.getPrototypeOf(t))&&$!==_?"function"!=typeof e&&void 0!==e.length&&"function"!=typeof t&&void 0!==t.length?I(e,t):e instanceof Set&&t instanceof Set?N(e,t):e instanceof Map&&t instanceof Map?J(e,t):e instanceof Date&&t instanceof Date?e.getTime()===t.getTime():e instanceof RegExp&&t instanceof RegExp?e.toString()===t.toString():e!=e&&t!=t:R(e,t)))};const I=(e,t,$=j)=>{let o=e.length;if(o===t.length)for(;--o>=0&&$(e[o],t[o]););return o<0};const N=(e,t,$=j)=>e.size===t.size&&$([...e.keys()].sort(),[...t.keys()].sort());const J=(e,t,$=j)=>e.size===t.size&&$([...e].sort(),[...t].sort());const R=(e,t,$=j)=>{if(Object.keys(e).length!==Object.keys(t).length)return!1;for(let o in e)if(!t.hasOwnProperty(o)||!$(e[o],t[o]))return!1;return!0};let ta=0;const ua=()=>ta++;class va{constructor(t,i,s,e=!0,r=j){this.parent=t,this.id=`view-${ua()}`,this.tx=s||(t=>t),this.path=C(i),this.isDirty=!0,this.isLazy=e;const h=K(this.path),$=this.parent.deref();this.unprocessed=$?h($):void 0,e||(this.state=this.tx(this.unprocessed),this.unprocessed=void 0),t.addWatch(this.id,(t,i,s)=>{const $=i?h(i):i,a=s?h(s):s;r(a,$)||(e?this.unprocessed=a:this.state=this.tx(a),this.isDirty=!0)})}get value(){return this.deref()}deref(){return this.isDirty&&(this.isLazy&&(this.state=this.tx(this.unprocessed),this.unprocessed=void 0),this.isDirty=!1),this.state}changed(){return this.isDirty}view(){return this.isDirty&&this.isLazy?this.tx(this.unprocessed):this.state}release(){return this.unprocessed=void 0,this.isLazy||(this.state=this.tx(void 0)),this.isDirty=!0,this.parent.removeWatch(this.id)}}var wa=s&&s.__decorate||function(e,t,r,i){var $,a=arguments.length,s=a<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,r):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,r,i);else for(var o=e.length-1;o>=0;o--)($=e[o])&&(s=(a<3?$(s):a>3?$(t,r,s):$(t,r))||s);return a>3&&s&&Object.defineProperty(t,r,s),s};let i=class{constructor(e,t){t&&!t(e)&&Pa("initial state value did not validate"),this._value=e,this.valid=t}get value(){return this._value}set value(e){this.reset(e)}deref(){return this._value}equiv(e){return this===e}reset(e){const t=this._value;return this.valid&&!this.valid(e)?t:(this._value=e,this.notifyWatches(t,e),e)}resetIn(e,t){return this.reset(z(this._value,e,t))}swap(e,...t){return this.reset(e.apply(null,[this._value,...t]))}swapIn(e,t,...r){return this.reset(y(this._value,e,t,...r))}addWatch(e,t){return!1}removeWatch(e){return!1}notifyWatches(e,t){}addView(e,t,r=!0){return new va(this,e,t,r)}release(){return delete this._watches,delete this._value,!0}};i=wa([ga],i),s.Atom=i,s.Atom=i;let B,t;let ab=[],db=[];const eb=$=>B&&B.length>=$?B:B=new Int32Array($),fb=$=>t&&t.length>=$?t:t=new Int32Array($),M=($,e,s,a,r)=>{const t=e.length,c=$.linear;if($.distance=t,0!==r){for(let $=0,s=0;$<t;$++,s+=3)c[s]=a,c[s+1]=$,c[s+2]=e[$];if(2===r){const a=$[s];for(let $=0;$<t;$++)a[$]=e[$]}}return $},jb=($,e,s=2,a=j)=>{const r={distance:0,adds:{},dels:{},const:{},linear:[]};if($===e||null==$&&null==e)return r;if(null==$||0===$.length)return M(r,e,"adds",1,s);if(null==e||0===e.length)return M(r,$,"dels",-1,s);const t=$.length>=e.length;let c,l,n,h;t?(c=e,l=$):(c=$,l=e),n=c.length,h=l.length;const d=n+1,o=h-n,i=o+d,q=n+h+3,O=fb(q).fill(-1,0,q),f=eb(q).fill(-1,0,q),v=ab,u=db;v.length=0,u.length=0;const P=($,e,s)=>{const r=$+d;let t,o;e>s?(t=O[r-1],o=e):(t=O[r+1],o=s);let i=o-$;for(;i<n&&o<h&&a(c[i],l[o]);)i++,o++;return O[r]=u.length/3,u.push(i,o,t),o};let g,p,_=-1;do{for(p=(g=-++_)+d;g<o;g++,p++)f[p]=P(g,f[p-1]+1,f[p+1]);for(p=(g=o+_)+d;g>o;g--,p--)f[p]=P(g,f[p-1]+1,f[p+1]);f[i]=P(o,f[i-1]+1,f[i+1])}while(f[i]!==h);if(r.distance=o+2*_,0!==s){for(_=3*O[i];_>=0;)v.push(_),_=3*u[_+2];2===s?kb(v,u,r,c,l,t):lb(v,u,r,c,l,t)}return r};const kb=($,e,s,a,r,t)=>{const c=s.linear,l=s.const;let n,h,d,o,i=$.length,q=0,O=0;for(t?(n=s.dels,h=s.adds,d=-1,o=1):(n=s.adds,h=s.dels,d=1,o=-1);--i>=0;){const s=$[i],t=e[s],f=e[s+1],v=f-t;for(;q<t||O<f;){const $=O-q;v>$?(c.push(d,O,n[O]=r[O]),O++):v<$?(c.push(o,q,h[q]=a[q]),q++):(c.push(0,q,l[q]=a[q]),q++,O++)}}},lb=($,e,s,a,r,t)=>{const c=s.linear,l=t?-1:1,n=t?1:-1;let h=$.length,d=0,o=0;for(;--h>=0;){const s=$[h],t=e[s],i=e[s+1],q=i-t;for(;d<t||o<i;){const $=o-d;q>$?(c.push(l,o,r[o]),o++):q<$?(c.push(n,d,a[d]),d++):(c.push(0,d,a[d]),d++,o++)}}};const mb=(t,e,n=2,$=j)=>t===e?{distance:0}:0===n?ob(t,e,$):qb(t,e,$);const ob=(t,e,n)=>{let $=0;for(let i in t){const r=e[i];(void 0===r||!n(t[i],r))&&$++}for(let i in e)!(i in t)&&$++;return{distance:$}},qb=(t,e,n)=>{let $=0;const i=[],r=[],a=[];for(let f in t){const i=e[f];void 0===i?(r.push(f),$++):n(t[f],i)||(a.push(f,i),$++)}for(let f in e)f in t||(i.push(f),$++);return{distance:$,adds:i,dels:r,edits:a}};const m=Array.isArray,ub=Math.max,S=(()=>{const e=new Array(2048);for(let t=2,r=e.length;t<r;t++)e[t]=t-2;return e})(),zb=e=>{if(e<=S.length)return S.slice(0,e);const t=new Array(e);for(;--e>=2;)t[e]=e-2;return t},Y=(e,t,r,$,i,p=0)=>{const o=i[1];if(o.__skip)return;if(!1===o.__diff)return k($),void t.replaceChild(e,r,p,i);let n=o.__impl;if(n&&n!==t)return n.diffTree(e,n,r,$,i,p);const a=jb($,i,1,h);if(0===a.distance)return;const f=a.linear,s=t.getChild(r,p);let l,H,v,u,c,d,x,_;if(0!==f[0]||$[1].key!==o.key)return k($),void t.replaceChild(e,r,p,i);if((_=$.__release)&&_!==i.__release&&k($),0!==f[3]&&(fa(t,s,$[1],i[1]),2===a.distance))return;const g=f.length,y=$.length-1,q=ha(f),A=zb(y+1);for(l=2,H=6;H<g;l++,H+=3)if(-1===(x=f[H])){if(_=f[H+2],m(_)){if(void 0!==(c=_[1].key)&&void 0!==q[c][2])c=(d=q[c])[0],Y(e,t,s,$[c],i[d[2]],A[c]);else for(u=f[H+1],k(_),t.removeChild(s,A[u]),v=y;v>u;v--)A[v]=ub(A[v]-1,0);}else"string"==typeof _&&t.setContent(s,"");}else if(1===x)if("string"==typeof(_=f[H+2]))t.setContent(s,_);else if(m(_)&&(void 0===(c=_[1].key)||void 0===q[c][0]))for(u=f[H+1],t.createTree(e,s,_,A[u]),v=y;v>=u;v--)A[v]++;(_=i.__init)&&_!=$.__init&&_.apply(i,[s,...i.__args])};const fa=(e,t,r,$)=>{const i=mb(r,$,2,j);e.removeAttribs(t,i.dels,r);let p,o,n,a=l;for(p=(n=i.edits).length;(p-=2)>=0;){const i=n[p];0===i.indexOf("on")&&e.removeAttribs(t,[i],r),"value"!==i?e.setAttrib(t,i,n[p+1],$):a=n[p+1]}for(p=(n=i.adds).length;--p>=0;)"value"!==(o=n[p])?e.setAttrib(t,o,$[o],$):a=$[o];a!==l&&e.setAttrib(t,"value",a,$)};const k=e=>{if(m(e)){let t;if((t=e[1])&&!1===t.__release)return;for(e.__release&&(e.__release.apply(e.__this,e.__args),delete e.__release),t=e.length;--t>=2;)k(e[t])}};const ha=e=>{let t,r,$;const i={};for(let p=e.length;(p-=3)>=0;)r=e[p+2],m(r)&&void 0!==(t=r[1].key)&&(!($=i[t])&&(i[t]=$=[,,]),$[e[p]+1]=e[p+1]);return i},H=Object.getPrototypeOf({}),h=(e,t)=>{let r;return e===t||(null==e?e==t:"function"==typeof e.equiv?e.equiv(t):null==t?e==t:"function"==typeof t.equiv?t.equiv(e):"string"!=typeof e&&"string"!=typeof t&&(null!=(r=Object.getPrototypeOf(e))&&r!==H||null!=(r=Object.getPrototypeOf(t))&&r!==H?"function"!=typeof e&&void 0!==e.length&&"function"!=typeof t&&void 0!==t.length?I(e,t,h):e instanceof Set&&t instanceof Set?N(e,t,h):e instanceof Map&&t instanceof Map?J(e,t,h):e instanceof Date&&t instanceof Date?e.getTime()===t.getTime():e instanceof RegExp&&t instanceof RegExp?e.toString()===t.toString():e!=e&&t!=t:!(!1===e.__diff||!1===t.__diff)&&R(e,t,h)))};const ka="http://www.w3.org/2000/svg";const la=/^([^\s\.#]+)(?:#([^\s\.#]+))?(?:\.([^\s#]+))?$/;const ma="animate animateColor animateMotion animateTransform circle clipPath color-profile defs desc discard ellipse feBlend feColorMatrix feComponentTransfer feComposite feConvolveMatrix feDiffuseLighting feDisplacementMap feDistantLight feDropShadow feFlood feFuncA feFuncB feFuncG feFuncR feGaussianBlur feImage feMerge feMergeNode feMorphology feOffset fePointLight feSpecularLighting feSpotLight feTile feTurbulence filter font foreignObject g image line linearGradient marker mask metadata mpath path pattern polygon polyline radialGradient rect set stop style svg switch symbol text textPath title tref tspan use view".split(" ").reduce((e,o)=>(e[o]=1,e),{});const Fb="area base br circle col command ellipse embed hr img input keygen line link meta param path polygon polyline rect source stop track use wbr ?xml".split(" ").reduce((e,o)=>(e[o]=1,e),{});const oa={"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&apos;"};const pa={button:1,option:1,text:1,textarea:1};const Gb=new RegExp(`[${Object.keys(oa)}]`,"g");const ra=$=>{let n,r="";for(let e in $)n=$[e],F(n)&&(n=n($)),null!=n&&(r+=`${e}:${n};`);return r};const sa=(e,t)=>{if(null==e||!t||!t.length)return e;const r=Object.assign({},e);for(let n of t){const e=r[n];U(e,"deref")&&(r[n]=e.deref())}return r};const o=c,L=Q,p=(e,t,r,s,$)=>{if(o(s)){const o=s[0];if("function"==typeof o)return p(e,t,r,o.apply(null,[e.ctx,...s.slice(1)]),$);const n=s[1];if(n.__impl)return n.__impl.createTree(e,r,s,$);const i=t.createElement(r,o,n,$);if(s.length>2){const r=s.length;for(let $=2;$<r;$++)p(e,t,i,s[$])}return s.__init&&s.__init.apply(s.__this,[i,...s.__args]),i}if(L(s)){const $=[];for(let o of s)$.push(p(e,t,r,o));return $}return null==s?r:t.createTextElement(r,s)};const v=(e,t,r,s,$=0)=>{if(o(s)){const o=t.getChild(r,$);"function"==typeof s[0]&&v(e,t,r,s[0].apply(null,[e.ctx,...s.slice(1)]),$);const n=s[1];if(n.__impl)return n.__impl.hydrateTree(e,r,s,$);s.__init&&s.__init.apply(s.__this,[o,...s.__args]);for(let e in n)0===e.indexOf("on")&&t.setAttrib(o,e,n[e]);for(let r=s.length,$=2;$<r;$++)v(e,t,o,s[$],$-2)}else if(L(s))for(let o of s)v(e,t,r,o,$),$++};const xa=(e,t,r,s)=>{const $=ma[t]?document.createElementNS(ka,t):document.createElement(t);return e&&(null==s?e.appendChild($):e.insertBefore($,e.children[s])),r&&Ca($,r),$};const ya=(e,t,r)=>{const s=document.createTextNode(t);return e&&(void 0===r?e.appendChild(s):e.insertBefore(s,e.children[r])),s};const za=(e,t)=>e.children[t];const Aa=(e,t,r,s,$)=>(t.removeChild(r,s),t.createTree(e,r,$,s));const Ba=(e,t)=>e.textContent=t;const Ca=(e,t)=>{for(let r in t)O(e,r,t[r],t);return e};const O=(e,t,r,s)=>{if(t.startsWith("__"))return;const $=0===t.indexOf("on");if($||"function"!=typeof r||(r=r(s)),void 0!==r&&!1!==r)switch(t){case"style":Ga(e,r);break;case"value":Ea(e,r);break;case"id":case"checked":case"scrollTop":case"scrollLeft":e[t]=r;break;default:$?Ha(e,t.substr(2),r):e.setAttribute(t,r);}else null!=e[t]?e[t]=null:e.removeAttribute(t);return e};const Ea=(e,t)=>{let r;switch(e.type){case"text":case"textarea":case"password":case"search":case"number":case"email":case"url":case"tel":case"date":case"datetime-local":case"time":case"week":case"month":if(void 0!==(r=e.value)&&"string"==typeof t){const s=t.length-(r.length-e.selectionStart);e.value=t,e.selectionStart=e.selectionEnd=s;break}default:e.value=t;}};const Fa=(e,t,r)=>{for(let s=t.length;--s>=0;){const $=t[s];0===$.indexOf("on")?Ia(e,$.substr(2),r[$]):e[$]?e[$]=null:e.removeAttribute($)}};const Ga=(e,t)=>(e.setAttribute("style",ra(t)),e);const Ha=(e,t,r)=>{o(r)?e.addEventListener(t,...r):e.addEventListener(t,r)};const Ia=(e,t,r)=>{o(r)?e.removeEventListener(t,...r):e.removeEventListener(t,r)};const Ja=(e,t)=>{const r=e.children[t];void 0!==r&&e.removeChild(r)};const u=c,La=Q,Ma=rb,Na=(e,r)=>{let $,i,t,n,p=e[0],a=Ma(e[1]);return"string"==typeof p&&($=la.exec(p))||x(`${p} is not a valid tag name`),p!==$[1]||!a||r&&!e[1].key?(n=a?Object.assign({},e[1]):{},i=$[2],t=$[3],i&&(n.id=i),t&&(t=t.replace(/\./g," "),n.class?n.class+=" "+t:n.class=t),n.__skip&&e.length<3?[$[1],n,""]:[$[1],n,...e.slice(a?2:1)]):e};const Oa=(e,r)=>d(r,e,e.ctx,[0],!1!==e.keys,!1!==e.span);const d=(e,r,$,i,t,n)=>{if(null!=e){if(u(e)){if(0===e.length)return;let p,a,o=e[1];if(o&&(a=o.__impl)&&(a=a.normalizeTree))return a(r,e);const l=e[0];if("function"==typeof l)return d(l.apply(null,[$,...e.slice(1)]),r,$,i,t,n);if("function"==typeof l.render){const a=[$,...e.slice(1)];return p=d(l.render.apply(l,a),r,$,i,t,n),u(p)&&(p.__this=l,p.__init=l.init,p.__release=l.release,p.__args=a),p}if(!1===(o=(p=Na(e,t))[1]).__normalize)return p;if(t&&void 0===o.key&&(o.key=i.join("-")),p.length>2){const e=p[0],a=[e,o];n=n&&!pa[e];for(let o=2,l=2,s=0,c=p.length;o<c;o++){let e=p[o];if(null!=e){const p=u(e);if(p&&u(e[0])||!p&&La(e))for(let o of e)void 0!==(o=d(o,r,$,i.concat(s),t,n))&&(a[l++]=o),s++;else void 0!==(e=d(e,r,$,i.concat(s),t,n))&&(a[l++]=e),s++}}return a}return p}return"function"==typeof e?d(e($),r,$,i,t,n):"function"==typeof e.toHiccup?d(e.toHiccup(r.ctx),r,$,i,t,n):"function"==typeof e.deref?d(e.deref(),r,$,i,t,n):n?["span",t?{key:i.join("-")}:{},e.toString()]:e.toString()}};const Qa={createTree(e,t,r,$){return p(e,this,t,r,$)},hydrateTree(e,t,r,$){return v(e,this,t,r,$)},diffTree(e,t,r,$,a){Y(e,this,t,r,$,a)},normalizeTree:Oa,getElementById:e=>document.getElementById(e),getChild:za,createElement:xa,createTextElement:ya,replaceChild(e,t,r,$){Aa(e,this,t,r,$)},removeChild:Ja,setContent:Ba,removeAttribs:Fa,setAttrib:O};const Ra=(e,o)=>f(e)?o.getElementById(e):e;const Sa=(r,e={},t=Qa)=>{const $=Object.assign({root:"app"},e);let o=[],a=!0;const m=Ra($.root,t),i=()=>{if(a){$.ctx=sa(e.ctx,$.autoDerefKeys);const s=t.normalizeTree($,r);null!=s&&($.hydrate?(t.hydrateTree($,m,s),$.hydrate=!1):t.diffTree($,m,o,s),o=s),a&&requestAnimationFrame(i)}};return requestAnimationFrame(i),()=>a=!1};const Ta="--set-value";const Ua="--update-value";const Va="--toggle-value";const Wa="--cancel";const Xa="--dispatch";const Ya="--dispatch-async";const Za="--dispatch-now";const $a="--delay";const _a="--fetch";const D="--state";const bb="--redo";const cb="--undo";const E=Wa,T=Za,a=D;class gb{constructor(e,t){this.handlers={},this.effects={},this.eventQueue=[],this.priorities=[],this.addBuiltIns(),e&&this.addHandlers(e),t&&this.addEffects(t)}addBuiltIns(){this.addEffects({[Xa]:[e=>this.dispatch(e),-999],[Ya]:[([e,t,r,s])=>{const i=this.effects[e];if(i){const e=i(t,this);xb(e)?e.then(e=>this.dispatch([r,e])).catch(e=>this.dispatch([s,e])):console.warn("async effect did not return Promise")}else console.warn(`skipping invalid async effect: ${e}`)},-999],[$a]:[([e,t])=>new Promise(r=>setTimeout(()=>r(t),e)),1e3],[_a]:[e=>fetch(e).then(e=>{if(!e.ok)throw new Error(e.statusText);return e}),1e3]})}addHandler(e,t){const r=c(t)?t.map(V):F(t)?[{pre:t}]:[t];r.length>0?(this.handlers[e]&&(this.removeHandler(e),console.warn(`overriding handler for ID: ${e}`)),this.handlers[e]=r):x(`no handlers in spec for ID: ${e}`)}addHandlers(e){for(let t in e)this.addHandler(t,e[t])}addEffect(e,t,r=1){this.effects[e]&&(this.removeEffect(e),console.warn(`overriding effect for ID: ${e}`)),this.effects[e]=t;const s=[e,r],i=this.priorities;for(let $=0;$<i.length;$++)if(s[1]<i[$][1])return void i.splice($,0,s);i.push(s)}addEffects(e){for(let t in e){const r=e[t];c(r)?this.addEffect(t,r[0],r[1]):this.addEffect(t,r)}}instrumentWith(e,t){const r=e.map(V),s=this.handlers;for(let i of t||Object.keys(s)){const e=s[i];e&&(s[i]=r.concat(e))}}removeHandler(e){delete this.handlers[e]}removeHandlers(e){for(let t of e)this.removeHandler(t)}removeEffect(e){delete this.effects[e];const t=this.priorities;for(let r=t.length-1;r>=0;r--)if(e===t[r][0])return void t.splice(r,1)}removeEffects(e){for(let t of e)this.removeEffect(t)}context(){return this.currCtx}dispatch(...e){this.eventQueue.push(...e)}dispatchNow(...e){(this.currQueue||this.eventQueue).push(...e)}dispatchLater(e,t=17){setTimeout(()=>this.dispatch(e),t)}processQueue(e){if(this.eventQueue.length>0){this.currQueue=[...this.eventQueue],this.eventQueue.length=0,e=this.currCtx=e||{};for(let t of this.currQueue)this.processEvent(e,t);return this.currQueue=this.currCtx=void 0,this.processEffects(e),!0}return!1}processEvent(e,t){const r=this.handlers[t[0]];if(!r)return void console.warn(`missing handler for event type: ${t[0].toString()}`);const s=r.length-1;let i=!1;for(let $=0;$<=s&&!e[E];$++){const s=r[$];s.pre&&this.mergeEffects(e,s.pre(e[a],t,this,e)),i=i||!!s.post}if(i)for(let $=s;$>=0&&!e[E];$--){const s=r[$];s.post&&this.mergeEffects(e,s.post(e[a],t,this,e))}}processEffects(e){const t=this.effects;for(let r of this.priorities){const s=r[0],i=e[s];if(void 0!==i){const r=t[s];if(s!==a)for(let t of i)r(t,this,e);else r(i,this,e)}}}mergeEffects(e,t){if(t)for(let r in t){const s=t[r];if(null!=s)if(r===a||r===E)e[r]=s;else if(r===T){if(c(s[0]))for(let e of s)e&&this.dispatchNow(e);else this.dispatchNow(s);}else if(e[r]||(e[r]=[]),c(s[0]))for(let t of s)void 0!==t&&e[r].push(t);else e[r].push(s)}}}class hb extends gb{constructor(e,t,r){super(t,r),this.state=e||new i({})}deref(){return this.state.deref()}addBuiltIns(){super.addBuiltIns(),this.addHandlers({[Ta]:(e,[t,[r,s]])=>({[a]:z(e,r,s)}),[Ua]:(e,[t,[r,s,...i]])=>({[a]:y(e,r,s,...i)}),[Va]:(e,[t,r])=>({[a]:y(e,r,e=>!e)}),[cb]:W("undo"),[bb]:W("redo")}),this.addEffects({[a]:[e=>this.state.reset(e),-1e3]})}processQueue(e){if(this.eventQueue.length>0){const t=this.state.deref();this.currQueue=[...this.eventQueue],this.eventQueue.length=0,e=this.currCtx=Object.assign({},e,{[a]:t});for(let r of this.currQueue)this.processEvent(e,r);return this.currQueue=this.currCtx=void 0,this.processEffects(e),this.state.deref()!==t}return!1}}const V=e=>F(e)?{pre:e}:e,W=e=>(t,[r,s],i,$)=>{let h=s?s[0]:"history";if(U($[h],e)){const t=$[h][e]();return{[a]:i.state.deref(),[T]:s?void 0!==t?s[1]:s[2]:void 0}}console.warn("no history in context")};const X=(e,$)=>{const t=A(e);return(e,[r,o])=>({[D]:t(e,$?$(o):o)})};const g="route-changed";var r={};var nb=r&&r.__decorate||function(t,e,r,i){var o,a=arguments.length,s=a<3?e:null===i?i=Object.getOwnPropertyDescriptor(e,r):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(t,e,r,i);else for(var n=t.length-1;n>=0;n--)(o=t[n])&&(s=(a<3?o(s):a>3?o(e,r,s):o(e,r))||s);return a>3&&s&&Object.defineProperty(e,r,s),s};let q=class{constructor(t){t.authenticator=t.authenticator||((t,e,r)=>({id:t.id,title:t.title,params:r})),t.prefix=void 0===t.prefix?"/":t.prefix,t.separator=t.separator||"/",this.config=t}addListener(t,e,r){return!1}removeListener(t,e,r){return!1}notify(t){}start(){if(this.config.initialRouteID){const t=this.routeForID(this.config.initialRouteID);this.current={id:t.id,title:t.title,params:{}},this.notify({id:g,value:this.current})}}route(t){"#"===t.charAt(0)&&(t=t.substr(1)),t=t.substr(this.config.prefix.length);const e=this.config.routes,r=t.split(this.config.separator);let i;for(let o=0,a=e.length;o<a;o++){const t=e[o],a=this.matchRoute(r,t);if(a){i=a;break}}if(!i){if(!this.handleRouteFailure())return;const t=this.routeForID(this.config.defaultRouteID);i={id:t.id,title:t.title,params:{}}}return j(i,this.current)||(this.current=i,this.notify({id:g,value:i})),i}format(...t){let e,[r,i,o]=t;switch(t.length){case 3:e={id:r,params:i};break;case 2:f(r)?e={id:r,params:i}:(o=i,e=r);break;case 1:e=f(r)?{id:r}:r;break;default:$(t.length);}const a=this.routeForID(e.id);if(a){const t=e.params||{};return(o?"#":"")+this.config.prefix+a.match.map(e=>"?"===e.charAt(0)?null!=(e=t[e.substr(1)])?e:"NULL":e).join(this.config.separator)}x(`invalid route ID: ${e.id.toString()}`)}routeForID(t){return this.config.routes.find(e=>e.id===t)}matchRoute(t,e){const r=e.match,i=r.length;if(t.length===i){const o={};for(let e=0;e<i;e++){const i=r[e];if("?"===i.charAt(0))o[i.substr(1)]=t[e];else if(t[e]!==i)return}if(e.validate&&!this.validateRouteParams(o,e.validate))return;return e.auth?this.config.authenticator(e,t,o):{id:e.id,title:e.title,params:o}}}validateRouteParams(t,e){for(let r in e)if(void 0!==t[r]){const i=e[r];if(i.coerce&&(t[r]=i.coerce(t[r])),i.check&&!i.check(t[r]))return!1}return!0}handleRouteFailure(){return!0}};q=nb([ea],q),r.BasicRouter=q,r.BasicRouter=q;class pb extends q{constructor(t){super(t),this.useFragment=!1!==t.useFragment}start(){if(window.addEventListener("popstate",this.handlePopChange()),this.useFragment&&window.addEventListener("hashchange",this.handleHashChange()),this.config.initialRouteID){const t=this.routeForID(this.config.initialRouteID);this.route(this.format({id:t.id,title:t.title}))}else this.route(this.useFragment?location.hash:location.pathname)}release(){window.removeEventListener("popstate",this.popHandler),this.useFragment&&window.removeEventListener("hashchange",this.hashHandler)}route(t,e=!0){const r=this.current,i=super.route(t);return j(i,r)||(this.currentPath=this.format(i),e&&history.pushState(this.currentPath,i.title||window.document.title||"",this.currentPath)),i}routeTo(t){this.useFragment&&(location.hash=t),this.route(t)}format(...t){let e;switch(t.length){case 2:e={id:t[0],params:t[1]};break;case 1:e=f(t[0])?{id:t[0]}:t[0];break;default:$(t.length);}return super.format(e,this.useFragment)}handlePopChange(){return this.popHandler=this.popHandler||(t=>{this.route(t.state||(this.useFragment?location.hash:location.pathname),!1)}).bind(this)}handleHashChange(){return this.hashHandler=this.hashHandler||(t=>{if(!this.ignoreHashChange){const e=t.newURL.substr(t.newURL.indexOf("#"));e!==this.currentPath&&this.route(e,!1)}}).bind(this)}handleRouteFailure(){return this.ignoreHashChange=!0,location.hash=this.format({id:this.routeForID(this.config.defaultRouteID).id}),this.ignoreHashChange=!1,!0}}var n={};n.JSON="load-json";n.ROUTE_TO="route-to";var e={};e.ROUTE_TO="route-to";e.BG_ACTIVE="bg-active";e.SET_PARAM="set-param";class sb{constructor(t){this.config=t,this.state=new i(t.initialState||{}),this.ctx={bus:new hb(this.state,t.events,t.effects),views:{},ui:t.ui},this.addViews(this.config.views),this.router=new pb(t.router),this.router.addListener(g,t=>this.ctx.bus.dispatch([g,t.value])),this.ctx.bus.addHandlers({[g]:X("route"),[e.ROUTE_TO]:(t,[e,r])=>({[n.ROUTE_TO]:r})}),this.ctx.bus.addEffect(n.ROUTE_TO,([t,e])=>this.router.routeTo(this.router.format(t,e))),this.addViews({route:"route",routeComponent:["route.id",t=>(this.config.components[t]||(()=>["div",`missing component for route: ${t}`]))(this.ctx)]})}addViews(t){const e=this.ctx.views;for(let r in t){const i=t[r];c(i)?e[r]=this.state.addView(i[0],i[1]):e[r]=this.state.addView(i)}}start(){this.router.start();const t=this.rootComponent();Sa(({views:{bgActive:e}})=>{if(this.ctx.bus.processQueue()||e.deref())return t},{root:this.config.domRoot,ctx:this.ctx})}rootComponent(){return["div",this.ctx.ui.root,this.ctx.views.routeComponent]}}function*tb($,e){const r=$([null,null,($,e)=>e])[2];for(let f of e){let $=r(l,f);if(vb($))return void(($=wb($.deref()))!==l&&(yield $));$!==l&&(yield $)}}class ba{constructor(e){this.value=e}deref(){return this.value}}const vb=e=>e instanceof ba;const wb=e=>e instanceof ba?e.deref():e;function ca(t,r){return r?tb(ca(t),r):r=>{const $=r[2];return yb(r,(r,e)=>$(r,t(e)))}}const yb=($,c)=>[$[0],$[1],c];const w=($,v)=>["a",f($)?{href:$}:$,v];const Ab=({ui:t})=>["div",t.contacts,w(Object.assign({href:"https://github.com/stwind"},t.icons.github),""),w(Object.assign({href:"https://twitter.com/st_ind"},t.icons.twitter),""),w(Object.assign({href:"mailto:stwind@gmail.com"},t.icons.mail),"")];const Bb=[{href:"https://observablehq.com/@stwind/tiny-neural-network-from-scratch",title:"tiny neural network from scratch"},{href:"https://observablehq.com/@stwind/perlin-noise-1d",title:"perlin noise 1d"}],Cb=({ui:r},{href:t,title:$})=>["div",w(Object.assign({href:t},r.link),$)],Db=({ui:r})=>["span",r.cursor];function Eb({ui:r}){return["div",["div",r.title,"pngupngu"],["div",r.description,"a programmer.",[Db]],["ul",r.posts,...ca(t=>["li",r.post,[Cb,t]],Bb)],[Ab]]}const G={id:"home",match:["home"]};const ib={router:{useFragment:!0,defaultRouteID:G.id,routes:[G]},events:{[e.BG_ACTIVE]:X("bgActive"),[e.SET_PARAM]:(e,[r,[o,t]])=>({[D]:z(e,["params",o],t)})},effects:{},components:{[G.id]:Eb},domRoot:"app",initialState:{bgActive:!1,params:{speed:.2,freq:100,iter:4,scale:[128,128],height:.3,meshScale:[5,1,5],cameraUp:[-.24,.9,.37],cameraPos:[-.42,.49,1.26],cameraTarget:[0,0,0]}},views:{bgActive:"bgActive",params:"params"},ui:{title:{class:"red f4 fw4 mb3"},root:{class:"pa4 sans-serif f6 fw3 barlow dark-gray relative"},description:{class:"mb4"},link:{class:"no-underline red"},posts:{class:"pa0 list"},post:{class:"mb2"},contacts:{class:"fixed bottom-1 right-1 o-80 f7"},icons:{mail:{class:"mr1 mail icon red no-underline"},twitter:{class:"mr1 twitter icon red no-underline"},github:{class:"mr1 github icon red no-underline"}},cursor:{class:"blinking-cursor dib v-base"}}};new sb(ib).start();return{"9B6d":{}};});