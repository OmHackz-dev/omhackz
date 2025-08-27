// Admin page logic: manage JSONBin config, posts, downloads
(function(){
  const settings = {
    apiKey: document.getElementById('apiKey'),
    postsBinId: document.getElementById('postsBinId'),
    downloadsBinId: document.getElementById('downloadsBinId'),
    saveBtn: document.getElementById('saveSettings'),
    clearBtn: document.getElementById('clearSettings'),
    status: document.getElementById('settingsStatus')
  };

  const postsUI = {
    title: document.getElementById('postTitle'),
    content: document.getElementById('postContent'),
    addBtn: document.getElementById('addPost'),
    list: document.getElementById('postList')
  };

  const downloadsUI = {
    name: document.getElementById('dlName'),
    desc: document.getElementById('dlDesc'),
    url: document.getElementById('dlUrl'),
    addBtn: document.getElementById('addDownload'),
    list: document.getElementById('downloadList')
  };

  // Init settings from localStorage
  const cfg = JsonBin.loadConfig();
  if(settings.apiKey) settings.apiKey.value = cfg.apiKey;
  if(settings.postsBinId) settings.postsBinId.value = cfg.postsBin;
  if(settings.downloadsBinId) settings.downloadsBinId.value = cfg.downloadsBin;

  settings.saveBtn && settings.saveBtn.addEventListener('click', () => {
    localStorage.setItem(STORAGE_KEYS.apiKey, settings.apiKey.value.trim());
    localStorage.setItem(STORAGE_KEYS.postsBin, settings.postsBinId.value.trim());
    localStorage.setItem(STORAGE_KEYS.downloadsBin, settings.downloadsBinId.value.trim());
    settings.status.textContent = 'Settings saved.';
  });
  settings.clearBtn && settings.clearBtn.addEventListener('click', () => {
    localStorage.removeItem(STORAGE_KEYS.apiKey);
    localStorage.removeItem(STORAGE_KEYS.postsBin);
    localStorage.removeItem(STORAGE_KEYS.downloadsBin);
    settings.apiKey.value = '';
    settings.postsBinId.value = '';
    settings.downloadsBinId.value = '';
    settings.status.textContent = 'Settings cleared.';
  });

  // Posts CRUD
  postsUI.addBtn && postsUI.addBtn.addEventListener('click', async () => {
    const title = postsUI.title.value.trim();
    const content = postsUI.content.value.trim();
    if(!title || !content){ alert('Title and content are required.'); return; }
    const { apiKey, postsBin } = JsonBin.loadConfig();
    try{
      const record = (await JsonBin.readBin(postsBin, apiKey)) || {};
      const posts = Array.isArray(record.posts) ? record.posts : [];
      posts.push({ id: cryptoRandomId(), title, content, date: new Date().toISOString() });
      await JsonBin.writeBin(postsBin, apiKey, { posts });
      postsUI.title.value = '';
      postsUI.content.value = '';
      await refreshPosts();
      alert('Post added.');
    }catch(err){
      console.error(err);
      alert('Failed to add post. Check settings and bin permissions.');
    }
  });

  async function refreshPosts(){
    if(!postsUI.list) return;
    postsUI.list.innerHTML = '<div class="item">Loading...</div>';
    const { apiKey, postsBin } = JsonBin.loadConfig();
    try{
      const record = await JsonBin.readBin(postsBin, apiKey);
      const posts = Array.isArray(record && record.posts) ? record.posts : [];
      postsUI.list.innerHTML = '';
      for(const p of posts.slice().sort((a,b)=>new Date(b.date||0)-new Date(a.date||0))){
        const row = document.createElement('div');
        row.className = 'item';
        row.innerHTML = `
          <div>
            <strong>${escapeHtml(p.title)}</strong>
            <div class="sub">${new Date(p.date||Date.now()).toLocaleString()}</div>
          </div>
          <div class="row" style="justify-content:flex-end;gap:6px;flex:0">
            <button class="btn" data-edit="${p.id}"><i class="fa-regular fa-pen"></i></button>
            <button class="btn" data-del="${p.id}"><i class="fa-regular fa-trash"></i></button>
          </div>
        `;
        postsUI.list.appendChild(row);
      }
      postsUI.list.querySelectorAll('[data-del]').forEach(btn=>{
        btn.addEventListener('click', async (e)=>{
          const id = e.currentTarget.getAttribute('data-del');
          if(!confirm('Delete this post?')) return;
          const record2 = await JsonBin.readBin(postsBin, apiKey);
          const next = (record2.posts||[]).filter(x=>x.id!==id);
          await JsonBin.writeBin(postsBin, apiKey, { posts: next });
          await refreshPosts();
        });
      });
      postsUI.list.querySelectorAll('[data-edit]').forEach(btn=>{
        btn.addEventListener('click', async (e)=>{
          const id = e.currentTarget.getAttribute('data-edit');
          const record2 = await JsonBin.readBin(postsBin, apiKey);
          const post = (record2.posts||[]).find(x=>x.id===id);
          const newTitle = prompt('Edit title', post.title);
          if(newTitle==null) return;
          const newContent = prompt('Edit content', post.content);
          if(newContent==null) return;
          const updated = (record2.posts||[]).map(x=> x.id===id ? { ...x, title:newTitle, content:newContent } : x);
          await JsonBin.writeBin(postsBin, apiKey, { posts: updated });
          await refreshPosts();
        });
      });
    }catch(err){
      console.error(err);
      postsUI.list.innerHTML = '<div class="item">Failed to load posts.</div>';
    }
  }

  // Downloads CRUD
  downloadsUI.addBtn && downloadsUI.addBtn.addEventListener('click', async () => {
    const name = downloadsUI.name.value.trim();
    const desc = downloadsUI.desc.value.trim();
    const url = downloadsUI.url.value.trim();
    if(!name || !url){ alert('Name and URL are required.'); return; }
    const { apiKey, downloadsBin } = JsonBin.loadConfig();
    try{
      const record = (await JsonBin.readBin(downloadsBin, apiKey)) || {};
      const items = Array.isArray(record.items) ? record.items : [];
      items.push({ id: cryptoRandomId(), name, desc, url, date: new Date().toISOString() });
      await JsonBin.writeBin(downloadsBin, apiKey, { items });
      downloadsUI.name.value = '';
      downloadsUI.desc.value = '';
      downloadsUI.url.value = '';
      await refreshDownloads();
      alert('Download added.');
    }catch(err){
      console.error(err);
      alert('Failed to add download.');
    }
  });

  async function refreshDownloads(){
    if(!downloadsUI.list) return;
    downloadsUI.list.innerHTML = '<div class="item">Loading...</div>';
    const { apiKey, downloadsBin } = JsonBin.loadConfig();
    try{
      const record = await JsonBin.readBin(downloadsBin, apiKey);
      const items = Array.isArray(record && record.items) ? record.items : [];
      downloadsUI.list.innerHTML = '';
      for(const it of items){
        const row = document.createElement('div');
        row.className = 'item';
        row.innerHTML = `
          <div>
            <strong>${escapeHtml(it.name)}</strong>
            <div class="sub">${escapeHtml(it.desc||'')}</div>
          </div>
          <div class="row" style="justify-content:flex-end;gap:6px;flex:0">
            <a class="btn" href="${encodeURI(it.url)}" target="_blank" rel="noopener"><i class="fa-solid fa-link"></i></a>
            <button class="btn" data-edit="${it.id}"><i class="fa-regular fa-pen"></i></button>
            <button class="btn" data-del="${it.id}"><i class="fa-regular fa-trash"></i></button>
          </div>
        `;
        downloadsUI.list.appendChild(row);
      }
      downloadsUI.list.querySelectorAll('[data-del]').forEach(btn=>{
        btn.addEventListener('click', async (e)=>{
          const id = e.currentTarget.getAttribute('data-del');
          if(!confirm('Delete this download?')) return;
          const record2 = await JsonBin.readBin(downloadsBin, apiKey);
          const next = (record2.items||[]).filter(x=>x.id!==id);
          await JsonBin.writeBin(downloadsBin, apiKey, { items: next });
          await refreshDownloads();
        });
      });
      downloadsUI.list.querySelectorAll('[data-edit]').forEach(btn=>{
        btn.addEventListener('click', async (e)=>{
          const id = e.currentTarget.getAttribute('data-edit');
          const record2 = await JsonBin.readBin(downloadsBin, apiKey);
          const item = (record2.items||[]).find(x=>x.id===id);
          const newName = prompt('Edit name', item.name);
          if(newName==null) return;
          const newDesc = prompt('Edit description', item.desc||'');
          if(newDesc==null) return;
          const newUrl = prompt('Edit URL', item.url);
          if(newUrl==null) return;
          const updated = (record2.items||[]).map(x=> x.id===id ? { ...x, name:newName, desc:newDesc, url:newUrl } : x);
          await JsonBin.writeBin(downloadsBin, apiKey, { items: updated });
          await refreshDownloads();
        });
      });
    }catch(err){
      console.error(err);
      downloadsUI.list.innerHTML = '<div class="item">Failed to load downloads.</div>';
    }
  }

  // Helpers
  function cryptoRandomId(){
    if(window.crypto && crypto.randomUUID) return crypto.randomUUID();
    return 'id-' + Math.random().toString(36).slice(2) + Date.now().toString(36);
  }
  function escapeHtml(s){
    return (s||'').replace(/[&<>"]+/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  }

  // Initial loads
  refreshPosts();
  refreshDownloads();
})();


