<?php

namespace App\Repository;

use Pimcore\Model\DataObject\PersonsHousehold;

class PersonsHouseholdRepository
{
    public function __constructor () {

    }

    public function findAll(): array
    {
        $listing = new PersonsHousehold\Listing();
        $listing->setOrderKey("key");
        $listing->setOrder("ASC");
        $listing->setUnpublished(false);
        return $listing->load();
    }

    public function findById(int $id): ?PersonsHousehold
    {
        return PersonsHousehold::getById($id);
    }
}
