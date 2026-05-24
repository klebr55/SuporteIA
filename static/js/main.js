  /* ── Responsive grids ── */
  function applyLayouts() {
    var w = window.innerWidth;

    var mg = document.getElementById('metrics-grid');
    if (mg) mg.style.gridTemplateColumns = w < 640 ? '1fr 1fr' : 'repeat(4,1fr)';

    var fg = document.getElementById('features-grid');
    if (fg) fg.style.gridTemplateColumns = w < 900 ? '1fr' : 'repeat(3,1fr)';

    var ag = document.getElementById('arch-grid');
    if (ag) { ag.style.gridTemplateColumns = w < 900 ? '1fr' : '1fr 1fr'; ag.style.gap = w < 900 ? '3rem' : '5rem'; }

    var ug = document.getElementById('ux-grid');
    if (ug) ug.style.gridTemplateColumns = w < 900 ? '1fr' : 'repeat(3,1fr)';

    var tg = document.getElementById('team-grid');
    if (tg) tg.style.gridTemplateColumns = w < 640 ? '1fr 1fr' : 'repeat(4,1fr)';

    var ft = document.getElementById('footer-top');
    if (ft) ft.style.gridTemplateColumns = w < 640 ? '1fr' : '1fr auto';

    var nl = document.getElementById('nav-links');
    if (nl) nl.style.display = w < 900 ? 'none' : 'flex';
  }
  applyLayouts();
  window.addEventListener('resize', applyLayouts);

  let isAuthenticated = false;

  function openLoginModal() {
    var modal = document.getElementById('login-modal');
    var box = document.getElementById('login-modal-box');
    modal.style.pointerEvents = 'all';
    gsap.to(modal, { opacity: 1, duration: 0.3, ease: 'power2.out' });
    gsap.to(box, { scale: 1, duration: 0.4, ease: 'back.out(1.5)' });
  }

  function closeLoginModal() {
    var modal = document.getElementById('login-modal');
    var box = document.getElementById('login-modal-box');
    modal.style.pointerEvents = 'none';
    gsap.to(modal, { opacity: 0, duration: 0.2, ease: 'power2.in' });
    gsap.to(box, { scale: 0.95, duration: 0.2, ease: 'power2.in' });
  }

  async function submitLogin() {
    var u = document.getElementById('login-user').value.trim();
    var p = document.getElementById('login-pass').value.trim();
    var err = document.getElementById('login-error');
    if(!u || !p) return;
    
    try {
      let response = await fetch('/api/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': getCSRFToken()
        },
        body: JSON.stringify({ username: u, password: p })
      });
      let data = await response.json();
      if(data.success) {
        isAuthenticated = true;
        closeLoginModal();
        var btn = document.getElementById('nav-login-btn');
        if(btn) {
          btn.innerHTML = '<span style="color:#22c55e;">✓</span> Autenticado';
          btn.style.borderColor = 'rgba(34,197,94,0.3)';
          btn.onclick = null;
        }
        err.style.opacity = '0';
        setTimeout(openDrawer, 300);
      } else {
        err.style.opacity = '1';
      }
    } catch(e) {
      err.textContent = "Erro de conexão.";
      err.style.opacity = '1';
    }
  }

  /* ── Drawer ── */
  function openDrawer() {
    if (!isAuthenticated) {
      openLoginModal();
      return;
    }
    document.getElementById('drawer').classList.add('open');
    document.getElementById('doverlay').classList.add('open');
    document.body.style.overflow = 'hidden';
    setTimeout(function(){ document.getElementById('msg-input').focus(); }, 460);
  }
  function closeDrawer() {
    document.getElementById('drawer').classList.remove('open');
    document.getElementById('doverlay').classList.remove('open');
    document.body.style.overflow = '';
  }

  /* ── Textarea auto-grow ── */
  function autoGrow(el) {
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 110) + 'px';
  }

  /* ── Send message (placeholder — replace with real Django fetch) ── */
function getCSRFToken() {
  var el = document.querySelector('[name=csrfmiddlewaretoken]');
  return el ? el.value : '';
}

async function sendMsg() {
  var inp = document.getElementById('msg-input');
  var txt = inp.value.trim();
  if (!txt) return;
  appendUserBubble(txt);
  inp.value = ''; 
  inp.style.height = 'auto';
  var c = document.getElementById('chat-container');
  var typingId = 'typing-' + Date.now();
  var typingEl = document.createElement('div');
  typingEl.id = typingId;
  typingEl.style.cssText = 'display:flex;gap:10px;align-items:flex-start;margin-bottom:1rem;';
  typingEl.innerHTML = '<div style="width:30px;height:30px;flex-shrink:0;border-radius:8px;background:linear-gradient(135deg,var(--cyan),var(--indigo));display:flex;align-items:center;justify-content:center;margin-top:2px;"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg></div><div><div style="font-size:11px;color:var(--faint);font-family:\'JetBrains Mono\',monospace;margin-bottom:6px;">TechAssistant AI</div><div style="background:rgba(15,23,42,.8);border:1px solid var(--border);border-radius:4px 14px 14px 14px;padding:12px 16px;font-size:14px;color:var(--text);"><span class="pulse" style="display:inline-block;width:6px;height:6px;margin-right:4px;"></span> Processando...</div></div>';
  c.appendChild(typingEl);
  c.scrollTop = c.scrollHeight;
  try {
    let response = await fetch('/api/chat/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': getCSRFToken()
      },
      body: JSON.stringify({ message: txt })
    });
    let data = await response.json();
    document.getElementById(typingId).remove();
    var resposta = data.response || data.message || data.reply || "Erro ao processar a resposta do JSON.";
    appendAIBubble(resposta);
  } catch (err) {
    document.getElementById(typingId).remove();
    appendAIBubble("Falha de conexão com o servidor. Verifique os logs do Django.");
  }
}

function quickSend(btn) {
  var inp = document.getElementById('msg-input');
  inp.value = btn.textContent.trim();
  sendMsg();
}

function appendUserBubble(text) {
  var c = document.getElementById('chat-container');
  var el = document.createElement('div');
  el.style.cssText = 'display:flex;justify-content:flex-end;margin-bottom:1rem;';
  el.innerHTML = '<div style="background:linear-gradient(135deg,rgba(34,211,238,.12),rgba(129,140,248,.12));border:1px solid rgba(34,211,238,.18);border-radius:14px 4px 14px 14px;padding:10px 14px;font-size:14px;line-height:1.6;max-width:270px;color:var(--text);">' + text + '</div>';
  c.appendChild(el);
  c.scrollTop = c.scrollHeight;
}

function appendAIBubble(text) {
  var c = document.getElementById('chat-container');
  var el = document.createElement('div');
  el.style.cssText = 'display:flex;gap:10px;align-items:flex-start;margin-bottom:1rem;';
  el.innerHTML = '<div style="width:30px;height:30px;flex-shrink:0;border-radius:8px;background:linear-gradient(135deg,var(--cyan),var(--indigo));display:flex;align-items:center;justify-content:center;margin-top:2px;"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg></div><div><div style="font-size:11px;color:var(--faint);font-family:\'JetBrains Mono\',monospace;margin-bottom:6px;">TechAssistant AI · Agora</div><div style="background:rgba(15,23,42,.8);border:1px solid var(--border);border-radius:4px 14px 14px 14px;padding:12px 16px;font-size:14px;line-height:1.65;max-width:300px;color:var(--text);">' + text.replace(/\n/g, '<br>') + '</div></div>';
  c.appendChild(el);
  c.scrollTop = c.scrollHeight;
}

  document.getElementById('msg-input').addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMsg(); }
  });

  /* ── GSAP Animations ── */
  gsap.registerPlugin(ScrollTrigger);

  var lenis = new Lenis({
    duration: 1.2,
    easing: function(t){ return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
    smoothTouch: false,
    touchMultiplier: 2
  });
  gsap.ticker.add(function(time){ lenis.raf(time * 1000); });
  gsap.ticker.lagSmoothing(0);
  lenis.on('scroll', ScrollTrigger.update);

  /* Initial states */
  gsap.set(['#h-tag','#h-sub','#h-ctas','#h-term','#h-scroll'], { y: 28, opacity: 0 });
  gsap.set(['#hw1','#hw2','#hw3','#hw4'], { y: 72, opacity: 0 });
  gsap.set('.pl-inner', { opacity: 0, y: 18 });

  var _pc = { n: 0 };
  gsap.timeline()
    .to('.pl-inner', { opacity: 1, y: 0, duration: 0.75, ease: 'power3.out', delay: 0.2 })
    .to(_pc, {
      n: 100,
      duration: 1.7,
      ease: 'power2.inOut',
      onUpdate: function() {
        var v = Math.round(_pc.n);
        document.getElementById('pl-pct').textContent = String(v).padStart(3, '0');
        document.getElementById('pl-fill').style.width = v + '%';
      },
      onComplete: function() {
        gsap.timeline()
          .to('.pl-inner', { opacity: 0, y: -12, duration: 0.3, ease: 'power2.in' })
          .to('.pl-panel-top', { yPercent: -100, duration: 1.15, ease: 'expo.inOut' }, '+=0.05')
          .to('.pl-panel-bot', { yPercent: 100,  duration: 1.15, ease: 'expo.inOut' }, '<')
          .add(function(){ _revealHero(); }, '-=0.6')
          .add(function(){ document.getElementById('preloader').style.display = 'none'; });
      }
    });

  function _revealHero() {
    gsap.to('#navbar', { opacity: 1, duration: 0.9, ease: 'power3.out' });
    gsap.timeline()
      .to('#h-tag',          { opacity:1, y:0, duration:0.55, ease:'power3.out' })
      .to('#hw1',            { opacity:1, y:0, duration:0.65, ease:'power4.out' }, '-=0.2')
      .to('#hw2',            { opacity:1, y:0, duration:0.65, ease:'power4.out' }, '-=0.42')
      .to(['#hw3','#hw4'],   { opacity:1, y:0, duration:0.65, stagger:0.12, ease:'power4.out' }, '-=0.42')
      .to('#h-sub',          { opacity:1, y:0, duration:0.6,  ease:'power3.out' }, '-=0.3')
      .to('#h-ctas',         { opacity:1, y:0, duration:0.6,  ease:'power3.out' }, '-=0.35')
      .to('#h-term',         { opacity:1, y:0, duration:0.65, ease:'power3.out' }, '-=0.25')
      .to('#h-scroll',       { opacity:1, y:0, duration:0.5,  ease:'power2.out' });
  }

  /* Parallax blobs */
  gsap.to('.blob:nth-child(1)', { y:-130, x:60,
    scrollTrigger:{ trigger:'#hero', start:'top top', end:'bottom top', scrub:1.8 } });
  gsap.to('.blob:nth-child(2)', { y:-80,  x:-40,
    scrollTrigger:{ trigger:'#hero', start:'top top', end:'bottom top', scrub:2.4 } });

  /* Generic .reveal elements */
  gsap.utils.toArray('.reveal').forEach(function(el) {
    gsap.to(el, { opacity:1, y:0, duration:0.8, ease:'power3.out',
      scrollTrigger:{ trigger:el, start:'top 87%', toggleActions:'play none none none' }
    });
  });

  /* Feature cards stagger */
  gsap.utils.toArray('.fcard').forEach(function(card, i) {
    gsap.to(card, { opacity:1, y:0, duration:0.7, delay: i * 0.09, ease:'power3.out',
      scrollTrigger:{ trigger:card, start:'top 88%', toggleActions:'play none none none' }
    });
  });

  /* UX & team cards */
  gsap.utils.toArray('.uxcard, .tcard').forEach(function(card, i) {
    gsap.to(card, { opacity:1, y:0, duration:0.65, delay: i * 0.07, ease:'power3.out',
      scrollTrigger:{ trigger:card, start:'top 88%', toggleActions:'play none none none' }
    });
  });

  /* Navbar scroll opacity boost */
  ScrollTrigger.create({
    trigger: 'body', start: 'top -80px',
    onEnter:     function(){ document.getElementById('navbar').style.background = 'rgba(3,7,18,.95)'; },
    onLeaveBack: function(){ document.getElementById('navbar').style.background = 'rgba(3,7,18,.75)'; }
  });

  /* ── Custom Cursor ── */
  var _cd = document.getElementById('cur-dot');
  var _cr = document.getElementById('cur-ring');
  var _rX = gsap.quickTo(_cr, 'x', { duration: 0.5, ease: 'power3.out' });
  var _rY = gsap.quickTo(_cr, 'y', { duration: 0.5, ease: 'power3.out' });

  window.addEventListener('mousemove', function(e) {
    gsap.set(_cd, { x: e.clientX, y: e.clientY });
    _rX(e.clientX);
    _rY(e.clientY);
  });
  window.addEventListener('mousedown', function() { document.body.classList.add('cur-click'); });
  window.addEventListener('mouseup',   function() { document.body.classList.remove('cur-click'); });

  document.querySelectorAll('a, button, .fcard, .qa, .tcard, .uxcard, .nav-link').forEach(function(el) {
    el.addEventListener('mouseenter', function() { document.body.classList.add('cur-hover'); });
    el.addEventListener('mouseleave', function() { document.body.classList.remove('cur-hover'); });
  });

  /* ── Magnetic Buttons ── */
  document.querySelectorAll('.btn-p, .btn-g, .fab').forEach(function(btn) {
    var bX = gsap.quickTo(btn, 'x', { duration: 0.55, ease: 'power3.out' });
    var bY = gsap.quickTo(btn, 'y', { duration: 0.55, ease: 'power3.out' });
    btn.addEventListener('mousemove', function(e) {
      var r = btn.getBoundingClientRect();
      bX((e.clientX - (r.left + r.width  * 0.5)) * 0.32);
      bY((e.clientY - (r.top  + r.height * 0.5)) * 0.32);
    });
    btn.addEventListener('mouseleave', function() { bX(0); bY(0); });
  });

  /* ── BG Particles ── */
  (function(){
    var C=document.getElementById('bg-canvas'),ctx=C.getContext('2d');
    var W=0,H=0,mx=-9999,my=-9999,N=75,LINK=120;
    function resize(){W=C.width=window.innerWidth;H=C.height=window.innerHeight;}
    resize();
    window.addEventListener('resize',resize);
    window.addEventListener('mousemove',function(e){mx=e.clientX;my=e.clientY;});
    function mkPt(){
      var bvx=(Math.random()-.5)*.22,bvy=(Math.random()-.5)*.22;
      return{x:Math.random()*W,y:Math.random()*H,vx:bvx,vy:bvy,bvx:bvx,bvy:bvy,
        r:Math.random()*1.1+.4,a:Math.random()*.32+.08,c:Math.random()>.42};
    }
    var pts=[];
    for(var i=0;i<N;i++)pts.push(mkPt());
    function tick(){
      ctx.clearRect(0,0,W,H);
      for(var i=0;i<N;i++){
        for(var j=i+1;j<N;j++){
          var dx=pts[i].x-pts[j].x,dy=pts[i].y-pts[j].y,d=Math.sqrt(dx*dx+dy*dy);
          if(d<LINK){
            ctx.beginPath();ctx.moveTo(pts[i].x,pts[i].y);ctx.lineTo(pts[j].x,pts[j].y);
            ctx.strokeStyle='rgba(34,211,238,'+(1-d/LINK)*.055+')';ctx.lineWidth=.5;ctx.stroke();
          }
        }
      }
      for(var i=0;i<N;i++){
        var p=pts[i],ex=p.x-mx,ey=p.y-my,ed=Math.sqrt(ex*ex+ey*ey);
        if(ed<160&&ed>0){var f=(160-ed)/160*.26;p.vx+=ex/ed*f;p.vy+=ey/ed*f;}
        p.vx+=(p.bvx-p.vx)*.008;p.vy+=(p.bvy-p.vy)*.008;
        p.vx*=.975;p.vy*=.975;
        p.x+=p.vx;p.y+=p.vy;
        if(p.x<0)p.x=W;if(p.x>W)p.x=0;
        if(p.y<0)p.y=H;if(p.y>H)p.y=0;
        ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
        ctx.fillStyle=p.c?'rgba(34,211,238,'+p.a+')':'rgba(129,140,248,'+p.a+')';
        ctx.fill();
      }
      requestAnimationFrame(tick);
    }
    tick();
  })();

  /* ── Split Text Reveals ── */
  function _sw(el){
    var r=[],ns=Array.prototype.slice.call(el.childNodes);
    el.innerHTML='';
    ns.forEach(function(n){
      if(n.nodeType===3){
        n.textContent.split(/(\s+)/).forEach(function(w){
          if(/\S/.test(w)){var o=document.createElement('span');o.className='sw';var inn=document.createElement('span');inn.className='si';inn.textContent=w;o.appendChild(inn);el.appendChild(o);r.push(inn);}
          else if(w) el.appendChild(document.createTextNode(w));
        });
      } else if(n.tagName==='BR'){
        el.appendChild(n);
      } else if(n.nodeType===1){
        n.textContent.split(/(\s+)/).forEach(function(w){
          if(/\S/.test(w)){var o=document.createElement('span');o.className='sw';var c=n.cloneNode(false);c.className=(n.className||'')+' si';c.style.display='inline-block';c.textContent=w;o.appendChild(c);el.appendChild(o);r.push(c);}
          else if(w) el.appendChild(document.createTextNode(w));
        });
      }
    });
    return r;
  }

  document.querySelectorAll('.reveal h2, .fcard h3, .uxcard h3').forEach(function(el){
    var ws=_sw(el);
    gsap.set(ws,{y:'105%',rotateX:45,opacity:0,transformOrigin:'50% 100%'});
    ScrollTrigger.create({trigger:el,start:'top 91%',once:true,onEnter:function(){
      gsap.to(ws,{y:0,rotateX:0,opacity:1,duration:0.72,stagger:0.065,ease:'power3.out',delay:0.08});
    }});
  });

  /* ── Hero 3D · Fase 1: Scene Setup ── */
  var _h3d = {};
  (function(){
    if(typeof THREE==='undefined') return;
    var el=document.getElementById('hero-3d');
    if(!el) return;
    _h3d.scene  = new THREE.Scene();
    _h3d.camera = new THREE.PerspectiveCamera(45, el.clientWidth/el.clientHeight, 0.1, 100);
    _h3d.camera.position.set(0, 0.2, 3.5);
    _h3d.camera.lookAt(0, 0.2, 0);
    _h3d.renderer = new THREE.WebGLRenderer({antialias:true, alpha:true, powerPreference:'high-performance'});
    _h3d.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
    _h3d.renderer.setSize(el.clientWidth, el.clientHeight);
    _h3d.renderer.physicallyCorrectLights = true;
    _h3d.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    _h3d.renderer.toneMappingExposure = 1.2;
    _h3d.renderer.outputEncoding = THREE.sRGBEncoding;
    _h3d.renderer.shadowMap.enabled = true;
    _h3d.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    el.appendChild(_h3d.renderer.domElement);
    (function(){
      var _pm=new THREE.PMREMGenerator(_h3d.renderer);
      _pm.compileEquirectangularShader();
      if(typeof THREE.RoomEnvironment!=='undefined'){
        _h3d.scene.environment=_pm.fromScene(new THREE.RoomEnvironment(), 0.04).texture;
        _pm.dispose();
      }
    })();
    _h3d.scene.add(new THREE.AmbientLight(0xffffff, 1.8));

    const groundGeometry = new THREE.PlaneGeometry(10, 10);
    const groundMaterial = new THREE.ShadowMaterial({ opacity: 0.15 });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.5;
    ground.receiveShadow = true;
    _h3d.scene.add(ground);

    const dLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dLight.position.set(-2, 5, 4);
    dLight.castShadow = true;
    dLight.shadow.mapSize.width = 1024;
    dLight.shadow.mapSize.height = 1024;
    dLight.shadow.camera.near = 0.5;
    dLight.shadow.camera.far = 10;
    dLight.shadow.camera.left = -3;
    dLight.shadow.camera.right = 3;
    dLight.shadow.camera.top = 3;
    dLight.shadow.camera.bottom = -3;
    dLight.shadow.radius = 12;
    _h3d.scene.add(dLight);
    var iL=new THREE.DirectionalLight(0x22d3ee, 3.5); iL.position.set(4, -1, -3); _h3d.scene.add(iL);
    var rL=new THREE.DirectionalLight(0x818cf8, 3.5); rL.position.set(-4, 2, -3); _h3d.scene.add(rL);
  })();

  /* ── Hero 3D · Fase 2: Load & Animate ── */
  (function(){
    if(!_h3d.scene || typeof THREE.GLTFLoader==='undefined') return;
    _h3d.clock = new THREE.Clock();
    new THREE.GLTFLoader().load(
      '/static/models/TechAI_Robot.glb',
      function(gltf){
        _h3d.model = gltf.scene;
        _h3d.model.traverse(function(node){
          if(node.isMesh){
            node.castShadow = true;
            node.receiveShadow = true;
            if (node.material) {
              var tex = node.material.map || (node.material.length && node.material[0].map);

              var premiumMat = new THREE.MeshPhysicalMaterial({
                map: tex,
                color: 0xffffff,
                metalness: 1.0,
                roughness: 0.22,
                envMapIntensity: 4.5,
                clearcoat: 0.05,
                clearcoatRoughness: 0.1,
                vertexColors: node.geometry.attributes.color && !tex ? true : false
              });

              if(tex) {
                tex.anisotropy = _h3d.renderer.capabilities.getMaxAnisotropy();
                tex.encoding = THREE.sRGBEncoding;
                tex.generateMipmaps = true;
                tex.minFilter = THREE.LinearMipmapLinearFilter;
                tex.magFilter = THREE.LinearFilter;
              }

              node.material = premiumMat;
              node.material.needsUpdate = true;
            }
          }
        });
        var box = new THREE.Box3().setFromObject(_h3d.model);
        var size = box.getSize(new THREE.Vector3());
        var center = box.getCenter(new THREE.Vector3());
        
        // Escala ajustada para ficar perfeitamente alinhada com a UI
        var scale = 0.85 / Math.max(size.x, size.y, size.z);
        _h3d.model.scale.setScalar(scale);
        
        // Deslocamento Y ajustado para flutuar ao lado do terminal
        _h3d.model.position.set(-center.x * scale, (-center.y * scale) + 0.2, -center.z * scale);
        
        _h3d.baseRY = 0;
        _h3d.model.rotation.y = _h3d.baseRY;
        _h3d.scene.add(_h3d.model);
        if(gltf.animations && gltf.animations.length){
          _h3d.mixer = new THREE.AnimationMixer(_h3d.model);
          var clip = THREE.AnimationClip.findByName(gltf.animations,'idle') || gltf.animations[0];
          _h3d.mixer.clipAction(clip).setLoop(THREE.LoopRepeat).play();
        }
        (function _loop(){
          requestAnimationFrame(_loop);
          var el = document.getElementById('hero-3d');
          if (el && _h3d.renderer) {
            var canvas = _h3d.renderer.domElement;
            var pr = Math.min(window.devicePixelRatio, 2);
            var w = el.clientWidth;
            var h = el.clientHeight;
            var expectedW = Math.floor(w * pr);
            var expectedH = Math.floor(h * pr);
            if (canvas.width !== expectedW || canvas.height !== expectedH) {
              _h3d.renderer.setSize(w, h, false);
              _h3d.camera.aspect = w / h;
              _h3d.camera.updateProjectionMatrix();
            }
          }
          if(_h3d.mixer) _h3d.mixer.update(_h3d.clock.getDelta());
          _h3d.renderer.render(_h3d.scene, _h3d.camera);
        })();
      },
      undefined,
      function(e){ console.warn('[hero-3d]', e); }
    );
  })();

  /* ── Hero 3D · Fase 3: Mouse Tracking ── */
  (function(){
    _h3d._tx = 0; _h3d._ty = 0;
    _h3d._cx = 0; _h3d._cy = 0;

    window.addEventListener('mousemove', function(e){
      if(!_h3d.model) return;
      var nx = Math.max(-1, Math.min(1, (e.clientX / window.innerWidth)  * 2 - 1));
      var ny = Math.max(-1, Math.min(1, (e.clientY / window.innerHeight) * 2 - 1));
      
      // Tracking restaurado e sensibilidade aumentada para alcançar os cantos da tela
      _h3d._ty = nx * 1.2;
      _h3d._tx = ny * 0.85;
    });

    (function _lerp(){
      requestAnimationFrame(_lerp);
      if(!_h3d.model) return;
      if(!_h3d._bobbingInitialized) {
        var tlBob = gsap.timeline({ repeat: -1, yoyo: true });
        tlBob.to(_h3d.model.position, { y: "+=0.12", duration: 3.5, ease: "sine.inOut" }, 0);
        _h3d.scene.children.forEach(function(c) {
          if(c.geometry && c.geometry.type === 'PlaneGeometry') {
            tlBob.to(c.scale, { x: 0.85, y: 0.85, duration: 3.5, ease: "sine.inOut" }, 0);
            tlBob.to(c.material, { opacity: 0.04, duration: 3.5, ease: "sine.inOut" }, 0);
          }
        });
        _h3d._bobbingInitialized = true;
      }
      _h3d._cx += (_h3d._tx - _h3d._cx) * 0.06;
      _h3d._cy += (_h3d._ty - _h3d._cy) * 0.06;
      _h3d.model.rotation.x = _h3d._cx;
      _h3d.model.rotation.y = (_h3d.baseRY || 0) + _h3d._cy;
    })();
  })();
