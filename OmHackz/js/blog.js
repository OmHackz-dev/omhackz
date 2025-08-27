// Render posts from JSONBin
(async function(){
  const container = document.getElementById('posts');
  if(!container) return;

  const { apiKey, postsBin } = JsonBin.loadConfig();
  try{
    const record = await JsonBin.readBin(postsBin, apiKey);
    const posts = getSafeArray(record && record.posts);
    if(posts.length === 0){
      container.innerHTML = '<div class="post"><p>No posts yet.</p></div>';
      return;
    }
    const sorted = posts.slice().sort((a,b)=> new Date(b.date||0)-new Date(a.date||0));
    container.innerHTML = '';
    for(const p of sorted){
      const el = document.createElement('article');
      el.className = 'post';
      el.innerHTML = `
        <h3>${escapeHtml(p.title||'Untitled')}</h3>
        <div class="meta"><i class="fa-regular fa-calendar"></i> ${formatDate(p.date)}</div>
        <div class="content">${nl2br(escapeHtml(p.content||''))}</div>
      `;
      container.appendChild(el);
    }
  }catch(err){
    container.innerHTML = `<div class="post"><p>Failed to load posts. Check admin settings.</p></div>`;
    console.error(err);
  }
})();

function formatDate(d){
  const date = d ? new Date(d) : new Date();
  return date.toLocaleDateString();
}
function nl2br(text){
  return (text||'').replace(/\n/g,'<br>');
}
function escapeHtml(s){
  return (s||'').replace(/[&<>"]+/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
}


