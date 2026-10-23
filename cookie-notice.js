(function () {
  var notice = document.getElementById("cookieNotice");
  var close = document.getElementById("cookieClose");
  var accept = document.getElementById("cookieAccept");
  var decline = document.getElementById("cookieDecline");
  if (!notice || !close || !accept || !decline) return;

  var name = "veldren_cookie_notice=";
  var seen = document.cookie.split(";").some(function (part) {
    return part.trim().indexOf(name) === 0;
  });
  if (seen) return;

  function choose(value) {
    notice.hidden = true;
    document.cookie = name + value + "; path=/; max-age=15552000; SameSite=Lax";
  }

  notice.hidden = false;
  close.addEventListener("click", function () { choose("dismissed"); });
  accept.addEventListener("click", function () { choose("accepted"); });
  decline.addEventListener("click", function () { choose("declined"); });
})();
