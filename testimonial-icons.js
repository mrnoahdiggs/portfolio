// Shared avatar helpers for testimonials (used by testimonial.html and
// testimonials-review.html). The icon ids must match CURATED_ICONS in worker.js.
(function () {
  var ICONS = {
    music: { label: 'Music note', svg: '<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>' },
    heart: { label: 'Heart', svg: '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21l7.8-7.5 1-1.1a5.5 5.5 0 0 0 0-7.8z"/>' },
    star: { label: 'Star', svg: '<path d="M12 2l3.1 6.3 6.9 1-5 4.8 1.2 6.9L12 17.8 5.8 21 7 14.1 2 9.3l6.9-1z"/>' },
    apple: { label: 'Apple', svg: '<path d="M12 7.5c-1.6-1-5.2-1.4-6.6 1.6S5 16 7 19s3.6 2 5 1.3c1.4.7 3 1.7 5-1.3s3-7-1.4-9.9c-1.4-1-2.9-.6-3.6-.1z"/><path d="M12 7.5c0-2 1-3.6 3-4.5"/>' },
    cap: { label: 'Graduation cap', svg: '<path d="M22 10 12 5 2 10l10 5 10-5z"/><path d="M6 12v5c3 2 9 2 12 0v-5"/><path d="M22 10v6"/>' },
    school: { label: 'School', svg: '<path d="M3 21h18"/><path d="M5 21V10l7-5 7 5v11"/><path d="M10 21v-5h4v5"/><circle cx="12" cy="11" r="1.5"/>' },
    book: { label: 'Book', svg: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5z"/><path d="M4 19.5A2.5 2.5 0 0 0 6.5 22H20v-5"/>' },
    sun: { label: 'Sun', svg: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>' },
    drum: { label: 'Drum', svg: '<ellipse cx="12" cy="9" rx="8" ry="3"/><path d="M4 9v7c0 1.7 3.6 3 8 3s8-1.3 8-3V9"/><path d="M6 2l4 5M18 2l-4 5"/>' },
    mic: { label: 'Microphone', svg: '<rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v4M8 22h8"/>' }
  };

  // Avatar background/foreground pairs. Ids must match ICON_COLORS in worker.js.
  var COLORS = [
    { id: 'orange', bg: 'var(--orange-100)', fg: 'var(--orange-800)', label: 'Orange' },
    { id: 'teal', bg: 'var(--teal-100)', fg: 'var(--teal-800)', label: 'Teal' },
    { id: 'gold', bg: 'var(--gold-100)', fg: 'var(--ink-900)', label: 'Gold' },
    { id: 'ink', bg: 'var(--ink-900)', fg: 'var(--cream-50)', label: 'Ink' },
    { id: 'cream', bg: 'var(--white)', fg: 'var(--ink-900)', label: 'White' }
  ];

  function colorOf(id) {
    return COLORS.filter(function (c) { return c.id === id; })[0] || COLORS[0];
  }

  function iconSvg(id, size) {
    var icon = ICONS[id] || ICONS.music;
    size = size || 24;
    return '<svg width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
      'stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + icon.svg + '</svg>';
  }

  function initialsOf(name) {
    return (name || '').trim().split(/\s+/).filter(Boolean).slice(0, 2)
      .map(function (w) { return w[0].toUpperCase(); }).join('');
  }

  function escapeHtml(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  // Inner HTML for a round avatar: initials text, an emoji, or a curated icon.
  function avatarHtml(icon, size) {
    icon = icon || {};
    if (icon.type === 'emoji') return '<span class="avatar-emoji">' + escapeHtml(icon.value || '🎵') + '</span>';
    if (icon.type === 'icon') return iconSvg(icon.value, size ? Math.round(size * 0.5) : 24);
    return '<span class="avatar-initials">' + escapeHtml(icon.value || '♪') + '</span>';
  }

  window.testimonialIcons = { ICONS: ICONS, COLORS: COLORS, colorOf: colorOf, iconSvg: iconSvg, initialsOf: initialsOf, avatarHtml: avatarHtml, escapeHtml: escapeHtml };
})();
