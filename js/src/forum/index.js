import { extend } from "flarum/extend";
import CommentPost from "flarum/components/CommentPost";
import Swal from "sweetalert2";

app.initializers.add("jjwind320-formatting", () => {
  extend(CommentPost.prototype, "config", function() {
    this.$("a.jj-f-a")
      .not(".jj-f-a-ext")
      .filter(function() {
        return this.hostname && this.hostname !== location.hostname;
      })
      .addClass("jj-f-a-ext")
      .on("click", function() {
        var linkAddr = $(this).attr("href");
        window.setTimeout(function() {
          window.open(linkAddr, "_blank");
        }, 0);
        return false;
      });

    this.$("div.Post-body")
      .not(".jj-f-post-body")
      .addClass("jj-f-post-body");

    var isWx =
      window.navigator.userAgent.toLowerCase().match(/MicroMessenger/i) ==
      "micromessenger";

    this.$("img.jj-f-img").on("click", function() {
      var imgSrc = $(this).attr("src");

      if (!isWx) {
        Swal.fire({
          imageUrl: imgSrc,
          showConfirmButton: false
        });
      }
    });
  });
});
