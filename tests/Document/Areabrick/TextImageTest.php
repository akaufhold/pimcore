<?php

namespace App\Tests\Document\Areabrick;

use App\Document\Areabrick\TextImage;
use App\Service\EditableService;
use PHPUnit\Framework\TestCase;
use Pimcore\Extension\Document\Areabrick\EditableDialogBoxConfiguration;
use Pimcore\Model\Document\Editable\Area\Info;
use Pimcore\Model\Document\Editable;

use Psr\Log\LoggerInterface;

/**
 * test class for src/Service/EditableService.php
 */
class TextImageTest extends TestCase
{
    public function testGetEditableDialogBoxConfiguration()
    {
        $editableServiceMock = $this->createMock(EditableService::class);
        $loggerInterfaceMock = $this->createMock(LoggerInterface::class);

        $mockConfiguration = new EditableDialogBoxConfiguration();
        $mockConfiguration->setWidth(600);
        $mockConfiguration->setReloadOnClose(true);

        $editableServiceMock->method('getEditableDialogBoxConfiguration')->willReturn($mockConfiguration);
        $textImage = new TextImage($editableServiceMock, $loggerInterfaceMock);

        $editableMock = $this->createMock(Editable::class);
        $infoMock = $this->createMock(Info::class);

        $result = $textImage->getEditableDialogBoxConfiguration($editableMock, $infoMock);

        $this->assertInstanceOf(EditableDialogBoxConfiguration::class, $result);
        $this->assertEquals(600, $result->getWidth());
        $this->assertTrue($result->getReloadOnClose());
    }
}
