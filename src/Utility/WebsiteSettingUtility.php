<?php

namespace App\Utility;
use Pimcore\Model\WebsiteSetting;

/**
 * WebsiteSettingUtility
 *
 * Handles array depended static functions
 */
class WebsiteSettingUtility
{
	/**
	 * Convert standard array to associative
	 * 
	 * @param array $array
	 * 
	 * @return array
	 */
	public static function convArrToAsso($array) :array
	{	
		return array_reduce($array, [WebsiteSettingUtility::class, 'mapKeyToName'], []);
	}

	/**
	 * Map system setting key to name
	 * 
	 * @param array $carry
	 * @param array $item
	 * 
	 * @return array 
	 */
	public static function mapKeyToName($carry, $item) :array
    {
        $carry[$item->getName()] = $item;
        return $carry;
	}
}