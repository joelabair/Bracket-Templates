var expect = require('chai').expect;
var should = require('chai').should();

var bTemplate = require('../index.js');

describe('Bracket Template ', function(){

	 it('loads the module', function(){
		should.exist(bTemplate);
        expect(bTemplate).to.be.a('object');
        expect(bTemplate.render).to.be.a('function');
	});


	it('renders some basic text', function(){
		var string = "[ object-name : default ] template-string";
		var data = {
			name: "bracket"
		}

		string = bTemplate.render(string, data);

		should.exist(string);
		expect(string).to.be.a('string');
		expect(string).to.equal('bracket template-string');
		console.log(string);
	});


	it('renders default text', function(){
		var string = "[ object-name : default ] template-string";
		var data = {};

		string = bTemplate.render(string, data);

		should.exist(string);
		expect(string).to.be.a('string');
		expect(string).to.equal('default template-string');
		console.log(string);
	});
});
