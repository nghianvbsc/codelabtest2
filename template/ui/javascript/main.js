/**
 * isMobile
 * responsiveMenu
 * headerFixed
 * flatIconboxCarousel
 * blogCarousel
 * ClientCarousel
 * flatTeam
 * googleMap
 * portfolioIsotope
 * goTop
 * parallax
 */

;
(function ($) {

    'use strict'

    var isMobile = {
        Android: function () {
            return navigator.userAgent.match(/Android/i);
        },
        BlackBerry: function () {
            return navigator.userAgent.match(/BlackBerry/i);
        },
        iOS: function () {
            return navigator.userAgent.match(/iPhone|iPad|iPod/i);
        },
        Opera: function () {
            return navigator.userAgent.match(/Opera Mini/i);
        },
        Windows: function () {
            return navigator.userAgent.match(/IEMobile/i);
        },
        any: function () {
            return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
        }
    };

    // var responsiveMenu = function() {
    //   var menuType = 'desktop';

    //   $(window).on('load resize', function() {
    //     var currMenuType = 'desktop';

    //     if (matchMedia('only screen and (max-width: 1199px)').matches) {
    //       currMenuType = 'mobile';
    //     }

    //     if (currMenuType !== menuType) {
    //       menuType = currMenuType;

    //       if (currMenuType === 'mobile') {
    //         var $mobileMenu = $('#mainnav').attr('id', 'mainnav-mobi').hide();
    //         var hasChildMenu = $('#mainnav-mobi').find('li:has(ul)');
    //         var $account = $('.box-account').attr('class', 'box-account-mobi');

    //         $('#header').after($mobileMenu);
    //         $('#mainnav-mobi').append($account);
    //         hasChildMenu.children('ul').hide();
    //         hasChildMenu.children('a').after('<span class="btn-submenu"></span>');
    //         $('.btn-menu').removeClass('active');
    //       } else {
    //         var $desktopMenu = $('#mainnav-mobi').attr('id', 'mainnav').removeAttr('style');

    //         $desktopMenu.find('.submenu').removeAttr('style');
    //         $('#header').find('.nav-wrap').append($desktopMenu);
    //         $('.btn-submenu').remove();
    //         var $pcAccount = $('.box-account-mobi').attr('class', 'box-account');
    //         $('#logo').after($pcAccount);
    //       }
    //     }
    //   });

    //   $('.btn-menu').on('click', function() {
    //     $('#mainnav-mobi').slideToggle(300);
    //     $(this).toggleClass('active');
    //   });

    //   $(document).on('click', '#mainnav-mobi li .btn-submenu', function(e) {
    //     $(this).toggleClass('active').next('ul').slideToggle(300);
    //     e.stopImmediatePropagation()
    //   });
    // }

    // var headerFixed_s1 = function() {
    //   var nav = $('.header.bg-color');
    //   if (nav.size() !== 0) {

    //     $(window).on('load', function() {
    //       var header = $('.header.bg-color');
    //       var offsetTop = $('.header.bg-color').offset().top;
    //       var headerHeight = $('.header.bg-color').height();
    //       var buffer = $('<div>', {
    //         height: headerHeight
    //       }).insertAfter(header);
    //       buffer.hide();

    //       $(window).on('load scroll', function() {
    //         if ($(window).scrollTop() > offsetTop) {
    //           $('.header.bg-color').addClass('fixed-header');
    //           buffer.show();
    //         } else {
    //           $('.header.bg-color').removeClass('fixed-header');
    //           buffer.hide();
    //         }
    //       })

    //     }); // headerFixed style1
    //   }
    // };

    var tabLogistic = function () {
        $('.tab-container').each(function () {
            $('.menu-tab').children('li').first().addClass('active');
            $(this).children('.content-tab').children().hide();
            $(this).children('.content-tab').children().first().show();
            $(this).find('.menu-tab').children('li').on('click', function (e) {
                var liActive = $(this).index(),
                    contentActive = $(this).siblings().removeClass('active').parents('.tab-container').children('.content-tab').children().eq(liActive);

                contentActive.addClass('active').fadeIn('slow');
                contentActive.siblings().removeClass('active');
                $(this).addClass('active').parents('.tab-container').children('.content-tab').children().eq(liActive).siblings().hide();
                e.preventDefault();
            });
        });
    };

    var CheckboxShowHideAll = function () {
        // Set check or unchecked all checkboxes
        $('#chckHead').click(function () {
            var checkboxes = $('.chcktbl');

            if (this.checked) {
                for (var i = 0; i < checkboxes.length; i++) {
                    checkboxes[i].checked = true;
                }
            } else {
                for (var i = 0; i < checkboxes.length; i++) {
                    checkboxes[i].checked = false;
                }
            }
        });

        $('#a-chckHead').click(function () {
            var checkboxes = $('.a-chcktbl');

            if (this.checked) {
                for (var i = 0; i < checkboxes.length; i++) {
                    checkboxes[i].checked = true;
                }
            } else {
                for (var i = 0; i < checkboxes.length; i++) {
                    checkboxes[i].checked = false;
                }
            }
        });

        $('#b-chckHead').click(function () {
            var checkboxes = $('.b-chcktbl');

            if (this.checked) {
                for (var i = 0; i < checkboxes.length; i++) {
                    checkboxes[i].checked = true;
                }
            } else {
                for (var i = 0; i < checkboxes.length; i++) {
                    checkboxes[i].checked = false;
                }
            }
        });

        $('#c-chckHead').click(function () {
            var checkboxes = $('.c-chcktbl');

            if (this.checked) {
                for (var i = 0; i < checkboxes.length; i++) {
                    checkboxes[i].checked = true;
                }
            } else {
                for (var i = 0; i < checkboxes.length; i++) {
                    checkboxes[i].checked = false;
                }
            }
        });

        $('#d-chckHead').click(function () {
            var checkboxes = $('.d-chcktbl');

            if (this.checked) {
                for (var i = 0; i < checkboxes.length; i++) {
                    checkboxes[i].checked = true;
                }
            } else {
                for (var i = 0; i < checkboxes.length; i++) {
                    checkboxes[i].checked = false;
                }
            }
        });

        $('#e-chckHead').click(function () {
            var checkboxes = $('.e-chcktbl');

            if (this.checked) {
                for (var i = 0; i < checkboxes.length; i++) {
                    checkboxes[i].checked = true;
                }
            } else {
                for (var i = 0; i < checkboxes.length; i++) {
                    checkboxes[i].checked = false;
                }
            }
        });

        $('#f-chckHead').click(function () {
            var checkboxes = $('.f-chcktbl');

            if (this.checked) {
                for (var i = 0; i < checkboxes.length; i++) {
                    checkboxes[i].checked = true;
                }
            } else {
                for (var i = 0; i < checkboxes.length; i++) {
                    checkboxes[i].checked = false;
                }
            }
        });

    }

    var ToggleSlide = function () {
        $('.info-logistic-detail .detail-box .title .icon-down').on('click', function () {
            $(this).closest('.title').toggleClass('active');
            $(this).closest('.detail-box').children('.detail-content').slideToggle();
        });
        $('.info-logistic-detail .detail-box .sub-title .icon-down').on('click', function () {
            $(this).closest('.title').toggleClass('active');
            $(this).closest('.detail-content').children('.detail-child').slideToggle();
        })
    };

    var ShowPopup = function () {
        var popupFinish = $('.btn-confirm.finish a');
        var popupFinishClose = $('.box-confirm-order .delete');

        // Order
        popupFinish.on('click', function (e) {
            e.stopPropagation();
            e.preventDefault();
            $(this).closest('.boxed').children('.box-confirm-order').addClass('open');
            $('body').append('<div class="modal-backdrop fade show"></div>');
        });
        popupFinishClose.on('click', function () {
            $(this).closest('.boxed').children('.box-confirm-order').removeClass('open');
            $('.modal-backdrop.fade.show').remove();
        });
        $('.box-confirm-order').on('click', function (e) {
            e.stopPropagation();
        });
        // $('body').on('click', function () {
            // $('.boxed').children('.box-confirm-order').removeClass('open');
            // $('.modal-backdrop.fade.show').remove();
        // });

        // Create Accountant
        var popupAccountant = $('.create-accountant');
        var popupAccountantClose = $('.box-create-accountant .title .delete');
        var popupAccountantClose_2 = $('.box-create-accountant .btn-submit-form .close-form');
        popupAccountant.on('click', function (e) {
            e.stopPropagation();
            e.preventDefault();
            $(this).closest('.boxed').children('.box-create-accountant').addClass('open');
            $('body').append('<div class="modal-backdrop fade show"></div>');
        });
        popupAccountantClose.on('click', function () {
            $(this).closest('.boxed').children('.box-create-accountant').removeClass('open');
            $('.modal-backdrop.fade.show').remove();
        });
        popupAccountantClose_2.on('click', function () {
            $(this).closest('.boxed').children('.box-create-accountant').removeClass('open');
            $('.modal-backdrop.fade.show').remove();
        });
        $('.box-create-accountant').on('click', function (e) {
            e.stopPropagation();
        });
        // $('body').on('click', function () {
        //     $('.boxed').children('.box-create-accountant').removeClass('open');
        //     $('.modal-backdrop.fade.show').remove();
        // });


        // var popupOrder = $('.btn-confirm.finish a');
        // var popupOrderClose = $('.popup-new-order .delete');

        // Order
        // popupOrder.on('click',function(e) {
        //     e.stopPropagation();
        //     e.preventDefault();
        //     $(this).closest('.boxed').children('.box-confirm-order').addClass('open');
        //     $('body').append('<div class="modal-backdrop fade show"></div>');
        // });
        // popupOrderClose.on('click', function() {
        //     $(this).parents('.popup-new-order').removeClass('open');
        //     $('.modal-backdrop.fade.show').remove();
        // });
        $('.popup-new-order').on('click', function (e) {
            e.stopPropagation();
        });
        // $('body').on('click', function() {
        //     $('.boxed').children('.popup-new-order').removeClass('open');
        //     $('.modal-backdrop.fade.show').remove();
        // });

    };

    var sub_menu = function () {
        $('.menu-account').each(function () {
            $('li.has-submenu .submenu').hide();
            $('li.has-submenu > a').on('click', function (e) {
                $(this).closest('li').addClass('active');
                $(this).siblings().slideToggle();
                e.stopPropagation();
            });
        });
    };

    var removePreloader = function () {
        $('.box-change-pw').hide();
        $(document).on('click', '.bt-change-pw', function () {
            $(this).toggleClass('active');
            if ($(this).hasClass('active')) {
                $(this).find('input').prop('checked', true);
            } else {
                $(this).find('input').prop('checked', false);
            }
            $('.box-change-pw').slideToggle(300);
        });

        $('.sec_info_account .info-account .top-bar .box-control .notification ul').hide();

        $(document).on('click', '.notification .icon', function () {
            $(this).toggleClass('active');
            $('.sec_info_account .info-account .top-bar .box-control .notification ul').slideToggle(200);
        });

        $('.sec_info_account .info-account .top-bar .box-control .services-control ul').hide();

        $(document).on('click', '.services-control .icon', function () {
            $(this).toggleClass('active');
            $('.sec_info_account .info-account .top-bar .box-control .services-control ul').slideToggle(200);
        });

        $(window).load(function () {
            $('#preloader').css('opacity', 0);
            setTimeout(function () {
                $('#preloader').hide();
            }, 1000);
        });

    };

    var UpDown = function () {
        $(".button").on("click", function () {

            var $button = $(this);
            var oldValue = $button.parent().find("input").val();

            if ($button.text() === "+") {
                // alert('+++++++');
                var newVal = parseFloat(oldValue) + 1;
            } else {
                // Don't allow decrementing below zero
                if (oldValue > 0) {
                    var newVal = parseFloat(oldValue) - 1;
                } else {
                    newVal = 0;
                }
            }

            $button.parent().find("input").val(newVal);

        });
    }

    var switch_show_hide = function () {
        $('.create-logistic-container').each(function () {
            $('.select-contract').on('change', function () {
                var select_contract = $(this).val();
                if (select_contract == 'kh' || select_contract == 'tkh') {
                    $(this).closest('.create-logistic-container').find('.show-or-hide').hide();
                } else {
                    $(this).closest('.create-logistic-container').find('.show-or-hide').show();
                }
            })
        });
    }

    // Dom Ready
    $(function () {
        tabLogistic();
        CheckboxShowHideAll();
        ToggleSlide();
        ShowPopup();
        sub_menu();
        UpDown();
        switch_show_hide();
        removePreloader();
    });

})(jQuery);
