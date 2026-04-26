/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol, Iterator */


function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t$4=globalThis,e$3=t$4.ShadowRoot&&(void 0===t$4.ShadyCSS||t$4.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s$3=Symbol(),o$4=new WeakMap;let n$3 = class n{constructor(t,e,o){if(this._$cssResult$=true,o!==s$3)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e;}get styleSheet(){let t=this.o;const s=this.t;if(e$3&&void 0===t){const e=void 0!==s&&1===s.length;e&&(t=o$4.get(s)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),e&&o$4.set(s,t));}return t}toString(){return this.cssText}};const r$4=t=>new n$3("string"==typeof t?t:t+"",void 0,s$3),i$5=(t,...e)=>{const o=1===t.length?t[0]:e.reduce((e,s,o)=>e+(t=>{if(true===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+t[o+1],t[0]);return new n$3(o,t,s$3)},S$1=(s,o)=>{if(e$3)s.adoptedStyleSheets=o.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const e of o){const o=document.createElement("style"),n=t$4.litNonce;void 0!==n&&o.setAttribute("nonce",n),o.textContent=e.cssText,s.appendChild(o);}},c$3=e$3?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return r$4(e)})(t):t;

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:i$4,defineProperty:e$2,getOwnPropertyDescriptor:h$2,getOwnPropertyNames:r$3,getOwnPropertySymbols:o$3,getPrototypeOf:n$2}=Object,a$1=globalThis,c$2=a$1.trustedTypes,l$1=c$2?c$2.emptyScript:"",p$2=a$1.reactiveElementPolyfillSupport,d$1=(t,s)=>t,u$3={toAttribute(t,s){switch(s){case Boolean:t=t?l$1:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t);}return t},fromAttribute(t,s){let i=t;switch(s){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t);}catch(t){i=null;}}return i}},f$1=(t,s)=>!i$4(t,s),b$1={attribute:true,type:String,converter:u$3,reflect:false,useDefault:false,hasChanged:f$1};Symbol.metadata??=Symbol("metadata"),a$1.litPropertyMetadata??=new WeakMap;let y$1 = class y extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t);}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,s=b$1){if(s.state&&(s.attribute=false),this._$Ei(),this.prototype.hasOwnProperty(t)&&((s=Object.create(s)).wrapped=true),this.elementProperties.set(t,s),!s.noAccessor){const i=Symbol(),h=this.getPropertyDescriptor(t,i,s);void 0!==h&&e$2(this.prototype,t,h);}}static getPropertyDescriptor(t,s,i){const{get:e,set:r}=h$2(this.prototype,t)??{get(){return this[s]},set(t){this[s]=t;}};return {get:e,set(s){const h=e?.call(this);r?.call(this,s),this.requestUpdate(t,h,i);},configurable:true,enumerable:true}}static getPropertyOptions(t){return this.elementProperties.get(t)??b$1}static _$Ei(){if(this.hasOwnProperty(d$1("elementProperties")))return;const t=n$2(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties);}static finalize(){if(this.hasOwnProperty(d$1("finalized")))return;if(this.finalized=true,this._$Ei(),this.hasOwnProperty(d$1("properties"))){const t=this.properties,s=[...r$3(t),...o$3(t)];for(const i of s)this.createProperty(i,t[i]);}const t=this[Symbol.metadata];if(null!==t){const s=litPropertyMetadata.get(t);if(void 0!==s)for(const[t,i]of s)this.elementProperties.set(t,i);}this._$Eh=new Map;for(const[t,s]of this.elementProperties){const i=this._$Eu(t,s);void 0!==i&&this._$Eh.set(i,t);}this.elementStyles=this.finalizeStyles(this.styles);}static finalizeStyles(s){const i=[];if(Array.isArray(s)){const e=new Set(s.flat(1/0).reverse());for(const s of e)i.unshift(c$3(s));}else void 0!==s&&i.push(c$3(s));return i}static _$Eu(t,s){const i=s.attribute;return  false===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=false,this.hasUpdated=false,this._$Em=null,this._$Ev();}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this));}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.();}removeController(t){this._$EO?.delete(t);}_$E_(){const t=new Map,s=this.constructor.elementProperties;for(const i of s.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t);}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return S$1(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(true),this._$EO?.forEach(t=>t.hostConnected?.());}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.());}attributeChangedCallback(t,s,i){this._$AK(t,i);}_$ET(t,s){const i=this.constructor.elementProperties.get(t),e=this.constructor._$Eu(t,i);if(void 0!==e&&true===i.reflect){const h=(void 0!==i.converter?.toAttribute?i.converter:u$3).toAttribute(s,i.type);this._$Em=t,null==h?this.removeAttribute(e):this.setAttribute(e,h),this._$Em=null;}}_$AK(t,s){const i=this.constructor,e=i._$Eh.get(t);if(void 0!==e&&this._$Em!==e){const t=i.getPropertyOptions(e),h="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:u$3;this._$Em=e;const r=h.fromAttribute(s,t.type);this[e]=r??this._$Ej?.get(e)??r,this._$Em=null;}}requestUpdate(t,s,i,e=false,h){if(void 0!==t){const r=this.constructor;if(false===e&&(h=this[t]),i??=r.getPropertyOptions(t),!((i.hasChanged??f$1)(h,s)||i.useDefault&&i.reflect&&h===this._$Ej?.get(t)&&!this.hasAttribute(r._$Eu(t,i))))return;this.C(t,s,i);} false===this.isUpdatePending&&(this._$ES=this._$EP());}C(t,s,{useDefault:i,reflect:e,wrapped:h},r){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,r??s??this[t]),true!==h||void 0!==r)||(this._$AL.has(t)||(this.hasUpdated||i||(s=void 0),this._$AL.set(t,s)),true===e&&this._$Em!==t&&(this._$Eq??=new Set).add(t));}async _$EP(){this.isUpdatePending=true;try{await this._$ES;}catch(t){Promise.reject(t);}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,s]of this._$Ep)this[t]=s;this._$Ep=void 0;}const t=this.constructor.elementProperties;if(t.size>0)for(const[s,i]of t){const{wrapped:t}=i,e=this[s];true!==t||this._$AL.has(s)||void 0===e||this.C(s,void 0,i,e);}}let t=false;const s=this._$AL;try{t=this.shouldUpdate(s),t?(this.willUpdate(s),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(s)):this._$EM();}catch(s){throw t=false,this._$EM(),s}t&&this._$AE(s);}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=true,this.firstUpdated(t)),this.updated(t);}_$EM(){this._$AL=new Map,this.isUpdatePending=false;}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return  true}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM();}updated(t){}firstUpdated(t){}};y$1.elementStyles=[],y$1.shadowRootOptions={mode:"open"},y$1[d$1("elementProperties")]=new Map,y$1[d$1("finalized")]=new Map,p$2?.({ReactiveElement:y$1}),(a$1.reactiveElementVersions??=[]).push("2.1.2");

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t$3=globalThis,i$3=t=>t,s$2=t$3.trustedTypes,e$1=s$2?s$2.createPolicy("lit-html",{createHTML:t=>t}):void 0,h$1="$lit$",o$2=`lit$${Math.random().toFixed(9).slice(2)}$`,n$1="?"+o$2,r$2=`<${n$1}>`,l=document,c$1=()=>l.createComment(""),a=t=>null===t||"object"!=typeof t&&"function"!=typeof t,u$2=Array.isArray,d=t=>u$2(t)||"function"==typeof t?.[Symbol.iterator],f="[ \t\n\f\r]",v$1=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,_=/-->/g,m$1=/>/g,p$1=RegExp(`>|${f}(?:([^\\s"'>=/]+)(${f}*=${f}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),g=/'/g,$=/"/g,y=/^(?:script|style|textarea|title)$/i,x=t=>(i,...s)=>({_$litType$:t,strings:i,values:s}),b=x(1),E=Symbol.for("lit-noChange"),A=Symbol.for("lit-nothing"),C=new WeakMap,P=l.createTreeWalker(l,129);function V(t,i){if(!u$2(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==e$1?e$1.createHTML(i):i}const N=(t,i)=>{const s=t.length-1,e=[];let n,l=2===i?"<svg>":3===i?"<math>":"",c=v$1;for(let i=0;i<s;i++){const s=t[i];let a,u,d=-1,f=0;for(;f<s.length&&(c.lastIndex=f,u=c.exec(s),null!==u);)f=c.lastIndex,c===v$1?"!--"===u[1]?c=_:void 0!==u[1]?c=m$1:void 0!==u[2]?(y.test(u[2])&&(n=RegExp("</"+u[2],"g")),c=p$1):void 0!==u[3]&&(c=p$1):c===p$1?">"===u[0]?(c=n??v$1,d=-1):void 0===u[1]?d=-2:(d=c.lastIndex-u[2].length,a=u[1],c=void 0===u[3]?p$1:'"'===u[3]?$:g):c===$||c===g?c=p$1:c===_||c===m$1?c=v$1:(c=p$1,n=void 0);const x=c===p$1&&t[i+1].startsWith("/>")?" ":"";l+=c===v$1?s+r$2:d>=0?(e.push(a),s.slice(0,d)+h$1+s.slice(d)+o$2+x):s+o$2+(-2===d?i:x);}return [V(t,l+(t[s]||"<?>")+(2===i?"</svg>":3===i?"</math>":"")),e]};class S{constructor({strings:t,_$litType$:i},e){let r;this.parts=[];let l=0,a=0;const u=t.length-1,d=this.parts,[f,v]=N(t,i);if(this.el=S.createElement(f,e),P.currentNode=this.el.content,2===i||3===i){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes);}for(;null!==(r=P.nextNode())&&d.length<u;){if(1===r.nodeType){if(r.hasAttributes())for(const t of r.getAttributeNames())if(t.endsWith(h$1)){const i=v[a++],s=r.getAttribute(t).split(o$2),e=/([.?@])?(.*)/.exec(i);d.push({type:1,index:l,name:e[2],strings:s,ctor:"."===e[1]?I:"?"===e[1]?L:"@"===e[1]?z:H}),r.removeAttribute(t);}else t.startsWith(o$2)&&(d.push({type:6,index:l}),r.removeAttribute(t));if(y.test(r.tagName)){const t=r.textContent.split(o$2),i=t.length-1;if(i>0){r.textContent=s$2?s$2.emptyScript:"";for(let s=0;s<i;s++)r.append(t[s],c$1()),P.nextNode(),d.push({type:2,index:++l});r.append(t[i],c$1());}}}else if(8===r.nodeType)if(r.data===n$1)d.push({type:2,index:l});else {let t=-1;for(;-1!==(t=r.data.indexOf(o$2,t+1));)d.push({type:7,index:l}),t+=o$2.length-1;}l++;}}static createElement(t,i){const s=l.createElement("template");return s.innerHTML=t,s}}function M$1(t,i,s=t,e){if(i===E)return i;let h=void 0!==e?s._$Co?.[e]:s._$Cl;const o=a(i)?void 0:i._$litDirective$;return h?.constructor!==o&&(h?._$AO?.(false),void 0===o?h=void 0:(h=new o(t),h._$AT(t,s,e)),void 0!==e?(s._$Co??=[])[e]=h:s._$Cl=h),void 0!==h&&(i=M$1(t,h._$AS(t,i.values),h,e)),i}class R{constructor(t,i){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=i;}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:i},parts:s}=this._$AD,e=(t?.creationScope??l).importNode(i,true);P.currentNode=e;let h=P.nextNode(),o=0,n=0,r=s[0];for(;void 0!==r;){if(o===r.index){let i;2===r.type?i=new k(h,h.nextSibling,this,t):1===r.type?i=new r.ctor(h,r.name,r.strings,this,t):6===r.type&&(i=new Z(h,this,t)),this._$AV.push(i),r=s[++n];}o!==r?.index&&(h=P.nextNode(),o++);}return P.currentNode=l,e}p(t){let i=0;for(const s of this._$AV) void 0!==s&&(void 0!==s.strings?(s._$AI(t,s,i),i+=s.strings.length-2):s._$AI(t[i])),i++;}}class k{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,i,s,e){this.type=2,this._$AH=A,this._$AN=void 0,this._$AA=t,this._$AB=i,this._$AM=s,this.options=e,this._$Cv=e?.isConnected??true;}get parentNode(){let t=this._$AA.parentNode;const i=this._$AM;return void 0!==i&&11===t?.nodeType&&(t=i.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,i=this){t=M$1(this,t,i),a(t)?t===A||null==t||""===t?(this._$AH!==A&&this._$AR(),this._$AH=A):t!==this._$AH&&t!==E&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):d(t)?this.k(t):this._(t);}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t));}_(t){this._$AH!==A&&a(this._$AH)?this._$AA.nextSibling.data=t:this.T(l.createTextNode(t)),this._$AH=t;}$(t){const{values:i,_$litType$:s}=t,e="number"==typeof s?this._$AC(t):(void 0===s.el&&(s.el=S.createElement(V(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===e)this._$AH.p(i);else {const t=new R(e,this),s=t.u(this.options);t.p(i),this.T(s),this._$AH=t;}}_$AC(t){let i=C.get(t.strings);return void 0===i&&C.set(t.strings,i=new S(t)),i}k(t){u$2(this._$AH)||(this._$AH=[],this._$AR());const i=this._$AH;let s,e=0;for(const h of t)e===i.length?i.push(s=new k(this.O(c$1()),this.O(c$1()),this,this.options)):s=i[e],s._$AI(h),e++;e<i.length&&(this._$AR(s&&s._$AB.nextSibling,e),i.length=e);}_$AR(t=this._$AA.nextSibling,s){for(this._$AP?.(false,true,s);t!==this._$AB;){const s=i$3(t).nextSibling;i$3(t).remove(),t=s;}}setConnected(t){ void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t));}}class H{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,i,s,e,h){this.type=1,this._$AH=A,this._$AN=void 0,this.element=t,this.name=i,this._$AM=e,this.options=h,s.length>2||""!==s[0]||""!==s[1]?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=A;}_$AI(t,i=this,s,e){const h=this.strings;let o=false;if(void 0===h)t=M$1(this,t,i,0),o=!a(t)||t!==this._$AH&&t!==E,o&&(this._$AH=t);else {const e=t;let n,r;for(t=h[0],n=0;n<h.length-1;n++)r=M$1(this,e[s+n],i,n),r===E&&(r=this._$AH[n]),o||=!a(r)||r!==this._$AH[n],r===A?t=A:t!==A&&(t+=(r??"")+h[n+1]),this._$AH[n]=r;}o&&!e&&this.j(t);}j(t){t===A?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"");}}class I extends H{constructor(){super(...arguments),this.type=3;}j(t){this.element[this.name]=t===A?void 0:t;}}class L extends H{constructor(){super(...arguments),this.type=4;}j(t){this.element.toggleAttribute(this.name,!!t&&t!==A);}}class z extends H{constructor(t,i,s,e,h){super(t,i,s,e,h),this.type=5;}_$AI(t,i=this){if((t=M$1(this,t,i,0)??A)===E)return;const s=this._$AH,e=t===A&&s!==A||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,h=t!==A&&(s===A||e);e&&this.element.removeEventListener(this.name,this,s),h&&this.element.addEventListener(this.name,this,t),this._$AH=t;}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t);}}class Z{constructor(t,i,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=i,this.options=s;}get _$AU(){return this._$AM._$AU}_$AI(t){M$1(this,t);}}const j={I:k},B=t$3.litHtmlPolyfillSupport;B?.(S,k),(t$3.litHtmlVersions??=[]).push("3.3.2");const D=(t,i,s)=>{const e=s?.renderBefore??i;let h=e._$litPart$;if(void 0===h){const t=s?.renderBefore??null;e._$litPart$=h=new k(i.insertBefore(c$1(),t),t,void 0,s??{});}return h._$AI(t),h};

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const s$1=globalThis;let i$2 = class i extends y$1{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0;}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const r=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=D(r,this.renderRoot,this.renderOptions);}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(true);}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(false);}render(){return E}};i$2._$litElement$=true,i$2["finalized"]=true,s$1.litElementHydrateSupport?.({LitElement:i$2});const o$1=s$1.litElementPolyfillSupport;o$1?.({LitElement:i$2});(s$1.litElementVersions??=[]).push("4.2.2");

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t$2=t=>(e,o)=>{ void 0!==o?o.addInitializer(()=>{customElements.define(t,e);}):customElements.define(t,e);};

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const o={attribute:true,type:String,converter:u$3,reflect:false,hasChanged:f$1},r$1=(t=o,e,r)=>{const{kind:n,metadata:i}=r;let s=globalThis.litPropertyMetadata.get(i);if(void 0===s&&globalThis.litPropertyMetadata.set(i,s=new Map),"setter"===n&&((t=Object.create(t)).wrapped=true),s.set(r.name,t),"accessor"===n){const{name:o}=r;return {set(r){const n=e.get.call(this);e.set.call(this,r),this.requestUpdate(o,n,t,true,r);},init(e){return void 0!==e&&this.C(o,void 0,t,e),e}}}if("setter"===n){const{name:o}=r;return function(r){const n=this[o];e.call(this,r),this.requestUpdate(o,n,t,true,r);}}throw Error("Unsupported decorator location: "+n)};function n(t){return (e,o)=>"object"==typeof o?r$1(t,e,o):((t,e,o)=>{const r=e.hasOwnProperty(o);return e.constructor.createProperty(o,t),r?Object.getOwnPropertyDescriptor(e,o):void 0})(t,e,o)}

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function r(r){return n({...r,state:true,attribute:false})}

let RequestList = class RequestList extends i$2 {
    constructor() {
        super(...arguments);
        this.requests = [];
        this._confirmDeleteId = null;
        this._deleting = false;
    }
    _edit(request) {
        this.dispatchEvent(new CustomEvent("edit", {
            detail: request,
            bubbles: true,
            composed: true,
        }));
    }
    async _deleteConfirmed() {
        if (!this._confirmDeleteId)
            return;
        this._deleting = true;
        try {
            await this.hass.callWS({
                type: "hass_requester/delete",
                request_id: this._confirmDeleteId,
            });
            this.dispatchEvent(new CustomEvent("deleted", { bubbles: true, composed: true }));
        }
        finally {
            this._deleting = false;
            this._confirmDeleteId = null;
        }
    }
    render() {
        return b `
      <div class="header">
        <div class="header-title">
          <img src="/api/hass_requester/frontend/logo.png" alt="HASS Requester" />
          <h2>HASS Requester</h2>
        </div>
        <button
          class="new-btn"
          @click=${() => this.dispatchEvent(new CustomEvent("new", { bubbles: true, composed: true }))}
        >
          + New Request
        </button>
      </div>

      ${this.requests.length === 0
            ? b `
            <div class="empty-state">
              <div class="icon">🌐</div>
              <p>No requests saved yet.</p>
              <button class="new-btn" @click=${() => this.dispatchEvent(new CustomEvent("new", { bubbles: true, composed: true }))}>
                Create your first request
              </button>
            </div>
          `
            : b `
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Method</th>
                  <th>URL</th>
                  <th>Slots</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                ${this.requests.map((req) => b `
                    <tr>
                      <td><strong>${req.name}</strong></td>
                      <td>
                        <span class="method-badge method-${req.method}">
                          ${req.method}
                        </span>
                      </td>
                      <td style="max-width:260px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">
                        ${req.url}
                      </td>
                      <td>
                        <div class="slots-cell">
                          ${req.slots.length === 0
                ? b `<span style="color:var(--secondary-text-color);font-size:12px;">none</span>`
                : req.slots.map((s) => b `<span class="slot-chip">{{ ${s.name} }}</span>`)}
                        </div>
                      </td>
                      <td>
                        <div class="actions">
                          <button
                            class="action-btn edit-btn"
                            @click=${() => this._edit(req)}
                          >
                            Edit
                          </button>
                          <button
                            class="action-btn delete-btn"
                            @click=${() => (this._confirmDeleteId = req.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  `)}
              </tbody>
            </table>
          `}

      ${this._confirmDeleteId
            ? b `
            <div class="confirm-overlay">
              <div class="confirm-card">
                <h3>Delete Request?</h3>
                <p>
                  This will permanently delete
                  <strong>
                    ${this.requests.find((r) => r.id === this._confirmDeleteId)?.name}
                  </strong>.
                  This action cannot be undone.
                </p>
                <div class="confirm-actions">
                  <button
                    class="confirm-cancel"
                    @click=${() => (this._confirmDeleteId = null)}
                  >
                    Cancel
                  </button>
                  <button
                    class="confirm-delete"
                    ?disabled=${this._deleting}
                    @click=${this._deleteConfirmed}
                  >
                    ${this._deleting ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            </div>
          `
            : b ``}
    `;
    }
};
RequestList.styles = i$5 `
    :host {
      display: block;
      max-width: 900px;
      margin: 0 auto;
      padding: 24px 16px;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }
    .header-title {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .header-title img {
      width: 40px;
      height: 40px;
      border-radius: 8px;
    }
    h2 {
      margin: 0;
      font-size: 22px;
      color: var(--primary-text-color);
    }
    .new-btn {
      padding: 8px 20px;
      background: var(--primary-color);
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 600;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      background: var(--card-background-color);
      border-radius: 8px;
      overflow: hidden;
      box-shadow: var(--ha-card-box-shadow, 0 2px 4px rgba(0,0,0,.1));
    }
    thead {
      background: var(--primary-color);
      color: white;
    }
    th {
      text-align: left;
      padding: 12px 16px;
      font-size: 13px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    td {
      padding: 12px 16px;
      border-bottom: 1px solid var(--divider-color);
      font-size: 14px;
      color: var(--primary-text-color);
    }
    tr:last-child td {
      border-bottom: none;
    }
    tr:hover td {
      background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.05);
    }
    .method-badge {
      display: inline-block;
      padding: 2px 8px;
      border-radius: 3px;
      font-size: 12px;
      font-weight: 700;
      font-family: monospace;
    }
    .method-GET    { background: #e8f5e9; color: #2e7d32; }
    .method-POST   { background: #e3f2fd; color: #1565c0; }
    .method-PUT    { background: #fff3e0; color: #e65100; }
    .method-PATCH  { background: #f3e5f5; color: #6a1b9a; }
    .method-DELETE { background: #ffebee; color: #b71c1c; }
    .slots-cell {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
    }
    .slot-chip {
      background: var(--secondary-background-color, #f5f5f5);
      border: 1px solid var(--divider-color);
      border-radius: 10px;
      padding: 1px 8px;
      font-size: 12px;
      color: var(--secondary-text-color);
    }
    .actions {
      display: flex;
      gap: 8px;
    }
    .action-btn {
      padding: 4px 12px;
      border-radius: 4px;
      border: none;
      cursor: pointer;
      font-size: 12px;
      font-weight: 600;
    }
    .edit-btn {
      background: var(--primary-color);
      color: white;
    }
    .delete-btn {
      background: var(--error-color, #db4437);
      color: white;
    }
    .empty-state {
      text-align: center;
      padding: 60px 0;
      color: var(--secondary-text-color);
    }
    .empty-state .icon {
      font-size: 48px;
      margin-bottom: 16px;
    }
    .empty-state p {
      font-size: 16px;
      margin: 0 0 16px;
    }
    .confirm-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 100;
    }
    .confirm-card {
      background: var(--card-background-color);
      border-radius: 8px;
      padding: 24px;
      max-width: 380px;
      width: 90%;
    }
    .confirm-card h3 { margin: 0 0 12px; }
    .confirm-card p { color: var(--secondary-text-color); margin: 0 0 20px; }
    .confirm-actions {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
    }
    .confirm-cancel {
      padding: 8px 16px;
      background: none;
      border: 1px solid var(--divider-color);
      border-radius: 4px;
      cursor: pointer;
    }
    .confirm-delete {
      padding: 8px 16px;
      background: var(--error-color, #db4437);
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 600;
    }
  `;
__decorate([
    n({ attribute: false })
], RequestList.prototype, "hass", void 0);
__decorate([
    n({ attribute: false })
], RequestList.prototype, "requests", void 0);
__decorate([
    r()
], RequestList.prototype, "_confirmDeleteId", void 0);
__decorate([
    r()
], RequestList.prototype, "_deleting", void 0);
RequestList = __decorate([
    t$2("hass-requester-list")
], RequestList);

let CurlImporter = class CurlImporter extends i$2 {
    constructor() {
        super(...arguments);
        this._open = false;
        this._curl = "";
        this._loading = false;
        this._error = "";
    }
    async _parse() {
        if (!this._curl.trim())
            return;
        this._loading = true;
        this._error = "";
        try {
            const parsed = await this.hass.callWS({
                type: "hass_requester/parse_curl",
                curl: this._curl,
            });
            this.dispatchEvent(new CustomEvent("curl-parsed", {
                detail: parsed,
                bubbles: true,
                composed: true,
            }));
            this._curl = "";
            this._open = false;
        }
        catch (e) {
            this._error =
                e instanceof Error
                    ? e.message
                    : e?.message ?? "Failed to parse CURL";
        }
        finally {
            this._loading = false;
        }
    }
    render() {
        return b `
      <button class="import-btn" @click=${() => (this._open = true)}>
        ⬇ Import from CURL
      </button>

      ${this._open
            ? b `
            <div class="overlay" @click=${(e) => {
                if (e.target === e.currentTarget)
                    this._open = false;
            }}>
              <div class="dialog">
                <h3>Import from CURL</h3>
                <p>Paste your curl command below. All fields will be auto-filled.</p>
                <textarea
                  .value=${this._curl}
                  placeholder='curl -X POST "https://api.example.com/send" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer token" \
  -d '"'"'"{"msg": "hello"}'"'"'"'
                  @input=${(e) => (this._curl = e.target.value)}
                  @keydown=${(e) => {
                if (e.key === "Escape")
                    this._open = false;
            }}
                ></textarea>
                ${this._error
                ? b `<p class="error">${this._error}</p>`
                : b ``}
                <div class="actions">
                  <button
                    class="btn-cancel"
                    @click=${() => {
                this._open = false;
                this._error = "";
            }}
                  >
                    Cancel
                  </button>
                  <button
                    class="btn-parse"
                    ?disabled=${this._loading || !this._curl.trim()}
                    @click=${this._parse}
                  >
                    ${this._loading ? "Parsing..." : "Import"}
                  </button>
                </div>
              </div>
            </div>
          `
            : b ``}
    `;
    }
};
CurlImporter.styles = i$5 `
    :host {
      display: block;
    }
    .import-btn {
      padding: 7px 18px;
      background: none;
      border: 1px solid var(--primary-color);
      color: var(--primary-color);
      border-radius: 6px;
      cursor: pointer;
      font-size: 13px;
      font-weight: 600;
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }
    .import-btn:hover {
      background: rgba(var(--rgb-primary-color, 3,169,244), 0.08);
    }
    .overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.55);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 200;
    }
    .dialog {
      background: var(--card-background-color);
      border-radius: 10px;
      padding: 28px;
      width: 90%;
      max-width: 640px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.3);
    }
    .dialog h3 {
      margin: 0 0 6px;
      font-size: 18px;
      color: var(--primary-text-color);
    }
    .dialog p {
      margin: 0 0 16px;
      font-size: 13px;
      color: var(--secondary-text-color);
    }
    textarea {
      width: 100%;
      min-height: 120px;
      padding: 12px;
      border: 1px solid var(--divider-color);
      border-radius: 6px;
      background: var(--secondary-background-color, #1e1e1e);
      color: var(--primary-text-color);
      font-family: "Consolas", "Monaco", monospace;
      font-size: 13px;
      resize: vertical;
      box-sizing: border-box;
      outline: none;
    }
    textarea:focus {
      border-color: var(--primary-color);
    }
    .actions {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      margin-top: 16px;
    }
    .btn-cancel {
      padding: 8px 18px;
      background: none;
      border: 1px solid var(--divider-color);
      border-radius: 6px;
      cursor: pointer;
      color: var(--primary-text-color);
      font-size: 14px;
    }
    .btn-parse {
      padding: 8px 20px;
      background: var(--primary-color);
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 600;
    }
    .btn-parse:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    .error {
      color: var(--error-color, #db4437);
      font-size: 13px;
      margin-top: 10px;
    }
  `;
__decorate([
    n({ attribute: false })
], CurlImporter.prototype, "hass", void 0);
__decorate([
    r()
], CurlImporter.prototype, "_open", void 0);
__decorate([
    r()
], CurlImporter.prototype, "_curl", void 0);
__decorate([
    r()
], CurlImporter.prototype, "_loading", void 0);
__decorate([
    r()
], CurlImporter.prototype, "_error", void 0);
CurlImporter = __decorate([
    t$2("hass-requester-curl-importer")
], CurlImporter);

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t$1={CHILD:2},e=t=>(...e)=>({_$litDirective$:t,values:e});let i$1 = class i{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,i){this._$Ct=t,this._$AM=e,this._$Ci=i;}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}};

/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const {I:t}=j,i=o=>o,s=()=>document.createComment(""),v=(o,n,e)=>{const l=o._$AA.parentNode,d=void 0===n?o._$AB:n._$AA;if(void 0===e){const i=l.insertBefore(s(),d),n=l.insertBefore(s(),d);e=new t(i,n,o,o.options);}else {const t=e._$AB.nextSibling,n=e._$AM,c=n!==o;if(c){let t;e._$AQ?.(o),e._$AM=o,void 0!==e._$AP&&(t=o._$AU)!==n._$AU&&e._$AP(t);}if(t!==d||c){let o=e._$AA;for(;o!==t;){const t=i(o).nextSibling;i(l).insertBefore(o,d),o=t;}}}return e},u$1=(o,t,i=o)=>(o._$AI(t,i),o),m={},p=(o,t=m)=>o._$AH=t,M=o=>o._$AH,h=o=>{o._$AR(),o._$AA.remove();};

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const u=(e,s,t)=>{const r=new Map;for(let l=s;l<=t;l++)r.set(e[l],l);return r},c=e(class extends i$1{constructor(e){if(super(e),e.type!==t$1.CHILD)throw Error("repeat() can only be used in text expressions")}dt(e,s,t){let r;void 0===t?t=s:void 0!==s&&(r=s);const l=[],o=[];let i=0;for(const s of e)l[i]=r?r(s,i):i,o[i]=t(s,i),i++;return {values:o,keys:l}}render(e,s,t){return this.dt(e,s,t).values}update(s,[t,r,c]){const d=M(s),{values:p$1,keys:a}=this.dt(t,r,c);if(!Array.isArray(d))return this.ut=a,p$1;const h$1=this.ut??=[],v$1=[];let m,y,x=0,j=d.length-1,k=0,w=p$1.length-1;for(;x<=j&&k<=w;)if(null===d[x])x++;else if(null===d[j])j--;else if(h$1[x]===a[k])v$1[k]=u$1(d[x],p$1[k]),x++,k++;else if(h$1[j]===a[w])v$1[w]=u$1(d[j],p$1[w]),j--,w--;else if(h$1[x]===a[w])v$1[w]=u$1(d[x],p$1[w]),v(s,v$1[w+1],d[x]),x++,w--;else if(h$1[j]===a[k])v$1[k]=u$1(d[j],p$1[k]),v(s,d[x],d[j]),j--,k++;else if(void 0===m&&(m=u(a,k,w),y=u(h$1,x,j)),m.has(h$1[x]))if(m.has(h$1[j])){const e=y.get(a[k]),t=void 0!==e?d[e]:null;if(null===t){const e=v(s,d[x]);u$1(e,p$1[k]),v$1[k]=e;}else v$1[k]=u$1(t,p$1[k]),v(s,d[x],t),d[e]=null;k++;}else h(d[j]),j--;else h(d[x]),x++;for(;k<=w;){const e=v(s,v$1[w+1]);u$1(e,p$1[k]),v$1[k++]=e;}for(;x<=j;){const e=d[x++];null!==e&&h(e);}return this.ut=a,p(s,v$1),E}});

let SlotEditor = class SlotEditor extends i$2 {
    constructor() {
        super(...arguments);
        this.slots = [];
    }
    _emit() {
        this.dispatchEvent(new CustomEvent("slots-changed", {
            detail: { slots: [...this.slots] },
            bubbles: true,
            composed: true,
        }));
    }
    _updateSlot(index, partial) {
        const updated = [...this.slots];
        updated[index] = { ...updated[index], ...partial };
        this.slots = updated;
        this._emit();
    }
    _deleteSlot(index) {
        const updated = [...this.slots];
        updated.splice(index, 1);
        this.slots = updated;
        this._emit();
    }
    _addSlot() {
        this.slots = [
            ...this.slots,
            { _id: crypto.randomUUID(), name: "", type: "text", required: true, default: null },
        ];
        this._emit();
    }
    _addOption(index, input) {
        const value = input.value.trim();
        if (!value)
            return;
        const slot = this.slots[index];
        const options = [...(slot.options ?? []), value];
        this._updateSlot(index, { options });
        input.value = "";
    }
    _removeOption(slotIndex, optionIndex) {
        const slot = this.slots[slotIndex];
        const options = [...(slot.options ?? [])];
        options.splice(optionIndex, 1);
        this._updateSlot(slotIndex, { options });
    }
    render() {
        return b `
      ${this.slots.length === 0
            ? b `<p class="empty">No slots defined. Click "Add Slot" or use the → Slot button in params/headers.</p>`
            : c(this.slots, (s, i) => s._id ?? i, (slot, i) => b `
              <div class="slot-row">
                <div>
                  <label>Name</label>
                  <input
                    .value=${slot.name}
                    placeholder="slot_name"
                    @input=${(e) => this._updateSlot(i, {
                name: e.target.value,
            })}
                  />
                </div>
                <div>
                  <label>Type</label>
                  <select
                    .value=${slot.type}
                    @change=${(e) => this._updateSlot(i, {
                type: e.target.value,
            })}
                  >
                    <option value="text">text</option>
                    <option value="select">select</option>
                    <option value="number">number</option>
                    <option value="boolean">boolean</option>
                  </select>
                </div>
                <div>
                  <label>Required</label>
                  <input
                    type="checkbox"
                    .checked=${slot.required}
                    @change=${(e) => this._updateSlot(i, {
                required: e.target.checked,
            })}
                  />
                </div>
                <div>
                  ${slot.required
                ? b ``
                : b `
                        <label>Default</label>
                        <input
                          .value=${slot.default != null ? String(slot.default) : ""}
                          placeholder="default value"
                          @input=${(e) => this._updateSlot(i, {
                    default: e.target.value || null,
                })}
                        />
                      `}
                  ${slot.type === "select"
                ? b `
                        <div class="options-list">
                          ${(slot.options ?? []).map((opt, oi) => b `
                              <span class="chip">
                                ${opt}
                                <button @click=${() => this._removeOption(i, oi)}>×</button>
                              </span>
                            `)}
                        </div>
                        <div class="add-option">
                          <input
                            id="opt-input-${i}"
                            placeholder="Add option"
                            @keydown=${(e) => {
                    if (e.key === "Enter") {
                        e.preventDefault();
                        this._addOption(i, this.shadowRoot.querySelector(`#opt-input-${i}`));
                    }
                }}
                          />
                          <button
                            @click=${() => this._addOption(i, this.shadowRoot.querySelector(`#opt-input-${i}`))}
                          >
                            Add
                          </button>
                        </div>
                      `
                : b ``}
                </div>
                <button class="delete-btn" @click=${() => this._deleteSlot(i)}>
                  ×
                </button>
              </div>
            `)}
      <button class="add-slot-btn" @click=${this._addSlot}>+ Add Slot</button>
    `;
    }
};
SlotEditor.styles = i$5 `
    :host {
      display: block;
    }
    .slot-row {
      display: grid;
      grid-template-columns: 1fr 120px 80px 1fr auto;
      gap: 8px;
      align-items: center;
      padding: 6px 0;
      border-bottom: 1px solid var(--divider-color);
    }
    .slot-row:last-child {
      border-bottom: none;
    }
    label {
      font-size: 12px;
      color: var(--secondary-text-color);
      display: block;
      margin-bottom: 2px;
    }
    input,
    select {
      width: 100%;
      padding: 6px 8px;
      border: 1px solid var(--divider-color);
      border-radius: 4px;
      background: var(--card-background-color);
      color: var(--primary-text-color);
      font-size: 14px;
      box-sizing: border-box;
    }
    .options-list {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
      margin-top: 6px;
    }
    .chip {
      background: var(--primary-color);
      color: white;
      border-radius: 12px;
      padding: 2px 8px;
      font-size: 12px;
      display: flex;
      align-items: center;
      gap: 4px;
      cursor: default;
    }
    .chip button {
      background: none;
      border: none;
      color: white;
      cursor: pointer;
      padding: 0;
      font-size: 12px;
      line-height: 1;
    }
    .add-option {
      display: flex;
      gap: 4px;
      margin-top: 4px;
    }
    .add-option input {
      flex: 1;
    }
    .add-option button {
      padding: 4px 10px;
      background: var(--primary-color);
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 13px;
    }
    .delete-btn {
      background: none;
      border: none;
      color: var(--error-color, #db4437);
      cursor: pointer;
      font-size: 18px;
      padding: 0 4px;
      align-self: center;
    }
    .empty {
      color: var(--secondary-text-color);
      font-style: italic;
      font-size: 13px;
      padding: 8px 0;
    }
    .add-slot-btn {
      margin-top: 8px;
      padding: 6px 16px;
      background: var(--primary-color);
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 13px;
    }
  `;
__decorate([
    n({ attribute: false })
], SlotEditor.prototype, "slots", void 0);
SlotEditor = __decorate([
    t$2("hass-requester-slot-editor")
], SlotEditor);

const METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE"];
const BODY_TYPES = ["none", "json", "form", "text"];
const METHODS_WITH_BODY = ["POST", "PUT", "PATCH"];
let RequestEditor = class RequestEditor extends i$2 {
    constructor() {
        super(...arguments);
        this.request = null;
        this._name = "";
        this._method = "GET";
        this._url = "";
        this._queryParams = [];
        this._headers = [];
        this._bodyType = "none";
        this._bodyJson = "";
        this._bodyForm = [];
        this._bodyText = "";
        this._slots = [];
        this._saving = false;
        this._testing = false;
        this._error = "";
        this._testResult = null;
        this._testParams = {};
        this._showTestDialog = false;
    }
    connectedCallback() {
        super.connectedCallback();
        if (this.request) {
            this._populateFromRequest(this.request);
        }
    }
    _populateFromRequest(req) {
        this._name = req.name;
        this._method = req.method;
        this._url = req.url;
        this._queryParams = Object.entries(req.query_params);
        this._headers = Object.entries(req.headers);
        this._bodyType = req.body_type;
        this._slots = req.slots.map((s) => ({ _id: crypto.randomUUID(), ...s }));
        if (req.body_type === "json" && req.body) {
            this._bodyJson =
                typeof req.body === "string"
                    ? req.body
                    : JSON.stringify(req.body, null, 2);
        }
        else if (req.body_type === "form" &&
            req.body &&
            typeof req.body === "object") {
            this._bodyForm = Object.entries(req.body);
        }
        else if (req.body_type === "text" && req.body) {
            this._bodyText = String(req.body);
        }
        // Init test params with empty strings for each slot
        const params = {};
        req.slots.forEach((s) => { params[s.name] = ""; });
        this._testParams = params;
    }
    _onCurlParsed(e) {
        const d = e.detail;
        this._method = d.method;
        this._url = d.url;
        this._queryParams = Object.entries(d.query_params);
        this._headers = Object.entries(d.headers);
        this._bodyType = d.body_type;
        if (d.body_type === "json" && d.body) {
            this._bodyJson =
                typeof d.body === "string"
                    ? d.body
                    : JSON.stringify(d.body, null, 2);
        }
        else if (d.body_type === "form" &&
            d.body &&
            typeof d.body === "object") {
            this._bodyForm = Object.entries(d.body);
        }
        else if (d.body_type === "text" && d.body) {
            this._bodyText = String(d.body);
        }
    }
    _toSlot(table, rowIndex, key, _value) {
        const slotName = key.replace(/[^a-zA-Z0-9_]/g, "_").toLowerCase() || "slot";
        const newValue = `{{ ${slotName} }}`;
        if (table === "query") {
            const updated = [...this._queryParams];
            updated[rowIndex] = [key, newValue];
            this._queryParams = updated;
        }
        else {
            const updated = [...this._headers];
            updated[rowIndex] = [key, newValue];
            this._headers = updated;
        }
        if (!this._slots.find((s) => s.name === slotName)) {
            this._slots = [
                ...this._slots,
                { name: slotName, type: "text", required: true, default: null },
            ];
            this._testParams = { ...this._testParams, [slotName]: "" };
        }
    }
    _kvTable(rows, onChange, onSlot) {
        return b `
      <table class="kv-table">
        <thead>
          <tr>
            <th>Key</th>
            <th>Value</th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          ${rows.map(([k, v], i) => b `
              <tr>
                <td>
                  <input
                    .value=${k}
                    placeholder="key"
                    @input=${(e) => {
            const updated = [...rows];
            updated[i] = [
                e.target.value,
                v,
            ];
            onChange(updated);
        }}
                  />
                </td>
                <td>
                  <input
                    .value=${v}
                    placeholder="value or {{ slot }}"
                    @input=${(e) => {
            const updated = [...rows];
            updated[i] = [
                k,
                e.target.value,
            ];
            onChange(updated);
        }}
                  />
                </td>
                <td>
                  <button
                    class="slot-btn"
                    title="Convert to dynamic slot"
                    @click=${() => onSlot(i, k, v)}
                  >
                    → Slot
                  </button>
                </td>
                <td>
                  <button
                    class="delete-btn"
                    @click=${() => {
            const updated = [...rows];
            updated.splice(i, 1);
            onChange(updated);
        }}
                  >
                    ×
                  </button>
                </td>
              </tr>
            `)}
        </tbody>
      </table>
      <button
        class="add-row-btn"
        @click=${() => onChange([...rows, ["", ""]])}
      >
        + Add Row
      </button>
    `;
    }
    _buildPayload() {
        const query_params = Object.fromEntries(this._queryParams.filter(([k]) => k.trim()));
        const headers = Object.fromEntries(this._headers.filter(([k]) => k.trim()));
        let body = null;
        if (this._bodyType === "json" && this._bodyJson.trim()) {
            try {
                body = JSON.parse(this._bodyJson);
            }
            catch {
                body = this._bodyJson;
            }
        }
        else if (this._bodyType === "form") {
            body = Object.fromEntries(this._bodyForm.filter(([k]) => k.trim()));
        }
        else if (this._bodyType === "text") {
            body = this._bodyText || null;
        }
        return {
            name: this._name,
            method: this._method,
            url: this._url,
            query_params,
            headers,
            body_type: this._bodyType,
            body,
            slots: this._slots.map(({ _id: _ignored, ...s }) => s),
        };
    }
    _getWsError(e) {
        if (!e || typeof e !== "object")
            return "Failed to save request";
        const err = e;
        return String(err["message"] ?? err["error"] ?? "Failed to save request");
    }
    async _save() {
        if (!this._name.trim()) {
            this._error = "Name is required.";
            return;
        }
        if (!this._url.trim()) {
            this._error = "URL is required.";
            return;
        }
        this._saving = true;
        this._error = "";
        this._testResult = null;
        try {
            const payload = this._buildPayload();
            if (this.request?.id) {
                await this.hass.callWS({
                    type: "hass_requester/update",
                    request_id: this.request.id,
                    ...payload,
                });
            }
            else {
                await this.hass.callWS({
                    type: "hass_requester/create",
                    ...payload,
                });
            }
            this.dispatchEvent(new CustomEvent("saved", { bubbles: true, composed: true }));
        }
        catch (e) {
            this._error = this._getWsError(e);
        }
        finally {
            this._saving = false;
        }
    }
    _openTest() {
        // Reset test params for current slots
        const params = {};
        this._slots.forEach((s) => {
            params[s.name] = this._testParams[s.name] ?? "";
        });
        this._testParams = params;
        this._testResult = null;
        this._showTestDialog = true;
    }
    async _runTest() {
        this._testing = true;
        this._testResult = null;
        try {
            const payload = this._buildPayload();
            await this.hass.callWS({
                type: "hass_requester/test_request",
                ...payload,
                params: this._testParams,
            });
            this._testResult = { success: true, message: "Request sent successfully!" };
        }
        catch (e) {
            this._testResult = {
                success: false,
                message: this._getWsError(e),
            };
        }
        finally {
            this._testing = false;
        }
    }
    render() {
        const hasBody = METHODS_WITH_BODY.includes(this._method);
        return b `
      <!-- Header -->
      <div class="header-row">
        <div class="header-title">
          <img src="/api/hass_requester/frontend/logo.png" alt="HASS Requester" />
          <h2>${this.request ? "Edit Request" : "New Request"}</h2>
        </div>
        <div class="header-actions">
          <hass-requester-curl-importer
            .hass=${this.hass}
            @curl-parsed=${this._onCurlParsed}
          ></hass-requester-curl-importer>
        </div>
      </div>

      <!-- Basic Info -->
      <div class="card">
        <p class="section-title">Basic</p>
        <div class="field">
          <label>Name</label>
          <input
            type="text"
            .value=${this._name}
            placeholder="my_request"
            @input=${(e) => (this._name = e.target.value)}
          />
        </div>
        <div class="field method-url">
          <div>
            <label>Method</label>
            <select
              .value=${this._method}
              @change=${(e) => {
            this._method = e.target
                .value;
            if (!METHODS_WITH_BODY.includes(this._method)) {
                this._bodyType = "none";
            }
        }}
            >
              ${METHODS.map((m) => b `<option value=${m} ?selected=${m === this._method}>${m}</option>`)}
            </select>
          </div>
          <div>
            <label>URL</label>
            <input
              type="text"
              .value=${this._url}
              placeholder="https://api.example.com/endpoint/{{ path_param }}"
              @input=${(e) => (this._url = e.target.value)}
            />
          </div>
        </div>
      </div>

      <!-- Query Params -->
      <div class="card">
        <p class="section-title">Query Parameters</p>
        ${this._kvTable(this._queryParams, (rows) => (this._queryParams = rows), (i, k, v) => this._toSlot("query", i, k, v))}
      </div>

      <!-- Headers -->
      <div class="card">
        <p class="section-title">Headers</p>
        ${this._kvTable(this._headers, (rows) => (this._headers = rows), (i, k, v) => this._toSlot("headers", i, k, v))}
      </div>

      <!-- Body (POST/PUT/PATCH only) -->
      ${hasBody
            ? b `
            <div class="card">
              <p class="section-title">Body</p>
              <div class="field">
                <label>Body Type</label>
                <select
                  .value=${this._bodyType}
                  @change=${(e) => (this._bodyType = e.target
                .value)}
                >
                  ${BODY_TYPES.map((t) => b `<option value=${t} ?selected=${t === this._bodyType}>${t}</option>`)}
                </select>
              </div>
              ${this._bodyType === "json"
                ? b `
                    <div class="field">
                      <label>JSON Body — use <code>{{ slot_name }}</code> for dynamic values</label>
                      <textarea
                        .value=${this._bodyJson}
                        placeholder='{"key": "{{ slot_name }}", "static": "value"}'
                        @input=${(e) => (this._bodyJson = e.target.value)}
                      ></textarea>
                    </div>
                  `
                : this._bodyType === "form"
                    ? b `
                    ${this._kvTable(this._bodyForm, (rows) => (this._bodyForm = rows), (i, k, v) => this._toSlot("query", i, k, v))}
                  `
                    : this._bodyType === "text"
                        ? b `
                    <div class="field">
                      <label>Text Body</label>
                      <textarea
                        .value=${this._bodyText}
                        @input=${(e) => (this._bodyText = e.target.value)}
                      ></textarea>
                    </div>
                  `
                        : b ``}
            </div>
          `
            : b ``}

      <!-- Slots -->
      <div class="card">
        <p class="section-title">Dynamic Slots</p>
        <hass-requester-slot-editor
          .slots=${this._slots}
          @slots-changed=${(e) => {
            this._slots = e.detail.slots;
            const params = { ...this._testParams };
            e.detail.slots.forEach((s) => {
                if (!(s.name in params))
                    params[s.name] = "";
            });
            this._testParams = params;
        }}
        ></hass-requester-slot-editor>

        ${this._slots.length > 0 ? b `
          <div class="slot-hint">
            <strong>💡 How to use slots in your request:</strong>
            <p>Place <code>{{ slot_name }}</code> anywhere in the URL, query params, headers or body. It will be replaced with the value from the automation.</p>
            <table class="slot-hint-table">
              <thead><tr><th>Slot</th><th>Use in URL / params / body as</th></tr></thead>
              <tbody>
                ${this._slots.filter(s => s.name).map(s => b `
                  <tr>
                    <td><strong>${s.name}</strong></td>
                    <td><code>{{ ${s.name} }}</code></td>
                  </tr>
                `)}
              </tbody>
            </table>
            <p class="slot-hint-example">
              Example URL:&nbsp;
              <code>https://api.example.com/notify?location={{ ${this._slots[0]?.name || "slot_name"} }}</code>
            </p>
          </div>
        ` : b ``}
      </div>

      <!-- Messages -->
      ${this._error
            ? b `<div class="msg error">${this._error}</div>`
            : b ``}
      ${this._testResult
            ? b `<div class="msg ${this._testResult.success ? "success" : "error"}">
            ${this._testResult.success ? "✓" : "✗"} ${this._testResult.message}
          </div>`
            : b ``}

      <!-- Footer -->
      <div class="footer">
        <button
          class="btn-cancel"
          @click=${() => this.dispatchEvent(new CustomEvent("cancelled", { bubbles: true, composed: true }))}
        >
          Cancel
        </button>
        <button
          class="btn-test"
          ?disabled=${this._testing || this._saving}
          @click=${this._openTest}
        >
          ${this._testing ? "Sending..." : "⚡ Test"}
        </button>
        <button
          class="btn-save"
          ?disabled=${this._saving || this._testing}
          @click=${this._save}
        >
          ${this._saving ? "Saving..." : "Save Request"}
        </button>
      </div>

      <!-- Test Dialog -->
      ${this._showTestDialog
            ? b `
            <div
              class="test-overlay"
              @click=${(e) => {
                if (e.target === e.currentTarget)
                    this._showTestDialog = false;
            }}
            >
              <div class="test-dialog">
                <h3>⚡ Test Request</h3>
                <p>
                  Fill in slot values to test the request live.
                  ${this._slots.length === 0
                ? "No slots defined — request will be sent as-is."
                : ""}
                </p>
                ${this._slots.map((s) => b `
                    <div class="test-field">
                      <label>{{ ${s.name} }}${s.required ? " *" : ""}</label>
                      <input
                        type="text"
                        .value=${this._testParams[s.name] ?? ""}
                        placeholder=${s.default != null
                ? `default: ${s.default}`
                : s.required
                    ? "required"
                    : "optional"}
                        @input=${(e) => {
                this._testParams = {
                    ...this._testParams,
                    [s.name]: e.target.value,
                };
            }}
                      />
                    </div>
                  `)}
                ${this._testResult
                ? b `
                      <div
                        class="msg ${this._testResult.success
                    ? "success"
                    : "error"}"
                        style="margin-top:12px"
                      >
                        ${this._testResult.success ? "✓" : "✗"}
                        ${this._testResult.message}
                      </div>
                    `
                : b ``}
                <div class="test-actions">
                  <button
                    class="test-cancel"
                    @click=${() => {
                this._showTestDialog = false;
                this._testResult = null;
            }}
                  >
                    Close
                  </button>
                  <button
                    class="test-run"
                    ?disabled=${this._testing}
                    @click=${this._runTest}
                  >
                    ${this._testing ? "Sending..." : "Send Request"}
                  </button>
                </div>
              </div>
            </div>
          `
            : b ``}
    `;
    }
};
RequestEditor.styles = i$5 `
    :host {
      display: block;
      max-width: 920px;
      margin: 0 auto;
      padding: 24px 16px;
    }
    h2 {
      margin: 0 0 6px;
      font-size: 22px;
      color: var(--primary-text-color);
    }
    .header-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
    .header-title {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .header-title img {
      width: 36px;
      height: 36px;
      border-radius: 7px;
    }
    .header-actions {
      display: flex;
      gap: 10px;
      align-items: center;
    }
    .card {
      background: var(--card-background-color);
      border-radius: 8px;
      padding: 20px;
      margin-bottom: 14px;
      box-shadow: var(--ha-card-box-shadow, 0 2px 6px rgba(0,0,0,.12));
    }
    .section-title {
      font-size: 12px;
      font-weight: 700;
      color: var(--secondary-text-color);
      text-transform: uppercase;
      letter-spacing: 0.06em;
      margin: 0 0 14px;
    }
    .field {
      margin-bottom: 14px;
    }
    label {
      font-size: 13px;
      color: var(--secondary-text-color);
      display: block;
      margin-bottom: 4px;
    }
    input[type="text"],
    select,
    textarea {
      width: 100%;
      padding: 8px 10px;
      border: 1px solid var(--divider-color);
      border-radius: 6px;
      background: var(--card-background-color);
      color: var(--primary-text-color);
      font-size: 14px;
      box-sizing: border-box;
      outline: none;
    }
    input[type="text"]:focus,
    select:focus,
    textarea:focus {
      border-color: var(--primary-color);
    }
    textarea {
      font-family: monospace;
      min-height: 120px;
      resize: vertical;
    }
    .method-url {
      display: grid;
      grid-template-columns: 140px 1fr;
      gap: 10px;
    }
    .kv-table {
      width: 100%;
      border-collapse: collapse;
    }
    .kv-table th {
      text-align: left;
      font-size: 12px;
      color: var(--secondary-text-color);
      padding: 4px 6px;
      border-bottom: 1px solid var(--divider-color);
    }
    .kv-table td {
      padding: 4px 4px;
    }
    .kv-table input {
      width: 100%;
      padding: 5px 8px;
      border: 1px solid var(--divider-color);
      border-radius: 4px;
      background: var(--card-background-color);
      color: var(--primary-text-color);
      font-size: 13px;
      box-sizing: border-box;
    }
    .slot-btn {
      padding: 3px 10px;
      background: var(--accent-color, #03a9f4);
      color: white;
      border: none;
      border-radius: 3px;
      cursor: pointer;
      font-size: 12px;
      white-space: nowrap;
    }
    .delete-btn {
      background: none;
      border: none;
      color: var(--error-color, #db4437);
      cursor: pointer;
      font-size: 18px;
      padding: 0 4px;
    }
    .add-row-btn {
      margin-top: 8px;
      padding: 4px 12px;
      background: none;
      border: 1px solid var(--primary-color);
      border-radius: 4px;
      color: var(--primary-color);
      cursor: pointer;
      font-size: 13px;
    }
    .footer {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      margin-top: 20px;
      flex-wrap: wrap;
    }
    .btn-cancel {
      padding: 8px 20px;
      background: none;
      border: 1px solid var(--divider-color);
      border-radius: 6px;
      color: var(--primary-text-color);
      cursor: pointer;
      font-size: 14px;
    }
    .btn-test {
      padding: 8px 20px;
      background: #ff9800;
      border: none;
      border-radius: 6px;
      color: white;
      cursor: pointer;
      font-size: 14px;
      font-weight: 600;
    }
    .btn-test:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    .btn-save {
      padding: 8px 24px;
      background: var(--primary-color);
      border: none;
      border-radius: 6px;
      color: white;
      cursor: pointer;
      font-size: 14px;
      font-weight: 600;
    }
    .btn-save:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    .slot-hint {
      margin-top: 16px;
      padding: 12px 16px;
      background: rgba(3, 169, 244, 0.08);
      border: 1px solid rgba(3, 169, 244, 0.3);
      border-radius: 8px;
      font-size: 13px;
      color: var(--primary-text-color);
    }
    .slot-hint p {
      margin: 6px 0;
    }
    .slot-hint code {
      background: rgba(0,0,0,0.18);
      padding: 1px 6px;
      border-radius: 4px;
      font-family: monospace;
      font-size: 12px;
    }
    .slot-hint-table {
      width: 100%;
      border-collapse: collapse;
      margin: 8px 0;
    }
    .slot-hint-table th,
    .slot-hint-table td {
      text-align: left;
      padding: 4px 10px;
      border-bottom: 1px solid rgba(255,255,255,0.06);
      font-size: 13px;
    }
    .slot-hint-table th {
      color: var(--secondary-text-color);
      font-weight: 600;
    }
    .slot-hint-example {
      margin-top: 10px !important;
      color: var(--secondary-text-color);
    }
    .msg {
      padding: 10px 14px;
      border-radius: 6px;
      font-size: 13px;
      margin-top: 10px;
    }
    .msg.error {
      background: rgba(219, 68, 55, 0.12);
      color: var(--error-color, #db4437);
      border: 1px solid rgba(219, 68, 55, 0.3);
    }
    .msg.success {
      background: rgba(67, 160, 71, 0.12);
      color: #43a047;
      border: 1px solid rgba(67, 160, 71, 0.3);
    }
    /* Test params modal */
    .test-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.55);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 200;
    }
    .test-dialog {
      background: var(--card-background-color);
      border-radius: 10px;
      padding: 28px;
      width: 90%;
      max-width: 500px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.3);
    }
    .test-dialog h3 { margin: 0 0 6px; }
    .test-dialog p { color: var(--secondary-text-color); font-size: 13px; margin: 0 0 16px; }
    .test-field { margin-bottom: 12px; }
    .test-field label { font-size: 13px; color: var(--secondary-text-color); display: block; margin-bottom: 4px; }
    .test-field input {
      width: 100%;
      padding: 7px 10px;
      border: 1px solid var(--divider-color);
      border-radius: 6px;
      background: var(--card-background-color);
      color: var(--primary-text-color);
      font-size: 14px;
      box-sizing: border-box;
    }
    .test-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 16px; }
    .test-cancel { padding: 8px 18px; background: none; border: 1px solid var(--divider-color); border-radius: 6px; cursor: pointer; color: var(--primary-text-color); }
    .test-run { padding: 8px 20px; background: #ff9800; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; }
    .test-run:disabled { opacity: 0.5; }
  `;
__decorate([
    n({ attribute: false })
], RequestEditor.prototype, "hass", void 0);
__decorate([
    n({ attribute: false })
], RequestEditor.prototype, "request", void 0);
__decorate([
    r()
], RequestEditor.prototype, "_name", void 0);
__decorate([
    r()
], RequestEditor.prototype, "_method", void 0);
__decorate([
    r()
], RequestEditor.prototype, "_url", void 0);
__decorate([
    r()
], RequestEditor.prototype, "_queryParams", void 0);
__decorate([
    r()
], RequestEditor.prototype, "_headers", void 0);
__decorate([
    r()
], RequestEditor.prototype, "_bodyType", void 0);
__decorate([
    r()
], RequestEditor.prototype, "_bodyJson", void 0);
__decorate([
    r()
], RequestEditor.prototype, "_bodyForm", void 0);
__decorate([
    r()
], RequestEditor.prototype, "_bodyText", void 0);
__decorate([
    r()
], RequestEditor.prototype, "_slots", void 0);
__decorate([
    r()
], RequestEditor.prototype, "_saving", void 0);
__decorate([
    r()
], RequestEditor.prototype, "_testing", void 0);
__decorate([
    r()
], RequestEditor.prototype, "_error", void 0);
__decorate([
    r()
], RequestEditor.prototype, "_testResult", void 0);
__decorate([
    r()
], RequestEditor.prototype, "_testParams", void 0);
__decorate([
    r()
], RequestEditor.prototype, "_showTestDialog", void 0);
RequestEditor = __decorate([
    t$2("hass-requester-editor")
], RequestEditor);

let HassRequesterPanel = class HassRequesterPanel extends i$2 {
    constructor() {
        super(...arguments);
        this.narrow = false;
        this._view = "list";
        this._requests = [];
        this._editingRequest = null;
        this._loading = true;
        this._error = "";
    }
    async connectedCallback() {
        super.connectedCallback();
        await this._loadRequests();
    }
    async _loadRequests() {
        this._loading = true;
        this._error = "";
        try {
            const result = await this.hass.callWS({
                type: "hass_requester/list",
            });
            this._requests = result.requests;
        }
        catch (e) {
            this._error =
                e instanceof Error ? e.message : "Failed to load requests";
        }
        finally {
            this._loading = false;
        }
    }
    _onNew() {
        this._editingRequest = null;
        this._view = "edit";
    }
    _onEdit(e) {
        this._editingRequest = e.detail;
        this._view = "edit";
    }
    async _onSaved() {
        this._view = "list";
        await this._loadRequests();
    }
    async _onDeleted() {
        await this._loadRequests();
    }
    _onCancelled() {
        this._view = "list";
        this._editingRequest = null;
    }
    render() {
        if (this._loading) {
            return b `<div class="loading">Loading requests...</div>`;
        }
        return b `
      ${this._error
            ? b `<div class="error-banner">${this._error}</div>`
            : b ``}
      ${this._view === "list"
            ? b `
            <hass-requester-list
              .hass=${this.hass}
              .requests=${this._requests}
              @new=${this._onNew}
              @edit=${this._onEdit}
              @deleted=${this._onDeleted}
            ></hass-requester-list>
          `
            : b `
            <hass-requester-editor
              .hass=${this.hass}
              .request=${this._editingRequest}
              @saved=${this._onSaved}
              @cancelled=${this._onCancelled}
            ></hass-requester-editor>
          `}
    `;
    }
};
HassRequesterPanel.styles = i$5 `
    :host {
      display: block;
      min-height: 100vh;
      background: var(--primary-background-color);
    }
    .loading {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 200px;
      color: var(--secondary-text-color);
      font-size: 16px;
    }
    .error-banner {
      background: var(--error-color, #db4437);
      color: white;
      padding: 12px 16px;
      font-size: 14px;
    }
  `;
__decorate([
    n({ attribute: false })
], HassRequesterPanel.prototype, "hass", void 0);
__decorate([
    n({ type: Boolean })
], HassRequesterPanel.prototype, "narrow", void 0);
__decorate([
    r()
], HassRequesterPanel.prototype, "_view", void 0);
__decorate([
    r()
], HassRequesterPanel.prototype, "_requests", void 0);
__decorate([
    r()
], HassRequesterPanel.prototype, "_editingRequest", void 0);
__decorate([
    r()
], HassRequesterPanel.prototype, "_loading", void 0);
__decorate([
    r()
], HassRequesterPanel.prototype, "_error", void 0);
HassRequesterPanel = __decorate([
    t$2("hass-requester-panel")
], HassRequesterPanel);

export { HassRequesterPanel };
