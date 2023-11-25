// 加载轮播图的图片
const li = document.querySelectorAll('.box ul li');
for (let i = 0; i < li.length; i++) {
  li[i].style.background = `url(./images/GirlFriend0${i + 1}.jpg) no-repeat center/cover`;
}

const ul = document.querySelector('.box ul');

// 跳转函数
function MoveImg(num) {
  ul.style.transition = 'all 0.8s';
  ul.style.transform = `translateX(${-num * li[0].offsetWidth}px)`;
}

const li_clone = li[0].cloneNode(true);
ul.appendChild(li_clone);

const prev = document.querySelector('.box .prev');
const next = document.querySelector('.box .next');

let num = 0;

// 移动到下一张
function nextImg(num) {
  num++;
  if (num > li.length) {
    num = 1;
    ul.style.transition = 'none';
    ul.style.transform = `translateX(0px)`;
    li[0].offsetWidth;//强制渲染
  }
  MoveImg(num);
  return num;
}

// 左按钮设置
next.addEventListener('click', function () {
  num = nextImg(num);
});

// 右按钮设置
prev.addEventListener('click', function () {
  num--;
  if (num < 0) {
    ul.style.transition = 'none';
    ul.style.transform = `translateX(${-li.length * li[0].offsetWidth}px)`;
    li[0].offsetWidth;
    num = li.length - 1;
  }
  MoveImg(num);
});

// 设置定时器
let TimeNum;
TimeNum = setInterval(function () {
  num = nextImg(num);
}, 2000);

// 设置鼠标移入移出事件
const box = document.querySelector('.box');

box.addEventListener('mouseenter', function () {
  prev.style.display = 'block';
  next.style.display = 'block';
  clearInterval(TimeNum);
});

box.addEventListener('mouseleave', function () {
  prev.style.display = 'none';
  next.style.display = 'none';
  clearInterval(TimeNum);
  TimeNum = setInterval(function () {
    num = nextImg(num);
  }, 2000);
});


// 瀑布流布局

// 相关信息
const waterfall = document.querySelector('.waterfall');
const imgWidth = 220;

// 创建元素
function creatImg(name, format = '.webp') {
  // 先清空原有图片
  waterfall.innerHTML = '';
  for (let i = 0; i < 36; i++) {
    const img = document.createElement('img');
    const div = document.createElement('div');
    div.classList.add('waterfallBox');
    img.src = `./images/${name}/${(10000 + i + 1) + format}`;
    div.appendChild(img);
    waterfall.appendChild(div);
    img.addEventListener('load', layout);
  }
}

creatImg('zcy');
// window.addEventListener('load', layout);
window.addEventListener('resize', layout);
// 点击事件：冒泡
const nav = document.querySelector('.nav ul');
nav.addEventListener('click', function (e) {
  if (e.target.tagName === 'LI') {
    let n = +e.target.dataset.id;
    document.querySelector('.nav ul li.active').classList.remove('active');
    document.querySelector(`.nav ul li:nth-child(${n})`).classList.add('active');
    let name = e.target.dataset.name;
    if (name === 'xl') creatImg(name, '.jpg');
    else if (name === 'zcy') creatImg(name);
  }
});

// 布局
function layout() {
  function getinfo() {
    let waterfallWidth = waterfall.offsetWidth;
    let column = Math.floor(waterfallWidth / imgWidth);
    let gapCount = column - 1;
    let freeSpace = waterfallWidth - imgWidth * column;
    let gap = freeSpace / gapCount;
    return {
      gap: gap,
      column: column,
    };
  }
  let info = getinfo();
  let nextTop = new Array(info.column);
  nextTop.fill(0);
  // 求一维数组的最小值
  function getMinTop(nextTop) {
    let min = nextTop[0], index = 0;
    for (let i = 0; i < nextTop.length; i++) {
      if (nextTop[i] < min) {
        min = nextTop[i];
        index = i;
      }
    }
    return {
      min: min,
      index: index,
    };
  }
  // 求一维数组的最大值
  function getMaxTop(nextTop) {
    let max = nextTop[0], index = 0;
    for (let i = 0; i < nextTop.length; i++) {
      if (nextTop[i] > max) {
        max = nextTop[i];
        index = i;
      }
    }
    return {
      max: max,
      index: index,
    };
  }
  // 设置每张图片的位置
  for (let i = 0; i < waterfall.children.length; i++) {
    const img = document.querySelector(`.waterfall div:nth-child(${i + 1})`);
    let minTop = getMinTop(nextTop);
    img.style.left = `${minTop.index * (imgWidth + info.gap)}px`;
    img.style.top = `${minTop.min + info.gap / 2}px`;
    // 更新数组
    nextTop[minTop.index] = nextTop[minTop.index] + img.offsetHeight + info.gap / 2;
    let maxTop = getMaxTop(nextTop);
    waterfall.style.height = maxTop.max + 'px';
    img.children[0].style.opacity = 1;
  }
}