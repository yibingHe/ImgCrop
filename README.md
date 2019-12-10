##图片裁剪

####版本号：1.0.0

####使用：
1. 引入依赖文件 cropper、jquery、layer
  - <link href="../src/cropperjs/cropper.min.css" rel="stylesheet">
  - <script src="../src/jquery.min.js"></script>
  - <script src="../src/cropperjs/cropper.min.js"></script>
  - <script src="../src/layer/layer.js"></script>
  - <script src="../src/CropImg.js"></script>

2. 实例化 new CropImg(params1,params2)

```
demo:
 new CropImg(url, {
        stepWidth: 16, //宽高比
        stepHeight: 9, //宽高比
        width: 320,//裁剪图片宽和高
        height: 200,
        isCircle: false,//是否预览显示为圆形
        callback: function (obj) {//确定的回调，获取裁剪的结果，obj中包括3中模式url/file/formData

        }
      })
```