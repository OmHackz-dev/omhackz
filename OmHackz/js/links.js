// Parse links.md and render
(async function(){
  const container = document.getElementById('linksContainer');
  if(!container) return;
  try{
    const res = await fetch('links.md');
    const text = await res.text();
    const items = parseMarkdownLinks(text);
    container.innerHTML = '';
    if(items.length === 0){
      container.innerHTML = '<div class="item">No links found.</div>';
      return;
    }
    for(const it of items){
      const row = document.createElement('div');
      row.className = 'item';
      row.innerHTML = `
        <div>
          <strong>${escapeHtml(it.label)}</strong>
          <div class="sub">${escapeHtml(it.section||'')}</div>
        </div>
        <a class="btn primary" href="${it.url}" target="_blank" rel="noopener"><i class="fa-solid fa-arrow-up-right-from-square"></i> Open</a>
      `;
      container.appendChild(row);
    }
  }catch(err){
    console.error(err);
    container.innerHTML = '<div class="item">Failed to load links.md</div>';
  }
})();

function parseMarkdownLinks(md){
  const lines = md.split(/\r?\n/);
  const items = [];
  let currentSection = '';
  for(const line of lines){
    const heading = line.match(/^\*\*(.+?)\*\*:?$/);
    if(heading){
      currentSection = heading[1].trim();
      continue;
    }
    const m = line.match(/^\*\s*\*\*(.+?)\*\*:\s*\[(.+?)\]\((.+?)\)/);
    if(m){
      items.push({ label: m[1].trim(), url: m[3].trim(), section: currentSection });
      continue;
    }
    const m2 = line.match(/^\*\s*\*\*(.+?)\*\*\s*\((.+?)\)/); // bullet with label only (no link)
    if(m2){
      items.push({ label: m2[1].trim(), url: '#', section: currentSection });
    }
  }
  return items;
}

function escapeHtml(s){
  return (s||'').replace(/[&<>"]+/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
}


