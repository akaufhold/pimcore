<?php

namespace App\Service;

use Pimcore\Model\Document;

use Psr\Log\LoggerInterface;

/**
 * class for yaml specific functions
 */
class YamlService
{
	private LoggerInterface $logger;

	public function __construct(
		LoggerInterface $logger
	)
	{
			$this->logger = $logger;
	}

	/**
	 * Returns path suffix for type of yaml configuration
	 * 
	 * @return string
	 */
	public function getPathPrefixForType($type): string 
	{
		switch ($type) {
			case 'EditableDialogBox': 
				return EDITBOX_YAML_PATH;
		}
		
	}	

	/**
	 * returns path from yaml config for area bricks
	 * 
	 * @param string $type
	 * @param string $category
	 * @param string $identifier
	 * 
	 * @return string 
	 */
	public function getYamlConfigFromFile(string $type, string $category, string $identifier): string 
	{
		$path = PIMCORE_PROJECT_ROOT . $this->getPathPrefixForType($type) . $category .'/'. $identifier. '.yaml';

		if (!file_exists($path)) {
			$this->logger->error('YAML config file not found', ['path' => $path]);
			throw new \RuntimeException('YAML config file not found: ' . $path);
		}

		return $path; 
	}
}
