import { extend } from "flarum/extend";
import CommentPost from "flarum/components/CommentPost";

app.initializers.add("jjwind320-formatting", () => {
  extend(CommentPost.prototype, "config", function() {
    const links = this.$("a")
      .not(".jj-f-link")
      .not(
        'a[href$=".mp3"], a[href$=".ogg"], a[href$=".wav"], a[href$=".mp4"], a[href$=".m4a"], a[href$=".acc"], a[href$=".opus"], a[href$=".flac"]'
      );

    links
      .filter(function() {
        return this.hostname && this.hostname !== location.hostname;
      })
      .addClass("jj-f-link")
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
  });
});
