<?php

namespace App\Utility;

class DebugUtility
{
    public static function debug($data): string
    {
				echo "<pre>";
				var_dump($data);
				echo "</pre>";
    }
}
