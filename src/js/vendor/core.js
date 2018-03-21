/*!

 @Name：前端基础库
 @Author：Diogo
 @Site：http://www.tomxiang.com
 @License：LGPL


 */
(function ($, w, d) {
  "use strict";

  /**
   * 生成指定长度的随机数
   * @param length
   * @returns {string}
   */
  $.pseudoUnique = function (length) {
    /// <summary>Returns a pseudo unique alpha-numeric string of the given length.</summary>
    /// <param name="length" type="Number">The length of the string to return. Defaults to 8.</param>
    /// <returns type="String">The pseudo unique alpha-numeric string.</returns>

    var len = length || 8,
      text = "",
      possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
      max = possible.length;

    if (len > max) {
      len = max;
    }

    for (var i = 0; i < len; i += 1) {
      text += possible.charAt(Math.floor(Math.random() * max));
    }

    return text;
  };

  /**
   * 判断HTML 中 dir 值
   */
  $.support.rtl = (function () {
    return $("html[dir=rtl]").length ? true : false;
  })();

  /**
   *
   * @descrition:判断是否是合理的IP地址
   * @param:str->待验证的IP地址
   * @return :true合理的IP地址
   *
   */
  $.isIP = function (str) {
    var pattern = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

    return pattern.test(str);
  };

  /**
   *
   * @descrition:判断输入的参数是否是个合格的手机号码，不能判断号码的有效性，有效性可以通过运营商确定。
   * @param:str ->待判断的手机号码
   * @return: true表示合格输入参数
   *
   */
  $.isCellphone = function (str) {
    /**
     *@descrition:手机号码段规则
     * 13段：130、131、132、133、134、135、136、137、138、139
     * 14段：145、147
     * 15段：150、151、152、153、155、156、157、158、159
     * 17段：170、176、177、178
     * 18段：180、181、182、183、184、185、186、187、188、189
     *
     */
    var pattern = /^(13[0-9]|14[57]|15[012356789]|17[0678]|18[0-9])\d{8}$/;
    return pattern.test(str);
  };
  /**
   *
   * @descrition:判断输入的参数是否是个合格标准的邮箱,并不能判断是否有效，有效只能通过邮箱提供商确定。
   * @param:str ->待验证的参数。
   * @return -> true表示合格的邮箱。
   *
   */
  $.isEmail = function (str) {
    /**
     * @descrition:邮箱规则
     * 1.邮箱以a-z、A-Z、0-9开头，最小长度为1.
     * 2.如果左侧部分包含-、_、.则这些特殊符号的前面必须包一位数字或字母。
     * 3.@符号是必填项
     * 4.右则部分可分为两部分，第一部分为邮件提供商域名地址，第二部分为域名后缀，现已知的最短为2位。最长的为6为。
     * 5.邮件提供商域可以包含特殊字符-、_、.
     */
    var pattern = /^([a-zA-Z0-9]+[-_.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[-_.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,6}$/;
    return pattern.test(str);
  };

  /**
   *
   * @description: 判断传入的参数的长度是否在给定的有效范围内
   * @param: minL->给定的最小的长度
   * @param: maxL->给定的最大的长度
   * @param: str->待验证的参数
   * @return : true表示合理，验证通过
   *
   */
  $.isAvaiableLength = function (minL, maxL, str) {
    return str.length >= minL && str.length <= maxL ? true : false;
  };

  /**
   *
   * @descrition: 测试给定的参数是否全部为中文字符，如"中test"不会通过 。
   * @param->str : 传入的参数，类型为字符串。
   * @return : true表示全部为中文,false为不全是中文，或没有中文。
   *
   */
  $.isChinese = function (str) {
    var pattern = /^[\u0391-\uFFE5]+$/g;
    return pattern.test(str);
  };
  /**
   *  getQuery 从URL地址栏中获取model的参数
   * @param name
   * @param url 可传.可不传
   * @returns {*}
   */
  $.getQuery = function (name, url) {
    var reg = new RegExp("(^|\\?|&)" + name + "=([^&]*)(\\s|&|$)", "i");
    var url = url || window.location.search.substr(1).match(reg);
    if (reg.test(url)) return decodeURIComponent(RegExp.$2.replace(/\+/g, " "));
    return "";
  };

  /**
   * 辅助改变url
   *
   * @param {any} url 目标url
   * @param {any} arg 需要替换的参数名称
   * @param {any} arg_val  替换后的参数的值
   * @returns url 参数替换后的url
   */
  $.changeURLArg = function (url, arg, arg_val) {
    var pattern = arg + "=([^&]*)";
    var replaceText = arg + "=" + arg_val;
    if (url.match(pattern)) {
      var tmp = "/(" + arg + "=)([^&]*)/gi";
      tmp = url.replace(eval(tmp), replaceText);
      return tmp;
    } else {
      if (url.match("[?]")) {
        return url + "&" + replaceText;
      } else {
        return url + "?" + replaceText;
      }
    }
    return url + "\n" + arg + "\n" + arg_val;
  };
  /**
   * 变更当前URL中的参数,并改变 history里的记录值
   * @param {key} key值
   * @param {val} Val 值
   */
  $.replaceURL = function (key, val) {
    let oURL = window.location.href;
    let nURL = $.changeURLArg(oURL, key, val);
    window.history.replaceState(null, null, nURL);
  };

  /**
   * 频率控制 返回函数连续调用时，func 执行频率限定为 次 / wait
   * 节流
   * @param  {function}   func      传入函数
   * @param  {number}     wait      表示时间窗口的间隔
   * @param  {object}     options   如果想忽略开始边界上的调用，传入{leading: false}。
   *                                如果想忽略结尾边界上的调用，传入{trailing: false}
   * @return {function}             返回客户调用函数
   *
   */
  $.throttleA = function (func, wait, options) {
    var context, args, result;
    var timeout = null;
    // 上次执行时间点
    var previous = 0;
    if (!options) options = {};
    // 延迟执行函数
    var later = function () {
      // 若设定了开始边界不执行选项，上次执行时间始终为0
      previous = options.leading === false ? 0 : new Date().getTime();
      timeout = null;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    };
    return function () {
      var now = new Date().getTime();
      // 首次执行时，如果设定了开始边界不执行选项，将上次执行时间设定为当前时间。
      if (!previous && options.leading === false) previous = now;
      // 延迟执行时间间隔
      var remaining = wait - (now - previous);
      context = this;
      args = arguments;
      // 延迟时间间隔remaining小于等于0，表示上次执行至此所间隔时间已经超过一个时间窗口
      // remaining大于时间窗口wait，表示客户端系统时间被调整过
      if (remaining <= 0 || remaining > wait) {
        clearTimeout(timeout);
        timeout = null;
        previous = now;
        result = func.apply(context, args);
        if (!timeout) context = args = null;
        //如果延迟执行不存在，且没有设定结尾边界不执行选项
      } else if (!timeout && options.trailing !== false) {
        timeout = setTimeout(later, remaining);
      }
      return result;
    };
  };

  /**
   * 空闲控制 返回函数连续调用时，空闲时间必须大于或等于 wait，func 才会执行
   * 防抖动
   *
   * @param  {function} func        传入函数
   * @param  {number}   wait        表示时间窗口的间隔
   * @param  {boolean}  immediate   设置为ture时，调用触发于开始边界而不是结束边界
   * @return {function}             返回客户调用函数
   */
  $.debounce = function (func, wait, immediate) {
    var timeout, args, context, timestamp, result;

    var later = function () {
      // 据上一次触发时间间隔
      var last = new Date().getTime() - timestamp;

      // 上次被包装函数被调用时间间隔last小于设定时间间隔wait
      if (last < wait && last > 0) {
        timeout = setTimeout(later, wait - last);
      } else {
        timeout = null;
        // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
        if (!immediate) {
          result = func.apply(context, args);
          if (!timeout) context = args = null;
        }
      }
    };

    return function () {
      context = this;
      args = arguments;
      timestamp = new Date().getTime();
      var callNow = immediate && !timeout;
      // 如果延时不存在，重新设定延时
      if (!timeout) timeout = setTimeout(later, wait);
      if (callNow) {
        result = func.apply(context, args);
        context = args = null;
      }

      return result;
    };
  };

  /**
   *   MDZ 版  频率控制 
   * @param {*} type 
   * @param {*} name 
   * @param {*} obj 
   
  * @example
   *  throttle("resize", "optimizedResize");
   *  window.addEventListener("optimizedResize", function() {
        console.log("Resource conscious resize callback!");
      });
   */
  $.throttle = function (type, name, obj) {
    obj = obj || window;
    var running = false;
    var func = function () {
      if (running) {
        return;
      }
      running = true;
      requestAnimationFrame(function () {
        obj.dispatchEvent(new CustomEvent(name));
        running = false;
      });
    };
    obj.addEventListener(type, func);
  };

  /**
   *  生成随机整数
   * @param {*} min 
   * @param {*} max 
   */
  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);

  }
  /**
   * 打乱数组顺序， 洗牌算法
   * 
   * @param {*} arr  初始的数组
   * @returns _arr   打乱后的数组
   */
  $.shuffle = function (arr) {

    let _arr = arr.slice();        //深拷贝数组
    for (let i = 0; i < _arr.length; i++) {
      let j = getRandomInt(0, i);
      let t = _arr[i];
      _arr[i] = _arr[j];
      _arr[j] = t;
    }

    return _arr;

  }


  /**
  * 监听出错文件JS
  *
  * @param {any} errMsg
  * @param {any} scriptURI
  * @param {any} lineNumber
  * @param {any} columnNumber
  * @param {any} errorObj
  */
  w.onerror = function (errMsg, scriptURI, lineNumber, columnNumber, errorObj) {
    setTimeout(function () {
      var rst = {
        "错误信息：": errMsg,
        "出错文件：": scriptURI,
        "出错行号：": lineNumber,
        "出错列号：": columnNumber,
        "错误详情：": errorObj
      };

      console.log(JSON.stringify(rst, null, 10));
    });
  };


})(jQuery, window, document);
