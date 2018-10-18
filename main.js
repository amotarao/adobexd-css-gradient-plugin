const { Rectangle, LinearGradientFill } = require('scenegraph');

function CSSGradientHandler(selection) {
  const items = selection.items;
  const css = items
    .map(item => {
      if (item instanceof Rectangle) {
        // Note: item.fillのインスタンスで振り分けしたいが、インスタンスではないっぽい (エラーになる)
        // if (item.fill instanceof LinearGradientFill) {
          return getRectLinearGradient(item);
        // }
      }
      return false;
    })
    .filter(item => item);

  document.body.appendChild(createDialog(css.join('\n'))).showModal();
}

/**
 * ダイアログを生成する
 * Referenced: https://github.com/AdobeXD/plugin-samples/tree/master/ui-hello
 * @param {string} text テキストエリアにいれる文字列
 */
function createDialog(text) {
  //  create the dialog
  const dialog = document.createElement('dialog');

  //  create the form element
  //  the form element has default styling and spacing
  let form = document.createElement('form');
  dialog.appendChild(form);
  //  don't forget to set your desired width
  form.style.width = 360;
  form.style.height = 240;

  //  add your content
  let hello = document.createElement('textarea');
  hello.textContent = text;
  hello.style.width = 360;
  hello.style.height = 240;
  hello.style.boxSizing = 'border-box';
  form.appendChild(hello);

  //  create a footer to hold your form submit and cancel buttons
  let footer = document.createElement('footer');
  form.appendChild(footer)
  //  include at least one way to close the dialog
  let closeButton = document.createElement('button');
  closeButton.uxpVariant = 'cta';
  closeButton.textContent = 'Close';
  closeButton.onclick = () => dialog.close();
  footer.appendChild(closeButton);

  return dialog;
}

/**
 * Rectangleの linear-gradientの CSSを返す
 * @param {Rectangle} 求めるRectangle
 */
function getRectLinearGradient(rect) {
  const deg = toDeg(rect.width, rect.height, rect.fill.startX, rect.fill.startY, rect.fill.endX, rect.fill.endY);
  const colors = rect.fill.colorStops
    .map(point => {
      const color = toCssRgba(point.color);
      return `${color} ${point.stop * 100}%`;
    })
    .join(', ');

  return `
.${rect.name} {
  background: linear-gradient(${deg}deg, ${colors});
}`;
}

/**
 * linear-gradient用のdegを求める
 * @param {number} width 図形の幅
 * @param {number} height 図形の高さ
 * @param {number} x1 始点の座標x
 * @param {number} y1 始点の座標y
 * @param {number} x2 終点の座標x
 * @param {number} y2 終点の座標y
 */
function toDeg(width, height, x1, y1, x2, y2) {
  const startX = width * x1;
  const startY = height * y1;
  const endX = width * x2;
  const endY = height * y2;
  const deg = Math.atan2(endY - startY, endX - startX) * 180 / Math.PI + 90;
  return deg;
}

/**
 * 16進数のカラーコードをrgba()に変換
 * @param {Color} color 変換する色インスタンス
 */
function toCssRgba(color) {
  const {r, g, b, a} = color.toRgba();
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

module.exports = {
  commands: {
    CSSGradient: CSSGradientHandler
  }
};
