if(!self.define){let e,i={};const s=(s,n)=>(s=new URL(s+".js",n).href,i[s]||new Promise((i=>{if("document"in self){const e=document.createElement("script");e.src=s,e.onload=i,document.head.appendChild(e)}else e=s,importScripts(s),i()})).then((()=>{let e=i[s];if(!e)throw new Error(`Module ${s} didn’t register its module`);return e})));self.define=(n,r)=>{const o=e||("document"in self?document.currentScript.src:"")||location.href;if(i[o])return;let f={};const d=e=>s(e,o),t={module:{uri:o},exports:f,require:d};i[o]=Promise.all(n.map((e=>t[e]||d(e)))).then((e=>(r(...e),f)))}}define(["./workbox-b3e22772"],(function(e){"use strict";self.addEventListener("message",(e=>{e.data&&"SKIP_WAITING"===e.data.type&&self.skipWaiting()})),e.precacheAndRoute([{url:"assets/index.79ab6e5e.js",revision:null},{url:"assets/index.ee56839e.css",revision:null},{url:"index.html",revision:"55726d97487404e3b0e76cd8623622f8"},{url:"smui-dark.css",revision:"055b8c742441442f66b53e738cc73c3e"},{url:"smui.css",revision:"2eefe1d095f0710b1aad2939231b50c9"},{url:"favicon.svg",revision:"e2bd77e102ff4587f3745573a47afbcb"},{url:"favicon.ico",revision:"b7fd83d5095e65f3b89d0426af848a40"},{url:"robots.txt",revision:"cd9cd94aaa699e0a16e692b6bb16f672"},{url:"apple-touch-icon.png",revision:"b1268fce23cdd7d2b45a1f1b26319e89"},{url:"pwa-192x192.png",revision:"5650ad747ff2b731579536a40dcbd1df"},{url:"pwa-512x512.png",revision:"93b889ad46799994af9bf223f753f7d4"},{url:"manifest.webmanifest",revision:"160bf521b446dcd37f023ab88d8051e7"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html")))}));
