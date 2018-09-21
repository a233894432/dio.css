/**
 * 拼图游戏的 组件及常用方法
 * @desc 一些公共方法
 * Created Dio 2018年8月29日19:39:3
 */
let anime = require("anime")
var DOC = document;
/**
 * get element
 * @param  {[type]} ele [description]
 * @return {[type]}     [description]
 */
function getEle(ele) {
  return DOC.querySelector(ele);
}
/**
 * [getEleAll description]
 * @param  {[type]} ele [description]
 * @return {[type]}     [description]
 */
function getEleAll(ele) {
  return DOC.querySelectorAll(ele);
}
/**
 * @type {Object} console.log
*/
const logger = {
  error(msg) {
    console.log("msg", msg);
  },
  log(msg) {
    console.log("msg", msg);
  }
};

/* Drag Drop Event handlers */

function onDragStart(e) {
  e.dataTransfer.setData("text/elm-id", e.currentTarget.id);
  // DO NOT use "text/plain" channel, FF will treat it as url and page is redirected.
  e.currentTarget.classList.add("dragging");
}

function onDragOver(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = "move";
}

function hasClass(elements, cName) {
  return !!elements.className.match(new RegExp("(\\s|^)" + cName + "(\\s|$)"));
};
function addClass(elements, cName) {
  if (!hasClass(elements, cName)) {
    elements.className += " " + cName;
  };
};
function removeClass(elements, cName) {

  if (hasClass(elements, cName)) {
    elements.className = elements.className.replace(new RegExp("(\\s|^)" + cName + "(\\s|$)"), " ");
  };
};

// onclick element
var oldElement;
function doClick(e) {


  e.target.classList.add('onActive')
  e.target.classList.add('ripple')

  if (oldElement != e.target.id && oldElement) {
    const elementA = document.getElementById(oldElement);
    const elementB = e.target;
    oldElement = null;
    addClass(elementB, 'ripple')
    if (pgControl.isMove) {
      moveElements(elementA, elementB);
    } else {
      swapPuzzleElements(elementA, elementB);
    }
    setTimeout(function () {
      removeClass(elementA, 'onActive ripple');
      removeClass(elementB, 'onActive ripple');
    }, 300)

    // elementA.classList.remove("dragging");

    if (pgControl.isSolved(pgControl.puzzlieContainer)) {
      logger.log("Solved");
      onSolved();
    }

  } else {

    oldElement = e.target.id;
  }
}

function swapPuzzleElements(elementA, elementB) {
  const containerA = elementA.parentNode;
  const containerB = elementB.parentNode;

  // 修复 错点 的情况
  if (containerB.className != 'dropCol') {
    return false
  }

  containerB.appendChild(elementA);
  containerA.appendChild(elementB);

  // fix 记录当前操作的步骤
  let steplocus = elementA.dataset.puzzleId + 'x' + elementB.dataset.puzzleId;


  stepNum++
  pgControl.callbackStep(stepNum, steplocus);
}

/**
 * 移动交换 element
 * @param  {[type]} elA [description]
 * @param  {[type]} elB [description]
 * @return {[type]}     [description]
 */
function moveElements(elA, elB) {

  console.log(elA.parentNode.offsetLeft + "  " + elA.parentNode.offsetTop);

  console.log(elB.parentNode.offsetLeft + "  " + elB.parentNode.offsetTop);
  let originAx = elA.parentNode.offsetLeft;
  let originAy = elA.parentNode.offsetTop;
  let originBx = elB.parentNode.offsetLeft;
  let originBy = elB.parentNode.offsetTop;

  let Amovex, Amovey, Bmovex, Bmovey;

  if (originAx < originBx) {
    Amovex = Math.abs(originBx - originAx);
    Bmovex = - Math.abs(originBx - originAx);
  } else {
    Amovex = - Math.abs(originAx - originBx);
    Bmovex = Math.abs(originAx - originBx);
  }

  if (originAy < originBy) {
    Amovey = -Math.abs(originBy - originAy);
    Bmovey = Math.abs(originBy - originAy);
  } else {

    Amovey = Math.abs(originAy - originBy);
    Bmovey = -Math.abs(originAy - originBy);

  }


  // 正向切换
  // move elA
  anime({
    targets: elA.parentNode,
    translateX: Amovex,
    translateY: Amovey,
    complete: function (anim) {

      // elA.parentNode.offsetLeft = originBx;
      // elA.parentNode.offsetTop = originBy;
      console.log(elA.parentNode.offsetLeft);
    }
  })
  // // move elB
  anime({
    targets: elB.parentNode,
    translateX: Bmovex,
    translateY: Bmovey
  })

  // ------


}

// function onDrop (e) {
//   const elementIdAttribute = e.dataTransfer.getData("text/elm-id");
//   const elementA = document.getElementById(elementIdAttribute);
//   const elementB = e.currentTarget.querySelector(".puzzle");
//   puzzlieGame.swapPuzzleElements(elementA, elementB);
//   elementA.classList.remove("dragging");
//   if (puzzlieGame.isSolved(puzzlieGame.puzzlieContainer)) {
//     logger.log("Solved");
//     onSolved();
//   }
// }
/**
 * 数组打乱排序方法
 * @param  {[type]} array [description]
 * @return {[type]}       [description]
 */
function shuffle(array) {
  var copy = [],
    n = array.length,
    i;
  while (n) {
    i = Math.floor(Math.random() * n--);
    copy.push(array.splice(i, 1)[0]);
  }
  return copy;
}
/* interesting moments */
function onSolved() {
  pgControl.puzzlieContainer.style.animation = null;
  pgControl.puzzlieContainer.offsetHeight;
  pgControl.puzzlieContainer.style.animation = 'solved 1s forwards';
  pgControl.callbackFun(stepNum, new Date().getTime(), pgControl.puzzleElementArray);
}
var pgControl;
// 默认步骤
var stepNum = 0;
/**
 * 对外包一层
 * @param  {[type]} options [description]
 * @return {[type]}         [description]
 */
var theGame = function (options) {
  pgControl = new puzzlieGame(options)
  this.startTime = new Date().getTime();
}

/**
 * puzzlie game 拼图游戏Game
 * @param  {[type]} options [description]
 * @return {[type]}         [description]
 */
function puzzlieGame(options) {
  this.options = options;
  this.options.DEFAULT_IMAGE_SOURCE = options.imagesUrl;
  // demo
  // this.options.LEVEL_MAP={
  //   "easy": [3, 3],
  //   "normal": [5, 5],
  //   "hard": [7, 7],
  //   "extreme": [11, 11],
  //   "god": [20, 20],
  //   "wow": [31, 31],
  //   "holy": [45, 45]
  // }
  this.options.LEVEL_MAP = options.level;
  this.puzzlieContainer = getEle(options.containerID);

  // console.log(this);
  const [rows, cols] = this.options.LEVEL_MAP;
  this.rows = rows;
  this.cols = cols;
  this.minwidth = getEle(options.containerID).clientWidth / cols;
  this.minheight = getEle(options.containerID).clientHeight / rows;
  this.callbackFun = options.callbackFun;
  this.callbackStep = options.callbackStep;
  this.isMove = options.isMove;
  this.build(this.puzzlieContainer, rows, cols, this.options.DEFAULT_IMAGE_SOURCE);

  this.puzzleElementArray = []

}

puzzlieGame.prototype = {
  /**
   * [description]
   * @return {[type]} [description]
   */
  build: function (container, rows, cols, imageSource) {
    container.innerHTML = '';
    // disableAllControls();
    const image = new Image();
    image.addEventListener("load", e => {
      this.initialDropZoneContainer(container, rows, cols, e.target);
      // enableAllControls();
      logger.log("Solving");
    });
    image.addEventListener("error", e => {
      logger.error(`Failed to load image ${e.target.src}`);
      // enableAllControls(); // anyway
    });
    image.src = imageSource;
  },
  /*
   Setup drop zone container
    1- deploy container element
    2- create drop zone elements and append to container
    3- create puzzle elements and append drop zone elements
    4- shuffle puzzle elements
  */
  initialDropZoneContainer: function (container, rows, cols, image) {
    // 1 (container grid layout)
    container.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
    container.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;

    // 1 (container dimensions)
    if (image.width > image.height) {
      const containerWidth = Number.parseFloat(getComputedStyle(container).width, 10);
      const containerHeight = containerWidth * image.height / image.width;
      container.style.height = `${containerHeight}px`;
    } else {
      const containerHeight = Number.parseFloat(getComputedStyle(container).height, 10);
      const containerWidth = containerHeight * image.width / image.height;
      container.style.width = `${containerWidth}px`;
    }



    // 2
    const puzzleElementList = [];
    const dropZoneElements = this.createDropZoneElements(rows * cols, rows, cols);
    for (const el of dropZoneElements) {
      for (let n = 0; n < el.children.length; ++n) {
        puzzleElementList.push(el.children[n])
      }
      container.appendChild(el);
    }
    // 3
    const puzzleElements = this.createPuzzleElements(rows, cols, image);
    for (const [i, el] of puzzleElements.entries()) {
      // dropZoneElements[i].appendChild(el);

      puzzleElementList[i].appendChild(el);
    }

    // 4
    this.shufflePuzzleElements(container);
  },
  /**
   * create Puzzle Elements
   * @return {[type]} [description]
   */
  createPuzzleElements: function (rows, cols, image) {
    const elements = [];
    for (let y = 0; y < rows; ++y) {
      for (let x = 0; x < cols; ++x) {
        const el = document.createElement("div");
        const i = cols * y + x;
        el.draggable = true;
        el.addEventListener("dragstart", onDragStart);
        el.id = `puzzle-${i}`;
        el.dataset.puzzleId = i;
        el.classList.add("puzzle");
        // debug only
        // el.textContent = i;

        el.style.backgroundImage = `url(${image.src})`;
        el.style.backgroundSize = `${cols * 100}% ${rows * 100}%`;
        el.style.backgroundPosition = `${x / (cols - 1) * 100}% ${y / (rows - 1) * 100}%`;
        elements.push(el);
      }
    }
    return elements;
  },
  /**
   * create Drop Zone Elements
   * @param  {[type]} n [description]
   * @return {[type]}   [description]
   */
  createDropZoneElements: function (n, rows, cols) {
    const elements = [];
    // for (let i = 0; i < n; ++i) {
    //   const el = document.createElement("div");
    //   el.addEventListener("dragover", onDragOver);
    //   el.addEventListener("drop", onDrop);
    //   el.dataset.dropZoneId = i;
    //   el.classList.add("dropzone");
    //   // el.style.cssText = 'background:url(./img/bg.jpg) no-repeat -' + (i % this.col) * this.minwidth + 'px -' + Math.floor((i) / this.col) * this.minheight + 'px;float:left;height:' + this.minheight + 'px;width:' + this.minwidth +
    //   //   'px;';
    //     // el.style.cssText =`background:url(${this.DEFAULT_IMAGE_SOURCE}) no-repeat`
    //   // el.textContent = i; // debug only
    //   elements.push(el);
    // }
    for (let y = 0; y < rows; ++y) {
      const rel = document.createElement("div");
      rel.dataset.rowsId = y;
      rel.classList.add("dropzone");
      for (let x = 0; x < cols; ++x) {
        const cel = document.createElement("div");
        cel.dataset.colsId = x;
        cel.classList.add('dropCol');
        cel.addEventListener("click", doClick);
        // cel.textContent = y+1+x+1;
        rel.appendChild(cel);
      }
      elements.push(rel)
    }
    return elements;
  },
  /**
   * shuffle Puzzle Elements
   * @param  {[type]} container [description]
   * @return {[type]}           [description]
   */
  shufflePuzzleElements: function (container) {
    const puzzleElements = container.querySelectorAll(".puzzle");
    // 增加乱序
    // const puzzleElementsB = shuffle(puzzleElements);
    for (let i = puzzleElements.length; i > 0; --i) {
      const index = Math.floor(Math.random() * i);
      this.swapPuzzleElements(puzzleElements[index], puzzleElements[i - 1]);
    }

    // 打乱后的顺序 
    const dropzoneElements = container.querySelectorAll(".dropCol");
    for (let j = 0; j < dropzoneElements.length; ++j) {
      const puzzleElement = dropzoneElements[j].querySelector(".puzzle");
      // console.log();
      this.puzzleElementArray.push(puzzleElement.dataset.puzzleId)
    }

  },
  /**
   *     Is solved
   * @param  {[type]} container [description]
   * @return {[type]}           [description]
   */
  isSolved: function (container) {
    const dropzoneElements = container.querySelectorAll(".dropCol");
    // console.log(Object.entries(dropzoneElements));
    for (let j = 0; j < dropzoneElements.length; ++j) {
      const puzzleElement = dropzoneElements[j].querySelector(".puzzle");
      if (Number(puzzleElement.dataset.puzzleId) !== j) {
        return false;
      }
    }

    // for (const [i, el] of dropzoneElements.entries()) {
    //   const puzzleElement = el.querySelector(".puzzle");
    //   if (Number(puzzleElement.dataset.puzzleId) !== i){
    //     return false;
    //   }
    // }
    return true;
  },
  /*
  Swap puzzle elements
  */
  swapPuzzleElements: function (elementA, elementB) {
    const containerA = elementA.parentNode;
    const containerB = elementB.parentNode;
    containerB.appendChild(elementA);
    containerA.appendChild(elementB);
  },
  /**
   * 添加事件
   * @param  {[type]} obj       [description]
   * @param  {[type]} eventType [description]
   * @param  {[type]} func      [description]
   * @return {[type]}           [description]
   */
  addEvent: function (obj, eventType, func) {
    if (obj.attachEvent) {
      obj.attachEvent('on' + eventType, func);
    } else {
      obj.addEventListener(eventType, func, false);
    }
  },
  /**
   * 移除事件
   * @param  {[type]} obj       [description]
   * @param  {[type]} eventType [description]
   * @param  {[type]} func      [description]
   * @return {[type]}           [description]
   */
  removeEvent: function (obj, eventType, func) {
    if (obj.detachEvent) {
      obj.detachEvent('on' + eventType, func);
    } else {
      obj.removeEventListener(eventType, func, false);
    }
  }

};
module.exports = theGame;
