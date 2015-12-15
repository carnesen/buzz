
var $reset;

$(document).ready(() => {
  $reset = $('.reset');
  $reset.submit(onSubmit);
});

function onReset(event) {

  event.preventDefault();

  $.ajax({
    url: '/api/login',
    method: 'get',
    data
  });
}
