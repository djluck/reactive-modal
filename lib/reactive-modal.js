var _modals = {};
ReactiveModal = function(){
  // EV.call(this);
  this.buttons = {};
};
// _.extend(ReactiveModal.prototype, EV.prototype);
Template._reactiveModal.helpers({
  class: function(){
    var att;
    if(this.class){
      att = 'btn ' + this.class;
    }
    return att;
  },
  dismiss: function(){
    if(this.button.closeModalOnClick){
      return "modal";
    }
  },
  arrayify: function(obj){
    result = [];
    for (var key in obj) result.push({name:key,button:obj[key]});
    return result;
  }
});

Template._reactiveModal.events({
  'click .modal-footer .reactive-modal-btn.btn': function(e){
    this.button.emit('click', { button : this.button, data : Template.instance().data.doc });
  }
});

ReactiveModal.initDialog = function (info){
  var key = "rm-" + Meteor.uuid();
  if(!info || !info.template){
    console.error("you must define a template for " , key);
  } else {
    info.key = key;
    _modals[key] = info;

    for(var button in info.buttons){
      var newButton = _.clone(info.buttons[button]);
      _.extend(newButton, new EV());
      info.buttons[button] = newButton;
      newButton.closeModalOnClick = (info.buttons[button].closeModalOnClick === undefined || info.buttons[button].closeModalOnClick === true) ? true : false;
    };
  }

  function getModalTarget(){
      return $('#' + key);
  }

  info.show = function(data){
    if (data)
        info.doc = data;

    Blaze.renderWithData(Template._reactiveModal, info, document.body);
    getModalTarget().modal('show');
  }
  info.hide = function(){
      var modalTarget = getModalTarget();
      modalTarget.modal('hide');
      modalTarget.on('hidden.bs.modal', function() {
          Blaze.remove(Blaze.getView(getModalTarget()));
      });
  }



  info.modalTarget = getModalTarget;
  return info;
};
