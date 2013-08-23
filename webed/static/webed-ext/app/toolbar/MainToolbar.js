Ext.define ('Webed.toolbar.MainToolbar', {
    extend: 'Ext.toolbar.Toolbar',
    alias: 'widget.main-toolbar',

    requires: [
        'Ext.button.Split',
        'Ext.container.ButtonGroup',
        'Webed.window.AddFileBox',
        'Webed.window.AddFolderBox',
        'Webed.window.AddProjectBox',
        'Webed.window.AddRestProjectBox',
        'Webed.window.AnnotateBox',
        'Webed.window.DeleteBox',
        'Webed.window.RenameBox',
        'Webed.window.UploadBox'
    ],

    items: [{

        xtype: 'buttongroup',
        title: 'Document',
        columns: 2,
        items: [{
            text : 'Save',
            iconCls : 'icon-disk-16',
            xtype :'splitbutton',
            tooltip : '<b>Save</b><div class="w-shortcut">[CTRL+S]</div><br/>Save selected file (to <i>remote</i> storage)',
            action: 'save-document',
            menu : {
                xtype: 'menu',
                plain: true,
                items: [{
                    iconCls: 'icon-save_as-16',
                    text: 'Annotate',
                    tooltip: '<b>Annotate</b><div class="w-shortcut">[CTRL+SHIFT+S]</div><br/>Save with an annotation (to <i>remote</i> storage)',
                    action: 'annotate-document'
                }]
            }
        },{
            text : 'Open',
            iconCls : 'icon-folder_page-16',
            iconAlign: 'left',
            tooltip : '<b>Open</b><div class="w-shortcut">[CTRL+O]</div><br/>Open a file (from <i>local</i> storage)',
            action: 'open-document'
        }]

    },{

        xtype: 'buttongroup',
        title: 'Manage',
        columns: 3,
        items: [{
            text : 'New',
            iconCls : 'icon-add-16',
            xtype :'splitbutton',
            tooltip : '<b>New</b><br/>Add a new project, folder or file',
            action: 'add',
            menu : {
                xtype : 'menu',
                plain : true,
                items : [{
                    iconCls : 'icon-report-16',
                    text : 'Project',
                    tooltip : '<b>New</b><div class="w-shortcut">[ALT+P]</div><br/>Add a new project',
                    action: 'add-project'
                },{
                    iconCls : 'icon-folder-16',
                    text : 'Folder',
                    tooltip : '<b>New</b><div class="w-shortcut">[ALT+F]</div><br/>Add a new folder',
                    action: 'add-folder'
                },{
                    iconCls : 'icon-page_white-16',
                    text : 'Document',
                    tooltip : '<b>New</b><div class="w-shortcut">[ALT+D]</div><br/>Add a new file',
                    action: 'add-file'
                }]
            }
        },{
            text : 'Rename',
            iconCls : 'icon-pencil-16',
            iconAlign: 'left',
            tooltip : '<b>Rename</b><div class="w-shortcut">[F2]</div><br/>Rename selected project, folder or file',
            action: 'rename'
        },{
            text : 'Delete',
            iconCls : 'icon-delete-16',
            iconAlign: 'left',
            tooltip : '<b>Delete</b><div class="w-shortcut">[CTRL+DEL]</div><br/>Delete selected project, folder or file',
            action: 'delete'
        }]

    },{

        xtype: 'buttongroup',
        title: 'ZIP Archive',
        columns: 2,
        items: [{
            text: 'Import',
            iconCls: 'icon-page_white_zip-16',
            iconAlign: 'left',
            tooltip : '<b>Import</b><div class="w-shortcut">[CTRL+SHIFT+I]</div><br/>Import a project from a <b>ZIP</b> archive',
            action: 'import-project'
        },{
            text: 'Export',
            iconCls: 'icon-report_go-16',
            iconAlign: 'left',
            tooltip : '<b>Export</b><div class="w-shortcut">[CTRL+SHIFT+E]</div><br/>Export selected project as a <b>ZIP</b> archive',
            action: 'export-project'
        }]

    },{

        xtype: 'buttongroup',
        title: 'Export as ..',
        columns: 5,
        items: [{
            text: 'PDF',
            iconCls: 'icon-page_white_acrobat-16',
            iconAlign: 'left',
            tooltip : '<b>Export PDF</b><br/>Convert current project to PDF',
            action: 'export-project-as-pdf'
        },{
            text: 'HTML',
            iconCls: 'icon-page_white_world-16',
            iconAlign: 'left',
            tooltip : '<b>Export HTML</b><br/>Convert current project to HTML',
            action: 'export-project-as-html'
        },{
            text: 'LaTex',
            iconCls: 'icon-page_white_code-16',
            iconAlign: 'left',
            tooltip : '<b>Export LaTex</b><br/>Convert current project to LaTex',
            action: 'export-project-as-latex'
        },{
            text: 'EPUB',
            iconCls: 'icon-e_book_reader_white-16',
            iconAlign: 'left',
            tooltip : '<b>Export EPUB</b><br/>Convert current project to EPUB',
            action: 'export-project-as-epub'
        },{
            text: 'Text',
            iconCls: 'icon-page_white_text-16',
            iconAlign: 'left',
            tooltip : '<b>Export Text</b><br/>Convert current project to Text',
            action: 'export-project-as-text'
        }]

    },{

        xtype: 'buttongroup',
        title: 'Versioning',
        columns: 1,
        items: [{
            text: 'Git History',
            iconCls: 'icon-git_orange-16',
            iconAlign: 'left',
            tooltip : '<b>Git History</b><div class="w-shortcut">[CTRL+SHIFT+H]</div><br/>Show Git history for current project',
            action: 'show-git-history'
        }]

    },'->',{

        xtype: 'buttongroup',
        columns: 1,
        height: '100%',

        items: [{
            loader: {
                url: '/btc-donate.html',
                autoLoad: true
            },

            listeners: {
                click: function (button) {
                    var form = assert (button.el.down ('form'));
                    var dom = assert (form.dom); dom.submit ();
                }
            }
        }]
    }],

    hidden: true
});
