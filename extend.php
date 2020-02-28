<?php

/*
 * This file is part of jjwind320/flarum-ext-formatting.
 *
 * Copyright (c) 2020 yinshaobin.
 *
 * For the full copyright and license information, please view the LICENSE.md
 * file that was distributed with this source code.
 */

namespace JJwind320\FlarumExtFormatting;

use Flarum\Extend;
use Flarum\Frontend\Document;
use Illuminate\Events\Dispatcher;
use JJwind320\FlarumExtFormatting\FormatterConfigurator;

return [
    (new Extend\Frontend('admin'))
        ->js(__DIR__.'/js/dist/admin.js'),
    (new Extend\Frontend('forum'))
        ->js(__DIR__.'/js/dist/forum.js')
        ->css(__DIR__.'/resources/less/forum.less')
        ->css(__DIR__.'/resources/less/lightbox2.less')
        ->content(function (Document $document) {
            $document->head[] = '<script src="//res.wx.qq.com/open/js/jweixin-1.6.0.js" type="text/javascript" async=""></script>';
            $document->head[] = <<<scp
            <script>
            if(["/","/all"].includes(location.pathname) && location.search){
                location.href = location.origin+"/";
            }
            </script>
            scp;
        }),
    new Extend\Locales(__DIR__ . '/resources/locale'),
    function (Dispatcher $dispatcher) {
        $dispatcher->subscribe(FormatterConfigurator::class);
    }
];
