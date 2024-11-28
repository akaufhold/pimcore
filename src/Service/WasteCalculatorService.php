<?php

namespace App\Service;
 
class WasteCalculatorService
{
    public function calculateWasteData(PersonsHousehold $household): array
    {
        $data = [];
        foreach ($household->getMinimumContainerPickup() as $pickup) {
            $container = $pickup->getContainerSize();
            $minimumVolume = $pickup->getMinimumPickups() * $container->getVolumen();
            $data[] = [
                'containerSize' => $container->getVolumen(),
                'minimumVolume' => $minimumVolume,
                'pickups' => $pickup->getMinimumPickups(),
                'fee' => $this->calculateFee($container->getVolumen(), $pickup->getMinimumPickups())
            ];
        }
        return $data;
    }

    private function calculateFee(float $volume, int $pickups): float
    {
        return $volume * $pickups * 0.13; // Beispielgebühr je Liter
    }
}
