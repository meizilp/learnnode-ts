/*
 * 此Demo主要演示Promise的链式调用。
 */

/*
 * 模拟链式then，但是在then中不返回值。
 */
function showNoReturnInThen() {
    let p = new Promise((resolve, reject) => {
        console.log('Demo2 p1 running')
        setTimeout(function () {
            console.log('Demo2 p1 resolved')
            resolve('Demo2 p1 resolved!')
        }, 1000);
    })

    p.then((result) => {
        //这儿的result就是resolve的参数传递过来
        console.log(`Demo2 p1 first then:${result}`)
        setTimeout(function () {
            console.log(`Demo2 p1 first then 异步`)
        }, 1000) //这个异步不影响后续的then

    }).then((result) => {
        //上一个then不return，等价于return了undefined，也就是result的值是undefined
        //undefined等同于返回一个值，那么这个then中的代码也会在上一个then之后执行，但不会等上一个then中的异步结束才执行        
        console.log(`Demo2 p1 second then:${result}`)
    }).catch((err) => {
        console.log(`Demo2 p1 err`)
        console.error(err)
    })
}

/*
 * 模拟在then中返回一个值。
 */
function showReturnValueInThen() {
    let p = new Promise((resolve, reject) => {
        console.log('Demo2 p2 running')
        setTimeout(function () {
            console.log('Demo2 p2 resolved')
            resolve('Demo2 p2 resolved!')
        }, 1000);
    })

    p.then((result) => {
        console.log(`Demo2 p2 first then:${result}`)
        return '来至于p2第一个then的返回值'
    }).then((result) => {
        //result的值就是上一个then的返回值
        console.log(`Demo2 p2 second then:${result}`)
        return '来自于p2第二个then的返回值'
    }).then(null)
        .then((result) => {
            //上一个then传入的是null，相当于不存在，所以这儿会接收到第二个then返回的值
            //在js中如果then传入的不是函数，那么就等价于then。在ts中受到约束只能传入函数。
            console.log(`Demo2 p2 fourth then:${result}`)
        }).catch((err) => {
            console.log(`Demo2 p2 err`)
            console.error(err)
        })
}

/*
 * 模拟在then中返回一个Promise。
 */
function showReturnPromiseInThen() {
    let p = new Promise((resolve, reject) => {
        console.log('Demo2 p3 running')
        setTimeout(function () {
            console.log('Demo2 p3 resolved')
            resolve('Demo2 p3 return value!')
        }, 1000);
    })

    p.then((result) => {
        //result 就是p被resolve时传递的值
        console.log(`Demo2 p3 first then:${result}`)
        return new Promise((resolve, reject) => {
            setTimeout(function () {
                resolve('Demo2 p3-internal')
            }, 3000)
        })
    }).then((result) => {
        //result的值是上一个then中返回的Promise被resolve的值
        //并且这个then要等返回的Promise被resolve了才会执行
        console.log(`Demo2 p3 second then:${result}`)
    }).catch((err) => {
        console.log(`Demo2 p3 err`)
        console.error(err)
    })
}

/*
 * 模拟运行中抛出异常。
 */
function showThrowError() {
    let p = new Promise((resolve, reject) => {
        console.log('Demo2 p4 running')
        setTimeout(function () {
            //不会被Promise的catch捕获。但可以用try catch来捕获
            //但try catch必须是在回调函数内部。不能是包裹这setTimeout
            throw new Error('i am error') 
        }, 1000)
    })

    p.then((result) => {
        console.log(`Demo2 p3 first then:${result}`)
    }).catch((err) => {
        console.log(`Demo2 p3 err`)
        console.error(err)
    })
}

function run() {
    showNoReturnInThen()
    showReturnValueInThen()
    showReturnPromiseInThen()
    showThrowError()
}

export { run }
