$(function() {
  let devices = (function () {
    let json = null;

    $.ajax({
      'async': false,
      'global': false,
      'url': '/devices.json',
      'dataType': "json",
      'success': function (data) {
        $.each(data, function(index, data) {
          // Put a placeholder for undefined symbols
          if (!data.symbol) {
            data.symbol = "placeholder.svg";
          }

          $('#devices').append('<div id="device_' + index + '" class="device"><a href="#"><div class="symbol"></div><div class="label"><a href="#">' + data.name + '</a><span class="bubble">!</span></div></a></div>');

          $('#device_' + index + ' .symbol').css({
            'display': 'flex',
            'justify-content': 'center',
            'align-items': 'center',
            'background-image': "url('/images/" + data.symbol + "')"
          });

          if (!data.problem) {
            $('#device_' + index + ' .bubble').remove();
          }

          if (!data.online) {
            $('#device_' + index + ' .symbol').css({'opacity':0.2});
          }

          if (data.notifications) {
            data.notifications.reverse();
            $('#device_' + index).css({
                'background-image': "url('/images/problem-background.svg')"
            });

            $('#device_' + index + ' .label p').append('<span class="bubble">!</span>');
            $('#device_' + index).addClass('active');
          }
        });

        json = data;
      }
    });

    return json;
  })();

  let randomProblem = 0;

  $('#test_now_button').click(function(e) {
    e.preventDefault();

    $('#connection_testing').fadeIn(250, function() {
      $('#test_now_button').css({
        'background': '#CCC'
      }).text("Testing...");
      startTestingInternetConnection();
    });
  });

  $('body').on('click', '.device', function(e) {
    e.preventDefault();

    let device = devices[$(this).attr('id').replace("device_", "")];

    // Populate interface
    $('#device_info #device_symbol').attr('src', '/images/' + device.symbol);
    $('#device_info #device_hardware_name').text(device.hardware_name);
    $('#device_info #device_hardware_model').text(device.hardware_model);
    $('#test_device_name').text("Your " + device.name);
    $('#device_info #device_status').text(device.name);
    $('.status_icon').attr('class', 'status_icon pending');

    $('.infrastructure_internet_view, .product_view, .problem_banner_final').hide();
    $('.network_security_view, .product_view, .problem_banner_wpa').hide();

    if (device.type === "infrastructure_internet") {
      $('#line_two').text("From AusConnect • 30 Mbps");
      $('.infrastructure_internet_view').show();
    } else if (device.type === "product") {
      $('#line_two').text("");
      $('.product_view').show();
    }

    if (device.type === "network_security") {
      $('#line_two').text("AVM FRITZ!Box 7490");
      $('.network_security_view').show();
    } else if (device.type === "product") {
      $('#line_two').text("");
      $('.product_view').show();
    }

    if (device.online) {
      randomProblem = 0;
      $('.online-or-offline-1').text("This product is connected to your router.");
      $('.online-or-offline-2').text("You can run a test if you have having problems connecting to the Internet with it.");
    } else {
      randomProblem = 2;
      $('.online-or-offline-1').text("This product isn't connected to your router.");
      $('.online-or-offline-2').text("If you are expecting it to be connected, you can run a test to identify the problem.");
    }

    $('#connection_testing').hide();

    $('#test_now_button').text("Test now").attr('style', '');

    $('.advice_panel, .result').hide();

    // Move device info into view
    $('#device_info').css({
      'top': $(window).height(),
      'display': 'block'
    }).animate({
      'top': 0
    }, 250);

    // Scroll back to top
    $('#device_info .content').scrollTop(0);
  });

  $('.self_help').click(function(e) {
    e.preventDefault();

    $('.self_help_advice').fadeIn(250);
  });

  $('.external_help').click(function(e) {
    e.preventDefault();

    $('.external_advice').fadeIn(250);
  });

  // Network security prototype
  $('#sb_one').click(function(e) {
    e.preventDefault();

    $('.network_security, .problem_banner_security, .meta').fadeOut(250, function() {
      $('.network_security_one, .problem_banner_wpa').fadeIn(250);
    });
  });

  $('#sb_two').click(function(e) {
    e.preventDefault();

    $('.network_security_one, .problem_banner_wpa').fadeOut(250, function() {
      $('.network_security_two').fadeIn(250);
    });
  });

  $('#sb_three').click(function(e) {
    e.preventDefault();

    $('.network_security_two').fadeOut(250, function() {
      $('.network_security_three, .problem_banner_final').fadeIn(250);
    });
  });

  var theTerm = $('#routerName').val();


  function startTestingInternetConnection() {
    setTimeout(function() {
      $('#test_internet_connection .status_icon').removeClass('pending').addClass('working');

      $('#test_internet_connection p.test').fadeIn(250, function() {
        $('#test_internet_connection p.test').delay(1750).fadeOut(250);

        if (randomProblem == 0) {
          internetConnectionResult("bad");
        } else {
          internetConnectionResult("good");
        }
      });
    }, 250);
  }

  function internetConnectionResult(status) {
    if (status === "good") {
      $('#test_internet_connection p.result.good').delay(2000).fadeIn(250, function() {
        $('#test_internet_connection .status_icon').removeClass('working').addClass('good');
      });
    } else if (status === "bad") {
      $('#test_internet_connection p.result.bad, #test_internet_connection .advice_panel').delay(2000).fadeIn(250, function() {
        $('#test_internet_connection .status_icon').removeClass('working').addClass('bad');
      });
    }

    setTimeout(function() {
      startTestingRouter();
    }, 2000);
  }

  function startTestingRouter() {
    setTimeout(function() {
      $('#test_router .status_icon').removeClass('pending').addClass('working');

      $('#test_router p.test').fadeIn(250, function() {
        $('#test_router p.test').delay(1750).fadeOut(250);

        if (randomProblem == 1) {
          routerResult("bad");
        } else {
          routerResult("good");
        }
      });
    }, 250);
  }

  function routerResult(status) {
    if (status === "good") {
      $('#test_router p.result.good').delay(2000).fadeIn(250, function() {
        $('#test_router .status_icon').removeClass('working').addClass('good');
      });
    } else if (status === "bad") {
      $('#test_router p.result.bad, #test_router .advice, #test_router .advice p').delay(2000).fadeIn(250, function() {
        $('#test_router .status_icon').removeClass('working').addClass('bad');
      });
    }

    setTimeout(function() {
      startTestingDevice();
    }, 2000);
  }

  function startTestingDevice() {
    setTimeout(function() {
      $('#test_device .status_icon').removeClass('pending').addClass('working');

      $('#test_device p.test').fadeIn(250, function() {
        $('#test_device p.test').delay(1750).fadeOut(250);

        if (randomProblem == 2) {
          deviceResult("bad");
        } else {
          deviceResult("good");
        }
      });
    }, 250);
  }

  function deviceResult(status) {
    if (status === "good") {
      $('#test_device p.result.good').delay(2000).fadeIn(250, function() {
        $('#test_device .status_icon').removeClass('working').addClass('good');
      });
    } else if (status === "bad") {
      $('#test_device p.result.bad, #test_device .advice, #test_device .advice p').delay(2000).fadeIn(250, function() {
        $('#test_device .status_icon').removeClass('working').addClass('bad');
      });
    }

    setTimeout(function() {
      $('#test_now_button').text("Done");
    }, 2000);
  }

  $('body').on('click', '.close_overlay', function(e) {
    e.preventDefault();

    let overlay = $(this).parent().parent();

    $(overlay).animate({
      'top': $(window).height()
    }, 250, function() {
      $(overlay).css({
        'display': 'none'
      });
    });
  });

  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }
});
