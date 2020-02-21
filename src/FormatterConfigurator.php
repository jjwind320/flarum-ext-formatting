<?php

namespace JJwind320\FlarumExtFormatting;

use s9e\TextFormatter\Configurator;
use JJwind320\FlarumExtFormatting\AES\Prpcrypt;

class FormatterConfigurator
{
    public function Configure(Configurator $configurator)
    {
        // 修改 url 标签使其在新窗口打开
        $configurator->BBCodes->addFromRepository('URL');
        // Get the default URL template as a DOMDocument
        $dom = $configurator->tags['URL']->template->asDOM();
        // Set a target="_blank" attribute to any <a> element
        foreach ($dom->getElementsByTagName('a') as $a)
        {
            // create icon
            $icon = $dom->createElement('i');
            $icon->setAttribute('class','fas fa-link');
            $icon->setAttribute('style','margin:0 0 0 5px;');

            $a->setAttribute('target', '_blank');
            $a->appendChild($icon);
        }
        // Save the changes
        $dom->saveChanges();

        // 新增嵌入媒体网站
        // 网易音乐 www.music163.com
        $configurator->MediaEmbed->add(
            'music163',
            [
                'host'    => 'music.163.com',
                'extract' => "!music\\.163\\.com/outchain/player\\?type=(?'type'\\d+)&id=(?'id'\\d+)&auto=(?'auto'\\d+)&height=(?'height'\\d+)!",
                'iframe'  => [
                    'width'  => "100%",
                    'height' => 430,
                    'src'    => '//music.163.com/outchain/player?type={@type}&id={@id}&auto={@auto}&height={@height}'
                ]
            ]
        );
        // 哔哩哔哩 www.bilibili.com
        $configurator->MediaEmbed->add(
            'bilibili',
            [
                'host'    => 'www.bilibili.com',
                'extract' => [
                    "!www.bilibili.com/video/av(?'id'\\d+)!",
                    "!www.bilibili.com/video/av(?'id'\\d+)\\?p=(?'pid'\\w+)!"
                ],
                'iframe'  => [
                    'src'    => '//player.bilibili.com/player.html?aid={@id}&page={@pid}'
                ]
            ]
        );
        // 腾讯视频 v.qq.com
        $configurator->MediaEmbed->add(
            'videoqq',
            [
                'host'    => 'qq.com',
                'extract' => [
                    "!qq\\.com/x/cover/\\w+/(?'id'\\w+)\\.html!",
                    "!qq\\.com/x/cover/\\w+\\.html\\?vid=(?'id'\\w+)!",
                    "!qq\\.com/cover/[^/]+/\\w+/(?'id'\\w+)\\.html!",
                    "!qq\\.com/cover/[^/]+/\\w+\\.html\\?vid=(?'id'\\w+)!",
                    "!qq\\.com/x/page/(?'id'\\w+)\\.html!",
                    "!qq\\.com/page/[^/]+/[^/]+/[^/]+/(?'id'\\w+)\\.html!"
                ],
                'iframe'  => [
                    'src'    => '//v.qq.com/txp/iframe/player.html?vid={@id}'
                ]
            ]
        );
        // 虎牙直播 www.huya.com
        $configurator->MediaEmbed->add(
            'huya',
            [
                'host'    => 'liveshare.huya.com',
                'extract' => [
                    "!liveshare\\.huya\\.com/iframe/(?'id'\\w+)!",
                ],
                'iframe'  => [
                    'src'    => '//liveshare.huya.com/iframe/{@id}'
                ]
            ]
        );

        // 加入一脉阅片支持
        // 微云版本 viewer.weiyun.rimag.com.cn
        $configurator->MediaEmbed->add(
            'weiyunpacs',
            [
                'host'    => 'viewer.weiyun.rimag.com.cn',
                'extract' => [
                    "!viewer\\.weiyun\\.rimag\\.com\\.cn/s/(?'path'.+)!",
                ],
                'iframe'  => [
                    'height' => 640,
                    'src'    => 'http://119.3.32.198:12311/view/{@path}'
                ]
            ]
        );

        // 阅片链接aes加密处理
        foreach ($configurator->tags as $tag)
        {
            if (strpos($tag->template, 'data-s9e-mediaembed') === false)
            {
                continue;
            }

            if (strpos($tag->template, 'weiyunpacs') === false)
            {
                continue;
            }

            // echo('my template::'.$tag->template);
            $tag->attributes->add('url')->filterChain->append('#url');
            $tag->filterChain->prepend('JJwind320\\FlarumExtFormatting\\FormatterConfigurator::ConvertWeiyun');
            $tag->template = '<xsl:if test="@url"><div><a href="{@url}">全屏查看</a></div></xsl:if>'
                . $tag->template;

            // $tag->attributes['id']->filterChain
            //     ->append('JJwind320\\FlarumExtFormatting\\FormatterConfigurator::replacePath');

            // var_dump($tag->attributes);
            // $tag->filterChain->append('JJwind320\\FlarumExtFormatting\\FormatterConfigurator::replaceUrl');

            // echo($tag->contentAttributes['url']);
            // $tag->attributes->add('url')->filterChain->append('#url');
            // $tag->filterChain->prepend('addMediaUrl')->addParameterByName('parser');
            // $tag->template .= '<xsl:if test="@url"><a href="{@url}"><xsl:value-of select="@url"/></a></xsl:if>';
        }

        // 阅片快捷标签
        $configurator->BBCodes->add(
            'pacs',
            [
                'contentAttributes' => ['url'],
                'tagName'           => 'MEDIA'
            ]
        );
    }

    public static function ConvertWeiyun($tag)
    {
        // $pos = $tag->getPos();
        // if ($tag->getEndTag())
        // {
        //     $len = $tag->getEndTag()->getPos() + $tag->getEndTag()->getLen() - $pos;
        // }
        // else
        // {
        //     $len = $tag->getLen();
        // }

        // // If the text contains a URL, add it as an attribute
        // $text = substr($parser->getText(), $pos, $len);
        // if (preg_match('(https?://[^[]++)', $text, $m))
        // {
        //     $tag->setAttribute('url', $m[0]);
        // }

        $appId = 'rmgc-bbs';
        $encodingAesKey = '/3J4trT1ZU0QMGv8upvbpN0YjdYdKT0v4V8QkZcSSQw';
        $fBaseAddress = 'http://119.3.32.198:12311/view/';

        $weiyunPath = $tag->getAttribute('path');
        $fPath = '';

        if (preg_match("((?'op'[^?#]+)(?'qs'\?[^#]*)?(?'hs'.*)?)", $weiyunPath, $m))
        {
            $weiyunOpenPath = $m['op'];
            $pc = new Prpcrypt($encodingAesKey);
            $array = $pc->encrypt($weiyunOpenPath, $appId);
            $fPath = $array[1] . '?appId=' . $appId;
        }
        
        $tag->setAttribute('path', $fPath);
        $tag->setAttribute('url', $fBaseAddress . $fPath);
        // var_dump($tag);
        // return 'xHVMdKeBW0eAiEzPtLacnxi5dTVA-yHlIOPWs1AmGRw72DIg0wzTotjZJwpeOBmFH5iUBaH9g8WxqFFqid3WFtN1hQzONkFCNoemGwkmS4Oktuw87Xa33iemZWoIfNy3';
    }
}