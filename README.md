# Formatting Extension for Flarum by yinshaobin

![License](https://img.shields.io/badge/license-MIT-blue.svg) [![Latest Stable Version](https://img.shields.io/packagist/v/jjwind320/flarum-ext-formatting.svg)](https://packagist.org/packages/jjwind320/flarum-ext-formatting)

本扩展包依赖以下扩展包：

* [fof/formatting](https://packagist.org/packages/fof/formatting)

本扩展包不能与以下扩展包兼容：
  
* [zerosonesfun/bbbbcode](https://packagist.org/packages/zerosonesfun/bbbbcode)
* [zerosonesfun/font](https://packagist.org/packages/zerosonesfun/font)
* [zerosonesfun/chat](https://packagist.org/packages/zerosonesfun/chat)
* [zerosonesfun/bbcard](https://packagist.org/packages/zerosonesfun/bbcard)

### 安装

```sh
composer require jjwind320/flarum-ext-formatting
```

### 更新

```sh
composer update jjwind320/flarum-ext-formatting
```

### 支持的 BBCODE 写法

-----

***以下标签是从 flarum/bbcode 内加载的***

-----

- B [B]{TEXT}[/B] 粗体
- I [I]{TEXT}[/I] 斜体
- U [U]{TEXT}[/U] 下划线
- S [S]{TEXT}[/S] 删除线
- URL [URL={URL;useContent} title={TEXT?}]{TEXT}[/URL] 链接地址
- IMG [IMG src={URL;useContent} title={TEXT?} alt={TEXT?} height={UINT?}  width={UINT?} ] 图片
- EMAIL [EMAIL={EMAIL;useContent}]{TEXT}[/EMAIL] 电子邮件
- CODE [CODE lang={IDENTIFIER?}]{TEXT}[/CODE] 代码文本
- QUOTE [QUOTE author={TEXT?}]{TEXT}[/QUOTE] 引用文本
- LIST [LIST type={HASHMAP=1:decimal,a:lower-alpha,A:upper-alpha,i:lower-roman,I:upper-roman;optional;postFilter=#simpletext} start={UINT;optional} #createChild=LI]{TEXT}[/LIST] 列表
- \* [\*]{TEXT}[/\*] 列表项
- DEL [DEL]{TEXT}[/DEL] 删除线
- COLOR [COLOR={COLOR}]{TEXT}[/COLOR] 字体颜色
- CENTER [CENTER]{TEXT}[/CENTER] 居中
- SIZE [SIZE={RANGE=8,36}]{TEXT}[/SIZE] 字体大小

-----

- ***以下标签是本包加入的，基于s9e/textformatter***

-----

- TABLE [TABLE]{ANYTHING}[/TABLE] 表格
- TBODY [TBODY]{ANYTHING}[/TBODY] 表体
- TD [TD align={CHOICE=left,center,right,justify;caseSensitive;optional;preFilter=strtolower} colspan={UINT?} rowspan={UINT?} #createParagraphs=false]{TEXT}[/TD] 单元格
- TH [TH align={CHOICE=left,center,right,justify;caseSensitive;optional;preFilter=strtolower} colspan={UINT?} rowspan={UINT?} #createParagraphs=false]{TEXT}[/TH] 表头单元格
- TR [TR]{ANYTHING}[/TR] 表行
- THEAD [THEAD]{ANYTHING}[/THEAD] 表头
- HR [HR] 分割线
- FLOAT [float={CHOICE=left,right,none}]{TEXT}[/float] 漂浮
- BACKGROUND [BACKGROUND={COLOR}]{TEXT}[/BACKGROUND] 背景颜色
- DL [DL]{TEXT}[/DL] 描述列表
- DT [DT]{TEXT}[/DT] 描述列表内某项定义
- DD [DD]{TEXT}[/DD] 描述列表内某项描述
- H1 [H1]{TEXT}[/H1] 标题1
- H2 [H2]{TEXT}[/H2] 标题2
- H3 [H3]{TEXT}[/H3] 标题3
- H4 [H4]{TEXT}[/H4] 标题4
- H5 [H5]{TEXT}[/H5] 标题5
- H6 [H6]{TEXT}[/H6] 标题6
- LEFT [LEFT]{TEXT}[/LEFT] 左对齐
- RIGHT [RIGHT]{TEXT}[/RIGHT] 右对齐
- SUB [SUB]{TEXT}[/SUB] 下沉
- SUP [SUP]{TEXT}[/SUP] 上浮

-----

***以下是新增的标签 来自 [zerosonesfun/font](https://packagist.org/packages/zerosonesfun/font) [zerosonesfun/chat](https://packagist.org/packages/zerosonesfun/chat) [zerosonesfun/bbcard](https://packagist.org/packages/zerosonesfun/bbcard)***

-----

- Z [Z] 空格
- CHAT 未完成
- CARD 未完成
- HL 未完成

-----

***新增嵌入媒体***

-----

- [哔哩哔哩](https://www.bilibili.com/) [MEDIA]哔哩哔哩视频网址[/MEDIA]
- [虎牙](https://www.huya.com/) [MEDIA]虎牙直播网址[/MEDIA]
- [s9e/textformatter支持的网站](https://s9etextformatter.readthedocs.io/Plugins/MediaEmbed/Sites/)
- 安全阅片器支持 [PACS=阅片地址][/PACS]

### 链接

- [Packagist](https://packagist.org/packages/jjwind320/flarum-ext-formatting)
- [GitHub](https://github.com/jjwind320/flarum-ext-formatting)

