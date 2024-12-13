<?php

namespace App\Controller;

use Pimcore\Bundle\AdminBundle\Controller\Admin\LoginController;
use Pimcore\Controller\FrontendController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Utility\DebugUtility;
use Pimcore\Model\Document;

use App\Service\AssetService;
use App\Service\ContentService;
use App\Service\ListingService;
use App\Service\LayoutService;
use App\Service\WasteCalculatorService;
use App\Service\WebsiteService;

/**
 * TemplateController
 *
 * Handles the rendering of content templates
 * Provides actions to manage and prepare data for frontend views.
 */
class TemplateController extends FrontendController
{
    private $pageRootId = ROOT_ID;

    private ContentService $contentService;
    private AssetService $assetService;
    private ListingService $listingService;
    private WasteCalculatorService $wasteCalculatorService;
    private LayoutService $layoutService;
    private WebsiteService $websiteService;

    public function __construct(
        AssetService $assetService, 
        ContentService $contentService, 
        LayoutService $layoutService,
        ListingService $listingService,
        WasteCalculatorService $wasteCalculatorService,
        WebsiteService $websiteService,
    )
    {
        $this->assetService = $assetService;
        $this->contentService = $contentService;
        $this->layoutService = $layoutService;
        $this->listingService = $listingService;
        $this->wasteCalculatorService = $wasteCalculatorService;
        $this->websiteService = $websiteService;
    }

    /**
     * Action for default template
     * @param Request $request
     * 
     * @return Response
     */
    public function defaultAction(Request $request): Response
    {
        $document = $this->document;
        $templateFile = $document->getTemplate() ?? 'content/home.html.twig';

        $renderParams = $this->layoutService->getRenderParams();
        $renderParams['systemSettings'] = $this->websiteService->getSystemSettings();

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

        $renderParams = $this->layoutService->getRenderParams();
        $renderParams['systemSettings'] = $this->websiteService->getSystemSettings();
        
        $renderParams['wasteCalculatorContent'] = $this->wasteCalculatorService->getWasteCalculatorRenderParams($document, $request);

        return $this->render($templateFile, $renderParams);
    }
}
