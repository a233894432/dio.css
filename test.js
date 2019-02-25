if (null != bv.getNickName() && !"".equals(bv.getNickName())) {
    try {
        String checkIfEncode = bv.getNickName().toLowerCase();
        int p = checkIfEncode.indexOf("%");
        if (p != -1 && checkIfEncode.length() - p > 9) {
            checkIfEncode = checkIfEncode.substring(p, p + 9);
        }
        String sign = "";
        if (checkIfEncode.startsWith("%e"))
            for (int i = 0, p2 = 0; p2 != -1; i++) {
                p2 = checkIfEncode.indexOf("%", p2);
                if (p2 != -1) p2++;
                sign += p2;
            }
        if (sign.equals("147-1")) {
            bv.setNickName(URLDecoder.decode(bv.getNickName(), Constants.ENCODING_UTF8));
        }
    } catch (Exception e) {
        e.printStackTrace();
    }
}


String.prototype.startWith = function(str) {
    var reg = new RegExp("^" + str);
    return reg.test(this);
}

String.prototype.endWith = function(str) {
    var reg = new RegExp(str + "$");
    return reg.test(this);
}



var s = "%E5%94%AF%E9%98%B3";

function deCode(str) {
    var checkIfEncode = str.toLowerCase()
    var p = checkIfEncode.indexOf("%");
    if (p != -1 && checkIfEncode.length - p > 9) {
        checkIfEncode = checkIfEncode.substring(p, p + 9);
    }
    var sign = "";
    if (checkIfEncode.startsWith("%e")) {
        for (var i = 0, p2 = 0; p2 != -1; i++) {
            p2 = checkIfEncode.indexOf("%", p2);
            if (p2 != -1) p2++;
            sign += p2;
        }
    }

    // if (sign == "147-1") {

    // }


    console.log(decodeURI(s))
}

deCode(s)


console.log(decodeURI("%E5%94%AF%E9%98%B3"))