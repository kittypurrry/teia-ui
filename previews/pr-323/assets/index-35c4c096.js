import{g as h,k as l,u,l as p,m as c,e as i}from"./contracts-80302b58.js";var b=l();const E=h(b);async function k(e){const r=x(e),t=[w(r,e)];e.timeout&&e.timeout>0&&t.push(new Promise(a=>{setTimeout(()=>{const o=e.timeoutErrorMessage?e.timeoutErrorMessage:"timeout of "+e.timeout+"ms exceeded";a(n(o,e,"ECONNABORTED",r))},e.timeout)}));const s=await Promise.race(t);return new Promise((a,o)=>{s instanceof Error?o(s):Object.prototype.toString.call(e.settle)==="[object Function]"?e.settle(a,o,s):E(a,o,s)})}async function w(e,r){let t;try{t=await fetch(e);const a={ok:t.ok,status:t.status,statusText:t.statusText,headers:new Headers(t.headers),config:r,request:e};if(t.status>=400)return n("Response Error",r,"ERR_NETWORK",e,a)}catch{return n("Network Error",r,"ERR_NETWORK",e)}const s={ok:t.ok,status:t.status,statusText:t.statusText,headers:new Headers(t.headers),config:r,request:e};if(t.status>=200&&t.status!==204)switch(r.responseType){case"arraybuffer":s.data=await t.arrayBuffer();break;case"blob":s.data=await t.blob();break;case"json":s.data=await t.json();break;case"formData":s.data=await t.formData();break;default:s.data=await t.text();break}return s}function x(e){const r=new Headers(e.headers);if(e.auth){const d=e.auth.username||"",m=e.auth.password?decodeURI(encodeURIComponent(e.auth.password)):"";r.set("Authorization",`Basic ${btoa(d+":"+m)}`)}const t=e.method.toUpperCase(),s={headers:r,method:t};t!=="GET"&&t!=="HEAD"&&(s.body=e.data,u.isFormData(s.body)&&u.isStandardBrowserEnv()&&r.delete("Content-Type")),e.mode&&(s.mode=e.mode),e.cache&&(s.cache=e.cache),e.integrity&&(s.integrity=e.integrity),e.redirect&&(s.redirect=e.redirect),e.referrer&&(s.referrer=e.referrer),u.isUndefined(e.withCredentials)||(s.credentials=e.withCredentials?"include":"omit");const a=p(e.baseURL,e.url),o=c(a,e.params,e.paramsSerializer);return new Request(o,s)}function n(e,r,t,s,a){if(i.AxiosError&&typeof i.AxiosError=="function")return new i.AxiosError(e,i.AxiosError[t],r,s,a);var o=new Error(e);return R(o,r,t,s,a)}function R(e,r,t,s,a){return e.config=r,t&&(e.code=t),e.request=s,e.response=a,e.isAxiosError=!0,e.toJSON=function(){return{message:this.message,name:this.name,description:this.description,number:this.number,fileName:this.fileName,lineNumber:this.lineNumber,columnNumber:this.columnNumber,stack:this.stack,config:this.config,code:this.code,status:this.response&&this.response.status?this.response.status:null}},e}export{k as default};
