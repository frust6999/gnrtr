const $=id=>document.getElementById(id);
async function loadDomains(){
  const r=await fetch('/api/domains'); const d=await r.json();
  $('domain').innerHTML='';
  d.domains.forEach(x=>{const o=document.createElement('option');o.value=x;o.textContent=x;$('domain').appendChild(o)});
  $('domainList').innerHTML=d.domains.map(x=>`<div class="domain-item"><span>${esc(x)}</span><button class="del" onclick="deleteDomain('${encodeURIComponent(x)}')">DELETE</button></div>`).join('');
}
async function addDomain(){
  const domain=$('newDomain').value.trim().replace(/^https?:\/\//,'').replace(/\/.*$/,'');
  if(!domain)return alert('Masukkan domain.');
  const r=await fetch('/api/domains',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({domain})});
  const d=await r.json(); if(!r.ok)return alert(d.error||'Gagal');
  $('newDomain').value=''; loadDomains();
}
async function deleteDomain(domain){
  const r=await fetch('/api/domains?domain='+domain,{method:'DELETE'}); const d=await r.json();
  if(!r.ok)return alert(d.error||'Gagal'); loadDomains();
}
async function createLink(){
  const payload={domain:$('domain').value,destination:$('destination').value.trim(),slug:$('slug').value.trim(),title:$('title').value.trim(),image:$('image').value.trim(),description:$('description').value.trim(),fsub:$('fsub').value,type:$('type').value};
  const r=await fetch('/api/create',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(payload)});
  const d=await r.json(); if(!r.ok)return alert(d.error||'Gagal membuat link.');
  $('result').innerHTML=`<a href="${d.link}" target="_blank" style="color:#00eaff">${d.link}</a>`;
}
function esc(s){return s.replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}
['title','description'].forEach(id=>$(id).addEventListener('input',()=>{
  if(id==='title')$('previewTitle').textContent=$(id).value||'Judul Facebook';
  else $('previewDesc').textContent=$(id).value||'Deskripsi link akan tampil di sini.';
}));
$('image').addEventListener('input',()=>{const x=$('image').value.trim();$('previewImg').style.backgroundImage=x?`url("${x}")`:'none';$('previewImg').textContent=x?'':'IMAGE'});
loadDomains();
