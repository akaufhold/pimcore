<?php

namespace App\Document\Areabrick;

use Pimcore\Extension\Document\Areabrick;
use Pimcore\Extension\Document\Areabrick\AbstractAreabrick;
use Pimcore\Extension\Document\Areabrick\AbstractTemplateAreabrick;
use Pimcore\Extension\Document\Areabrick\AreabrickInterface;
use Pimcore\Extension\Document\Areabrick\Attribute\AsAreabrick;
use Psr\Log\LoggerInterface;

use Pimcore\Model\Document\Editable\Area\Info;
use Pimcore\Model\Property\Predefined;

#[AsAreabrick(id: 'image')]

/**
 * Class for new area brick image
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
class Image extends AbstractTemplateAreabrick
{
    public $identifier = 'image';

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
     * Returns template for areabrick
     * 
     * @return string
     */
    public function getTemplate(): string
    {
        return 'areas/default/'.$this->identifier.'.html.twig';
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

    /**
     * Adding properties for area brick customization
     * 
     * @param Info $info
     * @param array $params
     * 
     * @return array
     */
    public function configureProperties(Info $info, array $params = []): array
    {
 
    }
}