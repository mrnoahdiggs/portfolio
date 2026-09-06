// Cloudinary integration for the portfolio site.
// Cloud name and upload preset are not secrets (no API key/secret involved,
// since uploads use an "unsigned" preset) — safe to keep in this file.
window.CLOUDINARY_CLOUD_NAME = 'xmobf5bj';
window.CLOUDINARY_UPLOAD_PRESET = 'claude';

(function () {
  var CLOUD = window.CLOUDINARY_CLOUD_NAME;
  var PRESET = window.CLOUDINARY_UPLOAD_PRESET;
  var WIDGET_SRC = 'https://upload-widget.cloudinary.com/global/all.js';

  function base(resourceType) {
    return 'https://res.cloudinary.com/' + CLOUD + '/' + resourceType + '/upload';
  }

  // Build an optimized, responsive image delivery URL.
  // cld.imageUrl('folder/my-photo', { width: 800 })
  function imageUrl(publicId, opts) {
    opts = opts || {};
    var t = ['f_auto', 'q_auto'];
    if (opts.width) t.push('w_' + opts.width);
    if (opts.height) t.push('h_' + opts.height);
    if (opts.crop) t.push('c_' + opts.crop);
    return base('image') + '/' + t.join(',') + '/' + publicId;
  }

  // Build a video delivery URL (optionally re-encoded/resized).
  // cld.videoUrl('folder/my-clip', { width: 1280 })
  function videoUrl(publicId, opts) {
    opts = opts || {};
    var t = ['q_auto'];
    if (opts.width) t.push('w_' + opts.width);
    return base('video') + '/' + t.join(',') + '/' + publicId;
  }

  // Build a poster/thumbnail image URL for a video.
  function videoPosterUrl(publicId, opts) {
    opts = opts || {};
    var t = ['f_jpg', 'q_auto'];
    if (opts.width) t.push('w_' + opts.width);
    return base('video') + '/' + t.join(',') + '/' + publicId + '.jpg';
  }

  var widgetLoadPromise = null;
  function loadWidgetScript() {
    if (window.cloudinary && window.cloudinary.createUploadWidget) {
      return Promise.resolve();
    }
    if (widgetLoadPromise) return widgetLoadPromise;
    widgetLoadPromise = new Promise(function (resolve, reject) {
      var s = document.createElement('script');
      s.src = WIDGET_SRC;
      s.onload = resolve;
      s.onerror = function () {
        reject(new Error('Failed to load Cloudinary upload widget script'));
      };
      document.head.appendChild(s);
    });
    return widgetLoadPromise;
  }

  // Opens the Cloudinary upload widget (drag-and-drop, camera, or file picker).
  // Accepts images and videos. Calls onResult(info) for each successful upload,
  // where info = { url, publicId, resourceType, width, height, format }.
  function openUploadWidget(onResult, onError) {
    loadWidgetScript()
      .then(function () {
        var widget = window.cloudinary.createUploadWidget(
          {
            cloudName: CLOUD,
            uploadPreset: PRESET,
            sources: ['local', 'camera', 'url'],
            multiple: true,
            resourceType: 'auto',
            clientAllowedFormats: [
              'jpg', 'jpeg', 'png', 'webp', 'gif', 'svg',
              'mp4', 'mov', 'webm'
            ],
            maxFileSize: 200000000
          },
          function (error, result) {
            if (error) {
              if (onError) onError(error);
              return;
            }
            if (result && result.event === 'success') {
              var info = result.info;
              onResult({
                url: info.secure_url,
                publicId: info.public_id,
                resourceType: info.resource_type,
                width: info.width,
                height: info.height,
                format: info.format
              });
            }
          }
        );
        widget.open();
      })
      .catch(function (err) {
        if (onError) onError(err);
      });
  }

  window.cld = {
    imageUrl: imageUrl,
    videoUrl: videoUrl,
    videoPosterUrl: videoPosterUrl,
    openUploadWidget: openUploadWidget
  };
})();
