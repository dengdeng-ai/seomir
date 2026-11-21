(function(){
  var URL='https://seomir.guaakuku.workers.dev';  // 배포할 때 Worker 주소를 여기 넣는다
  window.cbSample=function(){
    if(window.claude&&claude.use)return claude.use('sample');
    if(!URL)return Promise.resolve(null);
    return Promise.resolve(function(msgs){
      return fetch(URL,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({messages:msgs})})
        .then(function(r){if(!r.ok)throw new Error(r.status);return r.json()})
        .then(function(j){return {text:j.text||''}});
    });
  };
})();
