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

  // degを求める
  const startX = rect.width * rect.fill.startX;
  const startY = rect.height * rect.fill.startY;
  const endX = rect.width * rect.fill.endX;
  const endY = rect.height * rect.fill.endY;
  const deg = Math.atan2(endY - startY, endX - startX) * 180 / Math.PI + 90;

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
