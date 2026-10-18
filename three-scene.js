import * as THREE from "./assets/vendor/three/three.module.js";

const stage=document.querySelector(".hero-art");
const canvas=stage?.querySelector("canvas");
const reduceMotion=window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if(stage&&canvas){
  try{
    const renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:innerWidth>640,powerPreference:"low-power"});
    renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.5));
    renderer.outputColorSpace=THREE.SRGBColorSpace;
    renderer.toneMapping=THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure=1.2;

    const scene=new THREE.Scene();
    const camera=new THREE.PerspectiveCamera(43,1,.1,30);
    camera.position.set(0,0,7.8);
    const scrollGroup=new THREE.Group();
    const group=new THREE.Group();
    scene.add(scrollGroup);
    scrollGroup.add(group);
    scene.add(new THREE.HemisphereLight(0xfff6df,0x292035,2.2));
    const key=new THREE.DirectionalLight(0xffe6bd,4.2);key.position.set(-3,4,5);scene.add(key);
    const warm=new THREE.PointLight(0xff6539,38,11,2);warm.position.set(2,1,2.5);scene.add(warm);
    const violet=new THREE.PointLight(0x8e79ff,28,11,2);violet.position.set(-2,-2,-1);scene.add(violet);

    const mat=(color,metalness=.2,roughness=.3,emissive=0x000000,intensity=0)=>new THREE.MeshPhysicalMaterial({color,metalness,roughness,emissive,emissiveIntensity:intensity,clearcoat:.9,clearcoatRoughness:.18,iridescence:.22,iridescenceIOR:1.25,iridescenceThicknessRange:[120,420]});
    const line=(color,opacity=.65)=>new THREE.MeshBasicMaterial({color,transparent:true,opacity});
    const shapeForN=()=>{
      const shape=new THREE.Shape();
      shape.moveTo(-1.15,-1.2);shape.lineTo(-1.15,1.2);shape.lineTo(-.58,1.2);shape.lineTo(.66,-.18);shape.lineTo(.66,1.2);shape.lineTo(1.15,1.2);shape.lineTo(1.15,-1.2);shape.lineTo(.58,-1.2);shape.lineTo(-.66,.18);shape.lineTo(-.66,-1.2);shape.closePath();
      return new THREE.ExtrudeGeometry(shape,{depth:.38,bevelEnabled:true,bevelSegments:4,steps:1,bevelSize:.1,bevelThickness:.11});
    };
    const sphere=(radius,color,position)=>{const mesh=new THREE.Mesh(new THREE.SphereGeometry(radius,28,20),mat(color,.16,.26,color,.08));mesh.position.set(...position);group.add(mesh);return mesh;};
    const ring=(radius,tube,color,rotation,scale=[1,1,1])=>{const mesh=new THREE.Mesh(new THREE.TorusGeometry(radius,tube,12,120),mat(color,.3,.22,color,.08));mesh.rotation.set(...rotation);mesh.scale.set(...scale);group.add(mesh);return mesh;};
    const model=stage.dataset.model||"home";
    if(model==="home"){
      const n=new THREE.Mesh(shapeForN(),mat(0xfb683d,.24,.24,0x7c231b,.22));n.rotation.set(-.08,.3,-.08);group.add(n);
      ring(1.82,.018,0x322248,[1.08,.08,-.38],[1.04,.65,1]);
      ring(2.06,.012,0xf2c94c,[.78,-.38,.74],[1,.61,1]);
      sphere(.095,0xf2c94c,[1.28,.84,.12]);sphere(.07,0x8d73ea,[-1.4,-.65,.42]);
    }else if(model==="knot"){
      const core=new THREE.Mesh(new THREE.IcosahedronGeometry(.96,1),mat(0x254e83,.36,.2,0x176bd4,.3));group.add(core);
      const cage=new THREE.Mesh(new THREE.IcosahedronGeometry(1.5,1),new THREE.MeshBasicMaterial({color:0x61baff,wireframe:true,transparent:true,opacity:.5}));group.add(cage);
      ring(1.72,.013,0x2f8ef4,[1.08,.22,-.22],[1,.7,1]);
      ring(1.88,.009,0xf2c94c,[.65,-.55,.74],[1,.68,1]);
      [[1.25,.82,.18],[-1.17,.72,.28],[.12,-1.42,.25],[-.65,-.96,-.38]].forEach((position,i)=>sphere(i===0?.1:.075,i===2?0xf2c94c:0x67c0ff,position));
      const links=new Float32Array([1.25,.82,.18,-1.17,.72,.28,-1.17,.72,.28,.12,-1.42,.25,.12,-1.42,.25,-.65,-.96,-.38]);
      const linkGeometry=new THREE.BufferGeometry();linkGeometry.setAttribute("position",new THREE.BufferAttribute(links,3));
      group.add(new THREE.LineSegments(linkGeometry,line(0x8bcfff,.62)));
    }else if(model==="orbit"){
      const colors=[0xfb683d,0xf2c94c,0x7d6ce7,0x27272a,0x70c6b0,0xe979a8];
      colors.forEach((color,i)=>{const angle=i/colors.length*Math.PI*2;const dot=sphere(.25+(i%2)*.07,color,[Math.cos(angle)*1.22,Math.sin(angle)*.8,Math.sin(angle*2)*.35]);dot.scale.setScalar(i===0?1.08:.78);});
      ring(1.25,.014,0x2c2537,[1.12,.15,0],[1,.75,1]);ring(1.65,.012,0xfb683d,[.65,-.15,.6],[1,.7,1]);
    }else if(model==="frame"){
      const box=new THREE.Mesh(new THREE.BoxGeometry(1.75,1.75,1.75,3,3,3),mat(0x25222a,.48,.24,0x2c1d38,.15));group.add(box);
      const edges=new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(1.9,1.9,1.9)),line(0xf2c94c,.82));group.add(edges);
      const tile=new THREE.Mesh(new THREE.PlaneGeometry(1.05,1.42),mat(0xfb683d,.1,.36,0x752924,.1));tile.position.set(.05,.05,.94);tile.rotation.z=-.12;group.add(tile);
    }else if(model==="prism"){
      const gem=new THREE.Mesh(new THREE.OctahedronGeometry(1.32,1),mat(0xe8ad41,.36,.22,0x7f411d,.18));group.add(gem);
      const ring2=ring(1.7,.012,0x8e74ee,[1.2,.2,.2],[1,.68,1]);
      const facets=new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.OctahedronGeometry(1.34,1)),line(0xffe5a4,.36));group.add(facets);ring2.rotation.y=.5;
    }else if(model==="stack"){
      [-.68,0,.68].forEach((y,i)=>{const disc=new THREE.Mesh(new THREE.CylinderGeometry(.78-i*.1,.78-i*.1,.24,48),mat([0xfb683d,0xf2c94c,0x8e74ee][i],.36,.22,[0xfb683d,0xf2c94c,0x8e74ee][i],.14));disc.position.y=y;disc.rotation.x=.14;group.add(disc);});
    }else if(model==="glass"){
      [-.92,0,.92].forEach((x,i)=>{const pane=new THREE.Mesh(new THREE.BoxGeometry(.82,1.65,.1),new THREE.MeshPhysicalMaterial({color:[0x9e8cff,0xf2c94c,0x6bc5d5][i],metalness:.12,roughness:.16,transparent:true,opacity:.55,transmission:.15,clearcoat:1}));pane.position.set(x,0,0);pane.rotation.y=(i-1)*-.14;group.add(pane);});
      const halo=new THREE.Mesh(new THREE.TorusGeometry(1.5,.018,8,120),line(0xffffff,.5));halo.rotation.x=1.1;group.add(halo);
    }else{
      const poly=new THREE.Mesh(new THREE.DodecahedronGeometry(1.2,1),mat(0xd780c2,.24,.25,0x502c6e,.22));group.add(poly);
      ring(1.65,.014,0x71c8ed,[1.05,.2,-.32],[1,.68,1]);
      [-1,1].forEach((side,i)=>sphere(.09,i?0xf2c94c:0x71c8ed,[side*1.55,.12,.1]));
    }

    let width=0,height=0,last=0,visible=true,fitScale=1;
    const extent=model==="home"?2.14:model==="knot"?1.98:1.84;
    const resize=()=>{const rect=stage.getBoundingClientRect();width=Math.max(1,rect.width);height=Math.max(1,rect.height);renderer.setSize(width,height,false);camera.aspect=width/height;camera.updateProjectionMatrix();const nearestDistance=camera.position.z-extent*.72;const visibleHeight=2*nearestDistance*Math.tan(THREE.MathUtils.degToRad(camera.fov/2));fitScale=Math.min(1,(visibleHeight*camera.aspect)/(extent*2)*.9,visibleHeight/(extent*2)*.94);group.scale.setScalar(fitScale);};
    resize();addEventListener("resize",resize,{passive:true});
    const pointer={x:0,y:0,dx:0,dy:0,energy:0,active:false,lastX:0,lastY:0,lastTime:0};
    stage.addEventListener("pointermove",event=>{const r=stage.getBoundingClientRect();const x=THREE.MathUtils.clamp((event.clientX-r.left)/r.width-.5,-.5,.5);const y=THREE.MathUtils.clamp((event.clientY-r.top)/r.height-.5,-.5,.5);const now=performance.now();const dt=Math.max(8,now-pointer.lastTime);pointer.dx=THREE.MathUtils.clamp((x-pointer.lastX)/(dt/16),-.5,.5);pointer.dy=THREE.MathUtils.clamp((y-pointer.lastY)/(dt/16),-.5,.5);pointer.energy=Math.min(1,pointer.energy+Math.hypot(pointer.dx,pointer.dy)*2.4+.08);pointer.x=x;pointer.y=y;pointer.lastX=x;pointer.lastY=y;pointer.lastTime=now;pointer.active=true;},{passive:true});
    stage.addEventListener("pointerleave",()=>{pointer.x=0;pointer.y=0;pointer.dx=0;pointer.dy=0;pointer.active=false;},{passive:true});
    const observer=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;if(visible)renderer.render(scene,camera);});observer.observe(stage);
    // GSAP ticker time is measured in seconds; use the performance clock here
    // so the same frame gate works with both GSAP and requestAnimationFrame.
    const draw=()=>{const now=performance.now();if(visible&&now-last>16){last=now;const moving=!reduceMotion||pointer.active||pointer.energy>.01;if(moving){const rush=pointer.energy;const follow=pointer.active?1:0;const targetY=pointer.x*1.12+(reduceMotion?0:Math.sin(now*.00055)*.16);const targetX=-pointer.y*.76+(reduceMotion?0:Math.sin(now*.0008)*.08);const targetZ=-pointer.x*.24+pointer.dx*(reduceMotion ? .35 : .8);group.rotation.y+=(targetY-group.rotation.y)*(.075+rush*.075);group.rotation.x+=(targetX-group.rotation.x)*(.07+rush*.07);group.rotation.z+=(targetZ-group.rotation.z)*(.08+rush*.08);if(!reduceMotion)group.rotation.y+=.0025+rush*.006;group.position.x+=(pointer.x*.2*follow-group.position.x)*.08;group.position.y=(reduceMotion?0:Math.sin(now*.0012)*.075)-pointer.dy*.11*rush;const pulse=1+(reduceMotion?0:Math.sin(now*.008)*.006)+rush*.035;group.scale.setScalar(fitScale*pulse);warm.position.x=2+pointer.x*2.1;warm.position.y=1-pointer.y*1.8;violet.position.x=-2+pointer.x*1.4;violet.position.y=-2-pointer.y*1.2;pointer.energy*=.91;if(pointer.energy<.01)pointer.energy=0;}renderer.render(scene,camera);}};
    if(window.gsap)gsap.ticker.add(draw);else{const loop=()=>{draw();requestAnimationFrame(loop);};requestAnimationFrame(loop);}
    if(window.gsap&&window.ScrollTrigger&&!reduceMotion){gsap.registerPlugin(ScrollTrigger);gsap.to(scrollGroup.rotation,{y:"+=1.05",x:"+=.35",ease:"none",scrollTrigger:{trigger:".page-hero",start:"top top",end:"bottom top",scrub:.8}});}
  }catch(error){console.warn("Navrix 3D scene unavailable; CSS artwork remains visible.",error);}
}
