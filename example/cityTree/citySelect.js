/**
 * 城市选择插件
 * 
 * Created by diogo on 2017年11月20日15:54:03
 */
"use strict";
define(["jquery"], function ($) {
  var treedata, cityArray, cityO;

  //   创建树
  function creatTree(data, parent) {
    var array = [],
      temp;
    for (var i = 0, l = data.length; i < l; i++) {
      if (data[i].pId == parent) {
        data[i] = {
          id: data[i].id.toString(),
          text: data[i].name.toString(),
          value: data[i].id.toString() + "|" + data[i].pId.toString(),
          showcheck: true,
          complete: true,
          isexpand: false,
          checkstate: 0,
          hasChildren: true,
          ChildNodes: new Array()
        };

        array.push(data[i]);
        temp = creatTree(data, data[i].id);
        if (temp.length > 0) {
          data[i].ChildNodes = temp;
        } else {
          data[i].hasChildren = false;
        }
      }
    }
    return array;
  }

  //递归选中
  function doCheck(items, c, fn) {
    for (var i = 0, l = items.length; i < l; i++) {
      if (items[i].id == c.provinceId) {
        fn(items[i], 2);
      }
      items[i].id == c.cityId && items[i].checkstate != 1 && fn(items[i], 1);

      if (items[i].ChildNodes != null && items[i].ChildNodes.length > 0) {
        doCheck(items[i].ChildNodes, c, fn);
      }
    }
  }


  /**
   * 递归父级状态
   * @param {*} items 总数组
   * @param {*} c  需要递归的数据
   * @param {*} fn 方法
   */
  function recursion(items, c, fn) {
    for (var i = 0; i < items.length; i++) {
      if (items[i].id == c.cityId) {
        fn(items[i], 2);
      }

      if (items[i].ChildNodes != null && items[i].ChildNodes.length > 0) {
        recursion(items[i].ChildNodes, c, fn);
      }
    }
  }


  // 验证子菜单是否已经被选中,如果全部都已经选 中则 父级改变 状态
  function treeCheck(eitem, type) {
    if (eitem.ChildNodes != null && eitem.ChildNodes.length > 0) {
      // console.log(eitem.ChildNodes.length);
      eitem.checkstate = 1;

      $.each(eitem.ChildNodes, function (index, ie) {
        if (ie.checkstate == 2) {
          eitem.checkstate = 2;
          return false;
        }
        return true;
      });
    }
  }


  var cSelect = (function () {
    // console.log("object");
    return {
      // 项目初始化.
      init: function () {
        console.log("init");
      },
      /**
       * @param {{eid}}  活动ID
       * @param {{dom}}  DOM  id
       * @param {{url}}  请求 地址的 URL
       */
      getCitys: function (eid, dom, url) {
        var temp = "?_=" + new Date().getTime();
        var url = url + temp;
        $.post(
          url,
          null,
          function (data) {
            if (data.code == "200") {
              //                  	debugger
              cityArray = creatTree(data.data, 0);
              cityO = {
                showcheck: true,
                data: cityArray
              };

              cityArray[0].isexpand = true;
              $(dom).treeview(cityO);
              // if (id) {
              //   getIsCitys(id);
              // }
            } else {
              alert(data.msg);
            }
          },
          "json"
        );
      }
    };
  })();

  return cSelect;
});
