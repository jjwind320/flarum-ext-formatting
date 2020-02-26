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
        $this->addRepositories($event);
        $this->addCustomBbcode($event);
        $this->configureUrl($event);
        $this->configureImg($event);

        if ($this->settings->get('fof-formatting.plugin.mediaembed'))
        {
            $this->addMediaEmbedSites($event);
            $this->addPacs($event);
        }
    }

    // added by jjwind320
    // add tags from s9e\TextFormatter
    private function addRepositories(Configuring $event)
    {
        $configurator = $event->configurator;

        $configurator->BBCodes->addFromRepository('TABLE');
        $configurator->BBCodes->addFromRepository('TBODY');
        $configurator->BBCodes->addFromRepository('TD');
        $configurator->BBCodes->addFromRepository('TH');
        $configurator->BBCodes->addFromRepository('TR');
        $configurator->BBCodes->addFromRepository('THEAD');
        $configurator->BBCodes->addFromRepository('HR');
        $configurator->BBCodes->addFromRepository('FLOAT');
        $configurator->BBCodes->addFromRepository('BACKGROUND');
        $configurator->BBCodes->addFromRepository('DL');
        $configurator->BBCodes->addFromRepository('DT');
        $configurator->BBCodes->addFromRepository('DD');
        $configurator->BBCodes->addFromRepository('H1');
        $configurator->BBCodes->addFromRepository('H2');
        $configurator->BBCodes->addFromRepository('H3');
        $configurator->BBCodes->addFromRepository('H4');
        $configurator->BBCodes->addFromRepository('H5');
        $configurator->BBCodes->addFromRepository('H6');
        $configurator->BBCodes->addFromRepository('LEFT');
        $configurator->BBCodes->addFromRepository('RIGHT');
        $configurator->BBCodes->addFromRepository('SUB');
        $configurator->BBCodes->addFromRepository('SUP');
    }

    // added by jjwind320
    private function addCustomBbcode(Configuring $event)
    {
        $configurator = $event->configurator;

        $configurator->BBCodes->addCustom(
            '[z size={NUMBER?;defaultValue=2}]',
            '<span style="display:inline-block;width:{NUMBER}em;"></span>'
        );

        $configurator->BBCodes->addCustom(
            '[tel number={SIMPLETEXT;useContent}]{TEXT}[/tel]',
            '<a href="tel:{SIMPLETEXT}" class="jj-f-tel">{TEXT}</a>'
        );
    }

    // added by jjwind320
    // add mediaembed sites and encryped pacs
    private function addMediaEmbedSites(Configuring $event)
    {
        $configurator = $event->configurator;

        // 新增嵌入媒体网站
        // 网易音乐 www.music163.com
        // $configurator->MediaEmbed->add(
        //     'music163',
        //     [
        //         'host'    => 'music.163.com',
        //         'extract' => "!music\\.163\\.com/outchain/player\\?type=(?'type'\\d+)&id=(?'id'\\d+)&auto=(?'auto'\\d+)&height=(?'height'\\d+)!",
        //         'iframe'  => [
        //             'width'  => "100%",
        //             'height' => 430,
        //             'src'    => '//music.163.com/outchain/player?type={@type}&id={@id}&auto={@auto}&height={@height}'
        //         ]
        //     ]
        // );
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
        // $configurator->MediaEmbed->add(
        //     'videoqq',
        //     [
        //         'host'    => 'qq.com',
        //         'extract' => [
        //             "!qq\\.com/x/cover/\\w+/(?'id'\\w+)\\.html!",
        //             "!qq\\.com/x/cover/\\w+\\.html\\?vid=(?'id'\\w+)!",
        //             "!qq\\.com/cover/[^/]+/\\w+/(?'id'\\w+)\\.html!",
        //             "!qq\\.com/cover/[^/]+/\\w+\\.html\\?vid=(?'id'\\w+)!",
        //             "!qq\\.com/x/page/(?'id'\\w+)\\.html!",
        //             "!qq\\.com/page/[^/]+/[^/]+/[^/]+/(?'id'\\w+)\\.html!"
        //         ],
        //         'iframe'  => [
        //             'src'    => '//v.qq.com/txp/iframe/player.html?vid={@id}'
        //         ]
        //     ]
        // );
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
    }

    private function addPacs(Configuring $event)
    {
        $configurator = $event->configurator;

        $pacsAppId = $this->settings->get('jjwind320-ext-formatting.enc_pacs_app_id');
        $pacsAesKey = $this->settings->get('jjwind320-ext-formatting.enc_pacs_aes_key');
        $pacsBaseAddress = $this->settings->get('jjwind320-ext-formatting.enc_pacs_base_address');

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
                    'src'    => $pacsBaseAddress . '{@path}'
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
                ->addParameterByValue($pacsAppId)
                ->addParameterByValue($pacsAesKey)
                ->addParameterByValue($pacsBaseAddress);
            $tag->template = '<div><xsl:if test="@url"><div>'
                . '<a href="{@url}">【一脉云安全阅片器】点击大窗查看'
                . '</a></div></xsl:if>'
                . $tag->template . '</div>';
        }

        // 阅片快捷标签
        $configurator->BBCodes->add(
            'pacs',
            [
                'defaultAttribute'  => 'url',
                'tagName'           => 'MEDIA'
            ]
        );
    }

    public static function ConvertWeiyun($tag, $pacsAppId, $pacsAesKey, $pacsBaseAddress)
    {
        $weiyunPath = $tag->getAttribute('path');
        $fPath = '';

        if (preg_match("((?'op'[^?#]+)(?'qs'\?[^#]*)?(?'hs'.*)?)", $weiyunPath, $m))
        {
            $weiyunOpenPath = $m['op'];
            $pc = new Prpcrypt;
            $array = $pc->encrypt($weiyunOpenPath, $pacsAppId, $pacsAesKey);
            if ($array[0] == ErrorCode::$OK)
            {
                $fPath = $array[1];
                $fPath = str_replace('/','_',$fPath);
                $fPath = str_replace('+','-',$fPath);
                $fPath = $fPath . '?appId=' . $pacsAppId;
            }
        }

        $tag->setAttribute('path', $fPath);
        $tag->setAttribute('url', $pacsBaseAddress . $fPath);
    }

    // added by jjwind320
    private function configureUrl(Configuring $event)
    {
        $configurator = $event->configurator;

        // 修改 url 标签增加样式
        $dom = $configurator->tags['URL']->template->asDOM();
        foreach ($dom->getElementsByTagName('a') as $a)
        {
            $a->setAttribute('class', 'jj-f-a');
        }
        $dom->saveChanges();
    }

    // added by jjwind320
    private function configureImg(Configuring $event)
    {
        $configurator = $event->configurator;

        // 修改 img 标签增加样式
        $dom = $configurator->tags['IMG']->template->asDOM();
        foreach ($dom->getElementsByTagName('img') as $img)
        {
            $img->setAttribute('class', 'jj-f-img');
        }
        $dom->saveChanges();

        
        $dom = $configurator->tags['UPL-IMAGE-PREVIEW']->template->asDOM();
        foreach ($dom->getElementsByTagName('img') as $img)
        {
            $img->setAttribute('class', 'jj-f-img');
        }
        $dom->saveChanges();
    }
}
