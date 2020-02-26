import { extend } from "flarum/extend";
import CommentPost from "flarum/components/CommentPost";
import lightbox from "./lightbox2";

app.initializers.add("jjwind320-formatting", () => {
  extend(CommentPost.prototype, "config", function () {
    this.$("a.jj-f-a")
      .not(".jj-f-a-ext")
      .filter(function () {
        return this.hostname && this.hostname !== location.hostname;
      })
      .addClass("jj-f-a-ext")
      .on("click", function () {
        var linkAddr = $(this).attr("href");
        window.setTimeout(function () {
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

    if (!isWx) {
      let postId = this.props["post"].data.id;
      this.$("img.jj-f-img")
        .not(".jj-f-img-i")
        .each(function () {
          let a =
            '<a class="jj-f-img-a" href="' +
            $(this).attr("src") +
            '" data-lightbox="post-' +
            postId +
            '" data-alt="' +
            ($(this).attr("alt") || "") +
            '" data-title=""></a>';
          $(this)
            .addClass("jj-f-img-i")
            .wrap(a);
        });
      lightbox.option({
        albumLabel: "%1 / %2"
      });
    }
  });
});
