function postPacTest(event, divId) {
    event = event || window.event;
    if ((event.type == "mousedown" && event.button == 1) ||
      event.type == "click") {
        pac_script = document.getElementById(divId).innerHTML;
        //console.log(pac_script);
        target = "_self"
        if (event.button == 1 || event.ctrlKey || event.metaKey )
          target = "_blank"
        post('/', {'pac_script': pac_script}, "post", target);
        this.event.returnValue = false;
        return false;
      }
    return true;
}
/*
 * sends a request to the specified url from a form. this will change the window location.
 * @param {string} path the path to send the post request to
 * @param {object} params the parameters to add to the url
 * @param {string} [method=post] the method to use on the form
 * @param {string} [target=_self]
 * example post('/contact/', {name: 'Johnny Bravo'});
 */
 function post(path, params, method='post', target='_self') {
    const form = document.createElement('form');
    form.method = method;
    form.action = path;
    form.target = target;
  
    for (const key in params) {
      if (params.hasOwnProperty(key)) {
        const hiddenField = document.createElement('input');
        hiddenField.type = 'hidden';
        hiddenField.name = key;
        hiddenField.value = params[key];
  
        form.appendChild(hiddenField);
      }
    }
  
    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
  }