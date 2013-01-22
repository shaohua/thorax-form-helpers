describe("form-helper", function() {

  it("input helper", function(){
    var textInputView = new Application.View({
      key: 'value',
      template: '{{input type="text" class="test" value="{{key}}"}}'
    });
    textInputView.render();
    expect(textInputView.$('.test').val()).to.equal('value');

    var textareaInputView = new Application.View({
      template: '{{input type="textarea" value="value"}}'
    });
    textareaInputView.render();
    expect(textareaInputView.$('textarea').val()).to.equal('value');

    var selectView = new Application.View({
      optionsHash: {
        valueOne: 'Label One',
        valueTwo: 'Label Two'
      },
      optionsArray: [
        ['valueOne', 'Label One'],
        ['valueTwo', 'Label Two']
      ],
      template: '{{input name="a" type="select" options=optionsHash}}{{input name="b" type="select" options=optionsArray}}'
    });
    selectView.render();
    expect(selectView.$('select').length).to.equal(2);
    expect(selectView.$('option').length).to.equal(4);
    expect(selectView.$('select[name="a"]').find('option')[0].getAttribute('value')).to.equal('valueOne');
  });

  it('input-error helper', function() {
    var inputErrorView = new Application.View({
      template: '{{input-error "a"}}{{input-error "b" tag="p" class="help-block"}}'
    });
    inputErrorView.render();
    expect(inputErrorView.$('span').length).to.equal(1);
    expect(inputErrorView.$('p').length).to.equal(1);
    inputErrorView.trigger('error', [
      {
        id: 'a',
        message: 'message one'
      },
      {
        id: 'b',
        message: 'message two'
      }
    ]);
    expect(inputErrorView.$('span').html()).to.equal('message one');
    expect(inputErrorView.$('p').html()).to.equal('message two');
    inputErrorView.reset();
    expect(inputErrorView.$('span').html()).to.equal('');
    expect(inputErrorView.$('p').html()).to.equal('');
  });

  it("control-group helper", function() {
    var controlGroupView = new Application.View({
      template: '{{#control-group name="a" label="hey"}}{{control-label}}{{control-input class="tasty"}}{{control-error}}{{/control-group}}'
    });
    controlGroupView.render();
    expect(controlGroupView.$('label').html()).to.equal('hey');
    expect(controlGroupView.$('input.tasty').length).to.equal(1);
    expect(controlGroupView.$('.help-block').length).to.equal(1);
  });

  it("error helper", function() {
    var errorHelperView = new Application.View({
      template: '{{#error}}<p class="error-header">Some Errors</p><ul class="error-messages">{{#each errors}}<li>{{message}}</li>{{/each}}{{/error}}<form><input name="test" data-validate-required="true"></form>'
    });
    errorHelperView.render();
    expect(errorHelperView.$('.error-header').length).to.equal(0);
    expect(errorHelperView.serialize()).to.be['false'];
    expect(errorHelperView.$('.error-header').length, 1);
    expect(errorHelperView.$('ul.error-messages li').length).to.equal(1);
    expect(errorHelperView.serialize()).to.be['false'];
    expect(errorHelperView.$('.error-header').length, 1);
    expect(errorHelperView.$('ul.error-messages li').length).to.equal(1);
    errorHelperView.populate({test:'value'});
    expect(!!errorHelperView.serialize()).to.be['true'];
    expect(errorHelperView.$('.error-header').length, 0);
    expect(errorHelperView.$('ul.error-messages li').length).to.equal(0);
  });

  it("control group + validation", function() {
    var formView = new Application.View({
      template: '<form>{{#control-group name="a"}}{{control-error}}{{control-input data-validate-required="true"}}{{/control-group}}{{#control-group name="b"}}{{control-error}}{{control-input data-validate-min-length="3" data-error-message="too short"}}{{/control-group}}</form>'
    });
    formView.render();

    expect($(formView.$('.help-block')[0]).html() === '').to.be['true'];
    expect(!formView.serialize()).to.be['true'];
    expect($(formView.$('.help-block')[0]).html() !== '').to.be['true'];
    expect($(formView.$('.help-block')[1]).html() === 'too short').to.be['true'];
    formView.populate({
      a: 'a',
      b: 'ab'
    });
    expect(!formView.serialize()).to.be['true'];
    formView.populate({
      b: 'abc'
    });
    expect(!!formView.serialize()).to.be['true'];
    expect($(formView.$('.help-block')[0]).html() === '').to.be['true'];
    expect($(formView.$('.help-block')[1]).html() === '').to.be['true'];
    //ensure the form can re-error
    formView.populate({
      a: '',
      b: ''
    });
    expect(!formView.serialize()).to.be['true'];
    expect($(formView.$('.help-block')[0]).html() !== '').to.be['true'];
    expect($(formView.$('.help-block')[1]).html() === 'too short').to.be['true'];
  });
});