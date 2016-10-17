//Promise主要用来处理异步。当然用于同步也可以，原理都一样。

/*
 * Promise有三种状态，创建时为Pending状态；如果被resolve了就转化为fulfilled（完成）；
 * 如果reject了就转化为rejected（失败）。状态一旦转化后就不能再逆向变化回去。
 * 此函数按照输入的值模拟操作是否成功，在延迟1s之后调用callback。
 * @param result true表示要操作成功，false表示要操作失败。
 * @param callback 操作完成后的回调函数。回调时如果err不为null表示失败，result是模拟的返回数据。
 */
function doSomething(result: boolean, callback: (err: Error, result) => void) {
    if (result) {
        setTimeout(function () {
            console.log('doSomething success.')
            if (callback) callback(null, 'Wonderful')
        }, 1000);
    } else {
        setTimeout(function () {
            console.log('doSomething failed.')
            if (callback) callback(new Error('You got a error.'), null)
        }, 1000);
    }
}

/*
 * 创建Promise。根据执行结果设置Promise状态。
 * reject、resolve函数所传递的对象可以被后续的then或者catch函数接受。
 * 按照规范Promise创建后就会执行，但是是在后续代码前执行还是后执行不一定。
 */
let p1 = new Promise((resolve, reject) => {
    console.log('Promise p1 will be do something.')
    doSomething(false, (err, result) => {
        if (err) {
            console.log('Promise p1 failed')
            reject(err)
        } else {
            console.log('Promise p1 success')
            resolve(`p1:${result}`)
        }
    })
})

/*
 * 根据Promise的状态执行不同的逻辑。
 * 如果Promise的状态是Pending，那么会等待状态转换后执行。
 * 如果Promise的状态已经转化完毕，那么then或者catch就会立即执行。
 * then函数中可以有三件退出方法：
 *      返回一个新的Promise；
 *      返回一个同步的值（或者undefined。如果没有明确的return，就是这个）；
 *      throw一个Error。
 * 
 */
p1.then((resultFromLast) => {
    console.log(`first then:${resultFromLast}`)
}).catch((err) => {
    console.log('i am catch 1')
    //console.log(err)
}).catch((err) => {
    console.log('i am catch 2')
})


//可能在Promise前执行，也可能在Promise之后执行。
console.log('I am the last line')
