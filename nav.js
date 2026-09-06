// Shared cross-page navigation for the dc-runtime pages (index/about/gallery/contact).
// Exposed on window so it can be referenced from templates as {{ window.dcNav.navigateTo }}.
(function () {
  var ROUTES = {
    Home: './index.html',
    About: './about.html',
    Gallery: './gallery.html',
    Contact: './contact.html',
    Testimonials: './index.html#testimonials',
    // No dedicated MUN section exists yet; route to home until one is built.
    MUN: './index.html',
  };

  function onIndexPage() {
    return /(^|\/)index\.html$/.test(location.pathname) || /\/$/.test(location.pathname);
  }

  function navigateTo(label) {
    var dest = ROUTES[label];
    if (!dest) return;
    var hashIdx = dest.indexOf('#');
    if (hashIdx !== -1) {
      var page = dest.slice(0, hashIdx);
      var id = dest.slice(hashIdx + 1);
      if (onIndexPage() && (page === './index.html' || page === '')) {
        var el = document.getElementById(id);
        if (el) { el.scrollIntoView({ behavior: 'smooth' }); return; }
      }
    }
    window.location.href = dest;
  }

  function openExternal(url) {
    window.open(url, '_blank', 'noopener');
  }

  window.dcNav = { navigateTo: navigateTo, openExternal: openExternal };
})();
