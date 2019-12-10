##图片裁剪

####版本号：1.0.0

####使用：
1. 引入js
2. 实例化 new CropImg(params1,params2)

```
demo:
 new CropImg(url, {
        step: { //宽高比
            width: 16,
            height: 9
        },
        width: 320,//裁剪图片宽和高
        height: 200,
        isCircle: false,//是否预览显示为圆形
        callback: function (obj) {//确定的回调，获取裁剪的结果，obj中包括3中模式url/file/formData

        }
      })
```