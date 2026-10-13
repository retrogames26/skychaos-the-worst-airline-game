import * as THREE from 'three';
import './style.css';

const root = document.getElementById('game-root');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x82c9f3);
scene.fog = new THREE.Fog(0x82c9f3, 24, 85);
const camera = new THREE.PerspectiveCamera(76, innerWidth / innerHeight, .1, 180);
camera.rotation.order = 'YXZ';
const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
renderer.setSize(innerWidth, innerHeight); renderer.setPixelRatio(Math.min(devicePixelRatio, 1.7));
renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.08;
root.prepend(renderer.domElement);

scene.add(new THREE.HemisphereLight(0xc8e8ff, 0x4b3540, 2.05));
const sun = new THREE.DirectionalLight(0xfff1d6, 2.5); sun.position.set(-4, 9, 3); sun.castShadow = true; sun.shadow.mapSize.set(1024,1024); scene.add(sun);
const mat = (color, roughness=.8, metalness=0) => new THREE.MeshStandardMaterial({color,roughness,metalness});
const M = {wall:mat(0xe9e5df),wallShade:mat(0xc9cbd0),floor:mat(0x263b54),floorLine:mat(0x59718a),seat:mat(0x1678bc),seatDark:mat(0x10517e),seatHead:mat(0x35a2dc),trim:mat(0x8b969f),dark:mat(0x192534),metal:mat(0x889aa6,.35,.65),yellow:mat(0xf5bd3f),red:mat(0xe45755),green:mat(0x57d9a3),skin:mat(0xf0b58c),hair:mat(0x52372a),shirt:mat(0x4b91c7),pants:mat(0x29384a),food:mat(0xe7aa4d),white:mat(0xfaf5e9)};
const cabin = new THREE.Group(); scene.add(cabin);
function box(parent, name, size, position, material, options={}) { const mesh=new THREE.Mesh(new THREE.BoxGeometry(...size),material); mesh.name=name; mesh.position.set(...position); mesh.castShadow=true; mesh.receiveShadow=true; if(options.rotation)mesh.rotation.set(...options.rotation); parent.add(mesh); return mesh; }
function cylinder(parent,name,r1,r2,h,position,material,segments=16){const mesh=new THREE.Mesh(new THREE.CylinderGeometry(r1,r2,h,segments),material);mesh.name=name;mesh.position.set(...position);mesh.castShadow=true;parent.add(mesh);return mesh;}
// Fuselage interior: a clean, stylized cutaway so the cabin remains visible.
box(cabin,'cabin floor',[7.2,.28,24],[0,-.18,0],M.floor);
box(cabin,'left cabin wall',[.22,3.8,24],[-3.55,1.55,0],M.wall);
box(cabin,'right cabin wall',[.22,3.8,24],[3.55,1.55,0],M.wall);
box(cabin,'cabin ceiling',[7.2,.22,24],[0,3.42,0],M.wall);
box(cabin,'aisle runner',[1.2,.025,22],[0,-.02,0],mat(0x344a60));
// Wall ribs, windows and trim.
for(const side of [-1,1]){
  box(cabin,'wall trim',[.18,.12,24],[side*3.39,2.55,0],M.wallShade);
  for(let z=-10.5;z<=10.5;z+=3){
    box(cabin,'window frame',[.12,1.05,1.85],[side*3.42,2.22,z],M.trim);
    box(cabin,'window sky',[.05,.83,1.62],[side*3.34,2.23,z],mat(0x7bc9f5,.25));
    // cloud puffs behind windows
    for(let c=0;c<3;c++){const cloud=new THREE.Mesh(new THREE.SphereGeometry(.22+c*.08,10,8),mat(0xeaf7ff));cloud.position.set(side*3.27,1.95+c*.12,z-.35+c*.34);cabin.add(cloud);}
  }
  // overhead luggage bins
  box(cabin,'overhead bin',[.62,.48,21],[side*2.87,3.02,0],M.wallShade);
  box(cabin,'bin edge',[.05,.08,21],[side*2.54,2.78,0],M.trim);
}
// cockpit bulkhead and cockpit doorway
box(cabin,'cockpit bulkhead',[6.8,3.6,.18],[0,1.55,-11.9],M.wallShade);
box(cabin,'cockpit doorway',[1.65,2.5,.12],[0,1.15,-11.78],M.dark);
box(cabin,'cockpit light',[1.4,.06,.05],[0,2.42,-11.68],M.green);
// seat rows: two seats on each side of the aisle.
const seats=[];
for(let row=0;row<6;row++){
  const z=8.7-row*3.25;
  for(const side of [-1,1])for(const lane of [-1,1]){
    const x=side*(.8+lane*.72); const group=new THREE.Group();group.position.set(x,0,z);cabin.add(group);
    box(group,'seat cushion',[.7,.22,.82],[0,.52,0],M.seat);
    box(group,'seat back',[.72,1.05,.2],[0,1.05,-.31],M.seatDark);
    box(group,'seat headrest',[.54,.32,.23],[0,1.55,-.3],M.seatHead);
    box(group,'armrest',[.11,.25,.82],[-.39,.66,0],M.trim);box(group,'armrest',[.11,.25,.82],[.39,.66,0],M.trim);
    seats.push({x,z,group});
  }
}
// Cockpit instrument console and windshield.
box(cabin,'dashboard',[4.5,.55,1.3],[0,1.05,-11.05],M.dark);
for(let i=0;i<7;i++){box(cabin,'display',[.42,.3,.04],[-1.8+i*.6,1.36,-10.55],mat([0x26b4c9,0x49d8a0,0x327bb5][i%3],.3));}
box(cabin,'yoke post',[.12,.65,.12],[0,1.25,-10.25],M.metal);cylinder(cabin,'control yoke',.35,.35,.08,[0,1.58,-10.22],M.dark,20).rotation.x=Math.PI/2;
// Cabin crew trolley and service items.
const trolley=new THREE.Group();trolley.position.set(1.45,0,3.1);cabin.add(trolley);
box(trolley,'service trolley body',[.8,1.1,.8],[0,.68,0],M.metal);box(trolley,'trolley top',[.86,.08,.86],[0,1.25,0],M.dark);
for(let x of [-.27,.27])for(let z of [-.28,.28])cylinder(trolley,'trolley wheel',.11,.11,.09,[x,.12,z],M.dark,12).rotation.z=Math.PI/2;
for(let i=0;i<3;i++){box(trolley,'burger bun',[.24,.12,.24],[-.2+i*.2,1.37,0],M.food);box(trolley,'burger filling',[.24,.035,.24],[-.2+i*.2,1.31,0],M.green);}
// Loose luggage prop
const suitcase=box(cabin,'loose luggage',[.65,.38,.4],[1.1,.15,-2.4],M.red);suitcase.rotation.z=.22;suitcase.rotation.x=.13;
box(cabin,'suitcase handle',[.25,.06,.07],[1.1,.39,-2.4],M.dark);
// Interactive task props
const taskObjects=[];
function addTask(name,position,color,description,action){const g=new THREE.Group();g.position.set(...position);cabin.add(g);const orb=new THREE.Mesh(new THREE.SphereGeometry(.13,16,12),mat(color,.35));orb.position.y=.42;g.add(orb);const ring=new THREE.Mesh(new THREE.TorusGeometry(.23,.025,8,24),mat(color,.35,.15));ring.position.y=.42;g.add(ring);taskObjects.push({name,position:new THREE.Vector3(...position),description,action,group:g,orb,ring,done:false});return g;}
addTask('Serve meal',[-1.65,.05,4.8],0x51d7a1,'Deliver the meal to passenger 01.', 'meal');
addTask('Secure luggage',[1.05,.1,-2.4],0xffc44f,'Pick up the loose suitcase and secure it.', 'luggage');
addTask('Inspect engine panel',[2.7,.1,-8.2],0xff6b6b,'Inspect the suspicious cabin maintenance panel.', 'panel');
// Passengers: charming, low-poly seated characters.
const passengers=[];
function makePassenger(seat,index){const g=new THREE.Group();g.position.set(seat.x,0,seat.z+.08);cabin.add(g);const skin=mat([0xf0b58c,0xc9865f,0xe6c29a,0x9c6547][index%4]);const hair=mat([0x53382d,0x3a3029,0x8b5a27,0x222831][index%4]);
  const torso= new THREE.Mesh(new THREE.CapsuleGeometry(.24,.42,3,7),mat([0x3c9bd1,0xe36f64,0x69b58c,0x7c83d6][index%4]));torso.position.set(0,.98,.02);g.add(torso);
  const head=new THREE.Mesh(new THREE.SphereGeometry(.27,14,12),skin);head.position.set(0,1.48,-.02);g.add(head);
  const cap=new THREE.Mesh(new THREE.SphereGeometry(.275,14,8,0,Math.PI*2,0,Math.PI/2),hair);cap.position.set(0,1.59,-.035);g.add(cap);
  for(const ex of [-.105,.105]){const eye=new THREE.Mesh(new THREE.SphereGeometry(.075,10,8),M.white);eye.position.set(ex,1.5,.21);g.add(eye);const pupil=new THREE.Mesh(new THREE.SphereGeometry(.033,8,8),M.dark);pupil.position.set(ex+.012,1.49,.274);g.add(pupil);}
  const legs=box(g,'passenger legs',[.45,.4,.4],[0,.25,.14],M.pants);legs.rotation.x=-.1;
  passengers.push({group:g,index,mood: index===0?'hungry':'calm'});return g;}
seats.slice(0,12).forEach((s,i)=>makePassenger(s,i));
// Clouds and sky volume outside the windows.
const clouds=new THREE.Group();scene.add(clouds);for(let i=0;i<70;i++){const g=new THREE.Group();const x=(Math.random()-.5)*100,y=4+Math.random()*27,z=(Math.random()-.5)*120;for(let j=0;j<4;j++){const puff=new THREE.Mesh(new THREE.SphereGeometry(1.2+Math.random()*2,8,7),mat(0xeaf7ff));puff.position.set((Math.random()-.5)*3,(Math.random()-.5)*1.8,(Math.random()-.5)*3);g.add(puff);}g.position.set(x,y,z);g.scale.setScalar(.6+Math.random()*1.2);clouds.add(g);}
// Distant horizon and sun.
const sunMesh=new THREE.Mesh(new THREE.SphereGeometry(3,16,12),new THREE.MeshBasicMaterial({color:0xfff0bb}));sunMesh.position.set(-28,20,-65);scene.add(sunMesh);

const ui={start:document.getElementById('start-screen'),startButton:document.getElementById('start-button'),result:document.getElementById('result-screen'),restart:document.getElementById('restart-button'),prompt:document.getElementById('prompt'),event:document.getElementById('event-banner'),center:document.getElementById('center-message'),altitude:document.getElementById('altitude'),mood:document.getElementById('mood'),cash:document.getElementById('cash'),title:document.getElementById('objective-title'),desc:document.getElementById('objective-desc'),fill:document.getElementById('progress-fill'),progress:document.getElementById('progress-label'),resultCopy:document.getElementById('result-copy'),resultTotal:document.getElementById('result-total')};
const duties=[{title:'Make the cabin slightly less terrible',desc:'Find the passenger with the food request and deliver a meal.'},{title:'Secure the loose luggage',desc:'That suitcase is one bump away from becoming a projectile.'},{title:'Inspect the suspicious panel',desc:'A red light is blinking. It is probably fine. Probably.'}];
let active=false,completed=0,cash=0,elapsed=0,eventTimer=0,eventCooldown=13,turbulence=0,nearTask=null,win=false;const keys={};let yaw=0,pitch=0;const player=new THREE.Vector3(0,1.65,10.5);const velocity=new THREE.Vector3();const raycaster=new THREE.Raycaster();
function setDuty(){const d=duties[Math.min(completed,2)];if(d){ui.title.textContent=d.title;ui.desc.textContent=d.desc;}ui.fill.style.width=`${completed/3*100}%`;ui.progress.textContent=`${completed} / 3 duties complete`;}
function showEvent(text,duration=3.5){ui.event.textContent=text;ui.event.classList.remove('hidden');eventTimer=duration;}
function interact(task){if(!task||task.done)return;task.done=true;task.orb.material=mat(0x57d9a3);task.ring.material=mat(0x57d9a3);task.group.scale.setScalar(.65);completed++;cash+=150;ui.cash.textContent=`$${cash}`;ui.mood.textContent=completed===3?'Suspiciously happy':completed===2?'Less panicked':'Slightly calmer';showEvent(['MEAL DELIVERED! Passenger gave you a suspicious thumbs-up.','LUGGAGE SECURED! It can no longer achieve flight on its own.','PANEL INSPECTED! You tightened a screw. It made a reassuring noise.'][['meal','luggage','panel'].indexOf(task.action)]);setDuty();if(completed>=3){setTimeout(()=>finish(true),1200);}}
function finish(success){if(win)return;win=true;active=false;document.exitPointerLock?.();ui.result.classList.remove('hidden');ui.resultCopy.textContent=success?'All three duties completed. The plane is still in the air, which management calls a success.':'The flight ended early. Management has asked that you not put this on your résumé.';ui.resultTotal.textContent=`$${cash+(success?300:0)}`;}
function reset(){completed=0;cash=0;elapsed=0;eventTimer=0;eventCooldown=13;turbulence=0;win=false;player.set(0,1.65,10.5);yaw=0;pitch=0;camera.rotation.set(0,0,0);ui.cash.textContent='$0';ui.mood.textContent='Mostly nervous';ui.result.classList.add('hidden');ui.event.classList.add('hidden');taskObjects.forEach(t=>{t.done=false;t.group.scale.setScalar(1);t.orb.material=mat(t.action==='meal'?0x51d7a1:t.action==='luggage'?0xffc44f:0xff6b6b,.35);t.ring.material=mat(t.action==='meal'?0x51d7a1:t.action==='luggage'?0xffc44f:0xff6b6b,.35,.15)});setDuty();}
function begin(){reset();ui.start.classList.add('hidden');active=true;renderer.domElement.requestPointerLock?.();}
ui.startButton.addEventListener('click',begin);ui.restart.addEventListener('click',()=>{ui.start.classList.remove('hidden');reset();});
document.addEventListener('pointerlockchange',()=>{if(document.pointerLockElement!==renderer.domElement&&active){/* Pause looking; movement can resume after click. */}});
document.addEventListener('mousemove',e=>{if(document.pointerLockElement===renderer.domElement&&active){yaw-=e.movementX*.0022;pitch-=e.movementY*.0022;pitch=THREE.MathUtils.clamp(pitch,-1.35,1.35);camera.rotation.set(pitch,yaw,0);}});
document.addEventListener('keydown',e=>{keys[e.code]=true;if(['Space','ArrowUp','ArrowDown'].includes(e.code))e.preventDefault();if(e.code==='KeyE'&&active&&nearTask)interact(nearTask);if(e.code==='KeyR'&&active)reset();});document.addEventListener('keyup',e=>keys[e.code]=false);renderer.domElement.addEventListener('click',()=>{if(active&&document.pointerLockElement!==renderer.domElement)renderer.domElement.requestPointerLock?.();});
function cabinCollision(p){const radius=.28;return p.x < -3.08+radius || p.x > 3.08-radius || p.z < -11.45 || p.z > 11.35;}
function updatePlayer(dt){const direction=new THREE.Vector3();if(keys.KeyW||keys.ArrowUp)direction.z-=1;if(keys.KeyS||keys.ArrowDown)direction.z+=1;if(keys.KeyA||keys.ArrowLeft)direction.x-=1;if(keys.KeyD||keys.ArrowRight)direction.x+=1;if(direction.lengthSq()>0){direction.normalize().applyAxisAngle(new THREE.Vector3(0,1,0),yaw);const speed=keys.ShiftLeft?5.1:3.4;velocity.x=direction.x*speed;velocity.z=direction.z*speed;}else{velocity.x*=Math.pow(.001,dt);velocity.z*=Math.pow(.001,dt);}const next=player.clone().addScaledVector(velocity,dt);if(!cabinCollision(next))player.copy(next);else{const tryX=player.clone();tryX.x=next.x;if(!cabinCollision(tryX))player.x=next.x;const tryZ=player.clone();tryZ.z=next.z;if(!cabinCollision(tryZ))player.z=next.z;}camera.position.copy(player);camera.position.y=1.65+Math.sin(elapsed*8)*.018+(turbulence>0?Math.sin(elapsed*27)*.05:0);}
function updateTasks(){nearTask=null;let best=2.1;for(const t of taskObjects){if(t.done)continue;t.group.position.y=.08+Math.sin(elapsed*2.5+t.position.z)*.06;t.ring.rotation.y=elapsed*.7;const dist=player.distanceTo(t.position);if(dist<best){best=dist;nearTask=t;}}if(nearTask){ui.prompt.textContent=`E — ${nearTask.name}`;ui.prompt.classList.remove('hidden');}else ui.prompt.classList.add('hidden');}
function updateWorld(dt){elapsed+=dt;clouds.position.z+=dt*.45;if(clouds.position.z>25)clouds.position.z=-25;const flight=8500+Math.sin(elapsed*.17)*1600;ui.altitude.textContent=`${Math.round(flight).toLocaleString()} ft`;eventCooldown-=dt;if(eventCooldown<=0&&completed<3){eventCooldown=18+Math.random()*10;turbulence=3.5;showEvent(['⚠ TURBULENCE! Hold on to your snacks!','⚠ AIR POCKET! Loose objects are having a big day!','⚠ PASSENGER COMPLAINT! The clouds are “too fluffy.”'][Math.floor(Math.random()*3)],3.5);suitcase.position.x=1.1+Math.sin(elapsed*12)*.32;suitcase.rotation.z=Math.sin(elapsed*11)*.28;}
if(turbulence>0){turbulence-=dt;for(const p of passengers){p.group.rotation.z=Math.sin(elapsed*19+p.index)*.05;}if(turbulence<=0){suitcase.position.set(1.1,.15,-2.4);suitcase.rotation.z=.22;}}
if(eventTimer>0){eventTimer-=dt;if(eventTimer<=0)ui.event.classList.add('hidden');}}
function animate(){requestAnimationFrame(animate);const dt=Math.min(clock.getDelta(),.04);if(active){updateWorld(dt);updatePlayer(dt);updateTasks();}else{elapsed+=dt;camera.position.set(0,1.65,10.5);camera.rotation.set(-.04,Math.sin(elapsed*.12)*.025,0);}renderer.render(scene,camera);}
const clock=new THREE.Clock();setDuty();animate();
addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);renderer.setPixelRatio(Math.min(devicePixelRatio,1.7));});
