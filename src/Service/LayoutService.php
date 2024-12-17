<?php

namespace App\Service;

use Pimcore\Model\Document;
use Pimcore\Model\Asset;

use App\Service\DocumentService;
use App\Service\ListingService;
use App\Service\AssetService;
use Pimcore\Model\WebsiteSetting\Listing as WebsiteSettingsListing;

use App\Utility\WebsiteSettingUtility;

/**
 * LayoutService
 *
 * Handles the layout specific functions
 * Provides actions to manage and prepare data and params for frontend views
 */
class LayoutService
{
		private DocumentService $documentService;
    private ListingService $listingService;
    private AssetService $assetService;
    private WebsiteSettingsListing $websiteSettingsListing;

    private $pageRootId = ROOT_ID;

		/**
		 * Class constructor for LayoutService class
		 * 
		 * @param DocumentService $documentService,
		 * @param ListingService $listingService,
		 * @param AssetService $assetService,
		 */
    public function __construct(
				DocumentService $documentService,
				ListingService $listingService,
				AssetService $assetService,
    ) {
				$this->documentService = $documentService;
				$this->listingService = $listingService;
				$this->assetService = $assetService;
				$this->websiteSettingsListing = new WebsiteSettingsListing();
    }

		/**
		 * Get common rendering parameters for default layout
		 * 
		 * @return array
		 */
    public function getRenderParams() :array
		{
			$mainNavRoot = Document::getById((int)($this->documentService->getPropFromDoc($this->pageRootId, 'mainNavId')));
			$socialRoot = Document::getById((int)($this->documentService->getPropFromDoc($this->pageRootId, 'socialNavId')));

			$renderParams['logo'] = Asset::getById((int)($this->documentService->getPropFromDoc($this->pageRootId, 'logoId')));
			$renderParams['logoDark'] = Asset::getById((int)($this->documentService->getPropFromDoc($this->pageRootId, 'logoDarkId')));
			$renderParams['socialNavItems'] = $this->documentService->getChildrenListingByPid($socialRoot);
			$renderParams['mainNavItems'] = $this->documentService->getChildrenListingByPid($mainNavRoot);
			$renderParams['mainNavItemsFiltered'] = $this->listingService->filterListingWithProp($renderParams['mainNavItems'], 'main_nav_hide', 0);
			$renderParams['sliderItems'] = $this->assetService->getAssetListingByPid($this->documentService->getPropFromDoc($this->pageRootId, 'sliderAssetsRoot'));

			$renderParams['systemSettings'] = WebsiteSettingUtility::convArrToAsso($this->websiteSettingsListing->getSettings());

			return $renderParams;
		}	
}
