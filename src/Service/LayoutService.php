<?php

namespace App\Service;

use Pimcore\Model\Document;
use Pimcore\Model\Asset;

use App\Service\DocumentService;
use App\Service\ListingService;

class LayoutService
{
		private DocumentService $documentService;
    private ListingService $listingService;

    private $pageRootId = ROOT_ID;

    public function __construct(
				DocumentService $documentService,
				ListingService $listingService,
    ) {
				$this->documentService = $documentService;
				$this->listingService = $listingService;
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
			$renderParams['socialNavItems'] = $this->documentService->getChildrenListingByPid($socialRoot);
			$renderParams['mainNavItems'] = $this->documentService->getChildrenListingByPid($mainNavRoot);
			$renderParams['mainNavItemsFiltered'] = $this->listingService->filterListingWithBool($mainNavChildren, 'main_nav_hide', 0);
			$renderParams['sliderItems'] = $this->assetService->getAssetListingByPid($this->documentService->getPropFromDoc($this->pageRootId, 'sliderAssetsRoot'));

			return $renderParams;
		}	
}
