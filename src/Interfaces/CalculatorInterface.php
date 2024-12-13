<?php

namespace App\Interfaces;

/**
 * Interface for calculators
 */
interface CalculatorInterface
{
    public function calculate(): array;
    public function renderTemplate(array $data): string;
}