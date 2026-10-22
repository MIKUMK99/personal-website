(function () {
  var toggle = document.querySelector(".nav-toggle");
  var links = document.querySelector(".nav-links");

  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
      toggle.textContent = open ? "关闭" : "菜单";
    });

    links.addEventListener("click", function (event) {
      if (!event.target.closest("a")) return;
      links.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.textContent = "菜单";
    });
  }

  var navAnchors = Array.prototype.slice.call(
    document.querySelectorAll('.nav-links a[href^="#"]')
  );
  var sections = navAnchors
    .map(function (anchor) {
      return document.querySelector(anchor.getAttribute("href"));
    })
    .filter(Boolean);

  if ("IntersectionObserver" in window && sections.length) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var id = "#" + entry.target.id;
          navAnchors.forEach(function (anchor) {
            anchor.classList.toggle("is-active", anchor.getAttribute("href") === id);
          });
        });
      },
      { rootMargin: "-80px 0px -65% 0px", threshold: 0 }
    );
    sections.forEach(function (section) {
      observer.observe(section);
    });
  }

  var dialog = document.querySelector("#lightbox");
  var lightboxImage = dialog ? dialog.querySelector("img") : null;
  var lightboxCaption = dialog ? dialog.querySelector("p") : null;

  Array.prototype.forEach.call(document.querySelectorAll("[data-zoom]"), function (button) {
    button.addEventListener("click", function () {
      var source = button.querySelector("img");
      if (!source) return;
      var src = source.currentSrc || source.src;
      var caption = button.getAttribute("data-caption") || source.alt;

      if (!dialog || typeof dialog.showModal !== "function") {
        window.open(src, "_blank", "noopener");
        return;
      }

      lightboxImage.src = src;
      lightboxImage.alt = source.alt;
      lightboxCaption.textContent = caption;
      dialog.showModal();
    });
  });

  if (dialog) {
    dialog.addEventListener("click", function (event) {
      if (event.target === dialog) dialog.close();
    });
    var closeButton = dialog.querySelector("[data-close]");
    if (closeButton) {
      closeButton.addEventListener("click", function () {
        dialog.close();
      });
    }
    dialog.addEventListener("close", function () {
      if (lightboxImage) lightboxImage.removeAttribute("src");
    });
  }

  Array.prototype.forEach.call(document.querySelectorAll("[data-copy]"), function (button) {
    button.addEventListener("click", function () {
      var text = button.getAttribute("data-copy");
      var original = button.textContent;

      function done() {
        button.textContent = "已复制";
        window.setTimeout(function () {
          button.textContent = original;
        }, 1600);
      }

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done).catch(function () {
          window.prompt("请手动复制：", text);
        });
        return;
      }

      window.prompt("请手动复制：", text);
    });
  });
})();
