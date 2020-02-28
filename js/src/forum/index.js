import { extend } from "flarum/extend";
import CommentPost from "flarum/components/CommentPost";
import ForumApplication from "flarum/ForumApplication";
import lightbox from "./lightbox2";

app.initializers.add("jjwind320-formatting", () => {
  extend(CommentPost.prototype, "config", function () {
    var isInitialized = arguments[1];
    if (isInitialized) {
      return;
    }

    this.$("a.jj-f-a")
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

    this.$("div.Post-body").addClass("jj-f-post-body");

    var isWx =
      window.navigator.userAgent.toLowerCase().match(/MicroMessenger/i) ==
      "micromessenger";

    if (!isWx) {
      let postId = this.props["post"].data.id;
      this.$("img.jj-f-img, img.raw-image").each(function () {
        let a =
          '<a class="jj-f-img-a" href="' +
          $(this).attr("src") +
          '" data-lightbox="post-' +
          postId +
          '" data-alt="' +
          ($(this).attr("alt") || "") +
          '" data-title=""></a>';
        $(this).wrap(a);
      });
      lightbox.option({
        albumLabel: "%1 / %2"
      });
    } else {
      var urls = this.$("img.jj-f-img, img.raw-image")
        .map(function () {
          return $(this).attr("src");
        }).get();
      this.$("img.jj-f-img, img.raw-image").each(function () {
        var curUrl = $(this).attr("src");
        wx.ready(function () {
          wx.previewImage({
            current: curUrl, // 当前显示图片的http链接
            urls: urls // 需要预览的图片http链接列表
          });
        });
      });
    }
  });

  extend(ForumApplication.prototype, "mount", function () {
    console.log("============> Yin shaobin add somethings here!!!");

    var isWx =
      window.navigator.userAgent.toLowerCase().match(/MicroMessenger/i) ==
      "micromessenger";

    if (isWx) {
      var configWxJsSdk = function () {
        m.request({
          method: "GET",
          url: "http://api.film.rimag.com.cn/api/weixin/GetJsSdkUiPackage",
          params: { url: location.href.split("#")[0] },
          withCredentials: true
        }).then(function (res) {
          wx.config({
            debug: false,
            appId: res.data.jsSdkUiPackage.appId,
            timestamp: res.data.jsSdkUiPackage.timestamp,
            nonceStr: res.data.jsSdkUiPackage.nonceStr,
            signature: res.data.jsSdkUiPackage.signature,
            jsApiList: [
              "previewImage",
              "updateAppMessageShareData",
              "updateTimelineShareData"
            ]
          });
        });
      };

      $(document.body)
        .on("jj-f-location:changed", configWxJsSdk)
        .trigger("jj-f-location:changed");

      (function (history) {
        var pushState = history.pushState;
        history.pushState = function (state) {
          if (typeof history.onpushstate == "function") {
            history.onpushstate({ state: state });
          }
          var oldHref = location.href.split("#")[0];
          var result = pushState.apply(history, arguments);
          var newHref = location.href.split("#")[0];
          if (oldHref != newHref) {
            setTimeout(function () {
              $(document.body).trigger("jj-f-location:changed");
            }, 0);
          }
          return result;
        };
        var replaceState = history.replaceState;
        history.replaceState = function (state) {
          if (typeof history.onreplaceState == "function") {
            history.onreplaceState({ state: state });
          }
          var oldHref = location.href.split("#")[0];
          var result = replaceState.apply(history, arguments);
          var newHref = location.href.split("#")[0];
          if (oldHref != newHref) {
            setTimeout(function () {
              $(document.body).trigger("jj-f-location:changed");
            }, 0);
          }
          return result;
        };
      })(window.history);
    }
  });
});
