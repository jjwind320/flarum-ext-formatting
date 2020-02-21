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
use s9e\TextFormatter\Configurator;
use JJwind320\FlarumExtFormatting\FormatterConfigurator;

return [
    (new Extend\Frontend('admin'))
        ->js(__DIR__.'/js/dist/admin.js'),

    (new Extend\Formatter())
        ->configure(function (Configurator $configurator) {
            $fc = new FormatterConfigurator();
            $fc->Configure($configurator);
        })
];
