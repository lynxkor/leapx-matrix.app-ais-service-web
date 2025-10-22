<template>
  <div id="lp-waterMark" style="overflow: hidden;width: 100%;"></div>
</template>

<script>
export default {
  props: {
    markContent: {
      type: String,
      default: null
    }
  },
  data () {
    return {
      divChild: null,
      time: null,
      index: 0
    };
  },
  watch: {
    markContent (e) {
      // console.log(this.markContent);
      if (this.markContent) {
        this.time = setInterval(() => {
          this.waterMark().set();
          this.index++;
          if (this.index >= 100) {
            clearInterval(this.time);
          }
        }, 60);
      }
    }
  },
  mounted () {
    if (this.markContent) {
      // const that = this;
      // setInterval(() => {
      //   this.waterMark().set();
      // }, 60);
    }
  },
  methods: {
    canvas () {
      const that = this;
      // 创建一个画布
      const can = document.createElement('canvas');
      // 设置画布的长宽
      can.width = that.markContent.length * 11;
      can.height = that.markContent.length * 11 * 0.24;

      const cans = can.getContext('2d');
      // 旋转角度
      cans.rotate((-11.2 * Math.PI) / 180);
      cans.font = '12px Vedana';
      // 设置填充绘画的颜色、渐变或者模式
      cans.fillStyle = 'rgba(200, 200, 200, 0.2)';
      // 设置文本内容的当前对齐方式
      // cans.textAlign = 'left';
      // 设置在绘制文本时使用的当前文本基线
      // cans.textBaseline = 'Middle';
      // let current = 0;
      cans.fillText(that.markContent, 0, 70);
      // 在画布上绘制填色的文本（输出的文本，开始绘制文本的X坐标位置，开始绘制文本的Y坐标位置）
      // for (let index = 0; index < document.documentElement.clientHeight / 50; index++) {
      //   console.log(index);
      //   cans.fillText(that.markContent, 0 - parseInt((Math.random() * 200)), current + index * 50);
      // }
      return can;
    },
    waterMark () {
      try {
        const that = this;
        const watermark = {};
        const setWatermark = () => {
          const id = (Math.random() * 1000000).toFixed(5);

          if (document.getElementById(id) !== null) {
            document.body.removeChild(document.getElementById(id));
          }

          const div = document.createElement('div');
          div.id = id;
          div.style.pointerEvents = 'none';
          div.style.position = 'fixed';
          div.style.zIndex = '999';
          div.style.width = document.getElementById('lp-waterMark').parentNode.clientWidth + 'px';
          div.style.height = document.getElementById('lp-waterMark').parentNode.clientHeight + 'px';
          div.style.background = 'url(' + that.canvas().toDataURL('image/png') + ') left top repeat';
          if (that.divChild) {
            that.divChild.parentNode.removeChild(that.divChild);
          }
          document.getElementById('lp-waterMark').appendChild(div);
          that.divChild = div;
          return id;
        };

        // 该方法只允许调用一次
        watermark.set = () => {
          let id = setWatermark();
          if (document.getElementById(id) === null) {
            id = setWatermark();
          }
          if (document.getElementById(id) === null) {
            id = setWatermark();
          }
          window.onresize = () => {
            setWatermark();
          };
        };
        return watermark;
      } catch (error) {
        console.log(error);
      }
    }
  },
  destroyed () {
    clearInterval(this.time);
  }
};
</script>
