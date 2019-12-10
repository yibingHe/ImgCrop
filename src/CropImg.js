class CropImg { 
    constructor(url,option) { 
        if (!url) {
            console.error('没有找到需要裁剪的图片')
            return
        }
        if (!option.callback) { 
            console.error('缺少获取裁剪结果的回调callback')
            return
        }
        this.option = {
            stepWidth:16,
            stepHeight:9,
            isCircle:false,
            width:100,
            height: 100,
            callback: function () { }
        }
    
        this.__setOption__(option)
        this.el = document.createElement('div')
        this.el.setAttribute('style', 'display: flex;500px 100px;justify-content:center;height: 100%;margin: 10px;grid-column-gap: 20px')
        
        var cropBox = document.createElement('div')
        cropBox.setAttribute('class', 'cropBox')
        cropBox.setAttribute('style', 'background-color: #f2f2f2;width:500px')

        this.targetImg = document.createElement('img')
        this.targetImg.setAttribute('class', 'croptargetImgBox')
        this.targetImg.setAttribute('style', 'width:100%')
        this.targetImg.setAttribute('src', url)
        cropBox.appendChild(this.targetImg)
        this.el.appendChild(cropBox)

        var right = document.createElement('div')
        right.setAttribute('style', 'padding:0 5px')
        
        this.preview = document.createElement('div')
        this.preview.setAttribute('class', 'cropBox')
        var style = "width:"+10*this.option.stepWidth+"px;height:"+10*this.option.stepHeight+"px;box-shadow:0 0 2px 0 #000"
        this.preview.setAttribute('style', style)
        
        right.appendChild(this.preview)

        var stepTip = document.createElement('div')
        stepTip.setAttribute('class', 'stepTip')
        stepTip.setAttribute('style', 'color: #222;text-align: center;padding:5px 0 0 0')
        stepTip.innerText = this.option.stepWidth + ':' + this.option.stepHeight;
        right.appendChild(stepTip)
        this.el.appendChild(right)

        this.initCrop()
    }

    __setOption__(option) { 
        if (option.stepWidth) this.option.stepWidth = option.stepWidth
        if (option.stepHeight) this.option.stepHeight = option.stepHeight
        if (option.isCircle) this.option.isCircle = option.isCircle
        if (option.width) this.option.width = option.width
        if (option.height) this.option.height = option.height
        this.option.callback = option.callback
    }

    getRoundedCanvas  (sourceCanvas) { 
        var canvas = document.createElement('canvas');
        var context = canvas.getContext('2d');
        canvas.width = this.option.stepWidth*10;
        canvas.height = this.option.stepHeight*10;
        context.imageSmoothingEnabled = true;
        context.drawImage(sourceCanvas, 0, 0, this.option.stepWidth*10, this.option.stepHeight*10);
        context.globalCompositeOperation = 'destination-in';
        context.beginPath();
        if(this.option.isCircle) context.arc(50, 50, 50, 0, 2 * Math.PI, true);
        context.fill();
        return canvas;
    }

    initCrop () { 
        var that = this;
        this.roundedCanvas = ''
        
        $(this.targetImg).cropper({
            aspectRatio: this.option.stepWidth/this.option.stepHeight,
            viewMode: 1,
            crop: function () {
                var croppedCanvas = that.cropper.getCroppedCanvas();
                that.roundedCanvas = that.getRoundedCanvas(croppedCanvas);
                var roundedImage = document.createElement('img');
                roundedImage.src = that.roundedCanvas.toDataURL()
                that.preview.innerHTML = ''
                that.preview.appendChild(roundedImage);
            }
        })

        this.cropper = $(this.targetImg).data('cropper');
        if (this.option.isCircle) {
            this.preview.style.borderRadius = '50%'
            this.el.getElementsByClassName('cropper-view-box')[0].style.borderRadius = '50%'
            this.el.getElementsByClassName('cropper-face')[0].style.borderRadius = '50%'
        }

        this.render()
    }

    render () { 
        document.getElementsByTagName('body')[0].appendChild(this.el)
        var that = this;
        layer.open({
            title: '编辑头像',
            content: $(this.el),
            area: ['800px', '600px'],
            type: 1,
            btn: ['保存', '取消'],
            btn1: function () {
                that.submitImg();
            },
            btn2: function () {

            },
            end: function (index, layero) {
                layer.close(index);
            }
        })
    }

   

    submitImg () { 
        var url = this.roundedCanvas.toDataURL()
        var file = this.dataURLtoFile(url,'')
        var formData = new FormData();
        formData.append("file", file); 

        this.option.callback({
            url: url,
            file: this.dataURLtoFile(url, ''),
            formData:formData
        })
    }

    dataURLtoFile(dataurl, filename) {//将base64转file对象
        var arr = dataurl.split(','),
            mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]),
            n = bstr.length,
            u8arr = new Uint8Array(n);

        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, {type: mime});
    }


}

module.exports  = CropImg
   
    