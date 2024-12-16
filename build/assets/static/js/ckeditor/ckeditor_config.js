CKEDITOR.editorConfig = function (config) {
	config.language = 'de';
	config.uiColor = '#F7F7F7';
	config.height = 300;
	config.toolbarCanCollapse = true;
	config.toolbar = [
			{ name: 'clipboard', items: ['Cut', 'Copy', 'Paste', 'Undo', 'Redo'] },
			{ name: 'styles', items: ['Format', 'Font', 'FontSize'] },
			{ name: 'basicstyles', items: ['Bold', 'Italic', 'Underline', 'Strike'] },
			{ name: 'colors', items: ['TextColor', 'BGColor'] },
			{ name: 'paragraph', items: ['NumberedList', 'BulletedList', '-', 'Outdent', 'Indent'] },
			{ name: 'links', items: ['Link', 'Unlink'] },
			{ name: 'insert', items: ['Image', 'Table'] },
			{ name: 'tools', items: ['Maximize'] },
	];
	config.extraPlugins = 'autogrow';
	config.autoGrow_minHeight = 300;
	config.autoGrow_maxHeight = 600;
};
