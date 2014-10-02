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

	it('renders nested iterators', function(){
		var data = {
			records: {
				testA: {
					name: "one",
					type: "thing"
				},
				testB: {
					name: "two",
					type: "unthing"
				}
			}
		};

		buffer = fs.readFileSync(__dirname + '/iterator.nesting.template');
		finalBuff = fs.readFileSync(__dirname + '/iterator.nesting.expect');

		buffer = bTemplate.render(String(buffer), data, {prefix: null});
		expect(String(buffer)).to.equal(String(finalBuff));

	});
});
