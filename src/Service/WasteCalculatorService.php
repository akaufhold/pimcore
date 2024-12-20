<?php

namespace App\Service;
use Pimcore\Model\DataObject\PersonsHousehold;
use Pimcore\Model\DataObject\Fees;
use Pimcore\Model\Document;

use App\Repository\PersonsHouseholdRepository;


class WasteCalculatorService
{
    private $defaultFeeId = 5;
    private $feePerLitre;
    /**
     * Get all contents/data for waste calculator 
     * @param Request $request
     * 
     * @return array
     */
    public function getAllData($request) :array
    {   
        $householdId = 0;
        $this->setDefaultFee();
        if ($request->isMethod('POST') && $request->request->has('household')) {
            $householdId = (integer) $request->get('household');
        }

        $allHouseholds = $this->getAllHousehold();
        $householdSelected = $this->getCurHousehold($request, $allHouseholds, $householdId);
        $curHouseholdId = $householdId ?? $householdSelected.id;
        $curHouseholdAmount = $householdSelected->get('personsHousehold');

        return [
            $allHouseholds, 
            $this->calculateWasteData($householdSelected), 
            $curHouseholdId, 
            $curHouseholdAmount
        ];
    }

    /**
     * Set default fee
     * 
     */
    public function setDefaultFee() {
        $fees = new Fees;
        if ($fees instanceof Fees) {
            $this->feePerLitre = $fees::getById($this->defaultFeeId)->getPrice();
        } else {
            throw new \Exception('Fees object not found at the given path');
        }
    }

    /**
     * Get data for currently selected households (form)
     * @param Request $request
     * @param array $allHouseholds
     * 
     * @return PersonsHousehold
     */
    public function getCurHousehold($request, $allHouseholds, $personId) :PersonsHousehold 
    {
        if ($personId) {
            $householdSelected = $this->personsHouseholdRepository->findById($personId);
        } else {
            $householdSelected = array_reduce($allHouseholds, function($carry, $item) {
                return $carry === null || $item->get('personsHousehold') < $carry->get('personsHousehold') ? $item : $carry;
            }, null);
        }
        return $householdSelected;
    }

    /**
     * Get all household data from repo
     * 
     * @return array
     */
    public function getAllHousehold() :array
    {
        $this->personsHouseholdRepository = new PersonsHouseholdRepository();
        $allHouseholds = $this->personsHouseholdRepository->findAll();
        usort($allHouseholds, function ($a, $b) {
            return (int) $a->getKey() - (int) $b->getKey();
        });
        return $allHouseholds;
    }

    /**
     * Get content parameters for waste calculator template
     * @param Document $document
     * @param Request $request
     * 
     * @return array
     */

     public function getWasteCalculatorRenderParams(Document $document, $request): ?array
     {
         $calculatorType = $document->getProperty('calculatorType');
         if (!$calculatorType) {
             return null;
         }
 
         if ($calculatorType === 'waste') {
             [$allData, $curData, $curPersonId, $curPersonAmount] = $this->getAllData($request);
 
             return [
                 'allData' => $allData,
                 'curData' => $curData,
                 'curPersonId' => $curPersonId,
                 'curPersonAmount' => $curPersonAmount,
             ];
         }
 
         return null;
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
                'fee' => $this->calculateFee($container->getVolume(), $minPickupEntry->getMinimumContainerPickup()),
                'minimumFee' => [$this->feePerLitre * $container->getVolume()]
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
        return $volume * $pickups * $this->feePerLitre;
    }
}
