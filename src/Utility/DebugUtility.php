<?php

namespace App\Utility;

/** 
 * Class for debugging 
 */
class DebugUtility
{
    public static function debug($data): string
    {
				echo "<pre>";
				var_dump($data);
				echo "</pre>";
    }
}
