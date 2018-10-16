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
  console.log(css.join('\n'));
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
      // 色の10進数の数値を16進数の文字列に変更
      const color = toRGBA(point.color.value.toString(16));
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
 * @param {string} colorCode 変換するカラーコード
 */
function toRGBA(colorCode) {
  const chars = colorCode.split('');
  const a = parseInt(`${chars[0]}${chars[1]}`, 16);
  const r = parseInt(`${chars[2]}${chars[3]}`, 16);
  const g = parseInt(`${chars[4]}${chars[5]}`, 16);
  const b = parseInt(`${chars[6]}${chars[7]}`, 16);
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

module.exports = {
  commands: {
    CSSGradient: CSSGradientHandler
  }
};
