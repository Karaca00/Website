/* ===========================================================
   ZENU HUB SERVICE WORKER - MASTER v3.0
   -----------------------------------------------------------
   วิธีสั่งอัปเดตเว็บ: เปลี่ยนเลขเวอร์ชันด้านล่างนี้ (เช่น v3.0 -> v3.1)
   แล้วเว็บไซต์จะทำการตรวจจับ บันทึกข้อมูล และรีโหลดตัวเองทันที
   =========================================================== */
const CURRENT_VERSION = 'ZENU-MASTER-v3.3.3'; 

const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  'Z.png', // ตรวจสอบว่ามีไฟล์นี้จริง หรือลบออกถ้าไม่มี
  // Monaco Editor Core
  'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.34.1/min/vs/loader.js',
  'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.34.1/min/vs/editor/editor.main.js',
  'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.34.1/min/vs/editor/editor.main.css',
  // Firebase SDKs
  'https://www.gstatic.com/firebasejs/11.0.2/firebase-app-compat.js',
  'https://www.gstatic.com/firebasejs/11.0.2/firebase-auth-compat.js',
  'https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore-compat.js'
];

// 1. Install: โหลดไฟล์ลงเครื่อง
self.addEventListener('install', event => {
  console.log(`[SW] Installing ${CURRENT_VERSION}`);
  event.waitUntil(
    caches.open(CURRENT_VERSION).then(cache => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  // บังคับให้ SW ตัวใหม่ทำงานทันที ไม่ต้องรอปิดเว็บ
  self.skipWaiting();
});

// 2. Activate: ลบแคชเวอร์ชันเก่าทิ้ง
self.addEventListener('activate', event => {
  console.log(`[SW] Activating ${CURRENT_VERSION}`);
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CURRENT_VERSION) {
            console.log(`[SW] Deleting old cache: ${cacheName}`);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  // เข้าควบคุมหน้าเว็บทันที
  self.clients.claim();
});

// 3. Fetch: โหลดไวด้วย Cache แต่ถ้าไม่มีให้โหลดจากเน็ต
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      // ถ้ามีในเครื่องใช้เลย (เร็วสุด) ถ้าไม่มีไปโหลดใหม่
      return response || fetch(event.request);
    })
  );
});