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
      //微信图片预览
      this.$("img.jj-f-img, img.raw-image").each(function () {
        $(this).on("click", function () {
          let curUrl = $(this).attr("src") || "";
          let urls =
            $(this)
              .parents("article.CommentPost")
              .find("img.jj-f-img, img.raw-image")
              .map(function () {
                return $(this).attr("src");
              })
              .get() || [];
          wx.ready(function () {
            wx.previewImage({
              current: curUrl, // 当前显示图片的http链接
              urls: urls // 需要预览的图片http链接列表
            });
          });
        });
      });

      //微信分享
      var regx = new RegExp("^/d/(\\d+)(/\\d+)?", "i");
      var newDiscussId = parseInt(
        (location.pathname.match(regx) || ["", "0"])[1]
      );
      var newPostIdx = parseInt(
        this.$()
          .parent()
          .attr("data-index")
      );
      var discussId = parseInt(
        ($(document.body).data("jj-f-wxshare") || { discussId: "-1" }).discussId
      );
      var postIdx = parseInt(
        ($(document.body).data("jj-f-wxshare") || { postIdx: "999999" }).postIdx
      );
      if (newDiscussId != discussId || newPostIdx < postIdx) {
        $(document.body).data("jj-f-wxshare", {
          discussId: newDiscussId.toString(),
          postIdx: newPostIdx.toString()
        });

        var imgUrl = location.origin + "/rimag-logo-bbs.png";
        if (this.$("img.jj-f-img, img.raw-image").length) {
          imgUrl = this.$("img.jj-f-img, img.raw-image")
            .first()
            .attr("src");
        }
        var title =
          this.$()
            .parents("div.DiscussionPage-discussion")
            .find("h2.DiscussionHero-title").text() || "欢迎来到【一脉社区】";
        var desc =
          this.$("div.Post-body")
            .text().trim().replace(/\r\n/g, "").replace(/\n/g, "")
            .substr(0, 50) ||
          "【一脉社区】是一脉阳光影像医院集团发布的以讨论医学影像为中心的知识型社区";

        wx.ready(function () {
          wx.updateAppMessageShareData({
            title: title, // 分享标题
            desc: desc, // 分享描述
            link: location.href, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            imgUrl: imgUrl, // 分享图标
            success: function () {
              // 设置成功
            }
          });
          wx.updateTimelineShareData({
            title: title, // 分享标题
            link: location.href, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            imgUrl: imgUrl, // 分享图标
            success: function () {
              // 设置成功
            }
          });
        });
      }
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
          url:
            "http://api.film.rimag.com.cn/api/weixin/GetJsSdkUiPackage?url=" +
            encodeURIComponent(location.href.split("#")[0]),
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

      var setWxShare = function () {
        var regx = new RegExp("^/d/(\\d+)(/\\d+)?", "i");
        if (location.pathname.match(regx)) {
          return;
        }
        wx.ready(function () {
          var shareData = {
            title: "欢迎来到【一脉社区】",
            desc:
              "【一脉社区】是一脉阳光影像医院集团发布的以讨论医学影像为中心的知识型社区",
            imgUrl: location.origin + "/rimag-logo-bbs.png",
            link: location.origin + "/index.php"
          };

          $(document.body).data("jj-f-wxshare", {
            discussId: "-1",
            postIdx: "999999"
          });

          wx.updateAppMessageShareData({
            title: shareData.title, // 分享标题
            desc: shareData.desc, // 分享描述
            link: shareData.link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            imgUrl: shareData.imgUrl, // 分享图标
            success: function () {
              // 设置成功
            }
          });
          wx.updateTimelineShareData({
            title: shareData.title, // 分享标题
            link: shareData.link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            imgUrl: shareData.imgUrl, // 分享图标
            success: function () {
              // 设置成功
            }
          });
        });
      };

      $(document.body)
        .on("jj-f-location:changed", function () {
          configWxJsSdk();
          setWxShare();
        })
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
