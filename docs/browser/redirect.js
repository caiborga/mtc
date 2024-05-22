(function() {
    var baseHref = '/mtc-frontend/browser/';
    var currentPath = window.location.pathname;
  
    if (!currentPath.startsWith(baseHref)) {
      window.location.replace(baseHref);
    } else {
      var relativePath = currentPath.substring(baseHref.length);
      if (relativePath) {
        var newPath = baseHref + relativePath;
        window.location.replace(newPath);
      }
    }
  })();
  