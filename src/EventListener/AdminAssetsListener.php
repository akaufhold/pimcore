<?php

namespace App\EventListener;

use Pimcore\Event\BundleManager\PathsEvent;
use Pimcore\Event\BundleManagerEvents;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;


class AdminAssetsListener implements EventSubscriberInterface
{

    public static function getSubscribedEvents(): array
    {
        return [
            BundleManagerEvents::CSS_PATHS => 'onCssPaths'
        ];
    }

    public function onCssPaths(PathsEvent $event): void
    {
        $event->addPaths([
            '/build/css/backend.css'
        ]);
    }
}