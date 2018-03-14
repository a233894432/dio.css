
/**
 *@desc 初始化城市数据 
 * 
 */
var treedata;

function initCityDate(id) {
    getCitys(id);
}


var cityArray, cityO;
function getCitys(id) {
    var temp = "?_=" + (new Date()).getTime();
    var url = projectUrl + "/app/configGenerally/queryCitysList.do" + temp;
    $.post(url, null,
        function (data) {
            if (data.code == '200') {
                //                  	debugger
                cityArray = creatTree(data.data, -1);
                cityO = {
                    showcheck: true,
                    data: cityArray
                };
                cityArray[0].isexpand = true;
                $('#cityTree').treeview(cityO);
                if (id) {
                    getIsCitys(id, "#cityTree", cityArray);
                }

            } else {
                alert(data.msg);
            }
        },
        'json');
}

//根据活动ID取已经选择了的 城市
function getIsCitys(id, dom, citys) {
    var temp = "?_=" + (new Date()).getTime();
    var url = projectUrl + "/market/activity/queryActivityAreaList.do" + temp;
    $.post(url, { activityId: id },
        function (data) {
            if (data.code == '200') {
                if (data.data.length != 0) {
                    reCreaTree(data.data, dom, citys);
                }
            } else {
                alert(data.msg);
            }
        }, 'json');

}



function reCreaTree(data, dom, citys) {

    // for (var i = 0; i < data.length; i++) {
    //     cityArray[0].checkstate = 2;
    //     cityArray[0].isexpand = true;
    //     doCheck(cityArray, data[i], function (item, type) {
    //         if (type == 1) {
    //             item.checkstate = 1;
    //         } else if (type == 2) {
    //             item.checkstate = 2;
    //             item.isexpand = true;
    //         }

    //     });

    // }


    // cityO = {
    //     showcheck: true,
    //     data: cityArray
    // };
    // $('#cityTree').treeview(cityO);

    // ----
    for (var i = 0; i < data.length; i++) {
        // 当全部城市都中的时候
        if (data[0].id == 1) {
            citys[0].checkstate = 1;
            citys[0].isexpand = true;
        } else {
            citys[0].checkstate = 2;
            citys[0].isexpand = true;
        }

        doCheck(citys, data[i], function (item, type) {
            if (type == 1) {
                item.checkstate = 1;
            } else if (type == 2) {
                item.checkstate = 2;
                item.isexpand = true;
                // treeCheck(item);
            }
        });
    }
    //

    for (var i = 0; i < data.length; i++) {
        recursion(citys, data[i], function (item, type) {
            // console.log(item);
            if (type == 2) {
                item.checkstate = 1;
            } else {
                treeCheck(item);
            }

            // item.checkstate = 1;
        });
    }

    // console.log(citys);

    var newCity = {
        showcheck: true,
        data: citys
    };
    $(dom).treeview(newCity);


}


//递归选中
function doCheck(items, c, fn) {
    for (var i = 0, l = items.length; i < l; i++) {
        if (items[i].id == c.provinceId) {
            fn(items[i], 2);
        }
        (items[i].id == c.cityId && items[i].checkstate != 1) && fn(items[i], 1);

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



function creatTree(data, parent) {
    var array = [],
        temp;
    for (var i = 0, l = data.length; i < l; i++) {
        if (data[i].pid == parent) {
            data[i] = {
                "id": data[i].id.toString(),
                "text": data[i].name.toString(),
                "value": data[i].id.toString() + "|" + data[i].pid.toString(),
                "showcheck": true,
                "complete": true,
                "isexpand": false,
                "checkstate": 0,
                "hasChildren": true,
                "ChildNodes": new Array()
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