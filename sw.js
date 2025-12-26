/* */
const CACHE_NAME = 'editor-v2.4'; // เปลี่ยนเลขเวอร์ชันตรงนี้เพื่อสั่งลบ Cache เก่าและลงไฟล์ใหม่
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.34.1/min/vs/loader.js'
];

// ขั้นตอนการติดตั้ง: โหลดไฟล์ใหม่ลง Cache
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(c => c.addAll(ASSETS))
  );
});

// ขั้นตอนการทำงาน (Activate): ลบไฟล์เว็บไซต์เดิมที่มีอยู่ใน Cache ทั้งหมด (ยกเว้นอันปัจจุบัน)
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name)) // ลบ Cache เดิมทิ้ง
      );
    })
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(caches.match(e.request).then(res => res || fetch(e.request)));
});

// ฟังคำสั่ง SKIP_WAITING เพื่อเปลี่ยนเป็นเวอร์ชันใหม่ทันที
self.addEventListener('message', e => {
  if (e.data.type === 'SKIP_WAITING') self.skipWaiting();
});
