---
layout: compress
permalink: /assets/js/dist/:basename.min.js
---

if ('serviceWorker' in navigator) {
  const isEnabled = '{{ site.pwa.enabled }}' === 'true';

  if (isEnabled) {
    const swUrl = '{{ '/sw.min.js' | relative_url }}';
    const $notification = $('#notification');
    const $btnRefresh = $('#notification .toast-body>button');

    navigator.serviceWorker.register(swUrl).then((registration) => {
      // 如果有等待的Service Worker，直接更新
      if (registration.waiting) {
        registration.waiting.postMessage('SKIP_WAITING');
      }
      
      registration.addEventListener('updatefound', () => {
        registration.installing.addEventListener('statechange', () => {
          if (registration.waiting) {
            if (navigator.serviceWorker.controller) {
              // 直接更新，不显示通知
              registration.waiting.postMessage('SKIP_WAITING');
            }
          }
        });
      });
    
      // 添加定时检查更新（每5分钟）
      setInterval(() => {
        registration.update();
      }, 300000);
      
      // 页面获得焦点时检查更新
      window.addEventListener('focus', () => {
        registration.update();
      });
    });
    

    let refreshing = false;

    {% comment %}Detect controller change and refresh all the opened tabs{% endcomment %}
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (!refreshing) {
        window.location.reload();
        refreshing = true;
      }
    });
  } else {
    navigator.serviceWorker.getRegistrations().then(function (registrations) {
      for (let registration of registrations) {
        registration.unregister();
      }
    });
  }
}
