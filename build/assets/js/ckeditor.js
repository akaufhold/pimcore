/* global CKEDITOR */
CKEDITOR.editorConfig = function (config) {
  config.toolbar = [
    {name: 'basicstyles', items: ['Bold', 'Italic', 'Underline', 'Strike', 'RemoveFormat']},
    {name: 'paragraph', items: ['NumberedList', 'BulletedList', '-', 'Outdent', 'Indent']},
    {name: 'insert', items: ['Image', 'Table', 'HorizontalRule', 'SpecialChar']},
    {name: 'tools', items: ['Maximize', 'Source']}
  ]
  config.height = 300
  config.language = 'de'
}
