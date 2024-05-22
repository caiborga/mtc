(function() {
    var currentPath = window.location.pathname;
  
    if (currentPath !== "/") {
      var newPath = "/" + currentPath.split('/').slice(1).join('/');
      window.location.replace(newPath);
    }
  })();
  