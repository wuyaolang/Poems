class Tools {
  //生成从minNum到maxNum的随机数(包含上限)
  public static randomNum(minNum, maxNum, _float?: false) {
    if (_float) {
      return Math.random() * (maxNum - minNum + 1) + minNum;
    }
    return Math.floor(Math.random() * (maxNum - minNum + 1) + minNum);
  }

  //从数组arr内获取随机1个元素(可重复)
  public static getRandomElement(arr) {
    let num = arr.length;
    if (num > 0) {
      let i = Math.floor(Math.random() * num);
      if (i == num) i = num - 1;
      return arr[i];
    } else return null;
  }

  //获取数组arr内随机amount个元素且不会重复(返回对象新增了所有随机元素的下标数组)
  public static getRandomAmountElementUnRepeat(arr, amount) {
    let arrLength = arr.length;
    if (amount >= arrLength) {
      let desArr = {
        nodeArr: arr,
        indexArr: [],
      };
      for (let i = 0; i < arr.length; i++) {
        desArr.indexArr.push(i);
      }
      return desArr;
    } else if (amount <= 0) {
      return null;
    } else {
      //这里对于此项目做了特化处理
      let desArr = {
        nodeArr: [],
        indexArr: [],
      };
      let tempArr = [];
      let temp = null;
      for (let i = 0; i < amount; i++) {
        do {
          temp = Math.floor(Math.random() * arrLength);
        } while (tempArr.indexOf(temp) > -1);
        tempArr.push(temp);
        desArr.nodeArr.push(arr[temp]);
        desArr.indexArr.push(temp);
      }
      return desArr;
    }
  }

  /**
   * 任意元素在数组内的下标
   * @param {*数组} _arr
   * @param {*元素} _obj
   */
  public static getIndex(_arr, _obj) {
    let len = _arr.length;
    for (let i = 0; i < len; i++) {
      if (_arr[i] == _obj) {
        return i;
      }
    }
    return -1;
  }

  public static removeArray(_arr, _obj) {
    let length = _arr.length;
    for (let i = 0; i < length; i++) {
      if (_arr[i] == _obj) {
        if (i == 0) {
          _arr.shift(); //删除并返回数组的第一个元素
          return _arr;
        } else if (i == length - 1) {
          _arr.pop(); //删除并返回数组的最后一个元素
          return _arr;
        } else {
          _arr.splice(i, 1); //删除下标为i的元素
          return _arr;
        }
      }
    }
  }

  /// <summary>
  /// 在圆心为point，半径为radius的圆内，产生一个半径为radius_inner的圆的圆心
  /// </summary>
  /// <param name="point">外圆圆心</param>
  /// <param name="radius_outer">外圆半径</param>
  /// <param name="radius_inner">内圆半径</param>
  /// <returns>内圆圆心</returns>
  public static pointOfRandom(point, radius_outer, radius_inner) {
    let x = Tools.randomNum(
      Math.floor(point.x - (radius_outer - radius_inner)),
      Math.floor(point.x + (radius_outer - radius_inner))
    );
    let y = Tools.randomNum(
      Math.floor(point.y - (radius_outer - radius_inner)),
      Math.floor(point.y + (radius_outer - radius_inner))
    );

    while (
      !this.isInRegion(x - point.x, y - point.y, radius_outer - radius_inner)
    ) {
      x = Tools.randomNum(
        Math.floor(point.x - (radius_outer - radius_inner)),
        Math.floor(point.x + (radius_outer - radius_inner))
      );
      y = Tools.randomNum(
        Math.floor(point.y - (radius_outer - radius_inner)),
        Math.floor(point.y + (radius_outer - radius_inner))
      );
    }

    let p = cc.v2(x, y);
    return p;
  }
  /// <param name="x_off">与大圆圆心的x方向偏移量</param>
  /// <param name="y_off">与大圆圆心的y方向偏移量</param>
  /// <param name="distance">大圆与小圆半径的差</param>
  /// <returns>判断点是否在范围内</returns>
  public static isInRegion(x_off, y_off, distance) {
    if (x_off * x_off + y_off * y_off <= distance * distance) {
      return true;
    }
    return false;
  }
  /// <summary>
  /// 判断两个圆是否重合，或者是相内切
  /// </summary>
  /// <param name="p_outer">外圆圆心</param>
  /// <param name="r_outer">外圆半径</param>
  /// <param name="p_inner">内圆圆心</param>
  /// <param name="r_inner">内圆半径</param>
  /// <returns>是否相内切</returns>
  public static isIntersect(p_outer, r_outer, p_inner, r_inner) {
    //判定条件：两圆心的距离 + r_inner = r_outer
    let distance = Math.sqrt(
      (p_outer.x - p_inner.x) * (p_outer.x - p_inner.x) +
      (p_outer.y - p_inner.y) * (p_outer.y - p_inner.y)
    );
    if (distance + r_inner >= r_outer) {
      return true;
    }
    return false;
  }
  /**
   * 用于打乱数组内元素
   */
  public static randArr(arr) {
    let len = arr.length;
    //首先从最大的数开始遍历，之后递减
    for (let i = arr.length - 1; i >= 0; i--) {
      //随机索引值randomIndex是从0-arr.length中随机抽取的
      let randomIndex = Math.floor(Math.random() * (i + 1));
      //下面三句相当于把从数组中随机抽取到的值与当前遍历的值互换位置
      let itemIndex = arr[randomIndex];
      arr[randomIndex] = arr[i];
      arr[i] = itemIndex;
    }
    //每一次的遍历都相当于把从数组中随机抽取（不重复）的一个元素放到数组的最后面（索引顺序为：len-1,len-2,len-3......0）
    return arr;
  }

  public static shakeOnce(target, callback = null) {
    let x = target.x;
    let y = target.y;
    let offset = 1;
    let action = cc.repeatForever(
      cc.sequence(
        cc.moveTo(0.018, cc.v2(x + (5 + offset), y + (offset + 7))),
        cc.moveTo(0.018, cc.v2(x - (6 + offset), y + (offset + 7))),
        cc.moveTo(0.018, cc.v2(x - (13 + offset), y + (offset + 3))),
        cc.moveTo(0.018, cc.v2(x + (3 + offset), y - (6 + offset))),
        cc.moveTo(0.018, cc.v2(x - (5 + offset), y + (offset + 5))),
        cc.moveTo(0.018, cc.v2(x + (2 + offset), y - (8 + offset))),
        cc.moveTo(0.018, cc.v2(x - (8 + offset), y - (10 + offset))),
        cc.moveTo(0.018, cc.v2(x + (3 + offset), y + (offset + 10))),
        cc.moveTo(0.018, cc.v2(x + (0 + offset), y + (offset + 0)))
      )
    );
    target.runAction(action);
    setTimeout(() => {
      target.stopAction(action);
      target.x = x;
      target.y = y;
      if (callback) callback();
    }, 300);
  }

  public static shackY(target, callback = null) {
    let x = target.x;
    target.runAction(cc.sequence(
      cc.moveTo(0.05, cc.v2(x, 10)),
      cc.moveTo(0.05, cc.v2(x, -10)),
      cc.moveTo(0.05, cc.v2(x, 5)),
      cc.moveTo(0.05, cc.v2(x, -5)),
      cc.moveTo(0.05, cc.v2(x, 2)),
      cc.moveTo(0.05, cc.v2(x, -2)), cc.moveTo(0.05, cc.v2(x, 0)),
      cc.callFunc(() => {
        if (callback) {
          callback();
        }
      }), null));
  }

  public static shackX(target, callback = null) {
    let y = target.y;
    target.runAction(cc.sequence(
      cc.moveTo(0.05, cc.v2(18, y)),
      cc.moveTo(0.05, cc.v2(-18, y)),
      cc.moveTo(0.05, cc.v2(10, y)),
      cc.moveTo(0.05, cc.v2(-10, y)),
      cc.moveTo(0.05, cc.v2(5, y)),
      cc.moveTo(0.05, cc.v2(-5, y)), cc.moveTo(0.05, cc.v2(0, y)),
      cc.callFunc(() => {
        if (callback) {
          callback();
        }
      }), null));
  }

  public static scaleUpAndDowm(target, isShining?, light?) {
    target.runAction(
      cc.repeatForever(
        cc.sequence(
          cc.scaleTo(0.3, 1.1).easing(cc.easeIn(2)),
          cc.scaleTo(0.6, 0.9).easing(cc.easeIn(2)),
          cc.scaleTo(0.6, 1.1).easing(cc.easeIn(2)),
          cc.scaleTo(0.6, 0.9).easing(cc.easeIn(2))
        )
      )
    );
    if (isShining) {
      light.runAction(
        cc.repeatForever(
          cc.sequence(
            cc.fadeIn(0.3).easing(cc.easeIn(2)),
            cc.fadeOut(0.6).easing(cc.easeIn(2)),
            cc.fadeIn(0.6).easing(cc.easeIn(2)),
            cc.fadeOut(0.6).easing(cc.easeIn(2))
          )
        )
      );
    }
  }
  public static shake(target) {
    target.runAction(
      cc.repeatForever(
        cc.sequence(
          cc.rotateTo(0.1, 5).easing(cc.easeIn(2)),
          cc.rotateTo(0.2, -5).easing(cc.easeIn(2)),
          cc.rotateTo(0.2, 5).easing(cc.easeIn(2)),
          cc.rotateTo(0.1, 0).easing(cc.easeIn(2)),
          cc.delayTime(0.5)
        )
      )
    );
  }

  // 将文件转化为base64
  public static fileToBase64(file) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      console.log(e.target.result);
      return e.target.result
    };
  }

  // 本地时间戳->2018/8/8
  public static toDateFormat() {
    let date = new Date();
    date = new Date(date.getTime());
    return {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
    };
  }

  // 秒->08:08:08
  public static toTimeString(s) {
    if (s <= 0) {
      return "00:00";
    }
    s = Math.floor(s);
    let hour = Math.floor(s / (60 * 60));
    s -= hour * (60 * 60);
    let minute = Math.floor(s / 60);
    s -= minute * 60;
    let ret = "";
    if (minute > 0) {
      ret += minute < 10 ? "0" + minute : minute;
    } else {
      ret += "00";
    }
    ret += ":";
    if (s > 0) {
      ret += s < 10 ? "0" + s : s;
    } else {
      ret += "00";
    }
    return ret;
  }

  public static addNegativeCaculation(isNegative, num, rate, strName) {
    return isNegative
      ? "-" + this.calculation(num, rate, strName)
      : this.calculation(num, rate, strName);
  }

  // calculation number
  public static calculation(num, rate, strName) {
    let n1 = Math.floor(num / rate);
    let n2 = Math.floor(((num % rate) / rate) * 10);
    if (n2 === 0) {
      return n1 + strName;
    } else {
      return n1 + "." + n2 + strName;
    }
  }

  public static toInt(num) {
    return Math.floor(num);
  }

  /**
   * @param num 
   * @param floatpoint 默认小数点后面一位。
   */
  public static toFloat(num, floatpoint: number = 1) {
    return num.toFixed(floatpoint);
  }

  public static toString(num) {
    return String(num);
  }

  public static getScreenHeightRate() {
    let rate = cc.view.getFrameSize().width / 720.0;
    return rate;
  }

  public static labelScrollToFinal(labelComp: cc.Label, finalNum, interval: number = 0.02) {
    let currentNum = Number(labelComp.string);
    let dis = Number(finalNum) - currentNum;
    let func = () => {
      if (currentNum == finalNum) {
        labelComp.unschedule(func);
        return;
      }
      if (dis >= 0) {
        currentNum += 1;
      } else {
        currentNum -= 1;
      }
      labelComp.string = String(currentNum);
    };
    labelComp.schedule(func, interval, cc.macro.REPEAT_FOREVER, interval);
  }

  /**
   * 随机生成一个32位字符串
   */
  public static getRandomStr32() {
    let arr = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"],
      num = "";
    for (let i = 0; i < 32; i++) {
      num += arr[Math.floor(Math.random() * 36)];
    }
    return num;
  }

  /**
   * 字符串换行（每两个字符之间加一个\n）
   * @param str 
   */
  public static strLineFeed(str) {
    let usedStr = "";
    for (let i = 0; i < str.length; i++) {
      let char_ = str[i];
      usedStr += char_;
      if (i < str.length - 1) {
        usedStr += "\n";
      }
    }
    return usedStr;
  }
  
  /**
   * 获取合集图片矩形信息：
   * @param str 
   * @returns 
   */
  public static getFrameData(str) {
    // 13是这个rect结构至少要有的字符串长度，例如{{1000,389},{1022,768}}
    if (str.length < 13) {
      console.log("---解析plist的frame rect，数据错误-----");
      return null;
    }
    let newStr: string = str;
    newStr = newStr.slice(2);
    newStr = newStr.slice(0, newStr.length - 2);
    let newList_0: string[] = newStr.split('},{');
    let newList_1: string[] = newList_0[0].split(",");
    let newList_2: string[] = newList_0[1].split(",");
    if (newList_1.length < 2 || newList_2.length < 2) {
      console.log("---解析plist的frame rect，字符串数据错误-----");
      return null;
    }
    return cc.rect(parseInt(newList_1[0]), parseInt(newList_1[1]), parseInt(newList_2[0]), parseInt(newList_2[1]));
  }

  /**
   * 获取合计图片原始尺寸大小：
   * @param str 
   * @returns 
   */
  public static getSizeData(str) {
    // 5是这个size结构至少要有的字符串长度，例如{64,60}
    if (str.length < 5) {
      console.log("---解析plist的size，数据错误-----");
      return null;
    }
    let newStr: string = str;
    newStr = newStr.slice(1);
    newStr = newStr.slice(0, newStr.length - 1);
    let newList_0: string[] = newStr.split(',');
    if (newList_0.length < 2) {
      console.log("---解析plist的size，字符串数据错误-----");
      return null;
    }
    return cc.size(parseInt(newList_0[0]), parseInt(newList_0[1]));
  }

  /**
   * 获取图片和图时的裁剪偏移量：
   * @param str 
   * @returns 
   */
  public static getOffsetData(str) {
    // 5是这个offset结构至少要有的字符串长度，例如{22,-24}
    if (str.length < 5) {
      console.log("---解析plist的offset，数据错误-----");
      return null;
    }
    let newStr: string = str;
    newStr = newStr.slice(1);
    newStr = newStr.slice(0, newStr.length - 1);
    let newList_0: string[] = newStr.split(',');
    if (newList_0.length < 2) {
      console.log("---解析plist的offset，字符串数据错误-----");
      return null;
    }
    return cc.v2(parseInt(newList_0[0]), parseInt(newList_0[1]));
  }

  /**
   * 根据合集里某一个图片的名称获取图片纹理：
   * @param str 
   * @param plistData 
   * @param pngData 
   */
  public static getSpriteFrame(str, plistData, pngData) {
    // 碎图的文件名+后缀
    // 获取.plist文件中关于此图的图片信息
    let frameDataObj: any = plistData.frames[str];
    // 图片矩形信息
    let rect: cc.Rect = Tools.getFrameData(frameDataObj.frame);
    // 图片的原始大小
    let size: cc.Size = Tools.getSizeData(frameDataObj.sourceSize);
    // 图片合图时的裁剪偏移
    let offset: cc.Vec2 = Tools.getOffsetData(frameDataObj.offset);
    // 创建此图的精灵帧
    let newFrame: cc.SpriteFrame = new cc.SpriteFrame();
    newFrame.setTexture(pngData, rect, frameDataObj.rotated, offset, size);
    return newFrame;
  }
}
(<any>window).Tools = Tools;
