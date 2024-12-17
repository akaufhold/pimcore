<?php

namespace App\Document\Areabrick;

use Pimcore\Extension\Document\Areabrick\AbstractAreabrick;
use Pimcore\Extension\Document\Areabrick\AbstractTemplateAreabrick;
use Pimcore\Extension\Document\Areabrick\AreabrickInterface;
use Pimcore\Extension\Document\Areabrick\Attribute\AsAreabrick;
use Psr\Log\LoggerInterface;

#[AsAreabrick(id: 'image')]
class Image extends AbstractTemplateAreabrick
{
    public function getName(): string
    {
        return 'image';
    }

    public function getDescription(): string
    {
        return 'Create content element for images';
    }
}