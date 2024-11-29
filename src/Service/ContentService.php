<?php

namespace App\Service;

use App\Repository\PersonsHouseholdRepository;
use App\Service\WasteCalculatorService;
use Pimcore\Model\Document;

class ContentService
{
    private WasteCalculatorService $wasteCalculatorService;

    public function __construct(
        WasteCalculatorService $wasteCalculatorService,
    ) {
        $this->wasteCalculatorService = $wasteCalculatorService;
    }

    public function getAdditionalContent(Document $document, $request): ?array
    {
        $calculatorType = $document->getProperty('calculatorType');
        if (!$calculatorType) {
            return null;
        }

        if ($calculatorType === 'waste') {
            $this->personsHouseholdRepository = new PersonsHouseholdRepository();
            $allHouseholds = $this->personsHouseholdRepository->findAll();
            $householdSelected = array_reduce($allHouseholds, function($carry, $item) {
                return $carry === null || $item->get('personsHousehold') < $carry->get('personsHousehold') ? $item : $carry;
            }, null); 

            if ($request->isMethod('POST') && $request->request->has('persons')) {
                $request->get('persons');
                $householdSelected = $this->personsHouseholdRepository->findById($personId);
            }

            if (!$householdSelected) {
                throw new \InvalidArgumentException('Kein passender Haushalt gefunden.');
            }

            return [$allHouseholds, $this->wasteCalculatorService->calculateWasteData($householdSelected)];
        }

        return null;
    }
}
