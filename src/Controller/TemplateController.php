<?php

namespace App\Controller;

use Pimcore\Bundle\AdminBundle\Controller\Admin\LoginController;
use Pimcore\Controller\FrontendController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Utility\DebugUtility;
use Pimcore\Model\Document;
use Pimcore\Model\WebsiteSetting\Listing as WebsiteSettingsListing;

use App\Service\ListingService;
use App\Service\LayoutService;
use App\Service\WasteCalculatorService;
use App\Service\WebsiteService;

use App\Utility\WebsiteSettingUtility;

/**
 * TemplateController
 *
 * Handles the rendering of content templates
 * Provides actions to manage and prepare data for frontend views.
 */
class TemplateController extends FrontendController
{
    private $pageRootId = ROOT_ID;

    private ListingService $listingService;
    private WasteCalculatorService $wasteCalculatorService;
    private LayoutService $layoutService;
    private WebsiteSettingsListing $websiteSettingsListing;

    public function __construct(
        LayoutService $layoutService,
        ListingService $listingService,
        WasteCalculatorService $wasteCalculatorService
    )
    {
        $this->layoutService = $layoutService;
        $this->listingService = $listingService;
        $this->wasteCalculatorService = $wasteCalculatorService;
        $this->websiteSettingsListing = new WebsiteSettingsListing();
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
        $templateFile = $document->getTemplate() ?? 'pages/home.html.twig';

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
        $templateFile = $document->getTemplate() ?? 'pages/calculator/waste.html.twig';

        $renderParams = $this->layoutService->getRenderParams();

        $renderParams['wasteCalculatorContent'] = $this->wasteCalculatorService->getWasteCalculatorRenderParams($document, $request);

        return $this->render($templateFile, $renderParams);
    }
}
