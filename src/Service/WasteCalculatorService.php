<?php

namespace App\Service;
use Pimcore\Model\DataObject\PersonsHousehold;

class WasteCalculatorService
{
    public function calculateWasteData(PersonsHousehold $household): array
    {
        $data = [];

        foreach ($household->getMinimumContainerPickup() as $minPickupEntry) {     
            $container = $minPickupEntry->getContainerSize()[0];

            $minimumVolume = $minPickupEntry->getMinimumContainerPickup() * $container->getVolume();
            $data[] = [
                'containerSize' => $container->getVolume(),
                'minimumVolume' => $minimumVolume,
                'pickups' => $minPickupEntry->getMinimumContainerPickup(),
                'fee' => $this->calculateFee($container->getVolume(), $minPickupEntry->getMinimumContainerPickup())
            ];
        }

        return $data;
    }

    private function calculateFee(float $volume, int $pickups): float
    {
        return $volume * $pickups * 0.13;
    }
}
