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

    /**
     * Action for content template
     * @param Document $document
     * @param Request $request
     * 
     * @return array
     */

    public function getAdditionalContent(Document $document, $request): ?array
    {
        $calculatorType = $document->getProperty('calculatorType');
        if (!$calculatorType) {
            return null;
        }

        if ($calculatorType === 'waste') {
            return $this->wasteCalculatorService->getAllData($request);
        }

        return null;
    }
}
