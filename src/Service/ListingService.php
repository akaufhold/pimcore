<?php

namespace App\Service;

use App\Repository\PersonsHouseholdRepository;
use App\Service\WasteCalculatorService;
use Pimcore\Model\Document;
use Pimcore\Model\Document\Listing;

class ListingService
{

    /**
     * Filter Navigation Elements with property
     * @param Listing $listing
     * @param String $propertyToFilter
     * @param Boolean $filterValue
     * 
     * @return Listing
     */
    public function filterListingWithProp(Listing $listing, string $propertyToFilter, bool $filterValue): Listing 
    {
        $filteredListing = new Listing();
        $filteredListing->setCondition('id IN (?)', [
            array_map(fn($doc) => $doc->getId(), 
                array_filter($listing->getDocuments(), fn($doc) => (bool) $doc->getProperty($propertyToFilter, false) === $filterValue)
            )
        ]);
        return $filteredListing;
    }
}