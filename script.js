async function loadDomains(){
  const res = await fetch('/api/domains');
  const data = await res.json();
  const select = document.getElementById('domain');
  select.innerHTML = '';
  (data.domains || []).forEach(d => {
    const o = document.createElement('option');
    o.value = d;
    o.textContent = d;
    select.appendChild(o);
  });
  renderDomains(data.domains || []);
}

function renderDomains(domains){
  const box = document.getElementById('domainList');
  box.innerHTML = '';
  domains.forEach(d => {
    const row = document.createElement('div');
    row.className = 'domain-item';
    row.innerHTML = `<span>${escapeHtml(d)}</span><button onclick="deleteDomain('${encodeURIComponent(d)}')">DEL</button>`;
    box.appendChild(row);
  });
}

async function addDomain(){
  const input = document.getElementById('newDomain');
  const domain = input.value.trim();
  if(!domain) return alert('Masukkan domain terlebih dahulu.');
  const res = await fetch('/api/domains', {
    method:'POST',
    headers:{'content-type':'application/json'},
    body:JSON.stringify({domain})
  });
  const data = await res.json();
  if(!res.ok) return alert(data.error || 'Gagal menambah domain.');
  input.value = '';
  await loadDomains();
}

async function deleteDomain(encoded){
  const domain = decodeURIComponent(encoded);
  if(!confirm('Hapus domain '+domain+' dari Domain Pool?')) return;
  const res = await fetch('/api/domains', {
    method:'DELETE',
    headers:{'content-type':'application/json'},
    body:JSON.stringify({domain})
  });
  const data = await res.json();
  if(!res.ok) return alert(data.error || 'Gagal menghapus domain.');
  await loadDomains();
}

function updatePreview(){
  document.getElementById('previewTitle').textContent =
    document.getElementById('title').value || 'Judul Facebook';
  document.getElementById('previewDesc').textContent =
    document.getElementById('description').value || 'Deskripsi link akan tampil di sini.';
  const image = document.getElementById('image').value.trim();
  const box = document.getElementById('previewImg');
  if(image){
    box.innerHTML = `<img src="${escapeAttr(image)}" alt="">`;
  } else {
    box.textContent = 'IMAGE';
  }
}

['title','description','image'].forEach(id => {
  document.getElementById(id).addEventListener('input', updatePreview);
});

function escapeHtml(s){
  return s.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
}
function escapeAttr(s){ return escapeHtml(s); }

async function createLink(){
  const domain = document.getElementById('domain').value;
  const destination = document.getElementById('destination').value.trim();
  const clickId = document.getElementById('clickId').value.trim();
  const fsub = document.getElementById('fsub').value;
  const type = document.getElementById('type').value;
  const title = document.getElementById('title').value.trim();
  const image = document.getElementById('image').value.trim();
  const description = document.getElementById('description').value.trim();

  if(!domain) return alert('Pilih domain terlebih dahulu.');
  if(!destination) return alert('Isi URL tujuan terlebih dahulu.');

  const btn = document.querySelector('.generate');
  const old = btn.textContent;
  btn.disabled = true;
  btn.textContent = '⚡ GENERATING...';

  try{
    const res = await fetch('/api/create', {
      method:'POST',
      headers:{'content-type':'application/json'},
      body:JSON.stringify({
        domain, destination, clickId, fsub, type, title, image, description
      })
    });
    const data = await res.json();
    if(!res.ok) return alert(data.error || 'Gagal membuat link.');
    document.getElementById('result').textContent = data.url;
  } finally {
    btn.disabled = false;
    btn.textContent = old;
  }
}

loadDomains().catch(err => {
  console.error(err);
  alert('Tidak bisa memuat Domain Pool. Pastikan Cloudflare Functions dan KV sudah aktif.');
});
updatePreview();
