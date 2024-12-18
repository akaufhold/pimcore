<?php

namespace App\Service;

use Symfony\Component\Yaml\Yaml;

use Pimcore\Model\Document;
use Pimcore\Model\Document\Editable;
use Pimcore\Model\Document\Editable\Area\Info;

use Pimcore\Extension\Document\Areabrick\EditableDialogBoxConfiguration;
use Pimcore\Extension\Document\Areabrick\EditableDialogBoxInterface;

use App\Service\YamlService;
use Psr\Log\LoggerInterface;

/**
 * class for editable specific functions (popups, etc)
 */
class EditableService {
		private YamlService $yamlService;
		private LoggerInterface $logger;

		public function __construct(
			YamlService $yamlService,
			LoggerInterface $logger
		)
		{
				$this->yamlService = $yamlService;
				$this->logger = $logger;
		}
		/**
		 * get config for editable popup from area bricks
		 * 
		 * @param Editable $area,
		 * @param string $type
		 * @param string $category
		 * @param string $identifier
		 * @param Info $info
		 * 
		 * @return EditableDialogBoxConfiguration
		 */
		public function getEditableDialogBoxConfiguration(
				Editable $area,
				string $type, 
				string $category, 
				string $identifier,
				?Info $info
		): EditableDialogBoxConfiguration
		{
				$yamlPath = $this->yamlService->getYamlConfigFromFile($type, $category, $identifier);

				if (!file_exists($yamlPath)) {
					$this->logger->error('YAML config file not found', ['path' => $yamlPath]);
					throw new \RuntimeException('YAML config file not found: ' . $yamlPath);
				}

				$configArray = Yaml::parseFile($yamlPath);

				$config = new EditableDialogBoxConfiguration();
				$config->setWidth(600);
				$config->setReloadOnClose(true);
				$config->setItems($configArray);

				return $config;
		}
}
