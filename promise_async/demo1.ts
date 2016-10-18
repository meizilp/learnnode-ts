/*
 * 此Demo描述Promise的基本概念。
 * Promise主要用来处理异步操作，使得进行异步操作时仍然能够捕获异常，抛出异常，return值。
 * 按照规范Promise创建后，其内部的代码就会开始异步执行，也就是不会阻塞后续的代码执行。
 * Promise有三种状态:
 *      创建时为Pending状态；
 *      如果被resolve了就转化为fulfilled（完成）；
 *      如果reject了就转化为rejected（失败）。
 *      状态一旦转化后就不能再变化，无论是逆向回去，还是再次reject，resolve都不会改变第一次转化的状态。
 *      如果不调用resolve也不调用reject，那么只会执行构造Promise时传入的回调函数,then和catch都不会执行。
 */

/*
 * 模拟Promise被Resolve。
 */
function showPromiseResolved() {
    let p = new Promise((resolve, reject) => {
        console.log("Demo1 Promise1 开始。3秒后resolve。") //Promise创建后开始执行
        setTimeout(function () {
            /* do something */
            //调用resolve更改Promise状态。此时并不会立即调用then传递的回调函数
            //resolve的参数会传递过去
            resolve('Demo1 success. 返回一个字符串.')  
            //仍然继续执行，嵌套的异步函数仍然不会阻塞
            setTimeout(function() {
                console.log('我是嵌套的异步函数')                
            }, 3000);
            console.log('Demo1 p1 异步操作完毕')
            //然后就会调用then传递的回调函数了，不会等待上面的异步操作执行完毕
        }, 3000);   //模拟需要3秒的异步操作
        console.log("Demo1 p1 这儿不会三秒后才执行")
    })
    p.then((result) => {     
        //result 是来自于resolve的参数   
        console.log(`Demo1 Promise1 then called. 返回值是 ${result}`)        
    }).catch((err: Error) => {
        console.log("Demo1 Promise1 catch().这块代码应该永远不会执行")
    })
}

/*
 * 模拟Promise被Reject
 */
function showPromiseRejected() {
    let p = new Promise((resolve, reject) => {
        console.log("Demo1 Promise2 开始。2秒后reject。") //Promise创建后立即执行
        setTimeout(function () {
            /* do something */
            reject(new Error('拒绝执行'))  //拒绝操作，参数是新构造的Error对象
        }, 2000); //模拟需要2秒的异步操作
    })
    p.then((result) => {
        console.log(`Demo1 Promise2 then called. 这块代码应该永远不会执行`)
    }).catch((err: Error) => {  
        //捕获到Error并输出。
        console.log(`Demo1 Promise2 catch called. 发生了错误如下：`)
        console.error(err)
    })//多个catch的话只会第一个catch生效
}

function run() {
    showPromiseResolved()
    console.log("Demo1 Promise1 没有阻塞代码执行")  //Promise是异步操作不会阻塞
    showPromiseRejected()
    console.log("Demo1 的请求都已经发出，异步操作已经启动。") //也不会阻塞
}

export { run }
