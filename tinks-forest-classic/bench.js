/* Tink's Forest performance benchmark (dev only). Loaded by the STAGING page when the address has ?bench.
   It never changes the game: it borrows the camera for a short tour of the heavy spots, measures each one,
   then puts the camera, time of day and season back exactly as they were. Results can be copied for Claude. */
(()=>{
const wait=ms=>new Promise(r=>setTimeout(r,ms));
const until=async(f,ms=600000)=>{const t0=performance.now();while(!f()){if(performance.now()-t0>ms)return false;await wait(250)}return true};
const nav=performance.timing||{};const T0=performance.timeOrigin||Date.now();
const box=document.createElement('div');box.id='benchBox';
box.style.cssText='position:fixed;right:10px;top:10px;z-index:100000;font:12px/1.45 system-ui,sans-serif;color:#fff;background:rgba(20,24,30,.88);padding:10px 12px;border-radius:8px;width:300px;max-height:80vh;overflow:auto;pointer-events:auto';
box.innerHTML='<b>Benchmark</b><div id="bnS">Waiting for the forest to load…</div><div id="bnR"></div>';
document.body.appendChild(box);const S=box.querySelector('#bnS'),R=box.querySelector('#bnR');
const say=t=>{S.textContent=t};
const measure=async(ms)=>{const L=window.__luca,ren=L.renderer;const dts=[];let last=performance.now(),calls=0,tris=0,n=0,run=true;
  // the game draws in several passes; stop the counter resetting after each one and add up a whole frame ourselves
  const ar=ren.info.autoReset;ren.info.autoReset=false;ren.info.reset();
  const tick=now=>{if(!run)return;dts.push(now-last);last=now;calls+=ren.info.render.calls;tris+=ren.info.render.triangles;ren.info.reset();n++;requestAnimationFrame(tick)};
  requestAnimationFrame(t=>{last=t;ren.info.reset();requestAnimationFrame(tick)});await wait(ms);run=false;ren.info.autoReset=ar;
  dts.sort((a,b)=>a-b);const avg=dts.reduce((a,b)=>a+b,0)/Math.max(1,dts.length);const p=q=>dts[Math.min(dts.length-1,Math.floor(dts.length*q))]||0;
  const mem=performance.memory?Math.round(performance.memory.usedJSHeapSize/1048576):null;
  return {fps:+(1000/avg).toFixed(1),avgMs:+avg.toFixed(1),p95Ms:+p(.95).toFixed(1),worstMs:+p(1).toFixed(1),drawCalls:Math.round(calls/Math.max(1,n)),triangles:Math.round(tris/Math.max(1,n)),
    pixelRatio:ren.getPixelRatio(),geometries:ren.info.memory.geometries,textures:ren.info.memory.textures,heapMB:mem}};
(async()=>{
 const ok=await until(()=>window.__luca&&window.__worldBuilt);if(!ok){say('The forest never finished loading.');return}
 const loadS=+((performance.now())/1000).toFixed(1);
 say('Loaded in '+loadS+' s. Start the game (click to begin), then press the button.');
 const go=document.createElement('button');go.textContent='Run benchmark (about 1 minute)';go.style.cssText='margin-top:6px;cursor:pointer';box.appendChild(go);
 go.onclick=async()=>{go.disabled=true;const L=window.__luca,C=window.__CYCLE,V=L.THREE.Vector3;
  const keep={ov:window.__camOverride,season:C.season,prog:C.prog(),hud:document.body.classList.contains('hud-off')};
  let cam=null;window.__camOverride=c=>{if(cam){c.position.set(...cam.p);c.lookAt(...cam.t)}else if(keep.ov)keep.ov(c)};
  const g=(x,z)=>{try{return L.groundAt(x,z)}catch(e){return 0}};
  const wp=o=>{const v=new V();o.getWorldPosition(v);return v.toArray()};
  const spots=[];
  spots.push(['Where you are now (normal play)',null]);
  {const a=window.__ANC;if(a)spots.push(['Ancient tree, daytime',{t:[a.x,g(a.x,a.z)+2,a.z],p:[a.x+14*Math.sin(2.4),g(a.x,a.z)+5,a.z+14*Math.cos(2.4)],tod:'day'}])}
  spots.push(['Over the forest, daytime',{t:[10,0,-10],p:[10+60*Math.sin(.9),40,-10+60*Math.cos(.9)],tod:'day'}]);
  {const T=window.__TRAIL;if(T&&T.cv&&!T.gone){const a=T.cv.getPointAt(.15),b=T.cv.getPointAt(.55);spots.push(['Inside the tunnel',{t:[b.x,b.y+1.2,b.z],p:[a.x,a.y+1.4,a.z],tod:'day'}])}}
  {const H=window.__MORE&&window.__MORE.houseIn;if(H){const h=wp(H.g);spots.push(['Farmhouse at night',{t:[h[0],h[1]+2,h[2]],p:[h[0]+18*Math.sin(.5),h[1]+6,h[2]+18*Math.cos(.5)],tod:'night'}])}}
  {try{const s=window.__QAPI.spot();spots.push(['Bean glade / beanstalk',{t:[s.x,s.y+4,s.z],p:[s.x+12*Math.sin(1),s.y+4,s.z+12*Math.cos(1)],tod:'day'}])}catch(e){}}
  {const b=window.__BUSSTOP;if(b){const v=wp(b);spots.push(['Bus stop in the rain',{t:[v[0],v[1]+1,v[2]],p:[v[0]+9*Math.sin(-.6),v[1]+2.2,v[2]+9*Math.cos(-.6)],tod:'day',rain:true}])}}
  const out={build:document.getElementById('gBuild')?.textContent||'',page:location.pathname,when:new Date().toISOString(),screen:innerWidth+'x'+innerHeight+' @'+devicePixelRatio,
    gpu:(()=>{try{const gl=L.renderer.getContext();const e=gl.getExtension('WEBGL_debug_renderer_info');return e?gl.getParameter(e.UNMASKED_RENDERER_WEBGL):''}catch(e){return ''}})(),loadSeconds:loadS,spots:[]};
  R.innerHTML='';
  for(const [name,s] of spots){say('Measuring: '+name);
   if(s){if(s.tod)C.jump(s.tod);C.setEvent(s.rain?'rain':null,s.rain?1:0);cam=s}else cam=null;
   await wait(s&&s.rain?6000:3000);const m=await measure(5000);out.spots.push({name,...m});
   const col=m.fps>=50?'#7fd67f':m.fps>=30?'#f3d36b':'#ff7a6b';
   R.insertAdjacentHTML('beforeend',`<div style="margin-top:4px"><span style="color:${col}">●</span> ${name}: <b>${m.fps}</b> fps · ${m.p95Ms} ms slow frames · ${m.drawCalls} draws</div>`)}
  cam=null;window.__camOverride=keep.ov;C.setEvent(null,0);if(keep.prog)C.setT(keep.prog.w,keep.prog.f);if(C.season!==keep.season)C.setSeason(keep.season,true);
  say('Done. Your camera, time of day and season are back as they were.');
  const cp=document.createElement('button');cp.textContent='Copy results for Claude';cp.style.cssText='margin-top:6px;cursor:pointer';box.appendChild(cp);
  const txt=JSON.stringify(out,null,1);cp.onclick=()=>{navigator.clipboard.writeText(txt).then(()=>{cp.textContent='Copied'},()=>{const ta=document.createElement('textarea');ta.value=txt;box.appendChild(ta);ta.select()})};
  try{localStorage.setItem('tink.bench.last',txt)}catch(e){}go.disabled=false};
})();
})();
