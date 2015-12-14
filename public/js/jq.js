
var $form;

$(document).ready(() => {
  $form = $('form');
  $form.submit(onSubmit);
});

function onSubmit(event) {

  event.preventDefault();

  var data = {};
  $form.serializeArray().map((input) => {
    data[input.name] = input.value;
  });

  $.ajax({
    url: '/api/login',
    method: 'get',
    data
  });

}

