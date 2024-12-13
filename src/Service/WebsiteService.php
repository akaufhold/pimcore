<?php

namespace App\Service;

use Pimcore\Config;

class WebsiteService
{
    public function getSystemSettings(): array
    {
        return [
						'contactEmail' => Config::get('email'),
            'footerText' => Config::get('address'),
        ];
    }
}
