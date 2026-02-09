(function(){"use strict";const io=t=>t.length>0,Ki=t=>t.length>0,Ua=(t,e)=>[...t,e],Gi=t=>t[0],$a=t=>t.shift(),Qt=(t,e)=>{if(!t)throw new Error(e)},so=(t,e="Expected a non-empty readonly array.")=>{Qt(t.length>0,e)};function od(t){return t instanceof Uint8Array||ArrayBuffer.isView(t)&&t.constructor.name==="Uint8Array"}function oo(t){if(typeof t!="boolean")throw new Error(`boolean expected, not ${t}`)}function ao(t){if(!Number.isSafeInteger(t)||t<0)throw new Error("positive integer expected, got "+t)}function Dt(t,e,r=""){const n=od(t),s=t?.length,a=e!==void 0;if(!n||a&&s!==e){const d=r&&`"${r}" `,g=a?` of length ${e}`:"",x=n?`length=${s}`:`type=${typeof t}`;throw new Error(d+"expected Uint8Array"+g+", got "+x)}return t}function Ba(t,e=!0){if(t.destroyed)throw new Error("Hash instance has been destroyed");if(e&&t.finished)throw new Error("Hash#digest() has already been called")}function ad(t,e){Dt(t,void 0,"output");const r=e.outputLen;if(t.length<r)throw new Error("digestInto() expects output buffer of length at least "+r)}function zr(t){return new Uint32Array(t.buffer,t.byteOffset,Math.floor(t.byteLength/4))}function Bn(...t){for(let e=0;e<t.length;e++)t[e].fill(0)}function ld(t){return new DataView(t.buffer,t.byteOffset,t.byteLength)}const cd=new Uint8Array(new Uint32Array([287454020]).buffer)[0]===68,ja=typeof Uint8Array.from([]).toHex=="function"&&typeof Uint8Array.fromHex=="function",ud=Array.from({length:256},(t,e)=>e.toString(16).padStart(2,"0"));function lo(t){if(Dt(t),ja)return t.toHex();let e="";for(let r=0;r<t.length;r++)e+=ud[t[r]];return e}const Tr={_0:48,_9:57,A:65,F:70,a:97,f:102};function za(t){if(t>=Tr._0&&t<=Tr._9)return t-Tr._0;if(t>=Tr.A&&t<=Tr.F)return t-(Tr.A-10);if(t>=Tr.a&&t<=Tr.f)return t-(Tr.a-10)}function Va(t){if(typeof t!="string")throw new Error("hex string expected, got "+typeof t);if(ja)return Uint8Array.fromHex(t);const e=t.length,r=e/2;if(e%2)throw new Error("hex string expected, got unpadded hex of length "+e);const n=new Uint8Array(r);for(let s=0,a=0;s<r;s++,a+=2){const d=za(t.charCodeAt(a)),g=za(t.charCodeAt(a+1));if(d===void 0||g===void 0){const x=t[a]+t[a+1];throw new Error('hex string expected, got non-hex character "'+x+'" at index '+a)}n[s]=d*16+g}return n}function dd(t){if(typeof t!="string")throw new Error("string expected");return new Uint8Array(new TextEncoder().encode(t))}function fd(t){return new TextDecoder().decode(t)}function hd(...t){let e=0;for(let n=0;n<t.length;n++){const s=t[n];Dt(s),e+=s.length}const r=new Uint8Array(e);for(let n=0,s=0;n<t.length;n++){const a=t[n];r.set(a,s),s+=a.length}return r}function pd(t,e){if(e==null||typeof e!="object")throw new Error("options must be defined");return Object.assign(t,e)}function md(t,e){if(t.length!==e.length)return!1;let r=0;for(let n=0;n<t.length;n++)r|=t[n]^e[n];return r===0}const _d=(t,e)=>{function r(n,...s){if(Dt(n,void 0,"key"),!cd)throw new Error("Non little-endian hardware is not yet supported");if(t.nonceLength!==void 0){const S=s[0];Dt(S,t.varSizeNonce?void 0:t.nonceLength,"nonce")}const a=t.tagLength;a&&s[1]!==void 0&&Dt(s[1],void 0,"AAD");const d=e(n,...s),g=(S,w)=>{if(w!==void 0){if(S!==2)throw new Error("cipher output not supported");Dt(w,void 0,"output")}};let x=!1;return{encrypt(S,w){if(x)throw new Error("cannot encrypt() twice with same key + nonce");return x=!0,Dt(S),g(d.encrypt.length,w),d.encrypt(S,w)},decrypt(S,w){if(Dt(S),a&&S.length<a)throw new Error('"ciphertext" expected length bigger than tagLength='+a);return g(d.decrypt.length,w),d.decrypt(S,w)}}}return Object.assign(r,t),r};function Qa(t,e,r=!0){if(e===void 0)return new Uint8Array(t);if(e.length!==t)throw new Error('"output" expected Uint8Array of length '+t+", got: "+e.length);if(r&&!yd(e))throw new Error("invalid output, must be aligned");return e}function gd(t,e,r){oo(r);const n=new Uint8Array(16),s=ld(n);return s.setBigUint64(0,BigInt(e),r),s.setBigUint64(8,BigInt(t),r),n}function yd(t){return t.byteOffset%4===0}function Xi(t){return Uint8Array.from(t)}function bd(t){return t instanceof Uint8Array||ArrayBuffer.isView(t)&&t.constructor.name==="Uint8Array"}function Ha(t,e=""){if(!Number.isSafeInteger(t)||t<0){const r=e&&`"${e}" `;throw new Error(`${r}expected integer >= 0, got ${t}`)}}function Yi(t,e,r=""){const n=bd(t),s=t?.length,a=e!==void 0;if(!n||a&&s!==e){const d=r&&`"${r}" `,g=a?` of length ${e}`:"",x=n?`length=${s}`:`type=${typeof t}`;throw new Error(d+"expected Uint8Array"+g+", got "+x)}return t}function wd(t){if(typeof t!="function"||typeof t.create!="function")throw new Error("Hash must wrapped by utils.createHasher");Ha(t.outputLen),Ha(t.blockLen)}function Zi(t,e=!0){if(t.destroyed)throw new Error("Hash instance has been destroyed");if(e&&t.finished)throw new Error("Hash#digest() has already been called")}function xd(t,e){Yi(t,void 0,"digestInto() output");const r=e.outputLen;if(t.length<r)throw new Error('"digestInto() output" expected to be of length >='+r)}function jn(...t){for(let e=0;e<t.length;e++)t[e].fill(0)}function co(t){return new DataView(t.buffer,t.byteOffset,t.byteLength)}function yr(t,e){return t<<32-e|t>>>e}function Ja(t){if(typeof t!="string")throw new Error("string expected");return new Uint8Array(new TextEncoder().encode(t))}function Ka(t,e={}){const r=(s,a)=>t(a).update(s).digest(),n=t(void 0);return r.outputLen=n.outputLen,r.blockLen=n.blockLen,r.create=s=>t(s),Object.assign(r,e),Object.freeze(r)}function Nd(t=32){const e=typeof globalThis=="object"?globalThis.crypto:null;if(typeof e?.getRandomValues!="function")throw new Error("crypto.getRandomValues must be defined");return e.getRandomValues(new Uint8Array(t))}const Ga=t=>({oid:Uint8Array.from([6,9,96,134,72,1,101,3,4,2,t])});function vd(t,e,r){return t&e^~t&r}function qd(t,e,r){return t&e^t&r^e&r}let Xa=class{blockLen;outputLen;padOffset;isLE;buffer;view;finished=!1;length=0;pos=0;destroyed=!1;constructor(e,r,n,s){this.blockLen=e,this.outputLen=r,this.padOffset=n,this.isLE=s,this.buffer=new Uint8Array(e),this.view=co(this.buffer)}update(e){Zi(this),Yi(e);const{view:r,buffer:n,blockLen:s}=this,a=e.length;for(let d=0;d<a;){const g=Math.min(s-this.pos,a-d);if(g===s){const x=co(e);for(;s<=a-d;d+=s)this.process(x,d);continue}n.set(e.subarray(d,d+g),this.pos),this.pos+=g,d+=g,this.pos===s&&(this.process(r,0),this.pos=0)}return this.length+=e.length,this.roundClean(),this}digestInto(e){Zi(this),xd(e,this),this.finished=!0;const{buffer:r,view:n,blockLen:s,isLE:a}=this;let{pos:d}=this;r[d++]=128,jn(this.buffer.subarray(d)),this.padOffset>s-d&&(this.process(n,0),d=0);for(let w=d;w<s;w++)r[w]=0;n.setBigUint64(s-8,BigInt(this.length*8),a),this.process(n,0);const g=co(e),x=this.outputLen;if(x%4)throw new Error("_sha2: outputLen must be aligned to 32bit");const N=x/4,S=this.get();if(N>S.length)throw new Error("_sha2: outputLen bigger than state");for(let w=0;w<N;w++)g.setUint32(4*w,S[w],a)}digest(){const{buffer:e,outputLen:r}=this;this.digestInto(e);const n=e.slice(0,r);return this.destroy(),n}_cloneInto(e){e||=new this.constructor,e.set(...this.get());const{blockLen:r,buffer:n,length:s,finished:a,destroyed:d,pos:g}=this;return e.destroyed=d,e.finished=a,e.length=s,e.pos=g,s%r&&e.buffer.set(n),e}clone(){return this._cloneInto()}};const Vr=Uint32Array.from([1779033703,3144134277,1013904242,2773480762,1359893119,2600822924,528734635,1541459225]),Bt=Uint32Array.from([1779033703,4089235720,3144134277,2227873595,1013904242,4271175723,2773480762,1595750129,1359893119,2917565137,2600822924,725511199,528734635,4215389547,1541459225,327033209]),es=BigInt(2**32-1),Ya=BigInt(32);function Sd(t,e=!1){return e?{h:Number(t&es),l:Number(t>>Ya&es)}:{h:Number(t>>Ya&es)|0,l:Number(t&es)|0}}function kd(t,e=!1){const r=t.length;let n=new Uint32Array(r),s=new Uint32Array(r);for(let a=0;a<r;a++){const{h:d,l:g}=Sd(t[a],e);[n[a],s[a]]=[d,g]}return[n,s]}const Za=(t,e,r)=>t>>>r,el=(t,e,r)=>t<<32-r|e>>>r,zn=(t,e,r)=>t>>>r|e<<32-r,Vn=(t,e,r)=>t<<32-r|e>>>r,ts=(t,e,r)=>t<<64-r|e>>>r-32,rs=(t,e,r)=>t>>>r-32|e<<64-r;function Ir(t,e,r,n){const s=(e>>>0)+(n>>>0);return{h:t+r+(s/2**32|0)|0,l:s|0}}const Ed=(t,e,r)=>(t>>>0)+(e>>>0)+(r>>>0),Ad=(t,e,r,n)=>e+r+n+(t/2**32|0)|0,Od=(t,e,r,n)=>(t>>>0)+(e>>>0)+(r>>>0)+(n>>>0),Td=(t,e,r,n,s)=>e+r+n+s+(t/2**32|0)|0,Id=(t,e,r,n,s)=>(t>>>0)+(e>>>0)+(r>>>0)+(n>>>0)+(s>>>0),Cd=(t,e,r,n,s,a)=>e+r+n+s+a+(t/2**32|0)|0,Ld=Uint32Array.from([1116352408,1899447441,3049323471,3921009573,961987163,1508970993,2453635748,2870763221,3624381080,310598401,607225278,1426881987,1925078388,2162078206,2614888103,3248222580,3835390401,4022224774,264347078,604807628,770255983,1249150122,1555081692,1996064986,2554220882,2821834349,2952996808,3210313671,3336571891,3584528711,113926993,338241895,666307205,773529912,1294757372,1396182291,1695183700,1986661051,2177026350,2456956037,2730485921,2820302411,3259730800,3345764771,3516065817,3600352804,4094571909,275423344,430227734,506948616,659060556,883997877,958139571,1322822218,1537002063,1747873779,1955562222,2024104815,2227730452,2361852424,2428436474,2756734187,3204031479,3329325298]),Qr=new Uint32Array(64);let Pd=class extends Xa{constructor(e){super(64,e,8,!1)}get(){const{A:e,B:r,C:n,D:s,E:a,F:d,G:g,H:x}=this;return[e,r,n,s,a,d,g,x]}set(e,r,n,s,a,d,g,x){this.A=e|0,this.B=r|0,this.C=n|0,this.D=s|0,this.E=a|0,this.F=d|0,this.G=g|0,this.H=x|0}process(e,r){for(let w=0;w<16;w++,r+=4)Qr[w]=e.getUint32(r,!1);for(let w=16;w<64;w++){const I=Qr[w-15],j=Qr[w-2],V=yr(I,7)^yr(I,18)^I>>>3,Y=yr(j,17)^yr(j,19)^j>>>10;Qr[w]=Y+Qr[w-7]+V+Qr[w-16]|0}let{A:n,B:s,C:a,D:d,E:g,F:x,G:N,H:S}=this;for(let w=0;w<64;w++){const I=yr(g,6)^yr(g,11)^yr(g,25),j=S+I+vd(g,x,N)+Ld[w]+Qr[w]|0,Y=(yr(n,2)^yr(n,13)^yr(n,22))+qd(n,s,a)|0;S=N,N=x,x=g,g=d+j|0,d=a,a=s,s=n,n=j+Y|0}n=n+this.A|0,s=s+this.B|0,a=a+this.C|0,d=d+this.D|0,g=g+this.E|0,x=x+this.F|0,N=N+this.G|0,S=S+this.H|0,this.set(n,s,a,d,g,x,N,S)}roundClean(){jn(Qr)}destroy(){this.set(0,0,0,0,0,0,0,0),jn(this.buffer)}},Fd=class extends Pd{A=Vr[0]|0;B=Vr[1]|0;C=Vr[2]|0;D=Vr[3]|0;E=Vr[4]|0;F=Vr[5]|0;G=Vr[6]|0;H=Vr[7]|0;constructor(){super(32)}};const tl=kd(["0x428a2f98d728ae22","0x7137449123ef65cd","0xb5c0fbcfec4d3b2f","0xe9b5dba58189dbbc","0x3956c25bf348b538","0x59f111f1b605d019","0x923f82a4af194f9b","0xab1c5ed5da6d8118","0xd807aa98a3030242","0x12835b0145706fbe","0x243185be4ee4b28c","0x550c7dc3d5ffb4e2","0x72be5d74f27b896f","0x80deb1fe3b1696b1","0x9bdc06a725c71235","0xc19bf174cf692694","0xe49b69c19ef14ad2","0xefbe4786384f25e3","0x0fc19dc68b8cd5b5","0x240ca1cc77ac9c65","0x2de92c6f592b0275","0x4a7484aa6ea6e483","0x5cb0a9dcbd41fbd4","0x76f988da831153b5","0x983e5152ee66dfab","0xa831c66d2db43210","0xb00327c898fb213f","0xbf597fc7beef0ee4","0xc6e00bf33da88fc2","0xd5a79147930aa725","0x06ca6351e003826f","0x142929670a0e6e70","0x27b70a8546d22ffc","0x2e1b21385c26c926","0x4d2c6dfc5ac42aed","0x53380d139d95b3df","0x650a73548baf63de","0x766a0abb3c77b2a8","0x81c2c92e47edaee6","0x92722c851482353b","0xa2bfe8a14cf10364","0xa81a664bbc423001","0xc24b8b70d0f89791","0xc76c51a30654be30","0xd192e819d6ef5218","0xd69906245565a910","0xf40e35855771202a","0x106aa07032bbd1b8","0x19a4c116b8d2d0c8","0x1e376c085141ab53","0x2748774cdf8eeb99","0x34b0bcb5e19b48a8","0x391c0cb3c5c95a63","0x4ed8aa4ae3418acb","0x5b9cca4f7763e373","0x682e6ff3d6b2b8a3","0x748f82ee5defb2fc","0x78a5636f43172f60","0x84c87814a1f0ab72","0x8cc702081a6439ec","0x90befffa23631e28","0xa4506cebde82bde9","0xbef9a3f7b2c67915","0xc67178f2e372532b","0xca273eceea26619c","0xd186b8c721c0c207","0xeada7dd6cde0eb1e","0xf57d4f7fee6ed178","0x06f067aa72176fba","0x0a637dc5a2c898a6","0x113f9804bef90dae","0x1b710b35131c471b","0x28db77f523047d84","0x32caab7b40c72493","0x3c9ebe0a15c9bebc","0x431d67c49c100d4c","0x4cc5d4becb3e42b6","0x597f299cfc657e2a","0x5fcb6fab3ad6faec","0x6c44198c4a475817"].map(t=>BigInt(t))),Rd=tl[0],Wd=tl[1],Hr=new Uint32Array(80),Jr=new Uint32Array(80);class Dd extends Xa{constructor(e){super(128,e,16,!1)}get(){const{Ah:e,Al:r,Bh:n,Bl:s,Ch:a,Cl:d,Dh:g,Dl:x,Eh:N,El:S,Fh:w,Fl:I,Gh:j,Gl:V,Hh:Y,Hl:ge}=this;return[e,r,n,s,a,d,g,x,N,S,w,I,j,V,Y,ge]}set(e,r,n,s,a,d,g,x,N,S,w,I,j,V,Y,ge){this.Ah=e|0,this.Al=r|0,this.Bh=n|0,this.Bl=s|0,this.Ch=a|0,this.Cl=d|0,this.Dh=g|0,this.Dl=x|0,this.Eh=N|0,this.El=S|0,this.Fh=w|0,this.Fl=I|0,this.Gh=j|0,this.Gl=V|0,this.Hh=Y|0,this.Hl=ge|0}process(e,r){for(let Re=0;Re<16;Re++,r+=4)Hr[Re]=e.getUint32(r),Jr[Re]=e.getUint32(r+=4);for(let Re=16;Re<80;Re++){const Ie=Hr[Re-15]|0,ot=Jr[Re-15]|0,at=zn(Ie,ot,1)^zn(Ie,ot,8)^Za(Ie,ot,7),Ce=Vn(Ie,ot,1)^Vn(Ie,ot,8)^el(Ie,ot,7),Be=Hr[Re-2]|0,$e=Jr[Re-2]|0,Ye=zn(Be,$e,19)^ts(Be,$e,61)^Za(Be,$e,6),rt=Vn(Be,$e,19)^rs(Be,$e,61)^el(Be,$e,6),Ze=Od(Ce,rt,Jr[Re-7],Jr[Re-16]),R=Td(Ze,at,Ye,Hr[Re-7],Hr[Re-16]);Hr[Re]=R|0,Jr[Re]=Ze|0}let{Ah:n,Al:s,Bh:a,Bl:d,Ch:g,Cl:x,Dh:N,Dl:S,Eh:w,El:I,Fh:j,Fl:V,Gh:Y,Gl:ge,Hh:Ee,Hl:Ue}=this;for(let Re=0;Re<80;Re++){const Ie=zn(w,I,14)^zn(w,I,18)^ts(w,I,41),ot=Vn(w,I,14)^Vn(w,I,18)^rs(w,I,41),at=w&j^~w&Y,Ce=I&V^~I&ge,Be=Id(Ue,ot,Ce,Wd[Re],Jr[Re]),$e=Cd(Be,Ee,Ie,at,Rd[Re],Hr[Re]),Ye=Be|0,rt=zn(n,s,28)^ts(n,s,34)^ts(n,s,39),Ze=Vn(n,s,28)^rs(n,s,34)^rs(n,s,39),R=n&a^n&g^a&g,pe=s&d^s&x^d&x;Ee=Y|0,Ue=ge|0,Y=j|0,ge=V|0,j=w|0,V=I|0,{h:w,l:I}=Ir(N|0,S|0,$e|0,Ye|0),N=g|0,S=x|0,g=a|0,x=d|0,a=n|0,d=s|0;const oe=Ed(Ye,Ze,pe);n=Ad(oe,$e,rt,R),s=oe|0}({h:n,l:s}=Ir(this.Ah|0,this.Al|0,n|0,s|0)),{h:a,l:d}=Ir(this.Bh|0,this.Bl|0,a|0,d|0),{h:g,l:x}=Ir(this.Ch|0,this.Cl|0,g|0,x|0),{h:N,l:S}=Ir(this.Dh|0,this.Dl|0,N|0,S|0),{h:w,l:I}=Ir(this.Eh|0,this.El|0,w|0,I|0),{h:j,l:V}=Ir(this.Fh|0,this.Fl|0,j|0,V|0),{h:Y,l:ge}=Ir(this.Gh|0,this.Gl|0,Y|0,ge|0),{h:Ee,l:Ue}=Ir(this.Hh|0,this.Hl|0,Ee|0,Ue|0),this.set(n,s,a,d,g,x,N,S,w,I,j,V,Y,ge,Ee,Ue)}roundClean(){jn(Hr,Jr)}destroy(){jn(this.buffer),this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0)}}class Md extends Dd{Ah=Bt[0]|0;Al=Bt[1]|0;Bh=Bt[2]|0;Bl=Bt[3]|0;Ch=Bt[4]|0;Cl=Bt[5]|0;Dh=Bt[6]|0;Dl=Bt[7]|0;Eh=Bt[8]|0;El=Bt[9]|0;Fh=Bt[10]|0;Fl=Bt[11]|0;Gh=Bt[12]|0;Gl=Bt[13]|0;Hh=Bt[14]|0;Hl=Bt[15]|0;constructor(){super(64)}}const Ud=Ka(()=>new Fd,Ga(1)),rl=Ka(()=>new Md,Ga(3));function $d(t){return t instanceof Uint8Array||ArrayBuffer.isView(t)&&t.constructor.name==="Uint8Array"}function uo(t,e,r=""){const n=$d(t),s=t?.length;if(!n||e!==void 0){const d=r&&`"${r}" `,g="",x=n?`length=${s}`:`type=${typeof t}`;throw new Error(d+"expected Uint8Array"+g+", got "+x)}return t}function nl(t,e=!0){if(t.destroyed)throw new Error("Hash instance has been destroyed");if(e&&t.finished)throw new Error("Hash#digest() has already been called")}function Bd(t,e){uo(t,void 0,"digestInto() output");const r=e.outputLen;if(t.length<r)throw new Error('"digestInto() output" expected to be of length >='+r)}function fo(...t){for(let e=0;e<t.length;e++)t[e].fill(0)}function ho(t){return new DataView(t.buffer,t.byteOffset,t.byteLength)}function br(t,e){return t<<32-e|t>>>e}function jd(t,e={}){const r=(s,a)=>t(a).update(s).digest(),n=t(void 0);return r.outputLen=n.outputLen,r.blockLen=n.blockLen,r.create=s=>t(s),Object.assign(r,e),Object.freeze(r)}const zd=t=>({oid:Uint8Array.from([6,9,96,134,72,1,101,3,4,2,t])});function Vd(t,e,r){return t&e^~t&r}function Qd(t,e,r){return t&e^t&r^e&r}class Hd{blockLen;outputLen;padOffset;isLE;buffer;view;finished=!1;length=0;pos=0;destroyed=!1;constructor(e,r,n,s){this.blockLen=e,this.outputLen=r,this.padOffset=n,this.isLE=s,this.buffer=new Uint8Array(e),this.view=ho(this.buffer)}update(e){nl(this),uo(e);const{view:r,buffer:n,blockLen:s}=this,a=e.length;for(let d=0;d<a;){const g=Math.min(s-this.pos,a-d);if(g===s){const x=ho(e);for(;s<=a-d;d+=s)this.process(x,d);continue}n.set(e.subarray(d,d+g),this.pos),this.pos+=g,d+=g,this.pos===s&&(this.process(r,0),this.pos=0)}return this.length+=e.length,this.roundClean(),this}digestInto(e){nl(this),Bd(e,this),this.finished=!0;const{buffer:r,view:n,blockLen:s,isLE:a}=this;let{pos:d}=this;r[d++]=128,fo(this.buffer.subarray(d)),this.padOffset>s-d&&(this.process(n,0),d=0);for(let w=d;w<s;w++)r[w]=0;n.setBigUint64(s-8,BigInt(this.length*8),a),this.process(n,0);const g=ho(e),x=this.outputLen;if(x%4)throw new Error("_sha2: outputLen must be aligned to 32bit");const N=x/4,S=this.get();if(N>S.length)throw new Error("_sha2: outputLen bigger than state");for(let w=0;w<N;w++)g.setUint32(4*w,S[w],a)}digest(){const{buffer:e,outputLen:r}=this;this.digestInto(e);const n=e.slice(0,r);return this.destroy(),n}_cloneInto(e){e||=new this.constructor,e.set(...this.get());const{blockLen:r,buffer:n,length:s,finished:a,destroyed:d,pos:g}=this;return e.destroyed=d,e.finished=a,e.length=s,e.pos=g,s%r&&e.buffer.set(n),e}clone(){return this._cloneInto()}}const Kr=Uint32Array.from([1779033703,3144134277,1013904242,2773480762,1359893119,2600822924,528734635,1541459225]),Jd=Uint32Array.from([1116352408,1899447441,3049323471,3921009573,961987163,1508970993,2453635748,2870763221,3624381080,310598401,607225278,1426881987,1925078388,2162078206,2614888103,3248222580,3835390401,4022224774,264347078,604807628,770255983,1249150122,1555081692,1996064986,2554220882,2821834349,2952996808,3210313671,3336571891,3584528711,113926993,338241895,666307205,773529912,1294757372,1396182291,1695183700,1986661051,2177026350,2456956037,2730485921,2820302411,3259730800,3345764771,3516065817,3600352804,4094571909,275423344,430227734,506948616,659060556,883997877,958139571,1322822218,1537002063,1747873779,1955562222,2024104815,2227730452,2361852424,2428436474,2756734187,3204031479,3329325298]),Gr=new Uint32Array(64);class Kd extends Hd{constructor(e){super(64,e,8,!1)}get(){const{A:e,B:r,C:n,D:s,E:a,F:d,G:g,H:x}=this;return[e,r,n,s,a,d,g,x]}set(e,r,n,s,a,d,g,x){this.A=e|0,this.B=r|0,this.C=n|0,this.D=s|0,this.E=a|0,this.F=d|0,this.G=g|0,this.H=x|0}process(e,r){for(let w=0;w<16;w++,r+=4)Gr[w]=e.getUint32(r,!1);for(let w=16;w<64;w++){const I=Gr[w-15],j=Gr[w-2],V=br(I,7)^br(I,18)^I>>>3,Y=br(j,17)^br(j,19)^j>>>10;Gr[w]=Y+Gr[w-7]+V+Gr[w-16]|0}let{A:n,B:s,C:a,D:d,E:g,F:x,G:N,H:S}=this;for(let w=0;w<64;w++){const I=br(g,6)^br(g,11)^br(g,25),j=S+I+Vd(g,x,N)+Jd[w]+Gr[w]|0,Y=(br(n,2)^br(n,13)^br(n,22))+Qd(n,s,a)|0;S=N,N=x,x=g,g=d+j|0,d=a,a=s,s=n,n=j+Y|0}n=n+this.A|0,s=s+this.B|0,a=a+this.C|0,d=d+this.D|0,g=g+this.E|0,x=x+this.F|0,N=N+this.G|0,S=S+this.H|0,this.set(n,s,a,d,g,x,N,S)}roundClean(){fo(Gr)}destroy(){this.set(0,0,0,0,0,0,0,0),fo(this.buffer)}}class Gd extends Kd{A=Kr[0]|0;B=Kr[1]|0;C=Kr[2]|0;D=Kr[3]|0;E=Kr[4]|0;F=Kr[5]|0;G=Kr[6]|0;H=Kr[7]|0;constructor(){super(32)}}const Xd=jd(()=>new Gd,zd(1));function ns(t){return t instanceof Uint8Array||ArrayBuffer.isView(t)&&t.constructor.name==="Uint8Array"}function il(t,e){return Array.isArray(e)?e.length===0?!0:t?e.every(r=>typeof r=="string"):e.every(r=>Number.isSafeInteger(r)):!1}function Yd(t){if(typeof t!="function")throw new Error("function expected");return!0}function is(t,e){if(typeof e!="string")throw new Error(`${t}: string expected`);return!0}function Qn(t){if(!Number.isSafeInteger(t))throw new Error(`invalid integer: ${t}`)}function ss(t){if(!Array.isArray(t))throw new Error("array expected")}function os(t,e){if(!il(!0,e))throw new Error(`${t}: array of strings expected`)}function sl(t,e){if(!il(!1,e))throw new Error(`${t}: array of numbers expected`)}function Zd(...t){const e=a=>a,r=(a,d)=>g=>a(d(g)),n=t.map(a=>a.encode).reduceRight(r,e),s=t.map(a=>a.decode).reduce(r,e);return{encode:n,decode:s}}function ef(t){const e=typeof t=="string"?t.split(""):t,r=e.length;os("alphabet",e);const n=new Map(e.map((s,a)=>[s,a]));return{encode:s=>(ss(s),s.map(a=>{if(!Number.isSafeInteger(a)||a<0||a>=r)throw new Error(`alphabet.encode: digit index outside alphabet "${a}". Allowed: ${t}`);return e[a]})),decode:s=>(ss(s),s.map(a=>{is("alphabet.decode",a);const d=n.get(a);if(d===void 0)throw new Error(`Unknown letter: "${a}". Allowed: ${t}`);return d}))}}function tf(t=""){return is("join",t),{encode:e=>(os("join.decode",e),e.join(t)),decode:e=>(is("join.decode",e),e.split(t))}}function rf(t,e="="){return Qn(t),is("padding",e),{encode(r){for(os("padding.encode",r);r.length*t%8;)r.push(e);return r},decode(r){os("padding.decode",r);let n=r.length;if(n*t%8)throw new Error("padding: invalid, string should have whole number of bytes");for(;n>0&&r[n-1]===e;n--)if((n-1)*t%8===0)throw new Error("padding: invalid, string has too much padding");return r.slice(0,n)}}}function po(t,e,r){if(e<2)throw new Error(`convertRadix: invalid from=${e}, base cannot be less than 2`);if(r<2)throw new Error(`convertRadix: invalid to=${r}, base cannot be less than 2`);if(ss(t),!t.length)return[];let n=0;const s=[],a=Array.from(t,g=>{if(Qn(g),g<0||g>=e)throw new Error(`invalid integer: ${g}`);return g}),d=a.length;for(;;){let g=0,x=!0;for(let N=n;N<d;N++){const S=a[N],w=e*g,I=w+S;if(!Number.isSafeInteger(I)||w/e!==g||I-S!==w)throw new Error("convertRadix: carry overflow");const j=I/r;g=I%r;const V=Math.floor(j);if(a[N]=V,!Number.isSafeInteger(V)||V*r+g!==I)throw new Error("convertRadix: carry overflow");if(x)V?x=!1:n=N;else continue}if(s.push(g),x)break}for(let g=0;g<t.length-1&&t[g]===0;g++)s.push(0);return s.reverse()}const ol=(t,e)=>e===0?t:ol(e,t%e),as=(t,e)=>t+(e-ol(t,e)),mo=(()=>{let t=[];for(let e=0;e<40;e++)t.push(2**e);return t})();function _o(t,e,r,n){if(ss(t),e<=0||e>32)throw new Error(`convertRadix2: wrong from=${e}`);if(r<=0||r>32)throw new Error(`convertRadix2: wrong to=${r}`);if(as(e,r)>32)throw new Error(`convertRadix2: carry overflow from=${e} to=${r} carryBits=${as(e,r)}`);let s=0,a=0;const d=mo[e],g=mo[r]-1,x=[];for(const N of t){if(Qn(N),N>=d)throw new Error(`convertRadix2: invalid data word=${N} from=${e}`);if(s=s<<e|N,a+e>32)throw new Error(`convertRadix2: carry overflow pos=${a} from=${e}`);for(a+=e;a>=r;a-=r)x.push((s>>a-r&g)>>>0);const S=mo[a];if(S===void 0)throw new Error("invalid carry");s&=S-1}if(s=s<<r-a&g,!n&&a>=e)throw new Error("Excess padding");if(!n&&s>0)throw new Error(`Non-zero padding: ${s}`);return n&&a>0&&x.push(s>>>0),x}function nf(t){Qn(t);const e=2**8;return{encode:r=>{if(!ns(r))throw new Error("radix.encode input should be Uint8Array");return po(Array.from(r),e,t)},decode:r=>(sl("radix.decode",r),Uint8Array.from(po(r,t,e)))}}function sf(t,e=!1){if(Qn(t),t<=0||t>32)throw new Error("radix2: bits should be in (0..32]");if(as(8,t)>32||as(t,8)>32)throw new Error("radix2: carry overflow");return{encode:r=>{if(!ns(r))throw new Error("radix2.encode input should be Uint8Array");return _o(Array.from(r),8,t,!e)},decode:r=>(sl("radix2.decode",r),Uint8Array.from(_o(r,t,8,e)))}}function of(t,e){return Qn(t),Yd(e),{encode(r){if(!ns(r))throw new Error("checksum.encode: input should be Uint8Array");const n=e(r).slice(0,t),s=new Uint8Array(r.length+t);return s.set(r),s.set(n,r.length),s},decode(r){if(!ns(r))throw new Error("checksum.decode: input should be Uint8Array");const n=r.slice(0,-t),s=r.slice(-t),a=e(n).slice(0,t);for(let d=0;d<t;d++)if(a[d]!==s[d])throw new Error("Invalid checksum");return n}}}const ls={alphabet:ef,chain:Zd,checksum:of,convertRadix:po,convertRadix2:_o,radix:nf,radix2:sf,join:tf,padding:rf};const af=t=>t[0]==="あいこくしん";function lf(t){if(typeof t!="string")throw new TypeError("invalid mnemonic type: "+typeof t);return t.normalize("NFKD")}function cf(t){const e=lf(t),r=e.split(" ");if(![12,15,18,21,24].includes(r.length))throw new Error("Invalid mnemonic");return{nfkd:e,words:r}}function al(t){if(uo(t),![16,20,24,28,32].includes(t.length))throw new Error("invalid entropy length")}const uf=t=>{const e=8-t.length/4;return new Uint8Array([Xd(t)[0]>>e<<e])};function ll(t){if(!Array.isArray(t)||t.length!==2048||typeof t[0]!="string")throw new Error("Wordlist: expected array of 2048 strings");return t.forEach(e=>{if(typeof e!="string")throw new Error("wordlist: non-string element: "+e)}),ls.chain(ls.checksum(1,uf),ls.radix2(11,!0),ls.alphabet(t))}function cl(t,e){const{words:r}=cf(t),n=ll(e).decode(r);return al(n),n}function df(t,e){return al(t),ll(e).encode(t).join(af(e)?"　":" ")}function ff(t,e){try{cl(t,e)}catch{return!1}return!0}const go=`abandon
ability
able
about
above
absent
absorb
abstract
absurd
abuse
access
accident
account
accuse
achieve
acid
acoustic
acquire
across
act
action
actor
actress
actual
adapt
add
addict
address
adjust
admit
adult
advance
advice
aerobic
affair
afford
afraid
again
age
agent
agree
ahead
aim
air
airport
aisle
alarm
album
alcohol
alert
alien
all
alley
allow
almost
alone
alpha
already
also
alter
always
amateur
amazing
among
amount
amused
analyst
anchor
ancient
anger
angle
angry
animal
ankle
announce
annual
another
answer
antenna
antique
anxiety
any
apart
apology
appear
apple
approve
april
arch
arctic
area
arena
argue
arm
armed
armor
army
around
arrange
arrest
arrive
arrow
art
artefact
artist
artwork
ask
aspect
assault
asset
assist
assume
asthma
athlete
atom
attack
attend
attitude
attract
auction
audit
august
aunt
author
auto
autumn
average
avocado
avoid
awake
aware
away
awesome
awful
awkward
axis
baby
bachelor
bacon
badge
bag
balance
balcony
ball
bamboo
banana
banner
bar
barely
bargain
barrel
base
basic
basket
battle
beach
bean
beauty
because
become
beef
before
begin
behave
behind
believe
below
belt
bench
benefit
best
betray
better
between
beyond
bicycle
bid
bike
bind
biology
bird
birth
bitter
black
blade
blame
blanket
blast
bleak
bless
blind
blood
blossom
blouse
blue
blur
blush
board
boat
body
boil
bomb
bone
bonus
book
boost
border
boring
borrow
boss
bottom
bounce
box
boy
bracket
brain
brand
brass
brave
bread
breeze
brick
bridge
brief
bright
bring
brisk
broccoli
broken
bronze
broom
brother
brown
brush
bubble
buddy
budget
buffalo
build
bulb
bulk
bullet
bundle
bunker
burden
burger
burst
bus
business
busy
butter
buyer
buzz
cabbage
cabin
cable
cactus
cage
cake
call
calm
camera
camp
can
canal
cancel
candy
cannon
canoe
canvas
canyon
capable
capital
captain
car
carbon
card
cargo
carpet
carry
cart
case
cash
casino
castle
casual
cat
catalog
catch
category
cattle
caught
cause
caution
cave
ceiling
celery
cement
census
century
cereal
certain
chair
chalk
champion
change
chaos
chapter
charge
chase
chat
cheap
check
cheese
chef
cherry
chest
chicken
chief
child
chimney
choice
choose
chronic
chuckle
chunk
churn
cigar
cinnamon
circle
citizen
city
civil
claim
clap
clarify
claw
clay
clean
clerk
clever
click
client
cliff
climb
clinic
clip
clock
clog
close
cloth
cloud
clown
club
clump
cluster
clutch
coach
coast
coconut
code
coffee
coil
coin
collect
color
column
combine
come
comfort
comic
common
company
concert
conduct
confirm
congress
connect
consider
control
convince
cook
cool
copper
copy
coral
core
corn
correct
cost
cotton
couch
country
couple
course
cousin
cover
coyote
crack
cradle
craft
cram
crane
crash
crater
crawl
crazy
cream
credit
creek
crew
cricket
crime
crisp
critic
crop
cross
crouch
crowd
crucial
cruel
cruise
crumble
crunch
crush
cry
crystal
cube
culture
cup
cupboard
curious
current
curtain
curve
cushion
custom
cute
cycle
dad
damage
damp
dance
danger
daring
dash
daughter
dawn
day
deal
debate
debris
decade
december
decide
decline
decorate
decrease
deer
defense
define
defy
degree
delay
deliver
demand
demise
denial
dentist
deny
depart
depend
deposit
depth
deputy
derive
describe
desert
design
desk
despair
destroy
detail
detect
develop
device
devote
diagram
dial
diamond
diary
dice
diesel
diet
differ
digital
dignity
dilemma
dinner
dinosaur
direct
dirt
disagree
discover
disease
dish
dismiss
disorder
display
distance
divert
divide
divorce
dizzy
doctor
document
dog
doll
dolphin
domain
donate
donkey
donor
door
dose
double
dove
draft
dragon
drama
drastic
draw
dream
dress
drift
drill
drink
drip
drive
drop
drum
dry
duck
dumb
dune
during
dust
dutch
duty
dwarf
dynamic
eager
eagle
early
earn
earth
easily
east
easy
echo
ecology
economy
edge
edit
educate
effort
egg
eight
either
elbow
elder
electric
elegant
element
elephant
elevator
elite
else
embark
embody
embrace
emerge
emotion
employ
empower
empty
enable
enact
end
endless
endorse
enemy
energy
enforce
engage
engine
enhance
enjoy
enlist
enough
enrich
enroll
ensure
enter
entire
entry
envelope
episode
equal
equip
era
erase
erode
erosion
error
erupt
escape
essay
essence
estate
eternal
ethics
evidence
evil
evoke
evolve
exact
example
excess
exchange
excite
exclude
excuse
execute
exercise
exhaust
exhibit
exile
exist
exit
exotic
expand
expect
expire
explain
expose
express
extend
extra
eye
eyebrow
fabric
face
faculty
fade
faint
faith
fall
false
fame
family
famous
fan
fancy
fantasy
farm
fashion
fat
fatal
father
fatigue
fault
favorite
feature
february
federal
fee
feed
feel
female
fence
festival
fetch
fever
few
fiber
fiction
field
figure
file
film
filter
final
find
fine
finger
finish
fire
firm
first
fiscal
fish
fit
fitness
fix
flag
flame
flash
flat
flavor
flee
flight
flip
float
flock
floor
flower
fluid
flush
fly
foam
focus
fog
foil
fold
follow
food
foot
force
forest
forget
fork
fortune
forum
forward
fossil
foster
found
fox
fragile
frame
frequent
fresh
friend
fringe
frog
front
frost
frown
frozen
fruit
fuel
fun
funny
furnace
fury
future
gadget
gain
galaxy
gallery
game
gap
garage
garbage
garden
garlic
garment
gas
gasp
gate
gather
gauge
gaze
general
genius
genre
gentle
genuine
gesture
ghost
giant
gift
giggle
ginger
giraffe
girl
give
glad
glance
glare
glass
glide
glimpse
globe
gloom
glory
glove
glow
glue
goat
goddess
gold
good
goose
gorilla
gospel
gossip
govern
gown
grab
grace
grain
grant
grape
grass
gravity
great
green
grid
grief
grit
grocery
group
grow
grunt
guard
guess
guide
guilt
guitar
gun
gym
habit
hair
half
hammer
hamster
hand
happy
harbor
hard
harsh
harvest
hat
have
hawk
hazard
head
health
heart
heavy
hedgehog
height
hello
helmet
help
hen
hero
hidden
high
hill
hint
hip
hire
history
hobby
hockey
hold
hole
holiday
hollow
home
honey
hood
hope
horn
horror
horse
hospital
host
hotel
hour
hover
hub
huge
human
humble
humor
hundred
hungry
hunt
hurdle
hurry
hurt
husband
hybrid
ice
icon
idea
identify
idle
ignore
ill
illegal
illness
image
imitate
immense
immune
impact
impose
improve
impulse
inch
include
income
increase
index
indicate
indoor
industry
infant
inflict
inform
inhale
inherit
initial
inject
injury
inmate
inner
innocent
input
inquiry
insane
insect
inside
inspire
install
intact
interest
into
invest
invite
involve
iron
island
isolate
issue
item
ivory
jacket
jaguar
jar
jazz
jealous
jeans
jelly
jewel
job
join
joke
journey
joy
judge
juice
jump
jungle
junior
junk
just
kangaroo
keen
keep
ketchup
key
kick
kid
kidney
kind
kingdom
kiss
kit
kitchen
kite
kitten
kiwi
knee
knife
knock
know
lab
label
labor
ladder
lady
lake
lamp
language
laptop
large
later
latin
laugh
laundry
lava
law
lawn
lawsuit
layer
lazy
leader
leaf
learn
leave
lecture
left
leg
legal
legend
leisure
lemon
lend
length
lens
leopard
lesson
letter
level
liar
liberty
library
license
life
lift
light
like
limb
limit
link
lion
liquid
list
little
live
lizard
load
loan
lobster
local
lock
logic
lonely
long
loop
lottery
loud
lounge
love
loyal
lucky
luggage
lumber
lunar
lunch
luxury
lyrics
machine
mad
magic
magnet
maid
mail
main
major
make
mammal
man
manage
mandate
mango
mansion
manual
maple
marble
march
margin
marine
market
marriage
mask
mass
master
match
material
math
matrix
matter
maximum
maze
meadow
mean
measure
meat
mechanic
medal
media
melody
melt
member
memory
mention
menu
mercy
merge
merit
merry
mesh
message
metal
method
middle
midnight
milk
million
mimic
mind
minimum
minor
minute
miracle
mirror
misery
miss
mistake
mix
mixed
mixture
mobile
model
modify
mom
moment
monitor
monkey
monster
month
moon
moral
more
morning
mosquito
mother
motion
motor
mountain
mouse
move
movie
much
muffin
mule
multiply
muscle
museum
mushroom
music
must
mutual
myself
mystery
myth
naive
name
napkin
narrow
nasty
nation
nature
near
neck
need
negative
neglect
neither
nephew
nerve
nest
net
network
neutral
never
news
next
nice
night
noble
noise
nominee
noodle
normal
north
nose
notable
note
nothing
notice
novel
now
nuclear
number
nurse
nut
oak
obey
object
oblige
obscure
observe
obtain
obvious
occur
ocean
october
odor
off
offer
office
often
oil
okay
old
olive
olympic
omit
once
one
onion
online
only
open
opera
opinion
oppose
option
orange
orbit
orchard
order
ordinary
organ
orient
original
orphan
ostrich
other
outdoor
outer
output
outside
oval
oven
over
own
owner
oxygen
oyster
ozone
pact
paddle
page
pair
palace
palm
panda
panel
panic
panther
paper
parade
parent
park
parrot
party
pass
patch
path
patient
patrol
pattern
pause
pave
payment
peace
peanut
pear
peasant
pelican
pen
penalty
pencil
people
pepper
perfect
permit
person
pet
phone
photo
phrase
physical
piano
picnic
picture
piece
pig
pigeon
pill
pilot
pink
pioneer
pipe
pistol
pitch
pizza
place
planet
plastic
plate
play
please
pledge
pluck
plug
plunge
poem
poet
point
polar
pole
police
pond
pony
pool
popular
portion
position
possible
post
potato
pottery
poverty
powder
power
practice
praise
predict
prefer
prepare
present
pretty
prevent
price
pride
primary
print
priority
prison
private
prize
problem
process
produce
profit
program
project
promote
proof
property
prosper
protect
proud
provide
public
pudding
pull
pulp
pulse
pumpkin
punch
pupil
puppy
purchase
purity
purpose
purse
push
put
puzzle
pyramid
quality
quantum
quarter
question
quick
quit
quiz
quote
rabbit
raccoon
race
rack
radar
radio
rail
rain
raise
rally
ramp
ranch
random
range
rapid
rare
rate
rather
raven
raw
razor
ready
real
reason
rebel
rebuild
recall
receive
recipe
record
recycle
reduce
reflect
reform
refuse
region
regret
regular
reject
relax
release
relief
rely
remain
remember
remind
remove
render
renew
rent
reopen
repair
repeat
replace
report
require
rescue
resemble
resist
resource
response
result
retire
retreat
return
reunion
reveal
review
reward
rhythm
rib
ribbon
rice
rich
ride
ridge
rifle
right
rigid
ring
riot
ripple
risk
ritual
rival
river
road
roast
robot
robust
rocket
romance
roof
rookie
room
rose
rotate
rough
round
route
royal
rubber
rude
rug
rule
run
runway
rural
sad
saddle
sadness
safe
sail
salad
salmon
salon
salt
salute
same
sample
sand
satisfy
satoshi
sauce
sausage
save
say
scale
scan
scare
scatter
scene
scheme
school
science
scissors
scorpion
scout
scrap
screen
script
scrub
sea
search
season
seat
second
secret
section
security
seed
seek
segment
select
sell
seminar
senior
sense
sentence
series
service
session
settle
setup
seven
shadow
shaft
shallow
share
shed
shell
sheriff
shield
shift
shine
ship
shiver
shock
shoe
shoot
shop
short
shoulder
shove
shrimp
shrug
shuffle
shy
sibling
sick
side
siege
sight
sign
silent
silk
silly
silver
similar
simple
since
sing
siren
sister
situate
six
size
skate
sketch
ski
skill
skin
skirt
skull
slab
slam
sleep
slender
slice
slide
slight
slim
slogan
slot
slow
slush
small
smart
smile
smoke
smooth
snack
snake
snap
sniff
snow
soap
soccer
social
sock
soda
soft
solar
soldier
solid
solution
solve
someone
song
soon
sorry
sort
soul
sound
soup
source
south
space
spare
spatial
spawn
speak
special
speed
spell
spend
sphere
spice
spider
spike
spin
spirit
split
spoil
sponsor
spoon
sport
spot
spray
spread
spring
spy
square
squeeze
squirrel
stable
stadium
staff
stage
stairs
stamp
stand
start
state
stay
steak
steel
stem
step
stereo
stick
still
sting
stock
stomach
stone
stool
story
stove
strategy
street
strike
strong
struggle
student
stuff
stumble
style
subject
submit
subway
success
such
sudden
suffer
sugar
suggest
suit
summer
sun
sunny
sunset
super
supply
supreme
sure
surface
surge
surprise
surround
survey
suspect
sustain
swallow
swamp
swap
swarm
swear
sweet
swift
swim
swing
switch
sword
symbol
symptom
syrup
system
table
tackle
tag
tail
talent
talk
tank
tape
target
task
taste
tattoo
taxi
teach
team
tell
ten
tenant
tennis
tent
term
test
text
thank
that
theme
then
theory
there
they
thing
this
thought
three
thrive
throw
thumb
thunder
ticket
tide
tiger
tilt
timber
time
tiny
tip
tired
tissue
title
toast
tobacco
today
toddler
toe
together
toilet
token
tomato
tomorrow
tone
tongue
tonight
tool
tooth
top
topic
topple
torch
tornado
tortoise
toss
total
tourist
toward
tower
town
toy
track
trade
traffic
tragic
train
transfer
trap
trash
travel
tray
treat
tree
trend
trial
tribe
trick
trigger
trim
trip
trophy
trouble
truck
true
truly
trumpet
trust
truth
try
tube
tuition
tumble
tuna
tunnel
turkey
turn
turtle
twelve
twenty
twice
twin
twist
two
type
typical
ugly
umbrella
unable
unaware
uncle
uncover
under
undo
unfair
unfold
unhappy
uniform
unique
unit
universe
unknown
unlock
until
unusual
unveil
update
upgrade
uphold
upon
upper
upset
urban
urge
usage
use
used
useful
useless
usual
utility
vacant
vacuum
vague
valid
valley
valve
van
vanish
vapor
various
vast
vault
vehicle
velvet
vendor
venture
venue
verb
verify
version
very
vessel
veteran
viable
vibrant
vicious
victory
video
view
village
vintage
violin
virtual
virus
visa
visit
visual
vital
vivid
vocal
voice
void
volcano
volume
vote
voyage
wage
wagon
wait
walk
wall
walnut
want
warfare
warm
warrior
wash
wasp
waste
water
wave
way
wealth
weapon
wear
weasel
weather
web
wedding
weekend
weird
welcome
west
wet
whale
what
wheat
wheel
when
where
whip
whisper
wide
width
wife
wild
will
win
window
wine
wing
wink
winner
winter
wire
wisdom
wise
wish
witness
wolf
woman
wonder
wood
wool
word
work
world
worry
worth
wrap
wreck
wrestle
wrist
write
wrong
yard
year
yellow
you
young
youth
zebra
zero
zone
zoo`.split(`
`);var yo;try{yo=new TextDecoder}catch{}var ke,wr,W=0,mt={},st,Xr,cr=0,xr=0,Pt,Cr,Ht=[],nt,ul={useRecords:!1,mapsAsObjects:!0};class dl{}const fl=new dl;fl.name="MessagePack 0xC1";var Yr=!1,hl=2,hf;try{new Function("")}catch{hl=1/0}class gi{constructor(e){e&&(e.useRecords===!1&&e.mapsAsObjects===void 0&&(e.mapsAsObjects=!0),e.sequential&&e.trusted!==!1&&(e.trusted=!0,!e.structures&&e.useRecords!=!1&&(e.structures=[],e.maxSharedStructures||(e.maxSharedStructures=0))),e.structures?e.structures.sharedLength=e.structures.length:e.getStructures&&((e.structures=[]).uninitialized=!0,e.structures.sharedLength=0),e.int64AsNumber&&(e.int64AsType="number")),Object.assign(this,e)}unpack(e,r){if(ke)return El(()=>(vo(),this?this.unpack(e,r):gi.prototype.unpack.call(ul,e,r)));!e.buffer&&e.constructor===ArrayBuffer&&(e=typeof Buffer<"u"?Buffer.from(e):new Uint8Array(e)),typeof r=="object"?(wr=r.end||e.length,W=r.start||0):(W=0,wr=r>-1?r:e.length),xr=0,Xr=null,Pt=null,ke=e;try{nt=e.dataView||(e.dataView=new DataView(e.buffer,e.byteOffset,e.byteLength))}catch(n){throw ke=null,e instanceof Uint8Array?n:new Error("Source must be a Uint8Array or Buffer but was a "+(e&&typeof e=="object"?e.constructor.name:typeof e))}if(this instanceof gi){if(mt=this,this.structures)return st=this.structures,cs(r);(!st||st.length>0)&&(st=[])}else mt=ul,(!st||st.length>0)&&(st=[]);return cs(r)}unpackMultiple(e,r){let n,s=0;try{Yr=!0;let a=e.length,d=this?this.unpack(e,a):us.unpack(e,a);if(r){if(r(d,s,W)===!1)return;for(;W<a;)if(s=W,r(cs(),s,W)===!1)return}else{for(n=[d];W<a;)s=W,n.push(cs());return n}}catch(a){throw a.lastPosition=s,a.values=n,a}finally{Yr=!1,vo()}}_mergeStructures(e,r){e=e||[],Object.isFrozen(e)&&(e=e.map(n=>n.slice(0)));for(let n=0,s=e.length;n<s;n++){let a=e[n];a&&(a.isShared=!0,n>=32&&(a.highByte=n-32>>5))}e.sharedLength=e.length;for(let n in r||[])if(n>=0){let s=e[n],a=r[n];a&&(s&&((e.restoreStructures||(e.restoreStructures=[]))[n]=s),e[n]=a)}return this.structures=e}decode(e,r){return this.unpack(e,r)}}function cs(t){try{if(!mt.trusted&&!Yr){let r=st.sharedLength||0;r<st.length&&(st.length=r)}let e;if(mt.randomAccessStructure&&ke[W]<64&&ke[W]>=32&&hf||(e=At()),Pt&&(W=Pt.postBundlePosition,Pt=null),Yr&&(st.restoreStructures=null),W==wr)st&&st.restoreStructures&&pl(),st=null,ke=null,Cr&&(Cr=null);else{if(W>wr)throw new Error("Unexpected end of MessagePack data");if(!Yr){let r;try{r=JSON.stringify(e,(n,s)=>typeof s=="bigint"?`${s}n`:s).slice(0,100)}catch(n){r="(JSON view not available "+n+")"}throw new Error("Data read, but end of buffer not reached "+r)}}return e}catch(e){throw st&&st.restoreStructures&&pl(),vo(),(e instanceof RangeError||e.message.startsWith("Unexpected end of buffer")||W>wr)&&(e.incomplete=!0),e}}function pl(){for(let t in st.restoreStructures)st[t]=st.restoreStructures[t];st.restoreStructures=null}function At(){let t=ke[W++];if(t<160)if(t<128){if(t<64)return t;{let e=st[t&63]||mt.getStructures&&_l()[t&63];return e?(e.read||(e.read=bo(e,t&63)),e.read()):t}}else if(t<144)if(t-=128,mt.mapsAsObjects){let e={};for(let r=0;r<t;r++){let n=Nl();n==="__proto__"&&(n="__proto_"),e[n]=At()}return e}else{let e=new Map;for(let r=0;r<t;r++)e.set(At(),At());return e}else{t-=144;let e=new Array(t);for(let r=0;r<t;r++)e[r]=At();return mt.freezeData?Object.freeze(e):e}else if(t<192){let e=t-160;if(xr>=W)return Xr.slice(W-cr,(W+=e)-cr);if(xr==0&&wr<140){let r=e<16?xo(e):bl(e);if(r!=null)return r}return wo(e)}else{let e;switch(t){case 192:return null;case 193:return Pt?(e=At(),e>0?Pt[1].slice(Pt.position1,Pt.position1+=e):Pt[0].slice(Pt.position0,Pt.position0-=e)):fl;case 194:return!1;case 195:return!0;case 196:if(e=ke[W++],e===void 0)throw new Error("Unexpected end of buffer");return No(e);case 197:return e=nt.getUint16(W),W+=2,No(e);case 198:return e=nt.getUint32(W),W+=4,No(e);case 199:return xn(ke[W++]);case 200:return e=nt.getUint16(W),W+=2,xn(e);case 201:return e=nt.getUint32(W),W+=4,xn(e);case 202:if(e=nt.getFloat32(W),mt.useFloat32>2){let r=qo[(ke[W]&127)<<1|ke[W+1]>>7];return W+=4,(r*e+(e>0?.5:-.5)>>0)/r}return W+=4,e;case 203:return e=nt.getFloat64(W),W+=8,e;case 204:return ke[W++];case 205:return e=nt.getUint16(W),W+=2,e;case 206:return e=nt.getUint32(W),W+=4,e;case 207:return mt.int64AsType==="number"?(e=nt.getUint32(W)*4294967296,e+=nt.getUint32(W+4)):mt.int64AsType==="string"?e=nt.getBigUint64(W).toString():mt.int64AsType==="auto"?(e=nt.getBigUint64(W),e<=BigInt(2)<<BigInt(52)&&(e=Number(e))):e=nt.getBigUint64(W),W+=8,e;case 208:return nt.getInt8(W++);case 209:return e=nt.getInt16(W),W+=2,e;case 210:return e=nt.getInt32(W),W+=4,e;case 211:return mt.int64AsType==="number"?(e=nt.getInt32(W)*4294967296,e+=nt.getUint32(W+4)):mt.int64AsType==="string"?e=nt.getBigInt64(W).toString():mt.int64AsType==="auto"?(e=nt.getBigInt64(W),e>=BigInt(-2)<<BigInt(52)&&e<=BigInt(2)<<BigInt(52)&&(e=Number(e))):e=nt.getBigInt64(W),W+=8,e;case 212:if(e=ke[W++],e==114)return ql(ke[W++]&63);{let r=Ht[e];if(r)return r.read?(W++,r.read(At())):r.noBuffer?(W++,r()):r(ke.subarray(W,++W));throw new Error("Unknown extension "+e)}case 213:return e=ke[W],e==114?(W++,ql(ke[W++]&63,ke[W++])):xn(2);case 214:return xn(4);case 215:return xn(8);case 216:return xn(16);case 217:return e=ke[W++],xr>=W?Xr.slice(W-cr,(W+=e)-cr):mf(e);case 218:return e=nt.getUint16(W),W+=2,xr>=W?Xr.slice(W-cr,(W+=e)-cr):_f(e);case 219:return e=nt.getUint32(W),W+=4,xr>=W?Xr.slice(W-cr,(W+=e)-cr):gf(e);case 220:return e=nt.getUint16(W),W+=2,gl(e);case 221:return e=nt.getUint32(W),W+=4,gl(e);case 222:return e=nt.getUint16(W),W+=2,yl(e);case 223:return e=nt.getUint32(W),W+=4,yl(e);default:if(t>=224)return t-256;if(t===void 0){let r=new Error("Unexpected end of MessagePack data");throw r.incomplete=!0,r}throw new Error("Unknown MessagePack token "+t)}}}const pf=/^[a-zA-Z_$][a-zA-Z\d_$]*$/;function bo(t,e){function r(){if(r.count++>hl){let s=t.read=new Function("r","return function(){return "+(mt.freezeData?"Object.freeze":"")+"({"+t.map(a=>a==="__proto__"?"__proto_:r()":pf.test(a)?a+":r()":"["+JSON.stringify(a)+"]:r()").join(",")+"})}")(At);return t.highByte===0&&(t.read=ml(e,t.read)),s()}let n={};for(let s=0,a=t.length;s<a;s++){let d=t[s];d==="__proto__"&&(d="__proto_"),n[d]=At()}return mt.freezeData?Object.freeze(n):n}return r.count=0,t.highByte===0?ml(e,r):r}const ml=(t,e)=>function(){let r=ke[W++];if(r===0)return e();let n=t<32?-(t+(r<<5)):t+(r<<5),s=st[n]||_l()[n];if(!s)throw new Error("Record id is not defined for "+n);return s.read||(s.read=bo(s,t)),s.read()};function _l(){let t=El(()=>(ke=null,mt.getStructures()));return st=mt._mergeStructures(t,st)}var wo=yi,mf=yi,_f=yi,gf=yi;function yi(t){let e;if(t<16&&(e=xo(t)))return e;if(t>64&&yo)return yo.decode(ke.subarray(W,W+=t));const r=W+t,n=[];for(e="";W<r;){const s=ke[W++];if((s&128)===0)n.push(s);else if((s&224)===192){const a=ke[W++]&63;n.push((s&31)<<6|a)}else if((s&240)===224){const a=ke[W++]&63,d=ke[W++]&63;n.push((s&31)<<12|a<<6|d)}else if((s&248)===240){const a=ke[W++]&63,d=ke[W++]&63,g=ke[W++]&63;let x=(s&7)<<18|a<<12|d<<6|g;x>65535&&(x-=65536,n.push(x>>>10&1023|55296),x=56320|x&1023),n.push(x)}else n.push(s);n.length>=4096&&(e+=Ft.apply(String,n),n.length=0)}return n.length>0&&(e+=Ft.apply(String,n)),e}function gl(t){let e=new Array(t);for(let r=0;r<t;r++)e[r]=At();return mt.freezeData?Object.freeze(e):e}function yl(t){if(mt.mapsAsObjects){let e={};for(let r=0;r<t;r++){let n=Nl();n==="__proto__"&&(n="__proto_"),e[n]=At()}return e}else{let e=new Map;for(let r=0;r<t;r++)e.set(At(),At());return e}}var Ft=String.fromCharCode;function bl(t){let e=W,r=new Array(t);for(let n=0;n<t;n++){const s=ke[W++];if((s&128)>0){W=e;return}r[n]=s}return Ft.apply(String,r)}function xo(t){if(t<4)if(t<2){if(t===0)return"";{let e=ke[W++];if((e&128)>1){W-=1;return}return Ft(e)}}else{let e=ke[W++],r=ke[W++];if((e&128)>0||(r&128)>0){W-=2;return}if(t<3)return Ft(e,r);let n=ke[W++];if((n&128)>0){W-=3;return}return Ft(e,r,n)}else{let e=ke[W++],r=ke[W++],n=ke[W++],s=ke[W++];if((e&128)>0||(r&128)>0||(n&128)>0||(s&128)>0){W-=4;return}if(t<6){if(t===4)return Ft(e,r,n,s);{let a=ke[W++];if((a&128)>0){W-=5;return}return Ft(e,r,n,s,a)}}else if(t<8){let a=ke[W++],d=ke[W++];if((a&128)>0||(d&128)>0){W-=6;return}if(t<7)return Ft(e,r,n,s,a,d);let g=ke[W++];if((g&128)>0){W-=7;return}return Ft(e,r,n,s,a,d,g)}else{let a=ke[W++],d=ke[W++],g=ke[W++],x=ke[W++];if((a&128)>0||(d&128)>0||(g&128)>0||(x&128)>0){W-=8;return}if(t<10){if(t===8)return Ft(e,r,n,s,a,d,g,x);{let N=ke[W++];if((N&128)>0){W-=9;return}return Ft(e,r,n,s,a,d,g,x,N)}}else if(t<12){let N=ke[W++],S=ke[W++];if((N&128)>0||(S&128)>0){W-=10;return}if(t<11)return Ft(e,r,n,s,a,d,g,x,N,S);let w=ke[W++];if((w&128)>0){W-=11;return}return Ft(e,r,n,s,a,d,g,x,N,S,w)}else{let N=ke[W++],S=ke[W++],w=ke[W++],I=ke[W++];if((N&128)>0||(S&128)>0||(w&128)>0||(I&128)>0){W-=12;return}if(t<14){if(t===12)return Ft(e,r,n,s,a,d,g,x,N,S,w,I);{let j=ke[W++];if((j&128)>0){W-=13;return}return Ft(e,r,n,s,a,d,g,x,N,S,w,I,j)}}else{let j=ke[W++],V=ke[W++];if((j&128)>0||(V&128)>0){W-=14;return}if(t<15)return Ft(e,r,n,s,a,d,g,x,N,S,w,I,j,V);let Y=ke[W++];if((Y&128)>0){W-=15;return}return Ft(e,r,n,s,a,d,g,x,N,S,w,I,j,V,Y)}}}}}function wl(){let t=ke[W++],e;if(t<192)e=t-160;else switch(t){case 217:e=ke[W++];break;case 218:e=nt.getUint16(W),W+=2;break;case 219:e=nt.getUint32(W),W+=4;break;default:throw new Error("Expected string")}return yi(e)}function No(t){return mt.copyBuffers?Uint8Array.prototype.slice.call(ke,W,W+=t):ke.subarray(W,W+=t)}function xn(t){let e=ke[W++];if(Ht[e]){let r;return Ht[e](ke.subarray(W,r=W+=t),n=>{W=n;try{return At()}finally{W=r}})}else throw new Error("Unknown extension type "+e)}var xl=new Array(4096);function Nl(){let t=ke[W++];if(t>=160&&t<192){if(t=t-160,xr>=W)return Xr.slice(W-cr,(W+=t)-cr);if(!(xr==0&&wr<180))return wo(t)}else return W--,vl(At());let e=(t<<5^(t>1?nt.getUint16(W):t>0?ke[W]:0))&4095,r=xl[e],n=W,s=W+t-3,a,d=0;if(r&&r.bytes==t){for(;n<s;){if(a=nt.getUint32(n),a!=r[d++]){n=1879048192;break}n+=4}for(s+=3;n<s;)if(a=ke[n++],a!=r[d++]){n=1879048192;break}if(n===s)return W=n,r.string;s-=3,n=W}for(r=[],xl[e]=r,r.bytes=t;n<s;)a=nt.getUint32(n),r.push(a),n+=4;for(s+=3;n<s;)a=ke[n++],r.push(a);let g=t<16?xo(t):bl(t);return g!=null?r.string=g:r.string=wo(t)}function vl(t){if(typeof t=="string")return t;if(typeof t=="number"||typeof t=="boolean"||typeof t=="bigint")return t.toString();if(t==null)return t+"";if(mt.allowArraysInMapKeys&&Array.isArray(t)&&t.flat().every(e=>["string","number","boolean","bigint"].includes(typeof e)))return t.flat().toString();throw new Error(`Invalid property type for record: ${typeof t}`)}const ql=(t,e)=>{let r=At().map(vl),n=t;e!==void 0&&(t=t<32?-((e<<5)+t):(e<<5)+t,r.highByte=e);let s=st[t];return s&&(s.isShared||Yr)&&((st.restoreStructures||(st.restoreStructures=[]))[t]=s),st[t]=r,r.read=bo(r,n),r.read()};Ht[0]=()=>{},Ht[0].noBuffer=!0,Ht[66]=t=>{let e=t.byteLength%8||8,r=BigInt(t[0]&128?t[0]-256:t[0]);for(let n=1;n<e;n++)r<<=BigInt(8),r+=BigInt(t[n]);if(t.byteLength!==e){let n=new DataView(t.buffer,t.byteOffset,t.byteLength),s=(a,d)=>{let g=d-a;if(g<=40){let w=n.getBigUint64(a);for(let I=a+8;I<d;I+=8)w<<=64n,w|=n.getBigUint64(I);return w}let x=a+(g>>4<<3),N=s(a,x),S=s(x,d);return N<<BigInt((d-x)*8)|S};r=r<<BigInt((n.byteLength-e)*8)|s(e,n.byteLength)}return r};let Sl={Error,EvalError,RangeError,ReferenceError,SyntaxError,TypeError,URIError,AggregateError:typeof AggregateError=="function"?AggregateError:null};Ht[101]=()=>{let t=At();if(!Sl[t[0]]){let e=Error(t[1],{cause:t[2]});return e.name=t[0],e}return Sl[t[0]](t[1],{cause:t[2]})},Ht[105]=t=>{if(mt.structuredClone===!1)throw new Error("Structured clone extension is disabled");let e=nt.getUint32(W-4);Cr||(Cr=new Map);let r=ke[W],n;r>=144&&r<160||r==220||r==221?n=[]:r>=128&&r<144||r==222||r==223?n=new Map:(r>=199&&r<=201||r>=212&&r<=216)&&ke[W+1]===115?n=new Set:n={};let s={target:n};Cr.set(e,s);let a=At();if(s.used)Object.assign(n,a);else return s.target=a;if(n instanceof Map)for(let[d,g]of a.entries())n.set(d,g);if(n instanceof Set)for(let d of Array.from(a))n.add(d);return n},Ht[112]=t=>{if(mt.structuredClone===!1)throw new Error("Structured clone extension is disabled");let e=nt.getUint32(W-4),r=Cr.get(e);return r.used=!0,r.target},Ht[115]=()=>new Set(At());const kl=["Int8","Uint8","Uint8Clamped","Int16","Uint16","Int32","Uint32","Float32","Float64","BigInt64","BigUint64"].map(t=>t+"Array");let yf=typeof globalThis=="object"?globalThis:window;Ht[116]=t=>{let e=t[0],r=Uint8Array.prototype.slice.call(t,1).buffer,n=kl[e];if(!n){if(e===16)return r;if(e===17)return new DataView(r);throw new Error("Could not find typed array for code "+e)}return new yf[n](r)},Ht[120]=()=>{let t=At();return new RegExp(t[0],t[1])};const bf=[];Ht[98]=t=>{let e=(t[0]<<24)+(t[1]<<16)+(t[2]<<8)+t[3],r=W;return W+=e-t.length,Pt=bf,Pt=[wl(),wl()],Pt.position0=0,Pt.position1=0,Pt.postBundlePosition=W,W=r,At()},Ht[255]=t=>t.length==4?new Date((t[0]*16777216+(t[1]<<16)+(t[2]<<8)+t[3])*1e3):t.length==8?new Date(((t[0]<<22)+(t[1]<<14)+(t[2]<<6)+(t[3]>>2))/1e6+((t[3]&3)*4294967296+t[4]*16777216+(t[5]<<16)+(t[6]<<8)+t[7])*1e3):t.length==12?new Date(((t[0]<<24)+(t[1]<<16)+(t[2]<<8)+t[3])/1e6+((t[4]&128?-281474976710656:0)+t[6]*1099511627776+t[7]*4294967296+t[8]*16777216+(t[9]<<16)+(t[10]<<8)+t[11])*1e3):new Date("invalid");function El(t){let e=wr,r=W,n=cr,s=xr,a=Xr,d=Cr,g=Pt,x=new Uint8Array(ke.slice(0,wr)),N=st,S=st.slice(0,st.length),w=mt,I=Yr,j=t();return wr=e,W=r,cr=n,xr=s,Xr=a,Cr=d,Pt=g,ke=x,Yr=I,st=N,st.splice(0,st.length,...S),mt=w,nt=new DataView(ke.buffer,ke.byteOffset,ke.byteLength),j}function vo(){ke=null,Cr=null,st=null}const qo=new Array(147);for(let t=0;t<256;t++)qo[t]=+("1e"+Math.floor(45.15-t*.30103));var us=new gi({useRecords:!1});us.unpack,us.unpackMultiple,us.unpack;let wf=new Float32Array(1);new Uint8Array(wf.buffer,0,4);let ds;try{ds=new TextEncoder}catch{}let So,ko;const Hn=typeof Buffer<"u",fs=Hn?function(t){return Buffer.allocUnsafeSlow(t)}:Uint8Array,Al=Hn?Buffer:Uint8Array,Ol=Hn?4294967296:2144337920;let z,bi,ht,M=0,jt,vt=null,xf;const Nf=21760,vf=/[\u0080-\uFFFF]/,Jn=Symbol("record-id");class Tl extends gi{constructor(e){super(e),this.offset=0;let r,n,s,a,d=Al.prototype.utf8Write?function(R,pe){return z.utf8Write(R,pe,z.byteLength-pe)}:ds&&ds.encodeInto?function(R,pe){return ds.encodeInto(R,z.subarray(pe)).written}:!1,g=this;e||(e={});let x=e&&e.sequential,N=e.structures||e.saveStructures,S=e.maxSharedStructures;if(S==null&&(S=N?32:0),S>8160)throw new Error("Maximum maxSharedStructure is 8160");e.structuredClone&&e.moreTypes==null&&(this.moreTypes=!0);let w=e.maxOwnStructures;w==null&&(w=N?32:64),!this.structures&&e.useRecords!=!1&&(this.structures=[]);let I=S>32||w+S>64,j=S+64,V=S+w+64;if(V>8256)throw new Error("Maximum maxSharedStructure + maxOwnStructure is 8192");let Y=[],ge=0,Ee=0;this.pack=this.encode=function(R,pe){if(z||(z=new fs(8192),ht=z.dataView||(z.dataView=new DataView(z.buffer,0,8192)),M=0),jt=z.length-10,jt-M<2048?(z=new fs(z.length),ht=z.dataView||(z.dataView=new DataView(z.buffer,0,z.length)),jt=z.length-10,M=0):M=M+7&2147483640,r=M,pe&Of&&(M+=pe&255),a=g.structuredClone?new Map:null,g.bundleStrings&&typeof R!="string"?(vt=[],vt.size=1/0):vt=null,s=g.structures,s){s.uninitialized&&(s=g._mergeStructures(g.getStructures()));let ne=s.sharedLength||0;if(ne>S)throw new Error("Shared structures is larger than maximum shared structures, try increasing maxSharedStructures to "+s.sharedLength);if(!s.transitions){s.transitions=Object.create(null);for(let se=0;se<ne;se++){let Oe=s[se];if(!Oe)continue;let he,Se=s.transitions;for(let je=0,ze=Oe.length;je<ze;je++){let Et=Oe[je];he=Se[Et],he||(he=Se[Et]=Object.create(null)),Se=he}Se[Jn]=se+64}this.lastNamedStructuresLength=ne}x||(s.nextId=ne+64)}n&&(n=!1);let oe;try{g.randomAccessStructure&&R&&typeof R=="object"?R.constructor===Object?Ze(R):R.constructor!==Map&&!Array.isArray(R)&&!ko.some(se=>R instanceof se)?Ze(R.toJSON?R.toJSON():R):Ie(R):Ie(R);let ne=vt;if(vt&&Cl(r,Ie,0),a&&a.idsToInsert){let se=a.idsToInsert.sort((je,ze)=>je.offset>ze.offset?1:-1),Oe=se.length,he=-1;for(;ne&&Oe>0;){let je=se[--Oe].offset+r;je<ne.stringsPosition+r&&he===-1&&(he=0),je>ne.position+r?he>=0&&(he+=6):(he>=0&&(ht.setUint32(ne.position+r,ht.getUint32(ne.position+r)+he),he=-1),ne=ne.previous,Oe++)}he>=0&&ne&&ht.setUint32(ne.position+r,ht.getUint32(ne.position+r)+he),M+=se.length*6,M>jt&&$e(M),g.offset=M;let Se=qf(z.subarray(r,M),se);return a=null,Se}return g.offset=M,pe&Ef?(z.start=r,z.end=M,z):z.subarray(r,M)}catch(ne){throw oe=ne,ne}finally{if(s&&(Ue(),n&&g.saveStructures)){let ne=s.sharedLength||0,se=z.subarray(r,M),Oe=Sf(s,g);if(!oe)return g.saveStructures(Oe,Oe.isCompatible)===!1?g.pack(R,pe):(g.lastNamedStructuresLength=ne,z.length>1073741824&&(z=null),se)}z.length>1073741824&&(z=null),pe&Af&&(M=r)}};const Ue=()=>{Ee<10&&Ee++;let R=s.sharedLength||0;if(s.length>R&&!x&&(s.length=R),ge>1e4)s.transitions=null,Ee=0,ge=0,Y.length>0&&(Y=[]);else if(Y.length>0&&!x){for(let pe=0,oe=Y.length;pe<oe;pe++)Y[pe][Jn]=0;Y=[]}},Re=R=>{var pe=R.length;pe<16?z[M++]=144|pe:pe<65536?(z[M++]=220,z[M++]=pe>>8,z[M++]=pe&255):(z[M++]=221,ht.setUint32(M,pe),M+=4);for(let oe=0;oe<pe;oe++)Ie(R[oe])},Ie=R=>{M>jt&&(z=$e(M));var pe=typeof R,oe;if(pe==="string"){let ne=R.length;if(vt&&ne>=4&&ne<4096){if((vt.size+=ne)>Nf){let Se,je=(vt[0]?vt[0].length*3+vt[1].length:0)+10;M+je>jt&&(z=$e(M+je));let ze;vt.position?(ze=vt,z[M]=200,M+=3,z[M++]=98,Se=M-r,M+=4,Cl(r,Ie,0),ht.setUint16(Se+r-3,M-r-Se)):(z[M++]=214,z[M++]=98,Se=M-r,M+=4),vt=["",""],vt.previous=ze,vt.size=0,vt.position=Se}let he=vf.test(R);vt[he?0:1]+=R,z[M++]=193,Ie(he?-ne:ne);return}let se;ne<32?se=1:ne<256?se=2:ne<65536?se=3:se=5;let Oe=ne*3;if(M+Oe>jt&&(z=$e(M+Oe)),ne<64||!d){let he,Se,je,ze=M+se;for(he=0;he<ne;he++)Se=R.charCodeAt(he),Se<128?z[ze++]=Se:Se<2048?(z[ze++]=Se>>6|192,z[ze++]=Se&63|128):(Se&64512)===55296&&((je=R.charCodeAt(he+1))&64512)===56320?(Se=65536+((Se&1023)<<10)+(je&1023),he++,z[ze++]=Se>>18|240,z[ze++]=Se>>12&63|128,z[ze++]=Se>>6&63|128,z[ze++]=Se&63|128):(z[ze++]=Se>>12|224,z[ze++]=Se>>6&63|128,z[ze++]=Se&63|128);oe=ze-M-se}else oe=d(R,M+se);oe<32?z[M++]=160|oe:oe<256?(se<2&&z.copyWithin(M+2,M+1,M+1+oe),z[M++]=217,z[M++]=oe):oe<65536?(se<3&&z.copyWithin(M+3,M+2,M+2+oe),z[M++]=218,z[M++]=oe>>8,z[M++]=oe&255):(se<5&&z.copyWithin(M+5,M+3,M+3+oe),z[M++]=219,ht.setUint32(M,oe),M+=4),M+=oe}else if(pe==="number")if(R>>>0===R)R<32||R<128&&this.useRecords===!1||R<64&&!this.randomAccessStructure?z[M++]=R:R<256?(z[M++]=204,z[M++]=R):R<65536?(z[M++]=205,z[M++]=R>>8,z[M++]=R&255):(z[M++]=206,ht.setUint32(M,R),M+=4);else if(R>>0===R)R>=-32?z[M++]=256+R:R>=-128?(z[M++]=208,z[M++]=R+256):R>=-32768?(z[M++]=209,ht.setInt16(M,R),M+=2):(z[M++]=210,ht.setInt32(M,R),M+=4);else{let ne;if((ne=this.useFloat32)>0&&R<4294967296&&R>=-2147483648){z[M++]=202,ht.setFloat32(M,R);let se;if(ne<4||(se=R*qo[(z[M]&127)<<1|z[M+1]>>7])>>0===se){M+=4;return}else M--}z[M++]=203,ht.setFloat64(M,R),M+=8}else if(pe==="object"||pe==="function")if(!R)z[M++]=192;else{if(a){let se=a.get(R);if(se){if(!se.id){let Oe=a.idsToInsert||(a.idsToInsert=[]);se.id=Oe.push(se)}z[M++]=214,z[M++]=112,ht.setUint32(M,se.id),M+=4;return}else a.set(R,{offset:M-r})}let ne=R.constructor;if(ne===Object)Be(R);else if(ne===Array)Re(R);else if(ne===Map)if(this.mapAsEmptyObject)z[M++]=128;else{oe=R.size,oe<16?z[M++]=128|oe:oe<65536?(z[M++]=222,z[M++]=oe>>8,z[M++]=oe&255):(z[M++]=223,ht.setUint32(M,oe),M+=4);for(let[se,Oe]of R)Ie(se),Ie(Oe)}else{for(let se=0,Oe=So.length;se<Oe;se++){let he=ko[se];if(R instanceof he){let Se=So[se];if(Se.write){Se.type&&(z[M++]=212,z[M++]=Se.type,z[M++]=0);let Gt=Se.write.call(this,R);Gt===R?Array.isArray(R)?Re(R):Be(R):Ie(Gt);return}let je=z,ze=ht,Et=M;z=null;let $t;try{$t=Se.pack.call(this,R,Gt=>(z=je,je=null,M+=Gt,M>jt&&$e(M),{target:z,targetView:ht,position:M-Gt}),Ie)}finally{je&&(z=je,ht=ze,M=Et,jt=z.length-10)}$t&&($t.length+M>jt&&$e($t.length+M),M=Il($t,z,M,Se.type));return}}if(Array.isArray(R))Re(R);else{if(R.toJSON){const se=R.toJSON();if(se!==R)return Ie(se)}if(pe==="function")return Ie(this.writeFunction&&this.writeFunction(R));Be(R)}}}else if(pe==="boolean")z[M++]=R?195:194;else if(pe==="bigint"){if(R<9223372036854776e3&&R>=-9223372036854776e3)z[M++]=211,ht.setBigInt64(M,R);else if(R<18446744073709552e3&&R>0)z[M++]=207,ht.setBigUint64(M,R);else if(this.largeBigIntToFloat)z[M++]=203,ht.setFloat64(M,Number(R));else{if(this.largeBigIntToString)return Ie(R.toString());if(this.useBigIntExtension||this.moreTypes){let ne=R<0?BigInt(-1):BigInt(0),se;if(R>>BigInt(65536)===ne){let Oe=BigInt(18446744073709552e3)-BigInt(1),he=[];for(;he.push(R&Oe),R>>BigInt(63)!==ne;)R>>=BigInt(64);se=new Uint8Array(new BigUint64Array(he).buffer),se.reverse()}else{let Oe=R<0,he=(Oe?~R:R).toString(16);if(he.length%2?he="0"+he:parseInt(he.charAt(0),16)>=8&&(he="00"+he),Hn)se=Buffer.from(he,"hex");else{se=new Uint8Array(he.length/2);for(let Se=0;Se<se.length;Se++)se[Se]=parseInt(he.slice(Se*2,Se*2+2),16)}if(Oe)for(let Se=0;Se<se.length;Se++)se[Se]=~se[Se]}se.length+M>jt&&$e(se.length+M),M=Il(se,z,M,66);return}else throw new RangeError(R+" was too large to fit in MessagePack 64-bit integer format, use useBigIntExtension, or set largeBigIntToFloat to convert to float-64, or set largeBigIntToString to convert to string")}M+=8}else if(pe==="undefined")this.encodeUndefinedAsNil?z[M++]=192:(z[M++]=212,z[M++]=0,z[M++]=0);else throw new Error("Unknown type: "+pe)},ot=this.variableMapSize||this.coercibleKeyAsNumber||this.skipValues?R=>{let pe;if(this.skipValues){pe=[];for(let se in R)(typeof R.hasOwnProperty!="function"||R.hasOwnProperty(se))&&!this.skipValues.includes(R[se])&&pe.push(se)}else pe=Object.keys(R);let oe=pe.length;oe<16?z[M++]=128|oe:oe<65536?(z[M++]=222,z[M++]=oe>>8,z[M++]=oe&255):(z[M++]=223,ht.setUint32(M,oe),M+=4);let ne;if(this.coercibleKeyAsNumber)for(let se=0;se<oe;se++){ne=pe[se];let Oe=Number(ne);Ie(isNaN(Oe)?ne:Oe),Ie(R[ne])}else for(let se=0;se<oe;se++)Ie(ne=pe[se]),Ie(R[ne])}:R=>{z[M++]=222;let pe=M-r;M+=2;let oe=0;for(let ne in R)(typeof R.hasOwnProperty!="function"||R.hasOwnProperty(ne))&&(Ie(ne),Ie(R[ne]),oe++);if(oe>65535)throw new Error('Object is too large to serialize with fast 16-bit map size, use the "variableMapSize" option to serialize this object');z[pe+++r]=oe>>8,z[pe+r]=oe&255},at=this.useRecords===!1?ot:e.progressiveRecords&&!I?R=>{let pe,oe=s.transitions||(s.transitions=Object.create(null)),ne=M++-r,se;for(let Oe in R)if(typeof R.hasOwnProperty!="function"||R.hasOwnProperty(Oe)){if(pe=oe[Oe],pe)oe=pe;else{let he=Object.keys(R),Se=oe;oe=s.transitions;let je=0;for(let ze=0,Et=he.length;ze<Et;ze++){let $t=he[ze];pe=oe[$t],pe||(pe=oe[$t]=Object.create(null),je++),oe=pe}ne+r+1==M?(M--,Ye(oe,he,je)):rt(oe,he,ne,je),se=!0,oe=Se[Oe]}Ie(R[Oe])}if(!se){let Oe=oe[Jn];Oe?z[ne+r]=Oe:rt(oe,Object.keys(R),ne,0)}}:R=>{let pe,oe=s.transitions||(s.transitions=Object.create(null)),ne=0;for(let Oe in R)(typeof R.hasOwnProperty!="function"||R.hasOwnProperty(Oe))&&(pe=oe[Oe],pe||(pe=oe[Oe]=Object.create(null),ne++),oe=pe);let se=oe[Jn];se?se>=96&&I?(z[M++]=((se-=96)&31)+96,z[M++]=se>>5):z[M++]=se:Ye(oe,oe.__keys__||Object.keys(R),ne);for(let Oe in R)(typeof R.hasOwnProperty!="function"||R.hasOwnProperty(Oe))&&Ie(R[Oe])},Ce=typeof this.useRecords=="function"&&this.useRecords,Be=Ce?R=>{Ce(R)?at(R):ot(R)}:at,$e=R=>{let pe;if(R>16777216){if(R-r>Ol)throw new Error("Packed buffer would be larger than maximum buffer size");pe=Math.min(Ol,Math.round(Math.max((R-r)*(R>67108864?1.25:2),4194304)/4096)*4096)}else pe=(Math.max(R-r<<2,z.length-1)>>12)+1<<12;let oe=new fs(pe);return ht=oe.dataView||(oe.dataView=new DataView(oe.buffer,0,pe)),R=Math.min(R,z.length),z.copy?z.copy(oe,0,r,R):oe.set(z.slice(r,R)),M-=r,r=0,jt=oe.length-10,z=oe},Ye=(R,pe,oe)=>{let ne=s.nextId;ne||(ne=64),ne<j&&this.shouldShareStructure&&!this.shouldShareStructure(pe)?(ne=s.nextOwnId,ne<V||(ne=j),s.nextOwnId=ne+1):(ne>=V&&(ne=j),s.nextId=ne+1);let se=pe.highByte=ne>=96&&I?ne-96>>5:-1;R[Jn]=ne,R.__keys__=pe,s[ne-64]=pe,ne<j?(pe.isShared=!0,s.sharedLength=ne-63,n=!0,se>=0?(z[M++]=(ne&31)+96,z[M++]=se):z[M++]=ne):(se>=0?(z[M++]=213,z[M++]=114,z[M++]=(ne&31)+96,z[M++]=se):(z[M++]=212,z[M++]=114,z[M++]=ne),oe&&(ge+=Ee*oe),Y.length>=w&&(Y.shift()[Jn]=0),Y.push(R),Ie(pe))},rt=(R,pe,oe,ne)=>{let se=z,Oe=M,he=jt,Se=r;z=bi,M=0,r=0,z||(bi=z=new fs(8192)),jt=z.length-10,Ye(R,pe,ne),bi=z;let je=M;if(z=se,M=Oe,jt=he,r=Se,je>1){let ze=M+je-1;ze>jt&&$e(ze);let Et=oe+r;z.copyWithin(Et+je,Et+1,M),z.set(bi.slice(0,je),Et),M=ze}else z[oe+r]=bi[0]},Ze=R=>{let pe=xf(R,z,r,M,s,$e,(oe,ne,se)=>{if(se)return n=!0;M=ne;let Oe=z;return Ie(oe),Ue(),Oe!==z?{position:M,targetView:ht,target:z}:M},this);if(pe===0)return Be(R);M=pe}}useBuffer(e){z=e,z.dataView||(z.dataView=new DataView(z.buffer,z.byteOffset,z.byteLength)),ht=z.dataView,M=0}set position(e){M=e}get position(){return M}clearSharedData(){this.structures&&(this.structures=[]),this.typedStructs&&(this.typedStructs=[])}}ko=[Date,Set,Error,RegExp,ArrayBuffer,Object.getPrototypeOf(Uint8Array.prototype).constructor,DataView,dl],So=[{pack(t,e,r){let n=t.getTime()/1e3;if((this.useTimestamp32||t.getMilliseconds()===0)&&n>=0&&n<4294967296){let{target:s,targetView:a,position:d}=e(6);s[d++]=214,s[d++]=255,a.setUint32(d,n)}else if(n>0&&n<4294967296){let{target:s,targetView:a,position:d}=e(10);s[d++]=215,s[d++]=255,a.setUint32(d,t.getMilliseconds()*4e6+(n/1e3/4294967296>>0)),a.setUint32(d+4,n)}else if(isNaN(n)){if(this.onInvalidDate)return e(0),r(this.onInvalidDate());let{target:s,targetView:a,position:d}=e(3);s[d++]=212,s[d++]=255,s[d++]=255}else{let{target:s,targetView:a,position:d}=e(15);s[d++]=199,s[d++]=12,s[d++]=255,a.setUint32(d,t.getMilliseconds()*1e6),a.setBigInt64(d+4,BigInt(Math.floor(n)))}}},{pack(t,e,r){if(this.setAsEmptyObject)return e(0),r({});let n=Array.from(t),{target:s,position:a}=e(this.moreTypes?3:0);this.moreTypes&&(s[a++]=212,s[a++]=115,s[a++]=0),r(n)}},{pack(t,e,r){let{target:n,position:s}=e(this.moreTypes?3:0);this.moreTypes&&(n[s++]=212,n[s++]=101,n[s++]=0),r([t.name,t.message,t.cause])}},{pack(t,e,r){let{target:n,position:s}=e(this.moreTypes?3:0);this.moreTypes&&(n[s++]=212,n[s++]=120,n[s++]=0),r([t.source,t.flags])}},{pack(t,e){this.moreTypes?Eo(t,16,e):Ao(Hn?Buffer.from(t):new Uint8Array(t),e)}},{pack(t,e){let r=t.constructor;r!==Al&&this.moreTypes?Eo(t,kl.indexOf(r.name),e):Ao(t,e)}},{pack(t,e){this.moreTypes?Eo(t,17,e):Ao(Hn?Buffer.from(t):new Uint8Array(t),e)}},{pack(t,e){let{target:r,position:n}=e(1);r[n]=193}}];function Eo(t,e,r,n){let s=t.byteLength;if(s+1<256){var{target:a,position:d}=r(4+s);a[d++]=199,a[d++]=s+1}else if(s+1<65536){var{target:a,position:d}=r(5+s);a[d++]=200,a[d++]=s+1>>8,a[d++]=s+1&255}else{var{target:a,position:d,targetView:g}=r(7+s);a[d++]=201,g.setUint32(d,s+1),d+=4}a[d++]=116,a[d++]=e,t.buffer||(t=new Uint8Array(t)),a.set(new Uint8Array(t.buffer,t.byteOffset,t.byteLength),d)}function Ao(t,e){let r=t.byteLength;var n,s;if(r<256){var{target:n,position:s}=e(r+2);n[s++]=196,n[s++]=r}else if(r<65536){var{target:n,position:s}=e(r+3);n[s++]=197,n[s++]=r>>8,n[s++]=r&255}else{var{target:n,position:s,targetView:a}=e(r+5);n[s++]=198,a.setUint32(s,r),s+=4}n.set(t,s)}function Il(t,e,r,n){let s=t.length;switch(s){case 1:e[r++]=212;break;case 2:e[r++]=213;break;case 4:e[r++]=214;break;case 8:e[r++]=215;break;case 16:e[r++]=216;break;default:s<256?(e[r++]=199,e[r++]=s):s<65536?(e[r++]=200,e[r++]=s>>8,e[r++]=s&255):(e[r++]=201,e[r++]=s>>24,e[r++]=s>>16&255,e[r++]=s>>8&255,e[r++]=s&255)}return e[r++]=n,e.set(t,r),r+=s,r}function qf(t,e){let r,n=e.length*6,s=t.length-n;for(;r=e.pop();){let a=r.offset,d=r.id;t.copyWithin(a+n,a,s),n-=6;let g=a+n;t[g++]=214,t[g++]=105,t[g++]=d>>24,t[g++]=d>>16&255,t[g++]=d>>8&255,t[g++]=d&255,s=a}return t}function Cl(t,e,r){if(vt.length>0){ht.setUint32(vt.position+t,M+r-vt.position-t),vt.stringsPosition=M-t;let n=vt;vt=null,e(n[0]),e(n[1])}}function Sf(t,e){return t.isCompatible=r=>{let n=!r||(e.lastNamedStructuresLength||0)===r.length;return n||e._mergeStructures(r),n},t}let Ll=new Tl({useRecords:!1});const kf=Ll.pack;Ll.pack;const Ef=512,Af=1024,Of=2048,Pl=t=>Object.prototype.toString.call(t)==="[object Object]",Fl=t=>Object.entries(t),Oo=()=>Object.create(null),Rl=(t,e)=>e in t?t[e]:void 0,Wl=!(typeof navigator<"u"&&"product"in navigator&&navigator.product==="ReactNative")&&typeof globalThis.Buffer<"u";function ue(t=void 0){return{ok:!0,value:t}}const we=t=>({ok:!1,error:t}),Tf=t=>{if(t.ok)return t.value;throw new Error("getOrThrow",{cause:t.error})},If=t=>t.ok?t.value:null,Nn=(t,e)=>{try{return ue(t())}catch(r){return we(e(r))}},Cf=async(t,e)=>t().then(r=>ue(r),r=>we(e(r))),Dl=t=>{if(t===null)return"null";if(t===void 0)return"undefined";if(typeof t=="string")return`"${t}"`;try{return JSON.stringify(t)}catch{return globalThis.String(t)}},To=Symbol("evolu.Type"),Ml=t=>typeof t=="object"&&t!==null&&To in t,Zr=(t,e)=>({...e,name:t,is:r=>e.fromUnknown(r).ok,from:e.fromUnknown,orThrow:r=>Tf(e.fromUnknown(r)),orNull:r=>If(e.fromUnknown(r)),[To]:!0,Type:void 0,Input:void 0,Error:void 0,Parent:void 0,ParentError:void 0,Errors:void 0,"~standard":{version:1,vendor:"evolu",validate:r=>{const n=e.fromUnknown(r);return n.ok?{value:n.value}:(rc??=Zh(),{issues:Nr(n.error,rc)})},types:{input:void 0,output:void 0}}}),Xe=t=>e=>t({...e,value:Dl(e.value)}),dr=(t,e)=>Zr(t,{fromUnknown:e,fromParent:ue}),en=()=>Xe(t=>`A value ${t.value} is not a ${t.type.toLowerCase()}.`);dr("Unknown",ue);const Ct=dr("String",t=>typeof t=="string"?ue(t):we({type:"String",value:t})),Lf=en(),vn=dr("Number",t=>typeof t=="number"?ue(t):we({type:"Number",value:t})),Pf=en(),Ff=dr("BigInt",t=>typeof t=="bigint"?ue(t):we({type:"BigInt",value:t})),Rf=en(),Io=dr("Boolean",t=>typeof t=="boolean"?ue(t):we({type:"Boolean",value:t})),Wf=en();dr("Undefined",t=>t===void 0?ue(t):we({type:"Undefined",value:t}));const Df=en(),Co=dr("Null",t=>t===null?ue(t):we({type:"Null",value:t})),Mf=en();dr("Function",t=>typeof t=="function"?ue(t):we({type:"Function",value:t}));const Uf=en(),hs=dr("Uint8Array",t=>t instanceof globalThis.Uint8Array?ue(t):we({type:"Uint8Array",value:t})),$f=en(),Bf=t=>({...dr("InstanceOf",e=>e instanceof t?ue(e):we({type:"InstanceOf",value:e,ctor:t.name})),ctor:t}),jf=Xe(t=>`The value ${t.value} is not an instance of ${t.ctor}.`);Bf(globalThis.Date),dr("EvoluType",t=>Ml(t)?ue(t):we({type:"EvoluType",value:t}));const zf=Xe(t=>`Value ${t.value} is not a valid Evolu Type.`);function it(t,e,r){return{...Zr("Brand",{fromUnknown:r?s=>{const a=e.fromUnknown(s);return a.ok?r(a.value):a}:s=>{const a=e.fromUnknown(s);return a.ok?ue(a.value):we({type:t,value:s,parentError:a.error})},fromParent:r??ue}),brand:t,parentType:e}}it("CurrencyCode",Ct,t=>/^[A-Z]{3}$/.test(t)?ue(t):we({type:"CurrencyCode",value:t}));const Vf=Xe(t=>`Invalid currency code: ${t.value}.`),wi=it("DateIso",Ct,t=>{if(t.length!==24)return we({type:"DateIso",value:t});const e=globalThis.Date.parse(t);return isNaN(e)?we({type:"DateIso",value:t}):new globalThis.Date(e).toISOString()!==t?we({type:"DateIso",value:t}):ue(t)}),Qf=Xe(t=>`The value ${t.value} is not a valid ISO 8601 date string.`),Hf=t=>it("Trimmed",t,e=>e.trim().length===e.length?ue(e):we({type:"Trimmed",value:e})),Jf=Xe(t=>`The value ${t.value} must be trimmed.`),ps=Hf(Ct),qn=t=>e=>it(`MinLength${t}`,e,r=>r.length>=t?ue(r):we({type:"MinLength",value:r,min:t})),Kf=Xe(t=>`The value ${t.value} does not meet the minimum length of ${t.min}.`),xi=t=>e=>it(`MaxLength${t}`,e,r=>r.length<=t?ue(r):we({type:"MaxLength",value:r,max:t})),Gf=Xe(t=>`The value ${t.value} exceeds the maximum length of ${t.max}.`),ms=t=>e=>it(`Length${t}`,e,r=>r.length===t?ue(r):we({type:"Length",value:r,exact:t})),Xf=Xe(t=>`The value ${t.value} does not have the required length of ${t.exact}.`);qn(1)(Ct);const Yf=xi(100)(Ct),Zf=xi(1e3)(Ct);qn(1)(Yf),qn(1)(Zf);const Ul=qn(1)(ps),eh=xi(100)(ps),th=xi(1e3)(ps);qn(1)(eh),qn(1)(th),it("Mnemonic",Ul,t=>ff(t,go)?ue(t):we({type:"Mnemonic",value:t}));const rh=Xe(t=>`Invalid BIP39 mnemonic: ${t.value}.`),$l=(t,e)=>{const r=new RegExp(e.source,e.flags);return n=>it(t,n,s=>(r.lastIndex=0,r.test(s)?ue(s):we({type:"Regex",name:t,value:s,pattern:e})))},nh=Xe(t=>`The value ${t.value} does not match the pattern for ${t.name}: ${t.pattern}.`),ih=$l("UrlSafeString",/^[A-Za-z0-9_-]+$/)(Ct),Bl=it("Base64Url",Ct,t=>{let e;try{e=_s(Lo(t))}catch{}return e===t?ue(t):we({type:"Base64Url",value:t})}),jl={alphabet:"base64url",omitPadding:!0},_s=Wl?t=>globalThis.Buffer.from(t).toString("base64url"):typeof globalThis.Uint8Array.prototype?.toBase64<"u"?t=>t.toBase64(jl):t=>{const e=Array.from(t,n=>globalThis.String.fromCodePoint(n)).join("");return globalThis.btoa(e).replace(/\+/g,"-").replace(/\//g,"_").replace(/=/g,"")},Lo=Wl?t=>{const e=globalThis.Buffer.from(t,"base64url");return new globalThis.Uint8Array(e)}:typeof globalThis.Uint8Array?.fromBase64<"u"?t=>globalThis.Uint8Array.fromBase64(t,jl):t=>{let e=t.replace(/-/g,"+").replace(/_/g,"/");for(;e.length%4!==0;)e+="=";const r=globalThis.atob(e);return globalThis.Uint8Array.from(r,n=>n.charCodeAt(0))},sh=it("SimpleName",ih,t=>t.length>=1&&t.length<=64?ue(t):we({type:"SimpleName",value:t}));it("SimplePassword",qn(8)(xi(64)(ps)));const oh=t=>Xe(e=>`Invalid password: ${t(e.parentError)}`),Po=it("Id",Ct,t=>t.length===22&&Bl.fromParent(t).ok?ue(t):we({type:"Id",value:t})),ah=Xe(t=>`The value ${t.value} is not a valid Id.`),lh=t=>_s(t.randomBytes.create(16)),ch=Xe(t=>`Invalid Id for table ${t.table}: ${t.value}.`),uh=it("IdBytes",ms(16)(hs)),dh=16,gs=t=>Lo(t),ys=t=>_s(t),zl=t=>it("Positive",t,e=>e>0?ue(e):we({type:"Positive",value:e})),fh=Xe(t=>`The value ${t.value} must be positive (> 0).`),Vl=t=>it("Negative",t,e=>e<0?ue(e):we({type:"Negative",value:e})),hh=Xe(t=>`The value ${t.value} must be negative (< 0).`),Ql=t=>it("NonPositive",t,e=>e<=0?ue(e):we({type:"NonPositive",value:e})),ph=Xe(t=>`The value ${t.value} must be non-positive (≤ 0).`),Hl=t=>it("NonNegative",t,e=>e>=0?ue(e):we({type:"NonNegative",value:e})),mh=Xe(t=>`The value ${t.value} must be non-negative (≥ 0).`),_h=Hl(vn);zl(_h);const gh=Ql(vn);Vl(gh);const yh=t=>it("Int",t,e=>globalThis.Number.isSafeInteger(e)?ue(e):we({type:"Int",value:e})),bh=Xe(t=>`The value ${t.value} must be an integer.`),bs=yh(vn),Qe=Hl(bs),Xt=zl(Qe),wh=Xt.orThrow(globalThis.Number.MAX_SAFE_INTEGER),xh=Ql(bs);Vl(xh);const Nh=Xe(t=>`The value ${t.value} is not > ${t.min}.`),vh=Xe(t=>`The value ${t.value} is not < ${t.max}.`),qh=Xe(t=>`The value ${t.value} is not >= ${t.min}.`),Jl=t=>e=>it(`LessThanOrEqualTo${t}`,e,r=>r<=t?ue(r):we({type:"LessThanOrEqualTo",value:r,max:t})),Sh=Xe(t=>`The value ${t.value} is not <= ${t.max}.`),kh=t=>it("NonNaN",t,e=>globalThis.Number.isNaN(e)?we({type:"NonNaN",value:e}):ue(e)),Eh=Xe(()=>"The value must not be NaN.");kh(vn);const Ah=t=>it("Finite",t,e=>globalThis.Number.isFinite(e)?ue(e):we({type:"Finite",value:e})),Oh=Xe(t=>`The value ${t.value} must be finite.`),Th=Ah(vn),Ih=Xe(t=>`The value ${t.value} is not a multiple of ${t.divisor}.`),Kl=(t,e)=>r=>it(`Between${t}-${e}`,r,n=>n>=t&&n<=e?ue(n):we({type:"Between",value:n,min:t,max:e})),Ch=Xe(t=>`The value ${t.value} is not between ${t.min} and ${t.max}, inclusive.`),Lh=t=>({...Zr("Literal",{fromUnknown:r=>r===t?ue(t):we({type:"Literal",value:r,expected:t}),fromParent:ue}),expected:t}),Ph=Xe(t=>`The value ${t.value} is not strictly equal to the expected literal: ${globalThis.String(t.expected)}.`),Gl=t=>({...Zr("Array",{fromUnknown:n=>{if(!Array.isArray(n))return we({type:"Array",value:n,reason:{kind:"NotArray"}});const s=[];for(let a=0;a<n.length;a++){const d=t.fromUnknown(n[a]);if(!d.ok)return we({type:"Array",value:n,reason:{kind:"Element",index:a,error:d.error}});s.push(d.value)}return ue(s)},fromParent:n=>{const s=[];for(let a=0;a<n.length;a++){const d=t.fromParent(n[a]);if(!d.ok)return we({type:"Array",value:n,reason:{kind:"Element",index:a,error:d.error}});s.push(d.value)}return ue(s)}}),element:t}),Fh=t=>Xe(e=>{switch(e.reason.kind){case"NotArray":return`Expected an array but received ${e.value}.`;case"Element":return`Invalid element at index ${e.reason.index}: ${t(e.reason.error)}`}}),Rh=t=>({...Zr("Set",{fromUnknown:n=>{if(!(n instanceof globalThis.Set))return we({type:"Set",value:n,reason:{kind:"NotSet"}});let s=0;for(const a of n){const d=t.fromUnknown(a);if(!d.ok)return we({type:"Set",value:n,reason:{kind:"Element",index:s,error:d.error}});s++}return ue(n)},fromParent:n=>{let s=0;for(const a of n){const d=t.fromParent(a);if(!d.ok)return we({type:"Set",value:n,reason:{kind:"Element",index:s,error:d.error}});s++}return ue(n)}}),element:t}),Wh=t=>Xe(e=>{switch(e.reason.kind){case"NotSet":return`Expected a Set but received ${e.value}.`;case"Element":return`Invalid element at index ${e.reason.index}: ${t(e.reason.error)}`}}),Fo=(t,e)=>({...Zr("Record",{fromUnknown:s=>{if(!Pl(s))return we({type:"Record",value:s,reason:{kind:"NotRecord"}});const a={};for(const[d,g]of Object.entries(s)){const x=t.fromUnknown(d);if(!x.ok)return we({type:"Record",value:s,reason:{kind:"Key",key:d,error:x.error}});const N=e.fromUnknown(g);if(!N.ok)return we({type:"Record",value:s,reason:{kind:"Value",key:d,error:N.error}});a[x.value]=N.value}return ue(a)},fromParent:s=>{const a={};for(const[d,g]of Object.entries(s)){const x=t.fromParent(d);if(!x.ok)return we({type:"Record",value:s,reason:{kind:"Key",key:d,error:x.error}});const N=e.fromParent(g);if(!N.ok)return we({type:"Record",value:s,reason:{kind:"Value",key:x.value,error:N.error}});a[x.value]=N.value}return ue(a)}}),key:t,value:e}),Dh=t=>Xe(e=>{switch(e.reason.kind){case"NotRecord":return`Expected a record (plain object) but received ${e.value}.`;case"Key":return`Invalid key ${e.reason.key}: ${t(e.reason.error)}`;case"Value":return`Invalid value for key ${e.reason.key}: ${t(e.reason.error)}`}});function Ni(t,e){const r=Object.keys(t);return{...Zr("Object",{fromUnknown:a=>{if(!Pl(a))return we({type:"Object",value:a,reason:{kind:"NotObject"}});const d={},g={};for(const N of r){if(!(N in a)&&tc(t[N]))continue;const S=t[N].fromUnknown(a[N]);S.ok?g[N]=S.value:d[N]=S.error}const x=Object.keys(a).filter(N=>!r.includes(N));return x.length>0?we({type:"Object",value:a,reason:{kind:"ExtraKeys",extraKeys:x}}):Object.keys(d).length>0?we({type:"Object",value:a,reason:{kind:"Props",errors:d}}):ue(g)},fromParent:a=>{const d={},g={};for(const x of r){if(!(x in a)&&tc(t[x]))continue;const N=t[x].fromParent(a[x]);N.ok?g[x]=N.value:d[x]=N.error}return Object.keys(d).length>0?we({type:"Object",value:a,reason:{kind:"Props",errors:d}}):ue(g)}}),props:t}}const Xl=t=>Xe(e=>{switch(e.reason.kind){case"NotObject":return`Expected a plain object but received ${e.value}`;case"ExtraKeys":return`Unexpected extra keys: ${e.reason.extraKeys.join(", ")}`;case"Props":return`Invalid object properties:
${Object.entries(e.reason.errors).filter(([,n])=>n!==void 0).map(([n,s])=>`- ${n}: ${t(s)}`).join(`
`)}`}}),Mh=t=>Xe(e=>{switch(e.reason.kind){case"NotObject":return`Expected an object, but received ${e.value}.`;case"Props":return Xl(t)({type:"Object",value:e.value,reason:{kind:"Props",errors:e.reason.errors}});case"IndexKey":return`Invalid index key ${e.reason.key}: ${t(e.reason.error)}`;case"IndexValue":return`Invalid value at index key ${e.reason.key}: ${t(e.reason.error)}`}});function ws(...t){const e=t.map(n=>Ml(n)?n:Lh(n)),r=n=>{const s=[];for(const a of e){const d=a.fromUnknown(n);if(d.ok)return d;s.push(d.error)}return we({type:"Union",value:n,errors:s})};return{...Zr("Union",{fromUnknown:r,fromParent:r}),members:e}}const Uh=t=>Xe(e=>{const r=e.errors.map((n,s)=>`  ${s+1}. ${t(n)}`).join(`
`);return`Value ${e.value} does not match any member of the union.
Errors:
${r}`}),$h=t=>{let e;return{name:"Recursive",from:r=>(e??=t(),e.from(r)),fromUnknown:r=>(e??=t(),e.fromUnknown(r)),fromParent:r=>(e??=t(),e.fromParent(r)),is:r=>(e??=t(),e.is(r)),[To]:!0,getParentType:()=>(e??=t(),e)}},Yl=t=>ws(Co,t),Bh=t=>Xe(e=>{switch(e.reason.kind){case"InvalidLength":return`Expected a tuple of length ${e.reason.expected}, but received ${e.value}.`;case"Element":return`Invalid element at index ${e.reason.index}:
  ${t(e.reason.error)}`}}),jh=it("Int64",Ff,t=>t>=-9223372036854775808n&&t<=9223372036854775807n?ue(t):we({type:"Int64",value:t})),zh=Xe(t=>`The value ${t.value} is not a valid 64-bit signed integer (Int64).`);it("Int64",Ul,t=>Nn(()=>{const e=globalThis.BigInt(t);return jh.orThrow(e),t},()=>({type:"Int64String",value:t})));const Vh=Xe(t=>`The value ${t.value} is not a valid Int64 string.`),Zl=$h(()=>ws(Ct,Th,Io,Co,Qh,Hh)),Qh=Gl(Zl),Hh=Fo(Ct,Zl),Jh=t=>Nn(()=>JSON.parse(t),e=>({type:"Json",value:t,message:globalThis.String(e)})),Kh=it("Json",Ct,t=>{const e=Jh(t);return e.ok?ue(t):e}),Gh=Xe(t=>`Invalid JSON: ${t.value}. Error: ${t.message}`),ec=t=>JSON.parse(t),tc=t=>typeof t=="object"&&t!=null&&"name"in t&&t.name==="Optional",Xh=655360,Yh=Xe(t=>`The mutation size exceeds the maximum limit of ${Xh} bytes. The provided mutation has a size of ${kf(t.value).byteLength} bytes.`),Zh=t=>{const e=r=>{switch(r=r,r.type){case"String":return Lf(r);case"Number":return Pf(r);case"BigInt":return Rf(r);case"Boolean":return Wf(r);case"Undefined":return Df(r);case"Null":return Mf(r);case"Function":return Uf(r);case"Uint8Array":return $f(r);case"InstanceOf":return jf(r);case"EvoluType":return zf(r);case"CurrencyCode":return Vf(r);case"DateIso":return Qf(r);case"Trimmed":return Jf(r);case"MinLength":return Kf(r);case"MaxLength":return Gf(r);case"Length":return Xf(r);case"Mnemonic":return rh(r);case"Regex":return nh(r);case"Id":return ah(r);case"TableId":return ch(r);case"Positive":return fh(r);case"Negative":return hh(r);case"NonPositive":return ph(r);case"NonNegative":return mh(r);case"Int":return bh(r);case"GreaterThan":return Nh(r);case"LessThan":return vh(r);case"GreaterThanOrEqualTo":return qh(r);case"LessThanOrEqualTo":return Sh(r);case"NonNaN":return Eh(r);case"Finite":return Oh(r);case"MultipleOf":return Ih(r);case"Between":return Ch(r);case"Literal":return Ph(r);case"Int64":return zh(r);case"Int64String":return Vh(r);case"Json":return Gh(r);case"ValidMutationSize":return Yh(r);case"SimplePassword":return oh(e)(r);case"Array":return Fh(e)(r);case"Set":return Wh(e)(r);case"Record":return Dh(e)(r);case"Object":return Xl(e)(r);case"ObjectWithRecord":return Mh(e)(r);case"Union":return Uh(e)(r);case"Tuple":return Bh(e)(r);default:{const n=r;return`A value ${Dl(n.value)} is not valid for type ${n.type}.`}}};return e},Nr=(t,e,r=[])=>{if(t.type==="Array"){const n=t;return n.reason.kind==="NotArray"?[{message:e(t),path:r}]:Nr(n.reason.error,e,[...r,n.reason.index])}if(t.type==="Set"){const n=t;return n.reason.kind==="NotSet"?[{message:e(t),path:r}]:Nr(n.reason.error,e,[...r,n.reason.index])}if(t.type==="Object"){const n=t;if(n.reason.kind==="NotObject"||n.reason.kind==="ExtraKeys")return[{message:e(t),path:r}];const s=[];for(const[a,d]of Object.entries(n.reason.errors))s.push(...Nr(d,e,[...r,a]));return s}if(t.type==="ObjectWithRecord"){const n=t;if(n.reason.kind==="NotObject")return[{message:e(t),path:r}];if(n.reason.kind==="IndexKey"||n.reason.kind==="IndexValue")return Nr(n.reason.error,e,[...r,n.reason.key]);const s=[];for(const[a,d]of Object.entries(n.reason.errors))s.push(...Nr(d,e,[...r,a]));return s}if(t.type==="Record"){const n=t;return n.reason.kind==="NotRecord"?[{message:e(t),path:r}]:Nr(n.reason.error,e,[...r,n.reason.key])}if(t.type==="Tuple"){const n=t;return n.reason.kind==="InvalidLength"?[{message:e(t),path:r}]:Nr(n.reason.error,e,[...r,n.reason.index])}if(t.type==="Union")return t.errors.flatMap(s=>Nr(s,e,r));if(t.type==="Brand"){const n=t;return"parentError"in n?Nr(n.parentError,e,r):[{message:e(t),path:r}]}return[{message:e(t),path:r}]};let rc;class Ro extends Error{constructor(e){super(e),this.name=this.constructor.name,Error.captureStackTrace(this,this.constructor)}}const vr=t=>{let e=t?new globalThis.Uint8Array(t):new globalThis.Uint8Array(512),r=Qe.orThrow(t?t.length:0);return{getCapacity:()=>Qe.orThrow(e.length),getLength:()=>r,extend:s=>{const a=r+s.length;if(e.length<a){const d=e,g=Math.max(e.length*2,a);e=new globalThis.Uint8Array(g),e.set(d)}e.set(s,r),r=Qe.orThrow(r+s.length)},shift:()=>{if(r===0)throw new Ro("Buffer parse ended prematurely");const s=e[0];return e=e.subarray(1),r--,Qe.orThrow(s)},shiftN:s=>{if(r<s)throw new Ro("Buffer parse ended prematurely");const a=e.subarray(0,s);return e=e.subarray(s),r=Qe.orThrow(r-s),a},truncate:s=>{if(s>r)throw new Ro("Cannot truncate to a length greater than current");r=s},reset:()=>{r=Qe.orThrow(0)},unwrap:()=>e.subarray(0,r)}},ep=t=>{const e=new Map;return{has:r=>e.has(r),get:r=>{const n=e.get(r);if(n!==void 0)return e.delete(r),e.set(r,n),n},set:(r,n)=>{if(e.has(r))e.delete(r);else if(e.size===t){const s=e.keys().next().value;e.delete(s)}e.set(r,n)},delete:r=>{e.delete(r)},map:e}},tp=(t={})=>{const e={enabled:t.enableLogging??!1,log:(...r)=>{e.enabled&&console.log(...r)},info:(...r)=>{e.enabled&&console.info(...r)},warn:(...r)=>{e.enabled&&console.warn(...r)},error:(...r)=>{console.error(...r)},debug:(...r)=>{e.enabled&&console.debug(...r)},time:r=>{e.enabled&&console.time(r)},timeLog:(r,...n)=>{e.enabled&&console.timeLog(r,...n)},timeEnd:r=>{e.enabled&&console.timeEnd(r)},dir:(r,n)=>{e.enabled&&console.dir(r,n)},table:(r,n)=>{e.enabled&&console.table(r,n)},count:r=>{e.enabled&&console.count(r)},countReset:r=>{e.enabled&&console.countReset(r)},assert:(r,n,...s)=>{e.enabled&&console.assert(r,n,...s)},trace:(r,...n)=>{e.enabled&&console.trace(r,...n)}};return e},nc=t=>Uint8Array.from(t.split(""),e=>e.charCodeAt(0)),rp=nc("expand 16-byte k"),np=nc("expand 32-byte k"),ip=zr(rp),sp=zr(np);function De(t,e){return t<<e|t>>>32-e}function Wo(t){return t.byteOffset%4===0}const xs=64,op=16,ic=2**32-1,sc=Uint32Array.of();function ap(t,e,r,n,s,a,d,g){const x=s.length,N=new Uint8Array(xs),S=zr(N),w=Wo(s)&&Wo(a),I=w?zr(s):sc,j=w?zr(a):sc;for(let V=0;V<x;d++){if(t(e,r,n,S,d,g),d>=ic)throw new Error("arx: counter overflow");const Y=Math.min(xs,x-V);if(w&&Y===xs){const ge=V/4;if(V%4!==0)throw new Error("arx: invalid block position");for(let Ee=0,Ue;Ee<op;Ee++)Ue=ge+Ee,j[Ue]=I[Ue]^S[Ee];V+=xs;continue}for(let ge=0,Ee;ge<Y;ge++)Ee=V+ge,a[Ee]=s[Ee]^N[ge];V+=Y}}function lp(t,e){const{allowShortKeys:r,extendNonceFn:n,counterLength:s,counterRight:a,rounds:d}=pd({allowShortKeys:!1,counterLength:8,counterRight:!1,rounds:20},e);if(typeof t!="function")throw new Error("core must be a function");return ao(s),ao(d),oo(a),oo(r),(g,x,N,S,w=0)=>{Dt(g,void 0,"key"),Dt(x,void 0,"nonce"),Dt(N,void 0,"data");const I=N.length;if(S===void 0&&(S=new Uint8Array(I)),Dt(S,void 0,"output"),ao(w),w<0||w>=ic)throw new Error("arx: counter overflow");if(S.length<I)throw new Error(`arx: output (${S.length}) is shorter than data (${I})`);const j=[];let V=g.length,Y,ge;if(V===32)j.push(Y=Xi(g)),ge=sp;else if(V===16&&r)Y=new Uint8Array(32),Y.set(g),Y.set(g,16),ge=ip,j.push(Y);else throw Dt(g,32,"arx key"),new Error("invalid key size");Wo(x)||j.push(x=Xi(x));const Ee=zr(Y);if(n){if(x.length!==24)throw new Error("arx: extended nonce must be 24 bytes");n(ge,Ee,zr(x.subarray(0,16)),Ee),x=x.subarray(16)}const Ue=16-s;if(Ue!==x.length)throw new Error(`arx: nonce must be ${Ue} or 16 bytes`);if(Ue!==12){const Ie=new Uint8Array(12);Ie.set(x,a?0:12-x.length),x=Ie,j.push(x)}const Re=zr(x);return ap(t,ge,Ee,Re,N,S,w,d),Bn(...j),S}}function Mt(t,e){return t[e++]&255|(t[e++]&255)<<8}class cp{blockLen=16;outputLen=16;buffer=new Uint8Array(16);r=new Uint16Array(10);h=new Uint16Array(10);pad=new Uint16Array(8);pos=0;finished=!1;constructor(e){e=Xi(Dt(e,32,"key"));const r=Mt(e,0),n=Mt(e,2),s=Mt(e,4),a=Mt(e,6),d=Mt(e,8),g=Mt(e,10),x=Mt(e,12),N=Mt(e,14);this.r[0]=r&8191,this.r[1]=(r>>>13|n<<3)&8191,this.r[2]=(n>>>10|s<<6)&7939,this.r[3]=(s>>>7|a<<9)&8191,this.r[4]=(a>>>4|d<<12)&255,this.r[5]=d>>>1&8190,this.r[6]=(d>>>14|g<<2)&8191,this.r[7]=(g>>>11|x<<5)&8065,this.r[8]=(x>>>8|N<<8)&8191,this.r[9]=N>>>5&127;for(let S=0;S<8;S++)this.pad[S]=Mt(e,16+2*S)}process(e,r,n=!1){const s=n?0:2048,{h:a,r:d}=this,g=d[0],x=d[1],N=d[2],S=d[3],w=d[4],I=d[5],j=d[6],V=d[7],Y=d[8],ge=d[9],Ee=Mt(e,r+0),Ue=Mt(e,r+2),Re=Mt(e,r+4),Ie=Mt(e,r+6),ot=Mt(e,r+8),at=Mt(e,r+10),Ce=Mt(e,r+12),Be=Mt(e,r+14);let $e=a[0]+(Ee&8191),Ye=a[1]+((Ee>>>13|Ue<<3)&8191),rt=a[2]+((Ue>>>10|Re<<6)&8191),Ze=a[3]+((Re>>>7|Ie<<9)&8191),R=a[4]+((Ie>>>4|ot<<12)&8191),pe=a[5]+(ot>>>1&8191),oe=a[6]+((ot>>>14|at<<2)&8191),ne=a[7]+((at>>>11|Ce<<5)&8191),se=a[8]+((Ce>>>8|Be<<8)&8191),Oe=a[9]+(Be>>>5|s),he=0,Se=he+$e*g+Ye*(5*ge)+rt*(5*Y)+Ze*(5*V)+R*(5*j);he=Se>>>13,Se&=8191,Se+=pe*(5*I)+oe*(5*w)+ne*(5*S)+se*(5*N)+Oe*(5*x),he+=Se>>>13,Se&=8191;let je=he+$e*x+Ye*g+rt*(5*ge)+Ze*(5*Y)+R*(5*V);he=je>>>13,je&=8191,je+=pe*(5*j)+oe*(5*I)+ne*(5*w)+se*(5*S)+Oe*(5*N),he+=je>>>13,je&=8191;let ze=he+$e*N+Ye*x+rt*g+Ze*(5*ge)+R*(5*Y);he=ze>>>13,ze&=8191,ze+=pe*(5*V)+oe*(5*j)+ne*(5*I)+se*(5*w)+Oe*(5*S),he+=ze>>>13,ze&=8191;let Et=he+$e*S+Ye*N+rt*x+Ze*g+R*(5*ge);he=Et>>>13,Et&=8191,Et+=pe*(5*Y)+oe*(5*V)+ne*(5*j)+se*(5*I)+Oe*(5*w),he+=Et>>>13,Et&=8191;let $t=he+$e*w+Ye*S+rt*N+Ze*x+R*g;he=$t>>>13,$t&=8191,$t+=pe*(5*ge)+oe*(5*Y)+ne*(5*V)+se*(5*j)+Oe*(5*I),he+=$t>>>13,$t&=8191;let Gt=he+$e*I+Ye*w+rt*S+Ze*N+R*x;he=Gt>>>13,Gt&=8191,Gt+=pe*g+oe*(5*ge)+ne*(5*Y)+se*(5*V)+Oe*(5*j),he+=Gt>>>13,Gt&=8191;let gn=he+$e*j+Ye*I+rt*w+Ze*S+R*N;he=gn>>>13,gn&=8191,gn+=pe*x+oe*g+ne*(5*ge)+se*(5*Y)+Oe*(5*V),he+=gn>>>13,gn&=8191;let yn=he+$e*V+Ye*j+rt*I+Ze*w+R*S;he=yn>>>13,yn&=8191,yn+=pe*N+oe*x+ne*g+se*(5*ge)+Oe*(5*Y),he+=yn>>>13,yn&=8191;let bn=he+$e*Y+Ye*V+rt*j+Ze*I+R*w;he=bn>>>13,bn&=8191,bn+=pe*S+oe*N+ne*x+se*g+Oe*(5*ge),he+=bn>>>13,bn&=8191;let wn=he+$e*ge+Ye*Y+rt*V+Ze*j+R*I;he=wn>>>13,wn&=8191,wn+=pe*w+oe*S+ne*N+se*x+Oe*g,he+=wn>>>13,wn&=8191,he=(he<<2)+he|0,he=he+Se|0,Se=he&8191,he=he>>>13,je+=he,a[0]=Se,a[1]=je,a[2]=ze,a[3]=Et,a[4]=$t,a[5]=Gt,a[6]=gn,a[7]=yn,a[8]=bn,a[9]=wn}finalize(){const{h:e,pad:r}=this,n=new Uint16Array(10);let s=e[1]>>>13;e[1]&=8191;for(let g=2;g<10;g++)e[g]+=s,s=e[g]>>>13,e[g]&=8191;e[0]+=s*5,s=e[0]>>>13,e[0]&=8191,e[1]+=s,s=e[1]>>>13,e[1]&=8191,e[2]+=s,n[0]=e[0]+5,s=n[0]>>>13,n[0]&=8191;for(let g=1;g<10;g++)n[g]=e[g]+s,s=n[g]>>>13,n[g]&=8191;n[9]-=8192;let a=(s^1)-1;for(let g=0;g<10;g++)n[g]&=a;a=~a;for(let g=0;g<10;g++)e[g]=e[g]&a|n[g];e[0]=(e[0]|e[1]<<13)&65535,e[1]=(e[1]>>>3|e[2]<<10)&65535,e[2]=(e[2]>>>6|e[3]<<7)&65535,e[3]=(e[3]>>>9|e[4]<<4)&65535,e[4]=(e[4]>>>12|e[5]<<1|e[6]<<14)&65535,e[5]=(e[6]>>>2|e[7]<<11)&65535,e[6]=(e[7]>>>5|e[8]<<8)&65535,e[7]=(e[8]>>>8|e[9]<<5)&65535;let d=e[0]+r[0];e[0]=d&65535;for(let g=1;g<8;g++)d=(e[g]+r[g]|0)+(d>>>16)|0,e[g]=d&65535;Bn(n)}update(e){Ba(this),Dt(e),e=Xi(e);const{buffer:r,blockLen:n}=this,s=e.length;for(let a=0;a<s;){const d=Math.min(n-this.pos,s-a);if(d===n){for(;n<=s-a;a+=n)this.process(e,a);continue}r.set(e.subarray(a,a+d),this.pos),this.pos+=d,a+=d,this.pos===n&&(this.process(r,0,!1),this.pos=0)}return this}destroy(){Bn(this.h,this.r,this.buffer,this.pad)}digestInto(e){Ba(this),ad(e,this),this.finished=!0;const{buffer:r,h:n}=this;let{pos:s}=this;if(s){for(r[s++]=1;s<16;s++)r[s]=0;this.process(r,0,!0)}this.finalize();let a=0;for(let d=0;d<8;d++)e[a++]=n[d]>>>0,e[a++]=n[d]>>>8;return e}digest(){const{buffer:e,outputLen:r}=this;this.digestInto(e);const n=e.slice(0,r);return this.destroy(),n}}function up(t){const e=(n,s)=>t(s).update(n).digest(),r=t(new Uint8Array(32));return e.outputLen=r.outputLen,e.blockLen=r.blockLen,e.create=n=>t(n),e}const dp=up(t=>new cp(t));function fp(t,e,r,n,s,a=20){let d=t[0],g=t[1],x=t[2],N=t[3],S=e[0],w=e[1],I=e[2],j=e[3],V=e[4],Y=e[5],ge=e[6],Ee=e[7],Ue=s,Re=r[0],Ie=r[1],ot=r[2],at=d,Ce=g,Be=x,$e=N,Ye=S,rt=w,Ze=I,R=j,pe=V,oe=Y,ne=ge,se=Ee,Oe=Ue,he=Re,Se=Ie,je=ot;for(let Et=0;Et<a;Et+=2)at=at+Ye|0,Oe=De(Oe^at,16),pe=pe+Oe|0,Ye=De(Ye^pe,12),at=at+Ye|0,Oe=De(Oe^at,8),pe=pe+Oe|0,Ye=De(Ye^pe,7),Ce=Ce+rt|0,he=De(he^Ce,16),oe=oe+he|0,rt=De(rt^oe,12),Ce=Ce+rt|0,he=De(he^Ce,8),oe=oe+he|0,rt=De(rt^oe,7),Be=Be+Ze|0,Se=De(Se^Be,16),ne=ne+Se|0,Ze=De(Ze^ne,12),Be=Be+Ze|0,Se=De(Se^Be,8),ne=ne+Se|0,Ze=De(Ze^ne,7),$e=$e+R|0,je=De(je^$e,16),se=se+je|0,R=De(R^se,12),$e=$e+R|0,je=De(je^$e,8),se=se+je|0,R=De(R^se,7),at=at+rt|0,je=De(je^at,16),ne=ne+je|0,rt=De(rt^ne,12),at=at+rt|0,je=De(je^at,8),ne=ne+je|0,rt=De(rt^ne,7),Ce=Ce+Ze|0,Oe=De(Oe^Ce,16),se=se+Oe|0,Ze=De(Ze^se,12),Ce=Ce+Ze|0,Oe=De(Oe^Ce,8),se=se+Oe|0,Ze=De(Ze^se,7),Be=Be+R|0,he=De(he^Be,16),pe=pe+he|0,R=De(R^pe,12),Be=Be+R|0,he=De(he^Be,8),pe=pe+he|0,R=De(R^pe,7),$e=$e+Ye|0,Se=De(Se^$e,16),oe=oe+Se|0,Ye=De(Ye^oe,12),$e=$e+Ye|0,Se=De(Se^$e,8),oe=oe+Se|0,Ye=De(Ye^oe,7);let ze=0;n[ze++]=d+at|0,n[ze++]=g+Ce|0,n[ze++]=x+Be|0,n[ze++]=N+$e|0,n[ze++]=S+Ye|0,n[ze++]=w+rt|0,n[ze++]=I+Ze|0,n[ze++]=j+R|0,n[ze++]=V+pe|0,n[ze++]=Y+oe|0,n[ze++]=ge+ne|0,n[ze++]=Ee+se|0,n[ze++]=Ue+Oe|0,n[ze++]=Re+he|0,n[ze++]=Ie+Se|0,n[ze++]=ot+je|0}function hp(t,e,r,n){let s=t[0],a=t[1],d=t[2],g=t[3],x=e[0],N=e[1],S=e[2],w=e[3],I=e[4],j=e[5],V=e[6],Y=e[7],ge=r[0],Ee=r[1],Ue=r[2],Re=r[3];for(let ot=0;ot<20;ot+=2)s=s+x|0,ge=De(ge^s,16),I=I+ge|0,x=De(x^I,12),s=s+x|0,ge=De(ge^s,8),I=I+ge|0,x=De(x^I,7),a=a+N|0,Ee=De(Ee^a,16),j=j+Ee|0,N=De(N^j,12),a=a+N|0,Ee=De(Ee^a,8),j=j+Ee|0,N=De(N^j,7),d=d+S|0,Ue=De(Ue^d,16),V=V+Ue|0,S=De(S^V,12),d=d+S|0,Ue=De(Ue^d,8),V=V+Ue|0,S=De(S^V,7),g=g+w|0,Re=De(Re^g,16),Y=Y+Re|0,w=De(w^Y,12),g=g+w|0,Re=De(Re^g,8),Y=Y+Re|0,w=De(w^Y,7),s=s+N|0,Re=De(Re^s,16),V=V+Re|0,N=De(N^V,12),s=s+N|0,Re=De(Re^s,8),V=V+Re|0,N=De(N^V,7),a=a+S|0,ge=De(ge^a,16),Y=Y+ge|0,S=De(S^Y,12),a=a+S|0,ge=De(ge^a,8),Y=Y+ge|0,S=De(S^Y,7),d=d+w|0,Ee=De(Ee^d,16),I=I+Ee|0,w=De(w^I,12),d=d+w|0,Ee=De(Ee^d,8),I=I+Ee|0,w=De(w^I,7),g=g+x|0,Ue=De(Ue^g,16),j=j+Ue|0,x=De(x^j,12),g=g+x|0,Ue=De(Ue^g,8),j=j+Ue|0,x=De(x^j,7);let Ie=0;n[Ie++]=s,n[Ie++]=a,n[Ie++]=d,n[Ie++]=g,n[Ie++]=ge,n[Ie++]=Ee,n[Ie++]=Ue,n[Ie++]=Re}const pp=lp(fp,{counterRight:!1,counterLength:8,extendNonceFn:hp,allowShortKeys:!1}),mp=new Uint8Array(16),oc=(t,e)=>{t.update(e);const r=e.length%16;r&&t.update(mp.subarray(r))},_p=new Uint8Array(32);function ac(t,e,r,n,s){s!==void 0&&Dt(s,void 0,"AAD");const a=t(e,r,_p),d=gd(n.length,s?s.length:0,!0),g=dp.create(a);s&&oc(g,s),oc(g,n),g.update(d);const x=g.digest();return Bn(a,d),x}const lc=_d({blockSize:64,nonceLength:24,tagLength:16},(t=>(e,r,n)=>({encrypt(a,d){const g=a.length;d=Qa(g+16,d,!1),d.set(a);const x=d.subarray(0,-16);t(e,r,x,x,1);const N=ac(t,e,r,x,n);return d.set(N,g),Bn(N),d},decrypt(a,d){d=Qa(a.length-16,d,!1);const g=a.subarray(0,-16),x=a.subarray(-16),N=ac(t,e,r,g,n);if(!md(x,N))throw new Error("invalid tag");return d.set(a.subarray(0,-16)),t(e,r,d,d,1),Bn(N),d}}))(pp));class cc{oHash;iHash;blockLen;outputLen;finished=!1;destroyed=!1;constructor(e,r){if(wd(e),Yi(r,void 0,"key"),this.iHash=e.create(),typeof this.iHash.update!="function")throw new Error("Expected instance of class which extends utils.Hash");this.blockLen=this.iHash.blockLen,this.outputLen=this.iHash.outputLen;const n=this.blockLen,s=new Uint8Array(n);s.set(r.length>n?e.create().update(r).digest():r);for(let a=0;a<s.length;a++)s[a]^=54;this.iHash.update(s),this.oHash=e.create();for(let a=0;a<s.length;a++)s[a]^=106;this.oHash.update(s),jn(s)}update(e){return Zi(this),this.iHash.update(e),this}digestInto(e){Zi(this),Yi(e,this.outputLen,"output"),this.finished=!0,this.iHash.digestInto(e),this.oHash.update(e),this.oHash.digestInto(e),this.destroy()}digest(){const e=new Uint8Array(this.oHash.outputLen);return this.digestInto(e),e}_cloneInto(e){e||=Object.create(Object.getPrototypeOf(this),{});const{oHash:r,iHash:n,finished:s,destroyed:a,blockLen:d,outputLen:g}=this;return e=e,e.finished=s,e.destroyed=a,e.blockLen=d,e.outputLen=g,e.oHash=r._cloneInto(e.oHash),e.iHash=n._cloneInto(e.iHash),e}clone(){return this._cloneInto()}destroy(){this.destroyed=!0,this.oHash.destroy(),this.iHash.destroy()}}const Do=(t,e,r)=>new cc(t,e).update(r).digest();Do.create=(t,e)=>new cc(t,e);const Mo=it("Entropy",hs),gp=ms(16)(Mo),uc=ms(32)(Mo);ms(64)(Mo);const dc=()=>({create:Nd}),Uo=(t,e)=>{let r=Do(rl,Ja("Symmetric key seed"),t);for(const n of e){const s=typeof n=="number"?n.toString():n;r=yp(s,r)}return r.slice(32,64)},yp=(t,e)=>{const r=Ja(t),n=new globalThis.Uint8Array(r.byteLength+1);return n[0]=0,n.set(r,1),Do(rl,e.slice(0,32),n)},bp=it("EncryptionKey",uc),wp=t=>{const e=Qe.orThrow(24);return{nonceLength:e,encrypt:(n,s)=>{const a=t.randomBytes.create(e),d=lc(s,a).encrypt(n);return{nonce:a,ciphertext:d}},decrypt:(n,s,a)=>Nn(()=>lc(s,a).decrypt(n),d=>({type:"SymmetricCryptoDecryptError",error:d}))}},xp=t=>{if(t<=0)return Qe.orThrow(0);const e=31-Math.clz32(t>>>0),r=32-Math.clz32(e>>>0),s=(1<<Math.max(0,e-r))-1;return Qe.orThrow(t+s&~s)},Np=t=>{const e=xp(t),r=Qe.orThrow(e-t);return new globalThis.Uint8Array(r)},fc=(t,e)=>t===e,vp=fc,$o=fc,hc=(t=>(e,r)=>{if(e===r)return!0;if(e.length!==r.length)return!1;for(let n=0;n<e.length;n++)if(!t(e[n],r[n]))return!1;return!0})($o),qp=t=>(e,r)=>{if(e===r)return!0;for(const n in t)if(!t[n](e[n],r[n]))return!1;return!0},Kn=t=>{const e=r=>Object.getOwnPropertyNames(r).reduce((s,a)=>{const d=r[a];return a==="cause"&&d instanceof Error?s[a]=e(d):typeof d!="function"&&(s[a]=d),s},{});if(t instanceof Error)return{type:"TransferableError",error:e(t)};try{return{type:"TransferableError",error:structuredClone(t)}}catch{try{return{type:"TransferableError",error:String(t)}}catch{return{type:"TransferableError",error:"[Unserializable Object]"}}}};function T0(t){return t}const Sp=()=>!0,pc=()=>!1,kp=ws(Co,Ct,vn,hs),Ep=(t,e)=>t instanceof globalThis.Uint8Array&&e instanceof globalThis.Uint8Array?hc(t,e):t===e,Ap=t=>async(e,r)=>Cf(async()=>{const n=await t.createSqliteDriver(e,r);let s=!1;const a=()=>Nn(()=>{t.console?.log("[sql] rollback"),n.exec(Le`rollback;`,!0)},Bo);return{exec:g=>Nn(()=>{t.console?.log("[sql]",{query:g});const x=Op(g,()=>n.exec(g,Ip(g.sql)));return t.console?.log("[sql]",{result:x}),x},x=>({type:"SqliteError",error:Kn(x)})),transaction:g=>{const x=Nn(()=>{t.console?.log("[sql] begin"),n.exec(Le`begin;`,!0);const N=g();return N.ok&&(t.console?.log("[sql] commit"),n.exec(Le`commit;`,!0)),N},Bo);if(!x.ok){const N=a();return N.ok?x:(t.console?.log("[sql] rollback failed",N.error),we({type:"SqliteError",error:x.error.error,rollbackError:N.error.error}))}if(!x.value.ok){const N=a();return N.ok?x.value:(t.console?.log("[sql] rollback failed",N.error),we({type:"SqliteError",error:Kn(x.value.error),rollbackError:N.error.error}))}return ue(x.value.value)},export:()=>Nn(()=>n.export(),g=>({type:"SqliteError",error:Kn(g)})),[Symbol.dispose]:()=>{s||(s=!0,n[Symbol.dispose]())}}},Bo),Bo=t=>({type:"SqliteError",error:Kn(t)}),Op=(t,e)=>{if(!t.options?.logQueryExecutionTime)return e();const r=performance.now(),n=e(),s=performance.now()-r;return console.log(`SqliteQueryExecutionTime: ${s.toString()}ms`,t),n},Tp=(t,e)=>{let r=!1;const n=new Map;return{get:(s,a)=>{if(a!==!0&&!s.options?.prepare)return null;let d=n.get(s.sql);return d||(d=t(s.sql),n.set(s.sql,d)),d},[Symbol.dispose]:()=>{r||(r=!0,n.forEach(e),n.clear())}}},Le=(t,...e)=>{let r="";const n=[];for(let s=0;s<t.length;s++)if(r+=t[s],s<e.length){const a=e[s];typeof a=="object"&&a!=null&&"type"in a?r+=a.sql:(r+="?",n.push(a))}return{sql:r,parameters:n}};Le.identifier=t=>({type:"SqlIdentifier",sql:`"${t.replace(/"/g,'""')}"`}),Le.raw=t=>({type:"RawSql",sql:t}),Le.prepared=(t,...e)=>({...Le(t,...e),options:{prepare:!0}});const Ip=t=>{const e=mc.get(t);if(e!==void 0)return e;const r=Cp.test(Lp(t));return mc.set(t,r),r},mc=ep(Xt.orThrow(1e4)),Cp=new RegExp(`\\b(${["alter","create","delete","drop","insert","replace","update","begin","commit","rollback","pragma","vacuum"].join("|")})\\b`,"i"),Lp=t=>{if(!t.includes("--"))return t;let e="",r=0;for(;r<t.length;)if(r<t.length-1&&t[r]==="-"&&t[r+1]==="-"){for(r+=2;r<t.length&&t[r]!==`
`;)r++;r<t.length&&t[r]===`
`&&(e+=`
`,r++)}else e+=t[r],r++;return e},Pp=t=>e=>{const r=t.sqlite.exec({...e,sql:`EXPLAIN QUERY PLAN ${e.sql}`});return r.ok?(console.log("[explainSqliteQueryPlan]",e),console.log(Fp(r.value.rows)),ue()):r},Fp=t=>t.map(e=>{let r=e.parent,n=0;do{const s=t.find(a=>a.id===r);if(!s)break;r=s.parent,n++}while(!0);return`${"  ".repeat(n)}${e.detail}`}).join(`
`),_c=ws(0,1),gc=1,Rp=0,Wp=t=>t?gc:Rp,Dp=t=>t===gc,Mp=({init:t,onMessage:e})=>{let r=null,n=null;const s=[];let a=!1;const d=S=>{Qt(r!=null,"The onMessage wasn't set"),r(S)},g=S=>{d({type:"onError",error:Kn(S)})},x=S=>(...w)=>{try{S(...w)}catch(I){g(I)}};return{postMessage:S=>{if(S.type!=="init"){n?x(e(n))(S):s.push(S);return}a||(a=!0,t(S,d,x).then(w=>{if(w!=null){n=w;for(const I of s)x(e(n))(I);s.length=0}}).catch(g))},onMessage:S=>{r=S}}},Up=({init:t,handlers:e})=>Mp({init:t,onMessage:r=>n=>{const s=n.type,a=e[s];a(r)(n)}}),$p=it("OwnerId",Po),Bp=it("OwnerIdBytes",uh),Ns=t=>gs(t),vs=t=>ys(t);Qe.orThrow(16);const jp=it("OwnerEncryptionKey",bp),zp=it("OwnerWriteKey",gp);it("OwnerSecret",uc);const Vp=t=>t.randomBytes.create(32),Qp=t=>df(t,go),Hp=t=>cl(t,go),Jp=t=>({id:vs(Bp.orThrow(Uo(t,["Evolu","OwnerIdBytes"]).slice(0,16))),encryptionKey:jp.orThrow(Uo(t,["Evolu","OwnerEncryptionKey"])),writeKey:zp.orThrow(Uo(t,["Evolu","OwnerWriteKey"]).slice(0,16))}),yc=t=>({...Jp(t),type:"AppOwner",mnemonic:Qp(t)}),Kp=t=>t+1,Gp=t=>t-1,Xp=(t,e=Xt.orThrow(16),r=Xt.orThrow(2))=>{const n=e*r;if(t<n)return we(Xt.orThrow(n));const s=[],a=Math.floor(t/e),d=t%e;let g=0;for(let x=0;x<e;x++){const N=x<d,S=a+(N?1:0);g+=S,s.push(Xt.orThrow(g))}return so(s),ue(s)};function tn(t){return typeof t>"u"||t===void 0}function zt(t){return typeof t=="string"}function qs(t){return typeof t=="number"}function Ss(t){return typeof t=="boolean"}function jo(t){return t===null}function Yp(t){return t instanceof Date}function zo(t){return typeof t=="bigint"}function Yt(t){return typeof t=="function"}function fr(t){return typeof t=="object"&&t!==null}function p(t){return Object.freeze(t)}function ks(t){return Lr(t)?t:[t]}function Lr(t){return Array.isArray(t)}function Zt(t){return t}const lt=p({is(t){return t.kind==="AlterTableNode"},create(t){return p({kind:"AlterTableNode",table:t})},cloneWithTableProps(t,e){return p({...t,...e})},cloneWithColumnAlteration(t,e){return p({...t,columnAlterations:t.columnAlterations?[...t.columnAlterations,e]:[e]})}}),_t=p({is(t){return t.kind==="IdentifierNode"},create(t){return p({kind:"IdentifierNode",name:t})}}),Pr=p({is(t){return t.kind==="CreateIndexNode"},create(t){return p({kind:"CreateIndexNode",name:_t.create(t)})},cloneWith(t,e){return p({...t,...e})},cloneWithColumns(t,e){return p({...t,columns:[...t.columns||[],...e]})}}),bc=p({is(t){return t.kind==="CreateSchemaNode"},create(t,e){return p({kind:"CreateSchemaNode",schema:_t.create(t),...e})},cloneWith(t,e){return p({...t,...e})}}),Zp=["preserve rows","delete rows","drop"],er=p({is(t){return t.kind==="CreateTableNode"},create(t){return p({kind:"CreateTableNode",table:t,columns:p([])})},cloneWithColumn(t,e){return p({...t,columns:p([...t.columns,e])})},cloneWithConstraint(t,e){return p({...t,constraints:t.constraints?p([...t.constraints,e]):p([e])})},cloneWithFrontModifier(t,e){return p({...t,frontModifiers:t.frontModifiers?p([...t.frontModifiers,e]):p([e])})},cloneWithEndModifier(t,e){return p({...t,endModifiers:t.endModifiers?p([...t.endModifiers,e]):p([e])})},cloneWith(t,e){return p({...t,...e})}}),Fr=p({is(t){return t.kind==="SchemableIdentifierNode"},create(t){return p({kind:"SchemableIdentifierNode",identifier:_t.create(t)})},createWithSchema(t,e){return p({kind:"SchemableIdentifierNode",schema:_t.create(t),identifier:_t.create(e)})}}),vi=p({is(t){return t.kind==="DropIndexNode"},create(t,e){return p({kind:"DropIndexNode",name:Fr.create(t),...e})},cloneWith(t,e){return p({...t,...e})}}),Vo=p({is(t){return t.kind==="DropSchemaNode"},create(t,e){return p({kind:"DropSchemaNode",schema:_t.create(t),...e})},cloneWith(t,e){return p({...t,...e})}}),Qo=p({is(t){return t.kind==="DropTableNode"},create(t,e){return p({kind:"DropTableNode",table:t,...e})},cloneWith(t,e){return p({...t,...e})}}),rn=p({is(t){return t.kind==="AliasNode"},create(t,e){return p({kind:"AliasNode",node:t,alias:e})}}),qr=p({is(t){return t.kind==="TableNode"},create(t){return p({kind:"TableNode",table:Fr.create(t)})},createWithSchema(t,e){return p({kind:"TableNode",table:Fr.createWithSchema(t,e)})}});function tr(t){return fr(t)&&Yt(t.toOperationNode)}function wc(t){return fr(t)&&"expressionType"in t&&tr(t)}function em(t){return fr(t)&&"expression"in t&&zt(t.alias)&&tr(t)}const Rr=p({is(t){return t.kind==="SelectModifierNode"},create(t,e){return p({kind:"SelectModifierNode",modifier:t,of:e})},createWithExpression(t){return p({kind:"SelectModifierNode",rawModifier:t})}}),nn=p({is(t){return t.kind==="AndNode"},create(t,e){return p({kind:"AndNode",left:t,right:e})}}),Gn=p({is(t){return t.kind==="OrNode"},create(t,e){return p({kind:"OrNode",left:t,right:e})}}),Ho=p({is(t){return t.kind==="OnNode"},create(t){return p({kind:"OnNode",on:t})},cloneWithOperation(t,e,r){return p({...t,on:e==="And"?nn.create(t.on,r):Gn.create(t.on,r)})}}),Sn=p({is(t){return t.kind==="JoinNode"},create(t,e){return p({kind:"JoinNode",joinType:t,table:e,on:void 0})},createWithOn(t,e,r){return p({kind:"JoinNode",joinType:t,table:e,on:Ho.create(r)})},cloneWithOn(t,e){return p({...t,on:t.on?Ho.cloneWithOperation(t.on,"And",e):Ho.create(e)})}}),Xn=p({is(t){return t.kind==="BinaryOperationNode"},create(t,e,r){return p({kind:"BinaryOperationNode",leftOperand:t,operator:e,rightOperand:r})}}),tm=["=","==","!=","<>",">",">=","<","<=","in","not in","is","is not","like","not like","match","ilike","not ilike","@>","<@","^@","&&","?","?&","?|","!<","!>","<=>","!~","~","~*","!~*","@@","@@@","!!","<->","regexp","is distinct from","is not distinct from"],rm=["+","-","*","/","%","^","&","|","#","<<",">>"],xc=["->","->>"],nm=[...tm,...rm,"&&","||"],im=["not","-",...["exists","not exists"]],sm=[...nm,...xc,...im,"between","between symmetric"],sn=p({is(t){return t.kind==="OperatorNode"},create(t){return p({kind:"OperatorNode",operator:t})}});function Nc(t){return zt(t)&&xc.includes(t)}const Ot=p({is(t){return t.kind==="ColumnNode"},create(t){return p({kind:"ColumnNode",column:_t.create(t)})}}),Jo=p({is(t){return t.kind==="SelectAllNode"},create(){return p({kind:"SelectAllNode"})}}),Es=p({is(t){return t.kind==="ReferenceNode"},create(t,e){return p({kind:"ReferenceNode",table:e,column:t})},createSelectAll(t){return p({kind:"ReferenceNode",table:t,column:Jo.create()})}});class om{#e;get dynamicReference(){return this.#e}get refType(){}constructor(e){this.#e=e}toOperationNode(){return Ac(this.#e)}}function vc(t){return fr(t)&&tr(t)&&zt(t.dynamicReference)}const Wr=p({is(t){return t.kind==="OrderByItemNode"},create(t,e){return p({kind:"OrderByItemNode",orderBy:t,direction:e})},cloneWith(t,e){return p({...t,...e})}}),rr=p({is(t){return t.kind==="RawNode"},create(t,e){return p({kind:"RawNode",sqlFragments:p(t),parameters:p(e)})},createWithSql(t){return rr.create([t],[])},createWithChild(t){return rr.create(["",""],[t])},createWithChildren(t){return rr.create(new Array(t.length+1).fill(""),t)}}),am=p({is(t){return t.kind==="CollateNode"},create(t){return p({kind:"CollateNode",collation:_t.create(t)})}});class kn{#e;constructor(e){this.#e=p(e)}desc(){return new kn({node:Wr.cloneWith(this.#e.node,{direction:rr.createWithSql("desc")})})}asc(){return new kn({node:Wr.cloneWith(this.#e.node,{direction:rr.createWithSql("asc")})})}nullsLast(){return new kn({node:Wr.cloneWith(this.#e.node,{nulls:"last"})})}nullsFirst(){return new kn({node:Wr.cloneWith(this.#e.node,{nulls:"first"})})}collate(e){return new kn({node:Wr.cloneWith(this.#e.node,{collation:am.create(e)})})}toOperationNode(){return this.#e.node}}const qc=new Set;function Yn(t){qc.has(t)||(qc.add(t),console.log(t))}function Sc(t){return t==="asc"||t==="desc"}function En(t){if(t.length===2)return[Ko(t[0],t[1])];if(t.length===1){const[e]=t;return Array.isArray(e)?(Yn("orderBy(array) is deprecated, use multiple orderBy calls instead."),e.map(r=>Ko(r))):[Ko(e)]}throw new Error(`Invalid number of arguments at order by! expected 1-2, received ${t.length}`)}function Ko(t,e){const r=lm(t);if(Wr.is(r)){if(e)throw new Error("Cannot specify direction twice!");return r}return kc(r,e)}function lm(t){if(Fi(t))return Tn(t);if(vc(t))return t.toOperationNode();const[e,r]=t.split(" ");return r?(Yn("`orderBy('column asc')` is deprecated. Use `orderBy('column', 'asc')` instead."),kc(on(e),r)):on(t)}function kc(t,e){if(typeof e=="string"){if(!Sc(e))throw new Error(`Invalid order by direction: ${e}`);return Wr.create(t,rr.createWithSql(e))}if(wc(e))return Yn("`orderBy(..., expr)` is deprecated. Use `orderBy(..., 'asc')` or `orderBy(..., (ob) => ...)` instead."),Wr.create(t,e.toOperationNode());const r=Wr.create(t);return e?e(new kn({node:r})).toOperationNode():r}const As=p({is(t){return t.kind==="JSONReferenceNode"},create(t,e){return p({kind:"JSONReferenceNode",reference:t,traversal:e})},cloneWithTraversal(t,e){return p({...t,traversal:e})}}),Ec=p({is(t){return t.kind==="JSONOperatorChainNode"},create(t){return p({kind:"JSONOperatorChainNode",operator:t,values:p([])})},cloneWithValue(t,e){return p({...t,values:p([...t.values,e])})}}),qi=p({is(t){return t.kind==="JSONPathNode"},create(t){return p({kind:"JSONPathNode",inOperator:t,pathLegs:p([])})},cloneWithLeg(t,e){return p({...t,pathLegs:p([...t.pathLegs,e])})}});function Ac(t){return zt(t)?on(t):t.toOperationNode()}function Si(t){return Lr(t)?t.map(e=>nr(e)):[nr(t)]}function nr(t){return Fi(t)?Tn(t):Ac(t)}function cm(t,e){const r=on(t);if(Nc(e))return As.create(r,Ec.create(sn.create(e)));const n=e.slice(0,-1);if(Nc(n))return As.create(r,qi.create(sn.create(n)));throw new Error(`Invalid JSON operator: ${e}`)}function on(t){if(!t.includes("."))return Es.create(Ot.create(t));const r=t.split(".").map(Go);if(r.length===3)return dm(r);if(r.length===2)return fm(r);throw new Error(`invalid column reference ${t}`)}function um(t){const e=" as ";if(t.includes(e)){const[r,n]=t.split(e).map(Go);return rn.create(on(r),_t.create(n))}else return on(t)}function Oc(t){return Ot.create(t)}function Os(t){if(t.includes(" ")){const[r,n]=t.split(" ").map(Go);if(!Sc(n))throw new Error(`invalid order direction "${n}" next to "${r}"`);return En([r,n])[0]}else return Oc(t)}function dm(t){const[e,r,n]=t;return Es.create(Ot.create(n),qr.createWithSchema(e,r))}function fm(t){const[e,r]=t;return Es.create(Ot.create(r),qr.create(e))}function Go(t){return t.trim()}const Tc=p({is(t){return t.kind==="PrimitiveValueListNode"},create(t){return p({kind:"PrimitiveValueListNode",values:p([...t])})}}),Ts=p({is(t){return t.kind==="ValueListNode"},create(t){return p({kind:"ValueListNode",values:p(t)})}}),hr=p({is(t){return t.kind==="ValueNode"},create(t){return p({kind:"ValueNode",value:t})},createImmediate(t){return p({kind:"ValueNode",value:t,immediate:!0})}});function hm(t){return Lr(t)?pm(t):Rt(t)}function Rt(t){return Fi(t)?Tn(t):hr.create(t)}function Xo(t){return qs(t)||Ss(t)||jo(t)}function Yo(t){if(!Xo(t))throw new Error(`unsafe immediate value ${JSON.stringify(t)}`);return hr.createImmediate(t)}function pm(t){return t.some(Fi)?Ts.create(t.map(e=>Rt(e))):Tc.create(t)}const Dr=p({is(t){return t.kind==="ParensNode"},create(t){return p({kind:"ParensNode",node:t})}});function Ut(t){if(t.length===3)return Zo(t[0],t[1],t[2]);if(t.length===1)return Rt(t[0]);throw new Error(`invalid arguments: ${JSON.stringify(t)}`)}function Zo(t,e,r){return mm(e)&&Cc(r)?Xn.create(nr(t),ea(e),hr.createImmediate(r)):Xn.create(nr(t),ea(e),hm(r))}function Sr(t,e,r){return Xn.create(nr(t),ea(e),nr(r))}function Ic(t,e){return Is(Object.entries(t).filter(([,r])=>!tn(r)).map(([r,n])=>Zo(r,Cc(n)?"is":"=",n)),e)}function Is(t,e,r=!0){const n=e==="and"?nn.create:Gn.create;if(t.length===0)return Xn.create(hr.createImmediate(1),sn.create("="),hr.createImmediate(e==="and"?1:0));let s=Lc(t[0]);for(let a=1;a<t.length;++a)s=n(s,Lc(t[a]));return t.length>1&&r?Dr.create(s):s}function mm(t){return t==="is"||t==="is not"}function Cc(t){return jo(t)||Ss(t)}function ea(t){if(zt(t)&&sm.includes(t))return sn.create(t);if(tr(t))return t.toOperationNode();throw new Error(`invalid operator ${JSON.stringify(t)}`)}function Lc(t){return tr(t)?t.toOperationNode():t}const Zn=p({is(t){return t.kind==="OrderByNode"},create(t){return p({kind:"OrderByNode",items:p([...t])})},cloneWithItems(t,e){return p({...t,items:p([...t.items,...e])})}}),Pc=p({is(t){return t.kind==="PartitionByNode"},create(t){return p({kind:"PartitionByNode",items:p(t)})},cloneWithItems(t,e){return p({...t,items:p([...t.items,...e])})}}),ta=p({is(t){return t.kind==="OverNode"},create(){return p({kind:"OverNode"})},cloneWithOrderByItems(t,e){return p({...t,orderBy:t.orderBy?Zn.cloneWithItems(t.orderBy,e):Zn.create(e)})},cloneWithPartitionByItems(t,e){return p({...t,partitionBy:t.partitionBy?Pc.cloneWithItems(t.partitionBy,e):Pc.create(e)})}}),Cs=p({is(t){return t.kind==="FromNode"},create(t){return p({kind:"FromNode",froms:p(t)})},cloneWithFroms(t,e){return p({...t,froms:p([...t.froms,...e])})}}),Fc=p({is(t){return t.kind==="GroupByNode"},create(t){return p({kind:"GroupByNode",items:p(t)})},cloneWithItems(t,e){return p({...t,items:p([...t.items,...e])})}}),Rc=p({is(t){return t.kind==="HavingNode"},create(t){return p({kind:"HavingNode",having:t})},cloneWithOperation(t,e,r){return p({...t,having:e==="And"?nn.create(t.having,r):Gn.create(t.having,r)})}}),Wt=p({is(t){return t.kind==="InsertQueryNode"},create(t,e,r){return p({kind:"InsertQueryNode",into:t,...e&&{with:e},replace:r})},createWithoutInto(){return p({kind:"InsertQueryNode"})},cloneWith(t,e){return p({...t,...e})}}),Wc=p({is(t){return t.kind==="ListNode"},create(t){return p({kind:"ListNode",items:p(t)})}}),ei=p({is(t){return t.kind==="UpdateQueryNode"},create(t,e){return p({kind:"UpdateQueryNode",table:t.length===1?t[0]:Wc.create(t),...e&&{with:e}})},createWithoutTable(){return p({kind:"UpdateQueryNode"})},cloneWithFromItems(t,e){return p({...t,from:t.from?Cs.cloneWithFroms(t.from,e):Cs.create(e)})},cloneWithUpdates(t,e){return p({...t,updates:t.updates?p([...t.updates,...e]):e})},cloneWithLimit(t,e){return p({...t,limit:e})}}),ra=p({is(t){return t.kind==="UsingNode"},create(t){return p({kind:"UsingNode",tables:p(t)})},cloneWithTables(t,e){return p({...t,tables:p([...t.tables,...e])})}}),ki=p({is(t){return t.kind==="DeleteQueryNode"},create(t,e){return p({kind:"DeleteQueryNode",from:Cs.create(t),...e&&{with:e}})},cloneWithOrderByItems:(t,e)=>Te.cloneWithOrderByItems(t,e),cloneWithoutOrderBy:t=>Te.cloneWithoutOrderBy(t),cloneWithLimit(t,e){return p({...t,limit:e})},cloneWithoutLimit(t){return p({...t,limit:void 0})},cloneWithUsing(t,e){return p({...t,using:t.using!==void 0?ra.cloneWithTables(t.using,e):ra.create(e)})}}),Jt=p({is(t){return t.kind==="WhereNode"},create(t){return p({kind:"WhereNode",where:t})},cloneWithOperation(t,e,r){return p({...t,where:e==="And"?nn.create(t.where,r):Gn.create(t.where,r)})}}),Dc=p({is(t){return t.kind==="ReturningNode"},create(t){return p({kind:"ReturningNode",selections:p(t)})},cloneWithSelections(t,e){return p({...t,selections:t.selections?p([...t.selections,...e]):p(e)})}}),_m=p({is(t){return t.kind==="ExplainNode"},create(t,e){return p({kind:"ExplainNode",format:t,options:e})}}),An=p({is(t){return t.kind==="WhenNode"},create(t){return p({kind:"WhenNode",condition:t})},cloneWithResult(t,e){return p({...t,result:e})}}),kr=p({is(t){return t.kind==="MergeQueryNode"},create(t,e){return p({kind:"MergeQueryNode",into:t,...e&&{with:e}})},cloneWithUsing(t,e){return p({...t,using:e})},cloneWithWhen(t,e){return p({...t,whens:t.whens?p([...t.whens,e]):p([e])})},cloneWithThen(t,e){return p({...t,whens:t.whens?p([...t.whens.slice(0,-1),An.cloneWithResult(t.whens[t.whens.length-1],e)]):void 0})}}),Mc=p({is(t){return t.kind==="OutputNode"},create(t){return p({kind:"OutputNode",selections:p(t)})},cloneWithSelections(t,e){return p({...t,selections:t.selections?p([...t.selections,...e]):p(e)})}}),Te=p({is(t){return gt.is(t)||Wt.is(t)||ei.is(t)||ki.is(t)||kr.is(t)},cloneWithEndModifier(t,e){return p({...t,endModifiers:t.endModifiers?p([...t.endModifiers,e]):p([e])})},cloneWithWhere(t,e){return p({...t,where:t.where?Jt.cloneWithOperation(t.where,"And",e):Jt.create(e)})},cloneWithJoin(t,e){return p({...t,joins:t.joins?p([...t.joins,e]):p([e])})},cloneWithReturning(t,e){return p({...t,returning:t.returning?Dc.cloneWithSelections(t.returning,e):Dc.create(e)})},cloneWithoutReturning(t){return p({...t,returning:void 0})},cloneWithoutWhere(t){return p({...t,where:void 0})},cloneWithExplain(t,e,r){return p({...t,explain:_m.create(e,r?.toOperationNode())})},cloneWithTop(t,e){return p({...t,top:e})},cloneWithOutput(t,e){return p({...t,output:t.output?Mc.cloneWithSelections(t.output,e):Mc.create(e)})},cloneWithOrderByItems(t,e){return p({...t,orderBy:t.orderBy?Zn.cloneWithItems(t.orderBy,e):Zn.create(e)})},cloneWithoutOrderBy(t){return p({...t,orderBy:void 0})}}),gt=p({is(t){return t.kind==="SelectQueryNode"},create(t){return p({kind:"SelectQueryNode",...t&&{with:t}})},createFrom(t,e){return p({kind:"SelectQueryNode",from:Cs.create(t),...e&&{with:e}})},cloneWithSelections(t,e){return p({...t,selections:t.selections?p([...t.selections,...e]):p(e)})},cloneWithDistinctOn(t,e){return p({...t,distinctOn:t.distinctOn?p([...t.distinctOn,...e]):p(e)})},cloneWithFrontModifier(t,e){return p({...t,frontModifiers:t.frontModifiers?p([...t.frontModifiers,e]):p([e])})},cloneWithOrderByItems:(t,e)=>Te.cloneWithOrderByItems(t,e),cloneWithGroupByItems(t,e){return p({...t,groupBy:t.groupBy?Fc.cloneWithItems(t.groupBy,e):Fc.create(e)})},cloneWithLimit(t,e){return p({...t,limit:e})},cloneWithOffset(t,e){return p({...t,offset:e})},cloneWithFetch(t,e){return p({...t,fetch:e})},cloneWithHaving(t,e){return p({...t,having:t.having?Rc.cloneWithOperation(t.having,"And",e):Rc.create(e)})},cloneWithSetOperations(t,e){return p({...t,setOperations:t.setOperations?p([...t.setOperations,...e]):p([...e])})},cloneWithoutSelections(t){return p({...t,selections:[]})},cloneWithoutLimit(t){return p({...t,limit:void 0})},cloneWithoutOffset(t){return p({...t,offset:void 0})},cloneWithoutOrderBy:t=>Te.cloneWithoutOrderBy(t),cloneWithoutGroupBy(t){return p({...t,groupBy:void 0})}});class Ei{#e;constructor(e){this.#e=p(e)}on(...e){return new Ei({...this.#e,joinNode:Sn.cloneWithOn(this.#e.joinNode,Ut(e))})}onRef(e,r,n){return new Ei({...this.#e,joinNode:Sn.cloneWithOn(this.#e.joinNode,Sr(e,r,n))})}onTrue(){return new Ei({...this.#e,joinNode:Sn.cloneWithOn(this.#e.joinNode,rr.createWithSql("true"))})}$call(e){return e(this)}toOperationNode(){return this.#e.joinNode}}const gm=p({is(t){return t.kind==="PartitionByItemNode"},create(t){return p({kind:"PartitionByItemNode",partitionBy:t})}});function ym(t){return Si(t).map(gm.create)}class Ai{#e;constructor(e){this.#e=p(e)}orderBy(...e){return new Ai({overNode:ta.cloneWithOrderByItems(this.#e.overNode,En(e))})}clearOrderBy(){return new Ai({overNode:Te.cloneWithoutOrderBy(this.#e.overNode)})}partitionBy(e){return new Ai({overNode:ta.cloneWithPartitionByItems(this.#e.overNode,ym(e))})}$call(e){return e(this)}toOperationNode(){return this.#e.overNode}}const Oi=p({is(t){return t.kind==="SelectionNode"},create(t){return p({kind:"SelectionNode",selection:t})},createSelectAll(){return p({kind:"SelectionNode",selection:Jo.create()})},createSelectAllFromTable(t){return p({kind:"SelectionNode",selection:Es.createSelectAll(t)})}});function ir(t){return Yt(t)?ir(t(oi())):Lr(t)?t.map(e=>Uc(e)):[Uc(t)]}function Uc(t){return zt(t)?Oi.create(um(t)):vc(t)?Oi.create(t.toOperationNode()):Oi.create(au(t))}function ur(t){return t?Array.isArray(t)?t.map($c):[$c(t)]:[Oi.createSelectAll()]}function $c(t){if(zt(t))return Oi.createSelectAllFromTable(It(t));throw new Error(`invalid value selectAll expression: ${JSON.stringify(t)}`)}const bm=p({is(t){return t.kind==="ValuesNode"},create(t){return p({kind:"ValuesNode",values:p(t)})}}),wm=p({is(t){return t.kind==="DefaultInsertValueNode"},create(){return p({kind:"DefaultInsertValueNode"})}});function Bc(t){const e=Yt(t)?t(oi()):t,r=Lr(e)?e:p([e]);return xm(r)}function xm(t){const e=Nm(t);return[p([...e.keys()].map(Ot.create)),bm.create(t.map(r=>vm(r,e)))]}function Nm(t){const e=new Map;for(const r of t){const n=Object.keys(r);for(const s of n)!e.has(s)&&r[s]!==void 0&&e.set(s,e.size)}return e}function vm(t,e){const r=Object.keys(t),n=Array.from({length:e.size});let s=!1,a=r.length;for(const g of r){const x=e.get(g);if(tn(x)){a--;continue}const N=t[g];(tn(N)||Fi(N))&&(s=!0),n[x]=N}if(a<e.size||s){const g=wm.create();return Ts.create(n.map(x=>tn(x)?g:Rt(x)))}return Tc.create(n)}const jc=p({is(t){return t.kind==="ColumnUpdateNode"},create(t,e){return p({kind:"ColumnUpdateNode",column:t,value:e})}});function qm(...t){return t.length===2?[jc.create(nr(t[0]),Rt(t[1]))]:na(t[0])}function na(t){const e=Yt(t)?t(oi()):t;return Object.entries(e).filter(([r,n])=>n!==void 0).map(([r,n])=>jc.create(Ot.create(r),Rt(n)))}const Sm=p({is(t){return t.kind==="OnDuplicateKeyNode"},create(t){return p({kind:"OnDuplicateKeyNode",updates:t})}});class km{insertId;numInsertedOrUpdatedRows;constructor(e,r){this.insertId=e,this.numInsertedOrUpdatedRows=r}}class Ti extends Error{node;constructor(e){super("no result"),this.node=e}}function Ii(t){return Object.prototype.hasOwnProperty.call(t,"prototype")}const sr=p({is(t){return t.kind==="OnConflictNode"},create(){return p({kind:"OnConflictNode"})},cloneWith(t,e){return p({...t,...e})},cloneWithIndexWhere(t,e){return p({...t,indexWhere:t.indexWhere?Jt.cloneWithOperation(t.indexWhere,"And",e):Jt.create(e)})},cloneWithIndexOrWhere(t,e){return p({...t,indexWhere:t.indexWhere?Jt.cloneWithOperation(t.indexWhere,"Or",e):Jt.create(e)})},cloneWithUpdateWhere(t,e){return p({...t,updateWhere:t.updateWhere?Jt.cloneWithOperation(t.updateWhere,"And",e):Jt.create(e)})},cloneWithUpdateOrWhere(t,e){return p({...t,updateWhere:t.updateWhere?Jt.cloneWithOperation(t.updateWhere,"Or",e):Jt.create(e)})},cloneWithoutIndexWhere(t){return p({...t,indexWhere:void 0})},cloneWithoutUpdateWhere(t){return p({...t,updateWhere:void 0})}});class Mr{#e;constructor(e){this.#e=p(e)}column(e){const r=Ot.create(e);return new Mr({...this.#e,onConflictNode:sr.cloneWith(this.#e.onConflictNode,{columns:this.#e.onConflictNode.columns?p([...this.#e.onConflictNode.columns,r]):p([r])})})}columns(e){const r=e.map(Ot.create);return new Mr({...this.#e,onConflictNode:sr.cloneWith(this.#e.onConflictNode,{columns:this.#e.onConflictNode.columns?p([...this.#e.onConflictNode.columns,...r]):p(r)})})}constraint(e){return new Mr({...this.#e,onConflictNode:sr.cloneWith(this.#e.onConflictNode,{constraint:_t.create(e)})})}expression(e){return new Mr({...this.#e,onConflictNode:sr.cloneWith(this.#e.onConflictNode,{indexExpression:e.toOperationNode()})})}where(...e){return new Mr({...this.#e,onConflictNode:sr.cloneWithIndexWhere(this.#e.onConflictNode,Ut(e))})}whereRef(e,r,n){return new Mr({...this.#e,onConflictNode:sr.cloneWithIndexWhere(this.#e.onConflictNode,Sr(e,r,n))})}clearWhere(){return new Mr({...this.#e,onConflictNode:sr.cloneWithoutIndexWhere(this.#e.onConflictNode)})}doNothing(){return new Em({...this.#e,onConflictNode:sr.cloneWith(this.#e.onConflictNode,{doNothing:!0})})}doUpdateSet(e){return new Ci({...this.#e,onConflictNode:sr.cloneWith(this.#e.onConflictNode,{updates:na(e)})})}$call(e){return e(this)}}class Em{#e;constructor(e){this.#e=p(e)}toOperationNode(){return this.#e.onConflictNode}}class Ci{#e;constructor(e){this.#e=p(e)}where(...e){return new Ci({...this.#e,onConflictNode:sr.cloneWithUpdateWhere(this.#e.onConflictNode,Ut(e))})}whereRef(e,r,n){return new Ci({...this.#e,onConflictNode:sr.cloneWithUpdateWhere(this.#e.onConflictNode,Sr(e,r,n))})}clearWhere(){return new Ci({...this.#e,onConflictNode:sr.cloneWithoutUpdateWhere(this.#e.onConflictNode)})}$call(e){return e(this)}toOperationNode(){return this.#e.onConflictNode}}const Am=p({is(t){return t.kind==="TopNode"},create(t,e){return p({kind:"TopNode",expression:t,modifiers:e})}});function ti(t,e){if(!qs(t)&&!zo(t))throw new Error(`Invalid top expression: ${t}`);if(!tn(e)&&!Om(e))throw new Error(`Invalid top modifiers: ${e}`);return Am.create(t,e)}function Om(t){return t==="percent"||t==="with ties"||t==="percent with ties"}const ri=p({is(t){return t.kind==="OrActionNode"},create(t){return p({kind:"OrActionNode",action:t})}});class ct{#e;constructor(e){this.#e=p(e)}values(e){const[r,n]=Bc(e);return new ct({...this.#e,queryNode:Wt.cloneWith(this.#e.queryNode,{columns:r,values:n})})}columns(e){return new ct({...this.#e,queryNode:Wt.cloneWith(this.#e.queryNode,{columns:p(e.map(Ot.create))})})}expression(e){return new ct({...this.#e,queryNode:Wt.cloneWith(this.#e.queryNode,{values:Tn(e)})})}defaultValues(){return new ct({...this.#e,queryNode:Wt.cloneWith(this.#e.queryNode,{defaultValues:!0})})}modifyEnd(e){return new ct({...this.#e,queryNode:Te.cloneWithEndModifier(this.#e.queryNode,e.toOperationNode())})}ignore(){return new ct({...this.#e,queryNode:Wt.cloneWith(this.#e.queryNode,{orAction:ri.create("ignore")})})}orIgnore(){return new ct({...this.#e,queryNode:Wt.cloneWith(this.#e.queryNode,{orAction:ri.create("ignore")})})}orAbort(){return new ct({...this.#e,queryNode:Wt.cloneWith(this.#e.queryNode,{orAction:ri.create("abort")})})}orFail(){return new ct({...this.#e,queryNode:Wt.cloneWith(this.#e.queryNode,{orAction:ri.create("fail")})})}orReplace(){return new ct({...this.#e,queryNode:Wt.cloneWith(this.#e.queryNode,{orAction:ri.create("replace")})})}orRollback(){return new ct({...this.#e,queryNode:Wt.cloneWith(this.#e.queryNode,{orAction:ri.create("rollback")})})}top(e,r){return new ct({...this.#e,queryNode:Te.cloneWithTop(this.#e.queryNode,ti(e,r))})}onConflict(e){return new ct({...this.#e,queryNode:Wt.cloneWith(this.#e.queryNode,{onConflict:e(new Mr({onConflictNode:sr.create()})).toOperationNode()})})}onDuplicateKeyUpdate(e){return new ct({...this.#e,queryNode:Wt.cloneWith(this.#e.queryNode,{onDuplicateKey:Sm.create(na(e))})})}returning(e){return new ct({...this.#e,queryNode:Te.cloneWithReturning(this.#e.queryNode,ir(e))})}returningAll(){return new ct({...this.#e,queryNode:Te.cloneWithReturning(this.#e.queryNode,ur())})}output(e){return new ct({...this.#e,queryNode:Te.cloneWithOutput(this.#e.queryNode,ir(e))})}outputAll(e){return new ct({...this.#e,queryNode:Te.cloneWithOutput(this.#e.queryNode,ur(e))})}clearReturning(){return new ct({...this.#e,queryNode:Te.cloneWithoutReturning(this.#e.queryNode)})}$call(e){return e(this)}$if(e,r){return e?r(this):new ct({...this.#e})}$castTo(){return new ct(this.#e)}$narrowType(){return new ct(this.#e)}$assertType(){return new ct(this.#e)}withPlugin(e){return new ct({...this.#e,executor:this.#e.executor.withPlugin(e)})}toOperationNode(){return this.#e.executor.transformQuery(this.#e.queryNode,this.#e.queryId)}compile(){return this.#e.executor.compileQuery(this.toOperationNode(),this.#e.queryId)}async execute(){const e=this.compile(),r=await this.#e.executor.executeQuery(e),{adapter:n}=this.#e.executor,s=e.query;return s.returning&&n.supportsReturning||s.output&&n.supportsOutput?r.rows:[new km(r.insertId,r.numAffectedRows??BigInt(0))]}async executeTakeFirst(){const[e]=await this.execute();return e}async executeTakeFirstOrThrow(e=Ti){const r=await this.executeTakeFirst();if(r===void 0)throw Ii(e)?new e(this.toOperationNode()):e(this.toOperationNode());return r}async*stream(e=100){const r=this.compile(),n=this.#e.executor.stream(r,e);for await(const s of n)yield*s.rows}async explain(e,r){return await new ct({...this.#e,queryNode:Te.cloneWithExplain(this.#e.queryNode,e,r)}).execute()}}class Tm{numDeletedRows;constructor(e){this.numDeletedRows=e}}const ia=p({is(t){return t.kind==="LimitNode"},create(t){return p({kind:"LimitNode",limit:t})}});class xt{#e;constructor(e){this.#e=p(e)}where(...e){return new xt({...this.#e,queryNode:Te.cloneWithWhere(this.#e.queryNode,Ut(e))})}whereRef(e,r,n){return new xt({...this.#e,queryNode:Te.cloneWithWhere(this.#e.queryNode,Sr(e,r,n))})}clearWhere(){return new xt({...this.#e,queryNode:Te.cloneWithoutWhere(this.#e.queryNode)})}top(e,r){return new xt({...this.#e,queryNode:Te.cloneWithTop(this.#e.queryNode,ti(e,r))})}using(e){return new xt({...this.#e,queryNode:ki.cloneWithUsing(this.#e.queryNode,ai(e))})}innerJoin(...e){return this.#t("InnerJoin",e)}leftJoin(...e){return this.#t("LeftJoin",e)}rightJoin(...e){return this.#t("RightJoin",e)}fullJoin(...e){return this.#t("FullJoin",e)}#t(e,r){return new xt({...this.#e,queryNode:Te.cloneWithJoin(this.#e.queryNode,Rs(e,r))})}returning(e){return new xt({...this.#e,queryNode:Te.cloneWithReturning(this.#e.queryNode,ir(e))})}returningAll(e){return new xt({...this.#e,queryNode:Te.cloneWithReturning(this.#e.queryNode,ur(e))})}output(e){return new xt({...this.#e,queryNode:Te.cloneWithOutput(this.#e.queryNode,ir(e))})}outputAll(e){return new xt({...this.#e,queryNode:Te.cloneWithOutput(this.#e.queryNode,ur(e))})}clearReturning(){return new xt({...this.#e,queryNode:Te.cloneWithoutReturning(this.#e.queryNode)})}clearLimit(){return new xt({...this.#e,queryNode:ki.cloneWithoutLimit(this.#e.queryNode)})}orderBy(...e){return new xt({...this.#e,queryNode:Te.cloneWithOrderByItems(this.#e.queryNode,En(e))})}clearOrderBy(){return new xt({...this.#e,queryNode:Te.cloneWithoutOrderBy(this.#e.queryNode)})}limit(e){return new xt({...this.#e,queryNode:ki.cloneWithLimit(this.#e.queryNode,ia.create(Rt(e)))})}modifyEnd(e){return new xt({...this.#e,queryNode:Te.cloneWithEndModifier(this.#e.queryNode,e.toOperationNode())})}$call(e){return e(this)}$if(e,r){return e?r(this):new xt({...this.#e})}$castTo(){return new xt(this.#e)}$narrowType(){return new xt(this.#e)}$assertType(){return new xt(this.#e)}withPlugin(e){return new xt({...this.#e,executor:this.#e.executor.withPlugin(e)})}toOperationNode(){return this.#e.executor.transformQuery(this.#e.queryNode,this.#e.queryId)}compile(){return this.#e.executor.compileQuery(this.toOperationNode(),this.#e.queryId)}async execute(){const e=this.compile(),r=await this.#e.executor.executeQuery(e),{adapter:n}=this.#e.executor,s=e.query;return s.returning&&n.supportsReturning||s.output&&n.supportsOutput?r.rows:[new Tm(r.numAffectedRows??BigInt(0))]}async executeTakeFirst(){const[e]=await this.execute();return e}async executeTakeFirstOrThrow(e=Ti){const r=await this.executeTakeFirst();if(r===void 0)throw Ii(e)?new e(this.toOperationNode()):e(this.toOperationNode());return r}async*stream(e=100){const r=this.compile(),n=this.#e.executor.stream(r,e);for await(const s of n)yield*s.rows}async explain(e,r){return await new xt({...this.#e,queryNode:Te.cloneWithExplain(this.#e.queryNode,e,r)}).execute()}}class Im{numUpdatedRows;numChangedRows;constructor(e,r){this.numUpdatedRows=e,this.numChangedRows=r}}class bt{#e;constructor(e){this.#e=p(e)}where(...e){return new bt({...this.#e,queryNode:Te.cloneWithWhere(this.#e.queryNode,Ut(e))})}whereRef(e,r,n){return new bt({...this.#e,queryNode:Te.cloneWithWhere(this.#e.queryNode,Sr(e,r,n))})}clearWhere(){return new bt({...this.#e,queryNode:Te.cloneWithoutWhere(this.#e.queryNode)})}top(e,r){return new bt({...this.#e,queryNode:Te.cloneWithTop(this.#e.queryNode,ti(e,r))})}from(e){return new bt({...this.#e,queryNode:ei.cloneWithFromItems(this.#e.queryNode,ai(e))})}innerJoin(...e){return this.#t("InnerJoin",e)}leftJoin(...e){return this.#t("LeftJoin",e)}rightJoin(...e){return this.#t("RightJoin",e)}fullJoin(...e){return this.#t("FullJoin",e)}#t(e,r){return new bt({...this.#e,queryNode:Te.cloneWithJoin(this.#e.queryNode,Rs(e,r))})}orderBy(...e){return new bt({...this.#e,queryNode:Te.cloneWithOrderByItems(this.#e.queryNode,En(e))})}clearOrderBy(){return new bt({...this.#e,queryNode:Te.cloneWithoutOrderBy(this.#e.queryNode)})}limit(e){return new bt({...this.#e,queryNode:ei.cloneWithLimit(this.#e.queryNode,ia.create(Rt(e)))})}set(...e){return new bt({...this.#e,queryNode:ei.cloneWithUpdates(this.#e.queryNode,qm(...e))})}returning(e){return new bt({...this.#e,queryNode:Te.cloneWithReturning(this.#e.queryNode,ir(e))})}returningAll(e){return new bt({...this.#e,queryNode:Te.cloneWithReturning(this.#e.queryNode,ur(e))})}output(e){return new bt({...this.#e,queryNode:Te.cloneWithOutput(this.#e.queryNode,ir(e))})}outputAll(e){return new bt({...this.#e,queryNode:Te.cloneWithOutput(this.#e.queryNode,ur(e))})}modifyEnd(e){return new bt({...this.#e,queryNode:Te.cloneWithEndModifier(this.#e.queryNode,e.toOperationNode())})}clearReturning(){return new bt({...this.#e,queryNode:Te.cloneWithoutReturning(this.#e.queryNode)})}$call(e){return e(this)}$if(e,r){return e?r(this):new bt({...this.#e})}$castTo(){return new bt(this.#e)}$narrowType(){return new bt(this.#e)}$assertType(){return new bt(this.#e)}withPlugin(e){return new bt({...this.#e,executor:this.#e.executor.withPlugin(e)})}toOperationNode(){return this.#e.executor.transformQuery(this.#e.queryNode,this.#e.queryId)}compile(){return this.#e.executor.compileQuery(this.toOperationNode(),this.#e.queryId)}async execute(){const e=this.compile(),r=await this.#e.executor.executeQuery(e),{adapter:n}=this.#e.executor,s=e.query;return s.returning&&n.supportsReturning||s.output&&n.supportsOutput?r.rows:[new Im(r.numAffectedRows??BigInt(0),r.numChangedRows)]}async executeTakeFirst(){const[e]=await this.execute();return e}async executeTakeFirstOrThrow(e=Ti){const r=await this.executeTakeFirst();if(r===void 0)throw Ii(e)?new e(this.toOperationNode()):e(this.toOperationNode());return r}async*stream(e=100){const r=this.compile(),n=this.#e.executor.stream(r,e);for await(const s of n)yield*s.rows}async explain(e,r){return await new bt({...this.#e,queryNode:Te.cloneWithExplain(this.#e.queryNode,e,r)}).execute()}}const zc=p({is(t){return t.kind==="CommonTableExpressionNameNode"},create(t,e){return p({kind:"CommonTableExpressionNameNode",table:qr.create(t),columns:e?p(e.map(Ot.create)):void 0})}}),Ls=p({is(t){return t.kind==="CommonTableExpressionNode"},create(t,e){return p({kind:"CommonTableExpressionNode",name:t,expression:e})},cloneWith(t,e){return p({...t,...e})}});class Ps{#e;constructor(e){this.#e=p(e)}materialized(){return new Ps({...this.#e,node:Ls.cloneWith(this.#e.node,{materialized:!0})})}notMaterialized(){return new Ps({...this.#e,node:Ls.cloneWith(this.#e.node,{materialized:!1})})}toOperationNode(){return this.#e.node}}function Vc(t,e){const r=e(jm()).toOperationNode();return Yt(t)?t(Cm(r)).toOperationNode():Ls.create(Qc(t),r)}function Cm(t){return e=>new Ps({node:Ls.create(Qc(e),t)})}function Qc(t){if(t.includes("(")){const e=t.split(/[\(\)]/),r=e[0],n=e[1].split(",").map(s=>s.trim());return zc.create(r,n)}else return zc.create(t)}const Fs=p({is(t){return t.kind==="WithNode"},create(t,e){return p({kind:"WithNode",expressions:p([t]),...e})},cloneWithExpression(t,e){return p({...t,expressions:p([...t.expressions,e])})}}),Hc=["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z","a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z","0","1","2","3","4","5","6","7","8","9"];function Lm(t){let e="";for(let r=0;r<t;++r)e+=Pm();return e}function Pm(){return Hc[~~(Math.random()*Hc.length)]}function Tt(){return new Fm}class Fm{#e;get queryId(){return this.#e===void 0&&(this.#e=Lm(8)),this.#e}}function C0(t){return t}class Jc{nodeStack=[];#e=p({AliasNode:this.transformAlias.bind(this),ColumnNode:this.transformColumn.bind(this),IdentifierNode:this.transformIdentifier.bind(this),SchemableIdentifierNode:this.transformSchemableIdentifier.bind(this),RawNode:this.transformRaw.bind(this),ReferenceNode:this.transformReference.bind(this),SelectQueryNode:this.transformSelectQuery.bind(this),SelectionNode:this.transformSelection.bind(this),TableNode:this.transformTable.bind(this),FromNode:this.transformFrom.bind(this),SelectAllNode:this.transformSelectAll.bind(this),AndNode:this.transformAnd.bind(this),OrNode:this.transformOr.bind(this),ValueNode:this.transformValue.bind(this),ValueListNode:this.transformValueList.bind(this),PrimitiveValueListNode:this.transformPrimitiveValueList.bind(this),ParensNode:this.transformParens.bind(this),JoinNode:this.transformJoin.bind(this),OperatorNode:this.transformOperator.bind(this),WhereNode:this.transformWhere.bind(this),InsertQueryNode:this.transformInsertQuery.bind(this),DeleteQueryNode:this.transformDeleteQuery.bind(this),ReturningNode:this.transformReturning.bind(this),CreateTableNode:this.transformCreateTable.bind(this),AddColumnNode:this.transformAddColumn.bind(this),ColumnDefinitionNode:this.transformColumnDefinition.bind(this),DropTableNode:this.transformDropTable.bind(this),DataTypeNode:this.transformDataType.bind(this),OrderByNode:this.transformOrderBy.bind(this),OrderByItemNode:this.transformOrderByItem.bind(this),GroupByNode:this.transformGroupBy.bind(this),GroupByItemNode:this.transformGroupByItem.bind(this),UpdateQueryNode:this.transformUpdateQuery.bind(this),ColumnUpdateNode:this.transformColumnUpdate.bind(this),LimitNode:this.transformLimit.bind(this),OffsetNode:this.transformOffset.bind(this),OnConflictNode:this.transformOnConflict.bind(this),OnDuplicateKeyNode:this.transformOnDuplicateKey.bind(this),CreateIndexNode:this.transformCreateIndex.bind(this),DropIndexNode:this.transformDropIndex.bind(this),ListNode:this.transformList.bind(this),PrimaryKeyConstraintNode:this.transformPrimaryKeyConstraint.bind(this),UniqueConstraintNode:this.transformUniqueConstraint.bind(this),ReferencesNode:this.transformReferences.bind(this),CheckConstraintNode:this.transformCheckConstraint.bind(this),WithNode:this.transformWith.bind(this),CommonTableExpressionNode:this.transformCommonTableExpression.bind(this),CommonTableExpressionNameNode:this.transformCommonTableExpressionName.bind(this),HavingNode:this.transformHaving.bind(this),CreateSchemaNode:this.transformCreateSchema.bind(this),DropSchemaNode:this.transformDropSchema.bind(this),AlterTableNode:this.transformAlterTable.bind(this),DropColumnNode:this.transformDropColumn.bind(this),RenameColumnNode:this.transformRenameColumn.bind(this),AlterColumnNode:this.transformAlterColumn.bind(this),ModifyColumnNode:this.transformModifyColumn.bind(this),AddConstraintNode:this.transformAddConstraint.bind(this),DropConstraintNode:this.transformDropConstraint.bind(this),RenameConstraintNode:this.transformRenameConstraint.bind(this),ForeignKeyConstraintNode:this.transformForeignKeyConstraint.bind(this),CreateViewNode:this.transformCreateView.bind(this),RefreshMaterializedViewNode:this.transformRefreshMaterializedView.bind(this),DropViewNode:this.transformDropView.bind(this),GeneratedNode:this.transformGenerated.bind(this),DefaultValueNode:this.transformDefaultValue.bind(this),OnNode:this.transformOn.bind(this),ValuesNode:this.transformValues.bind(this),SelectModifierNode:this.transformSelectModifier.bind(this),CreateTypeNode:this.transformCreateType.bind(this),DropTypeNode:this.transformDropType.bind(this),ExplainNode:this.transformExplain.bind(this),DefaultInsertValueNode:this.transformDefaultInsertValue.bind(this),AggregateFunctionNode:this.transformAggregateFunction.bind(this),OverNode:this.transformOver.bind(this),PartitionByNode:this.transformPartitionBy.bind(this),PartitionByItemNode:this.transformPartitionByItem.bind(this),SetOperationNode:this.transformSetOperation.bind(this),BinaryOperationNode:this.transformBinaryOperation.bind(this),UnaryOperationNode:this.transformUnaryOperation.bind(this),UsingNode:this.transformUsing.bind(this),FunctionNode:this.transformFunction.bind(this),CaseNode:this.transformCase.bind(this),WhenNode:this.transformWhen.bind(this),JSONReferenceNode:this.transformJSONReference.bind(this),JSONPathNode:this.transformJSONPath.bind(this),JSONPathLegNode:this.transformJSONPathLeg.bind(this),JSONOperatorChainNode:this.transformJSONOperatorChain.bind(this),TupleNode:this.transformTuple.bind(this),MergeQueryNode:this.transformMergeQuery.bind(this),MatchedNode:this.transformMatched.bind(this),AddIndexNode:this.transformAddIndex.bind(this),CastNode:this.transformCast.bind(this),FetchNode:this.transformFetch.bind(this),TopNode:this.transformTop.bind(this),OutputNode:this.transformOutput.bind(this),OrActionNode:this.transformOrAction.bind(this),CollateNode:this.transformCollate.bind(this)});transformNode(e,r){if(!e)return e;this.nodeStack.push(e);const n=this.transformNodeImpl(e,r);return this.nodeStack.pop(),p(n)}transformNodeImpl(e,r){return this.#e[e.kind](e,r)}transformNodeList(e,r){return e&&p(e.map(n=>this.transformNode(n,r)))}transformSelectQuery(e,r){return{kind:"SelectQueryNode",from:this.transformNode(e.from,r),selections:this.transformNodeList(e.selections,r),distinctOn:this.transformNodeList(e.distinctOn,r),joins:this.transformNodeList(e.joins,r),groupBy:this.transformNode(e.groupBy,r),orderBy:this.transformNode(e.orderBy,r),where:this.transformNode(e.where,r),frontModifiers:this.transformNodeList(e.frontModifiers,r),endModifiers:this.transformNodeList(e.endModifiers,r),limit:this.transformNode(e.limit,r),offset:this.transformNode(e.offset,r),with:this.transformNode(e.with,r),having:this.transformNode(e.having,r),explain:this.transformNode(e.explain,r),setOperations:this.transformNodeList(e.setOperations,r),fetch:this.transformNode(e.fetch,r),top:this.transformNode(e.top,r)}}transformSelection(e,r){return{kind:"SelectionNode",selection:this.transformNode(e.selection,r)}}transformColumn(e,r){return{kind:"ColumnNode",column:this.transformNode(e.column,r)}}transformAlias(e,r){return{kind:"AliasNode",node:this.transformNode(e.node,r),alias:this.transformNode(e.alias,r)}}transformTable(e,r){return{kind:"TableNode",table:this.transformNode(e.table,r)}}transformFrom(e,r){return{kind:"FromNode",froms:this.transformNodeList(e.froms,r)}}transformReference(e,r){return{kind:"ReferenceNode",column:this.transformNode(e.column,r),table:this.transformNode(e.table,r)}}transformAnd(e,r){return{kind:"AndNode",left:this.transformNode(e.left,r),right:this.transformNode(e.right,r)}}transformOr(e,r){return{kind:"OrNode",left:this.transformNode(e.left,r),right:this.transformNode(e.right,r)}}transformValueList(e,r){return{kind:"ValueListNode",values:this.transformNodeList(e.values,r)}}transformParens(e,r){return{kind:"ParensNode",node:this.transformNode(e.node,r)}}transformJoin(e,r){return{kind:"JoinNode",joinType:e.joinType,table:this.transformNode(e.table,r),on:this.transformNode(e.on,r)}}transformRaw(e,r){return{kind:"RawNode",sqlFragments:p([...e.sqlFragments]),parameters:this.transformNodeList(e.parameters,r)}}transformWhere(e,r){return{kind:"WhereNode",where:this.transformNode(e.where,r)}}transformInsertQuery(e,r){return{kind:"InsertQueryNode",into:this.transformNode(e.into,r),columns:this.transformNodeList(e.columns,r),values:this.transformNode(e.values,r),returning:this.transformNode(e.returning,r),onConflict:this.transformNode(e.onConflict,r),onDuplicateKey:this.transformNode(e.onDuplicateKey,r),endModifiers:this.transformNodeList(e.endModifiers,r),with:this.transformNode(e.with,r),ignore:e.ignore,orAction:this.transformNode(e.orAction,r),replace:e.replace,explain:this.transformNode(e.explain,r),defaultValues:e.defaultValues,top:this.transformNode(e.top,r),output:this.transformNode(e.output,r)}}transformValues(e,r){return{kind:"ValuesNode",values:this.transformNodeList(e.values,r)}}transformDeleteQuery(e,r){return{kind:"DeleteQueryNode",from:this.transformNode(e.from,r),using:this.transformNode(e.using,r),joins:this.transformNodeList(e.joins,r),where:this.transformNode(e.where,r),returning:this.transformNode(e.returning,r),endModifiers:this.transformNodeList(e.endModifiers,r),with:this.transformNode(e.with,r),orderBy:this.transformNode(e.orderBy,r),limit:this.transformNode(e.limit,r),explain:this.transformNode(e.explain,r),top:this.transformNode(e.top,r),output:this.transformNode(e.output,r)}}transformReturning(e,r){return{kind:"ReturningNode",selections:this.transformNodeList(e.selections,r)}}transformCreateTable(e,r){return{kind:"CreateTableNode",table:this.transformNode(e.table,r),columns:this.transformNodeList(e.columns,r),constraints:this.transformNodeList(e.constraints,r),temporary:e.temporary,ifNotExists:e.ifNotExists,onCommit:e.onCommit,frontModifiers:this.transformNodeList(e.frontModifiers,r),endModifiers:this.transformNodeList(e.endModifiers,r),selectQuery:this.transformNode(e.selectQuery,r)}}transformColumnDefinition(e,r){return{kind:"ColumnDefinitionNode",column:this.transformNode(e.column,r),dataType:this.transformNode(e.dataType,r),references:this.transformNode(e.references,r),primaryKey:e.primaryKey,autoIncrement:e.autoIncrement,unique:e.unique,notNull:e.notNull,unsigned:e.unsigned,defaultTo:this.transformNode(e.defaultTo,r),check:this.transformNode(e.check,r),generated:this.transformNode(e.generated,r),frontModifiers:this.transformNodeList(e.frontModifiers,r),endModifiers:this.transformNodeList(e.endModifiers,r),nullsNotDistinct:e.nullsNotDistinct,identity:e.identity,ifNotExists:e.ifNotExists}}transformAddColumn(e,r){return{kind:"AddColumnNode",column:this.transformNode(e.column,r)}}transformDropTable(e,r){return{kind:"DropTableNode",table:this.transformNode(e.table,r),ifExists:e.ifExists,cascade:e.cascade}}transformOrderBy(e,r){return{kind:"OrderByNode",items:this.transformNodeList(e.items,r)}}transformOrderByItem(e,r){return{kind:"OrderByItemNode",orderBy:this.transformNode(e.orderBy,r),direction:this.transformNode(e.direction,r),collation:this.transformNode(e.collation,r),nulls:e.nulls}}transformGroupBy(e,r){return{kind:"GroupByNode",items:this.transformNodeList(e.items,r)}}transformGroupByItem(e,r){return{kind:"GroupByItemNode",groupBy:this.transformNode(e.groupBy,r)}}transformUpdateQuery(e,r){return{kind:"UpdateQueryNode",table:this.transformNode(e.table,r),from:this.transformNode(e.from,r),joins:this.transformNodeList(e.joins,r),where:this.transformNode(e.where,r),updates:this.transformNodeList(e.updates,r),returning:this.transformNode(e.returning,r),endModifiers:this.transformNodeList(e.endModifiers,r),with:this.transformNode(e.with,r),explain:this.transformNode(e.explain,r),limit:this.transformNode(e.limit,r),top:this.transformNode(e.top,r),output:this.transformNode(e.output,r),orderBy:this.transformNode(e.orderBy,r)}}transformColumnUpdate(e,r){return{kind:"ColumnUpdateNode",column:this.transformNode(e.column,r),value:this.transformNode(e.value,r)}}transformLimit(e,r){return{kind:"LimitNode",limit:this.transformNode(e.limit,r)}}transformOffset(e,r){return{kind:"OffsetNode",offset:this.transformNode(e.offset,r)}}transformOnConflict(e,r){return{kind:"OnConflictNode",columns:this.transformNodeList(e.columns,r),constraint:this.transformNode(e.constraint,r),indexExpression:this.transformNode(e.indexExpression,r),indexWhere:this.transformNode(e.indexWhere,r),updates:this.transformNodeList(e.updates,r),updateWhere:this.transformNode(e.updateWhere,r),doNothing:e.doNothing}}transformOnDuplicateKey(e,r){return{kind:"OnDuplicateKeyNode",updates:this.transformNodeList(e.updates,r)}}transformCreateIndex(e,r){return{kind:"CreateIndexNode",name:this.transformNode(e.name,r),table:this.transformNode(e.table,r),columns:this.transformNodeList(e.columns,r),unique:e.unique,using:this.transformNode(e.using,r),ifNotExists:e.ifNotExists,where:this.transformNode(e.where,r),nullsNotDistinct:e.nullsNotDistinct}}transformList(e,r){return{kind:"ListNode",items:this.transformNodeList(e.items,r)}}transformDropIndex(e,r){return{kind:"DropIndexNode",name:this.transformNode(e.name,r),table:this.transformNode(e.table,r),ifExists:e.ifExists,cascade:e.cascade}}transformPrimaryKeyConstraint(e,r){return{kind:"PrimaryKeyConstraintNode",columns:this.transformNodeList(e.columns,r),name:this.transformNode(e.name,r),deferrable:e.deferrable,initiallyDeferred:e.initiallyDeferred}}transformUniqueConstraint(e,r){return{kind:"UniqueConstraintNode",columns:this.transformNodeList(e.columns,r),name:this.transformNode(e.name,r),nullsNotDistinct:e.nullsNotDistinct,deferrable:e.deferrable,initiallyDeferred:e.initiallyDeferred}}transformForeignKeyConstraint(e,r){return{kind:"ForeignKeyConstraintNode",columns:this.transformNodeList(e.columns,r),references:this.transformNode(e.references,r),name:this.transformNode(e.name,r),onDelete:e.onDelete,onUpdate:e.onUpdate,deferrable:e.deferrable,initiallyDeferred:e.initiallyDeferred}}transformSetOperation(e,r){return{kind:"SetOperationNode",operator:e.operator,expression:this.transformNode(e.expression,r),all:e.all}}transformReferences(e,r){return{kind:"ReferencesNode",table:this.transformNode(e.table,r),columns:this.transformNodeList(e.columns,r),onDelete:e.onDelete,onUpdate:e.onUpdate}}transformCheckConstraint(e,r){return{kind:"CheckConstraintNode",expression:this.transformNode(e.expression,r),name:this.transformNode(e.name,r)}}transformWith(e,r){return{kind:"WithNode",expressions:this.transformNodeList(e.expressions,r),recursive:e.recursive}}transformCommonTableExpression(e,r){return{kind:"CommonTableExpressionNode",name:this.transformNode(e.name,r),materialized:e.materialized,expression:this.transformNode(e.expression,r)}}transformCommonTableExpressionName(e,r){return{kind:"CommonTableExpressionNameNode",table:this.transformNode(e.table,r),columns:this.transformNodeList(e.columns,r)}}transformHaving(e,r){return{kind:"HavingNode",having:this.transformNode(e.having,r)}}transformCreateSchema(e,r){return{kind:"CreateSchemaNode",schema:this.transformNode(e.schema,r),ifNotExists:e.ifNotExists}}transformDropSchema(e,r){return{kind:"DropSchemaNode",schema:this.transformNode(e.schema,r),ifExists:e.ifExists,cascade:e.cascade}}transformAlterTable(e,r){return{kind:"AlterTableNode",table:this.transformNode(e.table,r),renameTo:this.transformNode(e.renameTo,r),setSchema:this.transformNode(e.setSchema,r),columnAlterations:this.transformNodeList(e.columnAlterations,r),addConstraint:this.transformNode(e.addConstraint,r),dropConstraint:this.transformNode(e.dropConstraint,r),renameConstraint:this.transformNode(e.renameConstraint,r),addIndex:this.transformNode(e.addIndex,r),dropIndex:this.transformNode(e.dropIndex,r)}}transformDropColumn(e,r){return{kind:"DropColumnNode",column:this.transformNode(e.column,r)}}transformRenameColumn(e,r){return{kind:"RenameColumnNode",column:this.transformNode(e.column,r),renameTo:this.transformNode(e.renameTo,r)}}transformAlterColumn(e,r){return{kind:"AlterColumnNode",column:this.transformNode(e.column,r),dataType:this.transformNode(e.dataType,r),dataTypeExpression:this.transformNode(e.dataTypeExpression,r),setDefault:this.transformNode(e.setDefault,r),dropDefault:e.dropDefault,setNotNull:e.setNotNull,dropNotNull:e.dropNotNull}}transformModifyColumn(e,r){return{kind:"ModifyColumnNode",column:this.transformNode(e.column,r)}}transformAddConstraint(e,r){return{kind:"AddConstraintNode",constraint:this.transformNode(e.constraint,r)}}transformDropConstraint(e,r){return{kind:"DropConstraintNode",constraintName:this.transformNode(e.constraintName,r),ifExists:e.ifExists,modifier:e.modifier}}transformRenameConstraint(e,r){return{kind:"RenameConstraintNode",oldName:this.transformNode(e.oldName,r),newName:this.transformNode(e.newName,r)}}transformCreateView(e,r){return{kind:"CreateViewNode",name:this.transformNode(e.name,r),temporary:e.temporary,orReplace:e.orReplace,ifNotExists:e.ifNotExists,materialized:e.materialized,columns:this.transformNodeList(e.columns,r),as:this.transformNode(e.as,r)}}transformRefreshMaterializedView(e,r){return{kind:"RefreshMaterializedViewNode",name:this.transformNode(e.name,r),concurrently:e.concurrently,withNoData:e.withNoData}}transformDropView(e,r){return{kind:"DropViewNode",name:this.transformNode(e.name,r),ifExists:e.ifExists,materialized:e.materialized,cascade:e.cascade}}transformGenerated(e,r){return{kind:"GeneratedNode",byDefault:e.byDefault,always:e.always,identity:e.identity,stored:e.stored,expression:this.transformNode(e.expression,r)}}transformDefaultValue(e,r){return{kind:"DefaultValueNode",defaultValue:this.transformNode(e.defaultValue,r)}}transformOn(e,r){return{kind:"OnNode",on:this.transformNode(e.on,r)}}transformSelectModifier(e,r){return{kind:"SelectModifierNode",modifier:e.modifier,rawModifier:this.transformNode(e.rawModifier,r),of:this.transformNodeList(e.of,r)}}transformCreateType(e,r){return{kind:"CreateTypeNode",name:this.transformNode(e.name,r),enum:this.transformNode(e.enum,r)}}transformDropType(e,r){return{kind:"DropTypeNode",name:this.transformNode(e.name,r),ifExists:e.ifExists}}transformExplain(e,r){return{kind:"ExplainNode",format:e.format,options:this.transformNode(e.options,r)}}transformSchemableIdentifier(e,r){return{kind:"SchemableIdentifierNode",schema:this.transformNode(e.schema,r),identifier:this.transformNode(e.identifier,r)}}transformAggregateFunction(e,r){return{kind:"AggregateFunctionNode",func:e.func,aggregated:this.transformNodeList(e.aggregated,r),distinct:e.distinct,orderBy:this.transformNode(e.orderBy,r),withinGroup:this.transformNode(e.withinGroup,r),filter:this.transformNode(e.filter,r),over:this.transformNode(e.over,r)}}transformOver(e,r){return{kind:"OverNode",orderBy:this.transformNode(e.orderBy,r),partitionBy:this.transformNode(e.partitionBy,r)}}transformPartitionBy(e,r){return{kind:"PartitionByNode",items:this.transformNodeList(e.items,r)}}transformPartitionByItem(e,r){return{kind:"PartitionByItemNode",partitionBy:this.transformNode(e.partitionBy,r)}}transformBinaryOperation(e,r){return{kind:"BinaryOperationNode",leftOperand:this.transformNode(e.leftOperand,r),operator:this.transformNode(e.operator,r),rightOperand:this.transformNode(e.rightOperand,r)}}transformUnaryOperation(e,r){return{kind:"UnaryOperationNode",operator:this.transformNode(e.operator,r),operand:this.transformNode(e.operand,r)}}transformUsing(e,r){return{kind:"UsingNode",tables:this.transformNodeList(e.tables,r)}}transformFunction(e,r){return{kind:"FunctionNode",func:e.func,arguments:this.transformNodeList(e.arguments,r)}}transformCase(e,r){return{kind:"CaseNode",value:this.transformNode(e.value,r),when:this.transformNodeList(e.when,r),else:this.transformNode(e.else,r),isStatement:e.isStatement}}transformWhen(e,r){return{kind:"WhenNode",condition:this.transformNode(e.condition,r),result:this.transformNode(e.result,r)}}transformJSONReference(e,r){return{kind:"JSONReferenceNode",reference:this.transformNode(e.reference,r),traversal:this.transformNode(e.traversal,r)}}transformJSONPath(e,r){return{kind:"JSONPathNode",inOperator:this.transformNode(e.inOperator,r),pathLegs:this.transformNodeList(e.pathLegs,r)}}transformJSONPathLeg(e,r){return{kind:"JSONPathLegNode",type:e.type,value:e.value}}transformJSONOperatorChain(e,r){return{kind:"JSONOperatorChainNode",operator:this.transformNode(e.operator,r),values:this.transformNodeList(e.values,r)}}transformTuple(e,r){return{kind:"TupleNode",values:this.transformNodeList(e.values,r)}}transformMergeQuery(e,r){return{kind:"MergeQueryNode",into:this.transformNode(e.into,r),using:this.transformNode(e.using,r),whens:this.transformNodeList(e.whens,r),with:this.transformNode(e.with,r),top:this.transformNode(e.top,r),endModifiers:this.transformNodeList(e.endModifiers,r),output:this.transformNode(e.output,r),returning:this.transformNode(e.returning,r)}}transformMatched(e,r){return{kind:"MatchedNode",not:e.not,bySource:e.bySource}}transformAddIndex(e,r){return{kind:"AddIndexNode",name:this.transformNode(e.name,r),columns:this.transformNodeList(e.columns,r),unique:e.unique,using:this.transformNode(e.using,r),ifNotExists:e.ifNotExists}}transformCast(e,r){return{kind:"CastNode",expression:this.transformNode(e.expression,r),dataType:this.transformNode(e.dataType,r)}}transformFetch(e,r){return{kind:"FetchNode",rowCount:this.transformNode(e.rowCount,r),modifier:e.modifier}}transformTop(e,r){return{kind:"TopNode",expression:e.expression,modifiers:e.modifiers}}transformOutput(e,r){return{kind:"OutputNode",selections:this.transformNodeList(e.selections,r)}}transformDataType(e,r){return e}transformSelectAll(e,r){return e}transformIdentifier(e,r){return e}transformValue(e,r){return e}transformPrimitiveValueList(e,r){return e}transformOperator(e,r){return e}transformDefaultInsertValue(e,r){return e}transformOrAction(e,r){return e}transformCollate(e,r){return e}}const Rm=p({AlterTableNode:!0,CreateIndexNode:!0,CreateSchemaNode:!0,CreateTableNode:!0,CreateTypeNode:!0,CreateViewNode:!0,RefreshMaterializedViewNode:!0,DeleteQueryNode:!0,DropIndexNode:!0,DropSchemaNode:!0,DropTableNode:!0,DropTypeNode:!0,DropViewNode:!0,InsertQueryNode:!0,RawNode:!0,SelectQueryNode:!0,UpdateQueryNode:!0,MergeQueryNode:!0}),Wm={json_agg:!0,to_json:!0};class Dm extends Jc{#e;#t=new Set;#r=new Set;constructor(e){super(),this.#e=e}transformNodeImpl(e,r){if(!this.#i(e))return super.transformNodeImpl(e,r);const n=this.#c(e);for(const d of n)this.#r.add(d);const s=this.#o(e);for(const d of s)this.#t.add(d);const a=super.transformNodeImpl(e,r);for(const d of s)this.#t.delete(d);for(const d of n)this.#r.delete(d);return a}transformSchemableIdentifier(e,r){const n=super.transformSchemableIdentifier(e,r);return n.schema||!this.#t.has(e.identifier.name)?n:{...n,schema:_t.create(this.#e)}}transformReferences(e,r){const n=super.transformReferences(e,r);return n.table.table.schema?n:{...n,table:qr.createWithSchema(this.#e,n.table.table.identifier.name)}}transformAggregateFunction(e,r){return{...super.transformAggregateFunction({...e,aggregated:[]},r),aggregated:this.#s(e,r,"aggregated")}}transformFunction(e,r){return{...super.transformFunction({...e,arguments:[]},r),arguments:this.#s(e,r,"arguments")}}transformSelectModifier(e,r){return{...super.transformSelectModifier({...e,of:void 0},r),of:e.of?.map(n=>qr.is(n)&&!n.table.schema?{...n,table:this.transformIdentifier(n.table.identifier,r)}:this.transformNode(n,r))}}#s(e,r,n){return Wm[e.func]?e[n].map(s=>!qr.is(s)||s.table.schema?this.transformNode(s,r):{...s,table:this.transformIdentifier(s.table.identifier,r)}):this.transformNodeList(e[n],r)}#i(e){return e.kind in Rm}#o(e){const r=new Set;if("name"in e&&e.name&&Fr.is(e.name)&&this.#l(e.name,r),"from"in e&&e.from)for(const n of e.from.froms)this.#n(n,r);if("into"in e&&e.into&&this.#n(e.into,r),"table"in e&&e.table&&this.#n(e.table,r),"joins"in e&&e.joins)for(const n of e.joins)this.#n(n.table,r);return"using"in e&&e.using&&(Sn.is(e.using)?this.#n(e.using.table,r):this.#n(e.using,r)),r}#c(e){const r=new Set;return"with"in e&&e.with&&this.#a(e.with,r),r}#n(e,r){if(qr.is(e))return this.#l(e.table,r);if(rn.is(e)&&qr.is(e.node))return this.#l(e.node.table,r);if(Wc.is(e)){for(const n of e.items)this.#n(n,r);return}if(ra.is(e)){for(const n of e.tables)this.#n(n,r);return}}#l(e,r){const n=e.identifier.name;!this.#t.has(n)&&!this.#r.has(n)&&r.add(n)}#a(e,r){for(const n of e.expressions){const s=n.name.table.table.identifier.name;this.#r.has(s)||r.add(s)}}}class ni{#e;constructor(e){this.#e=new Dm(e)}transformQuery(e){return this.#e.transformNode(e.node,e.queryId)}async transformResult(e){return e.result}}const Mm=p({is(t){return t.kind==="MatchedNode"},create(t,e=!1){return p({kind:"MatchedNode",not:t,bySource:e})}});function Kc(t,e,r){return An.create(Is([Mm.create(!t.isMatched,t.bySource),...e&&e.length>0?[e.length===3&&r?Sr(e[0],e[1],e[2]):Ut(e)]:[]],"and",!1))}function Li(t){return zt(t)?rr.create([t],[]):tr(t)?t.toOperationNode():t}class Gc{#e;#t;#r;constructor(){this.#e=new Promise((e,r)=>{this.#r=r,this.#t=e})}get promise(){return this.#e}resolve=e=>{this.#t&&this.#t(e)};reject=e=>{this.#r&&this.#r(e)}}async function Xc(t){const e=new Gc,r=new Gc;return t.provideConnection(async n=>(e.resolve(n),await r.promise)).catch(n=>e.reject(n)),p({connection:await e.promise,release:r.resolve})}const Um=p([]);class Yc{#e;constructor(e=Um){this.#e=e}get plugins(){return this.#e}transformQuery(e,r){for(const n of this.#e){const s=n.transformQuery({node:e,queryId:r});if(s.kind===e.kind)e=s;else throw new Error(["KyselyPlugin.transformQuery must return a node","of the same kind that was given to it.",`The plugin was given a ${e.kind}`,`but it returned a ${s.kind}`].join(" "))}return e}async executeQuery(e){return await this.provideConnection(async r=>{const n=await r.executeQuery(e);return"numUpdatedOrDeletedRows"in n&&Yn("kysely:warning: outdated driver/plugin detected! `QueryResult.numUpdatedOrDeletedRows` has been replaced with `QueryResult.numAffectedRows`."),await this.#t(n,e.queryId)})}async*stream(e,r){const{connection:n,release:s}=await Xc(this);try{for await(const a of n.streamQuery(e,r))yield await this.#t(a,e.queryId)}finally{s()}}async#t(e,r){for(const n of this.#e)e=await n.transformResult({result:e,queryId:r});return e}}class ii extends Yc{get adapter(){throw new Error("this query cannot be compiled to SQL")}compileQuery(){throw new Error("this query cannot be compiled to SQL")}provideConnection(){throw new Error("this query cannot be executed")}withConnectionProvider(){throw new Error("this query cannot have a connection provider")}withPlugin(e){return new ii([...this.plugins,e])}withPlugins(e){return new ii([...this.plugins,...e])}withPluginAtFront(e){return new ii([e,...this.plugins])}withoutPlugins(){return new ii([])}}const sa=new ii;class $m{numChangedRows;constructor(e){this.numChangedRows=e}}class an{#e;constructor(e){this.#e=p(e)}modifyEnd(e){return new an({...this.#e,queryNode:Te.cloneWithEndModifier(this.#e.queryNode,e.toOperationNode())})}top(e,r){return new an({...this.#e,queryNode:Te.cloneWithTop(this.#e.queryNode,ti(e,r))})}using(...e){return new Kt({...this.#e,queryNode:kr.cloneWithUsing(this.#e.queryNode,Rs("Using",e))})}returning(e){return new an({...this.#e,queryNode:Te.cloneWithReturning(this.#e.queryNode,ir(e))})}returningAll(e){return new an({...this.#e,queryNode:Te.cloneWithReturning(this.#e.queryNode,ur(e))})}output(e){return new an({...this.#e,queryNode:Te.cloneWithOutput(this.#e.queryNode,ir(e))})}outputAll(e){return new an({...this.#e,queryNode:Te.cloneWithOutput(this.#e.queryNode,ur(e))})}}class Kt{#e;constructor(e){this.#e=p(e)}modifyEnd(e){return new Kt({...this.#e,queryNode:Te.cloneWithEndModifier(this.#e.queryNode,e.toOperationNode())})}top(e,r){return new Kt({...this.#e,queryNode:Te.cloneWithTop(this.#e.queryNode,ti(e,r))})}whenMatched(){return this.#t([])}whenMatchedAnd(...e){return this.#t(e)}whenMatchedAndRef(e,r,n){return this.#t([e,r,n],!0)}#t(e,r){return new Zc({...this.#e,queryNode:kr.cloneWithWhen(this.#e.queryNode,Kc({isMatched:!0},e,r))})}whenNotMatched(){return this.#r([])}whenNotMatchedAnd(...e){return this.#r(e)}whenNotMatchedAndRef(e,r,n){return this.#r([e,r,n],!0)}whenNotMatchedBySource(){return this.#r([],!1,!0)}whenNotMatchedBySourceAnd(...e){return this.#r(e,!1,!0)}whenNotMatchedBySourceAndRef(e,r,n){return this.#r([e,r,n],!0,!0)}returning(e){return new Kt({...this.#e,queryNode:Te.cloneWithReturning(this.#e.queryNode,ir(e))})}returningAll(e){return new Kt({...this.#e,queryNode:Te.cloneWithReturning(this.#e.queryNode,ur(e))})}output(e){return new Kt({...this.#e,queryNode:Te.cloneWithOutput(this.#e.queryNode,ir(e))})}outputAll(e){return new Kt({...this.#e,queryNode:Te.cloneWithOutput(this.#e.queryNode,ur(e))})}#r(e,r=!1,n=!1){const s={...this.#e,queryNode:kr.cloneWithWhen(this.#e.queryNode,Kc({isMatched:!1,bySource:n},e,r))},a=n?Zc:Bm;return new a(s)}$call(e){return e(this)}$if(e,r){return e?r(this):new Kt({...this.#e})}toOperationNode(){return this.#e.executor.transformQuery(this.#e.queryNode,this.#e.queryId)}compile(){return this.#e.executor.compileQuery(this.toOperationNode(),this.#e.queryId)}async execute(){const e=this.compile(),r=await this.#e.executor.executeQuery(e),{adapter:n}=this.#e.executor,s=e.query;return s.returning&&n.supportsReturning||s.output&&n.supportsOutput?r.rows:[new $m(r.numAffectedRows)]}async executeTakeFirst(){const[e]=await this.execute();return e}async executeTakeFirstOrThrow(e=Ti){const r=await this.executeTakeFirst();if(r===void 0)throw Ii(e)?new e(this.toOperationNode()):e(this.toOperationNode());return r}}class Zc{#e;constructor(e){this.#e=p(e)}thenDelete(){return new Kt({...this.#e,queryNode:kr.cloneWithThen(this.#e.queryNode,Li("delete"))})}thenDoNothing(){return new Kt({...this.#e,queryNode:kr.cloneWithThen(this.#e.queryNode,Li("do nothing"))})}thenUpdate(e){return new Kt({...this.#e,queryNode:kr.cloneWithThen(this.#e.queryNode,Li(e(new bt({queryId:this.#e.queryId,executor:sa,queryNode:ei.createWithoutTable()}))))})}thenUpdateSet(...e){return this.thenUpdate(r=>r.set(...e))}}class Bm{#e;constructor(e){this.#e=p(e)}thenDoNothing(){return new Kt({...this.#e,queryNode:kr.cloneWithThen(this.#e.queryNode,Li("do nothing"))})}thenInsertValues(e){const[r,n]=Bc(e);return new Kt({...this.#e,queryNode:kr.cloneWithThen(this.#e.queryNode,Li(Wt.cloneWith(Wt.createWithoutInto(),{columns:r,values:n})))})}}class ln{#e;constructor(e){this.#e=p(e)}selectFrom(e){return aa({queryId:Tt(),executor:this.#e.executor,queryNode:gt.createFrom(ai(e),this.#e.withNode)})}selectNoFrom(e){return aa({queryId:Tt(),executor:this.#e.executor,queryNode:gt.cloneWithSelections(gt.create(this.#e.withNode),ir(e))})}insertInto(e){return new ct({queryId:Tt(),executor:this.#e.executor,queryNode:Wt.create(It(e),this.#e.withNode)})}replaceInto(e){return new ct({queryId:Tt(),executor:this.#e.executor,queryNode:Wt.create(It(e),this.#e.withNode,!0)})}deleteFrom(e){return new xt({queryId:Tt(),executor:this.#e.executor,queryNode:ki.create(ai(e),this.#e.withNode)})}updateTable(e){return new bt({queryId:Tt(),executor:this.#e.executor,queryNode:ei.create(ai(e),this.#e.withNode)})}mergeInto(e){return new an({queryId:Tt(),executor:this.#e.executor,queryNode:kr.create(lu(e),this.#e.withNode)})}with(e,r){const n=Vc(e,r);return new ln({...this.#e,withNode:this.#e.withNode?Fs.cloneWithExpression(this.#e.withNode,n):Fs.create(n)})}withRecursive(e,r){const n=Vc(e,r);return new ln({...this.#e,withNode:this.#e.withNode?Fs.cloneWithExpression(this.#e.withNode,n):Fs.create(n,{recursive:!0})})}withPlugin(e){return new ln({...this.#e,executor:this.#e.executor.withPlugin(e)})}withoutPlugins(){return new ln({...this.#e,executor:this.#e.executor.withoutPlugins()})}withSchema(e){return new ln({...this.#e,executor:this.#e.executor.withPluginAtFront(new ni(e))})}}function jm(){return new ln({executor:sa})}function zm(t,e){return new Ei({joinNode:Sn.create(t,Ri(e))})}function Vm(){return new Ai({overNode:ta.create()})}function Rs(t,e){if(e.length===3)return Hm(t,e[0],e[1],e[2]);if(e.length===2)return Qm(t,e[0],e[1]);if(e.length===1)return Jm(t,e[0]);throw new Error("not implemented")}function Qm(t,e,r){return r(zm(t,e)).toOperationNode()}function Hm(t,e,r,n){return Sn.createWithOn(t,Ri(e),Sr(r,"=",n))}function Jm(t,e){return Sn.create(t,Ri(e))}const Km=p({is(t){return t.kind==="OffsetNode"},create(t){return p({kind:"OffsetNode",offset:t})}}),Gm=p({is(t){return t.kind==="GroupByItemNode"},create(t){return p({kind:"GroupByItemNode",groupBy:t})}});function Xm(t){return t=Yt(t)?t(oi()):t,Si(t).map(Gm.create)}const eu=p({is(t){return t.kind==="SetOperationNode"},create(t,e,r){return p({kind:"SetOperationNode",operator:t,expression:e,all:r})}});function si(t,e,r){return Yt(e)&&(e=e(ca())),Lr(e)||(e=[e]),e.map(n=>eu.create(t,Tn(n),r))}class ut{#e;constructor(e){this.#e=e}get expressionType(){}as(e){return new oa(this,e)}or(...e){return new Ws(Gn.create(this.#e,Ut(e)))}and(...e){return new Ds(nn.create(this.#e,Ut(e)))}$castTo(){return new ut(this.#e)}$notNull(){return new ut(this.#e)}toOperationNode(){return this.#e}}class oa{#e;#t;constructor(e,r){this.#e=e,this.#t=r}get expression(){return this.#e}get alias(){return this.#t}toOperationNode(){return rn.create(this.#e.toOperationNode(),tr(this.#t)?this.#t.toOperationNode():_t.create(this.#t))}}class Ws{#e;constructor(e){this.#e=e}get expressionType(){}as(e){return new oa(this,e)}or(...e){return new Ws(Gn.create(this.#e,Ut(e)))}$castTo(){return new Ws(this.#e)}toOperationNode(){return Dr.create(this.#e)}}class Ds{#e;constructor(e){this.#e=e}get expressionType(){}as(e){return new oa(this,e)}and(...e){return new Ds(nn.create(this.#e,Ut(e)))}$castTo(){return new Ds(this.#e)}toOperationNode(){return Dr.create(this.#e)}}const Ym=p({is(t){return t.kind==="FetchNode"},create(t,e){return{kind:"FetchNode",rowCount:hr.create(t),modifier:e}}});function Zm(t,e){if(!qs(t)&&!zo(t))throw new Error(`Invalid fetch row count: ${t}`);if(!e_(e))throw new Error(`Invalid fetch modifier: ${e}`);return Ym.create(t,e)}function e_(t){return t==="only"||t==="with ties"}class Je{#e;constructor(e){this.#e=p(e)}get expressionType(){}get isSelectQueryBuilder(){return!0}where(...e){return new Je({...this.#e,queryNode:Te.cloneWithWhere(this.#e.queryNode,Ut(e))})}whereRef(e,r,n){return new Je({...this.#e,queryNode:Te.cloneWithWhere(this.#e.queryNode,Sr(e,r,n))})}having(...e){return new Je({...this.#e,queryNode:gt.cloneWithHaving(this.#e.queryNode,Ut(e))})}havingRef(e,r,n){return new Je({...this.#e,queryNode:gt.cloneWithHaving(this.#e.queryNode,Sr(e,r,n))})}select(e){return new Je({...this.#e,queryNode:gt.cloneWithSelections(this.#e.queryNode,ir(e))})}distinctOn(e){return new Je({...this.#e,queryNode:gt.cloneWithDistinctOn(this.#e.queryNode,Si(e))})}modifyFront(e){return new Je({...this.#e,queryNode:gt.cloneWithFrontModifier(this.#e.queryNode,Rr.createWithExpression(e.toOperationNode()))})}modifyEnd(e){return new Je({...this.#e,queryNode:Te.cloneWithEndModifier(this.#e.queryNode,Rr.createWithExpression(e.toOperationNode()))})}distinct(){return new Je({...this.#e,queryNode:gt.cloneWithFrontModifier(this.#e.queryNode,Rr.create("Distinct"))})}forUpdate(e){return new Je({...this.#e,queryNode:Te.cloneWithEndModifier(this.#e.queryNode,Rr.create("ForUpdate",e?ks(e).map(It):void 0))})}forShare(e){return new Je({...this.#e,queryNode:Te.cloneWithEndModifier(this.#e.queryNode,Rr.create("ForShare",e?ks(e).map(It):void 0))})}forKeyShare(e){return new Je({...this.#e,queryNode:Te.cloneWithEndModifier(this.#e.queryNode,Rr.create("ForKeyShare",e?ks(e).map(It):void 0))})}forNoKeyUpdate(e){return new Je({...this.#e,queryNode:Te.cloneWithEndModifier(this.#e.queryNode,Rr.create("ForNoKeyUpdate",e?ks(e).map(It):void 0))})}skipLocked(){return new Je({...this.#e,queryNode:Te.cloneWithEndModifier(this.#e.queryNode,Rr.create("SkipLocked"))})}noWait(){return new Je({...this.#e,queryNode:Te.cloneWithEndModifier(this.#e.queryNode,Rr.create("NoWait"))})}selectAll(e){return new Je({...this.#e,queryNode:gt.cloneWithSelections(this.#e.queryNode,ur(e))})}innerJoin(...e){return this.#t("InnerJoin",e)}leftJoin(...e){return this.#t("LeftJoin",e)}rightJoin(...e){return this.#t("RightJoin",e)}fullJoin(...e){return this.#t("FullJoin",e)}crossJoin(...e){return this.#t("CrossJoin",e)}innerJoinLateral(...e){return this.#t("LateralInnerJoin",e)}leftJoinLateral(...e){return this.#t("LateralLeftJoin",e)}crossJoinLateral(...e){return this.#t("LateralCrossJoin",e)}crossApply(...e){return this.#t("CrossApply",e)}outerApply(...e){return this.#t("OuterApply",e)}#t(e,r){return new Je({...this.#e,queryNode:Te.cloneWithJoin(this.#e.queryNode,Rs(e,r))})}orderBy(...e){return new Je({...this.#e,queryNode:Te.cloneWithOrderByItems(this.#e.queryNode,En(e))})}groupBy(e){return new Je({...this.#e,queryNode:gt.cloneWithGroupByItems(this.#e.queryNode,Xm(e))})}limit(e){return new Je({...this.#e,queryNode:gt.cloneWithLimit(this.#e.queryNode,ia.create(Rt(e)))})}offset(e){return new Je({...this.#e,queryNode:gt.cloneWithOffset(this.#e.queryNode,Km.create(Rt(e)))})}fetch(e,r="only"){return new Je({...this.#e,queryNode:gt.cloneWithFetch(this.#e.queryNode,Zm(e,r))})}top(e,r){return new Je({...this.#e,queryNode:Te.cloneWithTop(this.#e.queryNode,ti(e,r))})}union(e){return new Je({...this.#e,queryNode:gt.cloneWithSetOperations(this.#e.queryNode,si("union",e,!1))})}unionAll(e){return new Je({...this.#e,queryNode:gt.cloneWithSetOperations(this.#e.queryNode,si("union",e,!0))})}intersect(e){return new Je({...this.#e,queryNode:gt.cloneWithSetOperations(this.#e.queryNode,si("intersect",e,!1))})}intersectAll(e){return new Je({...this.#e,queryNode:gt.cloneWithSetOperations(this.#e.queryNode,si("intersect",e,!0))})}except(e){return new Je({...this.#e,queryNode:gt.cloneWithSetOperations(this.#e.queryNode,si("except",e,!1))})}exceptAll(e){return new Je({...this.#e,queryNode:gt.cloneWithSetOperations(this.#e.queryNode,si("except",e,!0))})}as(e){return new t_(this,e)}clearSelect(){return new Je({...this.#e,queryNode:gt.cloneWithoutSelections(this.#e.queryNode)})}clearWhere(){return new Je({...this.#e,queryNode:Te.cloneWithoutWhere(this.#e.queryNode)})}clearLimit(){return new Je({...this.#e,queryNode:gt.cloneWithoutLimit(this.#e.queryNode)})}clearOffset(){return new Je({...this.#e,queryNode:gt.cloneWithoutOffset(this.#e.queryNode)})}clearOrderBy(){return new Je({...this.#e,queryNode:Te.cloneWithoutOrderBy(this.#e.queryNode)})}clearGroupBy(){return new Je({...this.#e,queryNode:gt.cloneWithoutGroupBy(this.#e.queryNode)})}$call(e){return e(this)}$if(e,r){return e?r(this):new Je({...this.#e})}$castTo(){return new Je(this.#e)}$narrowType(){return new Je(this.#e)}$assertType(){return new Je(this.#e)}$asTuple(){return new ut(this.toOperationNode())}$asScalar(){return new ut(this.toOperationNode())}withPlugin(e){return new Je({...this.#e,executor:this.#e.executor.withPlugin(e)})}toOperationNode(){return this.#e.executor.transformQuery(this.#e.queryNode,this.#e.queryId)}compile(){return this.#e.executor.compileQuery(this.toOperationNode(),this.#e.queryId)}async execute(){const e=this.compile();return(await this.#e.executor.executeQuery(e)).rows}async executeTakeFirst(){const[e]=await this.execute();return e}async executeTakeFirstOrThrow(e=Ti){const r=await this.executeTakeFirst();if(r===void 0)throw Ii(e)?new e(this.toOperationNode()):e(this.toOperationNode());return r}async*stream(e=100){const r=this.compile(),n=this.#e.executor.stream(r,e);for await(const s of n)yield*s.rows}async explain(e,r){return await new Je({...this.#e,queryNode:Te.cloneWithExplain(this.#e.queryNode,e,r)}).execute()}}function aa(t){return new Je(t)}class t_{#e;#t;constructor(e,r){this.#e=e,this.#t=r}get expression(){return this.#e}get alias(){return this.#t}get isAliasedSelectQueryBuilder(){return!0}toOperationNode(){return rn.create(this.#e.toOperationNode(),_t.create(this.#t))}}const cn=p({is(t){return t.kind==="AggregateFunctionNode"},create(t,e=[]){return p({kind:"AggregateFunctionNode",func:t,aggregated:e})},cloneWithDistinct(t){return p({...t,distinct:!0})},cloneWithOrderBy(t,e,r=!1){const n=r?"withinGroup":"orderBy";return p({...t,[n]:t[n]?Zn.cloneWithItems(t[n],e):Zn.create(e)})},cloneWithFilter(t,e){return p({...t,filter:t.filter?Jt.cloneWithOperation(t.filter,"And",e):Jt.create(e)})},cloneWithOrFilter(t,e){return p({...t,filter:t.filter?Jt.cloneWithOperation(t.filter,"Or",e):Jt.create(e)})},cloneWithOver(t,e){return p({...t,over:e})}}),tu=p({is(t){return t.kind==="FunctionNode"},create(t,e){return p({kind:"FunctionNode",func:t,arguments:e})}});class or{#e;constructor(e){this.#e=p(e)}get expressionType(){}as(e){return new r_(this,e)}distinct(){return new or({...this.#e,aggregateFunctionNode:cn.cloneWithDistinct(this.#e.aggregateFunctionNode)})}orderBy(...e){return new or({...this.#e,aggregateFunctionNode:Te.cloneWithOrderByItems(this.#e.aggregateFunctionNode,En(e))})}clearOrderBy(){return new or({...this.#e,aggregateFunctionNode:Te.cloneWithoutOrderBy(this.#e.aggregateFunctionNode)})}withinGroupOrderBy(...e){return new or({...this.#e,aggregateFunctionNode:cn.cloneWithOrderBy(this.#e.aggregateFunctionNode,En(e),!0)})}filterWhere(...e){return new or({...this.#e,aggregateFunctionNode:cn.cloneWithFilter(this.#e.aggregateFunctionNode,Ut(e))})}filterWhereRef(e,r,n){return new or({...this.#e,aggregateFunctionNode:cn.cloneWithFilter(this.#e.aggregateFunctionNode,Sr(e,r,n))})}over(e){const r=Vm();return new or({...this.#e,aggregateFunctionNode:cn.cloneWithOver(this.#e.aggregateFunctionNode,(e?e(r):r).toOperationNode())})}$call(e){return e(this)}$castTo(){return new or(this.#e)}$notNull(){return new or(this.#e)}toOperationNode(){return this.#e.aggregateFunctionNode}}class r_{#e;#t;constructor(e,r){this.#e=e,this.#t=r}get expression(){return this.#e}get alias(){return this.#t}toOperationNode(){return rn.create(this.#e.toOperationNode(),_t.create(this.#t))}}function ru(){const t=(r,n)=>new ut(tu.create(r,Si(n??[]))),e=(r,n)=>new or({aggregateFunctionNode:cn.create(r,n?Si(n):void 0)});return Object.assign(t,{agg:e,avg(r){return e("avg",[r])},coalesce(...r){return t("coalesce",r)},count(r){return e("count",[r])},countAll(r){return new or({aggregateFunctionNode:cn.create("count",ur(r))})},max(r){return e("max",[r])},min(r){return e("min",[r])},sum(r){return e("sum",[r])},any(r){return t("any",[r])},jsonAgg(r){return new or({aggregateFunctionNode:cn.create("json_agg",[zt(r)?It(r):r.toOperationNode()])})},toJson(r){return new ut(tu.create("to_json",[zt(r)?It(r):r.toOperationNode()]))}})}const n_=p({is(t){return t.kind==="UnaryOperationNode"},create(t,e){return p({kind:"UnaryOperationNode",operator:t,operand:e})}});function i_(t,e){return n_.create(sn.create(t),nr(e))}const Er=p({is(t){return t.kind==="CaseNode"},create(t){return p({kind:"CaseNode",value:t})},cloneWithWhen(t,e){return p({...t,when:p(t.when?[...t.when,e]:[e])})},cloneWithThen(t,e){return p({...t,when:t.when?p([...t.when.slice(0,-1),An.cloneWithResult(t.when[t.when.length-1],e)]):void 0})},cloneWith(t,e){return p({...t,...e})}});class nu{#e;constructor(e){this.#e=p(e)}when(...e){return new iu({...this.#e,node:Er.cloneWithWhen(this.#e.node,An.create(Ut(e)))})}}class iu{#e;constructor(e){this.#e=p(e)}then(e){return new s_({...this.#e,node:Er.cloneWithThen(this.#e.node,Xo(e)?Yo(e):Rt(e))})}}class s_{#e;constructor(e){this.#e=p(e)}when(...e){return new iu({...this.#e,node:Er.cloneWithWhen(this.#e.node,An.create(Ut(e)))})}else(e){return new o_({...this.#e,node:Er.cloneWith(this.#e.node,{else:Xo(e)?Yo(e):Rt(e)})})}end(){return new ut(Er.cloneWith(this.#e.node,{isStatement:!1}))}endCase(){return new ut(Er.cloneWith(this.#e.node,{isStatement:!0}))}}class o_{#e;constructor(e){this.#e=p(e)}end(){return new ut(Er.cloneWith(this.#e.node,{isStatement:!1}))}endCase(){return new ut(Er.cloneWith(this.#e.node,{isStatement:!0}))}}const su=p({is(t){return t.kind==="JSONPathLegNode"},create(t,e){return p({kind:"JSONPathLegNode",type:t,value:e})}});class la{#e;constructor(e){this.#e=e}at(e){return this.#t("ArrayLocation",e)}key(e){return this.#t("Member",e)}#t(e,r){return As.is(this.#e)?new Pi(As.cloneWithTraversal(this.#e,qi.is(this.#e.traversal)?qi.cloneWithLeg(this.#e.traversal,su.create(e,r)):Ec.cloneWithValue(this.#e.traversal,hr.createImmediate(r)))):new Pi(qi.cloneWithLeg(this.#e,su.create(e,r)))}}class Pi extends la{#e;constructor(e){super(e),this.#e=e}get expressionType(){}as(e){return new a_(this,e)}$castTo(){return new Pi(this.#e)}$notNull(){return new Pi(this.#e)}toOperationNode(){return this.#e}}class a_{#e;#t;constructor(e,r){this.#e=e,this.#t=r}get expression(){return this.#e}get alias(){return this.#t}toOperationNode(){return rn.create(this.#e.toOperationNode(),tr(this.#t)?this.#t.toOperationNode():_t.create(this.#t))}}const ou=p({is(t){return t.kind==="TupleNode"},create(t){return p({kind:"TupleNode",values:p(t)})}}),l_=["varchar","char","text","integer","int2","int4","int8","smallint","bigint","boolean","real","double precision","float4","float8","decimal","numeric","binary","bytea","date","datetime","time","timetz","timestamp","timestamptz","serial","bigserial","uuid","json","jsonb","blob","varbinary","int4range","int4multirange","int8range","int8multirange","numrange","nummultirange","tsrange","tsmultirange","tstzrange","tstzmultirange","daterange","datemultirange"],c_=[/^varchar\(\d+\)$/,/^char\(\d+\)$/,/^decimal\(\d+, \d+\)$/,/^numeric\(\d+, \d+\)$/,/^binary\(\d+\)$/,/^datetime\(\d+\)$/,/^time\(\d+\)$/,/^timetz\(\d+\)$/,/^timestamp\(\d+\)$/,/^timestamptz\(\d+\)$/,/^varbinary\(\d+\)$/],u_=p({is(t){return t.kind==="DataTypeNode"},create(t){return p({kind:"DataTypeNode",dataType:t})}});function d_(t){return!!(l_.includes(t)||c_.some(e=>e.test(t)))}function On(t){if(tr(t))return t.toOperationNode();if(d_(t))return u_.create(t);throw new Error(`invalid column data type ${JSON.stringify(t)}`)}const f_=p({is(t){return t.kind==="CastNode"},create(t,e){return p({kind:"CastNode",expression:t,dataType:e})}});function ca(t=sa){function e(s,a,d){return new ut(Zo(s,a,d))}function r(s,a){return new ut(i_(s,a))}const n=Object.assign(e,{fn:void 0,eb:void 0,selectFrom(s){return aa({queryId:Tt(),executor:t,queryNode:gt.createFrom(ai(s))})},case(s){return new nu({node:Er.create(tn(s)?void 0:nr(s))})},ref(s,a){return tn(a)?new ut(on(s)):new la(cm(s,a))},jsonPath(){return new la(qi.create())},table(s){return new ut(It(s))},val(s){return new ut(Rt(s))},refTuple(...s){return new ut(ou.create(s.map(nr)))},tuple(...s){return new ut(ou.create(s.map(Rt)))},lit(s){return new ut(Yo(s))},unary:r,not(s){return r("not",s)},exists(s){return r("exists",s)},neg(s){return r("-",s)},between(s,a,d){return new ut(Xn.create(nr(s),sn.create("between"),nn.create(Rt(a),Rt(d))))},betweenSymmetric(s,a,d){return new ut(Xn.create(nr(s),sn.create("between symmetric"),nn.create(Rt(a),Rt(d))))},and(s){return Lr(s)?new ut(Is(s,"and")):new ut(Ic(s,"and"))},or(s){return Lr(s)?new ut(Is(s,"or")):new ut(Ic(s,"or"))},parens(...s){const a=Ut(s);return Dr.is(a)?new ut(a):new ut(Dr.create(a))},cast(s,a){return new ut(f_.create(nr(s),On(a)))},withSchema(s){return ca(t.withPluginAtFront(new ni(s)))}});return n.fn=ru(),n.eb=n,n}function oi(t){return ca()}function Tn(t){if(tr(t))return t.toOperationNode();if(Yt(t))return t(oi()).toOperationNode();throw new Error(`invalid expression: ${JSON.stringify(t)}`)}function au(t){if(tr(t))return t.toOperationNode();if(Yt(t))return t(oi()).toOperationNode();throw new Error(`invalid aliased expression: ${JSON.stringify(t)}`)}function Fi(t){return wc(t)||em(t)||Yt(t)}class h_{#e;get table(){return this.#e}constructor(e){this.#e=e}as(e){return new p_(this.#e,e)}}class p_{#e;#t;get table(){return this.#e}get alias(){return this.#t}constructor(e,r){this.#e=e,this.#t=r}toOperationNode(){return rn.create(It(this.#e),_t.create(this.#t))}}function m_(t){return fr(t)&&tr(t)&&zt(t.table)&&zt(t.alias)}function ai(t){return Lr(t)?t.map(e=>Ri(e)):[Ri(t)]}function Ri(t){return zt(t)?lu(t):m_(t)?t.toOperationNode():au(t)}function lu(t){const e=" as ";if(t.includes(e)){const[r,n]=t.split(e).map(cu);return rn.create(It(r),_t.create(n))}else return It(t)}function It(t){if(t.includes(".")){const[r,n]=t.split(".").map(cu);return qr.createWithSchema(r,n)}else return qr.create(t)}function cu(t){return t.trim()}const uu=p({is(t){return t.kind==="AddColumnNode"},create(t){return p({kind:"AddColumnNode",column:t})}}),Nt=p({is(t){return t.kind==="ColumnDefinitionNode"},create(t,e){return p({kind:"ColumnDefinitionNode",column:Ot.create(t),dataType:e})},cloneWithFrontModifier(t,e){return p({...t,frontModifiers:t.frontModifiers?p([...t.frontModifiers,e]):[e]})},cloneWithEndModifier(t,e){return p({...t,endModifiers:t.endModifiers?p([...t.endModifiers,e]):[e]})},cloneWith(t,e){return p({...t,...e})}}),du=p({is(t){return t.kind==="DropColumnNode"},create(t){return p({kind:"DropColumnNode",column:Ot.create(t)})}}),fu=p({is(t){return t.kind==="RenameColumnNode"},create(t,e){return p({kind:"RenameColumnNode",column:Ot.create(t),renameTo:Ot.create(e)})}}),ua=p({is(t){return t.kind==="CheckConstraintNode"},create(t,e){return p({kind:"CheckConstraintNode",expression:t,name:e?_t.create(e):void 0})}}),__=["no action","restrict","cascade","set null","set default"],Ms=p({is(t){return t.kind==="ReferencesNode"},create(t,e){return p({kind:"ReferencesNode",table:t,columns:p([...e])})},cloneWithOnDelete(t,e){return p({...t,onDelete:e})},cloneWithOnUpdate(t,e){return p({...t,onUpdate:e})}});function hu(t){return tr(t)?t.toOperationNode():hr.createImmediate(t)}const Us=p({is(t){return t.kind==="GeneratedNode"},create(t){return p({kind:"GeneratedNode",...t})},createWithExpression(t){return p({kind:"GeneratedNode",always:!0,expression:t})},cloneWith(t,e){return p({...t,...e})}}),g_=p({is(t){return t.kind==="DefaultValueNode"},create(t){return p({kind:"DefaultValueNode",defaultValue:t})}});function $s(t){if(__.includes(t))return t;throw new Error(`invalid OnModifyForeignAction ${t}`)}class wt{#e;constructor(e){this.#e=e}autoIncrement(){return new wt(Nt.cloneWith(this.#e,{autoIncrement:!0}))}identity(){return new wt(Nt.cloneWith(this.#e,{identity:!0}))}primaryKey(){return new wt(Nt.cloneWith(this.#e,{primaryKey:!0}))}references(e){const r=on(e);if(!r.table||Jo.is(r.column))throw new Error(`invalid call references('${e}'). The reference must have format table.column or schema.table.column`);return new wt(Nt.cloneWith(this.#e,{references:Ms.create(r.table,[r.column])}))}onDelete(e){if(!this.#e.references)throw new Error("on delete constraint can only be added for foreign keys");return new wt(Nt.cloneWith(this.#e,{references:Ms.cloneWithOnDelete(this.#e.references,$s(e))}))}onUpdate(e){if(!this.#e.references)throw new Error("on update constraint can only be added for foreign keys");return new wt(Nt.cloneWith(this.#e,{references:Ms.cloneWithOnUpdate(this.#e.references,$s(e))}))}unique(){return new wt(Nt.cloneWith(this.#e,{unique:!0}))}notNull(){return new wt(Nt.cloneWith(this.#e,{notNull:!0}))}unsigned(){return new wt(Nt.cloneWith(this.#e,{unsigned:!0}))}defaultTo(e){return new wt(Nt.cloneWith(this.#e,{defaultTo:g_.create(hu(e))}))}check(e){return new wt(Nt.cloneWith(this.#e,{check:ua.create(e.toOperationNode())}))}generatedAlwaysAs(e){return new wt(Nt.cloneWith(this.#e,{generated:Us.createWithExpression(e.toOperationNode())}))}generatedAlwaysAsIdentity(){return new wt(Nt.cloneWith(this.#e,{generated:Us.create({identity:!0,always:!0})}))}generatedByDefaultAsIdentity(){return new wt(Nt.cloneWith(this.#e,{generated:Us.create({identity:!0,byDefault:!0})}))}stored(){if(!this.#e.generated)throw new Error("stored() can only be called after generatedAlwaysAs");return new wt(Nt.cloneWith(this.#e,{generated:Us.cloneWith(this.#e.generated,{stored:!0})}))}modifyFront(e){return new wt(Nt.cloneWithFrontModifier(this.#e,e.toOperationNode()))}nullsNotDistinct(){return new wt(Nt.cloneWith(this.#e,{nullsNotDistinct:!0}))}ifNotExists(){return new wt(Nt.cloneWith(this.#e,{ifNotExists:!0}))}modifyEnd(e){return new wt(Nt.cloneWithEndModifier(this.#e,e.toOperationNode()))}$call(e){return e(this)}toOperationNode(){return this.#e}}const pu=p({is(t){return t.kind==="ModifyColumnNode"},create(t){return p({kind:"ModifyColumnNode",column:t})}}),un=p({is(t){return t.kind==="ForeignKeyConstraintNode"},create(t,e,r,n){return p({kind:"ForeignKeyConstraintNode",columns:t,references:Ms.create(e,r),name:n?_t.create(n):void 0})},cloneWith(t,e){return p({...t,...e})}});class Ur{#e;constructor(e){this.#e=e}onDelete(e){return new Ur(un.cloneWith(this.#e,{onDelete:$s(e)}))}onUpdate(e){return new Ur(un.cloneWith(this.#e,{onUpdate:$s(e)}))}deferrable(){return new Ur(un.cloneWith(this.#e,{deferrable:!0}))}notDeferrable(){return new Ur(un.cloneWith(this.#e,{deferrable:!1}))}initiallyDeferred(){return new Ur(un.cloneWith(this.#e,{initiallyDeferred:!0}))}initiallyImmediate(){return new Ur(un.cloneWith(this.#e,{initiallyDeferred:!1}))}$call(e){return e(this)}toOperationNode(){return this.#e}}const Bs=p({is(t){return t.kind==="AddConstraintNode"},create(t){return p({kind:"AddConstraintNode",constraint:t})}}),In=p({is(t){return t.kind==="UniqueConstraintNode"},create(t,e,r){return p({kind:"UniqueConstraintNode",columns:p(t.map(Ot.create)),name:e?_t.create(e):void 0,nullsNotDistinct:r})},cloneWith(t,e){return p({...t,...e})}}),js=p({is(t){return t.kind==="DropConstraintNode"},create(t){return p({kind:"DropConstraintNode",constraintName:_t.create(t)})},cloneWith(t,e){return p({...t,...e})}}),Wi=p({is(t){return t.kind==="AlterColumnNode"},create(t,e,r){return p({kind:"AlterColumnNode",column:Ot.create(t),[e]:r})}});class mu{#e;constructor(e){this.#e=e}setDataType(e){return new Di(Wi.create(this.#e,"dataType",On(e)))}setDefault(e){return new Di(Wi.create(this.#e,"setDefault",hu(e)))}dropDefault(){return new Di(Wi.create(this.#e,"dropDefault",!0))}setNotNull(){return new Di(Wi.create(this.#e,"setNotNull",!0))}dropNotNull(){return new Di(Wi.create(this.#e,"dropNotNull",!0))}$call(e){return e(this)}}class Di{#e;constructor(e){this.#e=e}toOperationNode(){return this.#e}}class li{#e;constructor(e){this.#e=p(e)}toOperationNode(){return this.#e.executor.transformQuery(this.#e.node,this.#e.queryId)}compile(){return this.#e.executor.compileQuery(this.toOperationNode(),this.#e.queryId)}async execute(){await this.#e.executor.executeQuery(this.compile())}}class dn{#e;constructor(e){this.#e=p(e)}onDelete(e){return new dn({...this.#e,constraintBuilder:this.#e.constraintBuilder.onDelete(e)})}onUpdate(e){return new dn({...this.#e,constraintBuilder:this.#e.constraintBuilder.onUpdate(e)})}deferrable(){return new dn({...this.#e,constraintBuilder:this.#e.constraintBuilder.deferrable()})}notDeferrable(){return new dn({...this.#e,constraintBuilder:this.#e.constraintBuilder.notDeferrable()})}initiallyDeferred(){return new dn({...this.#e,constraintBuilder:this.#e.constraintBuilder.initiallyDeferred()})}initiallyImmediate(){return new dn({...this.#e,constraintBuilder:this.#e.constraintBuilder.initiallyImmediate()})}$call(e){return e(this)}toOperationNode(){return this.#e.executor.transformQuery(lt.cloneWithTableProps(this.#e.node,{addConstraint:Bs.create(this.#e.constraintBuilder.toOperationNode())}),this.#e.queryId)}compile(){return this.#e.executor.compileQuery(this.toOperationNode(),this.#e.queryId)}async execute(){await this.#e.executor.executeQuery(this.compile())}}class ci{#e;constructor(e){this.#e=p(e)}ifExists(){return new ci({...this.#e,node:lt.cloneWithTableProps(this.#e.node,{dropConstraint:js.cloneWith(this.#e.node.dropConstraint,{ifExists:!0})})})}cascade(){return new ci({...this.#e,node:lt.cloneWithTableProps(this.#e.node,{dropConstraint:js.cloneWith(this.#e.node.dropConstraint,{modifier:"cascade"})})})}restrict(){return new ci({...this.#e,node:lt.cloneWithTableProps(this.#e.node,{dropConstraint:js.cloneWith(this.#e.node.dropConstraint,{modifier:"restrict"})})})}$call(e){return e(this)}toOperationNode(){return this.#e.executor.transformQuery(this.#e.node,this.#e.queryId)}compile(){return this.#e.executor.compileQuery(this.toOperationNode(),this.#e.queryId)}async execute(){await this.#e.executor.executeQuery(this.compile())}}const ui=p({is(t){return t.kind==="PrimaryKeyConstraintNode"},create(t,e){return p({kind:"PrimaryKeyConstraintNode",columns:p(t.map(Ot.create)),name:e?_t.create(e):void 0})},cloneWith(t,e){return p({...t,...e})}}),di=p({is(t){return t.kind==="AddIndexNode"},create(t){return p({kind:"AddIndexNode",name:_t.create(t)})},cloneWith(t,e){return p({...t,...e})},cloneWithColumns(t,e){return p({...t,columns:[...t.columns||[],...e]})}});class Cn{#e;constructor(e){this.#e=p(e)}unique(){return new Cn({...this.#e,node:lt.cloneWithTableProps(this.#e.node,{addIndex:di.cloneWith(this.#e.node.addIndex,{unique:!0})})})}column(e){return new Cn({...this.#e,node:lt.cloneWithTableProps(this.#e.node,{addIndex:di.cloneWithColumns(this.#e.node.addIndex,[Os(e)])})})}columns(e){return new Cn({...this.#e,node:lt.cloneWithTableProps(this.#e.node,{addIndex:di.cloneWithColumns(this.#e.node.addIndex,e.map(Os))})})}expression(e){return new Cn({...this.#e,node:lt.cloneWithTableProps(this.#e.node,{addIndex:di.cloneWithColumns(this.#e.node.addIndex,[e.toOperationNode()])})})}using(e){return new Cn({...this.#e,node:lt.cloneWithTableProps(this.#e.node,{addIndex:di.cloneWith(this.#e.node.addIndex,{using:rr.createWithSql(e)})})})}$call(e){return e(this)}toOperationNode(){return this.#e.executor.transformQuery(this.#e.node,this.#e.queryId)}compile(){return this.#e.executor.compileQuery(this.toOperationNode(),this.#e.queryId)}async execute(){await this.#e.executor.executeQuery(this.compile())}}class fn{#e;constructor(e){this.#e=e}nullsNotDistinct(){return new fn(In.cloneWith(this.#e,{nullsNotDistinct:!0}))}deferrable(){return new fn(In.cloneWith(this.#e,{deferrable:!0}))}notDeferrable(){return new fn(In.cloneWith(this.#e,{deferrable:!1}))}initiallyDeferred(){return new fn(In.cloneWith(this.#e,{initiallyDeferred:!0}))}initiallyImmediate(){return new fn(In.cloneWith(this.#e,{initiallyDeferred:!1}))}$call(e){return e(this)}toOperationNode(){return this.#e}}class Ln{#e;constructor(e){this.#e=e}deferrable(){return new Ln(ui.cloneWith(this.#e,{deferrable:!0}))}notDeferrable(){return new Ln(ui.cloneWith(this.#e,{deferrable:!1}))}initiallyDeferred(){return new Ln(ui.cloneWith(this.#e,{initiallyDeferred:!0}))}initiallyImmediate(){return new Ln(ui.cloneWith(this.#e,{initiallyDeferred:!1}))}$call(e){return e(this)}toOperationNode(){return this.#e}}class _u{#e;constructor(e){this.#e=e}$call(e){return e(this)}toOperationNode(){return this.#e}}const y_=p({is(t){return t.kind==="RenameConstraintNode"},create(t,e){return p({kind:"RenameConstraintNode",oldName:_t.create(t),newName:_t.create(e)})}});class b_{#e;constructor(e){this.#e=p(e)}renameTo(e){return new li({...this.#e,node:lt.cloneWithTableProps(this.#e.node,{renameTo:It(e)})})}setSchema(e){return new li({...this.#e,node:lt.cloneWithTableProps(this.#e.node,{setSchema:_t.create(e)})})}alterColumn(e,r){const n=r(new mu(e));return new pr({...this.#e,node:lt.cloneWithColumnAlteration(this.#e.node,n.toOperationNode())})}dropColumn(e){return new pr({...this.#e,node:lt.cloneWithColumnAlteration(this.#e.node,du.create(e))})}renameColumn(e,r){return new pr({...this.#e,node:lt.cloneWithColumnAlteration(this.#e.node,fu.create(e,r))})}addColumn(e,r,n=Zt){const s=n(new wt(Nt.create(e,On(r))));return new pr({...this.#e,node:lt.cloneWithColumnAlteration(this.#e.node,uu.create(s.toOperationNode()))})}modifyColumn(e,r,n=Zt){const s=n(new wt(Nt.create(e,On(r))));return new pr({...this.#e,node:lt.cloneWithColumnAlteration(this.#e.node,pu.create(s.toOperationNode()))})}addUniqueConstraint(e,r,n=Zt){const s=n(new fn(In.create(r,e)));return new li({...this.#e,node:lt.cloneWithTableProps(this.#e.node,{addConstraint:Bs.create(s.toOperationNode())})})}addCheckConstraint(e,r,n=Zt){const s=n(new _u(ua.create(r.toOperationNode(),e)));return new li({...this.#e,node:lt.cloneWithTableProps(this.#e.node,{addConstraint:Bs.create(s.toOperationNode())})})}addForeignKeyConstraint(e,r,n,s,a=Zt){const d=a(new Ur(un.create(r.map(Ot.create),It(n),s.map(Ot.create),e)));return new dn({...this.#e,constraintBuilder:d})}addPrimaryKeyConstraint(e,r,n=Zt){const s=n(new Ln(ui.create(r,e)));return new li({...this.#e,node:lt.cloneWithTableProps(this.#e.node,{addConstraint:Bs.create(s.toOperationNode())})})}dropConstraint(e){return new ci({...this.#e,node:lt.cloneWithTableProps(this.#e.node,{dropConstraint:js.create(e)})})}renameConstraint(e,r){return new ci({...this.#e,node:lt.cloneWithTableProps(this.#e.node,{renameConstraint:y_.create(e,r)})})}addIndex(e){return new Cn({...this.#e,node:lt.cloneWithTableProps(this.#e.node,{addIndex:di.create(e)})})}dropIndex(e){return new li({...this.#e,node:lt.cloneWithTableProps(this.#e.node,{dropIndex:vi.create(e)})})}$call(e){return e(this)}}class pr{#e;constructor(e){this.#e=p(e)}alterColumn(e,r){const n=r(new mu(e));return new pr({...this.#e,node:lt.cloneWithColumnAlteration(this.#e.node,n.toOperationNode())})}dropColumn(e){return new pr({...this.#e,node:lt.cloneWithColumnAlteration(this.#e.node,du.create(e))})}renameColumn(e,r){return new pr({...this.#e,node:lt.cloneWithColumnAlteration(this.#e.node,fu.create(e,r))})}addColumn(e,r,n=Zt){const s=n(new wt(Nt.create(e,On(r))));return new pr({...this.#e,node:lt.cloneWithColumnAlteration(this.#e.node,uu.create(s.toOperationNode()))})}modifyColumn(e,r,n=Zt){const s=n(new wt(Nt.create(e,On(r))));return new pr({...this.#e,node:lt.cloneWithColumnAlteration(this.#e.node,pu.create(s.toOperationNode()))})}toOperationNode(){return this.#e.executor.transformQuery(this.#e.node,this.#e.queryId)}compile(){return this.#e.executor.compileQuery(this.toOperationNode(),this.#e.queryId)}async execute(){await this.#e.executor.executeQuery(this.compile())}}class gu extends Jc{transformPrimitiveValueList(e){return Ts.create(e.values.map(hr.createImmediate))}transformValue(e){return hr.createImmediate(e.value)}}class mr{#e;constructor(e){this.#e=p(e)}ifNotExists(){return new mr({...this.#e,node:Pr.cloneWith(this.#e.node,{ifNotExists:!0})})}unique(){return new mr({...this.#e,node:Pr.cloneWith(this.#e.node,{unique:!0})})}nullsNotDistinct(){return new mr({...this.#e,node:Pr.cloneWith(this.#e.node,{nullsNotDistinct:!0})})}on(e){return new mr({...this.#e,node:Pr.cloneWith(this.#e.node,{table:It(e)})})}column(e){return new mr({...this.#e,node:Pr.cloneWithColumns(this.#e.node,[Os(e)])})}columns(e){return new mr({...this.#e,node:Pr.cloneWithColumns(this.#e.node,e.map(Os))})}expression(e){return new mr({...this.#e,node:Pr.cloneWithColumns(this.#e.node,[e.toOperationNode()])})}using(e){return new mr({...this.#e,node:Pr.cloneWith(this.#e.node,{using:rr.createWithSql(e)})})}where(...e){const r=new gu;return new mr({...this.#e,node:Te.cloneWithWhere(this.#e.node,r.transformNode(Ut(e),this.#e.queryId))})}$call(e){return e(this)}toOperationNode(){return this.#e.executor.transformQuery(this.#e.node,this.#e.queryId)}compile(){return this.#e.executor.compileQuery(this.toOperationNode(),this.#e.queryId)}async execute(){await this.#e.executor.executeQuery(this.compile())}}class da{#e;constructor(e){this.#e=p(e)}ifNotExists(){return new da({...this.#e,node:bc.cloneWith(this.#e.node,{ifNotExists:!0})})}$call(e){return e(this)}toOperationNode(){return this.#e.executor.transformQuery(this.#e.node,this.#e.queryId)}compile(){return this.#e.executor.compileQuery(this.toOperationNode(),this.#e.queryId)}async execute(){await this.#e.executor.executeQuery(this.compile())}}function w_(t){if(Zp.includes(t))return t;throw new Error(`invalid OnCommitAction ${t}`)}class ar{#e;constructor(e){this.#e=p(e)}temporary(){return new ar({...this.#e,node:er.cloneWith(this.#e.node,{temporary:!0})})}onCommit(e){return new ar({...this.#e,node:er.cloneWith(this.#e.node,{onCommit:w_(e)})})}ifNotExists(){return new ar({...this.#e,node:er.cloneWith(this.#e.node,{ifNotExists:!0})})}addColumn(e,r,n=Zt){const s=n(new wt(Nt.create(e,On(r))));return new ar({...this.#e,node:er.cloneWithColumn(this.#e.node,s.toOperationNode())})}addPrimaryKeyConstraint(e,r,n=Zt){const s=n(new Ln(ui.create(r,e)));return new ar({...this.#e,node:er.cloneWithConstraint(this.#e.node,s.toOperationNode())})}addUniqueConstraint(e,r,n=Zt){const s=n(new fn(In.create(r,e)));return new ar({...this.#e,node:er.cloneWithConstraint(this.#e.node,s.toOperationNode())})}addCheckConstraint(e,r,n=Zt){const s=n(new _u(ua.create(r.toOperationNode(),e)));return new ar({...this.#e,node:er.cloneWithConstraint(this.#e.node,s.toOperationNode())})}addForeignKeyConstraint(e,r,n,s,a=Zt){const d=a(new Ur(un.create(r.map(Ot.create),It(n),s.map(Ot.create),e)));return new ar({...this.#e,node:er.cloneWithConstraint(this.#e.node,d.toOperationNode())})}modifyFront(e){return new ar({...this.#e,node:er.cloneWithFrontModifier(this.#e.node,e.toOperationNode())})}modifyEnd(e){return new ar({...this.#e,node:er.cloneWithEndModifier(this.#e.node,e.toOperationNode())})}as(e){return new ar({...this.#e,node:er.cloneWith(this.#e.node,{selectQuery:Tn(e)})})}$call(e){return e(this)}toOperationNode(){return this.#e.executor.transformQuery(this.#e.node,this.#e.queryId)}compile(){return this.#e.executor.compileQuery(this.toOperationNode(),this.#e.queryId)}async execute(){await this.#e.executor.executeQuery(this.compile())}}class Mi{#e;constructor(e){this.#e=p(e)}on(e){return new Mi({...this.#e,node:vi.cloneWith(this.#e.node,{table:It(e)})})}ifExists(){return new Mi({...this.#e,node:vi.cloneWith(this.#e.node,{ifExists:!0})})}cascade(){return new Mi({...this.#e,node:vi.cloneWith(this.#e.node,{cascade:!0})})}$call(e){return e(this)}toOperationNode(){return this.#e.executor.transformQuery(this.#e.node,this.#e.queryId)}compile(){return this.#e.executor.compileQuery(this.toOperationNode(),this.#e.queryId)}async execute(){await this.#e.executor.executeQuery(this.compile())}}class zs{#e;constructor(e){this.#e=p(e)}ifExists(){return new zs({...this.#e,node:Vo.cloneWith(this.#e.node,{ifExists:!0})})}cascade(){return new zs({...this.#e,node:Vo.cloneWith(this.#e.node,{cascade:!0})})}$call(e){return e(this)}toOperationNode(){return this.#e.executor.transformQuery(this.#e.node,this.#e.queryId)}compile(){return this.#e.executor.compileQuery(this.toOperationNode(),this.#e.queryId)}async execute(){await this.#e.executor.executeQuery(this.compile())}}class Vs{#e;constructor(e){this.#e=p(e)}ifExists(){return new Vs({...this.#e,node:Qo.cloneWith(this.#e.node,{ifExists:!0})})}cascade(){return new Vs({...this.#e,node:Qo.cloneWith(this.#e.node,{cascade:!0})})}$call(e){return e(this)}toOperationNode(){return this.#e.executor.transformQuery(this.#e.node,this.#e.queryId)}compile(){return this.#e.executor.compileQuery(this.toOperationNode(),this.#e.queryId)}async execute(){await this.#e.executor.executeQuery(this.compile())}}const hn=p({is(t){return t.kind==="CreateViewNode"},create(t){return p({kind:"CreateViewNode",name:Fr.create(t)})},cloneWith(t,e){return p({...t,...e})}});class x_{#e=new gu;transformQuery(e){return this.#e.transformNode(e.node,e.queryId)}transformResult(e){return Promise.resolve(e.result)}}class pn{#e;constructor(e){this.#e=p(e)}temporary(){return new pn({...this.#e,node:hn.cloneWith(this.#e.node,{temporary:!0})})}materialized(){return new pn({...this.#e,node:hn.cloneWith(this.#e.node,{materialized:!0})})}ifNotExists(){return new pn({...this.#e,node:hn.cloneWith(this.#e.node,{ifNotExists:!0})})}orReplace(){return new pn({...this.#e,node:hn.cloneWith(this.#e.node,{orReplace:!0})})}columns(e){return new pn({...this.#e,node:hn.cloneWith(this.#e.node,{columns:e.map(Oc)})})}as(e){const r=e.withPlugin(new x_).toOperationNode();return new pn({...this.#e,node:hn.cloneWith(this.#e.node,{as:r})})}$call(e){return e(this)}toOperationNode(){return this.#e.executor.transformQuery(this.#e.node,this.#e.queryId)}compile(){return this.#e.executor.compileQuery(this.toOperationNode(),this.#e.queryId)}async execute(){await this.#e.executor.executeQuery(this.compile())}}const Qs=p({is(t){return t.kind==="DropViewNode"},create(t){return p({kind:"DropViewNode",name:Fr.create(t)})},cloneWith(t,e){return p({...t,...e})}});class Ui{#e;constructor(e){this.#e=p(e)}materialized(){return new Ui({...this.#e,node:Qs.cloneWith(this.#e.node,{materialized:!0})})}ifExists(){return new Ui({...this.#e,node:Qs.cloneWith(this.#e.node,{ifExists:!0})})}cascade(){return new Ui({...this.#e,node:Qs.cloneWith(this.#e.node,{cascade:!0})})}$call(e){return e(this)}toOperationNode(){return this.#e.executor.transformQuery(this.#e.node,this.#e.queryId)}compile(){return this.#e.executor.compileQuery(this.toOperationNode(),this.#e.queryId)}async execute(){await this.#e.executor.executeQuery(this.compile())}}const yu=p({is(t){return t.kind==="CreateTypeNode"},create(t){return p({kind:"CreateTypeNode",name:t})},cloneWithEnum(t,e){return p({...t,enum:Ts.create(e.map(hr.createImmediate))})}});class fa{#e;constructor(e){this.#e=p(e)}toOperationNode(){return this.#e.executor.transformQuery(this.#e.node,this.#e.queryId)}asEnum(e){return new fa({...this.#e,node:yu.cloneWithEnum(this.#e.node,e)})}$call(e){return e(this)}compile(){return this.#e.executor.compileQuery(this.toOperationNode(),this.#e.queryId)}async execute(){await this.#e.executor.executeQuery(this.compile())}}const bu=p({is(t){return t.kind==="DropTypeNode"},create(t){return p({kind:"DropTypeNode",name:t})},cloneWith(t,e){return p({...t,...e})}});class ha{#e;constructor(e){this.#e=p(e)}ifExists(){return new ha({...this.#e,node:bu.cloneWith(this.#e.node,{ifExists:!0})})}$call(e){return e(this)}toOperationNode(){return this.#e.executor.transformQuery(this.#e.node,this.#e.queryId)}compile(){return this.#e.executor.compileQuery(this.toOperationNode(),this.#e.queryId)}async execute(){await this.#e.executor.executeQuery(this.compile())}}function wu(t){if(t.includes(".")){const r=t.split(".").map(N_);if(r.length===2)return Fr.createWithSchema(r[0],r[1]);throw new Error(`invalid schemable identifier ${t}`)}else return Fr.create(t)}function N_(t){return t.trim()}const Hs=p({is(t){return t.kind==="RefreshMaterializedViewNode"},create(t){return p({kind:"RefreshMaterializedViewNode",name:Fr.create(t)})},cloneWith(t,e){return p({...t,...e})}});class $i{#e;constructor(e){this.#e=p(e)}concurrently(){return new $i({...this.#e,node:Hs.cloneWith(this.#e.node,{concurrently:!0,withNoData:!1})})}withData(){return new $i({...this.#e,node:Hs.cloneWith(this.#e.node,{withNoData:!1})})}withNoData(){return new $i({...this.#e,node:Hs.cloneWith(this.#e.node,{withNoData:!0,concurrently:!1})})}$call(e){return e(this)}toOperationNode(){return this.#e.executor.transformQuery(this.#e.node,this.#e.queryId)}compile(){return this.#e.executor.compileQuery(this.toOperationNode(),this.#e.queryId)}async execute(){await this.#e.executor.executeQuery(this.compile())}}class Bi{#e;constructor(e){this.#e=e}createTable(e){return new ar({queryId:Tt(),executor:this.#e,node:er.create(It(e))})}dropTable(e){return new Vs({queryId:Tt(),executor:this.#e,node:Qo.create(It(e))})}createIndex(e){return new mr({queryId:Tt(),executor:this.#e,node:Pr.create(e)})}dropIndex(e){return new Mi({queryId:Tt(),executor:this.#e,node:vi.create(e)})}createSchema(e){return new da({queryId:Tt(),executor:this.#e,node:bc.create(e)})}dropSchema(e){return new zs({queryId:Tt(),executor:this.#e,node:Vo.create(e)})}alterTable(e){return new b_({queryId:Tt(),executor:this.#e,node:lt.create(It(e))})}createView(e){return new pn({queryId:Tt(),executor:this.#e,node:hn.create(e)})}refreshMaterializedView(e){return new $i({queryId:Tt(),executor:this.#e,node:Hs.create(e)})}dropView(e){return new Ui({queryId:Tt(),executor:this.#e,node:Qs.create(e)})}createType(e){return new fa({queryId:Tt(),executor:this.#e,node:yu.create(wu(e))})}dropType(e){return new ha({queryId:Tt(),executor:this.#e,node:bu.create(wu(e))})}withPlugin(e){return new Bi(this.#e.withPlugin(e))}withoutPlugins(){return new Bi(this.#e.withoutPlugins())}withSchema(e){return new Bi(this.#e.withPluginAtFront(new ni(e)))}}class v_{ref(e){return new om(e)}table(e){return new h_(e)}}class q_{#e;constructor(e){this.#e=e}async provideConnection(e){const r=await this.#e.acquireConnection();try{return await e(r)}finally{await this.#e.releaseConnection(r)}}}class Pn extends Yc{#e;#t;#r;constructor(e,r,n,s=[]){super(s),this.#e=e,this.#t=r,this.#r=n}get adapter(){return this.#t}compileQuery(e,r){return this.#e.compileQuery(e,r)}provideConnection(e){return this.#r.provideConnection(e)}withPlugins(e){return new Pn(this.#e,this.#t,this.#r,[...this.plugins,...e])}withPlugin(e){return new Pn(this.#e,this.#t,this.#r,[...this.plugins,e])}withPluginAtFront(e){return new Pn(this.#e,this.#t,this.#r,[e,...this.plugins])}withConnectionProvider(e){return new Pn(this.#e,this.#t,e,[...this.plugins])}withoutPlugins(){return new Pn(this.#e,this.#t,this.#r,[])}}function pa(){return typeof performance<"u"&&Yt(performance.now)?performance.now():Date.now()}class S_{#e;#t;#r;#s;#i;#o=new WeakSet;constructor(e,r){this.#s=!1,this.#e=e,this.#t=r}async init(){if(this.#i)throw new Error("driver has already been destroyed");this.#r||(this.#r=this.#e.init().then(()=>{this.#s=!0}).catch(e=>(this.#r=void 0,Promise.reject(e)))),await this.#r}async acquireConnection(){if(this.#i)throw new Error("driver has already been destroyed");this.#s||await this.init();const e=await this.#e.acquireConnection();return this.#o.has(e)||(this.#c()&&this.#n(e),this.#o.add(e)),e}async releaseConnection(e){await this.#e.releaseConnection(e)}beginTransaction(e,r){return this.#e.beginTransaction(e,r)}commitTransaction(e){return this.#e.commitTransaction(e)}rollbackTransaction(e){return this.#e.rollbackTransaction(e)}savepoint(e,r,n){if(this.#e.savepoint)return this.#e.savepoint(e,r,n);throw new Error("The `savepoint` method is not supported by this driver")}rollbackToSavepoint(e,r,n){if(this.#e.rollbackToSavepoint)return this.#e.rollbackToSavepoint(e,r,n);throw new Error("The `rollbackToSavepoint` method is not supported by this driver")}releaseSavepoint(e,r,n){if(this.#e.releaseSavepoint)return this.#e.releaseSavepoint(e,r,n);throw new Error("The `releaseSavepoint` method is not supported by this driver")}async destroy(){this.#r&&(await this.#r,this.#i||(this.#i=this.#e.destroy().catch(e=>(this.#i=void 0,Promise.reject(e)))),await this.#i)}#c(){return this.#t.isLevelEnabled("query")||this.#t.isLevelEnabled("error")}#n(e){const r=e.executeQuery,n=e.streamQuery,s=this;e.executeQuery=async a=>{let d;const g=pa();try{return await r.call(e,a)}catch(x){throw d=x,await s.#l(x,a,g),x}finally{d||await s.#a(a,g)}},e.streamQuery=async function*(a,d){let g;const x=pa();try{for await(const N of n.call(e,a,d))yield N}catch(N){throw g=N,await s.#l(N,a,x),N}finally{g||await s.#a(a,x,!0)}}}async#l(e,r,n){await this.#t.error(()=>({level:"error",error:e,query:r,queryDurationMillis:this.#u(n)}))}async#a(e,r,n=!1){await this.#t.query(()=>({level:"query",isStream:n,query:e,queryDurationMillis:this.#u(r)}))}#u(e){return pa()-e}}const k_=()=>{};class ma{#e;#t;constructor(e){this.#e=e}async provideConnection(e){for(;this.#t;)await this.#t.catch(k_);return this.#t=this.#r(e).finally(()=>{this.#t=void 0}),this.#t}async#r(e){return await e(this.#e)}}const E_=["read only","read write"],A_=["read uncommitted","read committed","repeatable read","serializable","snapshot"];function xu(t){if(t.accessMode&&!E_.includes(t.accessMode))throw new Error(`invalid transaction access mode ${t.accessMode}`);if(t.isolationLevel&&!A_.includes(t.isolationLevel))throw new Error(`invalid transaction isolation level ${t.isolationLevel}`)}p(["query","error"]);class O_{#e;#t;constructor(e){Yt(e)?(this.#t=e,this.#e=p({query:!0,error:!0})):(this.#t=T_,this.#e=p({query:e.includes("query"),error:e.includes("error")}))}isLevelEnabled(e){return this.#e[e]}async query(e){this.#e.query&&await this.#t(e())}async error(e){this.#e.error&&await this.#t(e())}}function T_(t){if(t.level==="query"){const e=`kysely:query:${t.isStream?"stream:":""}`;console.log(`${e} ${t.query.sql}`),console.log(`${e} duration: ${t.queryDurationMillis.toFixed(1)}ms`)}else t.level==="error"&&(t.error instanceof Error?console.error(`kysely:error: ${t.error.stack??t.error.message}`):console.error(`kysely:error: ${JSON.stringify({error:t.error,query:t.query.sql,queryDurationMillis:t.queryDurationMillis})}`))}function I_(t){return fr(t)&&Yt(t.compile)}Symbol.asyncDispose??=Symbol("Symbol.asyncDispose");class mn extends ln{#e;constructor(e){let r,n;if(C_(e))r={executor:e.executor},n={...e};else{const s=e.dialect,a=s.createDriver(),d=s.createQueryCompiler(),g=s.createAdapter(),x=new O_(e.log??[]),N=new S_(a,x),S=new q_(N),w=new Pn(d,g,S,e.plugins??[]);r={executor:w},n={config:e,executor:w,dialect:s,driver:N}}super(r),this.#e=p(n)}get schema(){return new Bi(this.#e.executor)}get dynamic(){return new v_}get introspection(){return this.#e.dialect.createIntrospector(this.withoutPlugins())}case(e){return new nu({node:Er.create(tn(e)?void 0:Tn(e))})}get fn(){return ru()}transaction(){return new Js({...this.#e})}startTransaction(){return new Ks({...this.#e})}connection(){return new L_({...this.#e})}withPlugin(e){return new mn({...this.#e,executor:this.#e.executor.withPlugin(e)})}withoutPlugins(){return new mn({...this.#e,executor:this.#e.executor.withoutPlugins()})}withSchema(e){return new mn({...this.#e,executor:this.#e.executor.withPluginAtFront(new ni(e))})}withTables(){return new mn({...this.#e})}async destroy(){await this.#e.driver.destroy()}get isTransaction(){return!1}getExecutor(){return this.#e.executor}executeQuery(e,r){r!==void 0&&Yn("Passing `queryId` in `db.executeQuery` is deprecated and will result in a compile-time error in the future.");const n=I_(e)?e.compile():e;return this.getExecutor().executeQuery(n)}async[Symbol.asyncDispose](){await this.destroy()}}class Fn extends mn{#e;constructor(e){super(e),this.#e=e}get isTransaction(){return!0}transaction(){throw new Error("calling the transaction method for a Transaction is not supported")}connection(){throw new Error("calling the connection method for a Transaction is not supported")}async destroy(){throw new Error("calling the destroy method for a Transaction is not supported")}withPlugin(e){return new Fn({...this.#e,executor:this.#e.executor.withPlugin(e)})}withoutPlugins(){return new Fn({...this.#e,executor:this.#e.executor.withoutPlugins()})}withSchema(e){return new Fn({...this.#e,executor:this.#e.executor.withPluginAtFront(new ni(e))})}withTables(){return new Fn({...this.#e})}}function C_(t){return fr(t)&&fr(t.config)&&fr(t.driver)&&fr(t.executor)&&fr(t.dialect)}class L_{#e;constructor(e){this.#e=p(e)}async execute(e){return this.#e.executor.provideConnection(async r=>{const n=this.#e.executor.withConnectionProvider(new ma(r)),s=new mn({...this.#e,executor:n});return await e(s)})}}class Js{#e;constructor(e){this.#e=p(e)}setAccessMode(e){return new Js({...this.#e,accessMode:e})}setIsolationLevel(e){return new Js({...this.#e,isolationLevel:e})}async execute(e){const{isolationLevel:r,accessMode:n,...s}=this.#e,a={isolationLevel:r,accessMode:n};return xu(a),this.#e.executor.provideConnection(async d=>{const g=this.#e.executor.withConnectionProvider(new ma(d)),x=new Fn({...s,executor:g});let N=!1;try{await this.#e.driver.beginTransaction(d,a),N=!0;const S=await e(x);return await this.#e.driver.commitTransaction(d),S}catch(S){throw N&&await this.#e.driver.rollbackTransaction(d),S}})}}class Ks{#e;constructor(e){this.#e=p(e)}setAccessMode(e){return new Ks({...this.#e,accessMode:e})}setIsolationLevel(e){return new Ks({...this.#e,isolationLevel:e})}async execute(){const{isolationLevel:e,accessMode:r,...n}=this.#e,s={isolationLevel:e,accessMode:r};xu(s);const a=await Xc(this.#e.executor);return await this.#e.driver.beginTransaction(a.connection,s),new $r({...n,connection:a,executor:this.#e.executor.withConnectionProvider(new ma(a.connection))})}}class $r extends Fn{#e;#t;#r;constructor(e){const r={isCommitted:!1,isRolledBack:!1};e={...e,executor:new _n(e.executor,r)};const{connection:n,...s}=e;super(s),this.#e=p(e),this.#r=r;const a=Tt();this.#t=d=>e.executor.compileQuery(d,a)}get isCommitted(){return this.#r.isCommitted}get isRolledBack(){return this.#r.isRolledBack}commit(){return Rn(this.#r),new ji(async()=>{await this.#e.driver.commitTransaction(this.#e.connection.connection),this.#r.isCommitted=!0,this.#e.connection.release()})}rollback(){return Rn(this.#r),new ji(async()=>{await this.#e.driver.rollbackTransaction(this.#e.connection.connection),this.#r.isRolledBack=!0,this.#e.connection.release()})}savepoint(e){return Rn(this.#r),new ji(async()=>(await this.#e.driver.savepoint?.(this.#e.connection.connection,e,this.#t),new $r({...this.#e})))}rollbackToSavepoint(e){return Rn(this.#r),new ji(async()=>(await this.#e.driver.rollbackToSavepoint?.(this.#e.connection.connection,e,this.#t),new $r({...this.#e})))}releaseSavepoint(e){return Rn(this.#r),new ji(async()=>(await this.#e.driver.releaseSavepoint?.(this.#e.connection.connection,e,this.#t),new $r({...this.#e})))}withPlugin(e){return new $r({...this.#e,executor:this.#e.executor.withPlugin(e)})}withoutPlugins(){return new $r({...this.#e,executor:this.#e.executor.withoutPlugins()})}withSchema(e){return new $r({...this.#e,executor:this.#e.executor.withPluginAtFront(new ni(e))})}withTables(){return new $r({...this.#e})}}class ji{#e;constructor(e){this.#e=e}async execute(){return await this.#e()}}function Rn(t){if(t.isCommitted)throw new Error("Transaction is already committed");if(t.isRolledBack)throw new Error("Transaction is already rolled back")}class _n{#e;#t;constructor(e,r){e instanceof _n?this.#e=e.#e:this.#e=e,this.#t=r}get adapter(){return this.#e.adapter}get plugins(){return this.#e.plugins}transformQuery(e,r){return this.#e.transformQuery(e,r)}compileQuery(e,r){return this.#e.compileQuery(e,r)}provideConnection(e){return this.#e.provideConnection(e)}executeQuery(e){return Rn(this.#t),this.#e.executeQuery(e)}stream(e,r){return Rn(this.#t),this.#e.stream(e,r)}withConnectionProvider(e){return new _n(this.#e.withConnectionProvider(e),this.#t)}withPlugin(e){return new _n(this.#e.withPlugin(e),this.#t)}withPlugins(e){return new _n(this.#e.withPlugins(e),this.#t)}withPluginAtFront(e){return new _n(this.#e.withPluginAtFront(e),this.#t)}withoutPlugins(){return new _n(this.#e.withoutPlugins(),this.#t)}}class P_{nodeStack=[];get parentNode(){return this.nodeStack[this.nodeStack.length-2]}#e=p({AliasNode:this.visitAlias.bind(this),ColumnNode:this.visitColumn.bind(this),IdentifierNode:this.visitIdentifier.bind(this),SchemableIdentifierNode:this.visitSchemableIdentifier.bind(this),RawNode:this.visitRaw.bind(this),ReferenceNode:this.visitReference.bind(this),SelectQueryNode:this.visitSelectQuery.bind(this),SelectionNode:this.visitSelection.bind(this),TableNode:this.visitTable.bind(this),FromNode:this.visitFrom.bind(this),SelectAllNode:this.visitSelectAll.bind(this),AndNode:this.visitAnd.bind(this),OrNode:this.visitOr.bind(this),ValueNode:this.visitValue.bind(this),ValueListNode:this.visitValueList.bind(this),PrimitiveValueListNode:this.visitPrimitiveValueList.bind(this),ParensNode:this.visitParens.bind(this),JoinNode:this.visitJoin.bind(this),OperatorNode:this.visitOperator.bind(this),WhereNode:this.visitWhere.bind(this),InsertQueryNode:this.visitInsertQuery.bind(this),DeleteQueryNode:this.visitDeleteQuery.bind(this),ReturningNode:this.visitReturning.bind(this),CreateTableNode:this.visitCreateTable.bind(this),AddColumnNode:this.visitAddColumn.bind(this),ColumnDefinitionNode:this.visitColumnDefinition.bind(this),DropTableNode:this.visitDropTable.bind(this),DataTypeNode:this.visitDataType.bind(this),OrderByNode:this.visitOrderBy.bind(this),OrderByItemNode:this.visitOrderByItem.bind(this),GroupByNode:this.visitGroupBy.bind(this),GroupByItemNode:this.visitGroupByItem.bind(this),UpdateQueryNode:this.visitUpdateQuery.bind(this),ColumnUpdateNode:this.visitColumnUpdate.bind(this),LimitNode:this.visitLimit.bind(this),OffsetNode:this.visitOffset.bind(this),OnConflictNode:this.visitOnConflict.bind(this),OnDuplicateKeyNode:this.visitOnDuplicateKey.bind(this),CreateIndexNode:this.visitCreateIndex.bind(this),DropIndexNode:this.visitDropIndex.bind(this),ListNode:this.visitList.bind(this),PrimaryKeyConstraintNode:this.visitPrimaryKeyConstraint.bind(this),UniqueConstraintNode:this.visitUniqueConstraint.bind(this),ReferencesNode:this.visitReferences.bind(this),CheckConstraintNode:this.visitCheckConstraint.bind(this),WithNode:this.visitWith.bind(this),CommonTableExpressionNode:this.visitCommonTableExpression.bind(this),CommonTableExpressionNameNode:this.visitCommonTableExpressionName.bind(this),HavingNode:this.visitHaving.bind(this),CreateSchemaNode:this.visitCreateSchema.bind(this),DropSchemaNode:this.visitDropSchema.bind(this),AlterTableNode:this.visitAlterTable.bind(this),DropColumnNode:this.visitDropColumn.bind(this),RenameColumnNode:this.visitRenameColumn.bind(this),AlterColumnNode:this.visitAlterColumn.bind(this),ModifyColumnNode:this.visitModifyColumn.bind(this),AddConstraintNode:this.visitAddConstraint.bind(this),DropConstraintNode:this.visitDropConstraint.bind(this),RenameConstraintNode:this.visitRenameConstraint.bind(this),ForeignKeyConstraintNode:this.visitForeignKeyConstraint.bind(this),CreateViewNode:this.visitCreateView.bind(this),RefreshMaterializedViewNode:this.visitRefreshMaterializedView.bind(this),DropViewNode:this.visitDropView.bind(this),GeneratedNode:this.visitGenerated.bind(this),DefaultValueNode:this.visitDefaultValue.bind(this),OnNode:this.visitOn.bind(this),ValuesNode:this.visitValues.bind(this),SelectModifierNode:this.visitSelectModifier.bind(this),CreateTypeNode:this.visitCreateType.bind(this),DropTypeNode:this.visitDropType.bind(this),ExplainNode:this.visitExplain.bind(this),DefaultInsertValueNode:this.visitDefaultInsertValue.bind(this),AggregateFunctionNode:this.visitAggregateFunction.bind(this),OverNode:this.visitOver.bind(this),PartitionByNode:this.visitPartitionBy.bind(this),PartitionByItemNode:this.visitPartitionByItem.bind(this),SetOperationNode:this.visitSetOperation.bind(this),BinaryOperationNode:this.visitBinaryOperation.bind(this),UnaryOperationNode:this.visitUnaryOperation.bind(this),UsingNode:this.visitUsing.bind(this),FunctionNode:this.visitFunction.bind(this),CaseNode:this.visitCase.bind(this),WhenNode:this.visitWhen.bind(this),JSONReferenceNode:this.visitJSONReference.bind(this),JSONPathNode:this.visitJSONPath.bind(this),JSONPathLegNode:this.visitJSONPathLeg.bind(this),JSONOperatorChainNode:this.visitJSONOperatorChain.bind(this),TupleNode:this.visitTuple.bind(this),MergeQueryNode:this.visitMergeQuery.bind(this),MatchedNode:this.visitMatched.bind(this),AddIndexNode:this.visitAddIndex.bind(this),CastNode:this.visitCast.bind(this),FetchNode:this.visitFetch.bind(this),TopNode:this.visitTop.bind(this),OutputNode:this.visitOutput.bind(this),OrActionNode:this.visitOrAction.bind(this),CollateNode:this.visitCollate.bind(this)});visitNode=e=>{this.nodeStack.push(e),this.#e[e.kind](e),this.nodeStack.pop()}}const F_=/'/g;class R_ extends P_{#e="";#t=[];get numParameters(){return this.#t.length}compileQuery(e,r){return this.#e="",this.#t=[],this.nodeStack.splice(0,this.nodeStack.length),this.visitNode(e),p({query:e,queryId:r,sql:this.getSql(),parameters:[...this.#t]})}getSql(){return this.#e}visitSelectQuery(e){const r=this.parentNode!==void 0&&!Dr.is(this.parentNode)&&!Wt.is(this.parentNode)&&!er.is(this.parentNode)&&!hn.is(this.parentNode)&&!eu.is(this.parentNode);this.parentNode===void 0&&e.explain&&(this.visitNode(e.explain),this.append(" ")),r&&this.append("("),e.with&&(this.visitNode(e.with),this.append(" ")),this.append("select"),e.distinctOn&&(this.append(" "),this.compileDistinctOn(e.distinctOn)),e.frontModifiers?.length&&(this.append(" "),this.compileList(e.frontModifiers," ")),e.top&&(this.append(" "),this.visitNode(e.top)),e.selections&&(this.append(" "),this.compileList(e.selections)),e.from&&(this.append(" "),this.visitNode(e.from)),e.joins&&(this.append(" "),this.compileList(e.joins," ")),e.where&&(this.append(" "),this.visitNode(e.where)),e.groupBy&&(this.append(" "),this.visitNode(e.groupBy)),e.having&&(this.append(" "),this.visitNode(e.having)),e.setOperations&&(this.append(" "),this.compileList(e.setOperations," ")),e.orderBy&&(this.append(" "),this.visitNode(e.orderBy)),e.limit&&(this.append(" "),this.visitNode(e.limit)),e.offset&&(this.append(" "),this.visitNode(e.offset)),e.fetch&&(this.append(" "),this.visitNode(e.fetch)),e.endModifiers?.length&&(this.append(" "),this.compileList(this.sortSelectModifiers([...e.endModifiers])," ")),r&&this.append(")")}visitFrom(e){this.append("from "),this.compileList(e.froms)}visitSelection(e){this.visitNode(e.selection)}visitColumn(e){this.visitNode(e.column)}compileDistinctOn(e){this.append("distinct on ("),this.compileList(e),this.append(")")}compileList(e,r=", "){const n=e.length-1;for(let s=0;s<=n;s++)this.visitNode(e[s]),s<n&&this.append(r)}visitWhere(e){this.append("where "),this.visitNode(e.where)}visitHaving(e){this.append("having "),this.visitNode(e.having)}visitInsertQuery(e){const r=this.parentNode!==void 0&&!Dr.is(this.parentNode)&&!rr.is(this.parentNode)&&!An.is(this.parentNode);this.parentNode===void 0&&e.explain&&(this.visitNode(e.explain),this.append(" ")),r&&this.append("("),e.with&&(this.visitNode(e.with),this.append(" ")),this.append(e.replace?"replace":"insert"),e.ignore&&(Yn("`InsertQueryNode.ignore` is deprecated. Use `InsertQueryNode.orAction` instead."),this.append(" ignore")),e.orAction&&(this.append(" "),this.visitNode(e.orAction)),e.top&&(this.append(" "),this.visitNode(e.top)),e.into&&(this.append(" into "),this.visitNode(e.into)),e.columns&&(this.append(" ("),this.compileList(e.columns),this.append(")")),e.output&&(this.append(" "),this.visitNode(e.output)),e.values&&(this.append(" "),this.visitNode(e.values)),e.defaultValues&&(this.append(" "),this.append("default values")),e.onConflict&&(this.append(" "),this.visitNode(e.onConflict)),e.onDuplicateKey&&(this.append(" "),this.visitNode(e.onDuplicateKey)),e.returning&&(this.append(" "),this.visitNode(e.returning)),r&&this.append(")"),e.endModifiers?.length&&(this.append(" "),this.compileList(e.endModifiers," "))}visitValues(e){this.append("values "),this.compileList(e.values)}visitDeleteQuery(e){const r=this.parentNode!==void 0&&!Dr.is(this.parentNode)&&!rr.is(this.parentNode);this.parentNode===void 0&&e.explain&&(this.visitNode(e.explain),this.append(" ")),r&&this.append("("),e.with&&(this.visitNode(e.with),this.append(" ")),this.append("delete "),e.top&&(this.visitNode(e.top),this.append(" ")),this.visitNode(e.from),e.output&&(this.append(" "),this.visitNode(e.output)),e.using&&(this.append(" "),this.visitNode(e.using)),e.joins&&(this.append(" "),this.compileList(e.joins," ")),e.where&&(this.append(" "),this.visitNode(e.where)),e.orderBy&&(this.append(" "),this.visitNode(e.orderBy)),e.limit&&(this.append(" "),this.visitNode(e.limit)),e.returning&&(this.append(" "),this.visitNode(e.returning)),r&&this.append(")"),e.endModifiers?.length&&(this.append(" "),this.compileList(e.endModifiers," "))}visitReturning(e){this.append("returning "),this.compileList(e.selections)}visitAlias(e){this.visitNode(e.node),this.append(" as "),this.visitNode(e.alias)}visitReference(e){e.table&&(this.visitNode(e.table),this.append(".")),this.visitNode(e.column)}visitSelectAll(e){this.append("*")}visitIdentifier(e){this.append(this.getLeftIdentifierWrapper()),this.compileUnwrappedIdentifier(e),this.append(this.getRightIdentifierWrapper())}compileUnwrappedIdentifier(e){if(!zt(e.name))throw new Error("a non-string identifier was passed to compileUnwrappedIdentifier.");this.append(this.sanitizeIdentifier(e.name))}visitAnd(e){this.visitNode(e.left),this.append(" and "),this.visitNode(e.right)}visitOr(e){this.visitNode(e.left),this.append(" or "),this.visitNode(e.right)}visitValue(e){e.immediate?this.appendImmediateValue(e.value):this.appendValue(e.value)}visitValueList(e){this.append("("),this.compileList(e.values),this.append(")")}visitTuple(e){this.append("("),this.compileList(e.values),this.append(")")}visitPrimitiveValueList(e){this.append("(");const{values:r}=e;for(let n=0;n<r.length;++n)this.appendValue(r[n]),n!==r.length-1&&this.append(", ");this.append(")")}visitParens(e){this.append("("),this.visitNode(e.node),this.append(")")}visitJoin(e){this.append(D_[e.joinType]),this.append(" "),this.visitNode(e.table),e.on&&(this.append(" "),this.visitNode(e.on))}visitOn(e){this.append("on "),this.visitNode(e.on)}visitRaw(e){const{sqlFragments:r,parameters:n}=e;for(let s=0;s<r.length;++s)this.append(r[s]),n.length>s&&this.visitNode(n[s])}visitOperator(e){this.append(e.operator)}visitTable(e){this.visitNode(e.table)}visitSchemableIdentifier(e){e.schema&&(this.visitNode(e.schema),this.append(".")),this.visitNode(e.identifier)}visitCreateTable(e){this.append("create "),e.frontModifiers&&e.frontModifiers.length>0&&(this.compileList(e.frontModifiers," "),this.append(" ")),e.temporary&&this.append("temporary "),this.append("table "),e.ifNotExists&&this.append("if not exists "),this.visitNode(e.table),e.selectQuery?(this.append(" as "),this.visitNode(e.selectQuery)):(this.append(" ("),this.compileList([...e.columns,...e.constraints??[]]),this.append(")"),e.onCommit&&(this.append(" on commit "),this.append(e.onCommit)),e.endModifiers&&e.endModifiers.length>0&&(this.append(" "),this.compileList(e.endModifiers," ")))}visitColumnDefinition(e){e.ifNotExists&&this.append("if not exists "),this.visitNode(e.column),this.append(" "),this.visitNode(e.dataType),e.unsigned&&this.append(" unsigned"),e.frontModifiers&&e.frontModifiers.length>0&&(this.append(" "),this.compileList(e.frontModifiers," ")),e.generated&&(this.append(" "),this.visitNode(e.generated)),e.identity&&this.append(" identity"),e.defaultTo&&(this.append(" "),this.visitNode(e.defaultTo)),e.notNull&&this.append(" not null"),e.unique&&this.append(" unique"),e.nullsNotDistinct&&this.append(" nulls not distinct"),e.primaryKey&&this.append(" primary key"),e.autoIncrement&&(this.append(" "),this.append(this.getAutoIncrement())),e.references&&(this.append(" "),this.visitNode(e.references)),e.check&&(this.append(" "),this.visitNode(e.check)),e.endModifiers&&e.endModifiers.length>0&&(this.append(" "),this.compileList(e.endModifiers," "))}getAutoIncrement(){return"auto_increment"}visitReferences(e){this.append("references "),this.visitNode(e.table),this.append(" ("),this.compileList(e.columns),this.append(")"),e.onDelete&&(this.append(" on delete "),this.append(e.onDelete)),e.onUpdate&&(this.append(" on update "),this.append(e.onUpdate))}visitDropTable(e){this.append("drop table "),e.ifExists&&this.append("if exists "),this.visitNode(e.table),e.cascade&&this.append(" cascade")}visitDataType(e){this.append(e.dataType)}visitOrderBy(e){this.append("order by "),this.compileList(e.items)}visitOrderByItem(e){this.visitNode(e.orderBy),e.collation&&(this.append(" "),this.visitNode(e.collation)),e.direction&&(this.append(" "),this.visitNode(e.direction)),e.nulls&&(this.append(" nulls "),this.append(e.nulls))}visitGroupBy(e){this.append("group by "),this.compileList(e.items)}visitGroupByItem(e){this.visitNode(e.groupBy)}visitUpdateQuery(e){const r=this.parentNode!==void 0&&!Dr.is(this.parentNode)&&!rr.is(this.parentNode)&&!An.is(this.parentNode);if(this.parentNode===void 0&&e.explain&&(this.visitNode(e.explain),this.append(" ")),r&&this.append("("),e.with&&(this.visitNode(e.with),this.append(" ")),this.append("update "),e.top&&(this.visitNode(e.top),this.append(" ")),e.table&&(this.visitNode(e.table),this.append(" ")),this.append("set "),e.updates&&this.compileList(e.updates),e.output&&(this.append(" "),this.visitNode(e.output)),e.from&&(this.append(" "),this.visitNode(e.from)),e.joins){if(!e.from)throw new Error("Joins in an update query are only supported as a part of a PostgreSQL 'update set from join' query. If you want to create a MySQL 'update join set' query, see https://kysely.dev/docs/examples/update/my-sql-joins");this.append(" "),this.compileList(e.joins," ")}e.where&&(this.append(" "),this.visitNode(e.where)),e.orderBy&&(this.append(" "),this.visitNode(e.orderBy)),e.limit&&(this.append(" "),this.visitNode(e.limit)),e.returning&&(this.append(" "),this.visitNode(e.returning)),r&&this.append(")"),e.endModifiers?.length&&(this.append(" "),this.compileList(e.endModifiers," "))}visitColumnUpdate(e){this.visitNode(e.column),this.append(" = "),this.visitNode(e.value)}visitLimit(e){this.append("limit "),this.visitNode(e.limit)}visitOffset(e){this.append("offset "),this.visitNode(e.offset)}visitOnConflict(e){this.append("on conflict"),e.columns?(this.append(" ("),this.compileList(e.columns),this.append(")")):e.constraint?(this.append(" on constraint "),this.visitNode(e.constraint)):e.indexExpression&&(this.append(" ("),this.visitNode(e.indexExpression),this.append(")")),e.indexWhere&&(this.append(" "),this.visitNode(e.indexWhere)),e.doNothing===!0?this.append(" do nothing"):e.updates&&(this.append(" do update set "),this.compileList(e.updates),e.updateWhere&&(this.append(" "),this.visitNode(e.updateWhere)))}visitOnDuplicateKey(e){this.append("on duplicate key update "),this.compileList(e.updates)}visitCreateIndex(e){this.append("create "),e.unique&&this.append("unique "),this.append("index "),e.ifNotExists&&this.append("if not exists "),this.visitNode(e.name),e.table&&(this.append(" on "),this.visitNode(e.table)),e.using&&(this.append(" using "),this.visitNode(e.using)),e.columns&&(this.append(" ("),this.compileList(e.columns),this.append(")")),e.nullsNotDistinct&&this.append(" nulls not distinct"),e.where&&(this.append(" "),this.visitNode(e.where))}visitDropIndex(e){this.append("drop index "),e.ifExists&&this.append("if exists "),this.visitNode(e.name),e.table&&(this.append(" on "),this.visitNode(e.table)),e.cascade&&this.append(" cascade")}visitCreateSchema(e){this.append("create schema "),e.ifNotExists&&this.append("if not exists "),this.visitNode(e.schema)}visitDropSchema(e){this.append("drop schema "),e.ifExists&&this.append("if exists "),this.visitNode(e.schema),e.cascade&&this.append(" cascade")}visitPrimaryKeyConstraint(e){e.name&&(this.append("constraint "),this.visitNode(e.name),this.append(" ")),this.append("primary key ("),this.compileList(e.columns),this.append(")"),this.buildDeferrable(e)}buildDeferrable(e){e.deferrable!==void 0&&(e.deferrable?this.append(" deferrable"):this.append(" not deferrable")),e.initiallyDeferred!==void 0&&(e.initiallyDeferred?this.append(" initially deferred"):this.append(" initially immediate"))}visitUniqueConstraint(e){e.name&&(this.append("constraint "),this.visitNode(e.name),this.append(" ")),this.append("unique"),e.nullsNotDistinct&&this.append(" nulls not distinct"),this.append(" ("),this.compileList(e.columns),this.append(")"),this.buildDeferrable(e)}visitCheckConstraint(e){e.name&&(this.append("constraint "),this.visitNode(e.name),this.append(" ")),this.append("check ("),this.visitNode(e.expression),this.append(")")}visitForeignKeyConstraint(e){e.name&&(this.append("constraint "),this.visitNode(e.name),this.append(" ")),this.append("foreign key ("),this.compileList(e.columns),this.append(") "),this.visitNode(e.references),e.onDelete&&(this.append(" on delete "),this.append(e.onDelete)),e.onUpdate&&(this.append(" on update "),this.append(e.onUpdate)),this.buildDeferrable(e)}visitList(e){this.compileList(e.items)}visitWith(e){this.append("with "),e.recursive&&this.append("recursive "),this.compileList(e.expressions)}visitCommonTableExpression(e){this.visitNode(e.name),this.append(" as "),Ss(e.materialized)&&(e.materialized||this.append("not "),this.append("materialized ")),this.visitNode(e.expression)}visitCommonTableExpressionName(e){this.visitNode(e.table),e.columns&&(this.append("("),this.compileList(e.columns),this.append(")"))}visitAlterTable(e){this.append("alter table "),this.visitNode(e.table),this.append(" "),e.renameTo&&(this.append("rename to "),this.visitNode(e.renameTo)),e.setSchema&&(this.append("set schema "),this.visitNode(e.setSchema)),e.addConstraint&&this.visitNode(e.addConstraint),e.dropConstraint&&this.visitNode(e.dropConstraint),e.renameConstraint&&this.visitNode(e.renameConstraint),e.columnAlterations&&this.compileColumnAlterations(e.columnAlterations),e.addIndex&&this.visitNode(e.addIndex),e.dropIndex&&this.visitNode(e.dropIndex)}visitAddColumn(e){this.append("add column "),this.visitNode(e.column)}visitRenameColumn(e){this.append("rename column "),this.visitNode(e.column),this.append(" to "),this.visitNode(e.renameTo)}visitDropColumn(e){this.append("drop column "),this.visitNode(e.column)}visitAlterColumn(e){this.append("alter column "),this.visitNode(e.column),this.append(" "),e.dataType&&(this.announcesNewColumnDataType()&&this.append("type "),this.visitNode(e.dataType),e.dataTypeExpression&&(this.append("using "),this.visitNode(e.dataTypeExpression))),e.setDefault&&(this.append("set default "),this.visitNode(e.setDefault)),e.dropDefault&&this.append("drop default"),e.setNotNull&&this.append("set not null"),e.dropNotNull&&this.append("drop not null")}visitModifyColumn(e){this.append("modify column "),this.visitNode(e.column)}visitAddConstraint(e){this.append("add "),this.visitNode(e.constraint)}visitDropConstraint(e){this.append("drop constraint "),e.ifExists&&this.append("if exists "),this.visitNode(e.constraintName),e.modifier==="cascade"?this.append(" cascade"):e.modifier==="restrict"&&this.append(" restrict")}visitRenameConstraint(e){this.append("rename constraint "),this.visitNode(e.oldName),this.append(" to "),this.visitNode(e.newName)}visitSetOperation(e){this.append(e.operator),this.append(" "),e.all&&this.append("all "),this.visitNode(e.expression)}visitCreateView(e){this.append("create "),e.orReplace&&this.append("or replace "),e.materialized&&this.append("materialized "),e.temporary&&this.append("temporary "),this.append("view "),e.ifNotExists&&this.append("if not exists "),this.visitNode(e.name),this.append(" "),e.columns&&(this.append("("),this.compileList(e.columns),this.append(") ")),e.as&&(this.append("as "),this.visitNode(e.as))}visitRefreshMaterializedView(e){this.append("refresh materialized view "),e.concurrently&&this.append("concurrently "),this.visitNode(e.name),e.withNoData?this.append(" with no data"):this.append(" with data")}visitDropView(e){this.append("drop "),e.materialized&&this.append("materialized "),this.append("view "),e.ifExists&&this.append("if exists "),this.visitNode(e.name),e.cascade&&this.append(" cascade")}visitGenerated(e){this.append("generated "),e.always&&this.append("always "),e.byDefault&&this.append("by default "),this.append("as "),e.identity&&this.append("identity"),e.expression&&(this.append("("),this.visitNode(e.expression),this.append(")")),e.stored&&this.append(" stored")}visitDefaultValue(e){this.append("default "),this.visitNode(e.defaultValue)}visitSelectModifier(e){e.rawModifier?this.visitNode(e.rawModifier):this.append(W_[e.modifier]),e.of&&(this.append(" of "),this.compileList(e.of,", "))}visitCreateType(e){this.append("create type "),this.visitNode(e.name),e.enum&&(this.append(" as enum "),this.visitNode(e.enum))}visitDropType(e){this.append("drop type "),e.ifExists&&this.append("if exists "),this.visitNode(e.name)}visitExplain(e){this.append("explain"),(e.options||e.format)&&(this.append(" "),this.append(this.getLeftExplainOptionsWrapper()),e.options&&(this.visitNode(e.options),e.format&&this.append(this.getExplainOptionsDelimiter())),e.format&&(this.append("format"),this.append(this.getExplainOptionAssignment()),this.append(e.format)),this.append(this.getRightExplainOptionsWrapper()))}visitDefaultInsertValue(e){this.append("default")}visitAggregateFunction(e){this.append(e.func),this.append("("),e.distinct&&this.append("distinct "),this.compileList(e.aggregated),e.orderBy&&(this.append(" "),this.visitNode(e.orderBy)),this.append(")"),e.withinGroup&&(this.append(" within group ("),this.visitNode(e.withinGroup),this.append(")")),e.filter&&(this.append(" filter("),this.visitNode(e.filter),this.append(")")),e.over&&(this.append(" "),this.visitNode(e.over))}visitOver(e){this.append("over("),e.partitionBy&&(this.visitNode(e.partitionBy),e.orderBy&&this.append(" ")),e.orderBy&&this.visitNode(e.orderBy),this.append(")")}visitPartitionBy(e){this.append("partition by "),this.compileList(e.items)}visitPartitionByItem(e){this.visitNode(e.partitionBy)}visitBinaryOperation(e){this.visitNode(e.leftOperand),this.append(" "),this.visitNode(e.operator),this.append(" "),this.visitNode(e.rightOperand)}visitUnaryOperation(e){this.visitNode(e.operator),this.isMinusOperator(e.operator)||this.append(" "),this.visitNode(e.operand)}isMinusOperator(e){return sn.is(e)&&e.operator==="-"}visitUsing(e){this.append("using "),this.compileList(e.tables)}visitFunction(e){this.append(e.func),this.append("("),this.compileList(e.arguments),this.append(")")}visitCase(e){this.append("case"),e.value&&(this.append(" "),this.visitNode(e.value)),e.when&&(this.append(" "),this.compileList(e.when," ")),e.else&&(this.append(" else "),this.visitNode(e.else)),this.append(" end"),e.isStatement&&this.append(" case")}visitWhen(e){this.append("when "),this.visitNode(e.condition),e.result&&(this.append(" then "),this.visitNode(e.result))}visitJSONReference(e){this.visitNode(e.reference),this.visitNode(e.traversal)}visitJSONPath(e){e.inOperator&&this.visitNode(e.inOperator),this.append("'$");for(const r of e.pathLegs)this.visitNode(r);this.append("'")}visitJSONPathLeg(e){const r=e.type==="ArrayLocation";this.append(r?"[":"."),this.append(String(e.value)),r&&this.append("]")}visitJSONOperatorChain(e){for(let r=0,n=e.values.length;r<n;r++)r===n-1?this.visitNode(e.operator):this.append("->"),this.visitNode(e.values[r])}visitMergeQuery(e){e.with&&(this.visitNode(e.with),this.append(" ")),this.append("merge "),e.top&&(this.visitNode(e.top),this.append(" ")),this.append("into "),this.visitNode(e.into),e.using&&(this.append(" "),this.visitNode(e.using)),e.whens&&(this.append(" "),this.compileList(e.whens," ")),e.returning&&(this.append(" "),this.visitNode(e.returning)),e.output&&(this.append(" "),this.visitNode(e.output)),e.endModifiers?.length&&(this.append(" "),this.compileList(e.endModifiers," "))}visitMatched(e){e.not&&this.append("not "),this.append("matched"),e.bySource&&this.append(" by source")}visitAddIndex(e){this.append("add "),e.unique&&this.append("unique "),this.append("index "),this.visitNode(e.name),e.columns&&(this.append(" ("),this.compileList(e.columns),this.append(")")),e.using&&(this.append(" using "),this.visitNode(e.using))}visitCast(e){this.append("cast("),this.visitNode(e.expression),this.append(" as "),this.visitNode(e.dataType),this.append(")")}visitFetch(e){this.append("fetch next "),this.visitNode(e.rowCount),this.append(` rows ${e.modifier}`)}visitOutput(e){this.append("output "),this.compileList(e.selections)}visitTop(e){this.append(`top(${e.expression})`),e.modifiers&&this.append(` ${e.modifiers}`)}visitOrAction(e){this.append(e.action)}visitCollate(e){this.append("collate "),this.visitNode(e.collation)}append(e){this.#e+=e}appendValue(e){this.addParameter(e),this.append(this.getCurrentParameterPlaceholder())}getLeftIdentifierWrapper(){return'"'}getRightIdentifierWrapper(){return'"'}getCurrentParameterPlaceholder(){return"$"+this.numParameters}getLeftExplainOptionsWrapper(){return"("}getExplainOptionAssignment(){return" "}getExplainOptionsDelimiter(){return", "}getRightExplainOptionsWrapper(){return")"}sanitizeIdentifier(e){const r=this.getLeftIdentifierWrapper(),n=this.getRightIdentifierWrapper();let s="";for(const a of e)s+=a,a===r?s+=r:a===n&&(s+=n);return s}sanitizeStringLiteral(e){return e.replace(F_,"''")}addParameter(e){this.#t.push(e)}appendImmediateValue(e){if(zt(e))this.appendStringLiteral(e);else if(qs(e)||Ss(e)||zo(e))this.append(e.toString());else if(jo(e))this.append("null");else if(Yp(e))this.appendImmediateValue(e.toISOString());else throw new Error(`invalid immediate value ${e}`)}appendStringLiteral(e){this.append("'"),this.append(this.sanitizeStringLiteral(e)),this.append("'")}sortSelectModifiers(e){return e.sort((r,n)=>r.modifier&&n.modifier?Nu[r.modifier]-Nu[n.modifier]:1),p(e)}compileColumnAlterations(e){this.compileList(e)}announcesNewColumnDataType(){return!0}}const W_=p({ForKeyShare:"for key share",ForNoKeyUpdate:"for no key update",ForUpdate:"for update",ForShare:"for share",NoWait:"nowait",SkipLocked:"skip locked",Distinct:"distinct"}),Nu=p({ForKeyShare:1,ForNoKeyUpdate:1,ForUpdate:1,ForShare:1,NoWait:2,SkipLocked:2,Distinct:0}),D_=p({InnerJoin:"inner join",LeftJoin:"left join",RightJoin:"right join",FullJoin:"full join",CrossJoin:"cross join",LateralInnerJoin:"inner join lateral",LateralLeftJoin:"left join lateral",LateralCrossJoin:"cross join lateral",OuterApply:"outer apply",CrossApply:"cross apply",Using:"using"});class M_{async init(){}async acquireConnection(){return new U_}async beginTransaction(){}async commitTransaction(){}async rollbackTransaction(){}async releaseConnection(){}async destroy(){}async releaseSavepoint(){}async rollbackToSavepoint(){}async savepoint(){}}class U_{async executeQuery(){return{rows:[]}}async*streamQuery(){}}class $_{get supportsCreateIfNotExists(){return!0}get supportsTransactionalDdl(){return!1}get supportsReturning(){return!1}get supportsOutput(){return!1}}const B_=/"/g;class j_ extends R_{visitOrAction(e){this.append("or "),this.append(e.action)}getCurrentParameterPlaceholder(){return"?"}getLeftExplainOptionsWrapper(){return""}getRightExplainOptionsWrapper(){return""}getLeftIdentifierWrapper(){return'"'}getRightIdentifierWrapper(){return'"'}getAutoIncrement(){return"autoincrement"}sanitizeIdentifier(e){return e.replace(B_,'""')}visitDefaultInsertValue(e){this.append("null")}}class z_ extends $_{get supportsTransactionalDdl(){return!1}get supportsReturning(){return!0}async acquireMigrationLock(e,r){}async releaseMigrationLock(e,r){}}const V_=Ni({createdAt:wi,updatedAt:wi,isDeleted:Yl(_c),ownerId:$p}),_a=new Set(Object.keys(V_.props)),Q_=[..._a,"id"],H_=Ni({name:Ct,sql:Ct});Ni({tables:Fo(Ct,Rh(Ct)),indexes:Gl(H_)});const ga=t=>({allIndexes:e=!1}={})=>{const r=Oo(),n=t.sqlite.exec(Le`
      select
        sqlite_master.name as tableName,
        table_info.name as columnName
      from
        sqlite_master
        join pragma_table_info(sqlite_master.name) as table_info;
    `);if(!n.ok)return n;n.value.rows.forEach(d=>{const{tableName:g,columnName:x}=d;(r[g]??=new Set).add(x)});const s=t.sqlite.exec(e?Le`
            select name, sql
            from sqlite_master
            where type = 'index' and name not like 'sqlite_%';
          `:Le`
            select name, sql
            from sqlite_master
            where
              type = 'index'
              and name not like 'sqlite_%'
              and name not like 'evolu_%';
          `);if(!s.ok)return s;const a=s.value.rows.map(d=>({name:d.name,sql:d.sql.replace("CREATE INDEX","create index").replace("CREATE UNIQUE INDEX","create unique index")}));return ue({tables:r,indexes:a})},vu=(t,e)=>t.name===e.name&&t.sql===e.sql,ya=t=>(e,r)=>{const n=[];if(!r){const s=ga(t)();if(!s.ok)return s;r=s.value}for(const[s,a]of Object.entries(e.tables)){const d=Rl(r.tables,s);if(!d)n.push(J_(s,a));else for(const g of a.difference(d))n.push(Le`
            alter table ${Le.identifier(s)}
            add column ${Le.identifier(g)} any;
          `)}r.indexes.filter(s=>!e.indexes.some(a=>vu(a,s))).forEach(s=>{n.push(Le`drop index ${Le.identifier(s.name)};`)}),e.indexes.filter(s=>!r.indexes.some(a=>vu(s,a))).forEach(s=>{n.push({sql:`${s.sql};`,parameters:[]})});for(const s of n){const a=t.sqlite.exec(s);if(!a.ok)return a}return ue()},J_=(t,e)=>Le`
  create table ${Le.identifier(t)} (
    "id" text,
    ${Le.raw(`${[..._a,...e].map(r=>`${Le.identifier(r).sql} any`).join(", ")}, `)}
    primary key ("ownerId", "id")
  )
  without rowid, strict;
`,qu=new mn({dialect:{createAdapter:()=>new z_,createDriver:()=>new M_,createIntrospector(){throw new Error("Not implemeneted")},createQueryCompiler:()=>new j_}});qu.schema.createIndex.bind(qu.schema);const K_=(t,e)=>{if(t.byteLength>e.byteLength)return 1;if(t.byteLength<e.byteLength)return-1;for(let r=0;r<t.byteLength;r++){if(t[r]<e[r])return-1;if(t[r]>e[r])return 1}return 0},ba=it("Millis",Jl(0xffffffffffff-1)(Qe)),G_=0,wa=it("Counter",Jl(65535)(Qe)),xa=0,X_=$l("NodeId",/^[a-f0-9]{16}$/)(Ct),Y_="0000000000000000";Ni({millis:ba,counter:wa,nodeId:X_});const Z_=qp({millis:$o,counter:$o,nodeId:vp}),eg=({millis:t=G_,counter:e=xa,nodeId:r=Y_}={})=>({millis:t,counter:e,nodeId:r}),tg=t=>{const e=lo(t.randomBytes.create(8));return eg({nodeId:e})},Su=t=>e=>{const r=ba.from(t.time.now());if(!r.ok)return we({type:"TimestampTimeOutOfRangeError"});const n=Math.max(r.value,...e);return n-r.value>t.timestampConfig.maxDrift?we({type:"TimestampDriftError",now:r.value,next:n}):ue(n)},Gs=t=>{const e=wa.from(Kp(t));return e.ok?ue(e.value):we({type:"TimestampCounterOverflowError"})},rg=t=>e=>{const r=Su(t)([e.millis]);if(!r.ok)return r;const n=r.value===e.millis?Gs(e.counter):ue(xa);return n.ok?ue({millis:r.value,counter:n.value,nodeId:e.nodeId}):n},ng=t=>(e,r)=>{const n=Su(t)([e.millis,r.millis]);if(!n.ok)return n;const s=n.value===e.millis&&n.value===r.millis?Gs(Math.max(e.counter,r.counter)):n.value===e.millis?Gs(e.counter):n.value===r.millis?Gs(r.counter):ue(xa);return s.ok?ue({millis:n.value,counter:s.value,nodeId:e.nodeId}):s};it("TimestampBytes",hs);const ig=Qe.orThrow(16),Wn=t=>{const{millis:e,counter:r,nodeId:n}=t,s=new globalThis.Uint8Array(16),a=BigInt(e);s[0]=Number(a>>40n&0xffn),s[1]=Number(a>>32n&0xffn),s[2]=Number(a>>24n&0xffn),s[3]=Number(a>>16n&0xffn),s[4]=Number(a>>8n&0xffn),s[5]=Number(a&0xffn),s[6]=r>>8&255,s[7]=r&255;for(let d=0;d<8;d++){const g=parseInt(n.slice(d*2,d*2+2),16);s[8+d]=g}return s},fi=t=>{const e=BigInt(t[0])<<40n|BigInt(t[1])<<32n|BigInt(t[2])<<24n|BigInt(t[3])<<16n|BigInt(t[4])<<8n|BigInt(t[5]),r=t[6]<<8|t[7];let n="";for(let s=8;s<16;s++)n+=t[s].toString(16).padStart(2,"0");return{millis:Number(e),counter:r,nodeId:n}},ku=K_,sg=t=>new Date(t.millis).toISOString(),zi=Qe.orThrow(12),og=new Uint8Array(zi),Ar=Symbol("InfiniteUpperBound"),St={Fingerprint:1,Skip:0,Timestamps:2},ag=Fo(Ct,kp),lg=it("ValidDbChangeValues",ag,t=>{const e=Q_.filter(r=>r in t);return e.length>0?we({type:"ValidDbChangeValues",value:t,invalidColumns:e}):ue(t)}),Eu=Ni({table:Ct,id:Po,values:lg,isInsert:Io,isDelete:Yl(Io)}),cg=t=>e=>({insertTimestamp:(r,n,s)=>{const a=pg(t);return fg(t)(r,n,a,s)},getExistingTimestamps:(r,n)=>{const s=hd(...n),a=t.sqlite.exec(Le`
          with recursive
            split_timestamps(timestampBytes, pos) as (
              select
                substr(${s}, 1, 16),
                17 as pos
              union all
              select
                substr(${s}, pos, 16),
                pos + 16
              from split_timestamps
              where pos <= length(${s})
            )
          select s.timestampBytes
          from
            split_timestamps s
            join evolu_timestamp t
              on t.ownerId = ${r} and s.timestampBytes = t.t;
        `);return a.ok?ue(a.value.rows.map(d=>d.timestampBytes)):a},getSize:r=>{const n=bg(t)(r);return n.ok?n.value:(e.onStorageError(n.error),null)},fingerprint:(r,n,s)=>{Na(n,s);const a=Ng(t)(r,n,s);return a.ok?a.value:(e.onStorageError(a.error),null)},fingerprintRanges:(r,n,s)=>{const a=va(t)(r,n,s);return a.ok?a.value:(e.onStorageError(a.error),null)},findLowerBound:(r,n,s,a)=>{const d=wg(t)(r,n,s,a);return d.ok?d.value:(e.onStorageError(d.error),null)},iterate:(r,n,s,a)=>{Na(n,s);const d=s-n;if(d===0)return;const g=vg(t)(r,n);if(!g.ok){e.onStorageError(g.error);return}if(!a(g.value,n)||d===1)return;const x=t.sqlite.exec(Le`
          select t
          from evolu_timestamp
          where ownerId = ${r} and t > ${g.value}
          order by t
          limit ${d-1};
        `);if(!x.ok){e.onStorageError(x.error);return}for(let N=0;N<x.value.rows.length;N++){const S=Qe.orThrow(n+1+N);if(!a(x.value.rows[N].t,S))return}},deleteOwner:r=>{const n=t.sqlite.exec(Le`
          delete from evolu_timestamp where ownerId = ${r};
        `);return n.ok?!0:(e.onStorageError(n.error),!1)}}),Na=(t,e)=>{Qt(t<=e,"invalid begin or end")},ug=t=>{for(const e of[Le`
      create table evolu_timestamp (
        "ownerId" blob not null,
        "t" blob not null,
        "h1" integer,
        "h2" integer,
        "c" integer,
        "l" integer not null,
        primary key ("ownerId", "t")
      )
      strict;
    `,Le`
      create index evolu_timestamp_index on evolu_timestamp (
        "ownerId",
        "l",
        "t",
        "h1",
        "h2",
        "c"
      );
    `,Le`
      create table evolu_usage (
        "ownerId" blob primary key,
        "storedBytes" integer not null,
        "firstTimestamp" blob,
        "lastTimestamp" blob
      )
      strict;
    `]){const r=t.sqlite.exec(e);if(!r.ok)return r}return ue()},dg=(t,e,r)=>ku(t,r)===1?["append",e,t]:ku(t,e)===-1?["prepend",t,r]:["insert",e,r],fg=t=>(e,r,n,s)=>{const[a,d]=gg(hg(r));let g=[];switch(s){case"append":g=[n===1?Le.prepared`
                insert into evolu_timestamp
                  (ownerId, l, t, h1, h2, c)
                values
                  (${e}, 1, ${r}, ${a}, ${d}, 1)
                on conflict do nothing;
              `:Le.prepared`
                with
                  fc(b, cl, pt, nt, ih1, ih2, ic) as (
                    select
                      0,
                      (
                        select max(l)
                        from evolu_timestamp
                        where ownerId = ${e}
                      ),
                      zeroblob(0),
                      null,
                      0,
                      0,
                      0
                    union all
                    select
                      not b,
                      iif(b, iif(nt is null, cl - 1, cl), cl),
                      iif(b, ifnull(nt, pt), pt),
                      iif(
                        b,
                        null,
                        (
                          select t
                          from evolu_timestamp
                          where
                            ownerId = ${e}
                            and l = cl
                            and t > pt
                            and t < ${r}
                          order by t
                          limit 1
                        )
                      ),
                      iif(
                        b and cl < ${n} and nt is not null,
                        (
                          select (ih1 | h1) - (ih1 & h1)
                          from evolu_timestamp
                          where ownerId = ${e} and t = nt
                        ),
                        ih1
                      ),
                      iif(
                        b and cl < ${n} and nt is not null,
                        (
                          select (ih2 | h2) - (ih2 & h2)
                          from evolu_timestamp
                          where ownerId = ${e} and t = nt
                        ),
                        ih2
                      ),
                      iif(
                        b and cl < ${n} and nt is not null,
                        (
                          select ic + c
                          from evolu_timestamp
                          where ownerId = ${e} and t = nt
                        ),
                        ic
                      )
                    from fc
                    where cl > 0
                  )
                insert into evolu_timestamp (ownerId, t, l, h1, h2, c)
                select
                  ${e},
                  ${r},
                  ${n},
                  (${a} | ih1) - (${a} & ih1),
                  (${d} | ih2) - (${d} & ih2),
                  ic + 1
                from fc
                order by cl asc
                limit 1
                on conflict do nothing;
              `];break;case"prepend":g=[Le.prepared`
            insert into evolu_timestamp
              (ownerId, l, t, h1, h2, c)
            values
              (${e}, ${n}, ${r}, ${a}, ${d}, 1)
            on conflict do nothing;
          `,Le.prepared`
            with
              ml(ml) as (
                select max(l)
                from evolu_timestamp
                where ownerId = ${e}
              ),
              fp(b, cl, pt, nt, h1, h2, c) as (
                select
                  0,
                  (select ml from ml),
                  null,
                  null,
                  null,
                  null,
                  null
                union all
                select
                  not b,
                  iif(b, cl - 1, cl),
                  iif(
                    b,
                    iif(nt is not null and (pt is null or nt < pt), nt, pt),
                    pt
                  ),
                  iif(
                    b,
                    null,
                    (
                      select t
                      from evolu_timestamp
                      where ownerId = ${e} and l = cl and t > ${r}
                      order by t
                      limit 1
                    )
                  ),
                  iif(
                    b and nt is not null and (pt is null or nt < pt),
                    (
                      select h1
                      from evolu_timestamp
                      where ownerId = ${e} and t = nt
                    ),
                    null
                  ),
                  iif(
                    b and nt is not null and (pt is null or nt < pt),
                    (
                      select h2
                      from evolu_timestamp
                      where ownerId = ${e} and t = nt
                    ),
                    null
                  ),
                  iif(
                    b and nt is not null and (pt is null or nt < pt),
                    (
                      select c
                      from evolu_timestamp
                      where ownerId = ${e} and t = nt
                    ),
                    null
                  )
                from fp
                where cl > ${n}
              ),
              u(t, h1, h2) as (
                select
                  pt,
                  (${a} | h1) - (${a} & h1),
                  (${d} | h2) - (${d} & h2)
                from fp
                where h1 is not null and pt is not null
                order by pt
                -- Check skiplistMaxLevel docs.
                limit 10
              )
            update evolu_timestamp
            set
              h1 = u.h1,
              h2 = u.h2,
              c = c + 1
            from u
            where
              changes() > 0
              and ownerId = ${e}
              and evolu_timestamp.t = u.t;
          `];break;case"insert":g=n===1?[Le.prepared`
                  insert into evolu_timestamp
                    (ownerId, l, t, h1, h2, c)
                  values
                    (${e}, 1, ${r}, ${a}, ${d}, 1)
                  on conflict do nothing;
                `,Le.prepared`
                  with
                    p(l, t, h1, h2) as (
                      select
                        (
                          select max(l) + 1
                          from evolu_timestamp
                          where ownerId = ${e}
                        ),
                        null,
                        null,
                        null
                      union all
                      select
                        p.l - 1,
                        ifnull(
                          (
                            select t
                            from evolu_timestamp
                            where
                              ownerId = ${e}
                              and l = p.l - 1
                              and t > ${r}
                              and (p.t is null or p.t > t)
                            order by t
                            limit 1
                          ),
                          p.t
                        ),
                        (
                          select h1
                          from evolu_timestamp
                          where
                            ownerId = ${e}
                            and l = p.l - 1
                            and t > ${r}
                            and (p.t is null or p.t > t)
                          order by t
                          limit 1
                        ),
                        (
                          select h2
                          from evolu_timestamp
                          where
                            ownerId = ${e}
                            and l = p.l - 1
                            and t > ${r}
                            and (p.t is null or p.t > t)
                          order by t
                          limit 1
                        )
                      from p
                      where p.l > 2
                      -- Check skiplistMaxLevel docs.
                      limit 10
                    ),
                    u(t, h1, h2) as (
                      select
                        t,
                        (${a} | h1) - (${a} & h1),
                        (${d} | h2) - (${d} & h2)
                      from p
                      where h1 is not null
                    )
                  update evolu_timestamp
                  set
                    h1 = u.h1,
                    h2 = u.h2,
                    c = c + 1
                  from u
                  where
                    changes() > 0
                    and ownerId = ${e}
                    and evolu_timestamp.t = u.t;
                `]:[Le.prepared`
                  insert into evolu_timestamp (ownerId, t, l)
                  values (${e}, ${r}, ${n})
                  on conflict do nothing;
                `,Le.prepared`
                  with
                    c0(b, cl, pt, nt, h1, h2, c) as (
                      select
                        0,
                        (
                          select max(l)
                          from evolu_timestamp
                          where ownerId = ${e}
                        ),
                        0,
                        null,
                        null,
                        null,
                        null
                      union all
                      select
                        not b,
                        iif(b, iif(nt is null, cl - 1, cl), cl),
                        iif(b, ifnull(nt, pt), pt),
                        iif(
                          b,
                          null,
                          (
                            select t
                            from evolu_timestamp
                            where
                              ownerId = ${e}
                              and l = cl
                              and t > pt
                              and t < ${r}
                            order by t
                            limit 1
                          )
                        ),
                        iif(
                          b and cl < ${n} and nt is not null,
                          (
                            select h1
                            from evolu_timestamp
                            where ownerId = ${e} and t = nt
                          ),
                          null
                        ),
                        iif(
                          b and cl < ${n} and nt is not null,
                          (
                            select h2
                            from evolu_timestamp
                            where ownerId = ${e} and t = nt
                          ),
                          null
                        ),
                        iif(
                          b and cl < ${n} and nt is not null,
                          (
                            select c
                            from evolu_timestamp
                            where ownerId = ${e} and t = nt
                          ),
                          null
                        )
                      from c0
                      where cl > 0
                    ),
                    c1(l, t, h1, h2, c) as (
                      select
                        ${n},
                        ${r},
                        ${a},
                        ${d},
                        1
                      union all
                      select cl, pt, h1, h2, c
                      from c0
                      where h1 is not null
                    ),
                    c2(rn, l, t, h1, h2, c) as (
                      select row_number() over (order by l), l, t, h1, h2, c
                      from c1
                    ),
                    c3(rn, l, t, h1, h2, c) as (
                      select rn, l, t, h1, h2, c from c2 where rn = 1
                      union all
                      select
                        c3.rn + 1,
                        c2.l,
                        c2.t,
                        (c2.h1 | c3.h1) - (c2.h1 & c3.h1),
                        (c2.h2 | c3.h2) - (c2.h2 & c3.h2),
                        c2.c + c3.c
                      from
                        c3
                        join c2 on c2.rn = c3.rn + 1
                    ),
                    c4(l, t, h1, h2, c, rn) as (
                      select l, t, h1, h2, c, max(rn)
                      from c3
                      group by l
                    ),
                    -- DEV: Check whether a boolean flag is faster.
                    n(l, t, h1, h2, c) as (
                      select
                        (
                          select max(l) + 1
                          from evolu_timestamp
                          where ownerId = ${e}
                        ),
                        null,
                        null,
                        null,
                        null
                      union all
                      select
                        n.l - 1,
                        ifnull(
                          (
                            select t
                            from evolu_timestamp
                            where
                              ownerId = ${e}
                              and l = n.l - 1
                              and t > ${r}
                              and (n.t is null or t < n.t)
                            order by t
                            limit 1
                          ),
                          n.t
                        ),
                        (
                          select h1
                          from evolu_timestamp
                          where
                            ownerId = ${e}
                            and l = n.l - 1
                            and t > ${r}
                            and (n.t is null or t < n.t)
                          order by t
                          limit 1
                        ),
                        (
                          select h2
                          from evolu_timestamp
                          where
                            ownerId = ${e}
                            and l = n.l - 1
                            and t > ${r}
                            and (n.t is null or t < n.t)
                          order by t
                          limit 1
                        ),
                        (
                          select c
                          from evolu_timestamp
                          where
                            ownerId = ${e}
                            and l = n.l - 1
                            and t > ${r}
                            and (n.t is null or t < n.t)
                          order by t
                          limit 1
                        )
                      from n
                      where l - 1 > (select min(l) from c4)
                    ),
                    u(ut, uh1, uh2, uc) as (
                      select t, h1, h2, c from c4 where t = ${r}
                      union all
                      select
                        max(t),
                        iif(
                          l > ${n},
                          (${a} | h1) - (${a} & h1),
                          (
                            select (c4.h1 | n.h1) - (c4.h1 & n.h1)
                            from c4
                            where
                              c4.l = (select max(l) from c4 where c4.l < n.l)
                          )
                        ),
                        iif(
                          l > ${n},
                          (${d} | h2) - (${d} & h2),
                          (
                            select (c4.h2 | n.h2) - (c4.h2 & n.h2)
                            from c4
                            where
                              c4.l = (select max(l) from c4 where c4.l < n.l)
                          )
                        ),
                        iif(
                          l > ${n},
                          c + 1,
                          (
                            select n.c - c4.c
                            from c4
                            where
                              c4.l = (select max(l) from c4 where c4.l < n.l)
                          )
                        )
                      from n
                      group by t
                      -- Check skiplistMaxLevel docs.
                      limit 10
                    )
                  update evolu_timestamp
                  set
                    h1 = uh1,
                    h2 = uh2,
                    c = uc
                  from u
                  where changes() > 0 and ownerId = ${e} and t = ut;
                `];break}for(const x of g){const N=t.sqlite.exec(x);if(!N.ok)return N}return ue()},hg=t=>Ud(t).slice(0,zi),pg=t=>{let e=1;for(;t.random.next()<=mg&&e<_g;)e+=1;return Xt.orThrow(e)},mg=.25,_g=10,gg=t=>{let e=BigInt(0),r=BigInt(0);for(let n=0;n<6;n++)e=e<<BigInt(8)|BigInt(t[n]);for(let n=6;n<12;n++)r=r<<BigInt(8)|BigInt(t[n]);return[e.toString(),r.toString()]},yg=([t,e])=>{let r=BigInt(t),n=BigInt(e);const s=new Uint8Array(12);for(let a=5;a>=0;a--)s[a]=Number(r&BigInt(255)),r>>=BigInt(8);for(let a=11;a>=6;a--)s[a]=Number(n&BigInt(255)),n>>=BigInt(8);return s},bg=t=>e=>{const r=t.sqlite.exec(Le.prepared`
      with
        ml(ml) as (
          select max(l)
          from evolu_timestamp
          where ownerId = ${e}
        ),
        sc(l, pt, c) as (
          select (select ml + 1 from ml), zeroblob(0), 0
          union all
          select
            sc.l - 1,
            ifnull(
              (
                select max(t)
                from evolu_timestamp as m
                where ownerId = ${e} and m.l = sc.l - 1 and m.t > sc.pt
              ),
              sc.pt
            ),
            ifnull(
              (
                select sum(m.c)
                from evolu_timestamp as m
                where ownerId = ${e} and m.l = sc.l - 1 and m.t > sc.pt
              ),
              0
            )
          from sc
          where sc.l > 1
        )
      select sum(c) as size
      from sc;
    `);return r.ok?ue(r.value.rows[0].size):r},wg=t=>(e,r,n,s)=>{if(Na(r,n),n===0||r===n||s===Ar)return ue(n);const a=t.sqlite.exec(Le.prepared`
      select t
      from evolu_timestamp
      where ownerId = ${e} and t >= ${s}
      order by t
      limit 1;
    `);if(!a.ok)return a;if(a.value.rows.length===0)return ue(n);const d=xg(t)(e,a.value.rows[0].t);return d.ok?ue(Qe.orThrow(Gp(d.value))):d},xg=t=>(e,r)=>{const n=t.sqlite.exec(Le.prepared`
      with
        ml(ml) as (
          select max(l) from evolu_timestamp where ownerId = ${e}
        ),
        sc(l, pt, tc) as (
          select ml + 1, zeroblob(0), 0 from ml
          union all
          select
            sc.l - 1,
            ifnull(
              (
                select max(t)
                from evolu_timestamp
                where
                  ownerId = ${e}
                  and l = sc.l - 1
                  and t <= ${r}
                  and t > sc.pt
                order by t
              ),
              sc.pt
            ),
            ifnull(
              (
                select sum(c)
                from evolu_timestamp
                where
                  ownerId = ${e}
                  and l = sc.l - 1
                  and t <= ${r}
                  and t > sc.pt
              ),
              0
            )
          from sc
          where sc.l > 1 and sc.pt != ${r}
        )
      select sum(tc) as count
      from sc;
    `);return n.ok?ue(n.value.rows[0].count):n},Ng=t=>(e,r,n)=>{if(n-r===0)return ue(og);if(r===0){const a=va(t)(e,[n]);return a.ok?ue(a.value[0].fingerprint):a}const s=va(t)(e,[r,n]);return s.ok?ue(s.value[1].fingerprint):s},va=t=>(e,r,n=Ar)=>{const s=JSON.stringify(r),a=t.sqlite.exec(Le.prepared`
      with
        ml(ml) as (
          select max(l) from evolu_timestamp where ownerId = ${e}
        ),
        c0(c) as (select value as c from json_each(${s})),
        c1(c, b, nt, nc, nh1, nh2, ft, tt, dl, ic, h1, h2) as (
          select
            c,
            1,
            null,
            null,
            null,
            null,
            zeroblob(0),
            X'FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF',
            ml,
            0,
            0,
            0
          from
            c0,
            ml
          union all
          select
            c,
            not b,
            iif(
              b,
              (
                select t
                from evolu_timestamp
                where l = dl and t > ft and t < tt and ownerId = ${e}
                order by t
                limit 1
              ),
              null
            ),
            iif(
              b,
              (
                select c
                from evolu_timestamp
                where l = dl and t > ft and t < tt and ownerId = ${e}
                order by t
                limit 1
              ),
              null
            ),
            iif(
              b,
              (
                select h1
                from evolu_timestamp
                where l = dl and t > ft and t < tt and ownerId = ${e}
                order by t
                limit 1
              ),
              null
            ),
            iif(
              b,
              (
                select h2
                from evolu_timestamp
                where l = dl and t > ft and t < tt and ownerId = ${e}
                order by t
                limit 1
              ),
              null
            ),
            iif(b, ft, iif(ic + nc <= c, nt, ft)),
            iif(b, tt, iif(ic + nc <= c, tt, ifnull(nt, tt))),
            iif(b, dl, iif(ic + nc <= c, dl, dl - 1)),
            iif(b, ic, iif(ic + nc <= c, ic + nc, ic)),
            iif(b, h1, iif(ic + nc <= c, ${Xs("h1","nh1")}, h1)),
            iif(b, h2, iif(ic + nc <= c, ${Xs("h2","nh2")}, h2))
          from c1
          where iif(b, 1, ic != c)
        ),
        c2(h1, h2, t, rn) as (
          select
            h1,
            h2,
            (
              select min(t)
              from evolu_timestamp
              where t > ft and ownerId = ${e}
            ),
            row_number() over (order by c)
          from c1
          where c = ic and b = 1
        ),
        c3(oh1, oh2, b, rn, h1, h2) as (
          select h1, h2, t, rn, h1, h2 from c2 where rn = 1
          union all
          select
            c2.h1,
            c2.h2,
            t,
            c2.rn,
            ${Xs("c3.oh1","c2.h1")},
            ${Xs("c3.oh2","c2.h2")}
          from
            c2
            join c3 on c2.rn = c3.rn + 1
        )
      select b, cast(h1 as text) as h1, cast(h2 as text) as h2
      from c3;
    `);if(!a.ok)return a;const d=a.value.rows.map((g,x,N)=>({type:St.Fingerprint,upperBound:x===N.length-1?n:g.b,fingerprint:yg([g.h1,g.h2])}));return ue(d)},Xs=(t,e)=>Le.raw(`(${t} | ${e}) - (${t} & ${e})`),vg=t=>(e,r)=>{const n=t.sqlite.exec(Le.prepared`
      with
        fi(b, cl, ic, pt, mt, nt, nc) as (
          select
            0,
            (
              select max(l)
              from evolu_timestamp
              where ownerId = ${e}
            ),
            0,
            zeroblob(0),
            X'FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF',
            null,
            0
          union all
          select
            not b,
            iif(
              b,
              iif(nt is null or nt > mt or ic + nc > ${r+1}, cl - 1, cl),
              cl
            ),
            iif(
              b,
              iif(nt is null or nt > mt or ic + nc > ${r+1}, ic, ic + nc),
              ic
            ),
            iif(
              b,
              iif(nt is null or nt > mt or ic + nc > ${r+1}, pt, nt),
              pt
            ),
            iif(
              b,
              iif(
                nt is null or nt > mt or ic + nc > ${r+1},
                iif(nt is not null and nt < mt, nt, mt),
                mt
              ),
              mt
            ),
            iif(
              b,
              null,
              (
                select t
                from evolu_timestamp
                where ownerId = ${e} and l = cl and t > pt
                order by t
                limit 1
              )
            ),
            iif(
              b,
              null,
              (
                select c
                from evolu_timestamp
                where ownerId = ${e} and l = cl and t > pt
                order by t
                limit 1
              )
            )
          from fi
          where ic != ${r+1}
        )
      select pt
      from fi
      where ic == ${r+1};
    `);return n.ok?ue(n.value.rows[0].pt):n},qg=t=>(e,r)=>{const n=t.sqlite.exec(Le`
      select storedBytes, firstTimestamp, lastTimestamp
      from evolu_usage
      where ownerId = ${e};
    `);if(!n.ok)return n;if(!Ki(n.value.rows))return ue({storedBytes:null,firstTimestamp:r,lastTimestamp:r});const s=Gi(n.value.rows);return Qt(s.firstTimestamp,"not null"),Qt(s.lastTimestamp,"not null"),ue({storedBytes:s.storedBytes,firstTimestamp:s.firstTimestamp,lastTimestamp:s.lastTimestamp})},Sg=t=>(e,r,n,s)=>{const a=t.sqlite.exec(Le`
      insert into evolu_usage
        ("ownerId", "storedBytes", "firstTimestamp", "lastTimestamp")
      values
        (${e}, ${r}, ${n}, ${s})
      on conflict (ownerId) do update
        set
          storedBytes = ${r},
          firstTimestamp = ${n},
          lastTimestamp = ${s};
    `);return a.ok?ue():a},Ys=new Tl({variableMapSize:!0,useRecords:!1}),Au=1e6;Kl(Au,1e8)(bs);const Ou=Au;Kl(3e3,1e5)(bs);const kg=3e4,Zs=Qe.orThrow(1),_r={Request:0,Response:1,Broadcast:2},Vi={None:0,Subscribe:1,Unsubscribe:2},gr={NoError:0,WriteKeyError:1,WriteError:2,QuotaError:3,SyncError:4},Eg=t=>(e,r,n)=>{const s=eo(e.id,{messageType:_r.Request,totalMaxSize:n??Ou,writeKey:e.writeKey});let a=!1;for(const d of r){const g=Fu(t)(d,e.encryptionKey),x={timestamp:d.timestamp,change:g};if(s.canAddMessage(x))s.addMessage(x);else{a=!0;break}}if(a){const d=t.randomBytes.create(zi);s.addRange({type:St.Fingerprint,upperBound:Ar,fingerprint:d})}return s.unwrap()},Tu=t=>(e,r)=>{const n=eo(e,{messageType:_r.Request,subscriptionFlag:r??Vi.None}),s=Ns(e),a=t.storage.getSize(s);return a==null?null:(Cu(t)(s,Qe.orThrow(0),a,Ar,n),n.unwrap())},Ag=t=>eo(t,{messageType:_r.Request,subscriptionFlag:Vi.Unsubscribe}).unwrap(),eo=(t,e)=>{const{totalMaxSize:r=Ou,rangesMaxSize:n=kg,version:s=Zs}=e,a={header:vr(),messages:{timestamps:to(),dbChanges:vr()},ranges:{timestamps:to(),types:vr(),payloads:vr()}};if(kt(a.header,s),a.header.extend(Ns(t)),a.header.extend([e.messageType]),e.messageType===_r.Request){e.writeKey?(a.header.extend([1]),a.header.extend(e.writeKey)):a.header.extend([0]);const j=e.subscriptionFlag??Vi.None;a.header.extend([j])}else e.messageType===_r.Response&&a.header.extend([e.errorCode]);let d=!1;const g=()=>x()<=r,x=()=>Xt.orThrow(N()+S()),N=()=>a.header.getLength()+a.messages.timestamps.getLength()+a.messages.dbChanges.getLength(),S=()=>a.ranges.timestamps.getCount()>0?a.ranges.timestamps.getLength()+a.ranges.types.getLength()+a.ranges.payloads.getLength()+w.remainingRange:0,w={remainingRange:zi+10,timestamp:30,dbChangeLength:8,splitRange:800,timestampsRange:50},I=w.timestamp+w.dbChangeLength+w.remainingRange;return{canAddMessage:j=>x()+I+j.change.length<=r,addMessage:j=>{a.messages.timestamps.add(j.timestamp),Dn(a.messages.dbChanges,j.change),a.messages.dbChanges.extend(j.change),Qt(g(),"the message is too big")},canSplitRange:()=>S()+w.splitRange<=n,canAddTimestampsRangeAndMessage:(j,V)=>{const Y=S()+j.getLength()+w.timestampsRange;return Y<=n&&(V?N()+Y+I+V.change.length<=r:!0)},addRange:j=>{switch(Qt(e.messageType!==_r.Broadcast,"Cannot add a range into broadcast message"),Qt(!d,"Cannot add a range after an InfiniteUpperBound range"),d=j.upperBound===Ar,j.upperBound!==Ar?a.ranges.timestamps.add(fi(j.upperBound)):a.ranges.timestamps.addInfinite(),kt(a.ranges.types,Qe.orThrow(j.type)),j.type){case St.Skip:break;case St.Fingerprint:a.ranges.payloads.extend(j.fingerprint);break;case St.Timestamps:{j.timestamps.append(a.ranges.payloads);break}}Qt(g(),`the range ${j.type} is too big`)},unwrap:()=>(a.ranges.timestamps.getCount()>0&&Qt(d,"The last range's upperBound must be InfiniteUpperBound"),a.messages.timestamps.append(a.header),a.header.extend(a.messages.dbChanges.unwrap()),a.ranges.timestamps.getCount()>0&&(a.ranges.timestamps.append(a.header),a.header.extend(a.ranges.types.unwrap()),a.header.extend(a.ranges.payloads.unwrap())),a.header.unwrap()),getSize:x}},to=()=>{let t=Qe.orThrow(0);const e=vr(),r=()=>{e.reset(),kt(e,t)};r();const n=vr();let s=0;const a=Iu((g,x)=>{kt(g,x)}),d=Iu((g,x)=>{Wg(g,x)});return{add:g=>{const x=g.millis-s;Qt(Qe.is(x),"The delta must be NonNegativeInt"),t++,r(),s=g.millis,kt(n,x),a.add(g.counter),d.add(g.nodeId)},addInfinite:()=>{t++,r()},getCount:()=>t,getLength:()=>e.getLength()+n.getLength()+a.getLength()+d.getLength(),append:g=>{g.extend(e.unwrap()),g.extend(n.unwrap()),g.extend(a.unwrap()),g.extend(d.unwrap())}}},Iu=t=>{const e=vr();let r=Qe.orThrow(0),n=null,s=Qe.orThrow(0);return{add:a=>{a===n?(s++,e.truncate(r)):(n=a,s=Qe.orThrow(1)),r=e.getLength(),t(e,a),kt(e,s)},getLength:()=>e.getLength(),unwrap:()=>e.unwrap()}},Og=t=>async(e,r={})=>{try{const n=vr(e),[s,a]=Tg(n),d=r.version??Zs;if(s!==d)return we({type:"ProtocolVersionError",version:s,isInitiator:d<s,ownerId:a});const g=n.shift();if(Qt(g===_r.Response||g===_r.Broadcast,"Invalid MessageType"),g===_r.Response){const V=n.shift();if(V!==gr.NoError)switch(V){case gr.WriteKeyError:return we({type:"ProtocolWriteKeyError",ownerId:a});case gr.WriteError:return we({type:"ProtocolWriteError",ownerId:a});case gr.QuotaError:return we({type:"ProtocolQuotaError",ownerId:a});case gr.SyncError:return we({type:"ProtocolSyncError",ownerId:a});default:throw new Br(`Invalid ProtocolErrorCode: ${V}`)}}const x=Ig(n),N=Ns(a);if(Ki(x)&&!(await t.storage.writeMessages(N,x)).ok)return ue({type:"no-response"});const S=r.getWriteKey?.(a);if(S==null)return ue({type:"no-response"});if(g===_r.Broadcast)return ue({type:"broadcast"});const w=Lg(n);if(!Ki(w))return ue({type:"no-response"});const I=eo(a,{messageType:_r.Request,writeKey:S,rangesMaxSize:r.rangesMaxSize}),j=Cg(t)(w,I,N);return!j.ok||!j.value?ue({type:"no-response"}):ue({type:"response",message:I.unwrap()})}catch(n){return we({type:"ProtocolInvalidDataError",data:e,error:n})}},Tg=t=>{const e=lr(t),r=Sa(t);return[e,r]};class Br extends Error{constructor(e){super(e),this.name=this.constructor.name,Error.captureStackTrace(this,this.constructor)}}const Ig=t=>{const e=qa(t),r=[];for(const n of e){const s=Mn(t),a=t.shiftN(s);r.push({timestamp:n,change:a})}return r},Cg=t=>(e,r,n)=>{const s=r.getSize(),a=t.storage.getSize(n);if(a==null)return we(gr.SyncError);let d=null,g=Qe.orThrow(0),x=!1,N=!1;const S=V=>{N&&V.upperBound===Ar?r.addRange({type:St.Skip,upperBound:Ar}):x=!0},w=()=>{N=!0,x&&(x=!1,Qt(d!=null,"prevUpperBound is null"),r.addRange({type:St.Skip,upperBound:d}))},I=V=>{const Y=t.storage.fingerprint(n,V,a);return Y?(r.addRange({type:St.Fingerprint,upperBound:Ar,fingerprint:Y}),!0):!1};for(const V of e){const Y=V.upperBound,ge=g;let Ee=t.storage.findLowerBound(n,g,a,Y);if(Ee==null)return we(gr.SyncError);switch(V.type){case St.Skip:{S(V);break}case St.Fingerprint:{const Ue=t.storage.fingerprint(n,ge,Ee);if(Ue==null)return we(gr.SyncError);if(hc(V.fingerprint,Ue))S(V);else if(r.canSplitRange())w(),Cu(t)(n,ge,Ee,Y,r);else return I(Ee)?ue(!0):we(gr.SyncError);break}case St.Timestamps:{let Ue=Y;const Re=new Map(V.timestamps.map(Be=>[Be.join(),!0])),Ie=to();let ot=!1,at=!1;if(t.storage.iterate(n,ge,Ee,(Be,$e)=>{const Ye=Be.join(),rt=fi(Be);let Ze=null;if(Re.has(Ye))Re.delete(Ye);else{const R=t.storage.readDbChange(n,Be);if(R==null)return ot=!0,!1;Ze={timestamp:rt,change:R}}return r.canAddTimestampsRangeAndMessage(Ie,Ze)?(Ie.add(rt),Ze&&r.addMessage(Ze),!0):(at=!0,Ue=Be,Ee=$e,!1)}),ot)return we(gr.SyncError);const Ce=()=>{w(),r.addRange({type:St.Timestamps,upperBound:Ue,timestamps:Ie})};if(at)return Ce(),I(Ee)?ue(!0):we(gr.SyncError);Re.size>0?Ce():S(V);break}}g=Ee,d=Y}const j=r.getSize()>s;return ue(j)},Cu=t=>(e,r,n,s,a)=>{const d=Qe.orThrow(n-r),g=Xp(d);if(!g.ok){const w={type:St.Timestamps,upperBound:s,timestamps:to()};t.storage.iterate(e,Qe.orThrow(0),d,I=>(w.timestamps.add(fi(I)),!0)),a.addRange(w);return}const x=r===0?g.value:[r,...g.value.map(w=>Qe.orThrow(w+r))],N=t.storage.fingerprintRanges(e,x,s);if(N==null)return;const S=r>0?N.slice(1):N;for(const w of S)a.addRange(w)},Lg=t=>{if(t.getLength()===0)return[];const e=lr(t);if(e===0)return[];const r=Qe.orThrow(e-1),n=qa(t,r),s=[];for(let d=0;d<e;d++){const g=lr(t);switch(g){case St.Fingerprint:case St.Skip:case St.Timestamps:s.push(g);break;default:throw new Br(`Invalid RangeType: ${g}`)}}const a=[];for(let d=0;d<e;d++){const g=d<r?Wn(n[d]):Ar;switch(s[d]){case St.Skip:a.push({type:St.Skip,upperBound:g});break;case St.Fingerprint:{const N=t.shiftN(zi);a.push({type:St.Fingerprint,upperBound:g,fingerprint:N});break}case St.Timestamps:{const N=qa(t).map(Wn);a.push({type:St.Timestamps,upperBound:g,timestamps:N});break}}}return a},qa=(t,e)=>{e??=lr(t);let r=0;const n=[];for(let N=0;N<e;N++){const S=lr(t),w=ba.from(r+S);if(!w.ok)throw new Br(w.error.type);n.push(w.value),r=w.value}const s=[];let a=0;for(;a<e;){const N=wa.from(lr(t));if(!N.ok)throw new Br(N.error.type);const S=lr(t);for(let w=0;w<S;w++)s.push(N.value),a++}const d=[];let g=0;for(;g<e;){const N=Dg(t),S=lr(t);for(let w=0;w<S;w++)d.push(N),g++}const x=[];for(let N=0;N<e;N++)x.push({millis:n[N],counter:s[N],nodeId:d[N]});return x},Sa=t=>{const e=t.shiftN(dh);return ys(e)},Lu=(t,e)=>{t.extend(Ys.pack(e))},Pu=t=>{let e,r;Ys.unpackMultiple(t.unwrap(),(a,d,g)=>(e=a,r=g,!1));const n=Qe.fromUnknown(r);if(!n.ok)throw new Br(n.error.type);const s=vn.fromUnknown(e);if(!s.ok)throw new Br(s.error.type);return t.shiftN(n.value),s.value},Pg=(t,e)=>{let r=0;for(let n=0;n<e.length&&n<8;n++)e[n]&&(r|=1<<n);t.extend([r])},Fg=(t,e)=>{const r=t.shift(),n=[];for(let s=0;s<e&&s<8;s++)n.push((r&1<<s)!==0);return n},Fu=t=>(e,r)=>{const n=vr();kt(n,Zs),n.extend(Wn(e.timestamp)),Pg(n,[e.change.isInsert,e.change.isDelete!=null,e.change.isDelete??!1]),ka(n,e.change.table),n.extend(gs(e.change.id));const s=Fl(e.change.values);Dn(n,s);for(const[g,x]of s)ka(n,g),Mg(n,x);n.extend(Np(n.getLength()));const{nonce:a,ciphertext:d}=t.symmetricCrypto.encrypt(n.unwrap(),r);return n.reset(),n.extend(a),Dn(n,d),n.extend(d),n.unwrap()},Rg=t=>(e,r)=>{try{const n=vr(e.change),s=n.shiftN(t.symmetricCrypto.nonceLength),a=n.shiftN(Mn(n)),d=t.symmetricCrypto.decrypt(a,r,s);if(!d.ok)return d;n.reset(),n.extend(d.value),lr(n);const g=fi(n.shiftN(ig));if(!Z_(g,e.timestamp))return we({type:"ProtocolTimestampMismatchError",expected:e.timestamp,timestamp:g});const x=Fg(n,Xt.orThrow(3)),N=Ea(n),S=Sa(n),w=Mn(n),I=Oo();for(let V=0;V<w;V++){const Y=Ea(n),ge=Ug(n);I[Y]=ge}const j=Eu.orThrow({table:N,id:S,values:I,isInsert:x[0],isDelete:x[1]?x[2]:null});return ue(j)}catch(n){return we({type:"ProtocolInvalidDataError",data:e.change,error:n})}},kt=(t,e)=>{if(e===0){t.extend([0]);return}let r=BigInt(e);const n=[];for(;r!==0n;){const s=globalThis.Number(r&127n);n.push(s),r>>=7n}for(let s=0;s<n.length-1;s++)n[s]|=128;t.extend(n)},lr=t=>{let e=0n,r=0n,n;for(let a=0;a<8&&(n=t.shift(),e|=BigInt(n&127)<<r,(n&128)!==0);a++)r+=7n;const s=Qe.from(globalThis.Number(e));if(!s.ok)throw new Br(s.error.type);return s.value},Dn=(t,e)=>{kt(t,Qe.orThrow(e.length))},Mn=lr,ka=(t,e)=>{const r=dd(e);Dn(t,r),t.extend(r)},Ea=t=>{const e=Mn(t),r=t.shiftN(e);return fd(r)},Wg=(t,e)=>{t.extend(Va(e))},Dg=t=>{const e=t.shiftN(Qe.orThrow(8));return lo(e)},Ru=t=>t>=0&&t<20,qt={String:Qe.orThrow(20),Number:Qe.orThrow(21),Null:Qe.orThrow(22),Bytes:Qe.orThrow(23),NonNegativeInt:Qe.orThrow(30),EmptyString:Qe.orThrow(31),Base64Url:Qe.orThrow(32),Id:Qe.orThrow(33),Json:Qe.orThrow(34),DateIsoWithNonNegativeTime:Qe.orThrow(35),DateIsoWithNegativeTime:Qe.orThrow(36)},Mg=(t,e)=>{if(e===null){kt(t,qt.Null);return}switch(typeof e){case"string":{if(e===""){kt(t,qt.EmptyString);return}const r=wi.fromParent(e);if(r.ok){const d=new Date(r.value).getTime();Qe.is(d)?(kt(t,qt.DateIsoWithNonNegativeTime),kt(t,d)):(kt(t,qt.DateIsoWithNegativeTime),Lu(t,d));return}const n=Po.fromParent(e);if(n.ok){kt(t,qt.Id),t.extend(gs(n.value));return}const s=Kh.fromParent(e);if(s.ok&&JSON.stringify(ec(s.value))===e){const d=Ys.pack(ec(s.value));kt(t,qt.Json),Dn(t,d),t.extend(d);return}const a=Bl.fromParent(e);if(a.ok){kt(t,qt.Base64Url);const d=Lo(a.value);Dn(t,d),t.extend(d);return}kt(t,qt.String),ka(t,e);return}case"number":{if(Qe.is(e)){if(Ru(e)){kt(t,e);return}kt(t,qt.NonNegativeInt),kt(t,e);return}kt(t,qt.Number),Lu(t,e);return}}kt(t,qt.Bytes),Dn(t,e),t.extend(e)},Ug=t=>{const e=lr(t);if(Ru(e))return e;switch(e){case qt.String:return Ea(t);case qt.Number:return Pu(t);case qt.Null:return null;case qt.Bytes:{const r=Mn(t);return t.shiftN(r)}case qt.Id:return Sa(t);case qt.NonNegativeInt:return lr(t);case qt.Json:{const r=Mn(t),n=t.shiftN(r);return JSON.stringify(Ys.unpack(n))}case qt.DateIsoWithNonNegativeTime:case qt.DateIsoWithNegativeTime:{const r=e===qt.DateIsoWithNonNegativeTime?lr(t):Pu(t),n=wi.fromParent(new Date(r).toISOString());if(!n.ok)throw new Br(n.error.type);return n.value}case qt.EmptyString:return"";case qt.Base64Url:{const r=Mn(t),n=t.shiftN(r);return _s(n)}default:throw new Br("invalid ProtocolValueType")}},$g=t=>{const[e,r,n]=JSON.parse(t),s=r.map(([d,g])=>d==="b"?Va(g):g),a=n.length?Object.fromEntries(n):void 0;return{sql:e,parameters:s,...a!==void 0&&{options:a}}},Bg=[],jg=()=>{const t=new Map;return e=>{let r=t.get(e);if(!r){let n=new Map;r={set:s=>{n=new Map([...n,...s])},get:()=>n},t.set(e,r)}return r}},Wu=t=>(e,r)=>{const n=[];for(const x of r){const N=$g(x),S=t.sqlite.exec(N);if(!S.ok)return S;n.push([x,S.value.rows]),N.options?.logExplainQueryPlan&&Pp(t)(N)}const s=t.getQueryRowsCache(e),a=s.get();s.set(n);const d=s.get(),g=r.map(x=>({query:x,patches:zg(a.get(x),d.get(x)??Bg)}));return ue(g)},zg=(t,e)=>{if(t===void 0)return[{op:"replaceAll",value:e}];if(t.length!==e.length)return[{op:"replaceAll",value:e}];const r=t.length,n=[];for(let s=0;s<r;s++){const a=t[s],d=e[s];for(const g in a)if(!Ep(a[g],d[g])){n.push({op:"replaceAt",value:d,index:s});break}}return r>0&&n.length===r?[{op:"replaceAll",value:e}]:n};lh({randomBytes:dc()});const Vg=t=>{let e=!1;const r=new Map,n=new Map,s=new Map,a=new Map,d=t.disposalDelay??100,g=S=>{const w=t.getResourceKey(S),I=a.get(w);if(I&&(clearTimeout(I),a.delete(w)),!r.has(w)){const j=t.createResource(S);r.set(w,j)}},x=S=>{const w=setTimeout(()=>{const I=r.get(S);I&&(I[Symbol.dispose](),r.delete(S)),a.delete(S)},d);a.set(S,w)},N={addConsumer:(S,w)=>{if(e)return;const I=t.getConsumerId(S);s.set(I,S);for(const j of w){g(j);const V=t.getResourceKey(j);let Y=n.get(V);Y||(Y=new Map,n.set(V,Y));const ge=Y.get(I)??0,Ee=ge+1;if(Y.set(I,Xt.orThrow(Ee)),ge===0&&t.onConsumerAdded){const Ue=r.get(V);Ue&&t.onConsumerAdded(S,Ue,V)}}},removeConsumer:(S,w)=>{if(e)return ue();const I=t.getConsumerId(S);for(const j of w){const V=t.getResourceKey(j),Y=n.get(V);if(!Y)return we({type:"ResourceNotFoundError",resourceKey:V});const ge=Y.get(I);if(ge==null)return we({type:"ConsumerNotFoundError",consumerId:I,resourceKey:V});if(ge===1){if(Y.delete(I),t.onConsumerRemoved){const Ee=r.get(V);Ee&&t.onConsumerRemoved(S,Ee,V)}Y.size===0&&(n.delete(V),x(V))}else Y.set(I,Xt.orThrow(ge-1))}return N.hasConsumerAnyResource(S)||s.delete(I),ue()},getResource:S=>e?null:r.get(S)??null,getConsumersForResource:S=>{if(e)return[];const w=n.get(S);return w?Array.from(w.keys()):[]},hasConsumerAnyResource:S=>{if(e)return!1;const w=t.getConsumerId(S);return Array.from(n.values()).some(I=>I.has(w))},getConsumer:S=>{if(e)return null;const w=s.get(S);return!w||!N.hasConsumerAnyResource(w)?null:w},[Symbol.dispose]:()=>{if(!e){e=!0;for(const S of a.values())clearTimeout(S);a.clear();for(const S of r.values())S[Symbol.dispose]();r.clear(),n.clear(),s.clear()}}};return N},Qg=()=>{const t={now:()=>{const e=t.nowIso();return new globalThis.Date(e).getTime()},nowIso:()=>{const e=new globalThis.Date().toISOString();return Qt(wi.is(e),"System clock returned invalid ISO date"),e}};return t},Aa=t=>{if(typeof t=="number")return t;const e={ms:1,s:1e3,m:6e4,h:36e5,d:864e5};let r=0,n=0;for(;n<t.length;){for(;n<t.length&&t[n]===" ";)n++;if(n>=t.length)break;let s="";for(;n<t.length&&t[n]>="0"&&t[n]<="9";)s+=t[n],n++;if(s==="")break;let a="";if(n<t.length&&(t[n]==="m"&&n+1<t.length&&t[n+1]==="s"?(a="ms",n+=2):(t[n]==="s"||t[n]==="m"||t[n]==="h"||t[n]==="d")&&(a=t[n],n++)),a==="")break;const d=parseInt(s,10);r+=d*e[a]}return Qe.orThrow(r)},Du=t=>typeof t=="object"&&t!==null&&t.type==="AbortError";typeof AbortSignal.any!="function"&&(AbortSignal.any=function(t){const e=new AbortController,r=s=>{e.abort(s.target.reason),n()},n=()=>{for(const s of t)s.removeEventListener("abort",r)};for(const s of t){if(s.aborted)return e.abort(s.reason),e.signal;s.addEventListener("abort",r)}return e.signal});const Mu=(t,e)=>t?.signal?AbortSignal.any([t.signal,e]):e,Oa=t=>(e=>{const r=e?.signal;if(!r)return t(e);if(r.aborted)return Promise.resolve(we({type:"AbortError",reason:r.reason}));const{promise:n,resolve:s}=Promise.withResolvers(),a=()=>{s(we({type:"AbortError",reason:r.reason}))};return r.addEventListener("abort",a,{once:!0}),Promise.race([n,t(e).then(d=>(r.removeEventListener("abort",a),d))])});typeof AbortSignal.timeout!="function"&&(AbortSignal.timeout=function(t){const e=new AbortController,r=setTimeout(()=>{e.abort()},t);return e.signal.addEventListener("abort",()=>{clearTimeout(r)}),e.signal});const Hg=t=>Oa(e=>new Promise(r=>{const n=Aa(t),s=AbortSignal.timeout(n);Mu(e,s).addEventListener("abort",()=>{r(ue())},{once:!0})})),Jg=({retries:t,initialDelay:e="1s",maxDelay:r="30s",factor:n=2,jitter:s=.5,retryable:a=x=>!Du(x),onRetry:d},g)=>Oa(async x=>{const N=Aa(e),S=Aa(r),w=Xt.orThrow(t);let I=0;for(;;){const j=await g(x);if(j.ok)return j;if(Du(j.error))return we(j.error);if(I+=1,I>w||!a(j.error))return we({type:"RetryError",cause:j.error,attempts:I});const V=N*Math.pow(n,I-1),Y=Math.min(V,S),ge=1-s+Math.random()*s*2,Ee=Math.floor(Y*ge);d&&d(j.error,I,Ee);{const Ue=await Hg(Qe.orThrow(Ee))(x);if(!Ue.ok)return Ue}}}),Kg=t=>{let e=!1,r=t;const n=[],s=new AbortController,a=()=>r>0?(r--,Promise.resolve()):new Promise(g=>{n.push(g)}),d=()=>{io(n)?$a(n)():r++};return{withPermit:g=>Oa(async x=>{if(await a(),e)return we({type:"AbortError",reason:"Semaphore disposed"});const N=Mu(x,s.signal),S=await g({signal:N});return d(),S}),[Symbol.dispose]:()=>{if(!e)for(e=!0,s.abort("Semaphore disposed");io(n);)$a(n)()}}},Gg=()=>{const t=Kg(Xt.orThrow(1));return{withLock:t.withPermit,[Symbol.dispose]:t[Symbol.dispose]}},Xg=t=>e=>{let r=!1;const n=N=>r?null:g.getConsumer(N),s=Yg({...t,getSyncOwner:n})(e);if(!s.ok)return s;const a=s.value,g=Vg({createResource:N=>{const S=Ia(N);return t.console.log("[sync]","createWebSocket",{transportKey:S,url:N.url}),t.createWebSocket(N.url,{binaryType:"arraybuffer",onOpen:()=>{if(r)return;const w=g.getResource(S);if(!w)return;const I=g.getConsumersForResource(S);t.console.log("[sync]","onOpen",{transportKey:S,ownerIds:I});for(const j of I){const V=Tu({storage:a})(j,Vi.Subscribe);V&&(t.console.log("[sync]","send",{message:V}),w.send(V))}},onClose:w=>{t.console.log("[sync]","onClose",{transportKey:S,code:w.code,reason:w.reason,wasClean:w.wasClean})},onError:w=>{t.console.warn("[sync]","onError",{transportKey:S,error:w})},onMessage:w=>{if(r||!(w instanceof ArrayBuffer))return;const I=g.getResource(S);if(!I)return;const j=new Uint8Array(w);t.console.log("[sync]","onMessage",{transportKey:S,message:j}),Og({storage:a})(j,{getWriteKey:V=>n(V)?.writeKey??null}).then(V=>{if(!V.ok){e.onError(V.error);return}V.value.type==="response"&&I.send(V.value.message)}).catch(V=>{e.onError(Kn(V))})}})},getResourceKey:Ia,getConsumerId:N=>N.id,disposalDelay:e.disposalDelayMs??100,onConsumerAdded:(N,S)=>{if(t.console.log("[sync]","onConsumerAdded",{ownerId:N.id,isOpen:S.isOpen()}),!S.isOpen())return;const w=Tu({storage:a})(N.id,Vi.Subscribe);w&&S.send(w)},onConsumerRemoved:(N,S)=>{t.console.log("[sync]","onConsumerRemoved",{ownerId:N.id,isOpen:S.isOpen()});const w=Ag(N.id);S.send(w)}});return ue({useOwner:(N,S)=>{if(r){t.console.warn("[sync]","useOwner called on disposed Sync instance",{owner:S});return}t.console.log("[sync]","useOwner",{use:N,owner:S});const w=S.transports??e.transports;if(N)g.addConsumer(S,w);else{const I=g.removeConsumer(S,w);I.ok||t.console.warn("[sync]","Failed to remove consumer",{transports:w,ownerId:S.id,error:I.error})}},applyChanges:N=>{t.console.log("[sync]","applyChanges",{changes:N});let S=t.clock.get();const w=new Map;for(const I of N){const j=rg(t)(S);if(!j.ok)return j;S=j.value;const{ownerId:V=e.appOwner.id,...Y}=I,ge={timestamp:S,change:Y},Ee=w.get(V);Ee?Ee.push(ge):w.set(V,[ge])}for(const[I,j]of w){const V=$u({...t,storage:a})(I,j);if(!V.ok)return V;const Y=n(I);if(!Y?.writeKey)continue;const ge=Eg(t)({id:Y.id,encryptionKey:Y.encryptionKey,writeKey:Y.writeKey},j),Ee=Y.transports??e.transports;for(const Ue of Ee){const Re=Ia(Ue),Ie=g.getResource(Re);Ie&&Ie.isOpen()&&(t.console.log("[sync]","send",{transportKey:Re,message:ge}),Ie.send(ge))}}return t.clock.save(S)},[Symbol.dispose]:()=>{r||(r=!0,g[Symbol.dispose]())}})},Ta=t=>(e=tg(t))=>{let r=e;return{get:()=>r,save:n=>{r=n;const s=t.sqlite.exec(Le.prepared`
          update evolu_config
          set "clock" = ${Wn(n)};
        `);return s.ok?ue():s}}},Yg=t=>e=>{const r=cg(t)({onStorageError:e.onError,isOwnerWithinQuota:Sp}),n=Gg(),s={...r,validateWriteKey:pc,setWriteKey:pc,writeMessages:async(a,d)=>{const g=vs(a),x=await n.withLock(async()=>{const N=t.getSyncOwner(g);if(!N)return ue(!0);const S=[];for(const I of d){const j=Rg(t)(I,N.encryptionKey);if(!j.ok)return j;S.push({timestamp:I.timestamp,change:j.value})}const w=t.sqlite.transaction(()=>{let I=t.clock.get();for(const j of S){const V=ng(t)(I,j.timestamp);if(!V.ok)return V;I=V.value}if(Ki(S)){const j=$u({...t,storage:s})(N.id,S);if(!j.ok)return j}return t.clock.save(I)});return w.ok?ue(!0):w})();return x.ok?(e.onReceive(),ue()):(x.error.type!=="AbortError"&&e.onError(x.error),we({type:"StorageWriteError",ownerId:g}))},readDbChange:(a,d)=>{const g=t.getSyncOwner(vs(a));if(!g)return null;const x=t.sqlite.exec(Le`
          select "table", "id", "column", "value"
          from evolu_history
          where "ownerId" = ${a} and "timestamp" = ${d}
          union all
          select "table", "id", "column", "value"
          from evolu_message_quarantine
          where "ownerId" = ${a} and "timestamp" = ${d};
        `);if(!x.ok)return e.onError(x.error),null;const{rows:N}=x.value;so(N,"Every timestamp must have rows");const S=Gi(N),w=Oo();let I=!1,j=null;for(const Y of N)switch(Y.column){case"createdAt":I=!0;break;case"updatedAt":I=!1;break;case"isDeleted":_c.is(Y.value)&&(j=Dp(Y.value));break;default:w[Y.column]=Y.value}const V={timestamp:fi(d),change:Eu.orThrow({table:S.table,id:ys(S.id),values:w,isInsert:I,isDelete:j})};return Fu(t)(V,g.encryptionKey)}};return ue(s)},Ia=t=>`${t.type}:${t.url}`,Uu=(t,e)=>{let r=Fl(t.values);return r=Ua(r,[t.isInsert?"createdAt":"updatedAt",e]),t.isDelete!=null&&(r=Ua(r,["isDeleted",Wp(t.isDelete)])),r},Zg=t=>e=>{if(e.isDelete){const r=t.sqlite.exec(Le`
        delete from ${Le.identifier(e.table)}
        where id = ${e.id};
      `);if(!r.ok)return r}else{const r=t.appOwner.id,n=Uu(e,t.time.nowIso());for(const[s,a]of n){const d=t.sqlite.exec(Le.prepared`
          insert into ${Le.identifier(e.table)}
            ("ownerId", "id", ${Le.identifier(s)})
          values (${r}, ${e.id}, ${a})
          on conflict ("ownerId", "id") do update
            set ${Le.identifier(s)} = ${a};
        `);if(!d.ok)return d}}return ue()},$u=t=>(e,r)=>{const n=Ns(e),s=qg(t)(n,Wn(Gi(r).timestamp));if(!s.ok)return s;let{firstTimestamp:a,lastTimestamp:d}=s.value;for(const{timestamp:g,change:x}of r){const N=Uu(x,sg(g)),S=gs(x.id),w=Wn(g);for(const[V,Y]of N)if(Bu(t)(x.table,V,Y)){const ge=ju(t)(n,e,x.table,S,x.id,V,Y,w);if(!ge.ok)return ge}else{const ge=t.sqlite.exec(Le.prepared`
            insert into evolu_message_quarantine
              ("ownerId", "timestamp", "table", "id", "column", "value")
            values
              (
                ${n},
                ${w},
                ${x.table},
                ${S},
                ${V},
                ${Y}
              )
            on conflict do nothing;
          `);if(!ge.ok)return ge}let I;[I,a,d]=dg(w,a,d);const j=t.storage.insertTimestamp(n,w,I);if(!j.ok)return j}return Sg(t)(n,1,a,d)},ey=_a.difference(new Set(["ownerId"])),Bu=t=>(e,r,n)=>{const s=Rl(t.dbSchema.tables,e);return s!=null&&(ey.has(r)||s.has(r))},ju=t=>(e,r,n,s,a,d,g,x)=>{const N=t.sqlite.exec(Le.prepared`
      with
        existingTimestamp as (
          select 1
          from evolu_history
          where
            "ownerId" = ${e}
            and "table" = ${n}
            and "id" = ${s}
            and "column" = ${d}
            and "timestamp" >= ${x}
          limit 1
        )
      insert into ${Le.identifier(n)}
        ("ownerId", "id", ${Le.identifier(d)})
      select ${r}, ${a}, ${g}
      where not exists (select 1 from existingTimestamp)
      on conflict ("ownerId", "id") do update
        set ${Le.identifier(d)} = ${g}
        where not exists (select 1 from existingTimestamp);
    `);if(!N.ok)return N;{const S=t.sqlite.exec(Le.prepared`
        insert into evolu_history
          ("ownerId", "table", "id", "column", "value", "timestamp")
        values
          (
            ${e},
            ${n},
            ${s},
            ${d},
            ${g},
            ${x}
          )
        on conflict do nothing;
      `);if(!S.ok)return S}return ue()},ty=t=>()=>{const e=t.sqlite.exec(Le`
      select "ownerId", "timestamp", "table", "id", "column", "value"
      from evolu_message_quarantine;
    `);if(!e.ok)return e;for(const r of e.value.rows){if(!Bu(t)(r.table,r.column,r.value))continue;const n=ju(t)(r.ownerId,vs(r.ownerId),r.table,r.id,ys(r.id),r.column,r.value,r.timestamp);if(!n.ok)return n;{const s=t.sqlite.exec(Le`
          delete from evolu_message_quarantine
          where
            "ownerId" = ${r.ownerId}
            and "timestamp" = ${r.timestamp}
            and "table" = ${r.table}
            and "id" = ${r.id}
            and "column" = ${r.column};
        `);if(!s.ok)return s}}return ue()};sh.orThrow("Evolu");const ry=t=>Up({init:async(e,r)=>{t.console.enabled=e.config.enableLogging??!1;const n=await ny(t,e,r);return n.ok?n.value:(r({type:"onError",error:n.error}),null)},handlers:sy}),ny=async(t,e,r)=>{const n=await Ap(t)(e.config.name,{memory:e.config.inMemory??!1,encryptionKey:e.config.encryptionKey??void 0});if(!n.ok)return n;const s={...t,sqlite:n.value};return s.sqlite.transaction(()=>{const a=ga(s)();if(!a.ok)return a;const d="evolu_version"in a.value.tables;let g,x;if(d){const S=s.sqlite.exec(Le`select protocolVersion from evolu_version limit 1;`);if(!S.ok)return S;const w=s.sqlite.exec(Le`
        select
          clock,
          appOwnerId,
          appOwnerEncryptionKey,
          appOwnerWriteKey,
          appOwnerMnemonic
        from evolu_config
        limit 1;
      `);if(!w.ok)return w;so(w.value.rows);const I=Gi(w.value.rows);g={type:"AppOwner",id:I.appOwnerId,encryptionKey:I.appOwnerEncryptionKey,writeKey:I.appOwnerWriteKey,mnemonic:I.appOwnerMnemonic},x=Ta(s)(fi(I.clock))}else{g=e.config.externalAppOwner??yc(Vp(t)),x=Ta(s)();const S=zu(s)(g,x.get());if(!S.ok)return S}{const S=ya(s)(e.dbSchema,a.value);if(!S.ok)return S}{const S=iy(s);if(!S.ok)return S}const N=Xg({...s,clock:x,symmetricCrypto:wp(t),timestampConfig:e.config,dbSchema:e.dbSchema})({appOwner:g,transports:e.config.transports,onError:S=>{r({type:"onError",error:S})},onReceive:()=>{r({type:"refreshQueries"})}});if(!N.ok)return N;{const S=ty({...s,dbSchema:e.dbSchema})();if(!S.ok)return S}return N.value.useOwner(!0,g),ue({...s,getQueryRowsCache:jg(),postMessage:r,sync:N.value,appOwner:g})})},zu=t=>(e,r)=>{for(const s of[Le`
        create table evolu_version (
          "protocolVersion" integer not null
        )
        strict;
      `,Le`
        insert into evolu_version ("protocolVersion")
        values (${Zs});
      `,Le`
        create table evolu_config (
          "clock" blob not null,
          "appOwnerId" text not null,
          "appOwnerEncryptionKey" blob not null,
          "appOwnerWriteKey" blob not null,
          "appOwnerMnemonic" text
        )
        strict;
      `,Le`
        insert into evolu_config
          (
            "clock",
            "appOwnerId",
            "appOwnerEncryptionKey",
            "appOwnerWriteKey",
            "appOwnerMnemonic"
          )
        values
          (
            ${Wn(r)},
            ${e.id},
            ${e.encryptionKey},
            ${e.writeKey},
            ${e.mnemonic??null}
          );
      `,Le`
        create table evolu_history (
          "ownerId" blob not null,
          "table" text not null,
          "id" blob not null,
          "column" text not null,
          "timestamp" blob not null,
          "value" any
        )
        strict;
      `,Le`
        create index evolu_history_ownerId_timestamp on evolu_history (
          "ownerId",
          "timestamp"
        );
      `,Le`
        create unique index evolu_history_ownerId_table_id_column_timestampDesc on evolu_history (
          "ownerId",
          "table",
          "id",
          "column",
          "timestamp" desc
        );
      `]){const a=t.sqlite.exec(s);if(!a.ok)return a}const n=ug(t);return n.ok?ue():n},iy=t=>{const e=t.sqlite.exec(Le`
    create table if not exists evolu_message_quarantine (
      "ownerId" blob not null,
      "timestamp" blob not null,
      "table" text not null,
      "id" blob not null,
      "column" text not null,
      "value" any,
      primary key ("ownerId", "timestamp", "table", "id", "column")
    )
    strict;
  `);return e.ok?ue():e},sy={getAppOwner:t=>()=>{t.postMessage({type:"onGetAppOwner",appOwner:t.appOwner})},mutate:t=>e=>{const r=t.sqlite.transaction(()=>{const n=[];for(const a of e.changes)if(a.table.startsWith("_")){const g=Zg(t)(a);if(!g.ok)return g}else n.push(a);if(io(n)){const a=t.sync.applyChanges(n);if(!a.ok)return a}const s=Wu(t)(e.tabId,e.subscribedQueries);return s.ok?(t.postMessage({type:"onQueryPatches",tabId:e.tabId,queryPatches:s.value,onCompleteIds:e.onCompleteIds}),t.postMessage({type:"refreshQueries",tabId:e.tabId}),ue()):s});if(!r.ok){t.postMessage({type:"onError",error:r.error});return}},query:t=>e=>{const r=Wu(t)(e.tabId,e.queries);if(!r.ok){t.postMessage({type:"onError",error:r.error});return}t.postMessage({type:"onQueryPatches",tabId:e.tabId,queryPatches:r.value,onCompleteIds:[]})},reset:t=>e=>{const r=t.sqlite.transaction(()=>{const n=ga(t)();if(!n.ok)return n;for(const s in n.value.tables){const a=t.sqlite.exec(Le`
          drop table ${Le.identifier(s)};
        `);if(!a.ok)return a}if(e.restore){const s=ya(t)(e.restore.dbSchema);if(!s.ok)return s;const a=Hp(e.restore.mnemonic),d=yc(a),g=Ta(t)();return zu(t)(d,g.get())}return ue()});if(!r.ok){t.postMessage({type:"onError",error:r.error});return}t.postMessage({type:"onReset",onCompleteId:e.onCompleteId,reload:e.reload})},ensureDbSchema:t=>e=>{const r=t.sqlite.transaction(()=>ya(t)(e.dbSchema));if(!r.ok){t.postMessage({type:"onError",error:r.error});return}},export:t=>e=>{const r=t.sqlite.export();if(!r.ok){t.postMessage({type:"onError",error:r.error});return}t.postMessage({type:"onExport",onCompleteId:e.onCompleteId,file:r.value})},useOwner:t=>e=>{t.sync.useOwner(e.use,e.owner)}},oy=()=>({next:()=>Math.random()}),ay=(t,{protocols:e,binaryType:r,onOpen:n,onClose:s,onMessage:a,onError:d,retryOptions:g,WebSocketConstructor:x=globalThis.WebSocket}={})=>{let N=!1;const S=new AbortController,w={retries:wh};let I=null;const j=()=>{I&&(I.onopen=null,I.onclose=null,I.onmessage=null,I.onerror=null,I.readyState!==I.CLOSING&&I.readyState!==I.CLOSED&&I.close(),I=null)};let V=null;return Jg({...w,...g},()=>new Promise(Y=>{V=()=>{Y(ue())},N&&V(),j(),I=new x(t,e),r&&(I.binaryType=r);let ge=!1;I.onopen=()=>{ge=!0,n?.()},I.onerror=Ee=>{const Ue=ge?{type:"WebSocketConnectionError",event:Ee}:{type:"WebSocketConnectError",event:Ee};d?.(Ue),Ue.type==="WebSocketConnectError"&&Y(we(Ue))},I.onclose=Ee=>{s?.(Ee),Y(we({type:"WebSocketConnectionCloseError",event:Ee}))},I.onmessage=Ee=>{a?.(Ee.data)}}))(S).then(Y=>{Y.ok||Y.error.type==="AbortError"||d?.(Y.error)}),{send:Y=>!I||I.readyState===I.CONNECTING?we({type:"WebSocketSendError"}):(I.send(Y),ue()),getReadyState:()=>I?ly[I.readyState]:"connecting",isOpen:()=>I?I.readyState===I.OPEN:!1,[Symbol.dispose](){N||(N=!0,S.abort(),j(),V?.())}}},ly={[WebSocket.CONNECTING]:"connecting",[WebSocket.OPEN]:"open",[WebSocket.CLOSING]:"closing",[WebSocket.CLOSED]:"closed"};var Ca=async function(t={}){var e,r=t,n=typeof window=="object",s=typeof WorkerGlobalScope<"u";typeof process=="object"&&process.versions?.node&&process.type!="renderer";const a=globalThis.sqlite3InitModuleState||Object.assign(Object.create(null),{debugModule:()=>{}});delete globalThis.sqlite3InitModuleState,a.debugModule("globalThis.location =",globalThis.location);var d="./this.program",g=(i,o)=>{throw o},x=self.location.href,N="";function S(i){return r.locateFile?r.locateFile(i,N):N+i}var w,I;if(n||s){try{N=new URL(".",x).href}catch{}s&&(I=i=>{var o=new XMLHttpRequest;return o.open("GET",i,!1),o.responseType="arraybuffer",o.send(null),new Uint8Array(o.response)}),w=async i=>{var o=await fetch(i,{credentials:"same-origin"});if(o.ok)return o.arrayBuffer();throw new Error(o.status+" : "+o.url)}}var j=console.log.bind(console),V=console.error.bind(console),Y,ge=!1,Ee,Ue,Re,Ie,ot,at,Ce,Be,$e,Ye=!1;function rt(){var i=Re.buffer;r.HEAP8=Ie=new Int8Array(i),r.HEAP16=at=new Int16Array(i),r.HEAPU8=ot=new Uint8Array(i),r.HEAPU16=new Uint16Array(i),r.HEAP32=Ce=new Int32Array(i),r.HEAPU32=Be=new Uint32Array(i),r.HEAP64=$e=new BigInt64Array(i),r.HEAPU64=new BigUint64Array(i)}function Ze(){if(r.wasmMemory)Re=r.wasmMemory;else{var i=r.INITIAL_MEMORY||16777216;Re=new WebAssembly.Memory({initial:i/65536,maximum:32768})}rt()}function R(){if(r.preRun)for(typeof r.preRun=="function"&&(r.preRun=[r.preRun]);r.preRun.length;)my(r.preRun.shift());Vu(Hu)}function pe(){Ye=!0,!r.noFSInit&&!m.initialized&&m.init(),mi.__wasm_call_ctors(),m.ignorePermissions=!1}function oe(){if(r.postRun)for(typeof r.postRun=="function"&&(r.postRun=[r.postRun]);r.postRun.length;)py(r.postRun.shift());Vu(Qu)}var ne=0,se=null;function Oe(i){ne++,r.monitorRunDependencies?.(ne)}function he(i){if(ne--,r.monitorRunDependencies?.(ne),ne==0&&se){var o=se;se=null,o()}}function Se(i){r.onAbort?.(i),i="Aborted("+i+")",V(i),ge=!0,i+=". Build with -sASSERTIONS for more info.";var o=new WebAssembly.RuntimeError(i);throw Ue?.(o),o}var je;function ze(){return r.locateFile?S("sqlite3.wasm"):new URL("/assets/sqlite3-B7imZ2XV.wasm",self.location.href).href}function Et(i){if(i==je&&Y)return new Uint8Array(Y);if(I)return I(i);throw"both async and sync fetching of the wasm failed"}async function $t(i){if(!Y)try{var o=await w(i);return new Uint8Array(o)}catch{}return Et(i)}async function Gt(i,o){try{var u=await $t(i),l=await WebAssembly.instantiate(u,o);return l}catch(c){V(`failed to asynchronously prepare wasm: ${c}`),Se(c)}}async function gn(i,o,u){if(!i&&typeof WebAssembly.instantiateStreaming=="function")try{var l=fetch(o,{credentials:"same-origin"}),c=await WebAssembly.instantiateStreaming(l,u);return c}catch(h){V(`wasm streaming compile failed: ${h}`),V("falling back to ArrayBuffer instantiation")}return Gt(o,u)}function yn(){return{env:id,wasi_snapshot_preview1:id}}async function bn(){function i(h,A){return mi=h.exports,N0(mi),he(),mi}Oe();function o(h){return i(h.instance)}var u=yn();if(r.instantiateWasm)return new Promise((h,A)=>{r.instantiateWasm(u,(O,Z)=>{h(i(O))})});je??=ze();var l=await gn(Y,je,u),c=o(l);return c}class wn{name="ExitStatus";constructor(o){this.message=`Program terminated with exit(${o})`,this.status=o}}var Vu=i=>{for(;i.length>0;)i.shift()(r)},Qu=[],py=i=>Qu.push(i),Hu=[],my=i=>Hu.push(i),Ju=!0,dt={isAbs:i=>i.charAt(0)==="/",splitPath:i=>{var o=/^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;return o.exec(i).slice(1)},normalizeArray:(i,o)=>{for(var u=0,l=i.length-1;l>=0;l--){var c=i[l];c==="."?i.splice(l,1):c===".."?(i.splice(l,1),u++):u&&(i.splice(l,1),u--)}if(o)for(;u;u--)i.unshift("..");return i},normalize:i=>{var o=dt.isAbs(i),u=i.slice(-1)==="/";return i=dt.normalizeArray(i.split("/").filter(l=>!!l),!o).join("/"),!i&&!o&&(i="."),i&&u&&(i+="/"),(o?"/":"")+i},dirname:i=>{var o=dt.splitPath(i),u=o[0],l=o[1];return!u&&!l?".":(l&&(l=l.slice(0,-1)),u+l)},basename:i=>i&&i.match(/([^\/]+|\/)\/*$/)[1],join:(...i)=>dt.normalize(i.join("/")),join2:(i,o)=>dt.normalize(i+"/"+o)},_y=()=>i=>crypto.getRandomValues(i),La=i=>{(La=_y())(i)},hi={resolve:(...i)=>{for(var o="",u=!1,l=i.length-1;l>=-1&&!u;l--){var c=l>=0?i[l]:m.cwd();if(typeof c!="string")throw new TypeError("Arguments to path.resolve must be strings");if(!c)return"";o=c+"/"+o,u=dt.isAbs(c)}return o=dt.normalizeArray(o.split("/").filter(h=>!!h),!u).join("/"),(u?"/":"")+o||"."},relative:(i,o)=>{i=hi.resolve(i).slice(1),o=hi.resolve(o).slice(1);function u(ee){for(var fe=0;fe<ee.length&&ee[fe]==="";fe++);for(var _e=ee.length-1;_e>=0&&ee[_e]==="";_e--);return fe>_e?[]:ee.slice(fe,_e-fe+1)}for(var l=u(i.split("/")),c=u(o.split("/")),h=Math.min(l.length,c.length),A=h,O=0;O<h;O++)if(l[O]!==c[O]){A=O;break}for(var Z=[],O=A;O<l.length;O++)Z.push("..");return Z=Z.concat(c.slice(A)),Z.join("/")}},Ku=new TextDecoder,Qi=(i,o=0,u=NaN)=>{for(var l=o+u,c=o;i[c]&&!(c>=l);)++c;return Ku.decode(i.buffer?i.subarray(o,c):new Uint8Array(i.slice(o,c)))},Pa=[],ro=i=>{for(var o=0,u=0;u<i.length;++u){var l=i.charCodeAt(u);l<=127?o++:l<=2047?o+=2:l>=55296&&l<=57343?(o+=4,++u):o+=3}return o},Gu=(i,o,u,l)=>{if(!(l>0))return 0;for(var c=u,h=u+l-1,A=0;A<i.length;++A){var O=i.codePointAt(A);if(O<=127){if(u>=h)break;o[u++]=O}else if(O<=2047){if(u+1>=h)break;o[u++]=192|O>>6,o[u++]=128|O&63}else if(O<=65535){if(u+2>=h)break;o[u++]=224|O>>12,o[u++]=128|O>>6&63,o[u++]=128|O&63}else{if(u+3>=h)break;o[u++]=240|O>>18,o[u++]=128|O>>12&63,o[u++]=128|O>>6&63,o[u++]=128|O&63,A++}}return o[u]=0,u-c},Fa=(i,o,u)=>{var l=ro(i)+1,c=new Array(l),h=Gu(i,c,0,c.length);return c.length=h,c},gy=()=>{if(!Pa.length){var i=null;if(typeof window<"u"&&typeof window.prompt=="function"&&(i=window.prompt("Input: "),i!==null&&(i+=`
`)),!i)return null;Pa=Fa(i)}return Pa.shift()},Un={ttys:[],init(){},shutdown(){},register(i,o){Un.ttys[i]={input:[],output:[],ops:o},m.registerDevice(i,Un.stream_ops)},stream_ops:{open(i){var o=Un.ttys[i.node.rdev];if(!o)throw new m.ErrnoError(43);i.tty=o,i.seekable=!1},close(i){i.tty.ops.fsync(i.tty)},fsync(i){i.tty.ops.fsync(i.tty)},read(i,o,u,l,c){if(!i.tty||!i.tty.ops.get_char)throw new m.ErrnoError(60);for(var h=0,A=0;A<l;A++){var O;try{O=i.tty.ops.get_char(i.tty)}catch{throw new m.ErrnoError(29)}if(O===void 0&&h===0)throw new m.ErrnoError(6);if(O==null)break;h++,o[u+A]=O}return h&&(i.node.atime=Date.now()),h},write(i,o,u,l,c){if(!i.tty||!i.tty.ops.put_char)throw new m.ErrnoError(60);try{for(var h=0;h<l;h++)i.tty.ops.put_char(i.tty,o[u+h])}catch{throw new m.ErrnoError(29)}return l&&(i.node.mtime=i.node.ctime=Date.now()),h}},default_tty_ops:{get_char(i){return gy()},put_char(i,o){o===null||o===10?(j(Qi(i.output)),i.output=[]):o!=0&&i.output.push(o)},fsync(i){i.output?.length>0&&(j(Qi(i.output)),i.output=[])},ioctl_tcgets(i){return{c_iflag:25856,c_oflag:5,c_cflag:191,c_lflag:35387,c_cc:[3,28,127,21,4,0,1,0,17,19,26,0,18,15,23,22,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]}},ioctl_tcsets(i,o,u){return 0},ioctl_tiocgwinsz(i){return[24,80]}},default_tty1_ops:{put_char(i,o){o===null||o===10?(V(Qi(i.output)),i.output=[]):o!=0&&i.output.push(o)},fsync(i){i.output?.length>0&&(V(Qi(i.output)),i.output=[])}}},yy=(i,o)=>ot.fill(0,i,i+o),Xu=(i,o)=>Math.ceil(i/o)*o,Yu=i=>{i=Xu(i,65536);var o=nd(65536,i);return o&&yy(o,i),o},Ke={ops_table:null,mount(i){return Ke.createNode(null,"/",16895,0)},createNode(i,o,u,l){if(m.isBlkdev(u)||m.isFIFO(u))throw new m.ErrnoError(63);Ke.ops_table||={dir:{node:{getattr:Ke.node_ops.getattr,setattr:Ke.node_ops.setattr,lookup:Ke.node_ops.lookup,mknod:Ke.node_ops.mknod,rename:Ke.node_ops.rename,unlink:Ke.node_ops.unlink,rmdir:Ke.node_ops.rmdir,readdir:Ke.node_ops.readdir,symlink:Ke.node_ops.symlink},stream:{llseek:Ke.stream_ops.llseek}},file:{node:{getattr:Ke.node_ops.getattr,setattr:Ke.node_ops.setattr},stream:{llseek:Ke.stream_ops.llseek,read:Ke.stream_ops.read,write:Ke.stream_ops.write,mmap:Ke.stream_ops.mmap,msync:Ke.stream_ops.msync}},link:{node:{getattr:Ke.node_ops.getattr,setattr:Ke.node_ops.setattr,readlink:Ke.node_ops.readlink},stream:{}},chrdev:{node:{getattr:Ke.node_ops.getattr,setattr:Ke.node_ops.setattr},stream:m.chrdev_stream_ops}};var c=m.createNode(i,o,u,l);return m.isDir(c.mode)?(c.node_ops=Ke.ops_table.dir.node,c.stream_ops=Ke.ops_table.dir.stream,c.contents={}):m.isFile(c.mode)?(c.node_ops=Ke.ops_table.file.node,c.stream_ops=Ke.ops_table.file.stream,c.usedBytes=0,c.contents=null):m.isLink(c.mode)?(c.node_ops=Ke.ops_table.link.node,c.stream_ops=Ke.ops_table.link.stream):m.isChrdev(c.mode)&&(c.node_ops=Ke.ops_table.chrdev.node,c.stream_ops=Ke.ops_table.chrdev.stream),c.atime=c.mtime=c.ctime=Date.now(),i&&(i.contents[o]=c,i.atime=i.mtime=i.ctime=c.atime),c},getFileDataAsTypedArray(i){return i.contents?i.contents.subarray?i.contents.subarray(0,i.usedBytes):new Uint8Array(i.contents):new Uint8Array(0)},expandFileStorage(i,o){var u=i.contents?i.contents.length:0;if(!(u>=o)){var l=1024*1024;o=Math.max(o,u*(u<l?2:1.125)>>>0),u!=0&&(o=Math.max(o,256));var c=i.contents;i.contents=new Uint8Array(o),i.usedBytes>0&&i.contents.set(c.subarray(0,i.usedBytes),0)}},resizeFileStorage(i,o){if(i.usedBytes!=o)if(o==0)i.contents=null,i.usedBytes=0;else{var u=i.contents;i.contents=new Uint8Array(o),u&&i.contents.set(u.subarray(0,Math.min(o,i.usedBytes))),i.usedBytes=o}},node_ops:{getattr(i){var o={};return o.dev=m.isChrdev(i.mode)?i.id:1,o.ino=i.id,o.mode=i.mode,o.nlink=1,o.uid=0,o.gid=0,o.rdev=i.rdev,m.isDir(i.mode)?o.size=4096:m.isFile(i.mode)?o.size=i.usedBytes:m.isLink(i.mode)?o.size=i.link.length:o.size=0,o.atime=new Date(i.atime),o.mtime=new Date(i.mtime),o.ctime=new Date(i.ctime),o.blksize=4096,o.blocks=Math.ceil(o.size/o.blksize),o},setattr(i,o){for(const u of["mode","atime","mtime","ctime"])o[u]!=null&&(i[u]=o[u]);o.size!==void 0&&Ke.resizeFileStorage(i,o.size)},lookup(i,o){throw Ke.doesNotExistError},mknod(i,o,u,l){return Ke.createNode(i,o,u,l)},rename(i,o,u){var l;try{l=m.lookupNode(o,u)}catch{}if(l){if(m.isDir(i.mode))for(var c in l.contents)throw new m.ErrnoError(55);m.hashRemoveNode(l)}delete i.parent.contents[i.name],o.contents[u]=i,i.name=u,o.ctime=o.mtime=i.parent.ctime=i.parent.mtime=Date.now()},unlink(i,o){delete i.contents[o],i.ctime=i.mtime=Date.now()},rmdir(i,o){var u=m.lookupNode(i,o);for(var l in u.contents)throw new m.ErrnoError(55);delete i.contents[o],i.ctime=i.mtime=Date.now()},readdir(i){return[".","..",...Object.keys(i.contents)]},symlink(i,o,u){var l=Ke.createNode(i,o,41471,0);return l.link=u,l},readlink(i){if(!m.isLink(i.mode))throw new m.ErrnoError(28);return i.link}},stream_ops:{read(i,o,u,l,c){var h=i.node.contents;if(c>=i.node.usedBytes)return 0;var A=Math.min(i.node.usedBytes-c,l);if(A>8&&h.subarray)o.set(h.subarray(c,c+A),u);else for(var O=0;O<A;O++)o[u+O]=h[c+O];return A},write(i,o,u,l,c,h){if(o.buffer===Ie.buffer&&(h=!1),!l)return 0;var A=i.node;if(A.mtime=A.ctime=Date.now(),o.subarray&&(!A.contents||A.contents.subarray)){if(h)return A.contents=o.subarray(u,u+l),A.usedBytes=l,l;if(A.usedBytes===0&&c===0)return A.contents=o.slice(u,u+l),A.usedBytes=l,l;if(c+l<=A.usedBytes)return A.contents.set(o.subarray(u,u+l),c),l}if(Ke.expandFileStorage(A,c+l),A.contents.subarray&&o.subarray)A.contents.set(o.subarray(u,u+l),c);else for(var O=0;O<l;O++)A.contents[c+O]=o[u+O];return A.usedBytes=Math.max(A.usedBytes,c+l),l},llseek(i,o,u){var l=o;if(u===1?l+=i.position:u===2&&m.isFile(i.node.mode)&&(l+=i.node.usedBytes),l<0)throw new m.ErrnoError(28);return l},mmap(i,o,u,l,c){if(!m.isFile(i.node.mode))throw new m.ErrnoError(43);var h,A,O=i.node.contents;if(!(c&2)&&O&&O.buffer===Ie.buffer)A=!1,h=O.byteOffset;else{if(A=!0,h=Yu(o),!h)throw new m.ErrnoError(48);O&&((u>0||u+o<O.length)&&(O.subarray?O=O.subarray(u,u+o):O=Array.prototype.slice.call(O,u,u+o)),Ie.set(O,h))}return{ptr:h,allocated:A}},msync(i,o,u,l,c){return Ke.stream_ops.write(i,o,0,l,u,!1),0}}},by=async i=>{var o=await w(i);return new Uint8Array(o)},wy=(...i)=>m.createDataFile(...i),Zu=[],xy=(i,o,u,l)=>{typeof Browser<"u"&&Browser.init();var c=!1;return Zu.forEach(h=>{c||h.canHandle(o)&&(h.handle(i,o,u,l),c=!0)}),c},Ny=(i,o,u,l,c,h,A,O,Z,ee)=>{var fe=o?hi.resolve(dt.join2(i,o)):i;function _e(H){function $(ae){ee?.(),O||wy(i,o,ae,l,c,Z),h?.(),he()}xy(H,fe,$,()=>{A?.(),he()})||$(H)}Oe(),typeof u=="string"?by(u).then(_e,A):_e(u)},vy=i=>{var o={r:0,"r+":2,w:577,"w+":578,a:1089,"a+":1090},u=o[i];if(typeof u>"u")throw new Error(`Unknown file open mode: ${i}`);return u},Ra=(i,o)=>{var u=0;return i&&(u|=365),o&&(u|=146),u},m={root:null,mounts:[],devices:{},streams:[],nextInode:1,nameTable:null,currentPath:"/",initialized:!1,ignorePermissions:!0,filesystems:null,syncFSRequests:0,readFiles:{},ErrnoError:class{name="ErrnoError";constructor(i){this.errno=i}},FSStream:class{shared={};get object(){return this.node}set object(i){this.node=i}get isRead(){return(this.flags&2097155)!==1}get isWrite(){return(this.flags&2097155)!==0}get isAppend(){return this.flags&1024}get flags(){return this.shared.flags}set flags(i){this.shared.flags=i}get position(){return this.shared.position}set position(i){this.shared.position=i}},FSNode:class{node_ops={};stream_ops={};readMode=365;writeMode=146;mounted=null;constructor(i,o,u,l){i||(i=this),this.parent=i,this.mount=i.mount,this.id=m.nextInode++,this.name=o,this.mode=u,this.rdev=l,this.atime=this.mtime=this.ctime=Date.now()}get read(){return(this.mode&this.readMode)===this.readMode}set read(i){i?this.mode|=this.readMode:this.mode&=~this.readMode}get write(){return(this.mode&this.writeMode)===this.writeMode}set write(i){i?this.mode|=this.writeMode:this.mode&=~this.writeMode}get isFolder(){return m.isDir(this.mode)}get isDevice(){return m.isChrdev(this.mode)}},lookupPath(i,o={}){if(!i)throw new m.ErrnoError(44);o.follow_mount??=!0,dt.isAbs(i)||(i=m.cwd()+"/"+i);e:for(var u=0;u<40;u++){for(var l=i.split("/").filter(ee=>!!ee),c=m.root,h="/",A=0;A<l.length;A++){var O=A===l.length-1;if(O&&o.parent)break;if(l[A]!=="."){if(l[A]===".."){if(h=dt.dirname(h),m.isRoot(c)){i=h+"/"+l.slice(A+1).join("/");continue e}else c=c.parent;continue}h=dt.join2(h,l[A]);try{c=m.lookupNode(c,l[A])}catch(ee){if(ee?.errno===44&&O&&o.noent_okay)return{path:h};throw ee}if(m.isMountpoint(c)&&(!O||o.follow_mount)&&(c=c.mounted.root),m.isLink(c.mode)&&(!O||o.follow)){if(!c.node_ops.readlink)throw new m.ErrnoError(52);var Z=c.node_ops.readlink(c);dt.isAbs(Z)||(Z=dt.dirname(h)+"/"+Z),i=Z+"/"+l.slice(A+1).join("/");continue e}}}return{path:h,node:c}}throw new m.ErrnoError(32)},getPath(i){for(var o;;){if(m.isRoot(i)){var u=i.mount.mountpoint;return o?u[u.length-1]!=="/"?`${u}/${o}`:u+o:u}o=o?`${i.name}/${o}`:i.name,i=i.parent}},hashName(i,o){for(var u=0,l=0;l<o.length;l++)u=(u<<5)-u+o.charCodeAt(l)|0;return(i+u>>>0)%m.nameTable.length},hashAddNode(i){var o=m.hashName(i.parent.id,i.name);i.name_next=m.nameTable[o],m.nameTable[o]=i},hashRemoveNode(i){var o=m.hashName(i.parent.id,i.name);if(m.nameTable[o]===i)m.nameTable[o]=i.name_next;else for(var u=m.nameTable[o];u;){if(u.name_next===i){u.name_next=i.name_next;break}u=u.name_next}},lookupNode(i,o){var u=m.mayLookup(i);if(u)throw new m.ErrnoError(u);for(var l=m.hashName(i.id,o),c=m.nameTable[l];c;c=c.name_next){var h=c.name;if(c.parent.id===i.id&&h===o)return c}return m.lookup(i,o)},createNode(i,o,u,l){var c=new m.FSNode(i,o,u,l);return m.hashAddNode(c),c},destroyNode(i){m.hashRemoveNode(i)},isRoot(i){return i===i.parent},isMountpoint(i){return!!i.mounted},isFile(i){return(i&61440)===32768},isDir(i){return(i&61440)===16384},isLink(i){return(i&61440)===40960},isChrdev(i){return(i&61440)===8192},isBlkdev(i){return(i&61440)===24576},isFIFO(i){return(i&61440)===4096},isSocket(i){return(i&49152)===49152},flagsToPermissionString(i){var o=["r","w","rw"][i&3];return i&512&&(o+="w"),o},nodePermissions(i,o){return m.ignorePermissions?0:o.includes("r")&&!(i.mode&292)||o.includes("w")&&!(i.mode&146)||o.includes("x")&&!(i.mode&73)?2:0},mayLookup(i){if(!m.isDir(i.mode))return 54;var o=m.nodePermissions(i,"x");return o||(i.node_ops.lookup?0:2)},mayCreate(i,o){if(!m.isDir(i.mode))return 54;try{var u=m.lookupNode(i,o);return 20}catch{}return m.nodePermissions(i,"wx")},mayDelete(i,o,u){var l;try{l=m.lookupNode(i,o)}catch(h){return h.errno}var c=m.nodePermissions(i,"wx");if(c)return c;if(u){if(!m.isDir(l.mode))return 54;if(m.isRoot(l)||m.getPath(l)===m.cwd())return 10}else if(m.isDir(l.mode))return 31;return 0},mayOpen(i,o){return i?m.isLink(i.mode)?32:m.isDir(i.mode)&&(m.flagsToPermissionString(o)!=="r"||o&576)?31:m.nodePermissions(i,m.flagsToPermissionString(o)):44},checkOpExists(i,o){if(!i)throw new m.ErrnoError(o);return i},MAX_OPEN_FDS:4096,nextfd(){for(var i=0;i<=m.MAX_OPEN_FDS;i++)if(!m.streams[i])return i;throw new m.ErrnoError(33)},getStreamChecked(i){var o=m.getStream(i);if(!o)throw new m.ErrnoError(8);return o},getStream:i=>m.streams[i],createStream(i,o=-1){return i=Object.assign(new m.FSStream,i),o==-1&&(o=m.nextfd()),i.fd=o,m.streams[o]=i,i},closeStream(i){m.streams[i]=null},dupStream(i,o=-1){var u=m.createStream(i,o);return u.stream_ops?.dup?.(u),u},doSetAttr(i,o,u){var l=i?.stream_ops.setattr,c=l?i:o;l??=o.node_ops.setattr,m.checkOpExists(l,63),l(c,u)},chrdev_stream_ops:{open(i){var o=m.getDevice(i.node.rdev);i.stream_ops=o.stream_ops,i.stream_ops.open?.(i)},llseek(){throw new m.ErrnoError(70)}},major:i=>i>>8,minor:i=>i&255,makedev:(i,o)=>i<<8|o,registerDevice(i,o){m.devices[i]={stream_ops:o}},getDevice:i=>m.devices[i],getMounts(i){for(var o=[],u=[i];u.length;){var l=u.pop();o.push(l),u.push(...l.mounts)}return o},syncfs(i,o){typeof i=="function"&&(o=i,i=!1),m.syncFSRequests++,m.syncFSRequests>1&&V(`warning: ${m.syncFSRequests} FS.syncfs operations in flight at once, probably just doing extra work`);var u=m.getMounts(m.root.mount),l=0;function c(A){return m.syncFSRequests--,o(A)}function h(A){if(A)return h.errored?void 0:(h.errored=!0,c(A));++l>=u.length&&c(null)}u.forEach(A=>{if(!A.type.syncfs)return h(null);A.type.syncfs(A,i,h)})},mount(i,o,u){var l=u==="/",c=!u,h;if(l&&m.root)throw new m.ErrnoError(10);if(!l&&!c){var A=m.lookupPath(u,{follow_mount:!1});if(u=A.path,h=A.node,m.isMountpoint(h))throw new m.ErrnoError(10);if(!m.isDir(h.mode))throw new m.ErrnoError(54)}var O={type:i,opts:o,mountpoint:u,mounts:[]},Z=i.mount(O);return Z.mount=O,O.root=Z,l?m.root=Z:h&&(h.mounted=O,h.mount&&h.mount.mounts.push(O)),Z},unmount(i){var o=m.lookupPath(i,{follow_mount:!1});if(!m.isMountpoint(o.node))throw new m.ErrnoError(28);var u=o.node,l=u.mounted,c=m.getMounts(l);Object.keys(m.nameTable).forEach(A=>{for(var O=m.nameTable[A];O;){var Z=O.name_next;c.includes(O.mount)&&m.destroyNode(O),O=Z}}),u.mounted=null;var h=u.mount.mounts.indexOf(l);u.mount.mounts.splice(h,1)},lookup(i,o){return i.node_ops.lookup(i,o)},mknod(i,o,u){var l=m.lookupPath(i,{parent:!0}),c=l.node,h=dt.basename(i);if(!h)throw new m.ErrnoError(28);if(h==="."||h==="..")throw new m.ErrnoError(20);var A=m.mayCreate(c,h);if(A)throw new m.ErrnoError(A);if(!c.node_ops.mknod)throw new m.ErrnoError(63);return c.node_ops.mknod(c,h,o,u)},statfs(i){return m.statfsNode(m.lookupPath(i,{follow:!0}).node)},statfsStream(i){return m.statfsNode(i.node)},statfsNode(i){var o={bsize:4096,frsize:4096,blocks:1e6,bfree:5e5,bavail:5e5,files:m.nextInode,ffree:m.nextInode-1,fsid:42,flags:2,namelen:255};return i.node_ops.statfs&&Object.assign(o,i.node_ops.statfs(i.mount.opts.root)),o},create(i,o=438){return o&=4095,o|=32768,m.mknod(i,o,0)},mkdir(i,o=511){return o&=1023,o|=16384,m.mknod(i,o,0)},mkdirTree(i,o){var u=i.split("/"),l="";for(var c of u)if(c){(l||dt.isAbs(i))&&(l+="/"),l+=c;try{m.mkdir(l,o)}catch(h){if(h.errno!=20)throw h}}},mkdev(i,o,u){return typeof u>"u"&&(u=o,o=438),o|=8192,m.mknod(i,o,u)},symlink(i,o){if(!hi.resolve(i))throw new m.ErrnoError(44);var u=m.lookupPath(o,{parent:!0}),l=u.node;if(!l)throw new m.ErrnoError(44);var c=dt.basename(o),h=m.mayCreate(l,c);if(h)throw new m.ErrnoError(h);if(!l.node_ops.symlink)throw new m.ErrnoError(63);return l.node_ops.symlink(l,c,i)},rename(i,o){var u=dt.dirname(i),l=dt.dirname(o),c=dt.basename(i),h=dt.basename(o),A,O,Z;if(A=m.lookupPath(i,{parent:!0}),O=A.node,A=m.lookupPath(o,{parent:!0}),Z=A.node,!O||!Z)throw new m.ErrnoError(44);if(O.mount!==Z.mount)throw new m.ErrnoError(75);var ee=m.lookupNode(O,c),fe=hi.relative(i,l);if(fe.charAt(0)!==".")throw new m.ErrnoError(28);if(fe=hi.relative(o,u),fe.charAt(0)!==".")throw new m.ErrnoError(55);var _e;try{_e=m.lookupNode(Z,h)}catch{}if(ee!==_e){var H=m.isDir(ee.mode),$=m.mayDelete(O,c,H);if($)throw new m.ErrnoError($);if($=_e?m.mayDelete(Z,h,H):m.mayCreate(Z,h),$)throw new m.ErrnoError($);if(!O.node_ops.rename)throw new m.ErrnoError(63);if(m.isMountpoint(ee)||_e&&m.isMountpoint(_e))throw new m.ErrnoError(10);if(Z!==O&&($=m.nodePermissions(O,"w"),$))throw new m.ErrnoError($);m.hashRemoveNode(ee);try{O.node_ops.rename(ee,Z,h),ee.parent=Z}catch(ae){throw ae}finally{m.hashAddNode(ee)}}},rmdir(i){var o=m.lookupPath(i,{parent:!0}),u=o.node,l=dt.basename(i),c=m.lookupNode(u,l),h=m.mayDelete(u,l,!0);if(h)throw new m.ErrnoError(h);if(!u.node_ops.rmdir)throw new m.ErrnoError(63);if(m.isMountpoint(c))throw new m.ErrnoError(10);u.node_ops.rmdir(u,l),m.destroyNode(c)},readdir(i){var o=m.lookupPath(i,{follow:!0}),u=o.node,l=m.checkOpExists(u.node_ops.readdir,54);return l(u)},unlink(i){var o=m.lookupPath(i,{parent:!0}),u=o.node;if(!u)throw new m.ErrnoError(44);var l=dt.basename(i),c=m.lookupNode(u,l),h=m.mayDelete(u,l,!1);if(h)throw new m.ErrnoError(h);if(!u.node_ops.unlink)throw new m.ErrnoError(63);if(m.isMountpoint(c))throw new m.ErrnoError(10);u.node_ops.unlink(u,l),m.destroyNode(c)},readlink(i){var o=m.lookupPath(i),u=o.node;if(!u)throw new m.ErrnoError(44);if(!u.node_ops.readlink)throw new m.ErrnoError(28);return u.node_ops.readlink(u)},stat(i,o){var u=m.lookupPath(i,{follow:!o}),l=u.node,c=m.checkOpExists(l.node_ops.getattr,63);return c(l)},fstat(i){var o=m.getStreamChecked(i),u=o.node,l=o.stream_ops.getattr,c=l?o:u;return l??=u.node_ops.getattr,m.checkOpExists(l,63),l(c)},lstat(i){return m.stat(i,!0)},doChmod(i,o,u,l){m.doSetAttr(i,o,{mode:u&4095|o.mode&-4096,ctime:Date.now(),dontFollow:l})},chmod(i,o,u){var l;if(typeof i=="string"){var c=m.lookupPath(i,{follow:!u});l=c.node}else l=i;m.doChmod(null,l,o,u)},lchmod(i,o){m.chmod(i,o,!0)},fchmod(i,o){var u=m.getStreamChecked(i);m.doChmod(u,u.node,o,!1)},doChown(i,o,u){m.doSetAttr(i,o,{timestamp:Date.now(),dontFollow:u})},chown(i,o,u,l){var c;if(typeof i=="string"){var h=m.lookupPath(i,{follow:!l});c=h.node}else c=i;m.doChown(null,c,l)},lchown(i,o,u){m.chown(i,o,u,!0)},fchown(i,o,u){var l=m.getStreamChecked(i);m.doChown(l,l.node,!1)},doTruncate(i,o,u){if(m.isDir(o.mode))throw new m.ErrnoError(31);if(!m.isFile(o.mode))throw new m.ErrnoError(28);var l=m.nodePermissions(o,"w");if(l)throw new m.ErrnoError(l);m.doSetAttr(i,o,{size:u,timestamp:Date.now()})},truncate(i,o){if(o<0)throw new m.ErrnoError(28);var u;if(typeof i=="string"){var l=m.lookupPath(i,{follow:!0});u=l.node}else u=i;m.doTruncate(null,u,o)},ftruncate(i,o){var u=m.getStreamChecked(i);if(o<0||(u.flags&2097155)===0)throw new m.ErrnoError(28);m.doTruncate(u,u.node,o)},utime(i,o,u){var l=m.lookupPath(i,{follow:!0}),c=l.node,h=m.checkOpExists(c.node_ops.setattr,63);h(c,{atime:o,mtime:u})},open(i,o,u=438){if(i==="")throw new m.ErrnoError(44);o=typeof o=="string"?vy(o):o,o&64?u=u&4095|32768:u=0;var l,c;if(typeof i=="object")l=i;else{c=i.endsWith("/");var h=m.lookupPath(i,{follow:!(o&131072),noent_okay:!0});l=h.node,i=h.path}var A=!1;if(o&64)if(l){if(o&128)throw new m.ErrnoError(20)}else{if(c)throw new m.ErrnoError(31);l=m.mknod(i,u|511,0),A=!0}if(!l)throw new m.ErrnoError(44);if(m.isChrdev(l.mode)&&(o&=-513),o&65536&&!m.isDir(l.mode))throw new m.ErrnoError(54);if(!A){var O=m.mayOpen(l,o);if(O)throw new m.ErrnoError(O)}o&512&&!A&&m.truncate(l,0),o&=-131713;var Z=m.createStream({node:l,path:m.getPath(l),flags:o,seekable:!0,position:0,stream_ops:l.stream_ops,ungotten:[],error:!1});return Z.stream_ops.open&&Z.stream_ops.open(Z),A&&m.chmod(l,u&511),r.logReadFiles&&!(o&1)&&(i in m.readFiles||(m.readFiles[i]=1)),Z},close(i){if(m.isClosed(i))throw new m.ErrnoError(8);i.getdents&&(i.getdents=null);try{i.stream_ops.close&&i.stream_ops.close(i)}catch(o){throw o}finally{m.closeStream(i.fd)}i.fd=null},isClosed(i){return i.fd===null},llseek(i,o,u){if(m.isClosed(i))throw new m.ErrnoError(8);if(!i.seekable||!i.stream_ops.llseek)throw new m.ErrnoError(70);if(u!=0&&u!=1&&u!=2)throw new m.ErrnoError(28);return i.position=i.stream_ops.llseek(i,o,u),i.ungotten=[],i.position},read(i,o,u,l,c){if(l<0||c<0)throw new m.ErrnoError(28);if(m.isClosed(i))throw new m.ErrnoError(8);if((i.flags&2097155)===1)throw new m.ErrnoError(8);if(m.isDir(i.node.mode))throw new m.ErrnoError(31);if(!i.stream_ops.read)throw new m.ErrnoError(28);var h=typeof c<"u";if(!h)c=i.position;else if(!i.seekable)throw new m.ErrnoError(70);var A=i.stream_ops.read(i,o,u,l,c);return h||(i.position+=A),A},write(i,o,u,l,c,h){if(l<0||c<0)throw new m.ErrnoError(28);if(m.isClosed(i))throw new m.ErrnoError(8);if((i.flags&2097155)===0)throw new m.ErrnoError(8);if(m.isDir(i.node.mode))throw new m.ErrnoError(31);if(!i.stream_ops.write)throw new m.ErrnoError(28);i.seekable&&i.flags&1024&&m.llseek(i,0,2);var A=typeof c<"u";if(!A)c=i.position;else if(!i.seekable)throw new m.ErrnoError(70);var O=i.stream_ops.write(i,o,u,l,c,h);return A||(i.position+=O),O},mmap(i,o,u,l,c){if((l&2)!==0&&(c&2)===0&&(i.flags&2097155)!==2)throw new m.ErrnoError(2);if((i.flags&2097155)===1)throw new m.ErrnoError(2);if(!i.stream_ops.mmap)throw new m.ErrnoError(43);if(!o)throw new m.ErrnoError(28);return i.stream_ops.mmap(i,o,u,l,c)},msync(i,o,u,l,c){return i.stream_ops.msync?i.stream_ops.msync(i,o,u,l,c):0},ioctl(i,o,u){if(!i.stream_ops.ioctl)throw new m.ErrnoError(59);return i.stream_ops.ioctl(i,o,u)},readFile(i,o={}){if(o.flags=o.flags||0,o.encoding=o.encoding||"binary",o.encoding!=="utf8"&&o.encoding!=="binary")throw new Error(`Invalid encoding type "${o.encoding}"`);var u=m.open(i,o.flags),l=m.stat(i),c=l.size,h=new Uint8Array(c);return m.read(u,h,0,c,0),o.encoding==="utf8"&&(h=Qi(h)),m.close(u),h},writeFile(i,o,u={}){u.flags=u.flags||577;var l=m.open(i,u.flags,u.mode);if(typeof o=="string"&&(o=new Uint8Array(Fa(o))),ArrayBuffer.isView(o))m.write(l,o,0,o.byteLength,void 0,u.canOwn);else throw new Error("Unsupported data type");m.close(l)},cwd:()=>m.currentPath,chdir(i){var o=m.lookupPath(i,{follow:!0});if(o.node===null)throw new m.ErrnoError(44);if(!m.isDir(o.node.mode))throw new m.ErrnoError(54);var u=m.nodePermissions(o.node,"x");if(u)throw new m.ErrnoError(u);m.currentPath=o.path},createDefaultDirectories(){m.mkdir("/tmp"),m.mkdir("/home"),m.mkdir("/home/web_user")},createDefaultDevices(){m.mkdir("/dev"),m.registerDevice(m.makedev(1,3),{read:()=>0,write:(l,c,h,A,O)=>A,llseek:()=>0}),m.mkdev("/dev/null",m.makedev(1,3)),Un.register(m.makedev(5,0),Un.default_tty_ops),Un.register(m.makedev(6,0),Un.default_tty1_ops),m.mkdev("/dev/tty",m.makedev(5,0)),m.mkdev("/dev/tty1",m.makedev(6,0));var i=new Uint8Array(1024),o=0,u=()=>(o===0&&(La(i),o=i.byteLength),i[--o]);m.createDevice("/dev","random",u),m.createDevice("/dev","urandom",u),m.mkdir("/dev/shm"),m.mkdir("/dev/shm/tmp")},createSpecialDirectories(){m.mkdir("/proc");var i=m.mkdir("/proc/self");m.mkdir("/proc/self/fd"),m.mount({mount(){var o=m.createNode(i,"fd",16895,73);return o.stream_ops={llseek:Ke.stream_ops.llseek},o.node_ops={lookup(u,l){var c=+l,h=m.getStreamChecked(c),A={parent:null,mount:{mountpoint:"fake"},node_ops:{readlink:()=>h.path},id:c+1};return A.parent=A,A},readdir(){return Array.from(m.streams.entries()).filter(([u,l])=>l).map(([u,l])=>u.toString())}},o}},{},"/proc/self/fd")},createStandardStreams(i,o,u){i?m.createDevice("/dev","stdin",i):m.symlink("/dev/tty","/dev/stdin"),o?m.createDevice("/dev","stdout",null,o):m.symlink("/dev/tty","/dev/stdout"),u?m.createDevice("/dev","stderr",null,u):m.symlink("/dev/tty1","/dev/stderr"),m.open("/dev/stdin",0),m.open("/dev/stdout",1),m.open("/dev/stderr",1)},staticInit(){m.nameTable=new Array(4096),m.mount(Ke,{},"/"),m.createDefaultDirectories(),m.createDefaultDevices(),m.createSpecialDirectories(),m.filesystems={MEMFS:Ke}},init(i,o,u){m.initialized=!0,i??=r.stdin,o??=r.stdout,u??=r.stderr,m.createStandardStreams(i,o,u)},quit(){m.initialized=!1;for(var i of m.streams)i&&m.close(i)},findObject(i,o){var u=m.analyzePath(i,o);return u.exists?u.object:null},analyzePath(i,o){try{var u=m.lookupPath(i,{follow:!o});i=u.path}catch{}var l={isRoot:!1,exists:!1,error:0,name:null,path:null,object:null,parentExists:!1,parentPath:null,parentObject:null};try{var u=m.lookupPath(i,{parent:!0});l.parentExists=!0,l.parentPath=u.path,l.parentObject=u.node,l.name=dt.basename(i),u=m.lookupPath(i,{follow:!o}),l.exists=!0,l.path=u.path,l.object=u.node,l.name=u.node.name,l.isRoot=u.path==="/"}catch(c){l.error=c.errno}return l},createPath(i,o,u,l){i=typeof i=="string"?i:m.getPath(i);for(var c=o.split("/").reverse();c.length;){var h=c.pop();if(h){var A=dt.join2(i,h);try{m.mkdir(A)}catch(O){if(O.errno!=20)throw O}i=A}}return A},createFile(i,o,u,l,c){var h=dt.join2(typeof i=="string"?i:m.getPath(i),o),A=Ra(l,c);return m.create(h,A)},createDataFile(i,o,u,l,c,h){var A=o;i&&(i=typeof i=="string"?i:m.getPath(i),A=o?dt.join2(i,o):i);var O=Ra(l,c),Z=m.create(A,O);if(u){if(typeof u=="string"){for(var ee=new Array(u.length),fe=0,_e=u.length;fe<_e;++fe)ee[fe]=u.charCodeAt(fe);u=ee}m.chmod(Z,O|146);var H=m.open(Z,577);m.write(H,u,0,u.length,0,h),m.close(H),m.chmod(Z,O)}},createDevice(i,o,u,l){var c=dt.join2(typeof i=="string"?i:m.getPath(i),o),h=Ra(!!u,!!l);m.createDevice.major??=64;var A=m.makedev(m.createDevice.major++,0);return m.registerDevice(A,{open(O){O.seekable=!1},close(O){l?.buffer?.length&&l(10)},read(O,Z,ee,fe,_e){for(var H=0,$=0;$<fe;$++){var ae;try{ae=u()}catch{throw new m.ErrnoError(29)}if(ae===void 0&&H===0)throw new m.ErrnoError(6);if(ae==null)break;H++,Z[ee+$]=ae}return H&&(O.node.atime=Date.now()),H},write(O,Z,ee,fe,_e){for(var H=0;H<fe;H++)try{l(Z[ee+H])}catch{throw new m.ErrnoError(29)}return fe&&(O.node.mtime=O.node.ctime=Date.now()),H}}),m.mkdev(c,h,A)},forceLoadFile(i){if(i.isDevice||i.isFolder||i.link||i.contents)return!0;if(typeof XMLHttpRequest<"u")throw new Error("Lazy loading should have been performed (contents set) in createLazyFile, but it was not. Lazy loading only works in web workers. Use --embed-file or --preload-file in emcc on the main thread.");try{i.contents=I(i.url),i.usedBytes=i.contents.length}catch{throw new m.ErrnoError(29)}},createLazyFile(i,o,u,l,c){class h{lengthKnown=!1;chunks=[];get($){if(!($>this.length-1||$<0)){var ae=$%this.chunkSize,E=$/this.chunkSize|0;return this.getter(E)[ae]}}setDataGetter($){this.getter=$}cacheLength(){var $=new XMLHttpRequest;if($.open("HEAD",u,!1),$.send(null),!($.status>=200&&$.status<300||$.status===304))throw new Error("Couldn't load "+u+". Status: "+$.status);var ae=Number($.getResponseHeader("Content-length")),E,T=(E=$.getResponseHeader("Accept-Ranges"))&&E==="bytes",F=(E=$.getResponseHeader("Content-Encoding"))&&E==="gzip",J=1024*1024;T||(J=ae);var K=(te,Ne)=>{if(te>Ne)throw new Error("invalid range ("+te+", "+Ne+") or no bytes requested!");if(Ne>ae-1)throw new Error("only "+ae+" bytes available! programmer error!");var y=new XMLHttpRequest;if(y.open("GET",u,!1),ae!==J&&y.setRequestHeader("Range","bytes="+te+"-"+Ne),y.responseType="arraybuffer",y.overrideMimeType&&y.overrideMimeType("text/plain; charset=x-user-defined"),y.send(null),!(y.status>=200&&y.status<300||y.status===304))throw new Error("Couldn't load "+u+". Status: "+y.status);return y.response!==void 0?new Uint8Array(y.response||[]):Fa(y.responseText||"")},D=this;D.setDataGetter(te=>{var Ne=te*J,y=(te+1)*J-1;if(y=Math.min(y,ae-1),typeof D.chunks[te]>"u"&&(D.chunks[te]=K(Ne,y)),typeof D.chunks[te]>"u")throw new Error("doXHR failed!");return D.chunks[te]}),(F||!ae)&&(J=ae=1,ae=this.getter(0).length,J=ae,j("LazyFiles on gzip forces download of the whole file when length is accessed")),this._length=ae,this._chunkSize=J,this.lengthKnown=!0}get length(){return this.lengthKnown||this.cacheLength(),this._length}get chunkSize(){return this.lengthKnown||this.cacheLength(),this._chunkSize}}if(typeof XMLHttpRequest<"u"){if(!s)throw"Cannot do synchronous binary XHRs outside webworkers in modern browsers. Use --embed-file or --preload-file in emcc";var A=new h,O={isDevice:!1,contents:A}}else var O={isDevice:!1,url:u};var Z=m.createFile(i,o,O,l,c);O.contents?Z.contents=O.contents:O.url&&(Z.contents=null,Z.url=O.url),Object.defineProperties(Z,{usedBytes:{get:function(){return this.contents.length}}});var ee={},fe=Object.keys(Z.stream_ops);fe.forEach(H=>{var $=Z.stream_ops[H];ee[H]=(...ae)=>(m.forceLoadFile(Z),$(...ae))});function _e(H,$,ae,E,T){var F=H.node.contents;if(T>=F.length)return 0;var J=Math.min(F.length-T,E);if(F.slice)for(var K=0;K<J;K++)$[ae+K]=F[T+K];else for(var K=0;K<J;K++)$[ae+K]=F.get(T+K);return J}return ee.read=(H,$,ae,E,T)=>(m.forceLoadFile(Z),_e(H,$,ae,E,T)),ee.mmap=(H,$,ae,E,T)=>{m.forceLoadFile(Z);var F=Yu($);if(!F)throw new m.ErrnoError(48);return _e(H,Ie,F,$,ae),{ptr:F,allocated:!0}},Z.stream_ops=ee,Z}},qy=(i,o)=>{if(!i)return"";for(var u=i+o,l=i;!(l>=u)&&ot[l];)++l;return Ku.decode(ot.subarray(i,l))},et={DEFAULT_POLLMASK:5,calculateAt(i,o,u){if(dt.isAbs(o))return o;var l;if(i===-100)l=m.cwd();else{var c=et.getStreamFromFD(i);l=c.path}if(o.length==0){if(!u)throw new m.ErrnoError(44);return l}return l+"/"+o},writeStat(i,o){Ce[i>>2]=o.dev,Ce[i+4>>2]=o.mode,Be[i+8>>2]=o.nlink,Ce[i+12>>2]=o.uid,Ce[i+16>>2]=o.gid,Ce[i+20>>2]=o.rdev,$e[i+24>>3]=BigInt(o.size),Ce[i+32>>2]=4096,Ce[i+36>>2]=o.blocks;var u=o.atime.getTime(),l=o.mtime.getTime(),c=o.ctime.getTime();return $e[i+40>>3]=BigInt(Math.floor(u/1e3)),Be[i+48>>2]=u%1e3*1e3*1e3,$e[i+56>>3]=BigInt(Math.floor(l/1e3)),Be[i+64>>2]=l%1e3*1e3*1e3,$e[i+72>>3]=BigInt(Math.floor(c/1e3)),Be[i+80>>2]=c%1e3*1e3*1e3,$e[i+88>>3]=BigInt(o.ino),0},writeStatFs(i,o){Ce[i+4>>2]=o.bsize,Ce[i+40>>2]=o.bsize,Ce[i+8>>2]=o.blocks,Ce[i+12>>2]=o.bfree,Ce[i+16>>2]=o.bavail,Ce[i+20>>2]=o.files,Ce[i+24>>2]=o.ffree,Ce[i+28>>2]=o.fsid,Ce[i+44>>2]=o.flags,Ce[i+36>>2]=o.namelen},doMsync(i,o,u,l,c){if(!m.isFile(o.node.mode))throw new m.ErrnoError(43);if(l&2)return 0;var h=ot.slice(i,i+u);m.msync(o,h,c,u,l)},getStreamFromFD(i){var o=m.getStreamChecked(i);return o},varargs:void 0,getStr(i){var o=qy(i);return o}};function Sy(i,o){try{return i=et.getStr(i),m.chmod(i,o),0}catch(u){if(typeof m>"u"||u.name!=="ErrnoError")throw u;return-u.errno}}function ky(i,o,u,l){try{if(o=et.getStr(o),o=et.calculateAt(i,o),u&-8)return-28;var c=m.lookupPath(o,{follow:!0}),h=c.node;if(!h)return-44;var A="";return u&4&&(A+="r"),u&2&&(A+="w"),u&1&&(A+="x"),A&&m.nodePermissions(h,A)?-2:0}catch(O){if(typeof m>"u"||O.name!=="ErrnoError")throw O;return-O.errno}}function Ey(i,o){try{return m.fchmod(i,o),0}catch(u){if(typeof m>"u"||u.name!=="ErrnoError")throw u;return-u.errno}}function Ay(i,o,u){try{return m.fchown(i,o,u),0}catch(l){if(typeof m>"u"||l.name!=="ErrnoError")throw l;return-l.errno}}var no=()=>{var i=Ce[+et.varargs>>2];return et.varargs+=4,i},pi=no;function Oy(i,o,u){et.varargs=u;try{var l=et.getStreamFromFD(i);switch(o){case 0:{var c=no();if(c<0)return-28;for(;m.streams[c];)c++;var h;return h=m.dupStream(l,c),h.fd}case 1:case 2:return 0;case 3:return l.flags;case 4:{var c=no();return l.flags|=c,0}case 12:{var c=pi(),A=0;return at[c+A>>1]=2,0}case 13:case 14:return 0}return-28}catch(O){if(typeof m>"u"||O.name!=="ErrnoError")throw O;return-O.errno}}function Ty(i,o){try{return et.writeStat(o,m.fstat(i))}catch(u){if(typeof m>"u"||u.name!=="ErrnoError")throw u;return-u.errno}}var Iy=9007199254740992,Cy=-9007199254740992,Hi=i=>i<Cy||i>Iy?NaN:Number(i);function Ly(i,o){o=Hi(o);try{return isNaN(o)?-61:(m.ftruncate(i,o),0)}catch(u){if(typeof m>"u"||u.name!=="ErrnoError")throw u;return-u.errno}}var $n=(i,o,u)=>Gu(i,ot,o,u);function Py(i,o){try{if(o===0)return-28;var u=m.cwd(),l=ro(u)+1;return o<l?-68:($n(u,i,o),l)}catch(c){if(typeof m>"u"||c.name!=="ErrnoError")throw c;return-c.errno}}function Fy(i,o,u){et.varargs=u;try{var l=et.getStreamFromFD(i);switch(o){case 21509:return l.tty?0:-59;case 21505:{if(!l.tty)return-59;if(l.tty.ops.ioctl_tcgets){var c=l.tty.ops.ioctl_tcgets(l),h=pi();Ce[h>>2]=c.c_iflag||0,Ce[h+4>>2]=c.c_oflag||0,Ce[h+8>>2]=c.c_cflag||0,Ce[h+12>>2]=c.c_lflag||0;for(var A=0;A<32;A++)Ie[h+A+17]=c.c_cc[A]||0;return 0}return 0}case 21510:case 21511:case 21512:return l.tty?0:-59;case 21506:case 21507:case 21508:{if(!l.tty)return-59;if(l.tty.ops.ioctl_tcsets){for(var h=pi(),O=Ce[h>>2],Z=Ce[h+4>>2],ee=Ce[h+8>>2],fe=Ce[h+12>>2],_e=[],A=0;A<32;A++)_e.push(Ie[h+A+17]);return l.tty.ops.ioctl_tcsets(l.tty,o,{c_iflag:O,c_oflag:Z,c_cflag:ee,c_lflag:fe,c_cc:_e})}return 0}case 21519:{if(!l.tty)return-59;var h=pi();return Ce[h>>2]=0,0}case 21520:return l.tty?-28:-59;case 21531:{var h=pi();return m.ioctl(l,o,h)}case 21523:{if(!l.tty)return-59;if(l.tty.ops.ioctl_tiocgwinsz){var H=l.tty.ops.ioctl_tiocgwinsz(l.tty),h=pi();at[h>>1]=H[0],at[h+2>>1]=H[1]}return 0}case 21524:return l.tty?0:-59;case 21515:return l.tty?0:-59;default:return-28}}catch($){if(typeof m>"u"||$.name!=="ErrnoError")throw $;return-$.errno}}function Ry(i,o){try{return i=et.getStr(i),et.writeStat(o,m.lstat(i))}catch(u){if(typeof m>"u"||u.name!=="ErrnoError")throw u;return-u.errno}}function Wy(i,o,u){try{return o=et.getStr(o),o=et.calculateAt(i,o),m.mkdir(o,u,0),0}catch(l){if(typeof m>"u"||l.name!=="ErrnoError")throw l;return-l.errno}}function Dy(i,o,u,l){try{o=et.getStr(o);var c=l&256,h=l&4096;return l=l&-6401,o=et.calculateAt(i,o,h),et.writeStat(u,c?m.lstat(o):m.stat(o))}catch(A){if(typeof m>"u"||A.name!=="ErrnoError")throw A;return-A.errno}}function My(i,o,u,l){et.varargs=l;try{o=et.getStr(o),o=et.calculateAt(i,o);var c=l?no():0;return m.open(o,u,c).fd}catch(h){if(typeof m>"u"||h.name!=="ErrnoError")throw h;return-h.errno}}function Uy(i,o,u,l){try{if(o=et.getStr(o),o=et.calculateAt(i,o),l<=0)return-28;var c=m.readlink(o),h=Math.min(l,ro(c)),A=Ie[u+h];return $n(c,u,l+1),Ie[u+h]=A,h}catch(O){if(typeof m>"u"||O.name!=="ErrnoError")throw O;return-O.errno}}function $y(i){try{return i=et.getStr(i),m.rmdir(i),0}catch(o){if(typeof m>"u"||o.name!=="ErrnoError")throw o;return-o.errno}}function By(i,o){try{return i=et.getStr(i),et.writeStat(o,m.stat(i))}catch(u){if(typeof m>"u"||u.name!=="ErrnoError")throw u;return-u.errno}}function jy(i,o,u){try{if(o=et.getStr(o),o=et.calculateAt(i,o),!u)m.unlink(o);else if(u===512)m.rmdir(o);else return-28;return 0}catch(l){if(typeof m>"u"||l.name!=="ErrnoError")throw l;return-l.errno}}var ed=i=>Be[i>>2]+Ce[i+4>>2]*4294967296;function zy(i,o,u,l){try{o=et.getStr(o),o=et.calculateAt(i,o,!0);var c=Date.now(),h,A;if(!u)h=c,A=c;else{var O=ed(u),Z=Ce[u+8>>2];Z==1073741823?h=c:Z==1073741822?h=null:h=O*1e3+Z/(1e3*1e3),u+=16,O=ed(u),Z=Ce[u+8>>2],Z==1073741823?A=c:Z==1073741822?A=null:A=O*1e3+Z/(1e3*1e3)}return(A??h)!==null&&m.utime(o,h,A),0}catch(ee){if(typeof m>"u"||ee.name!=="ErrnoError")throw ee;return-ee.errno}}var Vy=()=>Se(""),Qy=i=>i%4===0&&(i%100!==0||i%400===0),Hy=[0,31,60,91,121,152,182,213,244,274,305,335],Jy=[0,31,59,90,120,151,181,212,243,273,304,334],Ky=i=>{var o=Qy(i.getFullYear()),u=o?Hy:Jy,l=u[i.getMonth()]+i.getDate()-1;return l};function Gy(i,o){i=Hi(i);var u=new Date(i*1e3);Ce[o>>2]=u.getSeconds(),Ce[o+4>>2]=u.getMinutes(),Ce[o+8>>2]=u.getHours(),Ce[o+12>>2]=u.getDate(),Ce[o+16>>2]=u.getMonth(),Ce[o+20>>2]=u.getFullYear()-1900,Ce[o+24>>2]=u.getDay();var l=Ky(u)|0;Ce[o+28>>2]=l,Ce[o+36>>2]=-(u.getTimezoneOffset()*60);var c=new Date(u.getFullYear(),0,1),h=new Date(u.getFullYear(),6,1).getTimezoneOffset(),A=c.getTimezoneOffset(),O=(h!=A&&u.getTimezoneOffset()==Math.min(A,h))|0;Ce[o+32>>2]=O}function Xy(i,o,u,l,c,h,A){c=Hi(c);try{var O=et.getStreamFromFD(l),Z=m.mmap(O,i,c,o,u),ee=Z.ptr;return Ce[h>>2]=Z.allocated,Be[A>>2]=ee,0}catch(fe){if(typeof m>"u"||fe.name!=="ErrnoError")throw fe;return-fe.errno}}function Yy(i,o,u,l,c,h){h=Hi(h);try{var A=et.getStreamFromFD(c);u&2&&et.doMsync(i,A,o,l,h)}catch(O){if(typeof m>"u"||O.name!=="ErrnoError")throw O;return-O.errno}}var Zy=(i,o,u,l)=>{var c=new Date().getFullYear(),h=new Date(c,0,1),A=new Date(c,6,1),O=h.getTimezoneOffset(),Z=A.getTimezoneOffset(),ee=Math.max(O,Z);Be[i>>2]=ee*60,Ce[o>>2]=+(O!=Z);var fe=$=>{var ae=$>=0?"-":"+",E=Math.abs($),T=String(Math.floor(E/60)).padStart(2,"0"),F=String(E%60).padStart(2,"0");return`UTC${ae}${T}${F}`},_e=fe(O),H=fe(Z);Z<O?($n(_e,u,17),$n(H,l,17)):($n(_e,l,17),$n(H,u,17))},td=()=>performance.now(),rd=()=>Date.now(),e0=i=>i>=0&&i<=3;function t0(i,o,u){if(!e0(i))return 28;var l;i===0?l=rd():l=td();var c=Math.round(l*1e3*1e3);return $e[u>>3]=BigInt(c),0}var r0=()=>2147483648,n0=i=>{var o=Re.buffer,u=(i-o.byteLength+65535)/65536|0;try{return Re.grow(u),rt(),1}catch{}},i0=i=>{var o=ot.length;i>>>=0;var u=r0();if(i>u)return!1;for(var l=1;l<=4;l*=2){var c=o*(1+.2/l);c=Math.min(c,i+100663296);var h=Math.min(u,Xu(Math.max(i,c),65536)),A=n0(h);if(A)return!0}return!1},Wa={},s0=()=>d||"./this.program",Ji=()=>{if(!Ji.strings){var i=(typeof navigator=="object"&&navigator.language||"C").replace("-","_")+".UTF-8",o={USER:"web_user",LOGNAME:"web_user",PATH:"/",PWD:"/",HOME:"/home/web_user",LANG:i,_:s0()};for(var u in Wa)Wa[u]===void 0?delete o[u]:o[u]=Wa[u];var l=[];for(var u in o)l.push(`${u}=${o[u]}`);Ji.strings=l}return Ji.strings},o0=(i,o)=>{var u=0,l=0;for(var c of Ji()){var h=o+u;Be[i+l>>2]=h,u+=$n(c,h,1/0)+1,l+=4}return 0},a0=(i,o)=>{var u=Ji();Be[i>>2]=u.length;var l=0;for(var c of u)l+=ro(c)+1;return Be[o>>2]=l,0},l0=0,c0=()=>Ju||l0>0,u0=i=>{c0()||(r.onExit?.(i),ge=!0),g(i,new wn(i))},d0=(i,o)=>{u0(i)},f0=d0;function h0(i){try{var o=et.getStreamFromFD(i);return m.close(o),0}catch(u){if(typeof m>"u"||u.name!=="ErrnoError")throw u;return u.errno}}function p0(i,o){try{var u=0,l=0,c=0,h=et.getStreamFromFD(i),A=h.tty?2:m.isDir(h.mode)?3:m.isLink(h.mode)?7:4;return Ie[o]=A,at[o+2>>1]=c,$e[o+8>>3]=BigInt(u),$e[o+16>>3]=BigInt(l),0}catch(O){if(typeof m>"u"||O.name!=="ErrnoError")throw O;return O.errno}}var m0=(i,o,u,l)=>{for(var c=0,h=0;h<u;h++){var A=Be[o>>2],O=Be[o+4>>2];o+=8;var Z=m.read(i,Ie,A,O,l);if(Z<0)return-1;if(c+=Z,Z<O)break}return c};function _0(i,o,u,l){try{var c=et.getStreamFromFD(i),h=m0(c,o,u);return Be[l>>2]=h,0}catch(A){if(typeof m>"u"||A.name!=="ErrnoError")throw A;return A.errno}}function g0(i,o,u,l){o=Hi(o);try{if(isNaN(o))return 61;var c=et.getStreamFromFD(i);return m.llseek(c,o,u),$e[l>>3]=BigInt(c.position),c.getdents&&o===0&&u===0&&(c.getdents=null),0}catch(h){if(typeof m>"u"||h.name!=="ErrnoError")throw h;return h.errno}}function y0(i){try{var o=et.getStreamFromFD(i);return o.stream_ops?.fsync?o.stream_ops.fsync(o):0}catch(u){if(typeof m>"u"||u.name!=="ErrnoError")throw u;return u.errno}}var b0=(i,o,u,l)=>{for(var c=0,h=0;h<u;h++){var A=Be[o>>2],O=Be[o+4>>2];o+=8;var Z=m.write(i,Ie,A,O,l);if(Z<0)return-1;if(c+=Z,Z<O)break}return c};function w0(i,o,u,l){try{var c=et.getStreamFromFD(i),h=b0(c,o,u);return Be[l>>2]=h,0}catch(A){if(typeof m>"u"||A.name!=="ErrnoError")throw A;return A.errno}}function x0(i,o){try{return La(ot.subarray(i,i+o)),0}catch(u){if(typeof m>"u"||u.name!=="ErrnoError")throw u;return u.errno}}m.createPreloadedFile=Ny,m.staticInit(),Ke.doesNotExistError=new m.ErrnoError(44),Ke.doesNotExistError.stack="<generic error, no stack>",Ze(),r.noExitRuntime&&(Ju=r.noExitRuntime),r.preloadPlugins&&(Zu=r.preloadPlugins),r.print&&(j=r.print),r.printErr&&(V=r.printErr),r.wasmBinary&&(Y=r.wasmBinary),r.arguments&&r.arguments,r.thisProgram&&(d=r.thisProgram),r.wasmMemory=Re;var nd;function N0(i){r._sqlite3_status64=i.sqlite3_status64,r._sqlite3_status=i.sqlite3_status,r._sqlite3_db_status=i.sqlite3_db_status,r._sqlite3_msize=i.sqlite3_msize,r._sqlite3_vfs_find=i.sqlite3_vfs_find,r._sqlite3_initialize=i.sqlite3_initialize,r._sqlite3_malloc=i.sqlite3_malloc,r._sqlite3_free=i.sqlite3_free,r._sqlite3_vfs_register=i.sqlite3_vfs_register,r._sqlite3_randomness=i.sqlite3_randomness,r._sqlite3mc_vfs_create=i.sqlite3mc_vfs_create,r._sqlite3_vfs_unregister=i.sqlite3_vfs_unregister,r._sqlite3_malloc64=i.sqlite3_malloc64,r._sqlite3_realloc=i.sqlite3_realloc,r._sqlite3_realloc64=i.sqlite3_realloc64,r._sqlite3_value_text=i.sqlite3_value_text,r._sqlite3_stricmp=i.sqlite3_stricmp,r._sqlite3_strnicmp=i.sqlite3_strnicmp,r._sqlite3_uri_parameter=i.sqlite3_uri_parameter,r._sqlite3_uri_boolean=i.sqlite3_uri_boolean,r._sqlite3_serialize=i.sqlite3_serialize,r._sqlite3_prepare_v2=i.sqlite3_prepare_v2,r._sqlite3_step=i.sqlite3_step,r._sqlite3_column_int64=i.sqlite3_column_int64,r._sqlite3_reset=i.sqlite3_reset,r._sqlite3_exec=i.sqlite3_exec,r._sqlite3_column_int=i.sqlite3_column_int,r._sqlite3_finalize=i.sqlite3_finalize,r._sqlite3_file_control=i.sqlite3_file_control,r._sqlite3_column_name=i.sqlite3_column_name,r._sqlite3_column_text=i.sqlite3_column_text,r._sqlite3_column_type=i.sqlite3_column_type,r._sqlite3_errmsg=i.sqlite3_errmsg,r._sqlite3_deserialize=i.sqlite3_deserialize,r._sqlite3_clear_bindings=i.sqlite3_clear_bindings,r._sqlite3_value_blob=i.sqlite3_value_blob,r._sqlite3_value_bytes=i.sqlite3_value_bytes,r._sqlite3_value_double=i.sqlite3_value_double,r._sqlite3_value_int=i.sqlite3_value_int,r._sqlite3_value_int64=i.sqlite3_value_int64,r._sqlite3_value_subtype=i.sqlite3_value_subtype,r._sqlite3_value_pointer=i.sqlite3_value_pointer,r._sqlite3_value_type=i.sqlite3_value_type,r._sqlite3_value_nochange=i.sqlite3_value_nochange,r._sqlite3_value_frombind=i.sqlite3_value_frombind,r._sqlite3_value_dup=i.sqlite3_value_dup,r._sqlite3_value_free=i.sqlite3_value_free,r._sqlite3_result_blob=i.sqlite3_result_blob,r._sqlite3_result_error_toobig=i.sqlite3_result_error_toobig,r._sqlite3_result_error_nomem=i.sqlite3_result_error_nomem,r._sqlite3_result_double=i.sqlite3_result_double,r._sqlite3_result_error=i.sqlite3_result_error,r._sqlite3_result_int=i.sqlite3_result_int,r._sqlite3_result_int64=i.sqlite3_result_int64,r._sqlite3_result_null=i.sqlite3_result_null,r._sqlite3_result_pointer=i.sqlite3_result_pointer,r._sqlite3_result_subtype=i.sqlite3_result_subtype,r._sqlite3_result_text=i.sqlite3_result_text,r._sqlite3_result_zeroblob=i.sqlite3_result_zeroblob,r._sqlite3_result_zeroblob64=i.sqlite3_result_zeroblob64,r._sqlite3_result_error_code=i.sqlite3_result_error_code,r._sqlite3_user_data=i.sqlite3_user_data,r._sqlite3_context_db_handle=i.sqlite3_context_db_handle,r._sqlite3_vtab_nochange=i.sqlite3_vtab_nochange,r._sqlite3_vtab_in_first=i.sqlite3_vtab_in_first,r._sqlite3_vtab_in_next=i.sqlite3_vtab_in_next,r._sqlite3_aggregate_context=i.sqlite3_aggregate_context,r._sqlite3_get_auxdata=i.sqlite3_get_auxdata,r._sqlite3_set_auxdata=i.sqlite3_set_auxdata,r._sqlite3_column_count=i.sqlite3_column_count,r._sqlite3_data_count=i.sqlite3_data_count,r._sqlite3_column_blob=i.sqlite3_column_blob,r._sqlite3_column_bytes=i.sqlite3_column_bytes,r._sqlite3_column_double=i.sqlite3_column_double,r._sqlite3_column_value=i.sqlite3_column_value,r._sqlite3_column_decltype=i.sqlite3_column_decltype,r._sqlite3_bind_blob=i.sqlite3_bind_blob,r._sqlite3_bind_double=i.sqlite3_bind_double,r._sqlite3_bind_int=i.sqlite3_bind_int,r._sqlite3_bind_int64=i.sqlite3_bind_int64,r._sqlite3_bind_null=i.sqlite3_bind_null,r._sqlite3_bind_pointer=i.sqlite3_bind_pointer,r._sqlite3_bind_text=i.sqlite3_bind_text,r._sqlite3_bind_parameter_count=i.sqlite3_bind_parameter_count,r._sqlite3_bind_parameter_name=i.sqlite3_bind_parameter_name,r._sqlite3_bind_parameter_index=i.sqlite3_bind_parameter_index,r._sqlite3_db_handle=i.sqlite3_db_handle,r._sqlite3_stmt_readonly=i.sqlite3_stmt_readonly,r._sqlite3_stmt_isexplain=i.sqlite3_stmt_isexplain,r._sqlite3_stmt_explain=i.sqlite3_stmt_explain,r._sqlite3_stmt_busy=i.sqlite3_stmt_busy,r._sqlite3_stmt_status=i.sqlite3_stmt_status,r._sqlite3_sql=i.sqlite3_sql,r._sqlite3_expanded_sql=i.sqlite3_expanded_sql,r._sqlite3_preupdate_old=i.sqlite3_preupdate_old,r._sqlite3_preupdate_count=i.sqlite3_preupdate_count,r._sqlite3_preupdate_depth=i.sqlite3_preupdate_depth,r._sqlite3_preupdate_blobwrite=i.sqlite3_preupdate_blobwrite,r._sqlite3_preupdate_new=i.sqlite3_preupdate_new,r._sqlite3_value_numeric_type=i.sqlite3_value_numeric_type,r._sqlite3_set_authorizer=i.sqlite3_set_authorizer,r._sqlite3_strglob=i.sqlite3_strglob,r._sqlite3_strlike=i.sqlite3_strlike,r._sqlite3_auto_extension=i.sqlite3_auto_extension,r._sqlite3_cancel_auto_extension=i.sqlite3_cancel_auto_extension,r._sqlite3_reset_auto_extension=i.sqlite3_reset_auto_extension,r._sqlite3_prepare_v3=i.sqlite3_prepare_v3,r._sqlite3_create_module=i.sqlite3_create_module,r._sqlite3_create_module_v2=i.sqlite3_create_module_v2,r._sqlite3_drop_modules=i.sqlite3_drop_modules,r._sqlite3_declare_vtab=i.sqlite3_declare_vtab,r._sqlite3_vtab_on_conflict=i.sqlite3_vtab_on_conflict,r._sqlite3_vtab_collation=i.sqlite3_vtab_collation,r._sqlite3_vtab_in=i.sqlite3_vtab_in,r._sqlite3_vtab_rhs_value=i.sqlite3_vtab_rhs_value,r._sqlite3_vtab_distinct=i.sqlite3_vtab_distinct,r._sqlite3_keyword_name=i.sqlite3_keyword_name,r._sqlite3_keyword_count=i.sqlite3_keyword_count,r._sqlite3_keyword_check=i.sqlite3_keyword_check,r._sqlite3_complete=i.sqlite3_complete,r._sqlite3_libversion=i.sqlite3_libversion,r._sqlite3_libversion_number=i.sqlite3_libversion_number,r._sqlite3_shutdown=i.sqlite3_shutdown,r._sqlite3mc_vfs_shutdown=i.sqlite3mc_vfs_shutdown,r._sqlite3_last_insert_rowid=i.sqlite3_last_insert_rowid,r._sqlite3_set_last_insert_rowid=i.sqlite3_set_last_insert_rowid,r._sqlite3_changes64=i.sqlite3_changes64,r._sqlite3_changes=i.sqlite3_changes,r._sqlite3_total_changes64=i.sqlite3_total_changes64,r._sqlite3_total_changes=i.sqlite3_total_changes,r._sqlite3_txn_state=i.sqlite3_txn_state,r._sqlite3_close_v2=i.sqlite3_close_v2,r._sqlite3_busy_handler=i.sqlite3_busy_handler,r._sqlite3_progress_handler=i.sqlite3_progress_handler,r._sqlite3_busy_timeout=i.sqlite3_busy_timeout,r._sqlite3_interrupt=i.sqlite3_interrupt,r._sqlite3_is_interrupted=i.sqlite3_is_interrupted,r._sqlite3_create_function=i.sqlite3_create_function,r._sqlite3_create_function_v2=i.sqlite3_create_function_v2,r._sqlite3_create_window_function=i.sqlite3_create_window_function,r._sqlite3_overload_function=i.sqlite3_overload_function,r._sqlite3_trace_v2=i.sqlite3_trace_v2,r._sqlite3_commit_hook=i.sqlite3_commit_hook,r._sqlite3_update_hook=i.sqlite3_update_hook,r._sqlite3_rollback_hook=i.sqlite3_rollback_hook,r._sqlite3_preupdate_hook=i.sqlite3_preupdate_hook,r._sqlite3_error_offset=i.sqlite3_error_offset,r._sqlite3_errcode=i.sqlite3_errcode,r._sqlite3_extended_errcode=i.sqlite3_extended_errcode,r._sqlite3_errstr=i.sqlite3_errstr,r._sqlite3_limit=i.sqlite3_limit,r._sqlite3_open=i.sqlite3_open,r._sqlite3_open_v2=i.sqlite3_open_v2,r._sqlite3_create_collation=i.sqlite3_create_collation,r._sqlite3_create_collation_v2=i.sqlite3_create_collation_v2,r._sqlite3_collation_needed=i.sqlite3_collation_needed,r._sqlite3_get_autocommit=i.sqlite3_get_autocommit,r._sqlite3_table_column_metadata=i.sqlite3_table_column_metadata,r._sqlite3_extended_result_codes=i.sqlite3_extended_result_codes,r._sqlite3_uri_key=i.sqlite3_uri_key,r._sqlite3_uri_int64=i.sqlite3_uri_int64,r._sqlite3_db_name=i.sqlite3_db_name,r._sqlite3_db_filename=i.sqlite3_db_filename,r._sqlite3_db_readonly=i.sqlite3_db_readonly,r._sqlite3_compileoption_used=i.sqlite3_compileoption_used,r._sqlite3_compileoption_get=i.sqlite3_compileoption_get,r._sqlite3session_diff=i.sqlite3session_diff,r._sqlite3session_attach=i.sqlite3session_attach,r._sqlite3session_create=i.sqlite3session_create,r._sqlite3session_delete=i.sqlite3session_delete,r._sqlite3session_table_filter=i.sqlite3session_table_filter,r._sqlite3session_changeset=i.sqlite3session_changeset,r._sqlite3session_changeset_strm=i.sqlite3session_changeset_strm,r._sqlite3session_patchset_strm=i.sqlite3session_patchset_strm,r._sqlite3session_patchset=i.sqlite3session_patchset,r._sqlite3session_enable=i.sqlite3session_enable,r._sqlite3session_indirect=i.sqlite3session_indirect,r._sqlite3session_isempty=i.sqlite3session_isempty,r._sqlite3session_memory_used=i.sqlite3session_memory_used,r._sqlite3session_object_config=i.sqlite3session_object_config,r._sqlite3session_changeset_size=i.sqlite3session_changeset_size,r._sqlite3changeset_start=i.sqlite3changeset_start,r._sqlite3changeset_start_v2=i.sqlite3changeset_start_v2,r._sqlite3changeset_start_strm=i.sqlite3changeset_start_strm,r._sqlite3changeset_start_v2_strm=i.sqlite3changeset_start_v2_strm,r._sqlite3changeset_next=i.sqlite3changeset_next,r._sqlite3changeset_op=i.sqlite3changeset_op,r._sqlite3changeset_pk=i.sqlite3changeset_pk,r._sqlite3changeset_old=i.sqlite3changeset_old,r._sqlite3changeset_new=i.sqlite3changeset_new,r._sqlite3changeset_conflict=i.sqlite3changeset_conflict,r._sqlite3changeset_fk_conflicts=i.sqlite3changeset_fk_conflicts,r._sqlite3changeset_finalize=i.sqlite3changeset_finalize,r._sqlite3changeset_invert=i.sqlite3changeset_invert,r._sqlite3changeset_invert_strm=i.sqlite3changeset_invert_strm,r._sqlite3changeset_apply_v2=i.sqlite3changeset_apply_v2,r._sqlite3changeset_apply=i.sqlite3changeset_apply,r._sqlite3changeset_apply_v2_strm=i.sqlite3changeset_apply_v2_strm,r._sqlite3changeset_apply_strm=i.sqlite3changeset_apply_strm,r._sqlite3changegroup_new=i.sqlite3changegroup_new,r._sqlite3changegroup_add=i.sqlite3changegroup_add,r._sqlite3changegroup_output=i.sqlite3changegroup_output,r._sqlite3changegroup_add_strm=i.sqlite3changegroup_add_strm,r._sqlite3changegroup_output_strm=i.sqlite3changegroup_output_strm,r._sqlite3changegroup_delete=i.sqlite3changegroup_delete,r._sqlite3changeset_concat=i.sqlite3changeset_concat,r._sqlite3changeset_concat_strm=i.sqlite3changeset_concat_strm,r._sqlite3session_config=i.sqlite3session_config,r._sqlite3_sourceid=i.sqlite3_sourceid,r._sqlite3mc_version=i.sqlite3mc_version,r._sqlite3mc_config=i.sqlite3mc_config,r._sqlite3mc_cipher_count=i.sqlite3mc_cipher_count,r._sqlite3mc_cipher_index=i.sqlite3mc_cipher_index,r._sqlite3mc_cipher_name=i.sqlite3mc_cipher_name,r._sqlite3mc_config_cipher=i.sqlite3mc_config_cipher,r._sqlite3mc_codec_data=i.sqlite3mc_codec_data,r._sqlite3_activate_see=i.sqlite3_activate_see,r._sqlite3_key=i.sqlite3_key,r._sqlite3_key_v2=i.sqlite3_key_v2,r._sqlite3_rekey_v2=i.sqlite3_rekey_v2,r._sqlite3_rekey=i.sqlite3_rekey,r._sqlite3mc_vfs_destroy=i.sqlite3mc_vfs_destroy,r._sqlite3__wasm_pstack_ptr=i.sqlite3__wasm_pstack_ptr,r._sqlite3__wasm_pstack_restore=i.sqlite3__wasm_pstack_restore,r._sqlite3__wasm_pstack_alloc=i.sqlite3__wasm_pstack_alloc,r._sqlite3__wasm_pstack_remaining=i.sqlite3__wasm_pstack_remaining,r._sqlite3__wasm_pstack_quota=i.sqlite3__wasm_pstack_quota,r._sqlite3__wasm_db_error=i.sqlite3__wasm_db_error,r._sqlite3__wasm_test_struct=i.sqlite3__wasm_test_struct,r._sqlite3__wasm_enum_json=i.sqlite3__wasm_enum_json,r._sqlite3__wasm_vfs_unlink=i.sqlite3__wasm_vfs_unlink,r._sqlite3__wasm_db_vfs=i.sqlite3__wasm_db_vfs,r._sqlite3__wasm_db_reset=i.sqlite3__wasm_db_reset,r._sqlite3__wasm_db_export_chunked=i.sqlite3__wasm_db_export_chunked,r._sqlite3__wasm_db_serialize=i.sqlite3__wasm_db_serialize,r._sqlite3__wasm_vfs_create_file=i.sqlite3__wasm_vfs_create_file,r._sqlite3__wasm_posix_create_file=i.sqlite3__wasm_posix_create_file,r._sqlite3__wasm_kvvfsMakeKeyOnPstack=i.sqlite3__wasm_kvvfsMakeKeyOnPstack,r._sqlite3__wasm_kvvfs_methods=i.sqlite3__wasm_kvvfs_methods,r._sqlite3__wasm_vtab_config=i.sqlite3__wasm_vtab_config,r._sqlite3__wasm_db_config_ip=i.sqlite3__wasm_db_config_ip,r._sqlite3__wasm_db_config_pii=i.sqlite3__wasm_db_config_pii,r._sqlite3__wasm_db_config_s=i.sqlite3__wasm_db_config_s,r._sqlite3__wasm_config_i=i.sqlite3__wasm_config_i,r._sqlite3__wasm_config_ii=i.sqlite3__wasm_config_ii,r._sqlite3__wasm_config_j=i.sqlite3__wasm_config_j,r._sqlite3__wasm_qfmt_token=i.sqlite3__wasm_qfmt_token,r._sqlite3__wasm_init_wasmfs=i.sqlite3__wasm_init_wasmfs,r._sqlite3__wasm_test_intptr=i.sqlite3__wasm_test_intptr,r._sqlite3__wasm_test_voidptr=i.sqlite3__wasm_test_voidptr,r._sqlite3__wasm_test_int64_max=i.sqlite3__wasm_test_int64_max,r._sqlite3__wasm_test_int64_min=i.sqlite3__wasm_test_int64_min,r._sqlite3__wasm_test_int64_times2=i.sqlite3__wasm_test_int64_times2,r._sqlite3__wasm_test_int64_minmax=i.sqlite3__wasm_test_int64_minmax,r._sqlite3__wasm_test_int64ptr=i.sqlite3__wasm_test_int64ptr,r._sqlite3__wasm_test_stack_overflow=i.sqlite3__wasm_test_stack_overflow,r._sqlite3__wasm_test_str_hello=i.sqlite3__wasm_test_str_hello,r._sqlite3__wasm_SQLTester_strglob=i.sqlite3__wasm_SQLTester_strglob,r._malloc=i.malloc,r._free=i.free,r._realloc=i.realloc,nd=i.emscripten_builtin_memalign,i._emscripten_stack_restore,i._emscripten_stack_alloc,i.emscripten_stack_get_current}var id={__syscall_chmod:Sy,__syscall_faccessat:ky,__syscall_fchmod:Ey,__syscall_fchown32:Ay,__syscall_fcntl64:Oy,__syscall_fstat64:Ty,__syscall_ftruncate64:Ly,__syscall_getcwd:Py,__syscall_ioctl:Fy,__syscall_lstat64:Ry,__syscall_mkdirat:Wy,__syscall_newfstatat:Dy,__syscall_openat:My,__syscall_readlinkat:Uy,__syscall_rmdir:$y,__syscall_stat64:By,__syscall_unlinkat:jy,__syscall_utimensat:zy,_abort_js:Vy,_localtime_js:Gy,_mmap_js:Xy,_munmap_js:Yy,_tzset_js:Zy,clock_time_get:t0,emscripten_date_now:rd,emscripten_get_now:td,emscripten_resize_heap:i0,environ_get:o0,environ_sizes_get:a0,exit:f0,fd_close:h0,fd_fdstat_get:p0,fd_read:_0,fd_seek:g0,fd_sync:y0,fd_write:w0,memory:Re,random_get:x0},mi=await bn();function Da(){if(ne>0){se=Da;return}if(R(),ne>0){se=Da;return}function i(){r.calledRun=!0,!ge&&(pe(),Ee?.(r),r.onRuntimeInitialized?.(),oe())}r.setStatus?(r.setStatus("Running..."),setTimeout(()=>{setTimeout(()=>r.setStatus(""),1),i()},1)):i()}function v0(){if(r.preInit)for(typeof r.preInit=="function"&&(r.preInit=[r.preInit]);r.preInit.length>0;)r.preInit.shift()()}return v0(),Da(),r.runSQLite3PostLoadInit=function(i){if(globalThis.sqlite3ApiBootstrap=function o(u=globalThis.sqlite3ApiConfig||o.defaultConfig){if(o.sqlite3)return(o.sqlite3.config||console).warn("sqlite3ApiBootstrap() called multiple times.","Config and external initializers are ignored on calls after the first."),o.sqlite3;const l=Object.assign(Object.create(null),{exports:void 0,memory:void 0,bigIntEnabled:typeof r<"u"&&r.HEAPU64?!0:!!globalThis.BigInt64Array,debug:console.debug.bind(console),warn:console.warn.bind(console),error:console.error.bind(console),log:console.log.bind(console),wasmfsOpfsDir:"/opfs",useStdAlloc:!1},u||{});Object.assign(l,{allocExportName:l.useStdAlloc?"malloc":"sqlite3_malloc",deallocExportName:l.useStdAlloc?"free":"sqlite3_free",reallocExportName:l.useStdAlloc?"realloc":"sqlite3_realloc"},l),["exports","memory","wasmfsOpfsDir"].forEach(f=>{typeof l[f]=="function"&&(l[f]=l[f]())}),delete globalThis.sqlite3ApiConfig,delete o.defaultConfig;const c=Object.create(null),h=Object.create(null),A=f=>c.sqlite3_js_rc_str&&c.sqlite3_js_rc_str(f)||"Unknown result code #"+f,O=f=>typeof f=="number"&&f===(f|0);class Z extends Error{constructor(..._){let b;if(_.length)if(O(_[0]))if(b=_[0],_.length===1)super(A(_[0]));else{const k=A(b);typeof _[1]=="object"?super(k,_[1]):(_[0]=k+":",super(_.join(" ")))}else _.length===2&&typeof _[1]=="object"?super(..._):super(_.join(" "));this.resultCode=b||c.SQLITE_ERROR,this.name="SQLite3Error"}}Z.toss=(...f)=>{throw new Z(...f)};const ee=Z.toss;l.wasmfsOpfsDir&&!/^\/[^/]+$/.test(l.wasmfsOpfsDir)&&ee("config.wasmfsOpfsDir must be falsy or in the form '/dir-name'.");const fe=f=>typeof f!="bigint"&&f===(f|0)&&f<=2147483647&&f>=-2147483648,_e=function f(_){return f._max||(f._max=BigInt("0x7fffffffffffffff"),f._min=~f._max),_>=f._min&&_<=f._max},H=f=>f>=-0x7fffffffn-1n&&f<=0x7fffffffn,$=function f(_){return f._min||(f._min=Number.MIN_SAFE_INTEGER,f._max=Number.MAX_SAFE_INTEGER),_>=f._min&&_<=f._max},ae=f=>f&&f.constructor&&fe(f.constructor.BYTES_PER_ELEMENT)?f:!1,E=typeof SharedArrayBuffer>"u"?function(){}:SharedArrayBuffer,T=f=>f.buffer instanceof E,F=(f,_,b)=>T(f)?f.slice(_,b):f.subarray(_,b),J=f=>f&&(f instanceof Uint8Array||f instanceof Int8Array||f instanceof ArrayBuffer),K=f=>f&&(f instanceof Uint8Array||f instanceof Int8Array||f instanceof ArrayBuffer),D=f=>J(f)||ee("Value is not of a supported TypedArray type."),te=new TextDecoder("utf-8"),Ne=function(f,_,b){return te.decode(F(f,_,b))},y=function(f){return K(f)?Ne(f instanceof ArrayBuffer?new Uint8Array(f):f):Array.isArray(f)?f.join(""):(h.isPtr(f)&&(f=h.cstrToJs(f)),f)};class q extends Error{constructor(..._){_.length===2&&typeof _[1]=="object"?super(..._):_.length?super(_.join(" ")):super("Allocation failed."),this.resultCode=c.SQLITE_NOMEM,this.name="WasmAllocError"}}q.toss=(...f)=>{throw new q(...f)},Object.assign(c,{sqlite3_bind_blob:void 0,sqlite3_bind_text:void 0,sqlite3_create_function_v2:(f,_,b,k,U,be,Fe,He,Ve)=>{},sqlite3_create_function:(f,_,b,k,U,be,Fe,He)=>{},sqlite3_create_window_function:(f,_,b,k,U,be,Fe,He,Ve,de)=>{},sqlite3_prepare_v3:(f,_,b,k,U,be)=>{},sqlite3_prepare_v2:(f,_,b,k,U)=>{},sqlite3_exec:(f,_,b,k,U)=>{},sqlite3_randomness:(f,_)=>{}});const L={affirmBindableTypedArray:D,flexibleString:y,bigIntFits32:H,bigIntFits64:_e,bigIntFitsDouble:$,isBindableTypedArray:J,isInt32:fe,isSQLableTypedArray:K,isTypedArray:ae,typedArrayToString:Ne,isUIThread:()=>globalThis.window===globalThis&&!!globalThis.document,isSharedTypedArray:T,toss:function(...f){throw new Error(f.join(" "))},toss3:ee,typedArrayPart:F,affirmDbHeader:function(f){f instanceof ArrayBuffer&&(f=new Uint8Array(f));const _="SQLite format 3";_.length>f.byteLength&&ee("Input does not contain an SQLite3 database header.");for(let b=0;b<_.length;++b)_.charCodeAt(b)!==f[b]&&ee("Input does not contain an SQLite3 database header.")},affirmIsDb:function(f){f instanceof ArrayBuffer&&(f=new Uint8Array(f));const _=f.byteLength;(_<512||_%512!==0)&&ee("Byte array size",_,"is invalid for an SQLite3 db."),L.affirmDbHeader(f)}};Object.assign(h,{ptrSizeof:l.wasmPtrSizeof||4,ptrIR:l.wasmPtrIR||"i32",bigIntEnabled:!!l.bigIntEnabled,exports:l.exports||ee("Missing API config.exports (WASM module exports)."),memory:l.memory||l.exports.memory||ee("API config object requires a WebAssembly.Memory object","in either config.exports.memory (exported)","or config.memory (imported)."),alloc:void 0,realloc:void 0,dealloc:void 0}),h.allocFromTypedArray=function(f){f instanceof ArrayBuffer&&(f=new Uint8Array(f)),D(f);const _=h.alloc(f.byteLength||1);return h.heapForSize(f.constructor).set(f.byteLength?f:[0],_),_};{const f=l.allocExportName,_=l.deallocExportName,b=l.reallocExportName;for(const k of[f,_,b])h.exports[k]instanceof Function||ee("Missing required exports[",k,"] function.");h.alloc=function k(U){return k.impl(U)||q.toss("Failed to allocate",U," bytes.")},h.alloc.impl=h.exports[f],h.realloc=function k(U,be){const Fe=k.impl(U,be);return be?Fe||q.toss("Failed to reallocate",be," bytes."):0},h.realloc.impl=h.exports[b],h.dealloc=h.exports[_]}h.compileOptionUsed=function f(_){if(arguments.length){if(Array.isArray(_)){const b={};return _.forEach(k=>{b[k]=c.sqlite3_compileoption_used(k)}),b}else if(typeof _=="object")return Object.keys(_).forEach(b=>{_[b]=c.sqlite3_compileoption_used(b)}),_}else{if(f._result)return f._result;f._opt||(f._rx=/^([^=]+)=(.+)/,f._rxInt=/^-?\d+$/,f._opt=function(Fe,He){const Ve=f._rx.exec(Fe);He[0]=Ve?Ve[1]:Fe,He[1]=Ve?f._rxInt.test(Ve[2])?+Ve[2]:Ve[2]:!0});const b={},k=[0,0];let U=0,be;for(;be=c.sqlite3_compileoption_get(U++);)f._opt(be,k),b[k[0]]=k[1];return f._result=b}return typeof _=="string"?!!c.sqlite3_compileoption_used(_):!1},h.pstack=Object.assign(Object.create(null),{restore:h.exports.sqlite3__wasm_pstack_restore,alloc:function(f){return typeof f=="string"&&!(f=h.sizeofIR(f))&&q.toss("Invalid value for pstack.alloc(",arguments[0],")"),h.exports.sqlite3__wasm_pstack_alloc(f)||q.toss("Could not allocate",f,"bytes from the pstack.")},allocChunks:function(f,_){typeof _=="string"&&!(_=h.sizeofIR(_))&&q.toss("Invalid size value for allocChunks(",arguments[1],")");const b=h.pstack.alloc(f*_),k=[];let U=0,be=0;for(;U<f;++U,be+=_)k.push(b+be);return k},allocPtr:(f=1,_=!0)=>f===1?h.pstack.alloc(_?8:h.ptrSizeof):h.pstack.allocChunks(f,_?8:h.ptrSizeof),call:function(f){const _=h.pstack.pointer;try{return f(ce)}finally{h.pstack.restore(_)}}}),Object.defineProperties(h.pstack,{pointer:{configurable:!1,iterable:!0,writeable:!1,get:h.exports.sqlite3__wasm_pstack_ptr},quota:{configurable:!1,iterable:!0,writeable:!1,get:h.exports.sqlite3__wasm_pstack_quota},remaining:{configurable:!1,iterable:!0,writeable:!1,get:h.exports.sqlite3__wasm_pstack_remaining}}),c.sqlite3_randomness=(...f)=>{if(f.length===1&&L.isTypedArray(f[0])&&f[0].BYTES_PER_ELEMENT===1){const _=f[0];if(_.byteLength===0)return h.exports.sqlite3_randomness(0,0),_;const b=h.pstack.pointer;try{let k=_.byteLength,U=0;const be=h.exports.sqlite3_randomness,Fe=h.heap8u(),He=k<512?k:512,Ve=h.pstack.alloc(He);do{const de=k>He?He:k;be(de,Ve),_.set(F(Fe,Ve,Ve+de),U),k-=de,U+=de}while(k>0)}catch(k){console.error("Highly unexpected (and ignored!) exception in sqlite3_randomness():",k)}finally{h.pstack.restore(b)}return _}h.exports.sqlite3_randomness(...f)};let le;if(c.sqlite3_wasmfs_opfs_dir=function(){if(le!==void 0)return le;const f=l.wasmfsOpfsDir;if(!f||!globalThis.FileSystemHandle||!globalThis.FileSystemDirectoryHandle||!globalThis.FileSystemFileHandle)return le="";try{return f&&h.xCallWrapped("sqlite3__wasm_init_wasmfs","i32",["string"],f)===0?le=f:le=""}catch{return le=""}},c.sqlite3_wasmfs_filename_is_persistent=function(f){const _=c.sqlite3_wasmfs_opfs_dir();return _&&f?f.startsWith(_+"/"):!1},c.sqlite3_js_db_uses_vfs=function(f,_,b=0){try{const k=c.sqlite3_vfs_find(_);return k?f?k===c.sqlite3_js_db_vfs(f,b)?k:!1:k===c.sqlite3_vfs_find(0)?k:!1:!1}catch{return!1}},c.sqlite3_js_vfs_list=function(){const f=[];let _=c.sqlite3_vfs_find(0);for(;_;){const b=new c.sqlite3_vfs(_);f.push(h.cstrToJs(b.$zName)),_=b.$pNext,b.dispose()}return f},c.sqlite3_js_db_export=function(f,_=0){f=h.xWrap.testConvertArg("sqlite3*",f),f||ee("Invalid sqlite3* argument."),h.bigIntEnabled||ee("BigInt64 support is not enabled.");const b=h.scopedAllocPush();let k;try{const U=h.scopedAlloc(8+h.ptrSizeof),be=U+8,Fe=_?h.isPtr(_)?_:h.scopedAllocCString(""+_):0;let He=h.exports.sqlite3__wasm_db_serialize(f,Fe,be,U,0);He&&ee("Database serialization failed with code",ce.capi.sqlite3_js_rc_str(He)),k=h.peekPtr(be);const Ve=h.peek(U,"i64");return He=Ve?h.heap8u().slice(k,k+Number(Ve)):new Uint8Array,He}finally{k&&h.exports.sqlite3_free(k),h.scopedAllocPop(b)}},c.sqlite3_js_db_vfs=(f,_=0)=>L.sqlite3__wasm_db_vfs(f,_),c.sqlite3_js_aggregate_context=(f,_)=>c.sqlite3_aggregate_context(f,_)||(_?q.toss("Cannot allocate",_,"bytes for sqlite3_aggregate_context()"):0),c.sqlite3_js_posix_create_file=function(f,_,b){let k;_&&h.isPtr(_)?k=_:_ instanceof ArrayBuffer||_ instanceof Uint8Array?(k=h.allocFromTypedArray(_),(arguments.length<3||!L.isInt32(b)||b<0)&&(b=_.byteLength)):Z.toss("Invalid 2nd argument for sqlite3_js_posix_create_file().");try{(!L.isInt32(b)||b<0)&&Z.toss("Invalid 3rd argument for sqlite3_js_posix_create_file().");const U=L.sqlite3__wasm_posix_create_file(f,k,b);U&&Z.toss("Creation of file failed with sqlite3 result code",c.sqlite3_js_rc_str(U))}finally{h.dealloc(k)}},c.sqlite3_js_vfs_create_file=function(f,_,b,k){l.warn("sqlite3_js_vfs_create_file() is deprecated and","should be avoided because it can lead to C-level crashes.","See its documentation for alternative options.");let U;b?(h.isPtr(b)?U=b:b instanceof ArrayBuffer&&(b=new Uint8Array(b)),b instanceof Uint8Array?(U=h.allocFromTypedArray(b),(arguments.length<4||!L.isInt32(k)||k<0)&&(k=b.byteLength)):Z.toss("Invalid 3rd argument type for sqlite3_js_vfs_create_file().")):U=0,(!L.isInt32(k)||k<0)&&(h.dealloc(U),Z.toss("Invalid 4th argument for sqlite3_js_vfs_create_file()."));try{const be=L.sqlite3__wasm_vfs_create_file(f,_,U,k);be&&Z.toss("Creation of file failed with sqlite3 result code",c.sqlite3_js_rc_str(be))}finally{h.dealloc(U)}},c.sqlite3_js_sql_to_string=f=>{if(typeof f=="string")return f;const _=y(v);return _===v?void 0:_},L.isUIThread()){const f=function(_){const b=Object.create(null);return b.prefix="kvvfs-"+_,b.stores=[],(_==="session"||_==="")&&b.stores.push(globalThis.sessionStorage),(_==="local"||_==="")&&b.stores.push(globalThis.localStorage),b};c.sqlite3_js_kvvfs_clear=function(_=""){let b=0;const k=f(_);return k.stores.forEach(U=>{const be=[];let Fe;for(Fe=0;Fe<U.length;++Fe){const He=U.key(Fe);He.startsWith(k.prefix)&&be.push(He)}be.forEach(He=>U.removeItem(He)),b+=be.length}),b},c.sqlite3_js_kvvfs_size=function(_=""){let b=0;const k=f(_);return k.stores.forEach(U=>{let be;for(be=0;be<U.length;++be){const Fe=U.key(be);Fe.startsWith(k.prefix)&&(b+=Fe.length,b+=U.getItem(Fe).length)}}),b*2}}c.sqlite3_db_config=(function(f,_,...b){switch(_){case c.SQLITE_DBCONFIG_ENABLE_FKEY:case c.SQLITE_DBCONFIG_ENABLE_TRIGGER:case c.SQLITE_DBCONFIG_ENABLE_FTS3_TOKENIZER:case c.SQLITE_DBCONFIG_ENABLE_LOAD_EXTENSION:case c.SQLITE_DBCONFIG_NO_CKPT_ON_CLOSE:case c.SQLITE_DBCONFIG_ENABLE_QPSG:case c.SQLITE_DBCONFIG_TRIGGER_EQP:case c.SQLITE_DBCONFIG_RESET_DATABASE:case c.SQLITE_DBCONFIG_DEFENSIVE:case c.SQLITE_DBCONFIG_WRITABLE_SCHEMA:case c.SQLITE_DBCONFIG_LEGACY_ALTER_TABLE:case c.SQLITE_DBCONFIG_DQS_DML:case c.SQLITE_DBCONFIG_DQS_DDL:case c.SQLITE_DBCONFIG_ENABLE_VIEW:case c.SQLITE_DBCONFIG_LEGACY_FILE_FORMAT:case c.SQLITE_DBCONFIG_TRUSTED_SCHEMA:case c.SQLITE_DBCONFIG_STMT_SCANSTATUS:case c.SQLITE_DBCONFIG_REVERSE_SCANORDER:case c.SQLITE_DBCONFIG_ENABLE_ATTACH_CREATE:case c.SQLITE_DBCONFIG_ENABLE_ATTACH_WRITE:case c.SQLITE_DBCONFIG_ENABLE_COMMENTS:return this.ip||(this.ip=h.xWrap("sqlite3__wasm_db_config_ip","int",["sqlite3*","int","int","*"])),this.ip(f,_,b[0],b[1]||0);case c.SQLITE_DBCONFIG_LOOKASIDE:return this.pii||(this.pii=h.xWrap("sqlite3__wasm_db_config_pii","int",["sqlite3*","int","*","int","int"])),this.pii(f,_,b[0],b[1],b[2]);case c.SQLITE_DBCONFIG_MAINDBNAME:return this.s||(this.s=h.xWrap("sqlite3__wasm_db_config_s","int",["sqlite3*","int","string:static"])),this.s(f,_,b[0]);default:return c.SQLITE_MISUSE}}).bind(Object.create(null)),c.sqlite3_value_to_js=function(f,_=!0){let b;const k=c.sqlite3_value_type(f);switch(k){case c.SQLITE_INTEGER:h.bigIntEnabled?(b=c.sqlite3_value_int64(f),L.bigIntFitsDouble(b)&&(b=Number(b))):b=c.sqlite3_value_double(f);break;case c.SQLITE_FLOAT:b=c.sqlite3_value_double(f);break;case c.SQLITE_TEXT:b=c.sqlite3_value_text(f);break;case c.SQLITE_BLOB:{const U=c.sqlite3_value_bytes(f),be=c.sqlite3_value_blob(f);U&&!be&&ce.WasmAllocError.toss("Cannot allocate memory for blob argument of",U,"byte(s)"),b=U?h.heap8u().slice(be,be+Number(U)):null;break}case c.SQLITE_NULL:b=null;break;default:_&&ee(c.SQLITE_MISMATCH,"Unhandled sqlite3_value_type():",k),b=void 0}return b},c.sqlite3_values_to_js=function(f,_,b=!0){let k;const U=[];for(k=0;k<f;++k)U.push(c.sqlite3_value_to_js(h.peekPtr(_+h.ptrSizeof*k),b));return U},c.sqlite3_result_error_js=function(f,_){_ instanceof q?c.sqlite3_result_error_nomem(f):c.sqlite3_result_error(f,""+_,-1)},c.sqlite3_result_js=function(f,_){if(_ instanceof Error){c.sqlite3_result_error_js(f,_);return}try{switch(typeof _){case"undefined":break;case"boolean":c.sqlite3_result_int(f,_?1:0);break;case"bigint":L.bigIntFits32(_)?c.sqlite3_result_int(f,Number(_)):L.bigIntFitsDouble(_)?c.sqlite3_result_double(f,Number(_)):h.bigIntEnabled?L.bigIntFits64(_)?c.sqlite3_result_int64(f,_):ee("BigInt value",_.toString(),"is too BigInt for int64."):ee("BigInt value",_.toString(),"is too BigInt.");break;case"number":{let b;L.isInt32(_)?b=c.sqlite3_result_int:h.bigIntEnabled&&Number.isInteger(_)&&L.bigIntFits64(BigInt(_))?b=c.sqlite3_result_int64:b=c.sqlite3_result_double,b(f,_);break}case"string":{const[b,k]=h.allocCString(_,!0);c.sqlite3_result_text(f,b,k,c.SQLITE_WASM_DEALLOC);break}case"object":if(_===null){c.sqlite3_result_null(f);break}else if(L.isBindableTypedArray(_)){const b=h.allocFromTypedArray(_);c.sqlite3_result_blob(f,b,_.byteLength,c.SQLITE_WASM_DEALLOC);break}default:ee("Don't not how to handle this UDF result value:",typeof _,_)}}catch(b){c.sqlite3_result_error_js(f,b)}},c.sqlite3_column_js=function(f,_,b=!0){const k=c.sqlite3_column_value(f,_);return k===0?void 0:c.sqlite3_value_to_js(k,b)};const X=(function(f,_,b){b=c[b],this.ptr?h.pokePtr(this.ptr,0):this.ptr=h.allocPtr();const k=b(f,_,this.ptr);if(k)return Z.toss(k,arguments[2]+"() failed with code "+k);const U=h.peekPtr(this.ptr);return U?c.sqlite3_value_to_js(U,!0):void 0}).bind(Object.create(null));c.sqlite3_preupdate_new_js=(f,_)=>X(f,_,"sqlite3_preupdate_new"),c.sqlite3_preupdate_old_js=(f,_)=>X(f,_,"sqlite3_preupdate_old"),c.sqlite3changeset_new_js=(f,_)=>X(f,_,"sqlite3changeset_new"),c.sqlite3changeset_old_js=(f,_)=>X(f,_,"sqlite3changeset_old");const ce={WasmAllocError:q,SQLite3Error:Z,capi:c,util:L,wasm:h,config:l,version:Object.create(null),client:void 0,asyncPostInit:async function f(){if(f.isReady instanceof Promise)return f.isReady;let _=o.initializersAsync;delete o.initializersAsync;const b=async()=>(ce.__isUnderTest||(delete ce.util,delete ce.StructBinder),ce),k=be=>{throw l.error("an async sqlite3 initializer failed:",be),be};if(!_||!_.length)return f.isReady=b().catch(k);_=_.map(be=>be instanceof Function?async Fe=>be(ce):be),_.push(b);let U=Promise.resolve(ce);for(;_.length;)U=U.then(_.shift());return f.isReady=U.catch(k)},scriptInfo:void 0};try{o.initializers.forEach(f=>{f(ce)})}catch(f){throw console.error("sqlite3 bootstrap initializer threw:",f),f}return delete o.initializers,o.sqlite3=ce,ce},globalThis.sqlite3ApiBootstrap.initializers=[],globalThis.sqlite3ApiBootstrap.initializersAsync=[],globalThis.sqlite3ApiBootstrap.defaultConfig=Object.create(null),globalThis.sqlite3ApiBootstrap.sqlite3=void 0,globalThis.WhWasmUtilInstaller=function(o){o.bigIntEnabled===void 0&&(o.bigIntEnabled=!!globalThis.BigInt64Array);const u=(...y)=>{throw new Error(y.join(" "))};o.exports||Object.defineProperty(o,"exports",{enumerable:!0,configurable:!0,get:()=>o.instance&&o.instance.exports});const l=o.pointerIR||"i32",c=o.ptrSizeof=l==="i32"?4:l==="i64"?8:u("Unhandled ptrSizeof:",l),h=Object.create(null);h.heapSize=0,h.memory=null,h.freeFuncIndexes=[],h.scopedAlloc=[],h.utf8Decoder=new TextDecoder,h.utf8Encoder=new TextEncoder("utf-8"),o.sizeofIR=y=>{switch(y){case"i8":return 1;case"i16":return 2;case"i32":case"f32":case"float":return 4;case"i64":case"f64":case"double":return 8;case"*":return c;default:return(""+y).endsWith("*")?c:void 0}};const A=function(){if(!h.memory)h.memory=o.memory instanceof WebAssembly.Memory?o.memory:o.exports.memory;else if(h.heapSize===h.memory.buffer.byteLength)return h;const y=h.memory.buffer;return h.HEAP8=new Int8Array(y),h.HEAP8U=new Uint8Array(y),h.HEAP16=new Int16Array(y),h.HEAP16U=new Uint16Array(y),h.HEAP32=new Int32Array(y),h.HEAP32U=new Uint32Array(y),o.bigIntEnabled&&(h.HEAP64=new BigInt64Array(y),h.HEAP64U=new BigUint64Array(y)),h.HEAP32F=new Float32Array(y),h.HEAP64F=new Float64Array(y),h.heapSize=y.byteLength,h};o.heap8=()=>A().HEAP8,o.heap8u=()=>A().HEAP8U,o.heap16=()=>A().HEAP16,o.heap16u=()=>A().HEAP16U,o.heap32=()=>A().HEAP32,o.heap32u=()=>A().HEAP32U,o.heapForSize=function(y,q=!0){const L=h.memory&&h.heapSize===h.memory.buffer.byteLength?h:A();switch(y){case Int8Array:return L.HEAP8;case Uint8Array:return L.HEAP8U;case Int16Array:return L.HEAP16;case Uint16Array:return L.HEAP16U;case Int32Array:return L.HEAP32;case Uint32Array:return L.HEAP32U;case 8:return q?L.HEAP8U:L.HEAP8;case 16:return q?L.HEAP16U:L.HEAP16;case 32:return q?L.HEAP32U:L.HEAP32;case 64:if(L.HEAP64)return q?L.HEAP64U:L.HEAP64;break;default:if(o.bigIntEnabled){if(y===globalThis.BigUint64Array)return L.HEAP64U;if(y===globalThis.BigInt64Array)return L.HEAP64;break}}u("Invalid heapForSize() size: expecting 8, 16, 32,","or (if BigInt is enabled) 64.")},o.functionTable=function(){return o.exports.__indirect_function_table},o.functionEntry=function(y){const q=o.functionTable();return y<q.length?q.get(y):void 0},o.jsFuncToWasm=function y(q,L){if(y._||(y._={sigTypes:Object.assign(Object.create(null),{i:"i32",p:"i32",P:"i32",s:"i32",j:"i64",f:"f32",d:"f64"}),typeCodes:Object.assign(Object.create(null),{f64:124,f32:125,i64:126,i32:127}),uleb128Encode:function(ce,f,_){_<128?ce[f](_):ce[f](_%128|128,_>>7)},rxJSig:/^(\w)\((\w*)\)$/,sigParams:function(ce){const f=y._.rxJSig.exec(ce);return f?f[2]:ce.substr(1)},letterType:ce=>y._.sigTypes[ce]||u("Invalid signature letter:",ce),pushSigType:(ce,f)=>ce.push(y._.typeCodes[y._.letterType(f)])}),typeof q=="string"){const ce=L;L=q,q=ce}const le=y._.sigParams(L),X=[1,96];y._.uleb128Encode(X,"push",le.length);for(const ce of le)y._.pushSigType(X,ce);return L[0]==="v"?X.push(0):(X.push(1),y._.pushSigType(X,L[0])),y._.uleb128Encode(X,"unshift",X.length),X.unshift(0,97,115,109,1,0,0,0,1),X.push(2,7,1,1,101,1,102,0,0,7,5,1,1,102,0,0),new WebAssembly.Instance(new WebAssembly.Module(new Uint8Array(X)),{e:{f:q}}).exports.f};const O=function(q,L,le){if(le&&!h.scopedAlloc.length&&u("No scopedAllocPush() scope is active."),typeof q=="string"){const _=L;L=q,q=_}(typeof L!="string"||!(q instanceof Function))&&u("Invalid arguments: expecting (function,signature) or (signature,function).");const X=o.functionTable(),ce=X.length;let f;for(;h.freeFuncIndexes.length&&(f=h.freeFuncIndexes.pop(),X.get(f));){f=null;continue}f||(f=ce,X.grow(1));try{return X.set(f,q),le&&h.scopedAlloc[h.scopedAlloc.length-1].push(f),f}catch(_){if(!(_ instanceof TypeError))throw f===ce&&h.freeFuncIndexes.push(ce),_}try{const _=o.jsFuncToWasm(q,L);X.set(f,_),le&&h.scopedAlloc[h.scopedAlloc.length-1].push(f)}catch(_){throw f===ce&&h.freeFuncIndexes.push(ce),_}return f};o.installFunction=(y,q)=>O(y,q,!1),o.scopedInstallFunction=(y,q)=>O(y,q,!0),o.uninstallFunction=function(y){if(!y&&y!==0)return;const q=h.freeFuncIndexes,L=o.functionTable();q.push(y);const le=L.get(y);return L.set(y,null),le},o.peek=function(q,L="i8"){L.endsWith("*")&&(L=l);const le=h.memory&&h.heapSize===h.memory.buffer.byteLength?h:A(),X=Array.isArray(q)?[]:void 0;let ce;do{switch(X&&(q=arguments[0].shift()),L){case"i1":case"i8":ce=le.HEAP8[q>>0];break;case"i16":ce=le.HEAP16[q>>1];break;case"i32":ce=le.HEAP32[q>>2];break;case"float":case"f32":ce=le.HEAP32F[q>>2];break;case"double":case"f64":ce=Number(le.HEAP64F[q>>3]);break;case"i64":if(o.bigIntEnabled){ce=BigInt(le.HEAP64[q>>3]);break}default:u("Invalid type for peek():",L)}X&&X.push(ce)}while(X&&arguments[0].length);return X||ce},o.poke=function(y,q,L="i8"){L.endsWith("*")&&(L=l);const le=h.memory&&h.heapSize===h.memory.buffer.byteLength?h:A();for(const X of Array.isArray(y)?y:[y])switch(L){case"i1":case"i8":le.HEAP8[X>>0]=q;continue;case"i16":le.HEAP16[X>>1]=q;continue;case"i32":le.HEAP32[X>>2]=q;continue;case"float":case"f32":le.HEAP32F[X>>2]=q;continue;case"double":case"f64":le.HEAP64F[X>>3]=q;continue;case"i64":if(le.HEAP64){le.HEAP64[X>>3]=BigInt(q);continue}default:u("Invalid type for poke(): "+L)}return this},o.peekPtr=(...y)=>o.peek(y.length===1?y[0]:y,l),o.pokePtr=(y,q=0)=>o.poke(y,q,l),o.peek8=(...y)=>o.peek(y.length===1?y[0]:y,"i8"),o.poke8=(y,q)=>o.poke(y,q,"i8"),o.peek16=(...y)=>o.peek(y.length===1?y[0]:y,"i16"),o.poke16=(y,q)=>o.poke(y,q,"i16"),o.peek32=(...y)=>o.peek(y.length===1?y[0]:y,"i32"),o.poke32=(y,q)=>o.poke(y,q,"i32"),o.peek64=(...y)=>o.peek(y.length===1?y[0]:y,"i64"),o.poke64=(y,q)=>o.poke(y,q,"i64"),o.peek32f=(...y)=>o.peek(y.length===1?y[0]:y,"f32"),o.poke32f=(y,q)=>o.poke(y,q,"f32"),o.peek64f=(...y)=>o.peek(y.length===1?y[0]:y,"f64"),o.poke64f=(y,q)=>o.poke(y,q,"f64"),o.getMemValue=o.peek,o.getPtrValue=o.peekPtr,o.setMemValue=o.poke,o.setPtrValue=o.pokePtr,o.isPtr32=y=>typeof y=="number"&&y===(y|0)&&y>=0,o.isPtr=o.isPtr32,o.cstrlen=function(y){if(!y||!o.isPtr(y))return null;const q=A().HEAP8U;let L=y;for(;q[L]!==0;++L);return L-y};const Z=typeof SharedArrayBuffer>"u"?function(){}:SharedArrayBuffer,ee=function(y,q,L){return h.utf8Decoder.decode(y.buffer instanceof Z?y.slice(q,L):y.subarray(q,L))};o.cstrToJs=function(y){const q=o.cstrlen(y);return q?ee(A().HEAP8U,y,y+q):q===null?q:""},o.jstrlen=function(y){if(typeof y!="string")return null;const q=y.length;let L=0;for(let le=0;le<q;++le){let X=y.charCodeAt(le);X>=55296&&X<=57343&&(X=65536+((X&1023)<<10)|y.charCodeAt(++le)&1023),X<=127?++L:X<=2047?L+=2:X<=65535?L+=3:L+=4}return L},o.jstrcpy=function(y,q,L=0,le=-1,X=!0){if((!q||!(q instanceof Int8Array)&&!(q instanceof Uint8Array))&&u("jstrcpy() target must be an Int8Array or Uint8Array."),le<0&&(le=q.length-L),!(le>0)||!(L>=0))return 0;let ce=0,f=y.length;const _=L,b=L+le-(X?1:0);for(;ce<f&&L<b;++ce){let k=y.charCodeAt(ce);if(k>=55296&&k<=57343&&(k=65536+((k&1023)<<10)|y.charCodeAt(++ce)&1023),k<=127){if(L>=b)break;q[L++]=k}else if(k<=2047){if(L+1>=b)break;q[L++]=192|k>>6,q[L++]=128|k&63}else if(k<=65535){if(L+2>=b)break;q[L++]=224|k>>12,q[L++]=128|k>>6&63,q[L++]=128|k&63}else{if(L+3>=b)break;q[L++]=240|k>>18,q[L++]=128|k>>12&63,q[L++]=128|k>>6&63,q[L++]=128|k&63}}return X&&(q[L++]=0),L-_},o.cstrncpy=function(y,q,L){if((!y||!q)&&u("cstrncpy() does not accept NULL strings."),L<0)L=o.cstrlen(strPtr)+1;else if(!(L>0))return 0;const le=o.heap8u();let X=0,ce;for(;X<L&&(ce=le[q+X]);++X)le[y+X]=ce;return X<L&&(le[y+X++]=0),X},o.jstrToUintArray=(y,q=!1)=>h.utf8Encoder.encode(q?y+"\0":y);const fe=(y,q)=>{(!(y.alloc instanceof Function)||!(y.dealloc instanceof Function))&&u("Object is missing alloc() and/or dealloc() function(s)","required by",q+"().")},_e=function(y,q,L,le){if(fe(o,le),typeof y!="string")return null;{const X=h.utf8Encoder.encode(y),ce=L(X.length+1),f=A().HEAP8U;return f.set(X,ce),f[ce+X.length]=0,q?[ce,X.length]:ce}};o.allocCString=(y,q=!1)=>_e(y,q,o.alloc,"allocCString()"),o.scopedAllocPush=function(){fe(o,"scopedAllocPush");const y=[];return h.scopedAlloc.push(y),y},o.scopedAllocPop=function(y){fe(o,"scopedAllocPop");const q=arguments.length?h.scopedAlloc.indexOf(y):h.scopedAlloc.length-1;q<0&&u("Invalid state object for scopedAllocPop()."),arguments.length===0&&(y=h.scopedAlloc[q]),h.scopedAlloc.splice(q,1);for(let L;L=y.pop();)o.functionEntry(L)?o.uninstallFunction(L):o.dealloc(L)},o.scopedAlloc=function(y){h.scopedAlloc.length||u("No scopedAllocPush() scope is active.");const q=o.alloc(y);return h.scopedAlloc[h.scopedAlloc.length-1].push(q),q},Object.defineProperty(o.scopedAlloc,"level",{configurable:!1,enumerable:!1,get:()=>h.scopedAlloc.length,set:()=>u("The 'active' property is read-only.")}),o.scopedAllocCString=(y,q=!1)=>_e(y,q,o.scopedAlloc,"scopedAllocCString()");const H=function(y,q){const L=o[y?"scopedAlloc":"alloc"]((q.length+1)*o.ptrSizeof);let le=0;return q.forEach(X=>{o.pokePtr(L+o.ptrSizeof*le++,o[y?"scopedAllocCString":"allocCString"](""+X))}),o.pokePtr(L+o.ptrSizeof*le,0),L};o.scopedAllocMainArgv=y=>H(!0,y),o.allocMainArgv=y=>H(!1,y),o.cArgvToJs=(y,q)=>{const L=[];for(let le=0;le<y;++le){const X=o.peekPtr(q+o.ptrSizeof*le);L.push(X?o.cstrToJs(X):null)}return L},o.scopedAllocCall=function(y){o.scopedAllocPush();try{return y()}finally{o.scopedAllocPop()}};const $=function(y,q,L){fe(o,L);const le=q?"i64":l;let X=o[L](y*(q?8:c));if(o.poke(X,0,le),y===1)return X;const ce=[X];for(let f=1;f<y;++f)X+=q?8:c,ce[f]=X,o.poke(X,0,le);return ce};o.allocPtr=(y=1,q=!0)=>$(y,q,"alloc"),o.scopedAllocPtr=(y=1,q=!0)=>$(y,q,"scopedAlloc"),o.xGet=function(y){return o.exports[y]||u("Cannot find exported symbol:",y)};const ae=(y,q)=>u(y+"() requires",q,"argument(s).");o.xCall=function(y,...q){const L=y instanceof Function?y:o.xGet(y);return L instanceof Function||u("Exported symbol",y,"is not a function."),L.length!==q.length&&ae(L===y?L.name:y,L.length),arguments.length===2&&Array.isArray(arguments[1])?L.apply(null,arguments[1]):L.apply(null,q)},h.xWrap=Object.create(null),h.xWrap.convert=Object.create(null),h.xWrap.convert.arg=new Map,h.xWrap.convert.result=new Map;const E=h.xWrap.convert.arg,T=h.xWrap.convert.result;o.bigIntEnabled&&E.set("i64",y=>BigInt(y));const F=l==="i32"?y=>y|0:y=>BigInt(y)|BigInt(0);E.set("i32",F).set("i16",y=>(y|0)&65535).set("i8",y=>(y|0)&255).set("f32",y=>Number(y).valueOf()).set("float",E.get("f32")).set("f64",E.get("f32")).set("double",E.get("f64")).set("int",E.get("i32")).set("null",y=>y).set(null,E.get("null")).set("**",F).set("*",F),T.set("*",F).set("pointer",F).set("number",y=>Number(y)).set("void",y=>{}).set("null",y=>y).set(null,T.get("null"));{const y=["i8","i16","i32","int","f32","float","f64","double"];o.bigIntEnabled&&y.push("i64");const q=E.get(l);for(const L of y)E.set(L+"*",q),T.set(L+"*",q),T.set(L,E.get(L)||u("Missing arg converter:",L))}const J=function(y){return typeof y=="string"?o.scopedAllocCString(y):y?F(y):null};E.set("string",J).set("utf8",J).set("pointer",J),T.set("string",y=>o.cstrToJs(y)).set("utf8",T.get("string")).set("string:dealloc",y=>{try{return y?o.cstrToJs(y):null}finally{o.dealloc(y)}}).set("utf8:dealloc",T.get("string:dealloc")).set("json",y=>JSON.parse(o.cstrToJs(y))).set("json:dealloc",y=>{try{return y?JSON.parse(o.cstrToJs(y)):null}finally{o.dealloc(y)}});const K=class{constructor(y){this.name=y.name||"unnamed adapter"}convertArg(y,q,L){u("AbstractArgAdapter must be subclassed.")}};E.FuncPtrAdapter=class jr extends K{constructor(q){super(q),E.FuncPtrAdapter.warnOnUse&&console.warn("xArg.FuncPtrAdapter is an internal-only API","and is not intended to be invoked from","client-level code. Invoked with:",q),this.name=q.name||"unnamed",this.signature=q.signature,q.contextKey instanceof Function&&(this.contextKey=q.contextKey,q.bindScope||(q.bindScope="context")),this.bindScope=q.bindScope||u("FuncPtrAdapter options requires a bindScope (explicit or implied)."),jr.bindScopes.indexOf(q.bindScope)<0&&u("Invalid options.bindScope ("+q.bindMod+") for FuncPtrAdapter. Expecting one of: ("+jr.bindScopes.join(", ")+")"),this.isTransient=this.bindScope==="transient",this.isContext=this.bindScope==="context",this.isPermanent=this.bindScope==="permanent",this.singleton=this.bindScope==="singleton"?[]:void 0,this.callProxy=q.callProxy instanceof Function?q.callProxy:void 0}contextKey(q,L){return this}contextMap(q){const L=this.__cmap||(this.__cmap=new Map);let le=L.get(q);return le===void 0&&L.set(q,le=[]),le}convertArg(q,L,le){let X=this.singleton;if(!X&&this.isContext&&(X=this.contextMap(this.contextKey(L,le))),X&&X[0]===q)return X[1];if(q instanceof Function){this.callProxy&&(q=this.callProxy(q));const ce=O(q,this.signature,this.isTransient);if(jr.debugFuncInstall&&jr.debugOut("FuncPtrAdapter installed",this,this.contextKey(L,le),"@"+ce,q),X){if(X[1]){jr.debugFuncInstall&&jr.debugOut("FuncPtrAdapter uninstalling",this,this.contextKey(L,le),"@"+X[1],q);try{h.scopedAlloc[h.scopedAlloc.length-1].push(X[1])}catch{}}X[0]=q,X[1]=ce}return ce}else if(o.isPtr(q)||q===null||q===void 0){if(X&&X[1]&&X[1]!==q){jr.debugFuncInstall&&jr.debugOut("FuncPtrAdapter uninstalling",this,this.contextKey(L,le),"@"+X[1],q);try{h.scopedAlloc[h.scopedAlloc.length-1].push(X[1])}catch{}X[0]=X[1]=q|0}return q||0}else throw new TypeError("Invalid FuncPtrAdapter argument type. Expecting a function pointer or a "+(this.name?this.name+" ":"")+"function matching signature "+this.signature+".")}},E.FuncPtrAdapter.warnOnUse=!1,E.FuncPtrAdapter.debugFuncInstall=!1,E.FuncPtrAdapter.debugOut=console.debug.bind(console),E.FuncPtrAdapter.bindScopes=["transient","context","singleton","permanent"];const D=y=>E.get(y)||u("Argument adapter not found:",y),te=y=>T.get(y)||u("Result adapter not found:",y);h.xWrap.convertArg=(y,...q)=>D(y)(...q),h.xWrap.convertArgNoCheck=(y,...q)=>E.get(y)(...q),h.xWrap.convertResult=(y,q)=>y===null?q:y?te(y)(q):void 0,h.xWrap.convertResultNoCheck=(y,q)=>y===null?q:y?T.get(y)(q):void 0,o.xWrap=function(y,q,...L){arguments.length===3&&Array.isArray(arguments[2])&&(L=arguments[2]),o.isPtr(y)&&(y=o.functionEntry(y)||u("Function pointer not found in WASM function table."));const le=y instanceof Function,X=le?y:o.xGet(y);if(le&&(y=X.name||"unnamed function"),L.length!==X.length&&ae(y,X.length),q===null&&X.length===0)return X;q!=null&&te(q);for(const f of L)f instanceof K?E.set(f,(..._)=>f.convertArg(..._)):D(f);const ce=h.xWrap;return X.length===0?(...f)=>f.length?ae(y,X.length):ce.convertResult(q,X.call(null)):function(...f){f.length!==X.length&&ae(y,X.length);const _=o.scopedAllocPush();try{let b=0;for(;b<f.length;++b)f[b]=ce.convertArgNoCheck(L[b],f[b],f,b);return ce.convertResultNoCheck(q,X.apply(null,f))}finally{o.scopedAllocPop(_)}}};const Ne=function(y,q,L,le,X,ce){if(typeof L=="string"){if(q===1)return ce.get(L);if(q===2){if(le)le instanceof Function||u(X,"requires a function argument.");else return ce.delete(L),y;return ce.set(L,le),y}}u("Invalid arguments to",X)};return o.xWrap.resultAdapter=function y(q,L){return Ne(y,arguments.length,q,L,"resultAdapter()",T)},o.xWrap.argAdapter=function y(q,L){return Ne(y,arguments.length,q,L,"argAdapter()",E)},o.xWrap.FuncPtrAdapter=E.FuncPtrAdapter,o.xCallWrapped=function(y,q,L,...le){return Array.isArray(arguments[3])&&(le=arguments[3]),o.xWrap(y,q,L||[]).apply(null,le||[])},o.xWrap.testConvertArg=h.xWrap.convertArg,o.xWrap.testConvertResult=h.xWrap.convertResult,o},globalThis.WhWasmUtilInstaller.yawl=(function(o){const u=()=>fetch(o.uri,{credentials:"same-origin"}),l=this,c=function(A){if(o.wasmUtilTarget){const O=(...ee)=>{throw new Error(ee.join(" "))},Z=o.wasmUtilTarget;if(Z.module=A.module,Z.instance=A.instance,Z.instance.exports.memory||(Z.memory=o.imports&&o.imports.env&&o.imports.env.memory||O("Missing 'memory' object!")),!Z.alloc&&A.instance.exports.malloc){const ee=A.instance.exports;Z.alloc=function(fe){return ee.malloc(fe)||O("Allocation of",fe,"bytes failed.")},Z.dealloc=function(fe){ee.free(fe)}}l(Z)}return o.onload&&o.onload(A,o),A};return WebAssembly.instantiateStreaming?function(){return WebAssembly.instantiateStreaming(u(),o.imports||{}).then(c)}:function(){return u().then(O=>O.arrayBuffer()).then(O=>WebAssembly.instantiate(O,o.imports||{})).then(c)}}).bind(globalThis.WhWasmUtilInstaller),globalThis.Jaccwabyt=function o(u){const l=(...Q)=>{throw new Error(Q.join(" "))};!(u.heap instanceof WebAssembly.Memory)&&!(u.heap instanceof Function)&&l("config.heap must be WebAssembly.Memory instance or a function."),["alloc","dealloc"].forEach(function(Q){u[Q]instanceof Function||l("Config option '"+Q+"' must be a function.")});const c=o,h=u.heap instanceof Function?u.heap:()=>new Uint8Array(u.heap.buffer),A=u.alloc,O=u.dealloc,Z=u.log||console.log.bind(console),ee=u.memberPrefix||"",fe=u.memberSuffix||"",_e=u.bigIntEnabled===void 0?!!globalThis.BigInt64Array:!!u.bigIntEnabled,H=globalThis.BigInt,$=globalThis.BigInt64Array,ae=u.ptrSizeof||4,E=u.ptrIR||"i32";c.debugFlags||(c.__makeDebugFlags=function(Q=null){Q&&Q.__flags&&(Q=Q.__flags);const ye=function ve(Ae){return arguments.length===0?ve.__flags:(Ae<0?(delete ve.__flags.getter,delete ve.__flags.setter,delete ve.__flags.alloc,delete ve.__flags.dealloc):(ve.__flags.getter=(1&Ae)!==0,ve.__flags.setter=(2&Ae)!==0,ve.__flags.alloc=(4&Ae)!==0,ve.__flags.dealloc=(8&Ae)!==0),ve._flags)};return Object.defineProperty(ye,"__flags",{iterable:!1,writable:!1,value:Object.create(Q)}),Q||ye(0),ye},c.debugFlags=c.__makeDebugFlags());const T=(function(){const Q=new ArrayBuffer(2);return new DataView(Q).setInt16(0,256,!0),new Int16Array(Q)[0]===256})(),F=Q=>Q[1]==="(",J=Q=>Q==="P",K=Q=>F(Q)?"p":Q[0],D=function(Q){switch(K(Q)){case"c":case"C":return"i8";case"i":return"i32";case"p":case"P":case"s":return E;case"j":return"i64";case"f":return"float";case"d":return"double"}l("Unhandled signature IR:",Q)},te=$?()=>!0:()=>l("BigInt64Array is not available."),Ne=function(Q){switch(K(Q)){case"p":case"P":case"s":{switch(ae){case 4:return"getInt32";case 8:return te()&&"getBigInt64"}break}case"i":return"getInt32";case"c":return"getInt8";case"C":return"getUint8";case"j":return te()&&"getBigInt64";case"f":return"getFloat32";case"d":return"getFloat64"}l("Unhandled DataView getter for signature:",Q)},y=function(Q){switch(K(Q)){case"p":case"P":case"s":{switch(ae){case 4:return"setInt32";case 8:return te()&&"setBigInt64"}break}case"i":return"setInt32";case"c":return"setInt8";case"C":return"setUint8";case"j":return te()&&"setBigInt64";case"f":return"setFloat32";case"d":return"setFloat64"}l("Unhandled DataView setter for signature:",Q)},q=function(Q){switch(K(Q)){case"i":case"f":case"c":case"C":case"d":return Number;case"j":return te()&&H;case"p":case"P":case"s":switch(ae){case 4:return Number;case 8:return te()&&H}break}l("Unhandled DataView set wrapper for signature:",Q)},L=(Q,ye)=>Q+"::"+ye,le=function(Q,ye){return()=>l(L(Q,ye),"is read-only.")},X=new WeakMap,ce="(pointer-is-external)",f=function(Q,ye,ve){if(ve||(ve=X.get(ye)),ve){if(X.delete(ye),Array.isArray(ye.ondispose)){let Ae;for(;Ae=ye.ondispose.shift();)try{Ae instanceof Function?Ae.call(ye):Ae instanceof Me?Ae.dispose():typeof Ae=="number"&&O(Ae)}catch(tt){console.warn("ondispose() for",Q.structName,"@",ve,"threw. NOT propagating it.",tt)}}else if(ye.ondispose instanceof Function)try{ye.ondispose()}catch(Ae){console.warn("ondispose() for",Q.structName,"@",ve,"threw. NOT propagating it.",Ae)}delete ye.ondispose,Q.debugFlags.__flags.dealloc&&Z("debug.dealloc:",ye[ce]?"EXTERNAL":"",Q.structName,"instance:",Q.structInfo.sizeof,"bytes @"+ve),ye[ce]||O(ve)}},_=Q=>({configurable:!1,writable:!1,iterable:!1,value:Q}),b=function(Q,ye,ve){let Ae=!ve;ve?Object.defineProperty(ye,ce,_(ve)):(ve=A(Q.structInfo.sizeof),ve||l("Allocation of",Q.structName,"structure failed."));try{Q.debugFlags.__flags.alloc&&Z("debug.alloc:",Ae?"":"EXTERNAL",Q.structName,"instance:",Q.structInfo.sizeof,"bytes @"+ve),Ae&&h().fill(0,ve,ve+Q.structInfo.sizeof),X.set(ye,ve)}catch(tt){throw f(Q,ye,ve),tt}},k=function(){const Q=this.pointer;return Q?new Uint8Array(h().slice(Q,Q+this.structInfo.sizeof)):null},be=_(Q=>ee+Q+fe),Fe=function(Q,ye,ve=!0){let Ae=Q.members[ye];if(!Ae&&(ee||fe)){for(const tt of Object.values(Q.members))if(tt.key===ye){Ae=tt;break}!Ae&&ve&&l(L(Q.name,ye),"is not a mapped struct member.")}return Ae},He=function Q(ye,ve,Ae=!1){Q._||(Q._=yt=>yt.replace(/[^vipPsjrdcC]/g,"").replace(/[pPscC]/g,"i"));const tt=Fe(ye.structInfo,ve,!0);return Ae?Q._(tt.signature):tt.signature},Ve={configurable:!1,enumerable:!1,get:function(){return X.get(this)},set:()=>l("Cannot assign the 'pointer' property of a struct.")},de=_(function(){const Q=[];for(const ye of Object.keys(this.structInfo.members))Q.push(this.memberKey(ye));return Q}),C=new TextDecoder("utf-8"),B=new TextEncoder,re=typeof SharedArrayBuffer>"u"?function(){}:SharedArrayBuffer,me=function(Q,ye,ve){return C.decode(Q.buffer instanceof re?Q.slice(ye,ve):Q.subarray(ye,ve))},We=function(Q,ye,ve=!1){const Ae=Fe(Q.structInfo,ye,ve);return Ae&&Ae.signature.length===1&&Ae.signature[0]==="s"?Ae:!1},P=function(Q){Q.signature!=="s"&&l("Invalid member type signature for C-string value:",JSON.stringify(Q))},G=function(ye,ve){const Ae=Fe(ye.structInfo,ve,!0);P(Ae);const tt=ye[Ae.key];if(!tt)return null;let yt=tt;const ft=h();for(;ft[yt]!==0;++yt);return tt===yt?"":me(ft,tt,yt)},ie=function(Q,...ye){Q.ondispose?Array.isArray(Q.ondispose)||(Q.ondispose=[Q.ondispose]):Q.ondispose=[],Q.ondispose.push(...ye)},qe=function(Q){const ye=B.encode(Q),ve=A(ye.length+1);ve||l("Allocation error while duplicating string:",Q);const Ae=h();return Ae.set(ye,ve),Ae[ve+ye.length]=0,ve},xe=function(Q,ye,ve){const Ae=Fe(Q.structInfo,ye,!0);P(Ae);const tt=qe(ve);return Q[Ae.key]=tt,ie(Q,tt),Q},Me=function(ye,ve){arguments[2]!==_&&l("Do not call the StructType constructor","from client-level code."),Object.defineProperties(this,{structName:_(ye),structInfo:_(ve)})};Me.prototype=Object.create(null,{dispose:_(function(){f(this.constructor,this)}),lookupMember:_(function(Q,ye=!0){return Fe(this.structInfo,Q,ye)}),memberToJsString:_(function(Q){return G(this,Q)}),memberIsString:_(function(Q,ye=!0){return We(this,Q,ye)}),memberKey:be,memberKeys:de,memberSignature:_(function(Q,ye=!1){return He(this,Q,ye)}),memoryDump:_(k),pointer:Ve,setMemberCString:_(function(Q,ye){return xe(this,Q,ye)})}),Object.assign(Me.prototype,{addOnDispose:function(...Q){return ie(this,...Q),this}}),Object.defineProperties(Me,{allocCString:_(qe),isA:_(Q=>Q instanceof Me),hasExternalPointer:_(Q=>Q instanceof Me&&!!Q[ce]),memberKey:be});const Ge=Q=>Number.isFinite(Q)||Q instanceof(H||Number),Pe=function Q(ye,ve,Ae){if(!Q._){Q._={getters:{},setters:{},sw:{}};const Vt=["i","c","C","p","P","s","f","d","v()"];_e&&Vt.push("j"),Vt.forEach(function(Or){Q._.getters[Or]=Ne(Or),Q._.setters[Or]=y(Or),Q._.sw[Or]=q(Or)});const q0=/^[ipPsjfdcC]$/,S0=/^[vipPsjfdcC]\([ipPsjfdcC]*\)$/;Q.sigCheck=function(Or,k0,sd,Ma){Object.prototype.hasOwnProperty.call(Or,sd)&&l(Or.structName,"already has a property named",sd+"."),q0.test(Ma)||S0.test(Ma)||l("Malformed signature for",L(Or.structName,k0)+":",Ma)}}const tt=ye.memberKey(ve);Q.sigCheck(ye.prototype,ve,tt,Ae.signature),Ae.key=tt,Ae.name=ve;const yt=K(Ae.signature),ft=L(ye.prototype.structName,tt),pt=ye.prototype.debugFlags.__flags,_i=Object.create(null);_i.configurable=!1,_i.enumerable=!1,_i.get=function(){pt.getter&&Z("debug.getter:",Q._.getters[yt],"for",D(yt),ft,"@",this.pointer,"+",Ae.offset,"sz",Ae.sizeof);let Vt=new DataView(h().buffer,this.pointer+Ae.offset,Ae.sizeof)[Q._.getters[yt]](0,T);return pt.getter&&Z("debug.getter:",ft,"result =",Vt),Vt},Ae.readOnly?_i.set=le(ye.prototype.structName,tt):_i.set=function(Vt){if(pt.setter&&Z("debug.setter:",Q._.setters[yt],"for",D(yt),ft,"@",this.pointer,"+",Ae.offset,"sz",Ae.sizeof,Vt),this.pointer||l("Cannot set struct property on disposed instance."),Vt===null)Vt=0;else for(;!Ge(Vt);){if(J(Ae.signature)&&Vt instanceof Me){Vt=Vt.pointer||0,pt.setter&&Z("debug.setter:",ft,"resolved to",Vt);break}l("Invalid value for pointer-type",ft+".")}new DataView(h().buffer,this.pointer+Ae.offset,Ae.sizeof)[Q._.setters[yt]](0,Q._.sw[yt](Vt),T)},Object.defineProperty(ye.prototype,tt,_i)},Lt=function Q(ye,ve){arguments.length===1?(ve=ye,ye=ve.name):ve.name||(ve.name=ye),ye||l("Struct name is required.");let Ae=!1;Object.keys(ve.members).forEach(ft=>{const pt=ve.members[ft];pt.sizeof?pt.sizeof===1?pt.signature==="c"||pt.signature==="C"||l("Unexpected sizeof==1 member",L(ve.name,ft),"with signature",pt.signature):(pt.sizeof%4!==0&&(console.warn("Invalid struct member description =",pt,"from",ve),l(ye,"member",ft,"sizeof is not aligned. sizeof="+pt.sizeof)),pt.offset%4!==0&&(console.warn("Invalid struct member description =",pt,"from",ve),l(ye,"member",ft,"offset is not aligned. offset="+pt.offset))):l(ye,"member",ft,"is missing sizeof."),(!Ae||Ae.offset<pt.offset)&&(Ae=pt)}),Ae?ve.sizeof<Ae.offset+Ae.sizeof&&l("Invalid struct config:",ye,"max member offset ("+Ae.offset+") ","extends past end of struct (sizeof="+ve.sizeof+")."):l("No member property descriptions found.");const tt=_(c.__makeDebugFlags(Q.debugFlags)),yt=function ft(pt){this instanceof ft?arguments.length?((pt!==(pt|0)||pt<=0)&&l("Invalid pointer value for",ye,"constructor."),b(ft,this,pt)):b(ft,this):l("The",ye,"constructor may only be called via 'new'.")};return Object.defineProperties(yt,{debugFlags:tt,isA:_(ft=>ft instanceof yt),memberKey:be,memberKeys:de,methodInfoForKey:_(function(ft){}),structInfo:_(ve),structName:_(ye)}),yt.prototype=new Me(ye,ve,_),Object.defineProperties(yt.prototype,{debugFlags:tt,constructor:_(yt)}),Object.keys(ve.members).forEach(ft=>Pe(yt,ft,ve.members[ft])),yt};return Lt.StructType=Me,Lt.config=u,Lt.allocCString=qe,Lt.debugFlags||(Lt.debugFlags=c.__makeDebugFlags(c.debugFlags)),Lt},globalThis.sqlite3ApiBootstrap.initializers.push(function(o){const u=(...E)=>{throw new Error(E.join(" "))};o.SQLite3Error.toss;const l=o.capi,c=o.wasm,h=o.util;if(globalThis.WhWasmUtilInstaller(c),delete globalThis.WhWasmUtilInstaller,c.bindingSignatures=[["sqlite3_aggregate_context","void*","sqlite3_context*","int"],["sqlite3_bind_double","int","sqlite3_stmt*","int","f64"],["sqlite3_bind_int","int","sqlite3_stmt*","int","int"],["sqlite3_bind_null",void 0,"sqlite3_stmt*","int"],["sqlite3_bind_parameter_count","int","sqlite3_stmt*"],["sqlite3_bind_parameter_index","int","sqlite3_stmt*","string"],["sqlite3_bind_parameter_name","string","sqlite3_stmt*","int"],["sqlite3_bind_pointer","int","sqlite3_stmt*","int","*","string:static","*"],["sqlite3_busy_handler","int",["sqlite3*",new c.xWrap.FuncPtrAdapter({signature:"i(pi)",contextKey:(E,T)=>E[0]}),"*"]],["sqlite3_busy_timeout","int","sqlite3*","int"],["sqlite3_changes","int","sqlite3*"],["sqlite3_clear_bindings","int","sqlite3_stmt*"],["sqlite3_collation_needed","int","sqlite3*","*","*"],["sqlite3_column_blob","*","sqlite3_stmt*","int"],["sqlite3_column_bytes","int","sqlite3_stmt*","int"],["sqlite3_column_count","int","sqlite3_stmt*"],["sqlite3_column_decltype","string","sqlite3_stmt*","int"],["sqlite3_column_double","f64","sqlite3_stmt*","int"],["sqlite3_column_int","int","sqlite3_stmt*","int"],["sqlite3_column_name","string","sqlite3_stmt*","int"],["sqlite3_column_text","string","sqlite3_stmt*","int"],["sqlite3_column_type","int","sqlite3_stmt*","int"],["sqlite3_column_value","sqlite3_value*","sqlite3_stmt*","int"],["sqlite3_commit_hook","void*",["sqlite3*",new c.xWrap.FuncPtrAdapter({name:"sqlite3_commit_hook",signature:"i(p)",contextKey:E=>E[0]}),"*"]],["sqlite3_compileoption_get","string","int"],["sqlite3_compileoption_used","int","string"],["sqlite3_complete","int","string:flexible"],["sqlite3_context_db_handle","sqlite3*","sqlite3_context*"],["sqlite3_data_count","int","sqlite3_stmt*"],["sqlite3_db_filename","string","sqlite3*","string"],["sqlite3_db_handle","sqlite3*","sqlite3_stmt*"],["sqlite3_db_name","string","sqlite3*","int"],["sqlite3_db_readonly","int","sqlite3*","string"],["sqlite3_db_status","int","sqlite3*","int","*","*","int"],["sqlite3_errcode","int","sqlite3*"],["sqlite3_errmsg","string","sqlite3*"],["sqlite3_error_offset","int","sqlite3*"],["sqlite3_errstr","string","int"],["sqlite3_exec","int",["sqlite3*","string:flexible",new c.xWrap.FuncPtrAdapter({signature:"i(pipp)",bindScope:"transient",callProxy:E=>{let T;return(F,J,K,D)=>{try{const te=c.cArgvToJs(J,K);return T||(T=c.cArgvToJs(J,D)),E(te,T)|0}catch(te){return te.resultCode||l.SQLITE_ERROR}}}}),"*","**"]],["sqlite3_expanded_sql","string","sqlite3_stmt*"],["sqlite3_extended_errcode","int","sqlite3*"],["sqlite3_extended_result_codes","int","sqlite3*","int"],["sqlite3_file_control","int","sqlite3*","string","int","*"],["sqlite3_finalize","int","sqlite3_stmt*"],["sqlite3_free",void 0,"*"],["sqlite3_get_autocommit","int","sqlite3*"],["sqlite3_get_auxdata","*","sqlite3_context*","int"],["sqlite3_initialize",void 0],["sqlite3_interrupt",void 0,"sqlite3*"],["sqlite3_is_interrupted","int","sqlite3*"],["sqlite3_keyword_count","int"],["sqlite3_keyword_name","int",["int","**","*"]],["sqlite3_keyword_check","int",["string","int"]],["sqlite3_libversion","string"],["sqlite3_libversion_number","int"],["sqlite3_limit","int",["sqlite3*","int","int"]],["sqlite3_malloc","*","int"],["sqlite3_open","int","string","*"],["sqlite3_open_v2","int","string","*","int","string"],["sqlite3_realloc","*","*","int"],["sqlite3_reset","int","sqlite3_stmt*"],["sqlite3_result_blob",void 0,"sqlite3_context*","*","int","*"],["sqlite3_result_double",void 0,"sqlite3_context*","f64"],["sqlite3_result_error",void 0,"sqlite3_context*","string","int"],["sqlite3_result_error_code",void 0,"sqlite3_context*","int"],["sqlite3_result_error_nomem",void 0,"sqlite3_context*"],["sqlite3_result_error_toobig",void 0,"sqlite3_context*"],["sqlite3_result_int",void 0,"sqlite3_context*","int"],["sqlite3_result_null",void 0,"sqlite3_context*"],["sqlite3_result_pointer",void 0,"sqlite3_context*","*","string:static","*"],["sqlite3_result_subtype",void 0,"sqlite3_value*","int"],["sqlite3_result_text",void 0,"sqlite3_context*","string","int","*"],["sqlite3_result_zeroblob",void 0,"sqlite3_context*","int"],["sqlite3_rollback_hook","void*",["sqlite3*",new c.xWrap.FuncPtrAdapter({name:"sqlite3_rollback_hook",signature:"v(p)",contextKey:E=>E[0]}),"*"]],["sqlite3_set_auxdata",void 0,["sqlite3_context*","int","*","*"]],["sqlite3_shutdown",void 0],["sqlite3_sourceid","string"],["sqlite3_sql","string","sqlite3_stmt*"],["sqlite3_status","int","int","*","*","int"],["sqlite3_step","int","sqlite3_stmt*"],["sqlite3_stmt_busy","int","sqlite3_stmt*"],["sqlite3_stmt_readonly","int","sqlite3_stmt*"],["sqlite3_stmt_status","int","sqlite3_stmt*","int","int"],["sqlite3_strglob","int","string","string"],["sqlite3_stricmp","int","string","string"],["sqlite3_strlike","int","string","string","int"],["sqlite3_strnicmp","int","string","string","int"],["sqlite3_table_column_metadata","int","sqlite3*","string","string","string","**","**","*","*","*"],["sqlite3_total_changes","int","sqlite3*"],["sqlite3_trace_v2","int",["sqlite3*","int",new c.xWrap.FuncPtrAdapter({name:"sqlite3_trace_v2::callback",signature:"i(ippp)",contextKey:(E,T)=>E[0]}),"*"]],["sqlite3_txn_state","int",["sqlite3*","string"]],["sqlite3_uri_boolean","int","sqlite3_filename","string","int"],["sqlite3_uri_key","string","sqlite3_filename","int"],["sqlite3_uri_parameter","string","sqlite3_filename","string"],["sqlite3_user_data","void*","sqlite3_context*"],["sqlite3_value_blob","*","sqlite3_value*"],["sqlite3_value_bytes","int","sqlite3_value*"],["sqlite3_value_double","f64","sqlite3_value*"],["sqlite3_value_dup","sqlite3_value*","sqlite3_value*"],["sqlite3_value_free",void 0,"sqlite3_value*"],["sqlite3_value_frombind","int","sqlite3_value*"],["sqlite3_value_int","int","sqlite3_value*"],["sqlite3_value_nochange","int","sqlite3_value*"],["sqlite3_value_numeric_type","int","sqlite3_value*"],["sqlite3_value_pointer","*","sqlite3_value*","string:static"],["sqlite3_value_subtype","int","sqlite3_value*"],["sqlite3_value_text","string","sqlite3_value*"],["sqlite3_value_type","int","sqlite3_value*"],["sqlite3_vfs_find","*","string"],["sqlite3_vfs_register","int","sqlite3_vfs*","int"],["sqlite3_vfs_unregister","int","sqlite3_vfs*"]],c.exports.sqlite3_progress_handler&&c.bindingSignatures.push(["sqlite3_progress_handler",void 0,["sqlite3*","int",new c.xWrap.FuncPtrAdapter({name:"xProgressHandler",signature:"i(p)",bindScope:"context",contextKey:(E,T)=>E[0]}),"*"]]),c.exports.sqlite3_stmt_explain&&c.bindingSignatures.push(["sqlite3_stmt_explain","int","sqlite3_stmt*","int"],["sqlite3_stmt_isexplain","int","sqlite3_stmt*"]),c.exports.sqlite3_set_authorizer&&c.bindingSignatures.push(["sqlite3_set_authorizer","int",["sqlite3*",new c.xWrap.FuncPtrAdapter({name:"sqlite3_set_authorizer::xAuth",signature:"i(pissss)",contextKey:(E,T)=>E[0],callProxy:E=>(T,F,J,K,D,te)=>{try{return J=J&&c.cstrToJs(J),K=K&&c.cstrToJs(K),D=D&&c.cstrToJs(D),te=te&&c.cstrToJs(te),E(T,F,J,K,D,te)||0}catch(Ne){return Ne.resultCode||l.SQLITE_ERROR}}}),"*"]]),c.exports.sqlite3_key_v2 instanceof Function&&c.bindingSignatures.push(["sqlite3_key","int","sqlite3*","string","int"],["sqlite3_key_v2","int","sqlite3*","string","*","int"],["sqlite3_rekey","int","sqlite3*","string","int"],["sqlite3_rekey_v2","int","sqlite3*","string","*","int"],["sqlite3_activate_see",void 0,"string"],["sqlite3mc_cipher_count","int"],["sqlite3mc_cipher_index","int","string"],["sqlite3mc_cipher_name","string","int"],["sqlite3mc_config","int","sqlite3*","string","int"],["sqlite3mc_config_cipher","int","sqlite3*","string","string","int"],["sqlite3mc_codec_data","string","sqlite3*","string","string"],["sqlite3mc_version","string"],["sqlite3mc_vfs_create","int","string","int"],["sqlite3mc_vfs_destroy",void 0,"string"],["sqlite3mc_vfs_shutdown",void 0]),c.bindingSignatures.int64=[["sqlite3_bind_int64","int",["sqlite3_stmt*","int","i64"]],["sqlite3_changes64","i64",["sqlite3*"]],["sqlite3_column_int64","i64",["sqlite3_stmt*","int"]],["sqlite3_deserialize","int","sqlite3*","string","*","i64","i64","int"],["sqlite3_last_insert_rowid","i64",["sqlite3*"]],["sqlite3_malloc64","*","i64"],["sqlite3_msize","i64","*"],["sqlite3_overload_function","int",["sqlite3*","string","int"]],["sqlite3_realloc64","*","*","i64"],["sqlite3_result_int64",void 0,"*","i64"],["sqlite3_result_zeroblob64","int","*","i64"],["sqlite3_serialize","*","sqlite3*","string","*","int"],["sqlite3_set_last_insert_rowid",void 0,["sqlite3*","i64"]],["sqlite3_status64","int","int","*","*","int"],["sqlite3_total_changes64","i64",["sqlite3*"]],["sqlite3_update_hook","*",["sqlite3*",new c.xWrap.FuncPtrAdapter({name:"sqlite3_update_hook",signature:"v(iippj)",contextKey:E=>E[0],callProxy:E=>(T,F,J,K,D)=>{E(T,F,c.cstrToJs(J),c.cstrToJs(K),D)}}),"*"]],["sqlite3_uri_int64","i64",["sqlite3_filename","string","i64"]],["sqlite3_value_int64","i64","sqlite3_value*"]],c.bigIntEnabled&&c.exports.sqlite3_declare_vtab&&c.bindingSignatures.int64.push(["sqlite3_create_module","int",["sqlite3*","string","sqlite3_module*","*"]],["sqlite3_create_module_v2","int",["sqlite3*","string","sqlite3_module*","*","*"]],["sqlite3_declare_vtab","int",["sqlite3*","string:flexible"]],["sqlite3_drop_modules","int",["sqlite3*","**"]],["sqlite3_vtab_collation","string","sqlite3_index_info*","int"],["sqlite3_vtab_distinct","int","sqlite3_index_info*"],["sqlite3_vtab_in","int","sqlite3_index_info*","int","int"],["sqlite3_vtab_in_first","int","sqlite3_value*","**"],["sqlite3_vtab_in_next","int","sqlite3_value*","**"],["sqlite3_vtab_nochange","int","sqlite3_context*"],["sqlite3_vtab_on_conflict","int","sqlite3*"],["sqlite3_vtab_rhs_value","int","sqlite3_index_info*","int","**"]),c.bigIntEnabled&&c.exports.sqlite3_preupdate_hook&&c.bindingSignatures.int64.push(["sqlite3_preupdate_blobwrite","int","sqlite3*"],["sqlite3_preupdate_count","int","sqlite3*"],["sqlite3_preupdate_depth","int","sqlite3*"],["sqlite3_preupdate_hook","*",["sqlite3*",new c.xWrap.FuncPtrAdapter({name:"sqlite3_preupdate_hook",signature:"v(ppippjj)",contextKey:E=>E[0],callProxy:E=>(T,F,J,K,D,te,Ne)=>{E(T,F,J,c.cstrToJs(K),c.cstrToJs(D),te,Ne)}}),"*"]],["sqlite3_preupdate_new","int",["sqlite3*","int","**"]],["sqlite3_preupdate_old","int",["sqlite3*","int","**"]]),c.bigIntEnabled&&c.exports.sqlite3changegroup_add&&c.exports.sqlite3session_create&&c.exports.sqlite3_preupdate_hook){const E={signature:"i(ps)",callProxy:T=>(F,J)=>{try{return T(F,c.cstrToJs(J))|0}catch(K){return K.resultCode||l.SQLITE_ERROR}}};c.bindingSignatures.int64.push(["sqlite3changegroup_add","int",["sqlite3_changegroup*","int","void*"]],["sqlite3changegroup_add_strm","int",["sqlite3_changegroup*",new c.xWrap.FuncPtrAdapter({name:"xInput",signature:"i(ppp)",bindScope:"transient"}),"void*"]],["sqlite3changegroup_delete",void 0,["sqlite3_changegroup*"]],["sqlite3changegroup_new","int",["**"]],["sqlite3changegroup_output","int",["sqlite3_changegroup*","int*","**"]],["sqlite3changegroup_output_strm","int",["sqlite3_changegroup*",new c.xWrap.FuncPtrAdapter({name:"xOutput",signature:"i(ppi)",bindScope:"transient"}),"void*"]],["sqlite3changeset_apply","int",["sqlite3*","int","void*",new c.xWrap.FuncPtrAdapter({name:"xFilter",bindScope:"transient",...E}),new c.xWrap.FuncPtrAdapter({name:"xConflict",signature:"i(pip)",bindScope:"transient"}),"void*"]],["sqlite3changeset_apply_strm","int",["sqlite3*",new c.xWrap.FuncPtrAdapter({name:"xInput",signature:"i(ppp)",bindScope:"transient"}),"void*",new c.xWrap.FuncPtrAdapter({name:"xFilter",bindScope:"transient",...E}),new c.xWrap.FuncPtrAdapter({name:"xConflict",signature:"i(pip)",bindScope:"transient"}),"void*"]],["sqlite3changeset_apply_v2","int",["sqlite3*","int","void*",new c.xWrap.FuncPtrAdapter({name:"xFilter",bindScope:"transient",...E}),new c.xWrap.FuncPtrAdapter({name:"xConflict",signature:"i(pip)",bindScope:"transient"}),"void*","**","int*","int"]],["sqlite3changeset_apply_v2_strm","int",["sqlite3*",new c.xWrap.FuncPtrAdapter({name:"xInput",signature:"i(ppp)",bindScope:"transient"}),"void*",new c.xWrap.FuncPtrAdapter({name:"xFilter",bindScope:"transient",...E}),new c.xWrap.FuncPtrAdapter({name:"xConflict",signature:"i(pip)",bindScope:"transient"}),"void*","**","int*","int"]],["sqlite3changeset_concat","int",["int","void*","int","void*","int*","**"]],["sqlite3changeset_concat_strm","int",[new c.xWrap.FuncPtrAdapter({name:"xInputA",signature:"i(ppp)",bindScope:"transient"}),"void*",new c.xWrap.FuncPtrAdapter({name:"xInputB",signature:"i(ppp)",bindScope:"transient"}),"void*",new c.xWrap.FuncPtrAdapter({name:"xOutput",signature:"i(ppi)",bindScope:"transient"}),"void*"]],["sqlite3changeset_conflict","int",["sqlite3_changeset_iter*","int","**"]],["sqlite3changeset_finalize","int",["sqlite3_changeset_iter*"]],["sqlite3changeset_fk_conflicts","int",["sqlite3_changeset_iter*","int*"]],["sqlite3changeset_invert","int",["int","void*","int*","**"]],["sqlite3changeset_invert_strm","int",[new c.xWrap.FuncPtrAdapter({name:"xInput",signature:"i(ppp)",bindScope:"transient"}),"void*",new c.xWrap.FuncPtrAdapter({name:"xOutput",signature:"i(ppi)",bindScope:"transient"}),"void*"]],["sqlite3changeset_new","int",["sqlite3_changeset_iter*","int","**"]],["sqlite3changeset_next","int",["sqlite3_changeset_iter*"]],["sqlite3changeset_old","int",["sqlite3_changeset_iter*","int","**"]],["sqlite3changeset_op","int",["sqlite3_changeset_iter*","**","int*","int*","int*"]],["sqlite3changeset_pk","int",["sqlite3_changeset_iter*","**","int*"]],["sqlite3changeset_start","int",["**","int","*"]],["sqlite3changeset_start_strm","int",["**",new c.xWrap.FuncPtrAdapter({name:"xInput",signature:"i(ppp)",bindScope:"transient"}),"void*"]],["sqlite3changeset_start_v2","int",["**","int","*","int"]],["sqlite3changeset_start_v2_strm","int",["**",new c.xWrap.FuncPtrAdapter({name:"xInput",signature:"i(ppp)",bindScope:"transient"}),"void*","int"]],["sqlite3session_attach","int",["sqlite3_session*","string"]],["sqlite3session_changeset","int",["sqlite3_session*","int*","**"]],["sqlite3session_changeset_size","i64",["sqlite3_session*"]],["sqlite3session_changeset_strm","int",["sqlite3_session*",new c.xWrap.FuncPtrAdapter({name:"xOutput",signature:"i(ppp)",bindScope:"transient"}),"void*"]],["sqlite3session_config","int",["int","void*"]],["sqlite3session_create","int",["sqlite3*","string","**"]],["sqlite3session_diff","int",["sqlite3_session*","string","string","**"]],["sqlite3session_enable","int",["sqlite3_session*","int"]],["sqlite3session_indirect","int",["sqlite3_session*","int"]],["sqlite3session_isempty","int",["sqlite3_session*"]],["sqlite3session_memory_used","i64",["sqlite3_session*"]],["sqlite3session_object_config","int",["sqlite3_session*","int","void*"]],["sqlite3session_patchset","int",["sqlite3_session*","*","**"]],["sqlite3session_patchset_strm","int",["sqlite3_session*",new c.xWrap.FuncPtrAdapter({name:"xOutput",signature:"i(ppp)",bindScope:"transient"}),"void*"]],["sqlite3session_table_filter",void 0,["sqlite3_session*",new c.xWrap.FuncPtrAdapter({name:"xFilter",...E,contextKey:(T,F)=>T[0]}),"*"]])}c.bindingSignatures.wasmInternal=[["sqlite3__wasm_db_reset","int","sqlite3*"],["sqlite3__wasm_db_vfs","sqlite3_vfs*","sqlite3*","string"],["sqlite3__wasm_vfs_create_file","int","sqlite3_vfs*","string","*","int"],["sqlite3__wasm_posix_create_file","int","string","*","int"],["sqlite3__wasm_vfs_unlink","int","sqlite3_vfs*","string"],["sqlite3__wasm_qfmt_token","string:dealloc","string","int"]],o.StructBinder=globalThis.Jaccwabyt({heap:c.heap8u,alloc:c.alloc,dealloc:c.dealloc,bigIntEnabled:c.bigIntEnabled,memberPrefix:"$"}),delete globalThis.Jaccwabyt;{const E=c.xWrap.argAdapter("string");c.xWrap.argAdapter("string:flexible",D=>E(h.flexibleString(D))),c.xWrap.argAdapter("string:static",(function(D){return c.isPtr(D)?D:(D=""+D,this[D]||(this[D]=c.allocCString(D)))}).bind(Object.create(null)));const T=c.xWrap.argAdapter("*"),F=function(){};c.xWrap.argAdapter("sqlite3_filename",T)("sqlite3_context*",T)("sqlite3_value*",T)("void*",T)("sqlite3_changegroup*",T)("sqlite3_changeset_iter*",T)("sqlite3_session*",T)("sqlite3_stmt*",D=>T(D instanceof(o?.oo1?.Stmt||F)?D.pointer:D))("sqlite3*",D=>T(D instanceof(o?.oo1?.DB||F)?D.pointer:D))("sqlite3_vfs*",D=>typeof D=="string"?l.sqlite3_vfs_find(D)||o.SQLite3Error.toss(l.SQLITE_NOTFOUND,"Unknown sqlite3_vfs name:",D):T(D instanceof(l.sqlite3_vfs||F)?D.pointer:D)),c.exports.sqlite3_declare_vtab&&c.xWrap.argAdapter("sqlite3_index_info*",D=>T(D instanceof(l.sqlite3_index_info||F)?D.pointer:D))("sqlite3_module*",D=>T(D instanceof(l.sqlite3_module||F)?D.pointer:D));const J=c.xWrap.resultAdapter("*");c.xWrap.resultAdapter("sqlite3*",J)("sqlite3_context*",J)("sqlite3_stmt*",J)("sqlite3_value*",J)("sqlite3_vfs*",J)("void*",J),c.exports.sqlite3_step.length===0&&(c.xWrap.doArgcCheck=!1,o.config.warn("Disabling sqlite3.wasm.xWrap.doArgcCheck due to environmental quirks."));for(const D of c.bindingSignatures)l[D[0]]=c.xWrap.apply(null,D);for(const D of c.bindingSignatures.wasmInternal)h[D[0]]=c.xWrap.apply(null,D);const K=function(D){return()=>u(D+"() is unavailable due to lack","of BigInt support in this build.")};for(const D of c.bindingSignatures.int64)l[D[0]]=c.bigIntEnabled?c.xWrap.apply(null,D):K(D[0]);if(delete c.bindingSignatures,c.exports.sqlite3__wasm_db_error){const D=c.xWrap("sqlite3__wasm_db_error","int","sqlite3*","int","string");h.sqlite3__wasm_db_error=function(te,Ne,y){return Ne instanceof o.WasmAllocError?(Ne=l.SQLITE_NOMEM,y=0):Ne instanceof Error&&(y=y||""+Ne,Ne=Ne.resultCode||l.SQLITE_ERROR),te?D(te,Ne,y):Ne}}else h.sqlite3__wasm_db_error=function(D,te,Ne){return console.warn("sqlite3__wasm_db_error() is not exported.",arguments),te}}{const E=c.xCall("sqlite3__wasm_enum_json");E||u("Maintenance required: increase sqlite3__wasm_enum_json()'s","static buffer size!"),c.ctype=JSON.parse(c.cstrToJs(E));const T=["access","authorizer","blobFinalizers","changeset","config","dataTypes","dbConfig","dbStatus","encodings","fcntl","flock","ioCap","limits","openFlags","prepareFlags","resultCodes","sqlite3Status","stmtStatus","syncFlags","trace","txnState","udfFlags","version"];c.bigIntEnabled&&T.push("serialize","session","vtab");for(const K of T)for(const D of Object.entries(c.ctype[K]))l[D[0]]=D[1];c.functionEntry(l.SQLITE_WASM_DEALLOC)||u("Internal error: cannot resolve exported function","entry SQLITE_WASM_DEALLOC (=="+l.SQLITE_WASM_DEALLOC+").");const F=Object.create(null);for(const K of["resultCodes"])for(const D of Object.entries(c.ctype[K]))F[D[1]]=D[0];l.sqlite3_js_rc_str=K=>F[K];const J=Object.assign(Object.create(null),{WasmTestStruct:!0,sqlite3_kvvfs_methods:!h.isUIThread(),sqlite3_index_info:!c.bigIntEnabled,sqlite3_index_constraint:!c.bigIntEnabled,sqlite3_index_orderby:!c.bigIntEnabled,sqlite3_index_constraint_usage:!c.bigIntEnabled});for(const K of c.ctype.structs)J[K.name]||(l[K.name]=o.StructBinder(K));if(l.sqlite3_index_info){for(const K of["sqlite3_index_constraint","sqlite3_index_orderby","sqlite3_index_constraint_usage"])l.sqlite3_index_info[K]=l[K],delete l[K];l.sqlite3_vtab_config=c.xWrap("sqlite3__wasm_vtab_config","int",["sqlite3*","int","int"])}}const A=(E,T,F)=>h.sqlite3__wasm_db_error(E,l.SQLITE_MISUSE,T+"() requires "+F+" argument"+(F===1?"":"s")+"."),O=E=>h.sqlite3__wasm_db_error(E,l.SQLITE_FORMAT,"SQLITE_UTF8 is the only supported encoding."),Z=E=>c.xWrap.argAdapter("sqlite3*")(E),ee=E=>c.isPtr(E)?c.cstrToJs(E):E,fe=(function(E,T){E=Z(E);let F=this.dbMap.get(E);if(T)!F&&T>0&&this.dbMap.set(E,F=Object.create(null));else return this.dbMap.delete(E),F;return F}).bind(Object.assign(Object.create(null),{dbMap:new Map}));fe.addCollation=function(E,T){const F=fe(E,1);F.collation||(F.collation=new Set),F.collation.add(ee(T).toLowerCase())},fe._addUDF=function(E,T,F,J){T=ee(T).toLowerCase();let K=J.get(T);K||J.set(T,K=new Set),K.add(F<0?-1:F)},fe.addFunction=function(E,T,F){const J=fe(E,1);J.udf||(J.udf=new Map),this._addUDF(E,T,F,J.udf)},c.exports.sqlite3_create_window_function&&(fe.addWindowFunc=function(E,T,F){const J=fe(E,1);J.wudf||(J.wudf=new Map),this._addUDF(E,T,F,J.wudf)}),fe.cleanup=function(E){E=Z(E);const T=[E];for(const K of["sqlite3_busy_handler","sqlite3_commit_hook","sqlite3_preupdate_hook","sqlite3_progress_handler","sqlite3_rollback_hook","sqlite3_set_authorizer","sqlite3_trace_v2","sqlite3_update_hook"]){const D=c.exports[K];if(D){T.length=D.length;try{l[K](...T)}catch(te){o.config.warn("close-time call of",K+"(",T,") threw:",te)}}}const F=fe(E,0);if(!F)return;if(F.collation){for(const K of F.collation)try{l.sqlite3_create_collation_v2(E,K,l.SQLITE_UTF8,0,0,0)}catch{}delete F.collation}let J;for(J=0;J<2;++J){const K=J?F.wudf:F.udf;if(!K)continue;const D=J?l.sqlite3_create_window_function:l.sqlite3_create_function_v2;for(const te of K){const Ne=te[0],y=te[1],q=[E,Ne,0,l.SQLITE_UTF8,0,0,0,0,0];J&&q.push(0);for(const L of y)try{q[2]=L,D.apply(null,q)}catch{}y.clear()}K.clear()}delete F.udf,delete F.wudf};{const E=c.xWrap("sqlite3_close_v2","int","sqlite3*");l.sqlite3_close_v2=function(T){if(arguments.length!==1)return A(T,"sqlite3_close_v2",1);if(T)try{fe.cleanup(T)}catch{}return E(T)}}if(l.sqlite3session_create){const E=c.xWrap("sqlite3session_delete",void 0,["sqlite3_session*"]);l.sqlite3session_delete=function(T){if(arguments.length!==1)return A(pDb,"sqlite3session_delete",1);T&&l.sqlite3session_table_filter(T,0,0),E(T)}}{const E=(F,J)=>"argv["+J+"]:"+F[0]+":"+c.cstrToJs(F[1]).toLowerCase(),T=c.xWrap("sqlite3_create_collation_v2","int",["sqlite3*","string","int","*",new c.xWrap.FuncPtrAdapter({name:"xCompare",signature:"i(pipip)",contextKey:E}),new c.xWrap.FuncPtrAdapter({name:"xDestroy",signature:"v(p)",contextKey:E})]);l.sqlite3_create_collation_v2=function(F,J,K,D,te,Ne){if(arguments.length!==6)return A(F,"sqlite3_create_collation_v2",6);if((K&15)===0)K|=l.SQLITE_UTF8;else if(l.SQLITE_UTF8!==(K&15))return O(F);try{const y=T(F,J,K,D,te,Ne);return y===0&&te instanceof Function&&fe.addCollation(F,J),y}catch(y){return h.sqlite3__wasm_db_error(F,y)}},l.sqlite3_create_collation=(F,J,K,D,te)=>arguments.length===5?l.sqlite3_create_collation_v2(F,J,K,D,te,0):A(F,"sqlite3_create_collation",5)}{const E=function(K,D){return K[0]+":"+(K[2]<0?-1:K[2])+":"+D+":"+c.cstrToJs(K[1]).toLowerCase()},T=Object.assign(Object.create(null),{xInverseAndStep:{signature:"v(pip)",contextKey:E,callProxy:K=>(D,te,Ne)=>{try{K(D,...l.sqlite3_values_to_js(te,Ne))}catch(y){l.sqlite3_result_error_js(D,y)}}},xFinalAndValue:{signature:"v(p)",contextKey:E,callProxy:K=>D=>{try{l.sqlite3_result_js(D,K(D))}catch(te){l.sqlite3_result_error_js(D,te)}}},xFunc:{signature:"v(pip)",contextKey:E,callProxy:K=>(D,te,Ne)=>{try{l.sqlite3_result_js(D,K(D,...l.sqlite3_values_to_js(te,Ne)))}catch(y){l.sqlite3_result_error_js(D,y)}}},xDestroy:{signature:"v(p)",contextKey:E,callProxy:K=>D=>{try{K(D)}catch(te){console.error("UDF xDestroy method threw:",te)}}}}),F=c.xWrap("sqlite3_create_function_v2","int",["sqlite3*","string","int","int","*",new c.xWrap.FuncPtrAdapter({name:"xFunc",...T.xFunc}),new c.xWrap.FuncPtrAdapter({name:"xStep",...T.xInverseAndStep}),new c.xWrap.FuncPtrAdapter({name:"xFinal",...T.xFinalAndValue}),new c.xWrap.FuncPtrAdapter({name:"xDestroy",...T.xDestroy})]),J=c.exports.sqlite3_create_window_function?c.xWrap("sqlite3_create_window_function","int",["sqlite3*","string","int","int","*",new c.xWrap.FuncPtrAdapter({name:"xStep",...T.xInverseAndStep}),new c.xWrap.FuncPtrAdapter({name:"xFinal",...T.xFinalAndValue}),new c.xWrap.FuncPtrAdapter({name:"xValue",...T.xFinalAndValue}),new c.xWrap.FuncPtrAdapter({name:"xInverse",...T.xInverseAndStep}),new c.xWrap.FuncPtrAdapter({name:"xDestroy",...T.xDestroy})]):void 0;l.sqlite3_create_function_v2=function K(D,te,Ne,y,q,L,le,X,ce){if(K.length!==arguments.length)return A(D,"sqlite3_create_function_v2",K.length);if((y&15)===0)y|=l.SQLITE_UTF8;else if(l.SQLITE_UTF8!==(y&15))return O(D);try{const f=F(D,te,Ne,y,q,L,le,X,ce);return f===0&&(L instanceof Function||le instanceof Function||X instanceof Function||ce instanceof Function)&&fe.addFunction(D,te,Ne),f}catch(f){return console.error("sqlite3_create_function_v2() setup threw:",f),h.sqlite3__wasm_db_error(D,f,"Creation of UDF threw: "+f)}},l.sqlite3_create_function=function K(D,te,Ne,y,q,L,le,X){return K.length===arguments.length?l.sqlite3_create_function_v2(D,te,Ne,y,q,L,le,X,0):A(D,"sqlite3_create_function",K.length)},J?l.sqlite3_create_window_function=function K(D,te,Ne,y,q,L,le,X,ce,f){if(K.length!==arguments.length)return A(D,"sqlite3_create_window_function",K.length);if((y&15)===0)y|=l.SQLITE_UTF8;else if(l.SQLITE_UTF8!==(y&15))return O(D);try{const _=J(D,te,Ne,y,q,L,le,X,ce,f);return _===0&&(L instanceof Function||le instanceof Function||X instanceof Function||ce instanceof Function||f instanceof Function)&&fe.addWindowFunc(D,te,Ne),_}catch(_){return console.error("sqlite3_create_window_function() setup threw:",_),h.sqlite3__wasm_db_error(D,_,"Creation of UDF threw: "+_)}}:delete l.sqlite3_create_window_function,l.sqlite3_create_function_v2.udfSetResult=l.sqlite3_create_function.udfSetResult=l.sqlite3_result_js,l.sqlite3_create_window_function&&(l.sqlite3_create_window_function.udfSetResult=l.sqlite3_result_js),l.sqlite3_create_function_v2.udfConvertArgs=l.sqlite3_create_function.udfConvertArgs=l.sqlite3_values_to_js,l.sqlite3_create_window_function&&(l.sqlite3_create_window_function.udfConvertArgs=l.sqlite3_values_to_js),l.sqlite3_create_function_v2.udfSetError=l.sqlite3_create_function.udfSetError=l.sqlite3_result_error_js,l.sqlite3_create_window_function&&(l.sqlite3_create_window_function.udfSetError=l.sqlite3_result_error_js)}{const E=(F,J)=>(typeof F=="string"?J=-1:h.isSQLableTypedArray(F)?(J=F.byteLength,F=h.typedArrayToString(F instanceof ArrayBuffer?new Uint8Array(F):F)):Array.isArray(F)&&(F=F.join(""),J=-1),[F,J]),T={basic:c.xWrap("sqlite3_prepare_v3","int",["sqlite3*","string","int","int","**","**"]),full:c.xWrap("sqlite3_prepare_v3","int",["sqlite3*","*","int","int","**","**"])};l.sqlite3_prepare_v3=function F(J,K,D,te,Ne,y){if(F.length!==arguments.length)return A(J,"sqlite3_prepare_v3",F.length);const[q,L]=E(K,D);switch(typeof q){case"string":return T.basic(J,q,L,te,Ne,null);case"number":return T.full(J,q,L,te,Ne,y);default:return h.sqlite3__wasm_db_error(J,l.SQLITE_MISUSE,"Invalid SQL argument type for sqlite3_prepare_v2/v3().")}},l.sqlite3_prepare_v2=function F(J,K,D,te,Ne){return F.length===arguments.length?l.sqlite3_prepare_v3(J,K,D,0,te,Ne):A(J,"sqlite3_prepare_v2",F.length)}}{const E=c.xWrap("sqlite3_bind_text","int",["sqlite3_stmt*","int","string","int","*"]),T=c.xWrap("sqlite3_bind_blob","int",["sqlite3_stmt*","int","*","int","*"]);l.sqlite3_bind_text=function F(J,K,D,te,Ne){if(F.length!==arguments.length)return A(l.sqlite3_db_handle(J),"sqlite3_bind_text",F.length);if(c.isPtr(D)||D===null)return E(J,K,D,te,Ne);D instanceof ArrayBuffer?D=new Uint8Array(D):Array.isArray(pMem)&&(D=pMem.join(""));let y,q;try{if(h.isSQLableTypedArray(D))y=c.allocFromTypedArray(D),q=D.byteLength;else if(typeof D=="string")[y,q]=c.allocCString(D);else return h.sqlite3__wasm_db_error(l.sqlite3_db_handle(J),l.SQLITE_MISUSE,"Invalid 3rd argument type for sqlite3_bind_text().");return E(J,K,y,q,l.SQLITE_WASM_DEALLOC)}catch(L){return c.dealloc(y),h.sqlite3__wasm_db_error(l.sqlite3_db_handle(J),L)}},l.sqlite3_bind_blob=function F(J,K,D,te,Ne){if(F.length!==arguments.length)return A(l.sqlite3_db_handle(J),"sqlite3_bind_blob",F.length);if(c.isPtr(D)||D===null)return T(J,K,D,te,Ne);D instanceof ArrayBuffer?D=new Uint8Array(D):Array.isArray(D)&&(D=D.join(""));let y,q;try{if(h.isBindableTypedArray(D))y=c.allocFromTypedArray(D),q=te>=0?te:D.byteLength;else if(typeof D=="string")[y,q]=c.allocCString(D);else return h.sqlite3__wasm_db_error(l.sqlite3_db_handle(J),l.SQLITE_MISUSE,"Invalid 3rd argument type for sqlite3_bind_blob().");return T(J,K,y,q,l.SQLITE_WASM_DEALLOC)}catch(L){return c.dealloc(y),h.sqlite3__wasm_db_error(l.sqlite3_db_handle(J),L)}}}l.sqlite3_config=function(E,...T){if(arguments.length<2)return l.SQLITE_MISUSE;switch(E){case l.SQLITE_CONFIG_COVERING_INDEX_SCAN:case l.SQLITE_CONFIG_MEMSTATUS:case l.SQLITE_CONFIG_SMALL_MALLOC:case l.SQLITE_CONFIG_SORTERREF_SIZE:case l.SQLITE_CONFIG_STMTJRNL_SPILL:case l.SQLITE_CONFIG_URI:return c.exports.sqlite3__wasm_config_i(E,T[0]);case l.SQLITE_CONFIG_LOOKASIDE:return c.exports.sqlite3__wasm_config_ii(E,T[0],T[1]);case l.SQLITE_CONFIG_MEMDB_MAXSIZE:return c.exports.sqlite3__wasm_config_j(E,T[0]);case l.SQLITE_CONFIG_GETMALLOC:case l.SQLITE_CONFIG_GETMUTEX:case l.SQLITE_CONFIG_GETPCACHE2:case l.SQLITE_CONFIG_GETPCACHE:case l.SQLITE_CONFIG_HEAP:case l.SQLITE_CONFIG_LOG:case l.SQLITE_CONFIG_MALLOC:case l.SQLITE_CONFIG_MMAP_SIZE:case l.SQLITE_CONFIG_MULTITHREAD:case l.SQLITE_CONFIG_MUTEX:case l.SQLITE_CONFIG_PAGECACHE:case l.SQLITE_CONFIG_PCACHE2:case l.SQLITE_CONFIG_PCACHE:case l.SQLITE_CONFIG_PCACHE_HDRSZ:case l.SQLITE_CONFIG_PMASZ:case l.SQLITE_CONFIG_SERIALIZED:case l.SQLITE_CONFIG_SINGLETHREAD:case l.SQLITE_CONFIG_SQLLOG:case l.SQLITE_CONFIG_WIN32_HEAPSIZE:default:return l.SQLITE_NOTFOUND}};{const E=new Set;l.sqlite3_auto_extension=function(T){if(T instanceof Function)T=c.installFunction("i(ppp)",T);else if(arguments.length!==1||!c.isPtr(T))return l.SQLITE_MISUSE;const F=c.exports.sqlite3_auto_extension(T);return T!==arguments[0]&&(F===0?E.add(T):c.uninstallFunction(T)),F},l.sqlite3_cancel_auto_extension=function(T){return!T||arguments.length!==1||!c.isPtr(T)?0:c.exports.sqlite3_cancel_auto_extension(T)},l.sqlite3_reset_auto_extension=function(){c.exports.sqlite3_reset_auto_extension();for(const T of E)c.uninstallFunction(T);E.clear()}}const _e=l.sqlite3_vfs_find("kvvfs");if(_e)if(h.isUIThread()){const E=new l.sqlite3_kvvfs_methods(c.exports.sqlite3__wasm_kvvfs_methods());delete l.sqlite3_kvvfs_methods;const T=c.exports.sqlite3__wasm_kvvfsMakeKeyOnPstack,F=c.pstack,J=D=>c.peek(D)===115?sessionStorage:localStorage,K={xRead:(D,te,Ne,y)=>{const q=F.pointer,L=c.scopedAllocPush();try{const le=T(D,te);if(!le)return-3;const X=c.cstrToJs(le),ce=J(D).getItem(X);if(!ce)return-1;const f=ce.length;if(y<=0)return f;if(y===1)return c.poke(Ne,0),f;const _=c.scopedAllocCString(ce);return y>f+1&&(y=f+1),c.heap8u().copyWithin(Ne,_,_+y-1),c.poke(Ne+y-1,0),y-1}catch(le){return console.error("kvstorageRead()",le),-2}finally{F.restore(q),c.scopedAllocPop(L)}},xWrite:(D,te,Ne)=>{const y=F.pointer;try{const q=T(D,te);if(!q)return 1;const L=c.cstrToJs(q);return J(D).setItem(L,c.cstrToJs(Ne)),0}catch(q){return console.error("kvstorageWrite()",q),l.SQLITE_IOERR}finally{F.restore(y)}},xDelete:(D,te)=>{const Ne=F.pointer;try{const y=T(D,te);return y?(J(D).removeItem(c.cstrToJs(y)),0):1}catch(y){return console.error("kvstorageDelete()",y),l.SQLITE_IOERR}finally{F.restore(Ne)}}};for(const D of Object.keys(K))E[E.memberKey(D)]=c.installFunction(E.memberSignature(D),K[D])}else l.sqlite3_vfs_unregister(_e);c.xWrap.FuncPtrAdapter.warnOnUse=!0;const H=o.StructBinder,$=function E(T,F,J,K=E.installMethodArgcCheck){if(T instanceof H.StructType?!(J instanceof Function)&&!c.isPtr(J)&&u("Usage error: expecting a Function or WASM pointer to one."):u("Usage error: target object is-not-a StructType."),arguments.length===1)return(y,q)=>E(T,y,q,K);E.argcProxy||(E.argcProxy=function(y,q,L,le){return function(...X){return L.length!==arguments.length&&u("Argument mismatch for",y.structInfo.name+"::"+q+": Native signature is:",le),L.apply(this,X)}},E.removeFuncList=function(){this.ondispose.__removeFuncList&&(this.ondispose.__removeFuncList.forEach((y,q)=>{if(typeof y=="number")try{c.uninstallFunction(y)}catch{}}),delete this.ondispose.__removeFuncList)});const D=T.memberSignature(F);D.length<2&&u("Member",F,"does not have a function pointer signature:",D);const te=T.memberKey(F),Ne=K&&!c.isPtr(J)?E.argcProxy(T,te,J,D):J;if(c.isPtr(Ne))Ne&&!c.functionEntry(Ne)&&u("Pointer",Ne,"is not a WASM function table entry."),T[te]=Ne;else{const y=c.installFunction(Ne,T.memberSignature(F,!0));T[te]=y,(!T.ondispose||!T.ondispose.__removeFuncList)&&(T.addOnDispose("ondispose.__removeFuncList handler",E.removeFuncList),T.ondispose.__removeFuncList=[]),T.ondispose.__removeFuncList.push(te,y)}return(y,q)=>E(T,y,q,K)};$.installMethodArgcCheck=!1;const ae=function(E,T,F=$.installMethodArgcCheck){const J=new Map;for(const K of Object.keys(T)){const D=T[K],te=J.get(D);if(te){const Ne=E.memberKey(K);E[Ne]=E[E.memberKey(te)]}else $(E,K,D,F),J.set(D,K)}return E};H.StructType.prototype.installMethod=function(T,F,J=$.installMethodArgcCheck){return arguments.length<3&&T&&typeof T=="object"?ae(this,...arguments):$(this,...arguments)},H.StructType.prototype.installMethods=function(E,T=$.installMethodArgcCheck){return ae(this,E,T)}}),globalThis.sqlite3ApiBootstrap.initializers.push(function(o){o.version={libVersion:"3.50.4",libVersionNumber:3050004,sourceId:"2025-07-30 19:33:53 4d8adfb30e03f9cf27f800a2c1ba3c48fb4ca1b08b0f5ed59a4d5ecbf45e20a3",downloadVersion:3500400}}),globalThis.sqlite3ApiBootstrap.initializers.push(function(o){const u=(...f)=>{throw new o.SQLite3Error(...f)},l=o.capi,c=o.wasm,h=o.util,A=new WeakMap,O=new WeakMap,Z=(f,_,b)=>{const k=Object.getOwnPropertyDescriptor(f,_);return k?k.value:b},ee=function(f,_){return _&&(f instanceof E&&(f=f.pointer),u(_,"sqlite3 result code",_+":",f?l.sqlite3_errmsg(f):l.sqlite3_errstr(_))),arguments[0]},fe=c.installFunction("i(ippp)",(function(f,_,b,k){l.SQLITE_TRACE_STMT===f&&console.log("SQL TRACE #"+ ++this.counter+" via sqlite3@"+_+":",c.cstrToJs(k))}).bind({counter:0})),_e=Object.create(null),H=function(f){f instanceof ArrayBuffer&&(f=new Uint8Array(f));const _=[],b="0123456789abcdef";for(const k of f)_.push(b[(k&240)>>4],b[k&15]);return _.join("")},$=function(f,_){if(!l.sqlite3_key_v2)return;let b,k;const U=(_.key?1:0)+(_.hexkey?1:0)+(_.textkey?1:0);if(U)U>1&&u(l.SQLITE_MISUSE,"Only ONE of (key, hexkey, textkey) may be provided.");else return;if(_.key)if(b="key",k=_.key,typeof k=="string"&&(k=new TextEncoder("utf-8").encode(k)),k instanceof ArrayBuffer||k instanceof Uint8Array)k=H(k),b="hexkey";else{u(l.SQLITE_MISUSE,"Invalid value for the 'key' option. Expecting a string,","ArrayBuffer, or Uint8Array.");return}else if(_.textkey)b="textkey",k=_.textkey,k instanceof ArrayBuffer&&(k=new Uint8Array(k)),k instanceof Uint8Array?k=new TextDecoder("utf-8").decode(k):typeof k!="string"&&u(l.SQLITE_MISUSE,"Invalid value for the 'textkey' option. Expecting a string,","ArrayBuffer, or Uint8Array.");else if(_.hexkey)b="hexkey",k=_.hexkey,k instanceof ArrayBuffer||k instanceof Uint8Array?k=H(k):typeof k!="string"&&u(l.SQLITE_MISUSE,"Invalid value for the 'hexkey' option. Expecting a string,","ArrayBuffer, or Uint8Array.");else return;let be;try{return be=f.prepare("PRAGMA "+b+"="+h.sqlite3__wasm_qfmt_token(k,1)),be.step(),!0}finally{be&&be.finalize()}},ae=function f(..._){if(!f._name2vfs){f._name2vfs=Object.create(null);const B=typeof importScripts=="function"?re=>u("The VFS for",re,"is only available in the main window thread."):!1;f._name2vfs[":localStorage:"]={vfs:"kvvfs",filename:B||(()=>"local")},f._name2vfs[":sessionStorage:"]={vfs:"kvvfs",filename:B||(()=>"session")}}const b=f.normalizeArgs(..._);let k=b.filename,U=b.vfs,be=b.flags;(typeof k!="string"&&typeof k!="number"||typeof be!="string"||U&&typeof U!="string"&&typeof U!="number")&&(o.config.error("Invalid DB ctor args",b,arguments),u("Invalid arguments for DB constructor."));let Fe=typeof k=="number"?c.cstrToJs(k):k;const He=f._name2vfs[Fe];He&&(U=He.vfs,k=Fe=He.filename(Fe));let Ve,de=0;be.indexOf("c")>=0&&(de|=l.SQLITE_OPEN_CREATE|l.SQLITE_OPEN_READWRITE),be.indexOf("w")>=0&&(de|=l.SQLITE_OPEN_READWRITE),de===0&&(de|=l.SQLITE_OPEN_READONLY),de|=l.SQLITE_OPEN_EXRESCODE;const C=c.pstack.pointer;try{const B=c.pstack.allocPtr();let re=l.sqlite3_open_v2(k,B,de,U||0);Ve=c.peekPtr(B),ee(Ve,re),l.sqlite3_extended_result_codes(Ve,1),be.indexOf("t")>=0&&l.sqlite3_trace_v2(Ve,l.SQLITE_TRACE_STMT,fe,Ve)}catch(B){throw Ve&&l.sqlite3_close_v2(Ve),B}finally{c.pstack.restore(C)}this.filename=Fe,A.set(this,Ve),O.set(this,Object.create(null));try{$(this,b);const B=l.sqlite3_js_db_vfs(Ve)||u("Internal error: cannot get VFS for new db handle."),re=_e[B];re&&(re instanceof Function?re(this,o):ee(Ve,l.sqlite3_exec(Ve,re,0,0,0)))}catch(B){throw this.close(),B}};ae.setVfsPostOpenCallback=function(f,_){_ instanceof Function||u("dbCtorHelper.setVfsPostOpenCallback() should not be used with a non-function argument.",arguments),_e[f]=_},ae.normalizeArgs=function(f=":memory:",_="c",b=null){const k={};return arguments.length===1&&arguments[0]&&typeof arguments[0]=="object"?(Object.assign(k,arguments[0]),k.flags===void 0&&(k.flags="c"),k.vfs===void 0&&(k.vfs=null),k.filename===void 0&&(k.filename=":memory:")):(k.filename=f,k.flags=_,k.vfs=b),k};const E=function(...f){ae.apply(this,f)};E.dbCtorHelper=ae;const T={null:1,number:2,string:3,boolean:4,blob:5};T.undefined==T.null,c.bigIntEnabled&&(T.bigint=T.number);const F=function(){T!==arguments[2]&&u(l.SQLITE_MISUSE,"Do not call the Stmt constructor directly. Use DB.prepare()."),this.db=arguments[0],A.set(this,arguments[1]),this.parameterCount=l.sqlite3_bind_parameter_count(this.pointer)},J=function(f){return f.pointer||u("DB has been closed."),f},K=function(f,_){return(_!==(_|0)||_<0||_>=f.columnCount)&&u("Column index",_,"is out of range."),f},D=function(f,_){const b=Object.create(null);switch(b.opt=Object.create(null),_.length){case 1:typeof _[0]=="string"||h.isSQLableTypedArray(_[0])||Array.isArray(_[0])?b.sql=_[0]:_[0]&&typeof _[0]=="object"&&(b.opt=_[0],b.sql=b.opt.sql);break;case 2:b.sql=_[0],b.opt=_[1];break;default:u("Invalid argument count for exec().")}b.sql=h.flexibleString(b.sql),typeof b.sql!="string"&&u("Missing SQL argument or unsupported SQL value type.");const k=b.opt;switch(k.returnValue){case"resultRows":k.resultRows||(k.resultRows=[]),b.returnVal=()=>k.resultRows;break;case"saveSql":k.saveSql||(k.saveSql=[]),b.returnVal=()=>k.saveSql;break;case void 0:case"this":b.returnVal=()=>f;break;default:u("Invalid returnValue value:",k.returnValue)}if(!k.callback&&!k.returnValue&&k.rowMode!==void 0&&(k.resultRows||(k.resultRows=[]),b.returnVal=()=>k.resultRows),k.callback||k.resultRows)switch(k.rowMode===void 0?"array":k.rowMode){case"object":b.cbArg=(U,be)=>{be.columnNames||(be.columnNames=U.getColumnNames([]));const Fe=U.get([]),He=Object.create(null);for(const Ve in be.columnNames)He[be.columnNames[Ve]]=Fe[Ve];return He};break;case"array":b.cbArg=U=>U.get([]);break;case"stmt":Array.isArray(k.resultRows)&&u("exec(): invalid rowMode for a resultRows array: must","be one of 'array', 'object',","a result column number, or column name reference."),b.cbArg=U=>U;break;default:if(h.isInt32(k.rowMode)){b.cbArg=U=>U.get(k.rowMode);break}else if(typeof k.rowMode=="string"&&k.rowMode.length>1&&k.rowMode[0]==="$"){const U=k.rowMode.substr(1);b.cbArg=be=>{const Fe=be.get(Object.create(null))[U];return Fe===void 0?u(l.SQLITE_NOTFOUND,"exec(): unknown result column:",U):Fe};break}u("Invalid rowMode:",k.rowMode)}return b},te=(f,_,b,...k)=>{const U=f.prepare(_);try{const be=U.bind(b).step()?U.get(...k):void 0;return U.reset(),be}finally{U.finalize()}},Ne=(f,_,b,k)=>f.exec({sql:_,bind:b,rowMode:k,returnValue:"resultRows"});E.checkRc=(f,_)=>ee(f,_),E.prototype={isOpen:function(){return!!this.pointer},affirmOpen:function(){return J(this)},close:function(){if(this.pointer){if(this.onclose&&this.onclose.before instanceof Function)try{this.onclose.before(this)}catch{}const f=this.pointer;if(Object.keys(O.get(this)).forEach((_,b)=>{if(b&&b.pointer)try{b.finalize()}catch{}}),A.delete(this),O.delete(this),l.sqlite3_close_v2(f),this.onclose&&this.onclose.after instanceof Function)try{this.onclose.after(this)}catch{}delete this.filename}},changes:function(f=!1,_=!1){const b=J(this).pointer;return f?_?l.sqlite3_total_changes64(b):l.sqlite3_total_changes(b):_?l.sqlite3_changes64(b):l.sqlite3_changes(b)},dbFilename:function(f="main"){return l.sqlite3_db_filename(J(this).pointer,f)},dbName:function(f=0){return l.sqlite3_db_name(J(this).pointer,f)},dbVfsName:function(f=0){let _;const b=l.sqlite3_js_db_vfs(J(this).pointer,f);if(b){const k=new l.sqlite3_vfs(b);try{_=c.cstrToJs(k.$zName)}finally{k.dispose()}}return _},prepare:function(f){J(this);const _=c.pstack.pointer;let b,k;try{b=c.pstack.alloc(8),E.checkRc(this,l.sqlite3_prepare_v2(this.pointer,f,-1,b,null)),k=c.peekPtr(b)}finally{c.pstack.restore(_)}k||u("Cannot prepare empty SQL.");const U=new F(this,k,T);return O.get(this)[k]=U,U},exec:function(){J(this);const f=D(this,arguments);if(!f.sql)return u("exec() requires an SQL string.");const _=f.opt,b=_.callback,k=Array.isArray(_.resultRows)?_.resultRows:void 0;let U,be=_.bind,Fe=!!(f.cbArg||_.columnNames||k);const He=c.scopedAllocPush(),Ve=Array.isArray(_.saveSql)?_.saveSql:void 0;try{const de=h.isSQLableTypedArray(f.sql);let C=de?f.sql.byteLength:c.jstrlen(f.sql);const B=c.scopedAlloc(2*c.ptrSizeof+(C+1)),re=B+c.ptrSizeof;let me=re+c.ptrSizeof;const We=me+C;for(de?c.heap8().set(f.sql,me):c.jstrcpy(f.sql,c.heap8(),me,C,!1),c.poke(me+C,0);me&&c.peek(me,"i8");){c.pokePtr([B,re],0),E.checkRc(this,l.sqlite3_prepare_v3(this.pointer,me,C,0,B,re));const P=c.peekPtr(B);if(me=c.peekPtr(re),C=We-me,!!P){if(Ve&&Ve.push(l.sqlite3_sql(P).trim()),U=new F(this,P,T),be&&U.parameterCount&&(U.bind(be),be=null),Fe&&U.columnCount){let G=Array.isArray(_.columnNames)?0:1;if(Fe=!1,f.cbArg||k){const ie=Object.create(null);for(;U.step();U._lockedByExec=!1){G++===0&&U.getColumnNames(ie.columnNames=_.columnNames||[]),U._lockedByExec=!0;const qe=f.cbArg(U,ie);if(k&&k.push(qe),b&&b.call(_,qe,U)===!1)break}U._lockedByExec=!1}G===0&&U.getColumnNames(_.columnNames)}else U.step();U.reset().finalize(),U=null}}}finally{c.scopedAllocPop(He),U&&(delete U._lockedByExec,U.finalize())}return f.returnVal()},createFunction:function(_,b,k){const U=ie=>ie instanceof Function;switch(arguments.length){case 1:k=_,_=k.name,b=k.xFunc||0;break;case 2:U(b)||(k=b,b=k.xFunc||0);break}k||(k={}),typeof _!="string"&&u("Invalid arguments: missing function name.");let be=k.xStep||0,Fe=k.xFinal||0;const He=k.xValue||0,Ve=k.xInverse||0;let de;U(b)?(de=!1,(U(be)||U(Fe))&&u("Ambiguous arguments: scalar or aggregate?"),be=Fe=null):U(be)?(U(Fe)||u("Missing xFinal() callback for aggregate or window UDF."),b=null):U(Fe)?u("Missing xStep() callback for aggregate or window UDF."):u("Missing function-type properties."),de===!1?(U(He)||U(Ve))&&u("xValue and xInverse are not permitted for non-window UDFs."):U(He)?(U(Ve)||u("xInverse must be provided if xValue is."),de=!0):U(Ve)&&u("xValue must be provided if xInverse is.");const C=k.pApp;C!=null&&(typeof C!="number"||!h.isInt32(C))&&u("Invalid value for pApp property. Must be a legal WASM pointer value.");const B=k.xDestroy||0;B&&!U(B)&&u("xDestroy property must be a function.");let re=0;Z(k,"deterministic")&&(re|=l.SQLITE_DETERMINISTIC),Z(k,"directOnly")&&(re|=l.SQLITE_DIRECTONLY),Z(k,"innocuous")&&(re|=l.SQLITE_INNOCUOUS),_=_.toLowerCase();const me=b||be,We=Z(k,"arity"),P=typeof We=="number"?We:me.length?me.length-1:0;let G;return de?G=l.sqlite3_create_window_function(this.pointer,_,P,l.SQLITE_UTF8|re,C||0,be,Fe,He,Ve,B):G=l.sqlite3_create_function_v2(this.pointer,_,P,l.SQLITE_UTF8|re,C||0,b,be,Fe,B),E.checkRc(this,G),this},selectValue:function(f,_,b){return te(this,f,_,0,b)},selectValues:function(f,_,b){const k=this.prepare(f),U=[];try{for(k.bind(_);k.step();)U.push(k.get(0,b));k.reset()}finally{k.finalize()}return U},selectArray:function(f,_){return te(this,f,_,[])},selectObject:function(f,_){return te(this,f,_,{})},selectArrays:function(f,_){return Ne(this,f,_,"array")},selectObjects:function(f,_){return Ne(this,f,_,"object")},openStatementCount:function(){return this.pointer?Object.keys(O.get(this)).length:0},transaction:function(f){let _="BEGIN";arguments.length>1&&(/[^a-zA-Z]/.test(arguments[0])&&u(l.SQLITE_MISUSE,"Invalid argument for BEGIN qualifier."),_+=" "+arguments[0],f=arguments[1]),J(this).exec(_);try{const b=f(this);return this.exec("COMMIT"),b}catch(b){throw this.exec("ROLLBACK"),b}},savepoint:function(f){J(this).exec("SAVEPOINT oo1");try{const _=f(this);return this.exec("RELEASE oo1"),_}catch(_){throw this.exec("ROLLBACK to SAVEPOINT oo1; RELEASE SAVEPOINT oo1"),_}},checkRc:function(f){return ee(this,f)}};const y=function(f){return f.pointer||u("Stmt has been closed."),f},q=function(f){let _=T[f==null?"null":typeof f];switch(_){case T.boolean:case T.null:case T.number:case T.string:return _;case T.bigint:if(c.bigIntEnabled)return _;default:return h.isBindableTypedArray(f)?T.blob:void 0}},L=function(f){return q(f)||u("Unsupported bind() argument type:",typeof f)},le=function(f,_){const b=typeof _=="number"?_:l.sqlite3_bind_parameter_index(f.pointer,_);return b===0||!h.isInt32(b)?u("Invalid bind() parameter name: "+_):(b<1||b>f.parameterCount)&&u("Bind index",_,"is out of range."),b},X=function(f,_){return f._lockedByExec&&u("Operation is illegal when statement is locked:",_),f},ce=function f(_,b,k,U){X(y(_),"bind()"),f._||(f._tooBigInt=Fe=>u("BigInt value is too big to store without precision loss:",Fe),f._={string:function(Fe,He,Ve,de){const[C,B]=c.allocCString(Ve,!0);return(de?l.sqlite3_bind_blob:l.sqlite3_bind_text)(Fe.pointer,He,C,B,l.SQLITE_WASM_DEALLOC)}}),L(U),b=le(_,b);let be=0;switch(U==null?T.null:k){case T.null:be=l.sqlite3_bind_null(_.pointer,b);break;case T.string:be=f._.string(_,b,U,!1);break;case T.number:{let Fe;h.isInt32(U)?Fe=l.sqlite3_bind_int:typeof U=="bigint"?h.bigIntFits64(U)?c.bigIntEnabled?Fe=l.sqlite3_bind_int64:h.bigIntFitsDouble(U)?(U=Number(U),Fe=l.sqlite3_bind_double):f._tooBigInt(U):f._tooBigInt(U):(U=Number(U),c.bigIntEnabled&&Number.isInteger(U)?Fe=l.sqlite3_bind_int64:Fe=l.sqlite3_bind_double),be=Fe(_.pointer,b,U);break}case T.boolean:be=l.sqlite3_bind_int(_.pointer,b,U?1:0);break;case T.blob:{if(typeof U=="string"){be=f._.string(_,b,U,!0);break}else U instanceof ArrayBuffer?U=new Uint8Array(U):h.isBindableTypedArray(U)||u("Binding a value as a blob requires","that it be a string, Uint8Array, Int8Array, or ArrayBuffer.");const Fe=c.alloc(U.byteLength||1);c.heap8().set(U.byteLength?U:[0],Fe),be=l.sqlite3_bind_blob(_.pointer,b,Fe,U.byteLength,l.SQLITE_WASM_DEALLOC);break}default:o.config.warn("Unsupported bind() argument type:",U),u("Unsupported bind() argument type: "+typeof U)}return be&&E.checkRc(_.db.pointer,be),_._mayGet=!1,_};F.prototype={finalize:function(){if(this.pointer){X(this,"finalize()");const f=l.sqlite3_finalize(this.pointer);return delete O.get(this.db)[this.pointer],A.delete(this),delete this._mayGet,delete this.parameterCount,delete this._lockedByExec,delete this.db,f}},clearBindings:function(){return X(y(this),"clearBindings()"),l.sqlite3_clear_bindings(this.pointer),this._mayGet=!1,this},reset:function(f){X(this,"reset()"),f&&this.clearBindings();const _=l.sqlite3_reset(y(this).pointer);return this._mayGet=!1,ee(this.db,_),this},bind:function(){y(this);let f,_;switch(arguments.length){case 1:f=1,_=arguments[0];break;case 2:f=arguments[0],_=arguments[1];break;default:u("Invalid bind() arguments.")}return _===void 0?this:(this.parameterCount||u("This statement has no bindable parameters."),this._mayGet=!1,_===null?ce(this,f,T.null,_):Array.isArray(_)?(arguments.length!==1&&u("When binding an array, an index argument is not permitted."),_.forEach((b,k)=>ce(this,k+1,L(b),b)),this):(_ instanceof ArrayBuffer&&(_=new Uint8Array(_)),typeof _=="object"&&!h.isBindableTypedArray(_)?(arguments.length!==1&&u("When binding an object, an index argument is not permitted."),Object.keys(_).forEach(b=>ce(this,b,L(_[b]),_[b])),this):ce(this,f,L(_),_)))},bindAsBlob:function(f,_){y(this),arguments.length===1&&(_=f,f=1);const b=L(_);return T.string!==b&&T.blob!==b&&T.null!==b&&u("Invalid value type for bindAsBlob()"),ce(this,f,T.blob,_)},step:function(){X(this,"step()");const f=l.sqlite3_step(y(this).pointer);switch(f){case l.SQLITE_DONE:return this._mayGet=!1;case l.SQLITE_ROW:return this._mayGet=!0;default:this._mayGet=!1,o.config.warn("sqlite3_step() rc=",f,l.sqlite3_js_rc_str(f),"SQL =",l.sqlite3_sql(this.pointer)),E.checkRc(this.db.pointer,f)}},stepReset:function(){return this.step(),this.reset()},stepFinalize:function(){try{const f=this.step();return this.reset(),f}finally{try{this.finalize()}catch{}}},get:function(f,_){if(y(this)._mayGet||u("Stmt.step() has not (recently) returned true."),Array.isArray(f)){let b=0;const k=this.columnCount;for(;b<k;)f[b]=this.get(b++);return f}else if(f&&typeof f=="object"){let b=0;const k=this.columnCount;for(;b<k;)f[l.sqlite3_column_name(this.pointer,b)]=this.get(b++);return f}switch(K(this,f),_===void 0?l.sqlite3_column_type(this.pointer,f):_){case l.SQLITE_NULL:return null;case l.SQLITE_INTEGER:if(c.bigIntEnabled){const b=l.sqlite3_column_int64(this.pointer,f);return b>=Number.MIN_SAFE_INTEGER&&b<=Number.MAX_SAFE_INTEGER?Number(b).valueOf():b}else{const b=l.sqlite3_column_double(this.pointer,f);return(b>Number.MAX_SAFE_INTEGER||b<Number.MIN_SAFE_INTEGER)&&u("Integer is out of range for JS integer range: "+b),h.isInt32(b)?b|0:b}case l.SQLITE_FLOAT:return l.sqlite3_column_double(this.pointer,f);case l.SQLITE_TEXT:return l.sqlite3_column_text(this.pointer,f);case l.SQLITE_BLOB:{const b=l.sqlite3_column_bytes(this.pointer,f),k=l.sqlite3_column_blob(this.pointer,f),U=new Uint8Array(b);return b&&U.set(c.heap8u().slice(k,k+b),0),b&&this.db._blobXfer instanceof Array&&this.db._blobXfer.push(U.buffer),U}default:u("Don't know how to translate","type of result column #"+f+".")}u("Not reached.")},getInt:function(f){return this.get(f,l.SQLITE_INTEGER)},getFloat:function(f){return this.get(f,l.SQLITE_FLOAT)},getString:function(f){return this.get(f,l.SQLITE_TEXT)},getBlob:function(f){return this.get(f,l.SQLITE_BLOB)},getJSON:function(f){const _=this.get(f,l.SQLITE_STRING);return _===null?_:JSON.parse(_)},getColumnName:function(f){return l.sqlite3_column_name(K(y(this),f).pointer,f)},getColumnNames:function(f=[]){K(y(this),0);const _=this.columnCount;for(let b=0;b<_;++b)f.push(l.sqlite3_column_name(this.pointer,b));return f},getParamIndex:function(f){return y(this).parameterCount?l.sqlite3_bind_parameter_index(this.pointer,f):void 0},getParamName:function(f){return y(this).parameterCount?l.sqlite3_bind_parameter_name(this.pointer,f):void 0},isBusy:function(){return l.sqlite3_stmt_busy(y(this))!==0},isReadOnly:function(){return l.sqlite3_stmt_readonly(y(this))!==0}};{const f={enumerable:!0,get:function(){return A.get(this)},set:()=>u("The pointer property is read-only.")};Object.defineProperty(F.prototype,"pointer",f),Object.defineProperty(E.prototype,"pointer",f)}if(Object.defineProperty(F.prototype,"columnCount",{enumerable:!1,get:function(){return l.sqlite3_column_count(this.pointer)},set:()=>u("The columnCount property is read-only.")}),o.oo1={DB:E,Stmt:F},h.isUIThread()){o.oo1.JsStorageDb=function(_="session"){const b=ae.normalizeArgs(...arguments);_=b.filename,_!=="session"&&_!=="local"&&u("JsStorageDb db name must be one of 'session' or 'local'."),b.vfs="kvvfs",ae.call(this,b)};const f=o.oo1.JsStorageDb;f.prototype=Object.create(E.prototype),f.clearStorage=l.sqlite3_js_kvvfs_clear,f.prototype.clearStorage=function(){return f.clearStorage(J(this).filename)},f.storageSize=l.sqlite3_js_kvvfs_size,f.prototype.storageSize=function(){return f.storageSize(J(this).filename)}}}),globalThis.sqlite3ApiBootstrap.initializers.push(function(o){const u=o.util;o.initWorker1API=(function(){const l=(...H)=>{throw new Error(H.join(" "))};globalThis.WorkerGlobalScope instanceof Function||l("initWorker1API() must be run from a Worker thread.");const c=this.sqlite3||l("Missing this.sqlite3 object."),h=c.oo1.DB,A=function(H){let $=O.idMap.get(H);return $||($="db#"+ ++O.idSeq+"@"+H.pointer,O.idMap.set(H,$),$)},O={dbList:[],idSeq:0,idMap:new WeakMap,xfer:[],open:function(H){const $=new h(H);return this.dbs[A($)]=$,this.dbList.indexOf($)<0&&this.dbList.push($),$},close:function(H,$){if(H){delete this.dbs[A(H)];const ae=H.filename,E=u.sqlite3__wasm_db_vfs(H.pointer,0);H.close();const T=this.dbList.indexOf(H);T>=0&&this.dbList.splice(T,1),$&&ae&&E&&u.sqlite3__wasm_vfs_unlink(E,ae)}},post:function(H,$){$&&$.length?(globalThis.postMessage(H,Array.from($)),$.length=0):globalThis.postMessage(H)},dbs:Object.create(null),getDb:function(H,$=!0){return this.dbs[H]||($?l("Unknown (or closed) DB ID:",H):void 0)}},Z=function(H=O.dbList[0]){return H&&H.pointer?H:l("DB is not opened.")},ee=function(H,$=!0){const ae=O.getDb(H.dbId,!1)||O.dbList[0];return $?Z(ae):ae},fe=function(){return O.dbList[0]&&A(O.dbList[0])},_e={open:function(H){const $=Object.create(null),ae=H.args||Object.create(null);ae.simulateError&&l("Throwing because of simulateError flag.");const E=Object.create(null);$.vfs=ae.vfs,$.filename=ae.filename||"";const T=O.open($);return E.filename=T.filename,E.persistent=!!c.capi.sqlite3_js_db_uses_vfs(T.pointer,"opfs"),E.dbId=A(T),E.vfs=T.dbVfsName(),E},close:function(H){const $=ee(H,!1),ae={filename:$&&$.filename};if($){const E=H.args&&typeof H.args=="object"?!!H.args.unlink:!1;O.close($,E)}return ae},exec:function(H){const $=typeof H.args=="string"?{sql:H.args}:H.args||Object.create(null);$.rowMode==="stmt"?l("Invalid rowMode for 'exec': stmt mode","does not work in the Worker API."):$.sql||l("'exec' requires input SQL.");const ae=ee(H);($.callback||Array.isArray($.resultRows))&&(ae._blobXfer=O.xfer);const E=$.callback;let T=0;const F=!!$.columnNames;typeof E=="string"&&(F||($.columnNames=[]),$.callback=function(J,K){O.post({type:E,columnNames:$.columnNames,rowNumber:++T,row:J},O.xfer)});try{const J=$.countChanges?ae.changes(!0,$.countChanges===64):void 0;ae.exec($),J!==void 0&&($.changeCount=ae.changes(!0,$.countChanges===64)-J);const K=$.lastInsertRowId?c.capi.sqlite3_last_insert_rowid(ae):void 0;K!==void 0&&($.lastInsertRowId=K),$.callback instanceof Function&&($.callback=E,O.post({type:E,columnNames:$.columnNames,rowNumber:null,row:void 0}))}finally{delete ae._blobXfer,$.callback&&($.callback=E)}return $},"config-get":function(){const H=Object.create(null),$=c.config;return["bigIntEnabled"].forEach(function(ae){Object.getOwnPropertyDescriptor($,ae)&&(H[ae]=$[ae])}),H.version=c.version,H.vfsList=c.capi.sqlite3_js_vfs_list(),H},export:function(H){const $=ee(H),ae={byteArray:c.capi.sqlite3_js_db_export($.pointer),filename:$.filename,mimetype:"application/x-sqlite3"};return O.xfer.push(ae.byteArray.buffer),ae},toss:function(H){l("Testing worker exception")}};globalThis.onmessage=async function(H){H=H.data;let $,ae=H.dbId,E=H.type;const T=performance.now();try{_e.hasOwnProperty(E)&&_e[E]instanceof Function?$=await _e[E](H):l("Unknown db worker message type:",H.type)}catch(F){E="error",$={operation:H.type,message:F.message,errorClass:F.name,input:H},F.stack&&($.stack=typeof F.stack=="string"?F.stack.split(/\n\s*/):F.stack)}ae||(ae=$.dbId||fe()),O.post({type:E,dbId:ae,messageId:H.messageId,workerReceivedTime:T,workerRespondTime:performance.now(),departureTime:H.departureTime,result:$},O.xfer)},globalThis.postMessage({type:"sqlite3-api",result:"worker1-ready"})}).bind({sqlite3:o})}),globalThis.sqlite3ApiBootstrap.initializers.push(function(o){const u=o.wasm,l=o.capi,c=o.util.toss3,h=Object.create(null);o.vfs=h,l.sqlite3_vfs.prototype.registerVfs=function(A=!1){this instanceof o.capi.sqlite3_vfs||c("Expecting a sqlite3_vfs-type argument.");const O=l.sqlite3_vfs_register(this,A?1:0);return O&&c("sqlite3_vfs_register(",this,") failed with rc",O),this.pointer!==l.sqlite3_vfs_find(this.$zName)&&c("BUG: sqlite3_vfs_find(vfs.$zName) failed for just-installed VFS",this),this},h.installVfs=function(A){let O=0;const Z=["io","vfs"];for(const ee of Z){const fe=A[ee];fe&&(++O,fe.struct.installMethods(fe.methods,!!fe.applyArgcCheck),ee==="vfs"&&(!fe.struct.$zName&&typeof fe.name=="string"&&fe.struct.addOnDispose(fe.struct.$zName=u.allocCString(fe.name)),fe.struct.registerVfs(!!fe.asDefault)))}return O||c("Misuse: installVfs() options object requires at least","one of:",Z),this}}),globalThis.sqlite3ApiBootstrap.initializers.push(function(o){if(!o.wasm.exports.sqlite3_declare_vtab)return;const u=o.wasm,l=o.capi,c=o.util.toss3,h=Object.create(null);o.vtab=h;const A=l.sqlite3_index_info;A.prototype.nthConstraint=function(ee,fe=!1){if(ee<0||ee>=this.$nConstraint)return!1;const _e=this.$aConstraint+A.sqlite3_index_constraint.structInfo.sizeof*ee;return fe?_e:new A.sqlite3_index_constraint(_e)},A.prototype.nthConstraintUsage=function(ee,fe=!1){if(ee<0||ee>=this.$nConstraint)return!1;const _e=this.$aConstraintUsage+A.sqlite3_index_constraint_usage.structInfo.sizeof*ee;return fe?_e:new A.sqlite3_index_constraint_usage(_e)},A.prototype.nthOrderBy=function(ee,fe=!1){if(ee<0||ee>=this.$nOrderBy)return!1;const _e=this.$aOrderBy+A.sqlite3_index_orderby.structInfo.sizeof*ee;return fe?_e:new A.sqlite3_index_orderby(_e)};const O=function(ee,fe){return(function(_e,H=!1){if(arguments.length===0&&(_e=new fe),_e instanceof fe)return this.set(_e.pointer,_e),_e;u.isPtr(_e)||o.SQLite3Error.toss("Invalid argument to",ee+"()");let $=this.get(_e);return H&&this.delete(_e),$}).bind(new Map)},Z=function(ee,fe){const _e=O(ee,fe);return Object.assign(Object.create(null),{StructType:fe,create:H=>{const $=_e();return u.pokePtr(H,$.pointer),$},get:H=>_e(H),unget:H=>_e(H,!0),dispose:H=>{const $=_e(H,!0);$&&$.dispose()}})};h.xVtab=Z("xVtab",l.sqlite3_vtab),h.xCursor=Z("xCursor",l.sqlite3_vtab_cursor),h.xIndexInfo=ee=>new l.sqlite3_index_info(ee),h.xError=function ee(fe,_e,H){if(ee.errorReporter instanceof Function)try{ee.errorReporter("sqlite3_module::"+fe+"(): "+_e.message)}catch{}let $;return _e instanceof o.WasmAllocError?$=l.SQLITE_NOMEM:arguments.length>2?$=H:_e instanceof o.SQLite3Error&&($=_e.resultCode),$||l.SQLITE_ERROR},h.xError.errorReporter=console.error.bind(console),h.xRowid=(ee,fe)=>u.poke(ee,fe,"i64"),h.setupModule=function(ee){let fe=!1;const _e=this instanceof l.sqlite3_module?this:ee.struct||(fe=new l.sqlite3_module);try{const H=ee.methods||c("Missing 'methods' object.");for(const $ of Object.entries({xConnect:"xCreate",xDisconnect:"xDestroy"})){const ae=$[0],E=$[1];H[ae]===!0?H[ae]=H[E]:H[E]===!0&&(H[E]=H[ae])}if(ee.catchExceptions){const $=function(T,F){return["xConnect","xCreate"].indexOf(T)>=0?function(J,K,D,te,Ne,y){try{return F(...arguments)||0}catch(q){return q instanceof o.WasmAllocError||(u.dealloc(u.peekPtr(y)),u.pokePtr(y,u.allocCString(q.message))),h.xError(T,q)}}:function(...J){try{return F(...J)||0}catch(K){return h.xError(T,K)}}},ae=["xCreate","xConnect","xBestIndex","xDisconnect","xDestroy","xOpen","xClose","xFilter","xNext","xEof","xColumn","xRowid","xUpdate","xBegin","xSync","xCommit","xRollback","xFindFunction","xRename","xSavepoint","xRelease","xRollbackTo","xShadowName"],E=Object.create(null);for(const T of ae){const F=H[T];if(F instanceof Function)T==="xConnect"&&H.xCreate===F?E[T]=H.xCreate:T==="xCreate"&&H.xConnect===F?E[T]=H.xConnect:E[T]=$(T,F);else continue}_e.installMethods(E,!1)}else _e.installMethods(H,!!ee.applyArgcCheck);if(_e.$iVersion===0){let $;typeof ee.iVersion=="number"?$=ee.iVersion:_e.$xShadowName?$=3:_e.$xSavePoint||_e.$xRelease||_e.$xRollbackTo?$=2:$=1,_e.$iVersion=$}}catch(H){throw fe&&fe.dispose(),H}return _e},l.sqlite3_module.prototype.setupModule=function(ee){return h.setupModule.call(this,ee)}}),globalThis.sqlite3ApiBootstrap.initializers.push(function(o){const u=function l(c){if(!globalThis.SharedArrayBuffer||!globalThis.Atomics)return Promise.reject(new Error("Cannot install OPFS: Missing SharedArrayBuffer and/or Atomics. The server must emit the COOP/COEP response headers to enable those. See https://sqlite.org/wasm/doc/trunk/persistence.md#coop-coep"));if(typeof WorkerGlobalScope>"u")return Promise.reject(new Error("The OPFS sqlite3_vfs cannot run in the main thread because it requires Atomics.wait()."));if(!globalThis.FileSystemHandle||!globalThis.FileSystemDirectoryHandle||!globalThis.FileSystemFileHandle||!globalThis.FileSystemFileHandle.prototype.createSyncAccessHandle||!navigator?.storage?.getDirectory)return Promise.reject(new Error("Missing required OPFS APIs."));(!c||typeof c!="object")&&(c=Object.create(null));const h=new URL(globalThis.location.href).searchParams;return h.has("opfs-disable")?Promise.resolve(o):(c.verbose===void 0&&(c.verbose=h.has("opfs-verbose")?+h.get("opfs-verbose")||2:1),c.sanityChecks===void 0&&(c.sanityChecks=h.has("opfs-sanity-check")),c.proxyUri===void 0&&(c.proxyUri=l.defaultProxyUri),typeof c.proxyUri=="function"&&(c.proxyUri=c.proxyUri()),new Promise(function(O,Z){const ee=[o.config.error,o.config.warn,o.config.log],fe=(P,...G)=>{c.verbose>P&&ee[P]("OPFS syncer:",...G)},_e=(...P)=>fe(2,...P),H=(...P)=>fe(1,...P),$=(...P)=>fe(0,...P),ae=o.util.toss,E=o.capi,T=o.util,F=o.wasm,J=E.sqlite3_vfs,K=E.sqlite3_file,D=E.sqlite3_io_methods,te=Object.create(null),Ne=()=>globalThis.FileSystemHandle&&globalThis.FileSystemDirectoryHandle&&globalThis.FileSystemFileHandle&&globalThis.FileSystemFileHandle.prototype.createSyncAccessHandle&&navigator?.storage?.getDirectory;te.metrics={dump:function(){let P,G=0,ie=0,qe=0;for(P in b.opIds){const xe=k[P];G+=xe.count,ie+=xe.time,qe+=xe.wait,xe.avgTime=xe.count&&xe.time?xe.time/xe.count:0,xe.avgWait=xe.count&&xe.wait?xe.wait/xe.count:0}o.config.log(globalThis.location.href,"metrics for",globalThis.location.href,":",k,`
Total of`,G,"op(s) for",ie,"ms (incl. "+qe+" ms of waiting on the async side)"),o.config.log("Serialization metrics:",k.s11n),ce.postMessage({type:"opfs-async-metrics"})},reset:function(){let P;const G=qe=>qe.count=qe.time=qe.wait=0;for(P in b.opIds)G(k[P]=Object.create(null));let ie=k.s11n=Object.create(null);ie=ie.serialize=Object.create(null),ie.count=ie.time=0,ie=k.s11n.deserialize=Object.create(null),ie.count=ie.time=0}};const y=new D,q=new J().addOnDispose(()=>y.dispose());let L;const le=P=>(L=!0,q.dispose(),Z(P)),X=()=>(L=!1,O(o)),ce=new Worker(new URL("/assets/sqlite3-opfs-async-proxy-C_otN2ZJ.js",self.location.href));setTimeout(()=>{L===void 0&&le(new Error("Timeout while waiting for OPFS async proxy worker."))},4e3),ce._originalOnError=ce.onerror,ce.onerror=function(P){$("Error initializing OPFS asyncer:",P),le(new Error("Loading OPFS async Worker failed for unknown reasons."))};const f=E.sqlite3_vfs_find(null),_=f?new J(f):null;y.$iVersion=1,q.$iVersion=2,q.$szOsFile=E.sqlite3_file.structInfo.sizeof,q.$mxPathname=1024,q.$zName=F.allocCString("opfs"),q.$xDlOpen=q.$xDlError=q.$xDlSym=q.$xDlClose=null,q.addOnDispose("$zName",q.$zName,"cleanup default VFS wrapper",()=>_?_.dispose():null);const b=Object.create(null);b.verbose=c.verbose,b.littleEndian=(()=>{const P=new ArrayBuffer(2);return new DataView(P).setInt16(0,256,!0),new Int16Array(P)[0]===256})(),b.asyncIdleWaitTime=150,b.asyncS11nExceptions=1,b.fileBufferSize=1024*64,b.sabS11nOffset=b.fileBufferSize,b.sabS11nSize=q.$mxPathname*2,b.sabIO=new SharedArrayBuffer(b.fileBufferSize+b.sabS11nSize),b.opIds=Object.create(null);const k=Object.create(null);{let P=0;b.opIds.whichOp=P++,b.opIds.rc=P++,b.opIds.xAccess=P++,b.opIds.xClose=P++,b.opIds.xDelete=P++,b.opIds.xDeleteNoWait=P++,b.opIds.xFileSize=P++,b.opIds.xLock=P++,b.opIds.xOpen=P++,b.opIds.xRead=P++,b.opIds.xSleep=P++,b.opIds.xSync=P++,b.opIds.xTruncate=P++,b.opIds.xUnlock=P++,b.opIds.xWrite=P++,b.opIds.mkdir=P++,b.opIds["opfs-async-metrics"]=P++,b.opIds["opfs-async-shutdown"]=P++,b.opIds.retry=P++,b.sabOP=new SharedArrayBuffer(P*4),te.metrics.reset()}b.sq3Codes=Object.create(null),["SQLITE_ACCESS_EXISTS","SQLITE_ACCESS_READWRITE","SQLITE_BUSY","SQLITE_CANTOPEN","SQLITE_ERROR","SQLITE_IOERR","SQLITE_IOERR_ACCESS","SQLITE_IOERR_CLOSE","SQLITE_IOERR_DELETE","SQLITE_IOERR_FSYNC","SQLITE_IOERR_LOCK","SQLITE_IOERR_READ","SQLITE_IOERR_SHORT_READ","SQLITE_IOERR_TRUNCATE","SQLITE_IOERR_UNLOCK","SQLITE_IOERR_WRITE","SQLITE_LOCK_EXCLUSIVE","SQLITE_LOCK_NONE","SQLITE_LOCK_PENDING","SQLITE_LOCK_RESERVED","SQLITE_LOCK_SHARED","SQLITE_LOCKED","SQLITE_MISUSE","SQLITE_NOTFOUND","SQLITE_OPEN_CREATE","SQLITE_OPEN_DELETEONCLOSE","SQLITE_OPEN_MAIN_DB","SQLITE_OPEN_READONLY"].forEach(P=>{(b.sq3Codes[P]=E[P])===void 0&&ae("Maintenance required: not found:",P)}),b.opfsFlags=Object.assign(Object.create(null),{OPFS_UNLOCK_ASAP:1,OPFS_UNLINK_BEFORE_OPEN:2,defaultUnlockAsap:!1});const U=(P,...G)=>{const ie=b.opIds[P]||ae("Invalid op ID:",P);b.s11n.serialize(...G),Atomics.store(b.sabOPView,b.opIds.rc,-1),Atomics.store(b.sabOPView,b.opIds.whichOp,ie),Atomics.notify(b.sabOPView,b.opIds.whichOp);const qe=performance.now();for(;Atomics.wait(b.sabOPView,b.opIds.rc,-1)!=="not-equal";);const xe=Atomics.load(b.sabOPView,b.opIds.rc);if(k[P].wait+=performance.now()-qe,xe&&b.asyncS11nExceptions){const Me=b.s11n.deserialize();Me&&$(P+"() async error:",...Me)}return xe};te.debug={asyncShutdown:()=>{H("Shutting down OPFS async listener. The OPFS VFS will no longer work."),U("opfs-async-shutdown")},asyncRestart:()=>{H("Attempting to restart OPFS VFS async listener. Might work, might not."),ce.postMessage({type:"opfs-async-restart"})}};const be=()=>{if(b.s11n)return b.s11n;const P=new TextDecoder,G=new TextEncoder("utf-8"),ie=new Uint8Array(b.sabIO,b.sabS11nOffset,b.sabS11nSize),qe=new DataView(b.sabIO,b.sabS11nOffset,b.sabS11nSize);b.s11n=Object.create(null);const xe=Object.create(null);xe.number={id:1,size:8,getter:"getFloat64",setter:"setFloat64"},xe.bigint={id:2,size:8,getter:"getBigInt64",setter:"setBigInt64"},xe.boolean={id:3,size:4,getter:"getInt32",setter:"setInt32"},xe.string={id:4};const Me=Pe=>xe[typeof Pe]||ae("Maintenance required: this value type cannot be serialized.",Pe),Ge=Pe=>{switch(Pe){case xe.number.id:return xe.number;case xe.bigint.id:return xe.bigint;case xe.boolean.id:return xe.boolean;case xe.string.id:return xe.string;default:ae("Invalid type ID:",Pe)}};return b.s11n.deserialize=function(Pe=!1){++k.s11n.deserialize.count;const Lt=performance.now(),Q=ie[0],ye=Q?[]:null;if(Q){const ve=[];let Ae=1,tt,yt,ft;for(tt=0;tt<Q;++tt,++Ae)ve.push(Ge(ie[Ae]));for(tt=0;tt<Q;++tt){const pt=ve[tt];pt.getter?(ft=qe[pt.getter](Ae,b.littleEndian),Ae+=pt.size):(yt=qe.getInt32(Ae,b.littleEndian),Ae+=4,ft=P.decode(ie.slice(Ae,Ae+yt)),Ae+=yt),ye.push(ft)}}return Pe&&(ie[0]=0),k.s11n.deserialize.time+=performance.now()-Lt,ye},b.s11n.serialize=function(...Pe){const Lt=performance.now();if(++k.s11n.serialize.count,Pe.length){const Q=[];let ye=0,ve=1;for(ie[0]=Pe.length&255;ye<Pe.length;++ye,++ve)Q.push(Me(Pe[ye])),ie[ve]=Q[ye].id;for(ye=0;ye<Pe.length;++ye){const Ae=Q[ye];if(Ae.setter)qe[Ae.setter](ve,Pe[ye],b.littleEndian),ve+=Ae.size;else{const tt=G.encode(Pe[ye]);qe.setInt32(ve,tt.byteLength,b.littleEndian),ve+=4,ie.set(tt,ve),ve+=tt.byteLength}}}else ie[0]=0;k.s11n.serialize.time+=performance.now()-Lt},b.s11n},Fe=function P(G=16){P._chars||(P._chars="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ012346789",P._n=P._chars.length);const ie=[];let qe=0;for(;qe<G;++qe){const xe=Math.random()*(P._n*64)%P._n|0;ie[qe]=P._chars[xe]}return ie.join("")},He=Object.create(null),Ve=Object.create(null);Ve.op=void 0,Ve.start=void 0;const de=P=>{Ve.start=performance.now(),Ve.op=P,++k[P].count},C=()=>k[Ve.op].time+=performance.now()-Ve.start,B={xCheckReservedLock:function(P,G){return F.poke(G,0,"i32"),0},xClose:function(P){de("xClose");let G=0;const ie=He[P];return ie&&(delete He[P],G=U("xClose",P),ie.sq3File&&ie.sq3File.dispose()),C(),G},xDeviceCharacteristics:function(P){return E.SQLITE_IOCAP_UNDELETABLE_WHEN_OPEN},xFileControl:function(P,G,ie){return E.SQLITE_NOTFOUND},xFileSize:function(P,G){de("xFileSize");let ie=U("xFileSize",P);if(ie==0)try{const qe=b.s11n.deserialize()[0];F.poke(G,qe,"i64")}catch(qe){$("Unexpected error reading xFileSize() result:",qe),ie=b.sq3Codes.SQLITE_IOERR}return C(),ie},xLock:function(P,G){de("xLock");const ie=He[P];let qe=0;return ie.lockType?ie.lockType=G:(qe=U("xLock",P,G),qe===0&&(ie.lockType=G)),C(),qe},xRead:function(P,G,ie,qe){de("xRead");const xe=He[P];let Me;try{Me=U("xRead",P,ie,Number(qe)),(Me===0||E.SQLITE_IOERR_SHORT_READ===Me)&&F.heap8u().set(xe.sabView.subarray(0,ie),G)}catch(Ge){$("xRead(",arguments,") failed:",Ge,xe),Me=E.SQLITE_IOERR_READ}return C(),Me},xSync:function(P,G){de("xSync"),++k.xSync.count;const ie=U("xSync",P,G);return C(),ie},xTruncate:function(P,G){de("xTruncate");const ie=U("xTruncate",P,Number(G));return C(),ie},xUnlock:function(P,G){de("xUnlock");const ie=He[P];let qe=0;return E.SQLITE_LOCK_NONE===G&&ie.lockType&&(qe=U("xUnlock",P,G)),qe===0&&(ie.lockType=G),C(),qe},xWrite:function(P,G,ie,qe){de("xWrite");const xe=He[P];let Me;try{xe.sabView.set(F.heap8u().subarray(G,G+ie)),Me=U("xWrite",P,ie,Number(qe))}catch(Ge){$("xWrite(",arguments,") failed:",Ge,xe),Me=E.SQLITE_IOERR_WRITE}return C(),Me}},re={xAccess:function(P,G,ie,qe){de("xAccess");const xe=U("xAccess",F.cstrToJs(G));return F.poke(qe,xe?0:1,"i32"),C(),0},xCurrentTime:function(P,G){return F.poke(G,24405875e-1+new Date().getTime()/864e5,"double"),0},xCurrentTimeInt64:function(P,G){return F.poke(G,24405875e-1*864e5+new Date().getTime(),"i64"),0},xDelete:function(P,G,ie){de("xDelete");const qe=U("xDelete",F.cstrToJs(G),ie,!1);return C(),qe},xFullPathname:function(P,G,ie,qe){return F.cstrncpy(qe,G,ie)<ie?0:E.SQLITE_CANTOPEN},xGetLastError:function(P,G,ie){return H("OPFS xGetLastError() has nothing sensible to return."),0},xOpen:function(G,ie,qe,xe,Me){de("xOpen");let Ge=0;ie===0?ie=Fe():F.isPtr(ie)&&(E.sqlite3_uri_boolean(ie,"opfs-unlock-asap",0)&&(Ge|=b.opfsFlags.OPFS_UNLOCK_ASAP),E.sqlite3_uri_boolean(ie,"delete-before-open",0)&&(Ge|=b.opfsFlags.OPFS_UNLINK_BEFORE_OPEN),ie=F.cstrToJs(ie));const Pe=Object.create(null);Pe.fid=qe,Pe.filename=ie,Pe.sab=new SharedArrayBuffer(b.fileBufferSize),Pe.flags=xe,Pe.readOnly=!(o.SQLITE_OPEN_CREATE&xe)&&!!(xe&E.SQLITE_OPEN_READONLY);const Lt=U("xOpen",qe,ie,xe,Ge);return Lt||(Pe.readOnly&&F.poke(Me,E.SQLITE_OPEN_READONLY,"i32"),He[qe]=Pe,Pe.sabView=b.sabFileBufView,Pe.sq3File=new K(qe),Pe.sq3File.$pMethods=y.pointer,Pe.lockType=E.SQLITE_LOCK_NONE),C(),Lt}};_&&(q.$xRandomness=_.$xRandomness,q.$xSleep=_.$xSleep),q.$xRandomness||(re.xRandomness=function(P,G,ie){const qe=F.heap8u();let xe=0;for(;xe<G;++xe)qe[ie+xe]=Math.random()*255e3&255;return xe}),q.$xSleep||(re.xSleep=function(P,G){return Atomics.wait(b.sabOPView,b.opIds.xSleep,0,G),0}),te.getResolvedPath=function(P,G){const ie=new URL(P,"file://irrelevant").pathname;return G?ie.split("/").filter(qe=>!!qe):ie},te.getDirForFilename=async function(G,ie=!1){const qe=te.getResolvedPath(G,!0),xe=qe.pop();let Me=te.rootDirectory;for(const Ge of qe)Ge&&(Me=await Me.getDirectoryHandle(Ge,{create:!!ie}));return[Me,xe]},te.mkdir=async function(P){try{return await te.getDirForFilename(P+"/filepart",!0),!0}catch{return!1}},te.entryExists=async function(P){try{const[G,ie]=await te.getDirForFilename(P);return await G.getFileHandle(ie),!0}catch{return!1}},te.randomFilename=Fe,te.treeList=async function(){const P=async function ie(qe,xe){xe.name=qe.name,xe.dirs=[],xe.files=[];for await(const Me of qe.values())if(Me.kind==="directory"){const Ge=Object.create(null);xe.dirs.push(Ge),await ie(Me,Ge)}else xe.files.push(Me.name)},G=Object.create(null);return await P(te.rootDirectory,G),G},te.rmfr=async function(){const P=te.rootDirectory,G={recurse:!0};for await(const ie of P.values())P.removeEntry(ie.name,G)},te.unlink=async function(P,G=!1,ie=!1){try{const[qe,xe]=await te.getDirForFilename(P,!1);return await qe.removeEntry(xe,{recursive:G}),!0}catch(qe){if(ie)throw new Error("unlink(",arguments[0],") failed: "+qe.message,{cause:qe});return!1}},te.traverse=async function(P){const G={recursive:!0,directory:te.rootDirectory};typeof P=="function"&&(P={callback:P}),P=Object.assign(G,P||{}),async function qe(xe,Me){for await(const Ge of xe.values()){if(P.callback(Ge,xe,Me)===!1)return!1;if(P.recursive&&Ge.kind==="directory"&&await qe(Ge,Me+1)===!1)break}}(P.directory,0)};const me=async function(P,G){const[ie,qe]=await te.getDirForFilename(P,!0);let Me=await(await ie.getFileHandle(qe,{create:!0})).createSyncAccessHandle(),Ge=0,Pe,Lt=!1;try{for(Me.truncate(0);(Pe=await G())!==void 0;)Pe instanceof ArrayBuffer&&(Pe=new Uint8Array(Pe)),Ge===0&&Pe.byteLength>=15&&(T.affirmDbHeader(Pe),Lt=!0),Me.write(Pe,{at:Ge}),Ge+=Pe.byteLength;if((Ge<512||Ge%512!==0)&&ae("Input size",Ge,"is not correct for an SQLite database."),!Lt){const Q=new Uint8Array(20);Me.read(Q,{at:0}),T.affirmDbHeader(Q)}return Me.write(new Uint8Array([1,1]),{at:18}),Ge}catch(Q){throw await Me.close(),Me=void 0,await ie.removeEntry(qe).catch(()=>{}),Q}finally{Me&&await Me.close()}};if(te.importDb=async function(P,G){if(G instanceof Function)return me(P,G);G instanceof ArrayBuffer&&(G=new Uint8Array(G)),T.affirmIsDb(G);const ie=G.byteLength,[qe,xe]=await te.getDirForFilename(P,!0);let Me,Ge=0;try{return Me=await(await qe.getFileHandle(xe,{create:!0})).createSyncAccessHandle(),Me.truncate(0),Ge=Me.write(G,{at:0}),Ge!=ie&&ae("Expected to write "+ie+" bytes but wrote "+Ge+"."),Me.write(new Uint8Array([1,1]),{at:18}),Ge}catch(Pe){throw Me&&(await Me.close(),Me=void 0),await qe.removeEntry(xe).catch(()=>{}),Pe}finally{Me&&await Me.close()}},o.oo1){const P=function(...G){const ie=o.oo1.DB.dbCtorHelper.normalizeArgs(...G);ie.vfs=q.$zName,o.oo1.DB.dbCtorHelper.call(this,ie)};P.prototype=Object.create(o.oo1.DB.prototype),o.oo1.OpfsDb=P,P.importDb=te.importDb,o.oo1.DB.dbCtorHelper.setVfsPostOpenCallback(q.pointer,function(G,ie){ie.capi.sqlite3_busy_timeout(G,1e4)})}const We=function(){const P=F.scopedAllocPush(),G=new K;try{const ie=G.pointer,qe=E.SQLITE_OPEN_CREATE|E.SQLITE_OPEN_READWRITE|E.SQLITE_OPEN_MAIN_DB,xe=F.scopedAlloc(8),Me="/sanity/check/file"+Fe(8),Ge=F.scopedAllocCString(Me);let Pe;if(b.s11n.serialize("This is ä string."),Pe=b.s11n.deserialize(),_e("deserialize() says:",Pe),Pe[0]!=="This is ä string."&&ae("String d13n error."),re.xAccess(q.pointer,Ge,0,xe),Pe=F.peek(xe,"i32"),_e("xAccess(",Me,") exists ?=",Pe),Pe=re.xOpen(q.pointer,Ge,ie,qe,xe),_e("open rc =",Pe,"state.sabOPView[xOpen] =",b.sabOPView[b.opIds.xOpen]),Pe!==0){$("open failed with code",Pe);return}re.xAccess(q.pointer,Ge,0,xe),Pe=F.peek(xe,"i32"),Pe||ae("xAccess() failed to detect file."),Pe=B.xSync(G.pointer,0),Pe&&ae("sync failed w/ rc",Pe),Pe=B.xTruncate(G.pointer,1024),Pe&&ae("truncate failed w/ rc",Pe),F.poke(xe,0,"i64"),Pe=B.xFileSize(G.pointer,xe),Pe&&ae("xFileSize failed w/ rc",Pe),_e("xFileSize says:",F.peek(xe,"i64")),Pe=B.xWrite(G.pointer,Ge,10,1),Pe&&ae("xWrite() failed!");const Lt=F.scopedAlloc(16);Pe=B.xRead(G.pointer,Lt,6,2),F.poke(Lt+6,0);let Q=F.cstrToJs(Lt);_e("xRead() got:",Q),Q!=="sanity"&&ae("Unexpected xRead() value."),re.xSleep&&(_e("xSleep()ing before close()ing..."),re.xSleep(q.pointer,2e3),_e("waking up from xSleep()")),Pe=B.xClose(ie),_e("xClose rc =",Pe,"sabOPView =",b.sabOPView),_e("Deleting file:",Me),re.xDelete(q.pointer,Ge,4660),re.xAccess(q.pointer,Ge,0,xe),Pe=F.peek(xe,"i32"),Pe&&ae("Expecting 0 from xAccess(",Me,") after xDelete()."),H("End of OPFS sanity checks.")}finally{G.dispose(),F.scopedAllocPop(P)}};ce.onmessage=function({data:P}){switch(P.type){case"opfs-unavailable":le(new Error(P.payload.join(" ")));break;case"opfs-async-loaded":ce.postMessage({type:"opfs-async-init",args:b});break;case"opfs-async-inited":{if(L===!0)break;try{o.vfs.installVfs({io:{struct:y,methods:B},vfs:{struct:q,methods:re}}),b.sabOPView=new Int32Array(b.sabOP),b.sabFileBufView=new Uint8Array(b.sabIO,0,b.fileBufferSize),b.sabS11nView=new Uint8Array(b.sabIO,b.sabS11nOffset,b.sabS11nSize),be(),c.sanityChecks&&(H("Running sanity checks because of opfs-sanity-check URL arg..."),We()),Ne()?navigator.storage.getDirectory().then(G=>{ce.onerror=ce._originalOnError,delete ce._originalOnError,o.opfs=te,te.rootDirectory=G,_e("End of OPFS sqlite3_vfs setup.",q),X()}).catch(le):X()}catch(G){$(G),le(G)}break}default:{const G="Unexpected message from the OPFS async worker: "+JSON.stringify(P);$(G),le(new Error(G));break}}}}))};u.defaultProxyUri="sqlite3-opfs-async-proxy.js",globalThis.sqlite3ApiBootstrap.initializersAsync.push(async l=>{try{let c=u.defaultProxyUri;return l.scriptInfo.sqlite3Dir&&(u.defaultProxyUri=l.scriptInfo.sqlite3Dir+c),u().catch(h=>{l.config.warn("Ignoring inability to install OPFS sqlite3_vfs:",h.message)})}catch(c){return l.config.error("installOpfsVfs() exception:",c),Promise.reject(c)}})}),globalThis.sqlite3ApiBootstrap.initializers.push(function(o){const u=o.util.toss,l=o.util.toss3,c=Object.create(null),h=o.capi,A=o.util,O=o.wasm,Z=4096,ee=512,fe=4,_e=8,H=ee+fe,$=ee,ae=H,E=Z,T=h.SQLITE_OPEN_MAIN_DB|h.SQLITE_OPEN_MAIN_JOURNAL|h.SQLITE_OPEN_SUPER_JOURNAL|h.SQLITE_OPEN_WAL,F=h.SQLITE_OPEN_MEMORY,J=".opaque",K=()=>Math.random().toString(36).slice(2),D=new TextDecoder,te=new TextEncoder,Ne=Object.assign(Object.create(null),{name:"opfs-sahpool",directory:void 0,initialCapacity:6,clearOnInit:!1,verbosity:2,forceReinitIfPreviouslyFailed:!1}),y=[o.config.error,o.config.warn,o.config.log];o.config.log;const q=o.config.warn;o.config.error;const L=new Map,le=de=>L.get(de),X=(de,C)=>{C?L.set(de,C):L.delete(de)},ce=new Map,f=de=>ce.get(de),_=(de,C)=>{C?ce.set(de,C):ce.delete(de)},b={xCheckReservedLock:function(de,C){const B=f(de);return B.log("xCheckReservedLock"),B.storeErr(),O.poke32(C,1),0},xClose:function(de){const C=f(de);C.storeErr();const B=C.getOFileForS3File(de);if(B)try{C.log(`xClose ${B.path}`),C.mapS3FileToOFile(de,!1),B.sah.flush(),B.flags&h.SQLITE_OPEN_DELETEONCLOSE&&C.deletePath(B.path)}catch(re){return C.storeErr(re,h.SQLITE_IOERR)}return 0},xDeviceCharacteristics:function(de){return h.SQLITE_IOCAP_UNDELETABLE_WHEN_OPEN},xFileControl:function(de,C,B){return h.SQLITE_NOTFOUND},xFileSize:function(de,C){const B=f(de);B.log("xFileSize");const me=B.getOFileForS3File(de).sah.getSize()-E;return O.poke64(C,BigInt(me)),0},xLock:function(de,C){const B=f(de);B.log(`xLock ${C}`),B.storeErr();const re=B.getOFileForS3File(de);return re.lockType=C,0},xRead:function(de,C,B,re){const me=f(de);me.storeErr();const We=me.getOFileForS3File(de);me.log(`xRead ${We.path} ${B} @ ${re}`);try{const P=We.sah.read(O.heap8u().subarray(C,C+B),{at:E+Number(re)});return P<B?(O.heap8u().fill(0,C+P,C+B),h.SQLITE_IOERR_SHORT_READ):0}catch(P){return me.storeErr(P,h.SQLITE_IOERR)}},xSectorSize:function(de){return Z},xSync:function(de,C){const B=f(de);B.log(`xSync ${C}`),B.storeErr();const re=B.getOFileForS3File(de);try{return re.sah.flush(),0}catch(me){return B.storeErr(me,h.SQLITE_IOERR)}},xTruncate:function(de,C){const B=f(de);B.log(`xTruncate ${C}`),B.storeErr();const re=B.getOFileForS3File(de);try{return re.sah.truncate(E+Number(C)),0}catch(me){return B.storeErr(me,h.SQLITE_IOERR)}},xUnlock:function(de,C){const B=f(de);B.log("xUnlock");const re=B.getOFileForS3File(de);return re.lockType=C,0},xWrite:function(de,C,B,re){const me=f(de);me.storeErr();const We=me.getOFileForS3File(de);me.log(`xWrite ${We.path} ${B} ${re}`);try{const P=We.sah.write(O.heap8u().subarray(C,C+B),{at:E+Number(re)});return B===P?0:u("Unknown write() failure.")}catch(P){return me.storeErr(P,h.SQLITE_IOERR)}}},k=new h.sqlite3_io_methods;k.$iVersion=1,o.vfs.installVfs({io:{struct:k,methods:b}});const U={xAccess:function(de,C,B,re){const me=le(de);me.storeErr();try{const We=me.getPath(C);O.poke32(re,me.hasFilename(We)?1:0)}catch{O.poke32(re,0)}return 0},xCurrentTime:function(de,C){return O.poke(C,24405875e-1+new Date().getTime()/864e5,"double"),0},xCurrentTimeInt64:function(de,C){return O.poke(C,24405875e-1*864e5+new Date().getTime(),"i64"),0},xDelete:function(de,C,B){const re=le(de);re.log(`xDelete ${O.cstrToJs(C)}`),re.storeErr();try{return re.deletePath(re.getPath(C)),0}catch(me){return re.storeErr(me),h.SQLITE_IOERR_DELETE}},xFullPathname:function(de,C,B,re){return O.cstrncpy(re,C,B)<B?0:h.SQLITE_CANTOPEN},xGetLastError:function(de,C,B){const re=le(de),me=re.popErr();if(re.log(`xGetLastError ${C} e =`,me),me){const We=O.scopedAllocPush();try{const[P,G]=O.scopedAllocCString(me.message,!0);O.cstrncpy(B,P,C),G>C&&O.poke8(B+C-1,0)}catch{return h.SQLITE_NOMEM}finally{O.scopedAllocPop(We)}}return me?me.sqlite3Rc||h.SQLITE_IOERR:0},xOpen:function(C,B,re,me,We){const P=le(C);try{me&=~F,P.log(`xOpen ${O.cstrToJs(B)} ${me}`);const G=B&&O.peek8(B)?P.getPath(B):K();let ie=P.getSAHForPath(G);!ie&&me&h.SQLITE_OPEN_CREATE&&(P.getFileCount()<P.getCapacity()?(ie=P.nextAvailableSAH(),P.setAssociatedPath(ie,G,me)):u("SAH pool is full. Cannot create file",G)),ie||u("file not found:",G);const qe={path:G,flags:me,sah:ie};P.mapS3FileToOFile(re,qe),qe.lockType=h.SQLITE_LOCK_NONE;const xe=new h.sqlite3_file(re);return xe.$pMethods=k.pointer,xe.dispose(),O.poke32(We,me),0}catch(G){return P.storeErr(G),h.SQLITE_CANTOPEN}}},be=function(de){o.capi.sqlite3_vfs_find(de)&&l("VFS name is already registered:",de);const C=new h.sqlite3_vfs,B=h.sqlite3_vfs_find(null),re=B?new h.sqlite3_vfs(B):null;return C.$iVersion=2,C.$szOsFile=h.sqlite3_file.structInfo.sizeof,C.$mxPathname=ee,C.addOnDispose(C.$zName=O.allocCString(de),()=>X(C.pointer,0)),re&&(C.$xRandomness=re.$xRandomness,C.$xSleep=re.$xSleep,re.dispose()),!C.$xRandomness&&!U.xRandomness&&(U.xRandomness=function(me,We,P){const G=O.heap8u();let ie=0;for(;ie<We;++ie)G[P+ie]=Math.random()*255e3&255;return ie}),!C.$xSleep&&!U.xSleep&&(U.xSleep=(me,We)=>0),o.vfs.installVfs({vfs:{struct:C,methods:U}}),C};class Fe{vfsDir;#e;#t;#r;#s=new Map;#i=new Map;#o=new Set;#c=new Map;#n=new Uint8Array(H);#l;#a;#u;constructor(C=Object.create(null)){this.#u=C.verbosity??Ne.verbosity,this.vfsName=C.name||Ne.name,this.#a=be(this.vfsName),X(this.#a.pointer,this),this.vfsDir=C.directory||"."+this.vfsName,this.#l=new DataView(this.#n.buffer,this.#n.byteOffset),this.isReady=this.reset(!!(C.clearOnInit??Ne.clearOnInit)).then(()=>{if(this.$error)throw this.$error;return this.getCapacity()?Promise.resolve(void 0):this.addCapacity(C.initialCapacity||Ne.initialCapacity)})}#d(C,...B){this.#u>C&&y[C](this.vfsName+":",...B)}log(...C){this.#d(2,...C)}warn(...C){this.#d(1,...C)}error(...C){this.#d(0,...C)}getVfs(){return this.#a}getCapacity(){return this.#s.size}getFileCount(){return this.#i.size}getFileNames(){const C=[];for(const B of this.#i.keys())C.push(B);return C}async addCapacity(C){for(let B=0;B<C;++B){const re=K(),We=await(await this.#t.getFileHandle(re,{create:!0})).createSyncAccessHandle();this.#s.set(We,re),this.setAssociatedPath(We,"",0)}return this.getCapacity()}async reduceCapacity(C){let B=0;for(const re of Array.from(this.#o)){if(B===C||this.getFileCount()===this.getCapacity())break;const me=this.#s.get(re);re.close(),await this.#t.removeEntry(me),this.#s.delete(re),this.#o.delete(re),++B}return B}releaseAccessHandles(){for(const C of this.#s.keys())C.close();this.#s.clear(),this.#i.clear(),this.#o.clear()}async acquireAccessHandles(C=!1){const B=[];for await(const[re,me]of this.#t)me.kind==="file"&&B.push([re,me]);return Promise.all(B.map(async([re,me])=>{try{const We=await me.createSyncAccessHandle();if(this.#s.set(We,re),C)We.truncate(E),this.setAssociatedPath(We,"",0);else{const P=this.getAssociatedPath(We);P?this.#i.set(P,We):this.#o.add(We)}}catch(We){throw this.storeErr(We),this.releaseAccessHandles(),We}}))}getAssociatedPath(C){C.read(this.#n,{at:0});const B=this.#l.getUint32($);if(this.#n[0]&&(B&h.SQLITE_OPEN_DELETEONCLOSE||(B&T)===0))return q(`Removing file with unexpected flags ${B.toString(16)}`,this.#n),this.setAssociatedPath(C,"",0),"";const re=new Uint32Array(_e/4);C.read(re,{at:ae});const me=this.computeDigest(this.#n,B);if(re.every((We,P)=>We===me[P])){const We=this.#n.findIndex(P=>P===0);return We===0&&C.truncate(E),We?D.decode(this.#n.subarray(0,We)):""}else return q("Disassociating file with bad digest."),this.setAssociatedPath(C,"",0),""}setAssociatedPath(C,B,re){const me=te.encodeInto(B,this.#n);ee<=me.written+1&&u("Path too long:",B),B&&re&&(re|=F),this.#n.fill(0,me.written,ee),this.#l.setUint32($,re);const We=this.computeDigest(this.#n,re);C.write(this.#n,{at:0}),C.write(We,{at:ae}),C.flush(),B?(this.#i.set(B,C),this.#o.delete(C)):(C.truncate(E),this.#o.add(C))}computeDigest(C,B){if(B&F){let re=3735928559,me=1103547991;for(const We of C)re=Math.imul(re^We,2654435761),me=Math.imul(me^We,104729);return new Uint32Array([re>>>0,me>>>0])}else return new Uint32Array([0,0])}async reset(C){await this.isReady;let B=await navigator.storage.getDirectory(),re;for(const me of this.vfsDir.split("/"))me&&(re=B,B=await B.getDirectoryHandle(me,{create:!0}));return this.#e=B,this.#r=re,this.#t=await this.#e.getDirectoryHandle(J,{create:!0}),this.releaseAccessHandles(),this.acquireAccessHandles(C)}getPath(C){return O.isPtr(C)&&(C=O.cstrToJs(C)),(C instanceof URL?C:new URL(C,"file://localhost/")).pathname}deletePath(C){const B=this.#i.get(C);return B&&(this.#i.delete(C),this.setAssociatedPath(B,"",0)),!!B}storeErr(C,B){return C&&(C.sqlite3Rc=B||h.SQLITE_IOERR,this.error(C)),this.$error=C,B}popErr(){const C=this.$error;return this.$error=void 0,C}nextAvailableSAH(){const[C]=this.#o.keys();return C}getOFileForS3File(C){return this.#c.get(C)}mapS3FileToOFile(C,B){B?(this.#c.set(C,B),_(C,this)):(this.#c.delete(C),_(C,!1))}hasFilename(C){return this.#i.has(C)}getSAHForPath(C){return this.#i.get(C)}async removeVfs(){if(!this.#a.pointer||!this.#t)return!1;h.sqlite3_vfs_unregister(this.#a.pointer),this.#a.dispose(),delete c[this.vfsName];try{this.releaseAccessHandles(),await this.#e.removeEntry(J,{recursive:!0}),this.#t=void 0,await this.#r.removeEntry(this.#e.name,{recursive:!0}),this.#e=this.#r=void 0}catch(C){o.config.error(this.vfsName,"removeVfs() failed with no recovery strategy:",C)}return!0}pauseVfs(){return this.#c.size>0&&o.SQLite3Error.toss(h.SQLITE_MISUSE,"Cannot pause VFS",this.vfsName,"because it has opened files."),this.#s.size>0&&(h.sqlite3_vfs_unregister(this.vfsName),this.releaseAccessHandles()),this}isPaused(){return this.#s.size===0}async unpauseVfs(){return this.#s.size===0?this.acquireAccessHandles(!1).then(()=>h.sqlite3_vfs_register(this.#a,0),this):this}exportFile(C){const B=this.#i.get(C)||u("File not found:",C),re=B.getSize()-E,me=new Uint8Array(re>0?re:0);if(re>0){const We=B.read(me,{at:E});We!=re&&u("Expected to read "+re+" bytes but read "+We+".")}return me}async importDbChunked(C,B){const re=this.#i.get(C)||this.nextAvailableSAH()||u("No available handles to import to.");re.truncate(0);let me=0,We,P=!1;try{for(;(We=await B())!==void 0;)We instanceof ArrayBuffer&&(We=new Uint8Array(We)),me===0&&We.byteLength>=15&&(A.affirmDbHeader(We),P=!0),re.write(We,{at:E+me}),me+=We.byteLength;if((me<512||me%512!==0)&&u("Input size",me,"is not correct for an SQLite database."),!P){const G=new Uint8Array(20);re.read(G,{at:0}),A.affirmDbHeader(G)}re.write(new Uint8Array([1,1]),{at:E+18})}catch(G){throw this.setAssociatedPath(re,"",0),G}return this.setAssociatedPath(re,C,h.SQLITE_OPEN_MAIN_DB),me}importDb(C,B){if(B instanceof ArrayBuffer)B=new Uint8Array(B);else if(B instanceof Function)return this.importDbChunked(C,B);const re=this.#i.get(C)||this.nextAvailableSAH()||u("No available handles to import to."),me=B.byteLength;(me<512||me%512!=0)&&u("Byte array size is invalid for an SQLite db.");const We="SQLite format 3";for(let G=0;G<We.length;++G)We.charCodeAt(G)!==B[G]&&u("Input does not contain an SQLite database header.");const P=re.write(B,{at:E});return P!=me?(this.setAssociatedPath(re,"",0),u("Expected to write "+me+" bytes but wrote "+P+".")):(re.write(new Uint8Array([1,1]),{at:E+18}),this.setAssociatedPath(re,C,h.SQLITE_OPEN_MAIN_DB)),P}}class He{#e;constructor(C){this.#e=C,this.vfsName=C.vfsName}async addCapacity(C){return this.#e.addCapacity(C)}async reduceCapacity(C){return this.#e.reduceCapacity(C)}getCapacity(){return this.#e.getCapacity(this.#e)}getFileCount(){return this.#e.getFileCount()}getFileNames(){return this.#e.getFileNames()}async reserveMinimumCapacity(C){const B=this.#e.getCapacity();return B<C?this.#e.addCapacity(C-B):B}exportFile(C){return this.#e.exportFile(C)}importDb(C,B){return this.#e.importDb(C,B)}async wipeFiles(){return this.#e.reset(!0)}unlink(C){return this.#e.deletePath(C)}async removeVfs(){return this.#e.removeVfs()}pauseVfs(){return this.#e.pauseVfs(),this}async unpauseVfs(){return this.#e.unpauseVfs().then(()=>this)}isPaused(){return this.#e.isPaused()}}const Ve=async()=>{const de=await navigator.storage.getDirectory(),C=".opfs-sahpool-sync-check-"+K(),me=(await(await de.getFileHandle(C,{create:!0})).createSyncAccessHandle()).close();return await me,await de.removeEntry(C),me?.then&&u("The local OPFS API is too old for opfs-sahpool:","it has an async FileSystemSyncAccessHandle.close() method."),!0};o.installOpfsSAHPoolVfs=async function(de=Object.create(null)){de=Object.assign(Object.create(null),Ne,de||{});const C=de.name;if(de.$testThrowPhase1)throw de.$testThrowPhase1;if(c[C])try{return await c[C]}catch(B){if(de.forceReinitIfPreviouslyFailed)delete c[C];else throw B}return!globalThis.FileSystemHandle||!globalThis.FileSystemDirectoryHandle||!globalThis.FileSystemFileHandle||!globalThis.FileSystemFileHandle.prototype.createSyncAccessHandle||!navigator?.storage?.getDirectory?c[C]=Promise.reject(new Error("Missing required OPFS APIs.")):c[C]=Ve().then(async function(){if(de.$testThrowPhase2)throw de.$testThrowPhase2;const B=new Fe(de);return B.isReady.then(async()=>{const re=new He(B);if(o.oo1){const me=o.oo1,We=B.getVfs(),P=function(...G){const ie=me.DB.dbCtorHelper.normalizeArgs(...G);ie.vfs=We.$zName,me.DB.dbCtorHelper.call(this,ie)};P.prototype=Object.create(me.DB.prototype),re.OpfsSAHPoolDb=P}return B.log("VFS initialized."),re}).catch(async re=>{throw await B.removeVfs().catch(()=>{}),re})}).catch(B=>c[C]=Promise.reject(B))}}),typeof r<"u"){const o=Object.assign(Object.create(null),{exports:typeof mi>"u"?r.asm:mi,memory:r.wasmMemory},globalThis.sqlite3ApiConfig||{});globalThis.sqlite3ApiConfig=o;let u;try{u=globalThis.sqlite3ApiBootstrap()}catch(l){throw console.error("sqlite3ApiBootstrap() error:",l),l}finally{delete globalThis.sqlite3ApiBootstrap,delete globalThis.sqlite3ApiConfig}r.sqlite3=u}else console.warn("This is not running in an Emscripten module context, so","globalThis.sqlite3ApiBootstrap() is _not_ being called due to lack","of config info for the WASM environment.","It must be called manually.")},Ye?e=r:e=new Promise((i,o)=>{Ee=i,Ue=o}),e};Ca=(function(){const t=Ca;if(!t)throw new Error("Expecting globalThis.sqlite3InitModule to be defined by the Emscripten build.");const e=globalThis.sqlite3InitModuleState=Object.assign(Object.create(null),{moduleScript:globalThis?.document?.currentScript,isWorker:typeof WorkerGlobalScope<"u",location:globalThis.location,urlParams:globalThis?.location?.href?new URL(globalThis.location.href).searchParams:new URLSearchParams});if(e.debugModule=e.urlParams.has("sqlite3.debugModule")?(...r)=>console.warn("sqlite3.debugModule:",...r):()=>{},e.urlParams.has("sqlite3.dir"))e.sqlite3Dir=e.urlParams.get("sqlite3.dir")+"/";else if(e.moduleScript){const r=e.moduleScript.src.split("/");r.pop(),e.sqlite3Dir=r.join("/")+"/"}if(globalThis.sqlite3InitModule=function r(...n){return t(...n).then(s=>{s.runSQLite3PostLoadInit(s);const a=s.sqlite3;a.scriptInfo=e,r.__isUnderTest&&(a.__isUnderTest=!0);const d=a.asyncPostInit;return delete a.asyncPostInit,d()}).catch(s=>{throw console.error("Exception loading sqlite3 module:",s),s})},globalThis.sqlite3InitModule.ready=t.ready,globalThis.sqlite3InitModuleState.moduleScript){const r=globalThis.sqlite3InitModuleState;let n=r.moduleScript.src.split("/");n.pop(),r.scriptDir=n.join("/")+"/"}return e.debugModule("sqlite3InitModuleState =",e),globalThis.sqlite3InitModule})();var cy=Ca;globalThis.sqlite3Worker1Promiser=function t(e=t.defaultConfig){if(arguments.length===1&&typeof arguments[0]=="function"){const w=e;e=Object.assign(Object.create(null),t.defaultConfig),e.onready=w}else e=Object.assign(Object.create(null),t.defaultConfig,e);const r=Object.create(null),n=function(){},s=e.onerror||n,a=e.debug||n,d=e.generateMessageId?void 0:Object.create(null),g=e.generateMessageId||function(w){return w.type+"#"+(d[w.type]=(d[w.type]||0)+1)},x=(...w)=>{throw new Error(w.join(" "))};e.worker||(e.worker=t.defaultConfig.worker),typeof e.worker=="function"&&(e.worker=e.worker());let N,S;return e.worker.onmessage=function(w){w=w.data,a("worker1.onmessage",w);let I=r[w.messageId];if(!I){if(w&&w.type==="sqlite3-api"&&w.result==="worker1-ready"){e.onready&&e.onready(S);return}if(I=r[w.type],I&&I.onrow){I.onrow(w);return}e.onunhandled?e.onunhandled(arguments[0]):s("sqlite3Worker1Promiser() unhandled worker message:",w);return}switch(delete r[w.messageId],w.type){case"error":I.reject(w);return;case"open":N||(N=w.dbId);break;case"close":w.dbId===N&&(N=void 0);break}try{I.resolve(w)}catch(j){I.reject(j)}},S=function(){let w;arguments.length===1?w=arguments[0]:arguments.length===2?(w=Object.create(null),w.type=arguments[0],w.args=arguments[1],w.dbId=w.args.dbId):x("Invalid arguments for sqlite3Worker1Promiser()-created factory."),!w.dbId&&w.type!=="open"&&(w.dbId=N),w.messageId=g(w),w.departureTime=performance.now();const I=Object.create(null);I.message=w;let j;w.type==="exec"&&w.args&&(typeof w.args.callback=="function"?(j=w.messageId+":row",I.onrow=w.args.callback,w.args.callback=j,r[j]=I):typeof w.args.callback=="string"&&x("exec callback may not be a string when using the Promise interface."));let V=new Promise(function(Y,ge){I.resolve=Y,I.reject=ge,r[w.messageId]=I,a("Posting",w.type,"message to Worker dbId="+(N||"default")+":",w),e.worker.postMessage(w)});return j&&(V=V.finally(()=>delete r[j])),V}},globalThis.sqlite3Worker1Promiser.defaultConfig={worker:function(){return new Worker(new URL("/assets/sqlite3-worker1-bundler-friendly-CME5Bg3a.js",self.location.href),{type:"module"})},onerror:(...t)=>console.error("worker1 promiser error",...t)},sqlite3Worker1Promiser.v2=(function(t){let e;typeof t=="function"?(e=t,t={}):typeof t?.onready=="function"&&(e=t.onready,delete t.onready);const r=Object.create(null);t=Object.assign(t||Object.create(null),{onready:async function(s){try{e&&await e(s),r.resolve(s)}catch(a){r.reject(a)}}});const n=new Promise(function(s,a){r.resolve=s,r.reject=a});try{this.original(t)}catch(s){r.reject(s)}return n}).bind({original:sqlite3Worker1Promiser}),sqlite3Worker1Promiser.v2,globalThis.sqlite3ApiConfig={warn:t=>{typeof t=="string"&&t.startsWith("Ignoring inability to install OPFS sqlite3_vfs")||console.warn(t)}};const uy=cy(),dy=async(t,e)=>{const r=await uy;r.capi.sqlite3mc_vfs_create("opfs",1);let n;if(e?.memory)n=new r.oo1.DB(":memory:");else if(e?.encryptionKey){const g=await r.installOpfsSAHPoolVfs({directory:`.${t}`});n=new g.OpfsSAHPoolDb("file:evolu1.db?vfs=multipleciphers-opfs-sahpool"),n.exec(`
      PRAGMA cipher = 'sqlcipher';
      PRAGMA legacy = 4;
      PRAGMA key = "x'${lo(e.encryptionKey)}'";
    `)}else{const g=await r.installOpfsSAHPoolVfs({name:t});n=new g.OpfsSAHPoolDb("file:evolu1.db")}let s=!1;const a=Tp(g=>n.prepare(g),g=>{g.finalize()});return{exec:(g,x)=>{const N=a.get(g);if(N){if(N.bind(g.parameters),x)return N.stepReset(),{rows:[],changes:n.changes()};const I=[];for(;N.step();)I.push(N.get({}));return N.reset(),{rows:I,changes:0}}const S=n.exec(g.sql,{returnValue:"resultRows",rowMode:"object",bind:g.parameters}),w=n.changes();return{rows:S,changes:w}},export:()=>r.capi.sqlite3_js_db_export(n),[Symbol.dispose]:()=>{s||(s=!0,a[Symbol.dispose](),n.close())}}},fy=t=>{t.onMessage(e=>{postMessage(e)}),self.onmessage=e=>{t.postMessage(e.data)}},hy=ry({console:tp(),createSqliteDriver:dy,createWebSocket:ay,random:oy(),randomBytes:dc(),time:Qg()});fy(hy)})();
