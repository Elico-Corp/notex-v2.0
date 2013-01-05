Ext.define ('Webed.view.UploadBox', {
    extend: 'Ext.window.Window',
    alias: 'widget.upload-box',

    requires: [
        'Ext.form.Panel',
        'Ext.form.field.File'
    ],

    border: false,
    layout: 'fit',
    modal: true,
    resizable: false,
    title: 'Upload',
    width: 320,

    buttons: [{
        text: 'Upload',
        iconCls : 'icon-tick-16',
        action: 'confirm'
    },{
        text : 'Cancel',
        iconCls : 'icon-cross-16',
        action: 'cancel'
    }]
});

Ext.apply (Ext.form.field.VTypes, {
    fileText: "File expected",
    fileMask: /\w\d\s\./i,
    file: function (value, field) {
        return /^.+$/i.test (value);
    }
});

Ext.define ('Webed.view.FileUploadBox', {
    extend: 'Webed.view.UploadBox',
    alias: 'widget.file-upload-box',
    iconCls: 'icon-folder_page-16',
    title: 'Upload File',

    items: [{
        xtype: 'form',
        layout: 'fit',
        bodyPadding: '4',

        items: [{
            xtype: 'filefield',
            vtype: 'file',
            allowBlank: false,
            name: 'file',
            emptyText: 'Select file ..',
            buttonText: '',
            buttonConfig: {
                iconCls: 'icon-folder-16'
            }
        }]
    }]
});

Ext.apply (Ext.form.field.VTypes, {
    zipArchiveText: "ZIP Archive expected",
    zipArchiveMask: /\w\d\s\./i,
    zipArchive: function (value, field) {
        return /^.+\.zip$/i.test (value);
    }
});

Ext.define ('Webed.view.ArchiveUploadBox', {
    extend: 'Webed.view.UploadBox',
    alias: 'widget.archive-upload-box',
    iconCls: 'icon-page_white_zip-16',
    title: 'Upload Archive',

    items: [{
        xtype: 'form',
        layout: 'fit',
        bodyPadding: '4',

        items: [{
            xtype: 'filefield',
            vtype: 'zipArchive',
            allowBlank: false,
            name: 'file',
            emptyText: 'Select ZIP archive ..',
            buttonText: '',
            buttonConfig: {
                iconCls: 'icon-folder-16'
            }
        }]
    }]
});