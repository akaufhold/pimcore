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
use App\Service\ListingService;
use App\Service\WasteCalculatorService;

class ContentController extends FrontendController
{

    private ContentService $contentService;
    private AssetService $assetService;
    private ListingService $listingService;
    private WasteCalculatorService $wasteCalculatorService;

    private $pageRootId = ROOT_ID;

    public function __construct(
        ContentService $contentService, 
        AssetService $assetService, 
        ListingService $listingService,
        WasteCalculatorService $wasteCalculatorService
    )
    {
        $this->contentService = $contentService;
        $this->assetService = $assetService;
        $this->listingService = $listingService;
        $this->wasteCalculatorService = $wasteCalculatorService;
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
        $renderParams = $this->getRenderParams();

        return $this->render($templateFile, $renderParams);
    }

    /**
     * Action for waste template
     * @param Request $request
     * 
     * @return Response
     */
    public function wasteAction(Request $request): Response
    {
        $document = $this->document;
        $templateFile = $document->getTemplate() ?? 'content/waste.html.twig';
        $renderParams = $this->getRenderParams();
        $renderParams['wasteCalculatorContent'] = $this->wasteCalculatorService->getWasteCalculatorRenderParams($document, $request);
        dump($renderParams);
        die();
        return $this->render($templateFile, $renderParams);
    }
}
