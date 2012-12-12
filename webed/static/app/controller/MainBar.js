Ext.define ('Webed.controller.MainBar', {
    extend: 'Ext.app.Controller',

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    refs: [{
        selector: 'node-tree', ref: 'nodeTree'
    }],

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    init: function () {
        this.control ({
            'main-bar button[action=save-document]': {
                click: this.saveDocument
            },
            'main-bar button[action=open-document]': {
                click: this.openDocument
            },
            'main-bar splitbutton[action=add]': {
                click: this.add
            },
            'main-bar menuitem[action=add-project]': {
                click: this.addProject
            },
            'main-bar menuitem[action=add-folder]': {
                click: this.addFolder
            },
            'main-bar menuitem[action=add-text]': {
                click: this.addText
            },
            'main-bar button[action=rename]': {
                click: this.rename
            },
            'main-bar button[action=delete]': {
                click: this.destroy
            },
            'main-bar button[action=import-project]': {
                click: this.importProject
            },
            'main-bar button[action=export-project]': {
                click: this.exportProject
            }
        });
    },

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    saveDocument: function (item, event, options) {
        function callback (records, op) {
            if (op.success) return;

            assert (records);
            if (records.length > 0) {
                message.error ({ msg: Ext.String.format (
                    message.UPDATE_ERROR, records[0].get ('name')
                )});
            } else {
                message.error ({ msg: Ext.String.format (
                    message.UPDATE_ERROR, null
                )});
            }

            console.error ('[MainBar.saveDocument]', records, op);
        }

        this.application.fireEvent ('update_tab', this, {
            scope: this, callback: callback
        });
    },

    openDocument: function (item, event, options) {
        console.debug ('[MainBar.openDocument]');
    },

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    add: function (item, event, options) {
        this.addProject (item, event, options);
    },

    addProject: function (item, event, options) {
        message.prompt ({
            title: 'Add Project', msg: 'Enter a name:', value: 'Project',
            scope: this, callback: function (button, text) {
                if (button != 'ok' || !text) return;

                function callback (rec, op) {
                    if (op.success) return;

                    message.error ({ msg: Ext.String.format (
                        message.CREATE_ERROR, text
                    )});

                    console.error ('[MainBar.addProject]', rec, op);
                }

                this.application.fireEvent ('create_node', {
                    scope: this, callback: callback, node: {
                        root_uuid: '00000000-0000-0000-0000-000000000000',
                        mime: 'application/project',
                        name: text
                    }
                });
            }
        });
    },

    addFolder: function (item, event, options) {
        message.prompt ({
            title: 'Add Folder', msg: 'Enter a name:', value: 'folder',
            scope: this, callback: function (button, text) {
                if (button != 'ok' || !text) return;

                function callback (rec, op) {
                    if (op.success) return;

                    message.error ({ msg: Ext.String.format (
                        message.CREATE_ERROR, text
                    )});

                    console.error ('[MainBar.addFolder]', rec, op);
                }

                this.application.fireEvent ('create_node', {
                    scope: this, callback: callback, node: {
                        mime: 'application/folder',
                        name: text
                    }
                });
            }
        });
    },

    addText: function (item, event, options) {
        message.prompt ({
            title: 'Add Text', msg: 'Enter a name:', value: 'file.txt',
            scope: this, callback: function (button, text) {
                if (button != 'ok' || !text) return;

                function callback (rec, op) {
                    if (op.success) return;

                    message.error ({ msg: Ext.String.format (
                        message.CREATE_ERROR, text
                    )});

                    console.error ('[MainBar.addText]', rec, op);
                }

                this.application.fireEvent ('create_leaf', {
                    scope: this, callback: callback, leaf: {
                        mime: 'text/plain',
                        name: text
                    }
                });
            }
        });
    },

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    rename: function (item, event, options) {
        var view = this.getNodeTree ();
        assert (view);
        var semo = view.getSelectionModel ();
        assert (semo);
        var node = semo.getLastSelected ();
        assert (node);
        var uuid = node.get ('uuid');
        assert (uuid);

        if (uuid == '00000000-0000-0000-0000-000000000000')
            return;

        message.prompt ({
            title: 'Rename', value: node.get ('name'),
            scope: this, fn: function (button, text) {
                if (button != 'ok' || text == node.get ('name') || text == '')
                    return;

                function callback (rec, op) {
                    if (op.success) return;

                    message.error ({ msg: Ext.String.format (
                        message.UPDATE_ERROR, node.get ('name')
                    )});

                    console.error ('[MainBar.rename]', rec, op);
                }

                this.application.fireEvent ('update_node', {
                    scope: this, callback: callback, node: {
                        uuid: uuid, name: text
                    }
                });
            }
        });
    },

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    destroy: function (item, event, options) {
        var view = this.getNodeTree ();
        assert (view);
        var semo = view.getSelectionModel ();
        assert (semo);
        var node = semo.getLastSelected ();
        assert (node);
        var uuid = node.get ('uuid');
        assert (uuid);

        if (uuid == '00000000-0000-0000-0000-000000000000') {
            return;
        }

        message.confirm ({
            title: 'Delete',
            msg: Ext.String.format (
                'Are you sure, do you want to delete <i>{0}</i>?', node.get (
                    'name'
                )
            ),
            scope: this, fn: function (button) {
                if (button != 'yes') return;

                function callback (rec, op) {
                    if (op.success) return;

                    message.error ({ msg: Ext.String.format (
                        message.DELETE_ERROR, node.get ('name')
                    )});

                    console.error ('[MainBar.destroy]', rec, op);
                }

                this.application.fireEvent ('delete_node', {
                    scope: this, callback: callback, node: {
                        uuid: uuid
                    }
                });
            }
        });
    },

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    importProject: function (item, event, options) {
        console.debug ('[MainBar.importProject]');
    },

    exportProject: function (item, event, options) {
        console.debug ('[MainBar.exportProject]');
    }

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////
});
