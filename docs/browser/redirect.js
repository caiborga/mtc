(function() {
  var baseHref = '/mtc-frontend/browser/';
  var currentPath = window.location.pathname;
  var indexPath = baseHref + 'index.html';

  // Überprüfen, ob die aktuelle Seite die 404-Seite ist
  if (currentPath !== indexPath && !currentPath.endsWith('/404.html')) {
    var newPath = baseHref + '#' + currentPath.substring(baseHref.length);
    window.location.replace(newPath);
  }
})();