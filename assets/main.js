document.querySelectorAll('[data-year]').forEach(function(el){el.textContent=new Date().getFullYear()});
document.querySelectorAll('[data-copy]').forEach(function(btn){
  btn.hidden=false;
  btn.addEventListener('click',function(){
    var text=btn.getAttribute('data-copy'),done=function(){btn.textContent='Copied';setTimeout(function(){btn.textContent='Copy'},2000)};
    if(navigator.clipboard){navigator.clipboard.writeText(text).then(done,function(){})}
  });
});
