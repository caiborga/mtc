(function() {
  var baseHref = '/mtc-frontend/browser/';
  var currentPath = window.location.pathname;
  var indexPath = baseHref + 'index.html';

  // Überprüfen, ob die aktuelle Seite die 404-Seite ist und nicht die index.html
  if (!currentPath.startsWith(baseHref)) {
    // Dies ist eine Sicherheitsprüfung, um sicherzustellen, dass wir nur innerhalb des Basispfads weiterleiten.
    window.location.replace(baseHref);
  } else if (currentPath !== indexPath && !currentPath.endsWith('/404.html')) {
    // Falls der aktuelle Pfad nicht die index.html ist und auch nicht die 404.html ist, leiten wir weiter.
    var newPath = baseHref + '#' + currentPath.substring(baseHref.length);
    window.location.replace(newPath);
  }
})();