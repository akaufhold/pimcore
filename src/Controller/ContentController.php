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
use Pimcore\Model\Asset\Listing as AssetListing;
use Pimcore\Model\Asset\Image;

class ContentController extends FrontendController
{
    /**
     * Action for content template
     * Request $request
     * 
     * @return Response
     */
    public function templateAction(Request $request): Response
    {
		$socialRoot = $this->getDocumentById(3);
        $socialChildren = $this->getChildrensByPid($socialRoot);
		$mainNavRoot = $this->getDocumentById(2);
        $mainNavChildren = $this->getChildrensByPid($mainNavRoot);

        $carouselItems = $this->getAssetListingByPid(2);

        return $this->render('content/home.html.twig', [
            'socialRoot' => $socialRoot,
            'socialChildren' => $socialChildren,
            'carouselItems' => $carouselItems,
            'mainNavRoot' => $mainNavRoot,
            'mainNavChildren' => $mainNavChildren,
        ]);
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
    public function getChildrensByPid(Page $page): Listing 
    {
        return $socialPages = $page ? $page->getChildren() : [];
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
