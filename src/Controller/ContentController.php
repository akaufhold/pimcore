<?php

namespace App\Controller;

use Pimcore\Bundle\AdminBundle\Controller\Admin\LoginController;
use Pimcore\Controller\FrontendController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Utility\DebugUtility;
use Pimcore\Model\Document;
use Pimcore\Model\Document\Page;
use Pimcore\Model\Document\Listing;
use Pimcore\Model\Asset;
use Pimcore\Model\Asset\Image;

use App\Service\AssetService;
use App\Service\ContentService;
use App\Service\DocumentService;
use App\Service\ListingService;


class ContentController extends FrontendController
{

    private ContentService $contentService;
    private AssetService $assetService;
    private ListingService $listingService;
    private DocumentService $documentService;

    private $pageRootId = ROOT_ID;

    public function __construct(
        ContentService $contentService, 
        AssetService $assetService, 
        ListingService $listingService,
        DocumentService $documentService)
    {
        $this->contentService = $contentService;
        $this->assetService = $assetService;
        $this->listingService = $listingService;
        $this->documentService = $documentService;
    }

    /**
     * Action for content template
     * @param Request $request
     * 
     * @return Response
     */
    public function templateAction(Request $request): Response
    {
        $document = $this->document;
        $templateFile = $document->getTemplate() ?? 'content/home.html.twig';

        $logo = Asset::getById((int)($this->documentService->getPropFromDoc($this->pageRootId, 'logoId')));
		$socialRoot = Document::getById((int)($this->documentService->getPropFromDoc($this->pageRootId, 'socialNavId')));
        $socialChildren = $this->getChildrenListingByPid($socialRoot);
		$mainNavRoot = Document::getById((int)($this->documentService->getPropFromDoc($this->pageRootId, 'mainNavId')));
        $mainNavChildren = $this->getChildrenListingByPid($mainNavRoot);
        $mainNavChildrenFiltered = $this->listingService->filterListingWithBool($mainNavChildren, 'main_nav_hide', 0);

        $carouselItems = $this->assetService->getAssetListingByPid(2);

        $renderParams = [
            'logo' => $logo,
            'socialRoot' => $socialRoot,
            'socialChildren' => $socialChildren,
            'carouselItems' => $carouselItems,
            'mainNavRoot' => $mainNavRoot,
            'mainNavChildren' => $mainNavChildrenFiltered,
        ];

        $renderParams['additionalContent'] = $this->contentService->getAdditionalContent($document, $request);
        return $this->render($templateFile, $renderParams);
    }

    /**
     * Get Navigation Root Childrens
     * Page $page
     * 
     * @return Listing
     */
    public function getChildrenListingByPid(Page $page): Listing 
    {
        return $socialPages = $page ? $page->getChildren() : [];
    }
}
