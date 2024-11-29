<?php

namespace App\Interfaces;

interface CalculatorInterface
{
    public function calculate(): array;
    public function renderTemplate(array $data): string;
}