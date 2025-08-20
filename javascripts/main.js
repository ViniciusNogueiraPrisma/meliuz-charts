const header = $("#header");

if (header.offset().top > 44) {
  header.addClass("is-page-scroll");
} else {
  header.removeClass("is-page-scroll");
}

if (header.offset().top > 50) {
  header.addClass("fixed");
} else {
  header.removeClass("fixed");
}

function accessApplyTheme(theme) {
  localStorage.setItem("access_theme", theme);

  if (theme == "dark") {
    $("body").attr("data-theme", "dark");
    $("#themeTooltip").text("Light Mode");
  } else {
    $("body").attr("data-theme", "light");
    $("#themeTooltip").text("Dark Mode");
  }
}

var access_theme = "light";

if (localStorage.getItem("access_theme")) {
  access_theme = localStorage.getItem("access_theme");
  accessApplyTheme(access_theme);
} else {
  $("#themeTooltip").text("Dark Mode");
}

$("#toggleContrast").on("click", function (e) {
  e.preventDefault();

  if (access_theme == "light") {
    access_theme = "dark";
  } else {
    access_theme = "light";
  }

  accessApplyTheme(access_theme);
});

$(document).ready(function () {
  const header = $("#header");

  // Detect Window Scroll

  $(window).on("scroll", () => {
    if ($(this).scrollTop() > 0) {
      header.addClass("is-page-scroll");
    } else {
      header.removeClass("is-page-scroll");
    }

    if ($(this).scrollTop() > 50) {
      header.addClass("fixed");
    } else {
      header.removeClass("fixed");
    }
  });

  // Mobile Menu

  $(".open-menu").on("click", () => {
    header.toggleClass("is-menu-open");

    setTimeout(() => {
      $("#mobile-menu").toggleClass("active");
    }, 75);
  });

  const mobileMenuList = $(".mobile-menu-list");

  const arrMobileMenuPage = $('[class^="mobile-menu-page-"]');
  const arrMobileMenuDialog = $('[class^="mobile-menu-dialog-"]');

  [...arrMobileMenuPage].map((item, i) => {
    $(`.${item.className}`).on("click", () => {
      mobileMenuList.css("margin-left", "-100%");

      setTimeout(() => {
        $([...arrMobileMenuDialog][i]).css("display", "block");
      }, 300);
    });
  });

  $(".back-mobile-menu-list").on("click", () => {
    mobileMenuList.css("margin-left", "0");
    $(arrMobileMenuDialog).css("display", "none");
  });

  // Search Box

  $("#searchBox").removeAttr("tabIndex");

  $(".open-search-bar").on("click", () => {
    $("#searchBox").addClass("active");
    $("#searchBox input").focus();
    $("#searchBox").attr("tabIndex");
  });

  $(".close-search-box").on("click", () => {
    $("#searchBox").removeClass("active");
    $("#searchBox").removeAttr("tabIndex");
  });

  const menu = document.querySelectorAll(
    "#header .navigation > .dropdown .dropdown-duplo"
  );

  if (menu.length > 0) {
    menu.forEach((e) => {
      let element = e.querySelector("a.dropdown-item");
      element.addEventListener("click", (event) => {
        event.preventDefault();
        e.classList.toggle("show");
      });
    });
  }

  // Content Tab - Home

  const tabs = document.querySelectorAll(".tab");
  const contents = document.querySelectorAll(".content");

  for (let i = 0; i < tabs.length; i++) {
    tabs[i].addEventListener("click", () => {
      for (let j = 0; j < contents.length; j++) {
        contents[j].classList.remove("content--active");
      }

      for (let jj = 0; jj < tabs.length; jj++) {
        tabs[jj].classList.remove("tabs--active");
      }

      contents[i].classList.add("content--active");
      tabs[i].classList.add("tabs--active");
    });
  }

  // Carousel - Home

  if (window.matchMedia("(max-width: 991.98px)").matches) {
    $(".ecosystem-cash3-card").slick({
      infinite: false,
      slidesToShow: 3,
      slidesToScroll: 1,
      centerMode: false,
      arrows: false,
    });
  }

  $('[data-toggle="tooltip"]').tooltip();

  $(".carousel-glossary").slick({
    asNavFor: ".carousel-glossary-content",

    slidesToShow: 15,
    slidesToScroll: 1,

    dots: false,
    focusOnSelect: true,
    infinite: false,
    waitForAnimate: true,
    responsive: [
      {
        breakpoint: 1199,
        settings: {
          slidesToShow: 6,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 767,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 426,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
    ],
  });

  $(".carousel-glossary-content").slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    fade: false,
    speed: 200,
    asNavFor: ".carousel-glossary",
    infinite: false,
    draggable: false,
    waitForAnimate: true,
    adaptiveHeight: true,
  });

  // Basic Timeline

  $(".carousel-timeline-content").slick({
    slidesToShow: 2,
    slidesToScroll: 1,
    infinite: false,
    adaptiveHeight: true,
    arrows: false,
    asNavFor: ".carousel-timeline-nav",
  });

  $(".carousel-timeline-nav").slick({
    slidesToShow: 2,
    slidesToScroll: 1,
    infinite: false,

    dots: false,
    centerMode: false,
    focusOnSelect: true,

    asNavFor: ".carousel-timeline-content",
  });

  $(".carousel-timeline-nav .slick-next").on("click", () => {
    if ($(".slick-next").hasClass("slick-disabled")) {
      $(".slick-next.slick-disabled").attr("disabled", "disabled");
    }
  });

  $(".carousel-timeline-nav .slick-prev").on("click", () => {
    $(".slick-next").removeAttr("disabled");
  });
});

let cardsSwiper = null;

function initCardsSwiper() {
  const windowWidth = window.innerWidth;

  if (windowWidth < 1200) {
    if (!cardsSwiper) {
      cardsSwiper = new Swiper(".cards-swiper", {
        loop: false,
        spaceBetween: 16,
        autoplay: {
          delay: 3000,
        },
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
        },
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        },

        breakpoints: {
          0: {
            slidesPerView: 1,
            grid: {
              rows: 1,
              fill: "row",
            },
          },
          768: {
            slidesPerView: 2,
            grid: {
              rows: 2,
              fill: "row",
            },
          },
        },
      });

      console.log("Swiper initialized");
    }
  } else {
    if (cardsSwiper) {
      cardsSwiper.destroy(true, true);
      cardsSwiper = null;
      console.log("....");
    }
  }
}

$(document).ready(() => {
  initCardsSwiper();
});

$(window).on("resize", () => {
  clearTimeout(window.swiperResizeTimeout);
  window.swiperResizeTimeout = setTimeout(initCardsSwiper, 300);
});

$("#header .navigation .dropdown > .dropdown-toggle").removeAttr(
  "data-bs-toggle"
);

document.querySelectorAll("#header .navigation .dropdown").forEach((i) => {
  i.addEventListener("mouseover", () => {
    i.classList.add("show");
  });
  i.addEventListener("mouseleave", () => {
    i.classList.remove("show");
  });
});
