// JSONBin storage helper
// Docs: https://jsonbin.io/
// We store API key and bin IDs in localStorage under the 'omhackz:' prefix.

const STORAGE_KEYS = {
  apiKey: 'omhackz:jsonbin:apiKey',
  postsBin: 'omhackz:jsonbin:postsBin',
  downloadsBin: 'omhackz:jsonbin:downloadsBin'
};

const JsonBin = (() => {
  const API_BASE = 'https://api.jsonbin.io/v3';

  function getHeaders(apiKey){
    return {
      'Content-Type': 'application/json',
      'X-Master-Key': apiKey
    };
  }

  function loadConfig(){
    return {
      apiKey: localStorage.getItem(STORAGE_KEYS.apiKey) || '',
      postsBin: localStorage.getItem(STORAGE_KEYS.postsBin) || '',
      downloadsBin: localStorage.getItem(STORAGE_KEYS.downloadsBin) || ''
    };
  }

  async function readBin(binId, apiKey){
    if(!binId) return null;
    const res = await fetch(`${API_BASE}/b/${binId}/latest`, { headers: getHeaders(apiKey) });
    if(!res.ok){ throw new Error(`Read failed: ${res.status}`); }
    const data = await res.json();
    return data.record;
  }

  async function writeBin(binId, apiKey, payload){
    if(!binId){ throw new Error('Missing binId'); }
    const res = await fetch(`${API_BASE}/b/${binId}`, {
      method: 'PUT',
      headers: getHeaders(apiKey),
      body: JSON.stringify(payload)
    });
    if(!res.ok){ throw new Error(`Write failed: ${res.status}`); }
    const data = await res.json();
    return data;
  }

  async function createBin(apiKey, payload){
    const res = await fetch(`${API_BASE}/b`, {
      method: 'POST',
      headers: getHeaders(apiKey),
      body: JSON.stringify(payload)
    });
    if(!res.ok){ throw new Error(`Create failed: ${res.status}`); }
    return res.json();
  }

  async function bootstrapEnv(){
    try{
      // Try to fetch env.txt at site root
      const res = await fetch('/env.txt');
      if(!res.ok) return; // optional
      const txt = await res.text();
      const map = parseEnv(txt);
      const key = map['Json Bin api key'] || map['JSON_BIN_API_KEY'] || '';
      const posts = map['Posts Bin bin id'] || map['POSTS_BIN_ID'] || '';
      const downloads = map['Downloads Bin Bin id'] || map['DOWNLOADS_BIN_ID'] || '';
      if(key) localStorage.setItem(STORAGE_KEYS.apiKey, key);
      if(posts) localStorage.setItem(STORAGE_KEYS.postsBin, posts);
      if(downloads) localStorage.setItem(STORAGE_KEYS.downloadsBin, downloads);
    }catch(e){
      console.warn('env bootstrap failed', e);
    }
  }

  function parseEnv(text){
    const lines = text.split(/\r?\n/);
    const map = {};
    for(const line of lines){
      const m = line.match(/^\s*([^=:#]+?)\s*=\s*(.+?)\s*$/);
      if(m){ map[m[1].trim()] = m[2].trim(); }
    }
    return map;
  }

  return { loadConfig, readBin, writeBin, createBin, bootstrapEnv };
})();

function getSafeArray(value){
  return Array.isArray(value) ? value : [];
}

// Auto-bootstrap env early on page load
(async function(){
  try{ await JsonBin.bootstrapEnv(); }
  catch(e){ /* ignore */ }
})();


