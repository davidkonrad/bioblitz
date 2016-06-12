/*
Copyright (c) 2003-2012, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/

CKEDITOR.editorConfig = function( config ) {
	// Define changes to default configuration here. For example:
	// config.language = 'fr';
	// config.uiColor = '#AADC6E';

	config.startupFocus = false;
	config.contentsCss = 'bootstrap/css/bootstrap.css' ; 

	config.toolbar_bioblitz =
	[
	    { name: 'document',    items : [ 'Source' ] },
	    { name: 'clipboard',   items : [ 'Cut','Copy','Paste' ,'-','Undo','Redo' ] },
	    { name: 'editing',     items : [ 'Find','Replace','-','SelectAll'  ] },
	    { name: 'basicstyles', items : [ 'Bold','Italic','Underline','Strike','Subscript','Superscript','-','RemoveFormat' ] },
	    //{ name: 'paragraph',   items : [ 'NumberedList','BulletedList','-', 'JustifyLeft','JustifyCenter','JustifyRight','JustifyBlock' ] },
	    { name: 'links',       items : [ 'Link','Unlink' ]},
	    //{ name: 'styles',      items : [ 'Styles','Format','Font','FontSize' ] },
	    //{ name: 'colors',      items : [ 'TextColor','BGColor' ] },
	];

};

// 25.07.2013
CKEDITOR.plugins.load('pgrfilemanager');
