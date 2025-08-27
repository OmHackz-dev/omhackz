// Render downloads from JSONBin
(async function(){
  const container = document.getElementById('downloads');
  if(!container) return;

  const { apiKey, downloadsBin } = JsonBin.loadConfig();
  try{
    const record = await JsonBin.readBin(downloadsBin, apiKey);
    const items = getSafeArray(record && record.items);
    if(items.length === 0){
      container.innerHTML = '<div class="download-item"><div class="info"><strong>No downloads yet.</strong></div></div>';
      return;
    }
    container.innerHTML = '';
    for(const it of items){
      const el = document.createElement('div');
      el.className = 'download-item';
      el.innerHTML = `
        <div class="info">
          <strong>${escapeHtml(it.name||'Untitled')}</strong>
          <span class="sub">${escapeHtml(it.desc||'')}</span>
        </div>
        <a class="btn primary" href="${encodeURI(it.url||'#')}" target="_blank" rel="noopener"><i class="fa-solid fa-download"></i> Get</a>
      `;
      container.appendChild(el);
    }
  }catch(err){
    container.innerHTML = `<div class="download-item"><div class="info"><strong>Failed to load downloads.</strong></div></div>`;
    console.error(err);
  }
})();

function escapeHtml(s){
  return (s||'').replace(/[&<>"]+/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
}


