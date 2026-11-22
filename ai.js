(function(){
  var URL='https://seomir.guaakuku.workers.dev';  // 배포할 때 Worker 주소를 여기 넣는다
  var FM={smile:'smile',happy:'happy',wink:'wink',winksmile:'winksmile',frown:'frown',shy:'shy',surprised:'frown',surprise:'frown',scared:'frown',afraid:'frown',shocked:'frown',worried:'frown',sad:'frown',angry:'frown',excited:'happy',embarrassed:'shy',blush:'shy',laugh:'happy',neutral:'smile',confused:'frown',grin:'winksmile'};
  var VALID=['smile','happy','wink','winksmile','frown','shy'];
  window.cbParse=function(raw0,fin){
    var t=(raw0||'').trim();
    if(!fin&&t.indexOf('\n')<0&&!/[가-힣]/.test(t))return null;
    var lines=t.split('\n'),f=(lines[0]||'').trim().toLowerCase(),txt=lines.slice(1).join(' ').trim();
    var raw=t.replace(/^[\[(*\s]*/,''),mm=raw.match(/^([A-Za-z]+)[\])*:.\s]*([\s\S]*)$/);
    if(mm){f=FM[mm[1].toLowerCase()]||'smile';txt=mm[2].replace(/\n+/g,' ').trim()}
    else if(VALID.indexOf(f)<0){txt=raw.replace(/\n+/g,' ');f='smile'}
    txt=txt.replace(/^[A-Za-z]+\s+(?=[가-힣])/,'');
    return {f:f,txt:txt};
  };
  function cut(t,stop){
    if(stop==='max_tokens'){var e=Math.max(t.lastIndexOf('.'),t.lastIndexOf('?'),t.lastIndexOf('!'));if(e>t.indexOf('\n')+10)t=t.slice(0,e+1)}
    return t;
  }
  window.cbSample=function(){
    if(window.claude&&claude.use)return claude.use('sample');
    if(!URL)return Promise.resolve(null);
    return Promise.resolve(function(msgs,opts){
      var live=opts&&opts.onText;
      return fetch(URL,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(live?{messages:msgs,stream:true}:{messages:msgs})})
        .then(function(r){
          if(!r.ok)throw new Error(r.status);
          var ct=r.headers.get('content-type')||'';
          if(!live||!r.body||ct.indexOf('event-stream')<0)return r.json().then(function(j){return {text:j.text||''}});
          var rd=r.body.getReader(),dec=new TextDecoder(),buf='',txt='',stop='';
          function line(l){
            if(l.indexOf('data:')!==0)return;
            var j;try{j=JSON.parse(l.slice(5))}catch(e){return}
            if(j.type==='content_block_delta'&&j.delta&&j.delta.text){txt+=j.delta.text;try{opts.onText(txt)}catch(e){}}
            else if(j.type==='message_delta'&&j.delta&&j.delta.stop_reason)stop=j.delta.stop_reason;
          }
          function pump(){return rd.read().then(function(x){
            if(x.done){if(buf)line(buf);return {text:cut(txt,stop)}}
            buf+=dec.decode(x.value,{stream:true});
            var p=buf.split('\n');buf=p.pop();p.forEach(line);
            return pump();
          })}
          return pump();
        });
    });
  };
})();
