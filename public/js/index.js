var prevScrollpos = window.pageYOffset;
window.onscroll = function () {
  var currentScrollPos = window.pageYOffset;
  if (currentScrollPos > 200) {
    if (prevScrollpos > currentScrollPos) {
      document.getElementById('navbar').style.top = '0';
    } else {
      document.getElementById('navbar').style.top = '-120px';
    }
    prevScrollpos = currentScrollPos;
  }
};

$(function () {
  $('#home').on('click', function () {
    goto('header');
  });
  $('#secu_a').on('click', function () {
    goto('.main');
  });
  $('#secu_b').on('click', function () {
    goto('#why_SecCompliance');
  });
  $('#secu_c').on('click', function () {
    goto('.main');
  });

  $('#contact_us').on('click', function () {
    goto('#to_cus');
  });

  function goto(name) {
    $('html,body').animate({ scrollTop: $(name).offset().top }, 600);
  }
});
