define(["backbone","admin/view/ItemViewBase"],function(b,a){return a.extend({tagName:"span",template:_.template($("#content-item-template").html()),prefix:"content-",initialize:function(c){this.baseInitialize(c)},render:function(){this.$el.append(this.template(this.model.toJSON()))&&this.hideFields();return this},})});