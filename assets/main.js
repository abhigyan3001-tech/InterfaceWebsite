document.querySelectorAll('[data-year]').forEach(function(el){el.textContent=new Date().getFullYear()});
document.querySelectorAll('[data-copy]').forEach(function(btn){
  btn.hidden=false;
  btn.addEventListener('click',function(){
    var text=btn.getAttribute('data-copy'),done=function(){btn.textContent='Copied';setTimeout(function(){btn.textContent='Copy'},2000)};
    if(navigator.clipboard){navigator.clipboard.writeText(text).then(done,function(){})}
  });
});
(function(){
  var form=document.getElementById('contact-form');
  if(!form)return;
  var status=document.getElementById('contact-status'),button=form.querySelector('button[type="submit"]');
  var messages={sent:"Thanks! Your message has been sent. We'll reply to you by email.",invalid:'Please enter your name, a valid email address and a description of at least 10 characters.',limit:'You have sent several messages recently. Please try again later or email us directly.',error:'Sorry, your message could not be sent. Please email us at contact@interfaceai.io.'};
  function show(ok,text){status.textContent=text;status.className='form-status '+(ok?'ok':'err');status.hidden=false;status.scrollIntoView({block:'nearest'})}
  var fromUrl=new URLSearchParams(location.search).get('status');
  if(messages[fromUrl])show(fromUrl==='sent',messages[fromUrl]);

  function validate(){
    var firstBad=null;
    form.querySelectorAll('.field-error').forEach(function(el){el.remove()});
    [['contact-name','Please enter your name.'],['contact-email','Please enter a valid email address.'],['contact-description','Please describe your request (at least 10 characters).']].forEach(function(f){
      var input=document.getElementById(f[0]);input.value=input.value.trim();
      var ok=input.checkValidity();input.setAttribute('aria-invalid',ok?'false':'true');
      if(!ok){var err=document.createElement('p');err.className='field-error';err.id=f[0]+'-error';err.textContent=f[1];input.after(err);input.setAttribute('aria-describedby',err.id);firstBad=firstBad||input}
      else input.removeAttribute('aria-describedby');
    });
    if(firstBad)firstBad.focus();
    return !firstBad;
  }

  form.addEventListener('submit',function(e){
    e.preventDefault();
    if(!validate())return;
    button.disabled=true;button.textContent='Sending…';
    fetch(form.action,{method:'POST',body:new FormData(form),headers:{Accept:'application/json'}})
      .then(function(r){return r.json().catch(function(){return {ok:false,message:messages.error}})})
      .then(function(res){show(res.ok,res.message||messages.error);if(res.ok)form.reset()})
      .catch(function(){show(false,messages.error)})
      .then(function(){button.disabled=false;button.textContent='Send message'});
  });
})();
