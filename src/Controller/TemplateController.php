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

    public function __construct(
        ContentService $contentService, 
        AssetService $assetService, 
        ListingService $listingService,
        WasteCalculatorService $wasteCalculatorService,
        LayoutService $layoutService
    )
    {
        $this->contentService = $contentService;
        $this->assetService = $assetService;
        $this->listingService = $listingService;
        $this->wasteCalculatorService = $wasteCalculatorService;
        $this->layoutService = $layoutService;
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

        $renderParams['wasteCalculatorContent'] = $this->wasteCalculatorService->getWasteCalculatorRenderParams($document, $request);

        return $this->render($templateFile, $renderParams);
    }
}
