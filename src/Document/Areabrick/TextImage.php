<?php

namespace App\Document\Areabrick;

use Symfony\Component\HttpFoundation\Response;

use Pimcore\Model\Document;
use Pimcore\Model\Document\Editable;
use Pimcore\Model\Document\Editable\Area\Info;
use Pimcore\Model\Property\Predefined;
use Pimcore\Extension\Document\Areabrick\EditableDialogBoxConfiguration;
use Pimcore\Extension\Document\Areabrick\EditableDialogBoxInterface;

use Pimcore\Extension\Document\Areabrick;
use Pimcore\Extension\Document\Areabrick\AbstractAreabrick;
use Pimcore\Extension\Document\Areabrick\AbstractTemplateAreabrick;
use Pimcore\Extension\Document\Areabrick\AreabrickInterface;
use Pimcore\Extension\Document\Areabrick\Attribute\AsAreabrick;
use Psr\Log\LoggerInterface;

use App\Service\EditableService;

#[AsAreabrick(id: 'textimage')]

/**
 * Class for new area brick textimage
 *
 * This class inherits methods from AbstractTemplateAreabrick 
 * 
 * @method getTemplate(): ?string
 * @method getTemplateLocation(): string
 * @method getTemplateSuffix(): string
 * 
 * and AbstractAreabrick
 *
 * @method setEditableRenderer(EditableRenderer $editableRenderer) Sets the editable renderer for the Areabrick
 * @method getId() Returns the ID of the Areabrick
 * @method getName() Returns the name of the Areabrick
 * @method getDescription() Returns the description of the Areabrick
 * @method getVersion() Returns the version of the Areabrick
 * @method getIcon() Returns the icon for the Areabrick
 * @method hasTemplate() Checks if the Areabrick has a template
 * @method action(Info $info) Executes an action for the Areabrick
 * @method postRenderAction(Info $info) Executes a post-render action for the Areabrick
 * @method getHtmlTagOpen(Info $info) Returns the opening HTML tag for the Areabrick
 * @method getHtmlTagClose(Info $info) Returns the closing HTML tag for the Areabrick
 */
class TextImage extends AbstractTemplateAreabrick implements EditableDialogBoxInterface
{
    public $identifier = 'textimage';
    public $category = 'default';

    private EditableService $editableService;
    private LoggerInterface $logger;

    public function __construct(
        EditableService $editableService,
        LoggerInterface $logger
    )
    {
        $this->editableService = $editableService;
        $this->logger = $logger;
    }

    public function action(Info $info): ?Response
    {
        $document = $info->getDocument();
        $positionEditable = $this->getDocumentEditable(
            $document,
            'select',
            'position'
        );
        $position = $positionEditable->getData() ?? 'default';
        $info->setParam('position', $position);

        return null;
    }

    /**
     * Returns name for area brick
     * 
     * @return string
     */
    public function getName(): string
    {
        return $this->identifier;
    }

    /**
     * Returns description for backend info text
     * 
     * @return string
     */
    public function getDescription(): string
    {
        return 'Create content element for '. $this->identifier;
    }

    /**
     * Returns template for area brick
     * 
     * @return string
     */
    public function getTemplate(): string
    {
        return AREA_BRICKS_TEMPLATE_PATH . $this->category .'/'. $this->identifier.'.html.twig';
    }

    /**
     * Set additional css classes for default wrapper (or content layout)
     * 
     * @return string
     */
    protected function getOpenTagCssClass(Info $info): string
    {
        return null;
    }

    /**
     * Overwrite html opening tag
     * 
     * @return string
     */
    public function getHtmlTagOpen(Info $info): string
    {
        return '';
    }

    /**
     * Overwrite html closing tag
     * 
     * @return string
     */
    public function getHtmlTagClose(Info $info): string
    {
        return '';
    }

    public function getEditableDialogBoxConfiguration(
        Editable $area, 
        ?Info $info
    ): EditableDialogBoxConfiguration
    {   
        $config = $this->editableService->getEditableDialogBoxConfiguration($area, 'EditableDialogBox', $this->category, $this->identifier, $info);
        return $config;
    }
}