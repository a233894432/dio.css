class Emitter {
    constructor() {
        this._events = {};
        this._middles = {};
    }

    // 注册中间件
    use(type, middle) {
        const list = this._middles[type];
        if (!list) {
            this._middles[type] = middle;
            return;
        }

        let current = list;
        while (current.next) {
            current = current.next;
        }
        current.next = middle;
    }

    // 注册事件
    on(type, fn) {
        const events = this._events[type] = this._events[type] || [];
        if (events.indexOf(fn) < 0) {
            events.push(fn);
        }
    }

    // 触发事件
    emit(type, data) {
        // 先生成 Event 对象
        const e = {
            type: type,
            original: data
        };

        // 调用 middleware
        const middle = this._middles[type];

        if (middle) {
            // 为了能不断的 next 下去，这里用一个 wrapper，
            // 每次调用的时候都会调用这个 wrapper 生成一个可以继续调用的
            // next() 来进行调用
            function wrapNext(m) {
                return function() {
                    if (m.next) {
                        m.next(e, wrapNext(m.next));
                    }
                };
            }

            // 递归调用开始了
            middle(e, wrapNext(middle));
        }

        // 调用事件处理，循环调用就好，不需要 shift
        const events = this._events[type] = this._events[type] || [];
        events.forEach(fn => {
            fn.call(this, e);
        });
    }
}


var obj = new Emitter();

obj.use("customEvent", (e, next) => {
    console.log("m1", e);
    e.data = "world";
    next();
    console.log("m1 end", e);
});

obj.use("customEvent", (e, next) => {
    console.log("m2", e);
    e.cancelable = true;
    next();
});

obj.use("customEvent", (e, next) => {
    console.log("m3", e);
    e.author = "james";
    next();
});

obj.on("customEvent", e => {
    console.log("e1", e);
});

obj.on("customEvent", e => {
    console.log("e2", e);
});

obj.emit("customEvent", "原始数据");