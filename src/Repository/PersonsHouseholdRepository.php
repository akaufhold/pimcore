<?php

namespace App\Repository;

use Pimcore\Model\DataObject\PersonsHousehold;

/**
 * Reposititory for person households 
 */
class PersonsHouseholdRepository
{
    public function __constructor () {

    }
    /**
     * Find all published db entries in order
     * 
     * @return array
     */
    public function findAll(): array
    {
        $listing = new PersonsHousehold\Listing();
        $listing->setOrderKey("key");
        $listing->setOrder("ASC");
        $listing->setUnpublished(false);
        return $listing->load();
    }

    /**
     * Find single db entry by id
     * 
     * @param int $id
     * 
     * @return PersonsHousehold
     */
    public function findById(int $id): ?PersonsHousehold
    {
        return PersonsHousehold::getById($id);
    }
}
