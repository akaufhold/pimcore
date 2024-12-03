<?php

namespace App\Service;
use Pimcore\Model\DataObject\PersonsHousehold;

class WasteCalculatorService
{
    
    /**
     * Get all contents/data for waste calculator 
     * @param Request $request
     * 
     * @return array
     */
    public function getAllData($request) :array
    {
        $allHouseholds = $this->getAllHousehold();
        $householdSelected = $this->getCurHousehold($request, $allHouseholds);
        return [$allHouseholds, $this->wasteCalculatorService->calculateWasteData($householdSelected), $personId ?? $householdSelected.id];
    }

    /**
     * Get data for currently selected households (form)
     * @param Request $request
     * @param array $allHouseholds
     * 
     * @return array
     */
    public function getCurHousehold($request, $allHouseholds) :array{
        $householdSelected = array_reduce($allHouseholds, function($carry, $item) {
            return $carry === null || $item->get('personsHousehold') < $carry->get('personsHousehold') ? $item : $carry;
        }, null);
        
        if ($request->isMethod('POST') && $request->request->has('persons')) {
            dump($request->get('persons'));
            $personId = $request->get('persons');
            $householdSelected = $this->personsHouseholdRepository->findById($personId);
        }

        if (!$householdSelected) {
            throw new \InvalidArgumentException('Kein passender Haushalt gefunden.');
        }

        return $householdSelected;
    }

    /**
     * Get all household data from repo
     * 
     * @return array
     */
    public function getAllHousehold() :array{
        $this->personsHouseholdRepository = new PersonsHouseholdRepository();
        $allHouseholds = $this->personsHouseholdRepository->findAll();
        usort($allHouseholds, function ($a, $b) {
            return (int) $a->getKey() - (int) $b->getKey();
        });
        return $allHouseholds;
    }

    /**
     * Collect and calculate results for certain household
     * @param Request $request
     * 
     * @return array
     */
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

    /**
     * Calculate Fee with volume and pickups
     * @param float $volume
     * @param int $pickups
     * 
     * @return float
     */
    private function calculateFee(float $volume, int $pickups): float
    {
        return $volume * $pickups * 0.13;
    }
}
