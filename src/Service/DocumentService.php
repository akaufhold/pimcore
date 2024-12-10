<?php

namespace App\Service;

use App\Repository\PersonsHouseholdRepository;
use App\Service\WasteCalculatorService;
use Pimcore\Model\Document;
use Pimcore\Model\Document\Listing;

class DocumentService
{
	/**
	 * Filter Navigation Elements with property
	 * @param integer $docId
	 * @param string $propertyName
	 * 
	 * @return string
	 */
	public function getPropFromDoc($docId, $propertyName) :string
	{
		$document = Document::getById($docId); 
		if (!$document) {
			throw new NotFoundException("Document with ID {$docId} not found.");
		}
		$propertyValue = $document->getProperty($propertyName); 
		if (!$propertyValue) {
			throw new NotFoundException("Property {$propertyName} not found.");
			return '';
		}
		return $propertyValue;
	}

}