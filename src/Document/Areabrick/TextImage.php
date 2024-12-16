<?php

namespace App\Document\Areabrick;

use Pimcore\Extension\Document\Areabrick\AbstractAreabrick;
use Pimcore\Extension\Document\Areabrick\AbstractTemplateAreabrick;
use Pimcore\Extension\Document\Areabrick\AreabrickInterface;
use Pimcore\Extension\Document\Areabrick\Attribute\AsAreabrick;
use Psr\Log\LoggerInterface;

#[AsAreabrick(id: 'textimage')]
class TextImage extends AbstractTemplateAreabrick
{
    public function getName(): string
    {
        return 'textimage';
    }

    public function getDescription(): string
    {
        return 'Create content element for text with images';
    }
    
    public function getTemplate(): string
    {
        return 'areas/default/textimage.html.twig';
    }
}