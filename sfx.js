(function(){
  var ctx=null,master=null,muted=false;
  var bmuted=false;try{muted=localStorage.getItem('cb-mute')==='1';bmuted=localStorage.getItem('cb-bgm-mute')==='1'}catch(e){}
  function init(){if(ctx)return;var A=window.AudioContext||window.webkitAudioContext;if(!A)return;ctx=new A();master=ctx.createGain();master.gain.value=muted?0:.35;master.connect(ctx.destination)}
  function tone(f,t,d,type,v,f2){if(!ctx)return;var o=ctx.createOscillator(),g=ctx.createGain(),s=ctx.currentTime+(t||0);
    o.type=type||'square';o.frequency.setValueAtTime(f,s);if(f2)o.frequency.exponentialRampToValueAtTime(f2,s+d);
    g.gain.setValueAtTime(0,s);g.gain.linearRampToValueAtTime(v||.3,s+.005);g.gain.exponentialRampToValueAtTime(.001,s+d);
    o.connect(g);g.connect(master);o.start(s);o.stop(s+d+.02)}
  function noise(t,d,v,fq,q){if(!ctx)return;var n=ctx.sampleRate*d|0,b=ctx.createBuffer(1,n,ctx.sampleRate),a=b.getChannelData(0);for(var i=0;i<n;i++)a[i]=Math.random()*2-1;
    var src=ctx.createBufferSource();src.buffer=b;var f=ctx.createBiquadFilter();f.type='bandpass';f.frequency.value=fq||1200;f.Q.value=q||1;
    var g=ctx.createGain(),s=ctx.currentTime+(t||0);g.gain.setValueAtTime(v||.3,s);g.gain.exponentialRampToValueAtTime(.001,s+d);src.connect(f);f.connect(g);g.connect(master);src.start(s)}
  var blendNode=null,bgmEl=null,bgmHold=false;
  function bplay(){if(!bgmEl)return;if(bmuted||bgmHold){bgmEl.pause();return}var p=bgmEl.play();if(p&&p.catch)p.catch(function(){})}
  window.addEventListener('storage',function(e){if(e.key==='cb-bgm-mute'){bmuted=e.newValue==='1';bplay();if(S.onMute)S.onMute();return}if(e.key!=='cb-mute')return;muted=e.newValue==='1';if(master)master.gain.value=muted?0:.35;bplay();if(S.onMute)S.onMute()});
  var S={
    unlock:function(){init();if(ctx&&ctx.state==='suspended')ctx.resume();if(bgmEl&&bgmEl.paused)bplay()},
    voice:function(src,v){if(muted)return;var a=new Audio(src);a.volume=v||.8;var p=a.play();if(p&&p.catch)p.catch(function(){})},
    bgm:function(src,v){bgmEl=new Audio(src);bgmEl.loop=true;bgmEl.volume=v||.3;bplay()},
    bgmHold:function(h){bgmHold=h;if(!h&&bgmEl)bgmEl.currentTime=bgmEl.currentTime;bplay()},
    toggle:function(){muted=!muted;try{localStorage.setItem('cb-mute',muted?'1':'0')}catch(e){}if(master)master.gain.value=muted?0:.35;if(muted)S.blendStop();return muted},
    toggleBgm:function(){bmuted=!bmuted;try{localStorage.setItem('cb-bgm-mute',bmuted?'1':'0')}catch(e){}bplay();return bmuted},
    isBgmMuted:function(){return bmuted},
    isMuted:function(){return muted},
    blip:function(){tone(880,0,.05,'square',.12)},
    pick:function(){tone(520,0,.06,'triangle',.25,780)},
    pop:function(i){var f=620+((i||0)%6)*70;tone(f,0,.09,'square',.22,f*1.6);tone(f*2,.03,.05,'triangle',.12)},
    glass:function(){tone(1760,0,.18,'sine',.18);tone(2640,.02,.14,'sine',.1)},
    pour:function(){noise(0,.35,.25,900,.8)},
    clunk:function(){tone(140,0,.12,'square',.3,70);noise(0,.06,.2,400,2)},
    blendStart:function(){if(!ctx||blendNode)return;var o=ctx.createOscillator(),o2=ctx.createOscillator(),g=ctx.createGain(),lfo=ctx.createOscillator(),lg=ctx.createGain();
      o.type='sawtooth';o.frequency.value=95;o2.type='square';o2.frequency.value=190;lfo.frequency.value=13;lg.gain.value=12;lfo.connect(lg);lg.connect(o.frequency);lg.connect(o2.frequency);
      var f=ctx.createBiquadFilter();f.type='lowpass';f.frequency.value=900;g.gain.value=0;g.gain.linearRampToValueAtTime(.12,ctx.currentTime+.15);
      o.connect(f);o2.connect(f);f.connect(g);g.connect(master);o.start();o2.start();lfo.start();blendNode={o:o,o2:o2,lfo:lfo,g:g}},
    blendStop:function(){if(!blendNode||!ctx)return;var b=blendNode;blendNode=null;b.g.gain.cancelScheduledValues(ctx.currentTime);b.g.gain.setValueAtTime(b.g.gain.value,ctx.currentTime);b.g.gain.linearRampToValueAtTime(0,ctx.currentTime+.12);
      setTimeout(function(){try{b.o.stop();b.o2.stop();b.lfo.stop()}catch(e){}},200)},
    blendDone:function(){S.blendStop();tone(1320,0,.12,'square',.2);tone(1760,.13,.2,'square',.2)},
    spill:function(){S.blendStop();noise(0,.5,.35,600,.6);tone(300,0,.4,'sawtooth',.15,90)},
    trash:function(){noise(0,.18,.3,2500,1.5);noise(.08,.15,.25,1500,1.5);tone(200,.05,.1,'square',.15,90)},
    serve:function(){[1047,1319,1568,2093].forEach(function(f,i){tone(f,i*.06,.14,'square',.18)});tone(2637,.26,.3,'triangle',.15)},
    coin:function(){tone(988,0,.07,'square',.2);tone(1319,.07,.25,'square',.2)},
    wrong:function(){tone(220,0,.18,'square',.25);tone(165,.17,.3,'square',.25)},
    ready:function(){tone(784,0,.12,'square',.16);tone(784,.5,.12,'square',.16)},
    go:function(){tone(1047,0,.08,'square',.2);tone(1568,.07,.25,'square',.2,2093)},
    door:function(){tone(1568,0,.35,'triangle',.2);tone(1175,.16,.45,'triangle',.2)},
    leave:function(){tone(523,0,.15,'triangle',.2,392);tone(392,.15,.3,'triangle',.2,262)},
    win:function(){[523,659,784,1047,784,1047].forEach(function(f,i){tone(f,i*.12,.18,'square',.2)});tone(1319,.75,.6,'triangle',.2)},
    fail:function(){[392,370,349,330].forEach(function(f,i){tone(f,i*.35,i==3?.9:.32,'sawtooth',.15,i==3?220:null)})},
    type:function(){tone(700+Math.random()*120,0,.025,'square',.04)},
    cherry:function(){tone(1400+Math.random()*600,0,.05,'square',.06)}
  };
  window.SFX=S;
})();
