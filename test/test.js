var fs = require('fs');
var expect = require('chai').expect;
var should = require('chai').should();

var bTemplate = require('../index.js');

describe('Bracket Template:', function(){

	before(function(){
		bTemplate.options = null;
	});

	it('loads the module', function(){
		should.exist(bTemplate);
		expect(bTemplate).to.be.a('object');
		expect(bTemplate.render).to.be.a('function');
	});

	it('fails gracefully', function(){
		var ret = null;
		ret = bTemplate.render();
		expect(ret).to.be.null;

		ret = bTemplate.render(function(){});
		expect(ret).to.be.null;

		ret = bTemplate.render(function(){}, {});
		expect(ret).to.be.null;

		ret = bTemplate.render("test");
		expect(ret).to.be.a.string;

		ret = bTemplate.render(0,1);
		expect(ret).to.be.null;

		ret = bTemplate.render("test", 1);
		expect(ret).to.be.a.string;
	});

	it('renders some basic text', function(){
		var string = "[ person.name : default ] template-string";
		var data = {
			person: {
				name: "bracket"
			}
		};

		string = bTemplate.render(string, data);

		should.exist(string);
		expect(string).to.be.a('string');
		expect(string).to.equal('bracket template-string');
	});


	it('renders default text', function(){
		var string = "[ name : default ] template-string";
		var data = {};

		string = bTemplate.render(string, data);

		should.exist(string);
		expect(string).to.be.a('string');
		expect(string).to.equal('default template-string');
	});

	it('can use a buffer as source', function() {
		var buffer = new Buffer("[ name : default ] template-buffer");
		var data = {
			name: "bracket"
		};

		buffer = bTemplate.render(buffer, data);

		should.exist(buffer);
		expect(buffer).to.be.instanceof(Buffer);
		expect(String(buffer)).to.equal('bracket template-buffer');

	});

	it('renders a template file', function() {
		var finalBuff = fs.readFileSync(__dirname + '/sample.expect');
		var buffer = fs.readFileSync(__dirname + '/sample.template');
		var data = {
			firstName: "Davey Jones",
			sentiment: "lame like a lamb",
			alpha: "Bracket",
			layers: [{
				price: '$5.99'
			}]
		};

		buffer = bTemplate.render(buffer, data, {prefix: null});

		should.exist(buffer);
		expect(buffer).to.be.instanceof(Buffer);

		expect(String(buffer)).to.equal(String(finalBuff));

	});

	it('renders blocks in a template file', function() {
		var finalBuff = fs.readFileSync(__dirname + '/blocks.expect');
		var buffer = fs.readFileSync(__dirname + '/blocks.template');
		var data = {
			firstName: "Davey Jones",
			things: {
				pet: "a lamb",
				car: "porsche",
				3: "a hat"
			}
		};

		buffer = bTemplate.render(buffer, data, {prefix: null});

		should.exist(buffer);
		expect(buffer).to.be.instanceof(Buffer);

		expect(String(buffer)).to.equal(String(finalBuff));

		data.things = ['cow', 'tree', 'cloud', 46];
		buffer = fs.readFileSync(__dirname + '/blocks.template');
		finalBuff = fs.readFileSync(__dirname + '/blocks.expect.array');

		buffer = bTemplate.render(buffer, data, {prefix: null});
		expect(String(buffer)).to.equal(String(finalBuff));

		data.users = [{
			name: 'joel bair',
			age: 39,
			sex: 'male'
		}, {
			name: 'barack obamma',
			age: 59,
			sex: 'male'
		},{
			name: 'megan fox',
			age: 25,
			sex: 'please!'
		}];

		data.person = {
			firstName: data.firstName
		};

		buffer = fs.readFileSync(__dirname + '/blocks.complex.template');
		finalBuff = fs.readFileSync(__dirname + '/blocks.complex.expect');

		buffer = bTemplate.render(String(buffer), data, {prefix: null});
		expect(String(buffer)).to.equal(String(finalBuff));

	});

	it('renders conditional logic in a template file', function() {
		var finalBuff = fs.readFileSync(__dirname + '/conditional.expect');
		var buffer = fs.readFileSync(__dirname + '/conditional.template');
		var data = {
			display: "Davey Jones",
			iftrue: true
		};

		buffer = bTemplate.render(buffer, data, {prefix: null});

		should.exist(buffer);
		expect(buffer).to.be.instanceof(Buffer);

		expect(String(buffer)).to.equal(String(finalBuff));
	});

	it('renders multiple complex sub-key text', function(){
		var string = "[ foo.bar ] [ name ] [ stack_bar_baz ]";
		var data = {
			test: {
				name: "bracket",
				foo: {
					bar: 'foo-bracket'
				},
				stack: {
					bar: {
						baz: 'bar-bracket'
					}
				}
			}
		};

		string = bTemplate.render(string, data.test);

		should.exist(string);
		expect(string).to.be.a('string');
		expect(string).to.equal('foo-bracket bracket bar-bracket');

		string = bTemplate.render(string, data.test);

		should.exist(string);
		expect(string).to.be.a('string');
		expect(string).to.equal('foo-bracket bracket bar-bracket');
	});

	it('renders using strict keys', function(){
		var string = "[ person.name : default ] template-string [ place.name : default ]";
		var data = {
			place: {
				name: "bracket"
			}
		};

		string = bTemplate.render(string, data, {strictKeys: true});

		should.exist(string);
		expect(string).to.be.a('string');
		expect(string).to.equal('[ person.name : default ] template-string bracket');
	});
});
