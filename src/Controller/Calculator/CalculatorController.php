<?php

namespace App\Controller\Calculator;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use App\Controller\Calculator\WasteCalculatorController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

class CalculatorController extends AbstractController
{
    public function index(Request $request, string $type): Response
    {
        $calculator = $this->getCalculator($type);

        $data = $calculator->calculate();
        $content = $calculator->renderTemplate($data);

        return new Response($content);
    }

    private function getCalculator(string $type): CalculatorInterface
    {
        return match ($type) {
            'waste' => new WasteCalculatorController(),
            default => throw new \InvalidArgumentException('Unknown Calculator'),
        };
    }
}
