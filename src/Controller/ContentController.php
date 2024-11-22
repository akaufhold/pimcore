<?php

namespace App\Controller;

use Pimcore\Bundle\AdminBundle\Controller\Admin\LoginController;
use Pimcore\Controller\FrontendController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Utility\DebugUtility;

class ContentController extends FrontendController
{
    public function templateAction(Request $request): Response
    {
				//DebugUtility::debug($request->query->all());
        return $this->render('content/home.html.twig');
    }
}
