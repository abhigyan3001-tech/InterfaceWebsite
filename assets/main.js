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
  var status=document.getElementById('contact-status'),button=form.querySelector('button[type="submit"]'),buttonHtml=button.innerHTML;
  var modal=document.getElementById('contact-success'),lastFocus=null;
  var description=document.getElementById('contact-description'),counter=document.getElementById('description-count');
  var messages={invalid:'Please fill in your name, a valid email address and a short description (at least 10 characters).',limit:"You've sent several requests recently. Please try again a little later, or email us at contact@interfaceai.io.",error:"Sorry, we couldn't send your request just now. Please try again, or email us at contact@interfaceai.io."};

  function showError(text){status.textContent=text;status.hidden=false;status.scrollIntoView({block:'nearest',behavior:'smooth'})}
  function clearError(){status.hidden=true;status.textContent=''}

  function openModal(){
    lastFocus=document.activeElement;
    if(typeof modal.showModal==='function')modal.showModal();else modal.setAttribute('open','');
    modal.querySelector('.btn[data-close]').focus();
  }
  function closeModal(){
    if(typeof modal.close==='function')modal.close();else modal.removeAttribute('open');
  }
  modal.addEventListener('close',function(){(lastFocus&&lastFocus.focus?lastFocus:form.querySelector('input')).focus()});
  modal.querySelectorAll('[data-close]').forEach(function(b){b.addEventListener('click',closeModal)});
  // Clicking the dimmed backdrop (outside the card) closes the popup too
  modal.addEventListener('click',function(e){if(e.target===modal)closeModal()});
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&modal.hasAttribute('open'))closeModal()});

  function updateCount(){counter.textContent=description.value.length+' / '+description.maxLength}
  description.addEventListener('input',updateCount);updateCount();

  // Without JavaScript, contact.php redirects back here with ?status=...
  var fromUrl=new URLSearchParams(location.search).get('status');
  if(fromUrl==='sent')openModal();else if(messages[fromUrl])showError(messages[fromUrl]);
  if(fromUrl)history.replaceState(null,'',location.pathname);

  var fields=[['contact-name','Please enter your name.'],['contact-email','Please enter a valid email address, e.g. you@company.com.'],['contact-description','Please describe your request in at least 10 characters.']];
  function checkField(f){
    var input=document.getElementById(f[0]),old=document.getElementById(f[0]+'-error');
    if(old)old.remove();
    var ok=input.value.trim()!==''&&input.checkValidity()&&!(input===description&&input.value.trim().length<10);
    input.setAttribute('aria-invalid',ok?'false':'true');
    var describedBy=(input.getAttribute('aria-describedby')||'').split(' ').filter(function(id){return id&&id!==f[0]+'-error'});
    if(!ok){
      var err=document.createElement('p');err.className='field-error';err.id=f[0]+'-error';err.textContent=f[1];
      (input===description?input.nextElementSibling:input).after(err);describedBy.push(err.id);
    }
    if(describedBy.length)input.setAttribute('aria-describedby',describedBy.join(' '));else input.removeAttribute('aria-describedby');
    return ok?null:input;
  }
  fields.forEach(function(f){
    var input=document.getElementById(f[0]);
    input.addEventListener('blur',function(){if(input.value.trim()!=='')checkField(f)});
    input.addEventListener('input',function(){if(input.getAttribute('aria-invalid')==='true')checkField(f)});
  });

  form.addEventListener('submit',function(e){
    e.preventDefault();clearError();
    var firstBad=null;
    fields.forEach(function(f){var bad=checkField(f);firstBad=firstBad||bad});
    if(firstBad){firstBad.focus();return}
    button.disabled=true;button.textContent='Sending…';
    fetch(form.action,{method:'POST',body:new FormData(form),headers:{Accept:'application/json'}})
      .then(function(r){return r.json().catch(function(){return {ok:false}})})
      .then(function(res){
        if(res.ok){form.reset();updateCount();fields.forEach(function(f){document.getElementById(f[0]).removeAttribute('aria-invalid')});openModal()}
        else showError(res.message||messages.error);
      })
      .catch(function(){showError(messages.error)})
      .then(function(){button.disabled=false;button.innerHTML=buttonHtml});
  });
})();
