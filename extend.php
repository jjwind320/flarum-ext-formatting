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

return [
    (new Extend\Formatter())
        ->configure(function (Configurator $configurator) {
            $configurator->BBCodes->addFromRepository('URL');

            // Get the default URL template as a DOMDocument
            $dom = $configurator->tags['URL']->template->asDOM();

            // Set a target="_blank" attribute to any <a> element
            foreach ($dom->getElementsByTagName('a') as $a)
            {
                $a->setAttribute('target', '_blank');
            }

            // Save the changes
            $dom->saveChanges();

            
        })
];
