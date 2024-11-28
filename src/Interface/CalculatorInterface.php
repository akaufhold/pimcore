<?php

namespace App\Interface;

interface CalculatorInterface
{
    public function calculate(): array;
    public function renderTemplate(array $data): string;
}