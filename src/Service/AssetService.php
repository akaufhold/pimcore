<?php

namespace App\Service;

use App\Repository\PersonsHouseholdRepository;
use App\Service\WasteCalculatorService;
use Pimcore\Model\Document;
use Pimcore\Model\Asset\Listing as AssetListing;

/**
 * AssetService
 *
 * Handles the asset specific functions
 * Provides actions to manage and prepare data for frontend views.
 */
class AssetService
{
    /**
     * Get Asset Items from Pid
     * 
     * @param int $pageId
     * @return array
     */
    public function getAssetListingByPid(int $pageId): array 
    {
        $list = new AssetListing();
        $list->setCondition('parentId = ?', [$pageId]);
        $assetList = $list->load();
        return $assetList;
    }
}