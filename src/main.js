import * as THREE from 'three';
import './style.css';

// SKY CHAOS — airport-to-flight playable prototype. Original procedural assets.
const root = document.getElementById('game-root');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x8acaf0);
scene.fog = new THREE.Fog(0x8acaf0, 70, 240);
const camera = new THREE.PerspectiveCamera(74, innerWidth / innerHeight, .1, 450);
camera.rotation.order = 'YXZ';
const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
renderer.setSize(innerWidth, innerHeight); renderer.setPixelRatio(Math.min(devicePixelRatio, 1.7));
renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.12;
root.prepend(renderer.domElement);
scene.add(new THREE.HemisphereLight(0xd9efff, 0x6c695d, 2.0));
const sun = new THREE.DirectionalLight(0xfff2d8, 2.7); sun.position.set(-35, 60, 25); sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048); scene.add(sun);
const mat = (color, roughness=.78, metalness=0) => new THREE.MeshStandardMaterial({ color, roughness, metalness });
const M = {
  concrete:mat(0x777f88), apron:mat(0x8d969d), stripe:mat(0xf6f0d8), grass:mat(0x56805a), terminal:mat(0xd8e0e4), glass:mat(0x4f91b2,.22,.15),
  fuselage:mat(0xf4f2eb,.38,.12), belly:mat(0xced8df,.5,.15), blue:mat(0x1474b8,.42,.12), blueDark:mat(0x0b416e,.45,.1), yellow:mat(0xffc53d), rubber:mat(0x252b31), metal:mat(0x8797a1,.3,.65),
  wall:mat(0xe9e5df), wallShade:mat(0xc9cbd0), floor:mat(0x263b54), seat:mat(0x1678bc), seatDark:mat(0x10517e), seatHead:mat(0x35a2dc), trim:mat(0x8b969f), dark:mat(0x192534), red:mat(0xe45755), green:mat(0x57d9a3), skin:mat(0xf0b58c), food:mat(0xe7aa4d), white:mat(0xfaf5e9), black:mat(0x151d27)
};
function box(parent,name,size,pos,material,opts={}) { const o=new THREE.Mesh(new THREE.BoxGeometry(...size),material); o.name=name; o.position.set(...pos); o.castShadow=true; o.receiveShadow=true; if(opts.rot)o.rotation.set(...opts.rot); parent.add(o); return o; }
function cyl(parent,name,rTop,rBottom,h,pos,material,segments=20,rot=null){const o=new THREE.Mesh(new THREE.CylinderGeometry(rTop,rBottom,h,segments),material);o.name=name;o.position.set(...pos);if(rot)o.rotation.set(...rot);o.castShadow=true;parent.add(o);return o;}
function sphere(parent,name,r,pos,material,scale=[1,1,1]){const o=new THREE.Mesh(new THREE.SphereGeometry(r,18,14),material);o.name=name;o.position.set(...pos);o.scale.set(...scale);o.castShadow=true;parent.add(o);return o;}

// Airport apron and terminal: the game starts outside the aircraft.
const airport = new THREE.Group(); scene.add(airport);
box(airport,'airport apron',[300,.5,300],[0,-.32,0],M.concrete);
box(airport,'taxiway',[260,.025,44],[0,-.055,-58],M.apron);
box(airport,'runway',[270,.035,24],[0,-.03,-105],M.dark);
for(let x=-125;x<=125;x+=14) box(airport,'runway centerline',[7,.045,.32],[x,-.005,-105],M.stripe);
for(let x=-120;x<=120;x+=12){box(airport,'apron marking',[.22,.035,18],[x,-.04,0],M.yellow);}
box(airport,'terminal building',[78,12,15],[0,5.6,31],M.terminal);
box(airport,'terminal roof',[80,.8,17],[0,12,31],M.white);
for(let x=-34;x<=34;x+=8){box(airport,'terminal glass',[6,6,.18],[x,6,23.35],M.glass);box(airport,'terminal mullion',[.18,6,.25],[x,6,23.2],M.white);}
box(airport,'terminal sign panel',[25,2,.3],[0,9,23],M.blue);
// sign letters are simple bright bars to remain asset-free
for(let i=0;i<9;i++) box(airport,'sign letter detail',[.55,.8,.08],[-8+i*2,9,22.78],M.white);
// Hangars and ground-service vehicles add airport scale.
for(const [x,z] of [[-76,-4],[78,2]]){box(airport,'hangar',[30,13,23],[x,6.2,z],mat(0xbac4ca));box(airport,'hangar door',[20,9,.25],[x,4.5,z-11.6],mat(0x657989));}
function makeVan(x,z,color){const g=new THREE.Group();g.position.set(x,0,z);airport.add(g);box(g,'service van body',[3.4,1.7,5],[0,1.15,0],mat(color));box(g,'van windshield',[2.8,.8,.1],[0,1.65,-2.52],M.glass);for(const wx of [-1.2,1.2])for(const wz of [-1.6,1.6])cyl(g,'van wheel',.48,.48,.25,[wx,.48,wz],M.rubber,16,[0,0,Math.PI/2]);return g;}
makeVan(-13,9,0xf0bf37); makeVan(14,10,0xdce6ed); makeVan(-20,-8,0xe65b4f);

// Full exterior airliner: fuselage, nose, cockpit windows, swept wings, tail, engines and wheels.
const plane = new THREE.Group(); plane.position.set(18,0,-4); airport.add(plane);
cyl(plane,'airliner fuselage',3.0,3.25,39,[0,5.4,0],M.fuselage,40,[Math.PI/2,0,0]);
sphere(plane,'rounded nose',3.0,[0,5.4,-19.3],M.fuselage,[1,1,1.1]);
sphere(plane,'tail cap',2.6,[0,5.4,19.0],M.fuselage,[1,1,1.15]);
// blue belly stripe
box(plane,'airline blue stripe',[5.65,.42,30],[0,3.55,0],M.blue);
box(plane,'tail fin',[.65,9.8,6],[0,10.1,16.4],M.blue);
box(plane,'tail fin accent',[.72,.75,5.5],[0,7.0,16.4],M.yellow);
for(const side of [-1,1]){
 const wing=box(plane,'swept wing',[side===-1?19:19,.38,7],[side*7.6,3.9,1.8],M.belly,{rot:[0,side*.12,side*.035]});
 box(plane,'wing blue tip',[2.2,.15,5],[side*15.5,4.1,1.9],M.blue);
 box(plane,'horizontal stabilizer',[8,.28,3],[side*3.2,8.4,16.5],M.blue);
 // jet engine pods under each wing
 const engine=cyl(plane,'jet engine nacelle',1.15,1.35,5.2,[side*7.0,2.9,1.6],M.fuselage,28,[Math.PI/2,0,0]);
 cyl(plane,'engine intake',.96,.96,.12,[side*7.0,2.9,-1.03],M.dark,28,[Math.PI/2,0,0]);
 cyl(plane,'engine inner',.5,.5,.14,[side*7.0,2.9,-1.12],M.metal,24,[Math.PI/2,0,0]);
 // passenger windows along each side
 for(let z=-14;z<=13;z+=2.35){const w=box(plane,'airliner passenger window',[.08,.46,.72],[side*2.99,6.05,z],M.glass);w.rotation.z=side*-.1;}
 // landing gear struts and wheels
 cyl(plane,'main landing gear strut',.16,.22,2.3,[side*4.2,1.75,4.5],M.metal,12);
 for(const z of [4.0,5.0])cyl(plane,'main landing wheel',.56,.56,.3,[side*4.2,.62,z],M.rubber,18,[0,0,Math.PI/2]);
}
// cockpit glazing at nose, door, and deployable stairs
for(const x of [-1.35,-.45,.45,1.35]){const w=box(plane,'cockpit windshield',[.72,.85,.12],[x,6.75,-18.2],M.glass);w.rotation.y=x*.025;}
box(plane,'entry door outline',[.16,2.45,.18],[3.02,5.25,5.2],M.blue);
box(plane,'entry door',[.08,2.12,.12],[3.12,5.25,5.2],M.fuselage);
const stairs=new THREE.Group();stairs.position.set(22,0,1.4);airport.add(stairs);
box(stairs,'boarding stairs',[2.8,2.1,5.4],[0,1.1,0],M.metal,{rot:[-.25,0,0]});
for(let i=0;i<6;i++)box(stairs,'stair tread',[3,.12,.58],[0,.28+i*.29,-2.0+i*.76],M.dark);
box(stairs,'stair platform',[3.6,.2,2.2],[0,2.45,-2.8],M.metal);

// Open cutaway cabin, connected to the airport by the E interaction at the stairs.
const cabin = new THREE.Group(); scene.add(cabin);
box(cabin,'cabin floor',[7.2,.28,24],[0,-.18,0],M.floor);
box(cabin,'left cabin wall',[.22,3.8,24],[-3.55,1.55,0],M.wall);
box(cabin,'right cabin wall',[.22,3.8,24],[3.55,1.55,0],M.wall);
box(cabin,'cabin ceiling',[7.2,.22,24],[0,3.42,0],M.wall);
box(cabin,'aisle runner',[1.2,.025,22],[0,-.02,0],mat(0x344a60));
for(const side of [-1,1]){
 box(cabin,'wall trim',[.18,.12,24],[side*3.39,2.55,0],M.wallShade);
 for(let z=-10.5;z<=10.5;z+=3){box(cabin,'window frame',[.12,1.05,1.85],[side*3.42,2.22,z],M.trim);box(cabin,'window sky',[.05,.83,1.62],[side*3.34,2.23,z],mat(0x7bc9f5,.25));for(let c=0;c<3;c++)sphere(cabin,'window cloud',.25+c*.05,[side*3.27,1.95+c*.12,z-.35+c*.34],M.white);}
 box(cabin,'overhead luggage bin',[.62,.48,21],[side*2.87,3.02,0],M.wallShade);box(cabin,'bin edge',[.05,.08,21],[side*2.54,2.78,0],M.trim);
}
// Entry door is on right side aft; cockpit door at the nose is open.
box(cabin,'rear cabin bulkhead',[6.8,3.6, .18],[0,1.55,11.9],M.wallShade);
box(cabin,'cabin entrance portal',[1.8,2.55,.18],[0,1.15,11.78],M.dark);
box(cabin,'cockpit bulkhead',[6.8,3.6,.18],[0,1.55,-11.9],M.wallShade);
box(cabin,'cockpit doorway',[1.75,2.55,.12],[0,1.15,-11.78],M.dark);
// detailed cockpit with forward windows, pilot seats, yokes and many illuminated instruments
const cockpit=new THREE.Group();cockpit.position.set(0,0,-12.0);cabin.add(cockpit);
box(cockpit,'cockpit forward console',[6.1,.65,1.0],[0,1.08,-1.1],M.dark);
for(let i=0;i<9;i++){const x=-2.45+i*.61;box(cockpit,'cockpit instrument screen',[.48,.34,.05],[x,1.48,-.61],mat([0x20b9ce,0x46d7a0,0x317bc2,0xe5b74a][i%4],.3));}
for(const x of [-1.25,1.25]){
 box(cockpit,'pilot seat base',[.75,.35,.8],[x,.5,.15],M.dark);box(cockpit,'pilot seat back',[.78,1.15,.22],[x,1.0,.43],M.blueDark);
 cyl(cockpit,'control column',.1,.12,.65,[x,1.25,-.25],M.metal,12);
 const yoke=cyl(cockpit,'flight yoke',.36,.36,.1,[x,1.57,-.25],M.dark,24,[Math.PI/2,0,0]);
}
for(let x=-2.4;x<=2.4;x+=1.2){const w=box(cockpit,'cockpit windshield',[1.08,1.05,.12],[x,2.45,-1.8],M.glass);w.rotation.z=-x*.035;}
box(cockpit,'throttle quadrant',[1.2,.25,.8],[0,1.35,.6],M.metal);

// Seats and passengers
const seats=[];
for(let row=0;row<6;row++){const z=8.7-row*3.25;for(const side of [-1,1])for(const lane of [-1,1]){const x=side*(.8+lane*.72);const group=new THREE.Group();group.position.set(x,0,z);cabin.add(group);box(group,'seat cushion',[.7,.22,.82],[0,.52,0],M.seat);box(group,'seat back',[.72,1.05,.2],[0,1.05,-.31],M.seatDark);box(group,'seat headrest',[.54,.32,.23],[0,1.55,-.3],M.seatHead);box(group,'armrest',[.11,.25,.82],[-.39,.66,0],M.trim);box(group,'armrest',[.11,.25,.82],[.39,.66,0],M.trim);seats.push({x,z,group});}}
const passengers=[];
function makePassenger(seat,index){const g=new THREE.Group();g.position.set(seat.x,0,seat.z+.08);cabin.add(g);const skin=mat([0xf0b58c,0xc9865f,0xe6c29a,0x9c6547][index%4]);const hair=mat([0x53382d,0x3a3029,0x8b5a27,0x222831][index%4]);const torso=new THREE.Mesh(new THREE.CapsuleGeometry(.24,.42,3,7),mat([0x3c9bd1,0xe36f64,0x69b58c,0x7c83d6][index%4]));torso.position.set(0,.98,.02);g.add(torso);sphere(g,'passenger head',.27,[0,1.48,-.02],skin);sphere(g,'passenger hair',.275,[0,1.59,-.035],hair,[1,1,.95]);for(const ex of [-.105,.105]){sphere(g,'passenger eye',.075,[ex,1.5,.21],M.white);sphere(g,'passenger pupil',.033,[ex+.012,1.49,.274],M.dark);}box(g,'passenger legs',[.45,.4,.4],[0,.25,.14],M.dark);passengers.push({group:g,index,mood:index===0?'hungry':'calm'});}
seats.slice(0,16).forEach((s,i)=>makePassenger(s,i));
// Food trolley, food trays, cleaning bucket, cargo crate and suitcase.
const trolley=new THREE.Group();trolley.position.set(1.45,0,3.1);cabin.add(trolley);box(trolley,'service trolley body',[.8,1.1,.8],[0,.68,0],M.metal);box(trolley,'trolley top',[.86,.08,.86],[0,1.25,0],M.dark);for(const x of [-.27,.27])for(const z of [-.28,.28])cyl(trolley,'trolley wheel',.11,.11,.09,[x,.12,z],M.dark,12,[0,0,Math.PI/2]);for(let i=0;i<3;i++){box(trolley,'meal burger bun',[.24,.12,.24],[-.2+i*.2,1.37,0],M.food);box(trolley,'meal garnish',[.24,.035,.24],[-.2+i*.2,1.31,0],M.green);}
const suitcase=box(cabin,'loose suitcase',[.65,.38,.4],[1.1,.15,-2.4],M.red);suitcase.rotation.z=.22;box(cabin,'suitcase handle',[.25,.06,.07],[1.1,.39,-2.4],M.dark);
const dangerousCrate=box(cabin,'dangerous cargo crate',[.9,.7,.9],[-1.3,.25,-5.4],M.yellow);dangerousCrate.rotation.y=.18;box(cabin,'hazard label',[.35,.3,.03],[-1.3,.3,-4.93],M.red);
const cleaningBucket=cyl(cabin,'cleaning bucket',.24,.3,.45,[2.0,.2,6.0],M.blue,16);box(cabin,'cleaning mop handle',[.06,1.25,.06],[2.45,.65,6.0],M.metal,{rot:[0,0,-.25]});
// Boarding area check-in desks and luggage props at the airport.
const checkinDesk=new THREE.Group();checkinDesk.position.set(-11,0,18);airport.add(checkinDesk);box(checkinDesk,'ticket counter',[5,1.2,1.5],[0,.8,0],M.white);box(checkinDesk,'counter front',[4.8,.75,.12],[0,.65,.78],M.blue);box(checkinDesk,'ticket scanner',[.65,.25,.55],[0,1.52,-.05],M.dark);box(checkinDesk,'scanner display',[.4,.03,.28],[0,1.66,-.06],M.green);
const rampBag=box(airport,'ramp suitcase',[.8,.65,.65],[23,.35,4.5],M.red);box(airport,'ramp suitcase handle',[.28,.06,.06],[23,.71,4.5],M.dark);

// Clouds high above the airport and later flight scenery.
const clouds=new THREE.Group();scene.add(clouds);for(let i=0;i<95;i++){const g=new THREE.Group();for(let j=0;j<4;j++)sphere(g,'cloud puff',1.2+Math.random()*2,[(Math.random()-.5)*4,(Math.random()-.5)*2,(Math.random()-.5)*4],M.white);g.position.set((Math.random()-.5)*260,24+Math.random()*40,(Math.random()-.5)*280);g.scale.setScalar(.7+Math.random()*1.2);clouds.add(g);}

// Task system. Duties are real interactions at the airport and inside the aircraft.
const tasks=[];
function addTask(id,name,description,position,where,award=100){tasks.push({id,name,description,position:new THREE.Vector3(...position),where,award,done:false});}
addTask('ticket','Check passenger tickets','Use the scanner at the check-in counter to verify the boarding list.',[-11,1.5,17.6],'airport',100);
addTask('luggage','Load passenger luggage','Load the red suitcase onto the aircraft baggage loader.',[23,.7,4.5],'airport',125);
addTask('cargo','Inspect dangerous cargo','Check the yellow hazardous-cargo crate and secure it correctly.',[-1.3,.5,-5.4],'cabin',175);
addTask('meals','Prepare flight meals','Prepare and stack meals on the service trolley.',[1.45,1.3,3.1],'cabin',100);
addTask('clean','Clean the cabin','Clean the spill near the rear seats using the mop.',[2.0,.5,6.0],'cabin',100);
addTask('announce','Make boarding announcement','Use the PA handset to announce boarding and safety instructions.',[-2.55,1.35,9.1],'cabin',100);
addTask('door','Close and secure cabin door','Close the cabin door before takeoff.',[0,1.2,11.2],'cabin',100);
// PA handset, spill, cargo loader and baggage belt are visual props.
box(cabin,'PA handset',[.16,.26,.08],[-2.55,1.35,9.1],M.yellow);sphere(cabin,'cabin spill',.22,[2.0,.035,6.0],mat(0x5d9bb6,.2),[1.6,.12,1]);
box(airport,'baggage conveyor',[2.2,1.3,4.5],[23,1.0,7.7],M.metal);box(airport,'loader belt',[2.5,.12,4.3],[23,1.75,7.7],M.dark);
// Task markers are subtle floating rings, switched to green when done.
for(const t of tasks){const p=t.where==='airport'?new THREE.Vector3(t.position.x,0,t.position.z):t.position.clone();const group=new THREE.Group();group.position.copy(p);scene.add(group);const c=t.id==='cargo'?0xffc53d:t.id==='door'?0xff665e:0x42d7a0;const orb=sphere(group,'duty marker',.15,[0,.55,0],mat(c,.35));const ring=new THREE.Mesh(new THREE.TorusGeometry(.29,.035,8,24),mat(c,.35));ring.position.y=.55;group.add(ring);t.marker=group;t.orb=orb;t.ring=ring;}
// A glowing airport boarding marker; the E key boards/exits the plane.
const boardingMarker=new THREE.Group();boardingMarker.position.set(23,0,1.2);airport.add(boardingMarker);const boardRing=new THREE.Mesh(new THREE.TorusGeometry(1.0,.06,8,32),mat(0x49d6ff,.3));boardRing.rotation.x=Math.PI/2;boardRing.position.y=.1;boardingMarker.add(boardRing);sphere(boardingMarker,'boarding orb',.18,[0,.55,0],mat(0x49d6ff));

const ui={start:document.getElementById('start-screen'),startButton:document.getElementById('start-button'),result:document.getElementById('result-screen'),restart:document.getElementById('restart-button'),prompt:document.getElementById('prompt'),event:document.getElementById('event-banner'),center:document.getElementById('center-message'),altitude:document.getElementById('altitude'),mood:document.getElementById('mood'),cash:document.getElementById('cash'),title:document.getElementById('objective-title'),desc:document.getElementById('objective-desc'),fill:document.getElementById('progress-fill'),progress:document.getElementById('progress-label'),resultCopy:document.getElementById('result-copy'),resultTotal:document.getElementById('result-total'),phase:document.getElementById('phase'),flightControls:document.getElementById('flight-controls'),flightStatus:document.getElementById('flight-status'),taskList:document.getElementById('task-list')};
let active=false,elapsed=0,cash=0,eventTimer=0,eventCooldown=16,turbulence=0,nearTask=null,nearBoard=false,nearCockpit=false,nearDoor=false,mode='airport',pilotMode=false,flightPhase='PREFLIGHT',flightTime=0,flightAltitude=0,throttle=0,doorClosed=false,win=false;const keys={};let yaw=0,pitch=0;const player=new THREE.Vector3(23,1.65,1.2);const velocity=new THREE.Vector3();
function dutiesComplete(){return tasks.every(t=>t.done);}
function taskProgress(){const done=tasks.filter(t=>t.done).length;ui.fill.style.width=`${done/tasks.length*100}%`;ui.progress.textContent=`${done} / ${tasks.length} preflight duties`;ui.taskList.innerHTML=tasks.map(t=>`<div class="task-row ${t.done?'done':''}"><span>${t.done?'✓':'○'}</span><span>${t.name}</span></div>`).join('');}
function setObjective(){const next=tasks.find(t=>!t.done);if(next){ui.title.textContent=next.name;ui.desc.textContent=next.description;}else if(flightPhase==='PREFLIGHT'){ui.title.textContent='Ready for departure';ui.desc.textContent='Enter the cockpit, press E to take the pilot seat, then use WASD to fly.';}else if(flightPhase==='AIRBORNE'){ui.title.textContent='Fly to the destination';ui.desc.textContent='Keep the aircraft stable and reach the destination altitude.';}else{ui.title.textContent='Flight complete';ui.desc.textContent='You delivered everyone and the questionable cargo.';}taskProgress();}
function showEvent(text,duration=4){ui.event.textContent=text;ui.event.classList.remove('hidden');eventTimer=duration;}
function updateHud(){ui.cash.textContent=`$${cash}`;ui.mood.textContent=passengers.filter(p=>p.mood==='upset').length?'Passengers complaining':tasks.filter(t=>t.done).length===tasks.length?'Cabin prepared':'Crew under pressure';ui.phase.textContent=pilotMode?'PILOTING':mode==='airport'?'AIRPORT / GROUND CREW':flightPhase;ui.flightControls.classList.toggle('hidden',!pilotMode);}
function completeTask(t){if(!t||t.done)return;if(t.id==='door'&&flightPhase!=='PREFLIGHT'){showEvent('Door controls are locked once the aircraft is moving.');return;}t.done=true;cash+=t.award;t.orb.material=mat(0x4be1a1);t.ring.material=mat(0x4be1a1);t.marker.scale.setScalar(.65);if(t.id==='luggage')rampBag.visible=false;if(t.id==='cargo'){dangerousCrate.material=mat(0x63b995);showEvent('DANGEROUS CARGO SECURED — hopefully it is only mildly dangerous.');}else if(t.id==='meals')showEvent('MEALS PREPPED! Gourmet cuisine, if you squint.');else if(t.id==='clean'){const spill=scene.getObjectByName('cabin spill');if(spill)spill.visible=false;showEvent('CABIN CLEANED. The mop has seen things.');}else if(t.id==='announce')showEvent('PA: “Dear passengers, welcome aboard. Please keep arms, legs, and questionable cargo inside the aircraft.”',6);else if(t.id==='ticket')showEvent('TICKETS VERIFIED — boarding list looks almost legal.');else if(t.id==='door'){doorClosed=true;showEvent('CABIN DOOR SECURED. Boarding stairs clear.');}else if(t.id==='luggage')showEvent('LUGGAGE LOADED — one bag made it onto the belt.');setObjective();updateHud();if(dutiesComplete())showEvent('PREFLIGHT COMPLETE! Head to the cockpit and take the pilot seat with E.',6);}
function enterCabin(){mode='cabin';player.set(0,1.65,10.4);yaw=0;pitch=0;camera.rotation.set(0,yaw,0);ui.center.textContent='WELCOME ABOARD — complete all preflight duties';ui.center.classList.remove('hidden');setTimeout(()=>ui.center.classList.add('hidden'),2800);showEvent('You are onboard. Check tickets, load baggage, prep meals, clean, inspect cargo and make the PA announcement.');updateHud();}
function exitCabin(){if(pilotMode){showEvent('Exit the pilot seat first with E.');return;}mode='airport';player.set(23,1.65,1.2);yaw=0;pitch=0;camera.rotation.set(0,yaw,0);showEvent('Back on the airport apron.');updateHud();}
function enterPilot(){if(!dutiesComplete()){showEvent('PREFLIGHT CHECKLIST INCOMPLETE — finish every duty before takeoff.');return;}pilotMode=true;mode='cabin';flightPhase='TAXI';flightTime=0;throttle=.22;flightAltitude=0;ui.flightStatus.textContent='TAXI — W/S pitch, A/D roll, Shift/Ctrl throttle';showEvent('PILOT SEAT ENGAGED. WASD controls the aircraft. Press E to exit the seat.');camera.position.set(0,2.5,-10.6);yaw=0;pitch=0;camera.rotation.set(0,0,0);updateHud();}
function exitPilot(){pilotMode=false;flightPhase=flightPhase==='TAXI'?'PREFLIGHT':flightPhase;camera.position.copy(player);camera.rotation.set(pitch,yaw,0);showEvent('Pilot seat exited. Press E near the cockpit seat to fly again.');updateHud();}
function finishFlight(){flightPhase='LANDED';pilotMode=false;active=false;document.exitPointerLock?.();ui.result.classList.remove('hidden');ui.resultCopy.textContent='Preflight checklist complete. The flight is landed. The passengers are alive and the cargo is mostly accounted for.';ui.resultTotal.textContent=`$${cash+500}`;ui.flightControls.classList.add('hidden');}
function reset(){active=false;mode='airport';pilotMode=false;flightPhase='PREFLIGHT';flightTime=0;flightAltitude=0;throttle=0;doorClosed=false;win=false;elapsed=0;cash=0;eventTimer=0;eventCooldown=16;turbulence=0;player.set(23,1.65,1.2);yaw=0;pitch=0;camera.rotation.set(0,yaw,0);ui.cash.textContent='$0';ui.mood.textContent='Crew under pressure';ui.result.classList.add('hidden');ui.event.classList.add('hidden');ui.flightControls.classList.add('hidden');rampBag.visible=true;dangerousCrate.material=M.yellow;const spill=scene.getObjectByName('cabin spill');if(spill)spill.visible=true;tasks.forEach(t=>{t.done=false;t.marker.scale.setScalar(1);const c=t.id==='cargo'?0xffc53d:t.id==='door'?0xff665e:0x42d7a0;t.orb.material=mat(c,.35);t.ring.material=mat(c,.35);});setObjective();updateHud();}
function begin(){reset();ui.start.classList.add('hidden');active=true;renderer.domElement.requestPointerLock?.();}
ui.startButton.addEventListener('click',begin);ui.restart.addEventListener('click',()=>{reset();ui.start.classList.remove('hidden');});
document.addEventListener('mousemove',e=>{if(document.pointerLockElement===renderer.domElement&&active&&!pilotMode){yaw-=e.movementX*.0022;pitch-=e.movementY*.0022;pitch=THREE.MathUtils.clamp(pitch,-1.25,1.25);camera.rotation.set(pitch,yaw,0);}});
document.addEventListener('keydown',e=>{keys[e.code]=true;if(['Space','ArrowUp','ArrowDown'].includes(e.code))e.preventDefault();if(e.code==='KeyE'&&active){if(pilotMode){exitPilot();return;}if(nearBoard){enterCabin();return;}if(nearDoor){exitCabin();return;}if(nearCockpit){enterPilot();return;}if(nearTask)completeTask(nearTask);}if(e.code==='KeyR'&&active)reset();});document.addEventListener('keyup',e=>keys[e.code]=false);renderer.domElement.addEventListener('click',()=>{if(active&&document.pointerLockElement!==renderer.domElement&&!pilotMode)renderer.domElement.requestPointerLock?.();});
function updatePlayer(dt){const direction=new THREE.Vector3();if(keys.KeyW||keys.ArrowUp)direction.z-=1;if(keys.KeyS||keys.ArrowDown)direction.z+=1;if(keys.KeyA||keys.ArrowLeft)direction.x-=1;if(keys.KeyD||keys.ArrowRight)direction.x+=1;if(direction.lengthSq()>0){direction.normalize().applyAxisAngle(new THREE.Vector3(0,1,0),yaw);const speed=keys.ShiftLeft?5.2:3.6;velocity.x=direction.x*speed;velocity.z=direction.z*speed;}else{velocity.x*=Math.pow(.001,dt);velocity.z*=Math.pow(.001,dt);}const next=player.clone().addScaledVector(velocity,dt);if(mode==='airport'){next.x=THREE.MathUtils.clamp(next.x,-130,130);next.z=THREE.MathUtils.clamp(next.z,-130,50);}else{next.x=THREE.MathUtils.clamp(next.x,-3.05,3.05);next.z=THREE.MathUtils.clamp(next.z,-11.4,11.4);if(next.z < -10.9 && Math.abs(next.x)>.95)next.z=-10.9;if(next.z>10.8&&Math.abs(next.x)>.92)next.z=10.8;}player.copy(next);camera.position.copy(player);camera.position.y=1.65+Math.sin(elapsed*8)*.015+(turbulence>0?Math.sin(elapsed*27)*.05:0);}
function nearestInteraction(){nearTask=null;nearBoard=false;nearCockpit=false;nearDoor=false;let best=2.5;for(const t of tasks){if(t.done||t.where!==mode)continue;const d=player.distanceTo(t.position);if(d<best){best=d;nearTask=t;}}if(mode==='airport'&&player.distanceTo(new THREE.Vector3(23,1.65,1.2))<3.8)nearBoard=true;if(mode==='cabin'&&player.distanceTo(new THREE.Vector3(0,1.65,11.2))<2.5)nearDoor=true;if(mode==='cabin'&&player.distanceTo(new THREE.Vector3(0,1.65,-9.8))<2.9)nearCockpit=true;
 if(pilotMode){ui.prompt.textContent='E — EXIT PILOT SEAT';ui.prompt.classList.remove('hidden');}else if(nearTask){ui.prompt.textContent=`E — ${nearTask.name}`;ui.prompt.classList.remove('hidden');}else if(nearBoard){ui.prompt.textContent='E — BOARD AIRCRAFT';ui.prompt.classList.remove('hidden');}else if(nearDoor){ui.prompt.textContent='E — EXIT TO AIRPORT';ui.prompt.classList.remove('hidden');}else if(nearCockpit){ui.prompt.textContent=dutiesComplete()?'E — TAKE PILOT SEAT':'E — COCKPIT (finish preflight first)';ui.prompt.classList.remove('hidden');}else ui.prompt.classList.add('hidden');}
function updateFlight(dt){if(!pilotMode)return;flightTime+=dt;const pitchInput=(keys.KeyW?1:0)-(keys.KeyS?1:0);const rollInput=(keys.KeyD?1:0)-(keys.KeyA?1:0);if(keys.ShiftLeft)throttle=Math.min(1,throttle+dt*.22);if(keys.ControlLeft)throttle=Math.max(0,throttle-dt*.22);if(flightPhase==='TAXI'&&throttle>.45){flightPhase='TAKEOFF';showEvent('TAKEOFF ROLL! Keep the nose up with W.');}if(flightPhase==='TAKEOFF'&&flightTime>5&&pitchInput>0){flightPhase='AIRBORNE';showEvent('AIRBORNE! The airline is technically flying.');}if(flightPhase==='AIRBORNE'){flightAltitude=Math.max(0,flightAltitude+pitchInput*dt*750+throttle*dt*120);flightAltitude=Math.max(0,flightAltitude);camera.rotation.x=THREE.MathUtils.clamp(-pitchInput*.09,-.15,.15);camera.rotation.z=THREE.MathUtils.clamp(-rollInput*.18,-.35,.35);ui.altitude.textContent=`${Math.round(flightAltitude).toLocaleString()} ft`;if(flightAltitude>3500&&flightTime>22){flightPhase='APPROACH';showEvent('DESTINATION IN SIGHT — lower the nose and prepare to land.');} }else if(flightPhase==='TAKEOFF'){flightAltitude=Math.max(0,flightAltitude+throttle*dt*80);ui.altitude.textContent=`${Math.round(flightAltitude)} ft`;}if(flightPhase==='APPROACH'){flightAltitude=Math.max(0,flightAltitude-(keys.KeyS?dt*300:dt*80));ui.altitude.textContent=`${Math.round(flightAltitude)} ft`;if(flightAltitude<100&&flightTime>30){showEvent('LANDING COMPLETE! Somehow, management calls this a success.');finishFlight();}}ui.flightStatus.textContent=`${flightPhase} · THROTTLE ${Math.round(throttle*100)}% · ${Math.round(flightAltitude)} ft`;}
function updateWorld(dt){elapsed+=dt;clouds.position.x+=dt*(pilotMode?1.8:.15);if(clouds.position.x>80)clouds.position.x=-80;if(turbulence>0){turbulence-=dt;for(const p of passengers)p.group.rotation.z=Math.sin(elapsed*19+p.index)*.055;}eventCooldown-=dt;if(eventCooldown<=0&&mode==='cabin'&&!pilotMode&&flightPhase!=='PREFLIGHT'){eventCooldown=20+Math.random()*12;turbulence=3.5;showEvent(['⚠ TURBULENCE! Secure loose luggage!','⚠ AIR POCKET! The cabin is now a washing machine.','⚠ PASSENGER COMPLAINT! The clouds are “too fluffy.”'][Math.floor(Math.random()*3)]);}if(eventTimer>0){eventTimer-=dt;if(eventTimer<=0)ui.event.classList.add('hidden');}if(!pilotMode&&mode==='airport')ui.altitude.textContent='GROUND';else if(!pilotMode&&flightAltitude===0)ui.altitude.textContent='0 ft';}
function animate(){requestAnimationFrame(animate);const dt=Math.min(clock.getDelta(),.04);if(active){if(!pilotMode)updatePlayer(dt);else updateFlight(dt);if(!pilotMode)nearestInteraction();updateWorld(dt);if(mode==='airport'){camera.position.copy(player);camera.position.y=1.65;}else if(pilotMode){camera.position.set(0,2.55,-10.25);}else{camera.position.copy(player);camera.position.y=1.65+Math.sin(elapsed*8)*.015+(turbulence>0?Math.sin(elapsed*27)*.05:0);}}else{camera.position.set(35,17,29);camera.lookAt(15,3,-3);}renderer.render(scene,camera);}
const clock=new THREE.Clock();setObjective();updateHud();animate();
addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);renderer.setPixelRatio(Math.min(devicePixelRatio,1.7));});
