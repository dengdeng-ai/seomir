(function(){
  var T=THREE;
  var LINE=0x2B1E3F;
  var mats={};
  var gd=new Uint8Array([105,105,105,255, 160,160,160,255, 205,205,205,255, 240,240,240,255]);
  var GRAD=new T.DataTexture(gd,4,1,T.RGBAFormat);GRAD.minFilter=GRAD.magFilter=T.NearestFilter;GRAD.needsUpdate=true;
  function M(c,o){var k=c+'|'+(o||'');if(mats[k])return mats[k];
    var m=new T.MeshPhongMaterial({color:c,shininess:70,specular:0x7a7a7a,flatShading:false});
    if(o){m.transparent=true;m.opacity=o;m.depthWrite=false;m.side=T.DoubleSide;m.shininess=120;m.specular=new T.Color(0xffffff)}
    return mats[k]=m}
  var edgeMat=new T.LineBasicMaterial({color:LINE,transparent:true,opacity:.85});
  var edgeSoft=new T.LineBasicMaterial({color:LINE,transparent:true,opacity:.35});
  function mesh(g,c,o){return new T.Mesh(g,M(c,o))}
  var GC={};function ico(r,d){var k=r+'_'+d;if(!GC[k]){GC[k]=new T.IcosahedronGeometry(r,d==null?2:3);GC[k].__keep=true}return GC[k]}

  var C={glass:0xB9C6F2,pink:0xF7A6C4,pink2:0xE8508A,gum:0xE8508A,red:0xE0253C,dred:0x8E1426,cream:0xFFF3EA,choc:0x8A5A3C,dchoc:0x5E3A24,
    green:0x6FAE45,dgreen:0x3F7A2A,ice:0xB9D0FF,wafer:0xF1D5A2,wafer2:0xC99A5B,white:0xFFFFFF,lav:0xD6D1F8,yel:0xFFCF3F,purp:0x8F85DC};
  var SY={C:[0xEE4A5E,0xF98A97],G:[0xF79BBE,0xFFD0E1],K:[0x8A5A3C,0xB88A64]};

  function cherry(){var g=new T.Group();
    var b=mesh(ico(.32,1),C.red);b.scale.set(1,.92,1);g.add(b);
    var st=mesh(new T.CylinderGeometry(.03,.03,.6,4),C.green,0,false);st.position.set(.1,.36,0);st.rotation.z=-.4;g.add(st);
    var lf=mesh(new T.ConeGeometry(.1,.3,4),C.green);lf.position.set(.28,.6,0);lf.rotation.z=-1.6;g.add(lf);return g}
  function berry(){var g=new T.Group();
    var prof=[[0,-.42],[.1,-.38],[.2,-.28],[.28,-.14],[.33,0],[.35,.12],[.33,.22],[.26,.29],[.14,.32],[0,.32]];
    var body=mesh(new T.LatheGeometry(prof.map(function(p){return new T.Vector2(p[0],p[1])}),18),0xF0405A);g.add(body);
    var seedG=new T.SphereGeometry(.022,4,3);seedG.__keep=true;
    for(var row=0;row<5;row++){var y=-.3+row*.12,n=6+row;var rr=0;for(var q=0;q<prof.length-1;q++){if(prof[q][1]<=y&&prof[q+1][1]>=y){var f=(y-prof[q][1])/(prof[q+1][1]-prof[q][1]);rr=prof[q][0]+(prof[q+1][0]-prof[q][0])*f}}
      for(var i=0;i<n;i++){var a=i/n*Math.PI*2+row*.35;var sd=new T.Mesh(seedG,M(0xFFE39A));sd.position.set(Math.cos(a)*rr,y,Math.sin(a)*rr);g.add(sd)}}
    for(var i=0;i<6;i++){var lf=mesh(new T.ConeGeometry(.07,.26,4),C.green);var a=i/6*Math.PI*2;lf.position.set(Math.cos(a)*.13,.33,Math.sin(a)*.13);lf.rotation.set(Math.sin(a)*1.25,0,-Math.cos(a)*1.25);g.add(lf)}
    var st=mesh(new T.CylinderGeometry(.03,.04,.16,6),C.dgreen);st.position.y=.42;g.add(st);
    return g}
  var SCG=null;
  function scoopGeo(){if(SCG)return SCG;
    var base=new T.Color(0xF7A6C4),rip=new T.Color(0xB8326A),lite=new T.Color(0xFBC9DB);
    function col(x,y,z){var a=Math.atan2(z,x);var v=Math.sin(a*2+y*5.5);var w=Math.sin(a*3-y*7+1.3);
      if(v>.9||(w>.95&&y>-.2))return rip;var n=Math.sin(x*23)*Math.sin(y*19)*Math.sin(z*21);return n>.8?lite:base}
    function rough(x,y,z){return 1+.035*Math.sin(x*17+y*3)*Math.sin(y*15)*Math.sin(z*19+x*2)+.02*Math.sin(x*41)*Math.sin(z*37)}
    var ball=new T.IcosahedronGeometry(.74,5),p=ball.attributes.position,cs=[],nm=[];
    for(var i=0;i<p.count;i++){var x=p.getX(i),y=p.getY(i),z=p.getZ(i),r=rough(x,y,z);var L=Math.hypot(x,y,z);nm.push(x/L,y/L,z/L);if(y<-.5){y=-.5+(y+.5)*.4}p.setXYZ(i,x*r,y*r,z*r);var c=col(x,y,z);cs.push(c.r,c.g,c.b)}
    ball.setAttribute('color',new T.Float32BufferAttribute(cs,3));ball.setAttribute('normal',new T.Float32BufferAttribute(nm,3));
    var prof=[[.45,-.46],[.62,-.5],[.76,-.47],[.84,-.4],[.81,-.32],[.7,-.27],[.58,-.25]];
    var sk=new T.LatheGeometry(prof.map(function(q){return new T.Vector2(q[0],q[1])}),72),q=sk.attributes.position,cs2=[];
    for(var i=0;i<q.count;i++){var x=q.getX(i),y=q.getY(i),z=q.getZ(i),a=Math.atan2(z,x),rr=Math.hypot(x,z);
      var k=Math.max(0,(rr-.5)/.34);var rad=1+k*(.06*Math.sin(a*9)+.03*Math.sin(a*4+1));var dy=k*(.06*Math.sin(a*7+.5)+.03*Math.sin(a*13));
      q.setXYZ(i,x*rad,y+dy,z*rad);var c=(Math.sin(a*5)>.88)?rip:(Math.sin(a*17+y*30)>.6?lite:base);cs2.push(c.r,c.g,c.b)}
    sk.setAttribute('color',new T.Float32BufferAttribute(cs2,3));sk.computeVertexNormals();
    SCG=[ball,sk];ball.__keep=sk.__keep=true;return SCG}
  var SCM=new T.MeshPhongMaterial({vertexColors:true,shininess:25,specular:0x444444,side:T.DoubleSide});
  function scoop(){var g=new T.Group(),gs=scoopGeo();g.add(new T.Mesh(gs[0],SCM));g.add(new T.Mesh(gs[1],SCM));g.position.y=.1;var w=new T.Group();w.add(g);return w}
  var SWG=null;
  function swirlGeo(){if(SWG)return SWG;
    var pts=[],turns=2.6,N=90;for(var i=0;i<=N;i++){var t=i/N,a=t*turns*Math.PI*2,r=.52*(1-t*.82),y=t*.78;pts.push(new T.Vector3(Math.cos(a)*r,y,Math.sin(a)*r))}
    var path=new T.CatmullRomCurve3(pts);
    var sh=new T.Shape();var n=7;for(var i=0;i<n*2;i++){var ang=i/(n*2)*Math.PI*2,rr=i%2?.13:.2;var px=Math.cos(ang)*rr,py=Math.sin(ang)*rr;if(i)sh.lineTo(px,py);else sh.moveTo(px,py)}
    SWG=new T.ExtrudeGeometry(sh,{steps:140,extrudePath:path,bevelEnabled:false});SWG.computeVertexNormals();SWG.__keep=true;return SWG}
  function swirl(){var g=new T.Group();
    var body=mesh(swirlGeo(),C.cream);g.add(body);
    var core=mesh(new T.CylinderGeometry(.36,.48,.5,20),C.cream);core.position.y=.18;g.add(core);
    var tip=mesh(new T.ConeGeometry(.12,.3,10),C.cream);tip.position.y=.92;g.add(tip);
    g.position.y=.12;var w=new T.Group();w.add(g);return w}
  function creamCloud(){var g=new T.Group();[[0,0,0,.42],[.4,-.05,.1,.32],[-.4,-.05,-.05,.33],[.05,-.04,.4,.3],[0,.3,0,.3],[0,-.04,-.38,.3]].forEach(function(p){var s=mesh(ico(p[3],0),C.cream);s.position.set(p[0],p[1],p[2]);g.add(s)});return g}
  function sprinkles(g,y,r){var cs=[C.red,C.yel,C.green,C.purp,C.gum];for(var i=0;i<14;i++){var b=mesh(new T.BoxGeometry(.14,.04,.04),cs[i%5],0,false);var a=i*2.4,rr=Math.sqrt((i+1)/14)*r;b.position.set(Math.cos(a)*rr,y+(1-rr/r)*.25,Math.sin(a)*rr);b.rotation.y=a;g.add(b)}}
  function wafer(){var g=new T.Group();[[-.08,0],[.1,.05]].forEach(function(p,i){var w=mesh(new T.CylinderGeometry(.13,.13,1.7,8),i?C.wafer2:C.wafer);w.position.set(p[0],0,p[1]);g.add(w)});return g}
  function bottle(c,lc){var g=new T.Group();var b=mesh(new T.CylinderGeometry(.42,.46,1.1,16),c);b.position.y=.55;g.add(b);
    var sh=mesh(new T.CylinderGeometry(.16,.42,.35,16),c);sh.position.y=1.27;g.add(sh);
    var nk=mesh(new T.CylinderGeometry(.15,.15,.25,16),C.white);nk.position.y=1.55;g.add(nk);
    var cap=mesh(new T.CylinderGeometry(.18,.18,.16,16),C.pink2);cap.position.y=1.74;g.add(cap);
    var lb=mesh(new T.CylinderGeometry(.435,.435,.45,16,1,true),0xFFF6F0,0,false);lb.position.y=.55;g.add(lb);
    var dot=box(.3,.06,.02,lc);dot.position.set(0,.55,.44);g.add(dot);return g}

  var GLASS=new T.MeshPhongMaterial({color:0xDCE4FF,transparent:true,opacity:.32,depthWrite:false,side:T.DoubleSide,shininess:160,specular:0xffffff});
  function gmesh(g){return new T.Mesh(g,GLASS)}
  function cupGeo(){return new T.CylinderGeometry(1.0,.78,2.4,28,1,true)}
  var parfaitPts=[[0,0],[.88,0],[.9,.06],[.85,.12],[.2,.2],[.13,.3],[.12,1.1],[.22,1.25],[.6,1.42],[.98,1.68],[1.24,2.0],[1.36,2.32],[1.38,2.5]];
  function parfaitGeo(){return new T.LatheGeometry(parfaitPts.map(function(p){return new T.Vector2(p[0],p[1])}),32)}
  function cup(){var g=new T.Group();var w=gmesh(cupGeo());w.position.y=1.2;g.add(w);var bt=gmesh(new T.CylinderGeometry(.78,.8,.3,28));bt.position.y=.15;g.add(bt);
    var rim=mesh(new T.TorusGeometry(1.0,.04,6,40),0xEEF2FF);rim.rotation.x=Math.PI/2;rim.position.y=2.4;g.add(rim);
    var hl=mesh(new T.BoxGeometry(.08,1.7,.02),0xffffff,.8);hl.position.set(-.55,1.25,.7);hl.rotation.z=.08;g.add(hl);return g}
  function parfait(){var g=new T.Group();g.add(gmesh(parfaitGeo()));
    var rim=mesh(new T.TorusGeometry(1.38,.04,6,48),0xEEF2FF);rim.rotation.x=Math.PI/2;rim.position.y=2.5;g.add(rim);
    var stem=gmesh(new T.CylinderGeometry(.12,.16,1.0,16));stem.position.y=.65;g.add(stem);
    var hl=mesh(new T.BoxGeometry(.07,.55,.02),0xffffff,.8);hl.position.set(-.85,2.0,.75);hl.rotation.z=.5;g.add(hl);return g}

  function iceCube(){return mesh(new T.BoxGeometry(.45,.45,.45),C.ice,.75)}

  var ITEM={
    cup:cup, parfait:parfait,
    ice:function(){var g=new T.Group();[[0,0,0,.3],[.5,.05,.1,-.4],[.25,.45,-.05,.7]].forEach(function(p){var c=iceCube();c.position.set(p[0],p[1],p[2]);c.rotation.set(p[3],p[3]*1.3,.2);g.add(c)});return g},
    icecream:function(){var g=new T.Group();
      var cv=document.createElement('canvas');cv.width=64;cv.height=4;var x=cv.getContext('2d');for(var i=0;i<8;i++){x.fillStyle=i%2?'#F4A3C6':'#FFFFFF';x.fillRect(i*8,0,8,4)}
      var tx=new T.CanvasTexture(cv);tx.magFilter=T.NearestFilter;
      var cp=new T.Mesh(new T.CylinderGeometry(.85,.6,.9,32,1,true),new T.MeshPhongMaterial({map:tx,shininess:30,side:T.DoubleSide}));cp.position.y=.45;g.add(cp);
      var bt=mesh(new T.CylinderGeometry(.6,.6,.04,32),0xFFFFFF);bt.position.y=.02;g.add(bt);
      var lip=mesh(new T.TorusGeometry(.85,.05,6,40),0xFFFFFF);lip.rotation.x=Math.PI/2;lip.position.y=.9;g.add(lip);
      var sc=scoop();sc.position.y=1.3;g.add(sc);return g},
    cream:function(){var g=new T.Group();var bw=mesh(new T.LatheGeometry([[0,0],[.5,0],[.55,.05],[.85,.4],[.9,.5]].map(function(q){return new T.Vector2(q[0],q[1])}),28),0xF7C6DA);g.add(bw);var c=swirl();c.scale.setScalar(1.35);c.position.y=.32;g.add(c);return g},
    sprinkle:function(){var g=new T.Group();var j=mesh(new T.CylinderGeometry(.55,.55,1.3,16),C.glass,.5);j.position.y=.65;g.add(j);
      var lid=mesh(new T.CylinderGeometry(.6,.6,.22,16),C.gum);lid.position.y=1.42;g.add(lid);
      var cs=[C.red,C.yel,C.green,C.purp,C.gum];for(var i=0;i<26;i++){var b=mesh(new T.BoxGeometry(.16,.05,.05),cs[i%5],0,false);b.position.set(Math.cos(i*2.1)*.32*((i%3)/3+.3),.12+i*.04,Math.sin(i*2.1)*.32*((i%3)/3+.3));b.rotation.set(i,i*.7,i*1.3);g.add(b)}return g},
    syrupC:function(){return bottle(C.red,C.red)},
    syrupG:function(){return bottle(0xF79BBE,C.gum)},
    syrupK:function(){return bottle(C.choc,C.dchoc)},
    cherry:function(){var g=new T.Group();var a=cherry();a.position.set(-.25,0,0);var b=cherry();b.position.set(.25,-.05,.05);b.rotation.y=2.2;g.add(a,b);return g},
    berry:function(){var b=berry();b.rotation.set(.35,0,.3);b.scale.setScalar(1.6);return b},
    wafer:function(){var w=wafer();w.rotation.z=.6;return w},
    trash:function(){var g=new T.Group();var b=mesh(new T.CylinderGeometry(.75,.6,1.5,16),0xC3BCF5);b.position.y=.75;g.add(b);
      var band=mesh(new T.CylinderGeometry(.73,.71,.14,16),0xA79BEA);band.position.y=.45;g.add(band);var band2=band.clone();band2.position.y=1.1;band2.scale.set(1.04,1,1.04);g.add(band2);
      var rim=mesh(new T.TorusGeometry(.76,.07,6,16),0x8F85DC);rim.rotation.x=Math.PI/2;rim.position.y=1.5;g.add(rim);
      var lid=mesh(new T.CylinderGeometry(.8,.8,.12,16),0xE8508A);lid.position.set(0,1.62,0);g.add(lid);var kn=mesh(new T.CylinderGeometry(.18,.18,.14,10),0xF4A3C6);kn.position.y=1.75;g.add(kn);return g},
    blend:function(){var g=new T.Group();blenderModel(g,[],0);return g}
  };

  function buildDrink(b){
    var g=new T.Group(),has=function(k){return b.indexOf(k)>-1};
    var gl=has('cup')?'cup':has('parfait')?'parfait':null;if(!gl)return g;
    var sy=has('syrupC')?'C':has('syrupG')?'G':has('syrupK')?'K':null,BL=has('blend');
    var top;
    if(gl==='cup'){
      g.add(cup());top=2.4;
      if(sy||BL){var col=sy?SY[sy][BL?1:0]:C.pink;var h=BL?2.25:(has('icecream')?2.15:1.7);var r0=.76,r1=.76+(1-.76)*(h/2.4)*0.96;
        var lq=mesh(new T.CylinderGeometry(r1-.04,r0-.02,h,16),col,0,false);lq.position.y=.12+h/2;g.add(lq);
        if(BL){var f=creamCloud();f.scale.set(1.5,.6,1.5);f.position.y=2.35;g.add(f)}}
      if(has('ice')&&!BL)[[-.25,.6,.1,.2],[.3,1.0,-.1,-.5],[-.1,1.45,.25,.9]].forEach(function(p){var c=iceCube();c.position.set(p[0],p[1],p[2]);c.rotation.set(p[3],p[3],0);g.add(c)});
    }else{
      g.add(parfait());top=2.5;
      if(sy){var lq2=mesh(new T.CylinderGeometry(1.2,.35,.75,16),SY[sy][0],0,false);lq2.position.y=1.7;g.add(lq2)}
      if(has('ice'))[[-.4,1.9,0,.3],[.35,1.95,.1,-.4]].forEach(function(p){var c=iceCube();c.position.set(p[0],p[1],p[2]);c.rotation.set(p[3],p[3],0);g.add(c)});
    }
    var cmid=0;
    if(has('icecream')&&!BL){var sk=gl==='cup'?.86:1,s=scoop();s.scale.setScalar(sk);var sy0=top+(gl==='cup'?.05:.2);s.position.y=sy0;g.add(s);
      top=sy0+(.1+.74*1.03)*sk}
    if(has('cream')){var c2=swirl();var cs=has('icecream')?.95:1.15;c2.scale.setScalar(cs);c2.position.y=has('icecream')?top-.42:top-.15;g.add(c2);top=c2.position.y+(.12+.92)*cs;cmid=c2.position.y+.45*cs}
    if(has('sprinkle'))sprinkles(g,has('cream')?cmid:top-.25,has('cream')?.42:.5);
    if(has('wafer')){var w=wafer();w.position.set(.4,top-.2,-.1);w.rotation.z=-.45;g.add(w)}
    if(has('berry')){var be=berry();be.scale.setScalar(1.25);be.position.set(-.42,top-.55,.35);be.rotation.set(.3,0,.45);g.add(be)}
    if(has('cherry')){var ch=cherry();var bare=!has('icecream')&&!has('cream');ch.position.set(bare?.15:0,bare?top-.25:top+.2,bare?.2:0);g.add(ch)}
    if(has('spill')){for(var i=0;i<9;i++){var a=i*.7,bl=mesh(ico(.32,0),0xB9A8D8);bl.scale.set(1,.5,1);bl.position.set(Math.cos(a)*1.05,2.1-i*.18,Math.sin(a)*1.05);g.add(bl)}}
    return g;
  }

  function blenderModel(g,b,phase){
    var bp=[[0,0],[1.05,0],[1.08,.08],[1.0,.7],[.86,1.05],[.8,1.12],[0,1.12]];
    var base=mesh(new T.LatheGeometry(bp.map(function(p){return new T.Vector2(p[0],p[1])}),20),C.gum);g.add(base);
    var foot=mesh(new T.CylinderGeometry(1.1,1.12,.08,20),C.dred);foot.position.y=.02;g.add(foot);
    var panel=mesh(new T.BoxGeometry(1.0,.5,.12),0xFFF5F9);panel.position.set(0,.55,.92);panel.rotation.x=-.18;g.add(panel);
    [[-.3,0xF4A3C6],[0,phase>0?0x7CC46A:0xC3BCF5],[.3,0xF4A3C6]].forEach(function(q){var bt=mesh(new T.CylinderGeometry(.1,.1,.1,10),q[1]);bt.rotation.x=Math.PI/2-.18;bt.position.set(q[0],.56,1.0);g.add(bt)});
    var collar=mesh(new T.CylinderGeometry(.78,.82,.22,20),0xF4A3C6);collar.position.y=1.22;g.add(collar);
    var jar=new T.Group();jar.position.y=1.33;g.add(jar);
    var jg=new T.CylinderGeometry(1.0,.72,2.5,8,1,true);var jm=new T.MeshPhongMaterial({color:0xC9D6FA,transparent:true,opacity:.42,depthWrite:false,side:T.DoubleSide,flatShading:true,shininess:140,specular:0xffffff});
    var w=new T.Mesh(jg,jm);w.position.y=1.25;jar.add(w);
    var jb=mesh(new T.CylinderGeometry(.72,.72,.1,8),0xC9D6FA,.6);jb.position.y=.05;jar.add(jb);
    for(var i=1;i<4;i++){var tick=mesh(new T.BoxGeometry(.18,.03,.02),0xffffff,0);tick.position.set(-.3,.5+i*.5,.82+i*.05);tick.rotation.y=-.35;jar.add(tick)}
    var hp=new T.CurvePath();var hc=new T.CatmullRomCurve3([new T.Vector3(.9,2.2,0),new T.Vector3(1.45,2.0,0),new T.Vector3(1.5,1.1,0),new T.Vector3(1.1,.55,0),new T.Vector3(.8,.45,0)]);
    var handle=mesh(new T.TubeGeometry(hc,16,.11,8),0xF4A3C6);jar.add(handle);
    var spout=mesh(new T.ConeGeometry(.25,.4,4),0xC9D6FA,.5);spout.rotation.z=Math.PI/2;spout.position.set(-1.05,2.35,0);jar.add(spout);
    var blade=new T.Group();blade.position.y=.22;[0,1].forEach(function(i){var bl=mesh(new T.BoxGeometry(.8,.04,.12),0xC3BCF5);bl.rotation.y=i*Math.PI/2;bl.rotation.x=i?.3:-.3;blade.add(bl)});var hub=mesh(new T.CylinderGeometry(.1,.1,.18,10),0x8F85DC);blade.add(hub);jar.add(blade);jar.userData.blade=blade;
    var lid=mesh(new T.CylinderGeometry(1.06,1.04,.22,20),C.gum);lid.position.y=2.6;jar.add(lid);
    var lid2=mesh(new T.CylinderGeometry(.9,1.0,.1,20),0xF4A3C6);lid2.position.y=2.75;jar.add(lid2);
    var cap=mesh(new T.CylinderGeometry(.28,.3,.22,12),C.dred);cap.position.y=2.9;jar.add(cap);
    var has=function(k){return b.indexOf(k)>-1};
    if(b.length){var sy=has('syrupC')?'C':has('syrupG')?'G':has('syrupK')?'K':null;
      var col=has('spill')?0xB9A8D8:(sy?SY[sy][has('blend')||phase>0?1:0]:C.pink);
      var h=has('blend')||has('spill')?2.3:1.5;var lq=mesh(new T.CylinderGeometry(.76+.22*h/2.6,.73,h,16),col,0,false);lq.position.y=.05+h/2;jar.add(lq);
      if(phase>0||has('blend')){var f=creamCloud();f.scale.set(1.05,.35,1.05);f.position.y=h+.12;jar.add(f)}
      if(has('spill'))for(var i=0;i<8;i++){var bl=mesh(ico(.34,0),0xB9A8D8);bl.scale.set(1,.55,1);bl.position.set(Math.cos(i*.8)*1.05,2.6-i*.2,Math.sin(i*.8)*1.05);jar.add(bl)}
    }
    g.userData.jar=jar;return g}

  function plate(){var g=new T.Group();
    var pr=[[0,.02],[1.0,.02],[1.05,0],[1.15,0],[1.25,.05],[1.6,.16],[1.78,.22],[1.8,.26],[1.76,.27],[1.55,.2],[1.2,.1],[0,.1]];
    var p=mesh(new T.LatheGeometry(pr.map(function(q){return new T.Vector2(q[0],q[1])}),40),0xFFFFFF);g.add(p);
    var rim=mesh(new T.TorusGeometry(1.75,.035,6,48),0xF4A3C6);rim.rotation.x=Math.PI/2;rim.position.y=.255;g.add(rim);
    var ring=mesh(new T.TorusGeometry(1.25,.02,4,40),0xFBD6E4);ring.rotation.x=Math.PI/2;ring.position.y=.11;g.add(ring);
    g.position.y=-.1;return g}

  function lights(sc){sc.add(new T.AmbientLight(0xffffff,.35));sc.add(new T.HemisphereLight(0xffffff,0x9A8FD6,.35));var d=new T.DirectionalLight(0xffffff,.65);d.position.set(-3,5,6);sc.add(d)}

  var snapR=null,snapS=null,cache={};
  function snapshot(obj,w,h,key,tilt){
    if(key&&cache[key])return cache[key];
    if(!snapR){snapR=new T.WebGLRenderer({antialias:false,alpha:true,preserveDrawingBuffer:true});snapR.setPixelRatio(1)}
    snapR.setSize(w,h,false);
    if(!snapS){snapS=new T.Scene();lights(snapS)}var sc=snapS;var holder=new T.Group();holder.add(obj);holder.rotation.set(tilt==null?.32:tilt,-.45,0);sc.add(holder);
    var bb=new T.Box3().setFromObject(holder),c=bb.getCenter(new T.Vector3()),s=bb.getSize(new T.Vector3());
    var asp=w/h,half=Math.max(s.y/2,s.x/2/asp)*1.12;
    var cam=new T.OrthographicCamera(-half*asp,half*asp,half,-half,.1,100);cam.position.set(c.x,c.y,c.z+20);cam.lookAt(c);
    snapR.render(sc,cam);var url=snapR.domElement.toDataURL();sc.remove(holder);holder.traverse(function(c){if(c.geometry&&!c.geometry.__keep)c.geometry.dispose()});if(key)cache[key]=url;return url;
  }

  function Counter(canvas,W,H){
    var r=new T.WebGLRenderer({canvas:canvas,antialias:false,alpha:true});r.setPixelRatio(1);r.setSize(Math.round(W/2),Math.round(H/2),false);
    var sc=new T.Scene();lights(sc);
    var U=60,cam=new T.OrthographicCamera(-W/2/U,W/2/U,H/2/U,-H/2/U,.1,100);
    cam.position.set(0,4,20);cam.lookAt(0,0,0);
    var root=new T.Group();sc.add(root);
    var slots={};
    function at(px,py){cam.updateMatrixWorld();
      var v=new T.Vector3((px/W)*2-1,-(py/H)*2+1,0).unproject(cam);var dir=new T.Vector3();cam.getWorldDirection(dir);
      var t=-v.z/dir.z;return v.add(dir.multiplyScalar(t))}
    function kill(o){o.traverse(function(c){if(c.geometry&&!c.geometry.__keep)c.geometry.dispose()})}
    function set(name,obj,px,py,scale){if(slots[name]){root.remove(slots[name]);kill(slots[name])}dirty=true;var p=at(px,py);obj.position.copy(p);obj.scale.setScalar(scale||1);root.add(obj);slots[name]=obj;return obj}
    var t0=performance.now(),last=0,dirty=true;
    function loop(now){requestAnimationFrame(loop);if(now-last<66&&!dirty)return;last=now;dirty=false;var t=(now-t0)/1000;
      Object.keys(slots).forEach(function(k){var o=slots[k];if(o.userData.spin)o.children[0].rotation.y=Math.sin(t*.8)*.5+(o.userData.base||0);
        if(o.userData.jar){o.rotation.x=.18;o.rotation.y=-.5+Math.sin(t*.8)*.25;var bd=o.userData.jar.userData.blade;if(bd)bd.rotation.y=o.userData.shake?t*40:0;if(o.userData.shake){o.userData.jar.position.x=Math.sin(t*90)*.03;o.userData.jar.rotation.z=Math.sin(t*70)*.02}else{o.userData.jar.position.x=0;o.userData.jar.rotation.z=0}}});
      r.render(sc,cam)}
    requestAnimationFrame(loop);
    return{set:set,get:function(n){return slots[n]},remove:function(n){if(slots[n]){root.remove(slots[n]);delete slots[n]}}};
  }


  function box(w,h,d,c){return mesh(new T.BoxGeometry(w,h,d),c)}
  ITEM.lolli=function(){var g=new T.Group();var st=mesh(new T.CylinderGeometry(.06,.06,1.5,10),0xFFFFFF);st.position.y=-.55;g.add(st);
    var c=mesh(new T.SphereGeometry(.62,24,16),0xE0253C);c.position.y=.45;c.scale.set(1,.96,1);g.add(c);
    var b=mesh(new T.TorusGeometry(.6,.07,8,32),0xF7A6C4);b.position.y=.45;b.rotation.x=1.25;b.rotation.y=.3;g.add(b);
    var w=mesh(new T.CylinderGeometry(.66,.66,.22,24,1,true),0xFFF3EA,.85);w.position.y=.42;g.add(w);
    g.rotation.z=-.35;return g};
  ITEM.guitar=function(){var g=new T.Group();var sh=new T.Shape();
    sh.moveTo(0,-1.05);sh.bezierCurveTo(.62,-1.05,.82,-.75,.72,-.45);sh.bezierCurveTo(.64,-.22,.48,-.12,.55,.12);sh.bezierCurveTo(.62,.38,.62,.62,.5,.78);sh.bezierCurveTo(.42,.86,.3,.6,.16,.42);sh.lineTo(-.16,.42);
    sh.bezierCurveTo(-.3,.5,-.38,.62,-.5,.6);sh.bezierCurveTo(-.66,.5,-.62,.28,-.55,.12);sh.bezierCurveTo(-.48,-.12,-.64,-.22,-.72,-.45);sh.bezierCurveTo(-.82,-.75,-.62,-1.05,0,-1.05);
    var body=mesh(new T.ExtrudeGeometry(sh,{depth:.2,bevelEnabled:true,bevelSize:.05,bevelThickness:.05,bevelSegments:3,curveSegments:24}),0xF8F6FF);body.position.z=-.1;g.add(body);
    var pg=new T.Shape();pg.moveTo(-.35,.4);pg.lineTo(.15,.4);pg.bezierCurveTo(.3,.2,.45,-.1,.38,-.4);pg.bezierCurveTo(.3,-.6,-.1,-.62,-.2,-.5);pg.bezierCurveTo(-.4,-.3,-.45,.1,-.35,.4);
    var guard=mesh(new T.ExtrudeGeometry(pg,{depth:.02,bevelEnabled:false,curveSegments:16}),0xF4A3C6);guard.position.z=.16;g.add(guard);
    [.15,-.1,-.35].forEach(function(y){var p=box(.28,.08,.04,0xFFFFFF);p.position.set(0,y,.19);g.add(p)});
    [[.38,-.62],[.48,-.78],[.3,-.82]].forEach(function(q){var k=mesh(new T.CylinderGeometry(.06,.06,.05,10),0xFFFFFF);k.rotation.x=Math.PI/2;k.position.set(q[0],q[1],.17);g.add(k)});
    var br=box(.32,.1,.06,0xC3BCF5);br.position.set(0,-.62,.18);g.add(br);
    var neck=box(.15,1.45,.08,0xF1D5A2);neck.position.set(0,1.12,.05);g.add(neck);
    var fb=box(.13,1.4,.02,0x8A5A3C);fb.position.set(0,1.12,.1);g.add(fb);
    var hd=new T.Shape();hd.moveTo(-.08,0);hd.lineTo(.08,0);hd.lineTo(.2,.45);hd.bezierCurveTo(.2,.55,.05,.55,.02,.5);hd.lineTo(-.08,.1);
    var head=mesh(new T.ExtrudeGeometry(hd,{depth:.06,bevelEnabled:false}),0xF8F6FF);head.position.set(0,1.82,.02);g.add(head);
    g.rotation.z=-.5;g.scale.setScalar(.72);return g};
  ITEM.gumpack=function(){var g=new T.Group();
    var base=mesh(new T.CylinderGeometry(.45,.6,.75,20),0xE8508A);base.position.y=-.55;g.add(base);
    var plate=mesh(new T.BoxGeometry(.32,.3,.06),0xFFF5F9);plate.position.set(0,-.5,.5);g.add(plate);
    var kn=mesh(new T.CylinderGeometry(.09,.09,.08,12),0xC3BCF5);kn.rotation.x=Math.PI/2;kn.position.set(0,-.5,.55);g.add(kn);
    var ch=mesh(new T.BoxGeometry(.18,.12,.1),0x8F85DC);ch.position.set(0,-.78,.52);g.add(ch);
    var cols=[0xF79BBE,0xE8508A,0xA9B8F0,0xFFF5F9,0xC3BCF5,0xF4A3C6],k=0;
    for(var i=0;i<26;i++){var u=(i*.618)%1,v=(i*.37+.1)%1;var th=u*Math.PI*2,ph=Math.acos(1-2*v*.8);var r=.42;
      var x=Math.cos(th)*Math.sin(ph)*r,z=Math.sin(th)*Math.sin(ph)*r,y=-Math.cos(ph)*r*.9+.22;
      var b=mesh(new T.SphereGeometry(.13,10,8),cols[i%6]);b.position.set(x,y,z);g.add(b)}
    var gl=mesh(new T.SphereGeometry(.62,28,20),0xE8F0FF,.3);gl.position.y=.3;g.add(gl);
    var hl=mesh(new T.SphereGeometry(.1,10,8),0xFFFFFF,.8);hl.scale.set(1,1.6,.4);hl.position.set(-.3,.5,.45);g.add(hl);
    var cap=mesh(new T.CylinderGeometry(.22,.3,.18,16),0xE8508A);cap.position.y=.93;g.add(cap);
    var tp=mesh(new T.SphereGeometry(.1,10,8),0xF4A3C6);tp.position.y=1.06;g.add(tp);
    g.scale.setScalar(.95);return g};
  ITEM.book=function(){var g=new T.Group();var c=box(1.0,1.35,.24,0xE8508A);g.add(c);var p=box(.9,1.27,.2,0xFFF9F2);p.position.x=.07;g.add(p);
    var lb=box(.6,.3,.02,0xFFF5F9);lb.position.set(.05,.25,.13);g.add(lb);var ln=box(.45,.04,.02,0xFBD6E4);ln.position.set(.05,-.05,.13);g.add(ln);g.rotation.set(.1,-.45,.08);return g};
  ITEM.cd=function(){var g=new T.Group();var d=mesh(new T.CylinderGeometry(.8,.8,.04,40),0xD6DCFA);g.add(d);var r=mesh(new T.CylinderGeometry(.42,.42,.05,32),0xF7A6C4);g.add(r);var h=mesh(new T.CylinderGeometry(.12,.12,.06,20),0xECE9FF);g.add(h);
    var sh=mesh(new T.CylinderGeometry(.79,.79,.045,40,1,false,0,.7),0xF4A3C6,.5);sh.position.y=.03;g.add(sh);g.rotation.set(1.25,0,0);return g};
  ITEM.phone=function(){var g=new T.Group();var lo=box(.7,.9,.16,0xE8508A);lo.position.y=-.45;g.add(lo);var up=box(.7,.9,.16,0xF79BBE);up.position.set(0,.45,.1);up.rotation.x=.3;g.add(up);
    var sc=box(.5,.55,.02,0xA9B8F0);sc.position.set(0,.47,.2);sc.rotation.x=.3;g.add(sc);
    for(var i=0;i<3;i++)for(var j=0;j<3;j++){var k=box(.12,.08,.03,0xFFF5F9);k.position.set(-.18+i*.18,-.25-j*.17,.09);g.add(k)}
    g.rotation.set(.15,-.4,.1);return g};
  ITEM.card=function(){var g=new T.Group();var c=box(1.3,.9,.06,0xFFFFFF);g.add(c);var ph=box(.38,.46,.02,0xF7A6C4);ph.position.set(-.38,.05,.04);g.add(ph);
    for(var i=0;i<3;i++){var l=box(.55,.06,.02,i?0xC3BCF5:0xE8508A);l.position.set(.25,.2-i*.17,.04);g.add(l)}var tp=box(1.3,.16,.065,0xE8508A);tp.position.y=.37;g.add(tp);g.rotation.set(.2,-.4,.05);return g};
  ITEM.shirt=function(){var g=new T.Group();var P=0xF7A6C4,D=0xE8508A;
    var b=box(1.0,1.15,.3,P);b.position.y=-.15;g.add(b);
    [-1,1].forEach(function(s){var sl=box(.46,.42,.28,P);sl.position.set(s*.68,.2,0);sl.rotation.z=s*.55;g.add(sl);var cf=box(.3,.07,.3,D);cf.position.set(s*.86,.04,0);cf.rotation.z=s*.55;g.add(cf)});
    var nk=box(.38,.12,.32,D);nk.position.y=.45;g.add(nk);var hole=box(.26,.1,.34,0x3B2B55);hole.position.y=.46;g.add(hole);
    var h1=mesh(new T.SphereGeometry(.12,10,8),D);h1.position.set(-.1,-.08,.17);h1.scale.z=.3;g.add(h1);var h2=mesh(new T.SphereGeometry(.12,10,8),D);h2.position.set(.1,-.08,.17);h2.scale.z=.3;g.add(h2);
    var hc=mesh(new T.ConeGeometry(.2,.26,4),D);hc.rotation.z=Math.PI;hc.position.set(0,-.2,.17);hc.scale.z=.3;hc.rotation.y=Math.PI/4;g.add(hc);
    g.scale.setScalar(.95);g.rotation.set(.15,-.35,.04);return g};
  ITEM.photo=function(){var g=new T.Group();var f=box(1.1,1.25,.06,0xFFFFFF);g.add(f);var p=box(.92,.88,.02,0x9EC7F2);p.position.set(0,.1,.04);g.add(p);
    var hill=mesh(new T.ConeGeometry(.35,.4,4),0xF7A6C4);hill.position.set(.15,-.15,.06);hill.scale.z=.1;g.add(hill);var sun=mesh(new T.SphereGeometry(.1,10,8),0xFFCF3F);sun.position.set(-.25,.35,.06);g.add(sun);g.rotation.set(.15,-.35,-.1);return g};
  ITEM.house=function(){var w=new T.Group();w.add(ITEM._house());w.scale.setScalar(1.25);return w};
  ITEM._house=function(){var g=new T.Group();var b=box(1.0,.75,.8,0xFFF5F9);g.add(b);var r=mesh(new T.ConeGeometry(.85,.6,4),0xE8508A);r.position.y=.67;r.rotation.y=Math.PI/4;g.add(r);
    var d=box(.25,.42,.02,0xC77FA6);d.position.set(-.18,-.16,.41);g.add(d);var w=box(.22,.22,.02,0xA9B8F0);w.position.set(.24,.05,.41);g.add(w);g.rotation.set(.2,-.5,0);return g};
  ITEM.cherry1=function(){var c=ITEM.cherry();c.scale.setScalar(1.2);return c};
  function strip(make,w,h,n,tilt){if(!snapR){snapR=new T.WebGLRenderer({antialias:false,alpha:true,preserveDrawingBuffer:true});snapR.setPixelRatio(1)}
    var cv=document.createElement('canvas');cv.width=w*n;cv.height=h;var cx=cv.getContext('2d');
    if(!snapS){snapS=new T.Scene();lights(snapS)}var obj=make();obj.rotation.y=0;var holder=new T.Group(),spin=new T.Group();spin.add(obj);holder.add(spin);holder.rotation.x=tilt==null?.18:tilt;snapS.add(holder);
    var bb=new T.Box3();for(var i=0;i<n;i++){spin.rotation.y=i/n*Math.PI*2;holder.updateMatrixWorld(true);bb.union(new T.Box3().setFromObject(holder))}
    var c=bb.getCenter(new T.Vector3()),sz=bb.getSize(new T.Vector3()),asp=w/h,half=Math.max(sz.y/2,sz.x/2/asp)*1.08;
    var cam=new T.OrthographicCamera(-half*asp,half*asp,half,-half,.1,100);cam.position.set(c.x,c.y,c.z+20);cam.lookAt(c);snapR.setSize(w,h,false);
    for(var i=0;i<n;i++){spin.rotation.y=i/n*Math.PI*2;snapR.render(snapS,cam);cx.drawImage(snapR.domElement,i*w,0)}
    snapS.remove(holder);return cv.toDataURL()}
  window.LP={item:function(k){return ITEM[k]()},drink:buildDrink,blender:function(b,phase){var g=new T.Group();blenderModel(g,b,phase);return g},plate:plate,snapshot:snapshot,strip:strip,Counter:Counter};
})();
