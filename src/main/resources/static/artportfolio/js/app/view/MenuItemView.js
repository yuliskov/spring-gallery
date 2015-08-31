define(['backbone', 'app/app', 'app/view/MenuView', 'app/util/animqueue'], function(none, app, MenuView) {
    return Backbone.View.extend({
        events: {
            'click': 'onClick',
            'click .lang>a': 'onMenuClick',
        },
        tagName: 'li',
        template: _.template($('#menu-item-template').html()),
        submenu: null,
        menu: null,
        initialize: function(options){
            this.menu = options.menu;

            this.model.on('change', this.render, this);
        },
        className: function(){
            var className = '';
            if (this.model.has('style'))
                className = this.model.get('style');
            return className;
        },
        render: function(){
            var el = this.template(this.model.toJSON());
            this.$el.html(el);
            var children = this.model.get('children');
            if (children.length) {
                var MenuView = require('app/view/MenuView');
                var submenu = new MenuView({collection: children});
                this.submenu = submenu;
                submenu.parentItem = this;
                this.$el.append(submenu.render().el);
            }
            if (app.currentContentView.model.get('id') == this.model.get('content').get('id')) {
                this.showContent();
                this.$el.addClass('active');
            }
            return this;
        },
        hasContent: function(){
            var content = this.model.get('content');
            return content.notEmpty();
        },
        onMenuClick: function(e) {
            $.get(e.currentTarget.href, function() {
                menuview.items.fetch();
            });
            return false;
        },
        onClick: function(e){
            e.stopPropagation();

            this.doClick(e);
        },
        OPEN: 0,
        CLOSE: 1,
        doClick: function(e){
            app.workspace.navigate('show/item' + this.model.get('id'));

            // draw element
            this.showContent();

            this.animate(_.bind(function() {
                //menu is opening... imitate click on first submenu item
                if (this.submenu && this.$el.hasClass('active')) {
                    var item = this.submenu.items[0];
                    item.model.get('content').notEmpty() && item.doClick();
                }
            }, this));

            // reset previously selected submenu item
            if (this.submenu && this.menu.active() != this.submenu)
                _.each(this.submenu.items, function(obj){obj.$el.removeClass('active')});
        },
        showContent: function(){
            // draw element
            var content = this.model.get('content');
            if (content.notEmpty()){
                app.currentContentView.model.set(content.toJSON());

                this.menu.active(this.menu);
                app.contentControls.toggle();
            }
        },
        animate: function(onFinish) {
            if (this.menu.parentItem && !this.menu.parentItem.$el.hasClass('active')) {
                console.log('parent not active');
                this.menu.parentItem.animate(_.bind(function() {
                    this.doAnimate(onFinish);
                }, this));
            } else {
                this.doAnimate(onFinish);
            }
        },
        doAnimate: function(onFinish) {
            var that = null;
            // find previously clicked item
            _.each(this.menu.items, function(item){
                if (item.$el.hasClass('active') && item != this) {
                    that = item;
                }
            }, this);
            var el1 = that && that.submenu ? that.submenu.$el : null;
            var el2 = this.submenu ? this.submenu.$el : null;
            if (!el1 && !el2){
                this && this.$el.addClass('active');
                that && that.$el.removeClass('active');
                return;
            }
            var queue = [
                {
                    el: el1,
                },
                {
                    el: el2,
                },
            ];

            $.slideQueue(queue, {callback: function(arr){
                _.each(arr, function(that, index){
                    that && that.$el.toggleClass('active');
                    that && that.submenu && that.submenu.$el.css('display', '');
                });
                onFinish && onFinish();
            }}, [this, that]);
        },
    });
});