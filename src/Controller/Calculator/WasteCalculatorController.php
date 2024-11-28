<?php

namespace App\Controller\Calculator;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use App\Interface\CalculatorInterface;
use App\Service\WasteCalculatorService;

class WasteCalculatorController extends AbstractController implements CalculatorInterface
{
    public function calculate(): array
    {
				$wasteCalculatorService = new WasteCalculatorService;
				$calculatedData = $wasteCalculatorService->calculateWasteData();
        return [
            'calculatedData' => $calculatedData
        ];
    }

    public function renderTemplate(array $data): string
    {
        return $this->renderView('calculator/waste.html.twig', $data);
    }
}
