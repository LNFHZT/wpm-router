export function deepCopy(obj: any) {
    if (obj == null) { return null }
    let result: any = Array.isArray(obj) ? [] : {};
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            if (typeof obj[key] === 'object') {
                result[key] = deepCopy(obj[key]); // 如果是对象，再次调用该方法自身 
            } else {
                result[key] = obj[key];
            }
        }
    }
    return result;
}

export function extend(...nums: Array<any>) {  //extend 深拷贝实现
    var name: any, options: any, src: any, copy: any,
        deep: any = false,  //是否深拷贝 默认为false
        length = arguments.length,
        i: any = 1,
        target: any = arguments[0] || {};
    //如果第一个参数为boolean类型,赋值给deep
    if (typeof target == 'boolean') {
        deep = arguments[0];
        target = arguments[i] || {}; //目标对象顺延
        i++;
    }

    //如果target不是对象数据类型的话  target赋值为 {}
    if (['object', 'function'].indexOf(typeof target) < 0) {
        target = {};
    }

    for (; i < length; i++) {

        options = arguments[i];

        if (options != null) {

            for (name in options) {

                copy = options[name];
                src = target[name];

                if (target === copy) {  //避免重复循环
                    continue;
                }

                if (deep && copy && (typeof copy == 'object')) { // 类型判断

                    src = Object.prototype.toString.call(copy) == '[object Array]' ? [] : {};  //区分数组和‘对象’
                    target[name] = extend(deep, src, copy);
                } else {

                    if (copy !== undefined) {

                        target[name] = copy;
                    }
                }
            }
        }
    }

    return target
}