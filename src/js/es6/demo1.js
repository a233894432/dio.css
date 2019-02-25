var s = 'Hello world!';

s.startsWith('Hello') // true
s.endsWith('!') // true
s.includes('o') // true


console.log('x'.repeat(3))



// 字符串中嵌入变量
var name = "Bob",
    time = "today";
let col = `Hello ${name}, how are you ${time}?`
console.log(col)




var a = 5;
var b = 10;

function tag(s, v1, v2) {
    console.log(s[0]);
    console.log(s[1]);
    console.log(s[2]);
    console.log(v1);
    console.log(v2);

    return "OK";
}

tag `Hello ${ a + b } world ${ a * b}`;






function add(a, b) {
    console.log(a + b);
}

function sub(a, b) {
    return a
    console.log(a * b);
}

add.apply(sub, [3, 2]);
// add.call(sub, 3, 1);



function Animal(name) {
    this.name = name;
    this.showName = function() {
        console.log(this.name);
    }
}

function Cat(name) {
    Animal.apply(this, [name]);
    //Animal.call(this, name);  
}

var cat = new Cat("Black Cat");
cat.showName();





var name = "XL";
var Person = {
    name: "xl",
    showName: function() {
        console.log(this.name);
    }
}
Person.showName.call(); //输出 "XL"
//这里call方法里面的第一个参数为空，默认指向window。
//虽然showName方法定义在Person对象里面，但是使用call方法后，将showName方法里面的this指向了window。因此最后会输出"XL";



var arrya = [1, 4, -5, 10].find((n) => n < 0)
console.log(arrya)


var arryb = ['a', 'b', 'c'].fill(7, 1, 2)
console.log(arryb)



function Point(x = 0, y = 0) {
    this.x = x;
    this.y = y;
}

var p = new Point();
console.log(p)



let propKey = "s"
let obj = {
    [propKey]: true,
    ['a' + 'bc']: 123
};

console.log(obj)





var target = { a: 1 };

var source1 = { b: 2 };
var source2 = { c: 3 };

Object.assign(target, source1, source2);
console.log(target)