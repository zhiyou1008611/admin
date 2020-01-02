import * as types from './types.js'

//关于token的存放位置
//1.只用vuex存储：刷新页面vuex重新初始化，token消失导致需要重新登录
//2.window.localStorage: 初始化的时候用localStorage来赋值，刷新页面重新初始化，但因为localStorage里面存有token有值，
//那么state.token就有值了,vue-router就不会拦截，则无需重新登录。（这个demo用的是这种）
//3.window.localStorage: 初始化的时候用localStorage来赋值，这种情况跟localStorage差不多。后台配合给长时间有效的token比较好,
//如果token的有效期比较短，直接有localStorage比较好。

const mutations = {
    [types.LOGIN]: (state, data) => {
        //更改token的值
        state.token = data;
        window.localStorage.setItem('token', data);
    },
    [types.LOGOUT]: (state) => {
        //登出的时候要清除token
        state.token = null;
        window.localStorage.removeItem('token');
    },
    //这步可有可无，根据自己需求去写
    [types.USERINFO]: (state, data) => {
        //把用户名存起来

        state.username = data.data.username;
        state.userid = data.data.id;
        window.localStorage.setItem('username', data.data.username);
    }
};

export default mutations;
