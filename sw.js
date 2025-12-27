/* Service Worker Master v4.2 - Ultra-Fast Reactive Update */
const CACHE_NAME = 'editor-v4.2.5'; 

const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.34.1/min/vs/loader.js',
  'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.34.1/min/vs/editor/editor.main.js',
  'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.34.1/min/vs/editor/editor.main.css',
  'https://www.gstatic.com/firebasejs/11.0.2/firebase-app-compat.js',
  'https://www.gstatic.com/firebasejs/11.0.2/firebase-auth-compat.js',
  'https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore-compat.js'
];

// ติดตั้งและเปิดใช้งานทันที
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting(); 
});

// เคลียร์แคชเก่าและเริ่มคุมหน้าเว็บทันที
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(name => {
          if (name !== CACHE_NAME) return caches.delete(name);
        })
      );
    })
  );
  self.clients.claim(); 
});

// ยุทธศาสตร์ Cache-First (เพื่อความเร็ว) พร้อม Network fallback
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(res => res || fetch(e.request))
  );
});

// รับคำสั่งเพื่ออัปเดตเวอร์ชัน
self.addEventListener('message', e => {
  if (e.data.type === 'SKIP_WAITING') self.skipWaiting();
});