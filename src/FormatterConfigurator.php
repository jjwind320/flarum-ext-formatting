<?php

namespace JJwind320\FlarumExtFormatting;

use Flarum\Settings\SettingsRepositoryInterface;
use Illuminate\Contracts\Events\Dispatcher;
use Flarum\Formatter\Event\Configuring;
use JJwind320\FlarumExtFormatting\AES\Prpcrypt;
use JJwind320\FlarumExtFormatting\AES\ErrorCode;


class FormatterConfigurator
{
    /**
     * @var SettingsRepositoryInterface
     */
    protected $settings;

    public function __construct(SettingsRepositoryInterface $settings)
    {
        $this->settings = $settings;
    }

    /**
     * Subscribes to the Flarum events.
     *
     * @param Dispatcher $events
     */
    public function subscribe(Dispatcher $events)
    {
        $events->listen(Configuring::class, [$this, 'configureFormatter']);
    }

    public function configureFormatter(Configuring $event)
    {
        $encPacsAppId = $this->settings->get('jjwind320-ext-formatting.enc_pacs_app_id');
        $encPacsAesKey = $this->settings->get('jjwind320-ext-formatting.enc_pacs_aes_key');
        $encPacsBaseAddress = $this->settings->get('jjwind320-ext-formatting.enc_pacs_base_address');

        $configurator = $event->configurator;

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
                    'src'    => $encPacsBaseAddress . '{@path}'
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

            $tag->attributes->add('url')->filterChain->append('#url');
            $tag->filterChain->prepend('JJwind320\\FlarumExtFormatting\\FormatterConfigurator::ConvertWeiyun')
                ->addParameterByValue($encPacsAppId)
                ->addParameterByValue($encPacsAesKey)
                ->addParameterByValue($encPacsBaseAddress);
            $tag->template = '<xsl:if test="@url"><div>'
                . '<a target="_blank" href="{@url}">【一脉云安全阅片器】点击在新窗口打开'
                . '<i class="fas fa-link" style="margin:0 0 0 5px;"></i></a></div></xsl:if>'
                . $tag->template;
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

    public static function ConvertWeiyun($tag, $encPacsAppId, $encPacsAesKey, $encPacsBaseAddress)
    {
        $weiyunPath = $tag->getAttribute('path');
        $fPath = '';

        if (preg_match("((?'op'[^?#]+)(?'qs'\?[^#]*)?(?'hs'.*)?)", $weiyunPath, $m))
        {
            $weiyunOpenPath = $m['op'];
            $pc = new Prpcrypt;
            $array = $pc->encrypt($weiyunOpenPath, $encPacsAppId, $encPacsAesKey);
            if ($array[0] == ErrorCode::$OK)
            {
                $fPath = $array[1];
                $fPath = str_replace('/','_',$fPath);
                $fPath = str_replace('+','-',$fPath);
                $fPath = $fPath . '?appId=' . $encPacsAppId;
            }
        }

        $tag->setAttribute('path', $fPath);
        $tag->setAttribute('url', $encPacsBaseAddress . $fPath);
    }
}
