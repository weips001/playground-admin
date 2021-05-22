import { parse } from 'querystring';
import routes from '../../config/routes'

/* eslint no-useless-escape:0 import/prefer-default-export:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

export const isUrl = (path: string): boolean => reg.test(path);

export const isAntDesignPro = (): boolean => {
  if (ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site') {
    return true;
  }
  return window.location.hostname === 'preview.pro.ant.design';
};

// 给官方演示站点用，用于关闭真实开发环境不需要使用的特性
export const isAntDesignProOrDev = (): boolean => {
  const { NODE_ENV } = process.env;
  if (NODE_ENV === 'development') {
    return true;
  }
  return isAntDesignPro();
};

export const getPageQuery = () => parse(window.location.href.split('?')[1]);

export const saveUserInfo = (user) => {
  try {
    localStorage.setItem('user', JSON.stringify(user))
  } catch (e) {
    localStorage.setItem('user', '')
  }
}

export const getUserInfo = () => {
  const userStr = localStorage.getItem('user')
  if(userStr) {
    return JSON.parse(userStr)
  }
  return null
}

export const getUserCompId = ():string|null => {
  const user = getUserInfo()
  if(user) {
    return user.compId
  }
  return null
}

export const getAllAuthFromRoutes = () => {
  let auth = []
  function filterRoute(routes) {
    routes = JSON.parse(JSON.stringify(routes))
    routes.forEach(item => {
      if(item.routes) {
        filterRoute(item.routes)
      } else {
        if(item.authority) {
          auth.push({label: item.name, value: item.authority})
        }
      }
    })
    return auth
  }
  return filterRoute(routes)
}

const getUserRole = (): string[] => {
  const user = getUserInfo()
  console.log('user', user)
  if(user && user.role) {
    return user.role
  }
  return []
}
// 获取当前用户所有的权限
export const getCurrentAllAuth = () => {
  // 处理超级管理员和每个公司的管理员
  const role = getUserRole()
  const superAuth = '-2'
  const allAuthList = getAllAuthFromRoutes()
  if(role.includes(superAuth)) {
    return allAuthList
  }
  // 所有公司的权限应该去除公司管理的页面
  return allAuthList.filter(item => item.value !== 'company')
}
// 获取所有的权限code码
export const getAllAuthCode = ():string[] => {
  const role = getUserRole()
  console.log('role---', role)
  const superAuth = '-2'
  const allAuthList = getAllAuthFromRoutes()
  const authCodeList = allAuthList.map(item => item.value)
  if(role.includes(superAuth)) {
    return authCodeList
  }
  return authCodeList.filter(auth => auth !== 'company')
}
// 获取用户的auth码，如果为 -2或者-1 则为管理员权限，否则以传入的auth为准
export const getUserAuth = (role: string[] = [], auth: string[] = []):string[] => {
  const superAuth = '-2'
  const adminAuth = '-1'
  const allAuthCode = getAllAuthCode()
  // 如果不是管理员
  const isAdmin = role.some(item => item === superAuth || item === adminAuth)
  if(!isAdmin) {
    return auth
  }
  return allAuthCode
}

export const delay = (isSuccess = true, ms = 2000) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if(isSuccess) {
        resolve(null)
      } else {
        reject()
      }
    }, ms)
  })
}