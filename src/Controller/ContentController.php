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
use Pimcore\Model\Asset\Listing as AssetListing;
use Pimcore\Model\Asset\Image;

use App\Service\ContentService;

class ContentController extends FrontendController
{

    private ContentService $contentService;

    public function __construct(ContentService $contentService)
    {
        $this->contentService = $contentService;
    }

    /**
     * Action for content template
     * Request $request
     * 
     * @return Response
     */
    public function templateAction(Request $request): Response
    {
        $document = $this->document;
        $templateFile = $document->getTemplate() ?? 'content/home.html.twig';

        $logo = $this->getAssetImageById(13);
		$socialRoot = $this->getDocumentById(3);
        $socialChildren = $this->getChildrenListingByPid($socialRoot);
		$mainNavRoot = $this->getDocumentById(2);
        $mainNavChildren = $this->getChildrenListingByPid($mainNavRoot);
        $mainNavChildrenFiltered = $this->filterListingWithBool($mainNavChildren, 'main_nav_hide', 0);

        $carouselItems = $this->getAssetListingByPid(2);

        $renderParams = [
            'logo' => $logo,
            'socialRoot' => $socialRoot,
            'socialChildren' => $socialChildren,
            'carouselItems' => $carouselItems,
            'mainNavRoot' => $mainNavRoot,
            'mainNavChildren' => $mainNavChildrenFiltered,
        ];
        $additionalContent = $this->contentService->getAdditionalContent($document);

        if ($additionalContent) {
            $renderParams['additionalContent'] = $additionalContent;
        }

        return $this->render($templateFile, $renderParams);
    }

    /**
     * Get Navigation Node
     * int $pageId
     * 
     * @return Page
     */
    public function getDocumentById(int $pageId): Page 
    {
        return Document::getById($pageId);
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

    /**
     * Filter Navigation Elements with property
     * Listing $listing
     * String $propertyToFilter
     * Boolean $filterValue
     * 
     * @return Listing
     */
    public function filterListingWithBool(Listing $listing, string $propertyToFilter, bool $filterValue): Listing 
    {
        $filteredListing = new Listing();
        $filteredListing->setCondition('id IN (?)', [
            array_map(fn($doc) => $doc->getId(), 
                array_filter($listing->getDocuments(), fn($doc) => (bool) $doc->getProperty($propertyToFilter, false) === $filterValue)
            )
        ]);
        return $filteredListing;
    }

    /**
     * Get Asset Image from Id
     * 
     * @param int $id
     * @return Image
     */
    private function getAssetImageById(int $id): Image 
    {
        return Asset::getById($id);
    }

    /**
     * Get Asset Items from Pid
     * 
     * @param int $pageId
     * @return array
     */
    private function getAssetListingByPid(int $pageId): array 
    {
        $list = new AssetListing();
        $list->setCondition('parentId = ?', [$pageId]);
        $assetList = $list->load();
        return $assetList;
    }
}
