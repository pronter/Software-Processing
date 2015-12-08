// Base静态变量
Base.staticVariable = 'Base';

// Base静态方法
Base.staticMethod = function(staticVariable) {
	console.log("This is from Base class static-method, static-variable is: " + this.staticVariable);
}

// Base实例变量
function Base(instanceVariable) {
	this.instanceVariable = instanceVariable;
}

// Base实例方法
Base.prototype.instanceMethod = function() {
	console.log("This is from Base class instance-method, instance-variable is: " + this.instanceVariable);
}

// 继承方法
function extent(base, derived) {
	var prototype = object(base.prototype);
	prototype.constructor = derived;
	prototype.superClass = base.prototype;
	prototype.instanceMethod = function() {
		prototype.superClass.instanceMethod.call(this);
		console.log("This is from Derived class instance-method, instance-variable is: " + this.instanceVariable);
	}
	derived.prototype = prototype;
}

// 生成派生类
extent(Base, Derived);

// Derived静态变量
Derived.staticVariable = 'Derived';

// Derived静态方法
Derived.staticMethod = function(staticVariable) {
	this.prototype.superClass.constructor.staticMethod.call(this);
	console.log("This is from Derived class static-method, static-variable is: " + this.staticVariable);
}

// Derived实例变量
function Derived(instanceVariable) {
	Base.call(this, instanceVariable);
	this.instanceVariable = instanceVariable;
}

// 测试代码Part One
example = new Derived('example');
Derived.staticMethod();
example.instanceMethod();

// 测试代码Part Two
example = new Derived('example');
otherExample = new Derived('other-example');
Derived.staticMethod();
example.instanceMethod();
otherExample.instanceMethod();
