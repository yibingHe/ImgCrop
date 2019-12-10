
window.CropImg = (function () { 

    /* 
    依赖：
    1. cropper、jquery、layer
    实例化参数：
    1. url 
    2. option {
        step:{
            width:1,
            height:1
        },
        isCircle:false,
        width:100,
        height:100
    }
    */

    var DefaultOption = {
        step:{
            width:10,
            height:10
        },
        isCircle:false,
        width:100,
        height:100
    }

    /*裁剪选择的图片*/
    var CropImg = function (url, option) { 
        this.option = $.extend(DefaultOption,option)
        this.$el = $('<div style="display: grid;grid-template-columns: 500px 100px;justify-content:center;height: 100%;margin: 10px;grid-column-gap: 20px">' +
            '<div class="cropBox" style="background-color: #f2f2f2">' +
            '<img class="targetImg" src="' + url + '" style="width: 100%">' +
            '</div>' +
            '<div>' +
            '<div class="preview" style="width: 100px;height: 100px;box-shadow:0 0 2px 0 #000"></div>' +
            '<div style="color: #222;text-align: center">'+this.option.step.width+':'+this.option.step.height+'</div>' +
            '</div>' +
            '</div>')
        
        this.initCrop()
        
    }
    CropImg.prototype.initCrop = function () { 
        var that = this;
        var $image = this.$el.find('.targetImg')
        this.roundedCanvas = ''
        
        $image.cropper({
            aspectRatio: this.option.step.width/this.option.step.height,
            viewMode: 1,
            crop: function () {
                var croppedCanvas = that.cropper.getCroppedCanvas();
                that.roundedCanvas = that.getRoundedCanvas(croppedCanvas);
                var roundedImage = document.createElement('img');
                roundedImage.src = that.roundedCanvas.toDataURL()
                that.$el.find('.preview').empty();
                that.$el.find('.preview')[0].appendChild(roundedImage);
            }
        })

        this.cropper = $image.data('cropper');
        if (this.option.isCircle) {
            this.$el.find('.preview').css('border-radius', '50%')
            this.$el.find('.cropper-view-box').css('border-radius', '50%')
            this.$el.find('.cropper-face').css('border-radius', '50%')
        }

        this.render()
    },
    CropImg.prototype.getRoundedCanvas = function (sourceCanvas) { 
        var canvas = document.createElement('canvas');
        var context = canvas.getContext('2d');
        canvas.width = this.option.step.width*10;
        canvas.height = this.option.step.height*10;
        context.imageSmoothingEnabled = true;
        context.drawImage(sourceCanvas, 0, 0, this.option.step.width*10, this.option.step.height*10);
        context.globalCompositeOperation = 'destination-in';
        context.beginPath();
        if(this.option.isCircle) context.arc(50, 50, 50, 0, 2 * Math.PI, true);
        context.fill();
        return canvas;
    }
    CropImg.prototype.render = function () { 
        $('body').append(this.$el)
        var that = this;
        layer.open({
            title: '编辑头像',
            content: this.$el,
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
    CropImg.prototype.submitImg = function () { 
        var url = this.roundedCanvas.toDataURL()
        var file = dataURLtoFile(url,'')
        var formData = new FormData();
        formData.append("file", file); 

        this.option.callback({
            url: url,
            file: dataURLtoFile(url, ''),
            formData:formData
        })
    }

    var dataURLtoFile = function(dataurl, filename) {//将base64转file对象
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
    return CropImg;
    
})()