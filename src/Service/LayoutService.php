<?php

namespace App\Service;

use Pimcore\Model\Document;
use App\Service\DocumentService;

class layoutService
{
		private DocumentService $documentService;

    public function __construct(
				DocumentService $documentService,
    ) {
				$this->documentService = $documentService;
    }

		/**
		 * Get common rendering parameters for layout
		 */
    public function getRenderParams() {
			$renderParams['logo'] = Asset::getById((int)($this->documentService->getPropFromDoc($this->pageRootId, 'logoId')));
			$renderParams['socialRoot'] = Document::getById((int)($this->documentService->getPropFromDoc($this->pageRootId, 'socialNavId')));
			$renderParams['socialChildren'] = $this->getChildrenListingByPid($socialRoot);
			$renderParams['mainNavRoot'] = Document::getById((int)($this->documentService->getPropFromDoc($this->pageRootId, 'mainNavId')));
			$renderParams['mainNavChildren'] = $this->getChildrenListingByPid($mainNavRoot);
			$renderParams['mainNavChildrenFiltered'] = $this->listingService->filterListingWithBool($mainNavChildren, 'main_nav_hide', 0);
			$renderParams['sliderItems'] = $this->assetService->getAssetListingByPid($this->documentService->getPropFromDoc($this->pageRootId, 'sliderAssetsRoot'));

			return $renderParams;
		}	
}
