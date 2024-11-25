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
        $socialChildren = $this->getChildrensById($socialRoot);
        return $this->render('content/home.html.twig', [
            'socialRoot' => $socialRoot,
            'socialChildren' => $socialChildren,
        ]);
    }

    /**
     * Get Navigation Node
     * int $pageId
     * 
     * @return Page;
     */
    public function getDocumentById(int $pageId): Page 
    {
        return Document::getById($pageId);
    }

    /**
     * Get Navigation Root Childrens
     * Page $page
     * 
     * @return Listing;
     */
    public function getChildrensById(Page $page): Listing 
    {
        return $socialPages = $page ? $page->getChildren() : [];
    }
}
