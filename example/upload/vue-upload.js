/**
 * Created by dio on 2017年4月13日19:15:13.
 * 
 * demo
 *    <vue-upload   class="upload-adds" target='../cloud2.file/file/uploadImage.do' v-on:start="start" v-on:finish="finish"></vue-upload> 
 * 
 * //发送前
            start:function(e){

            },
            //发送后
            finish:function(e){
                let target=e.target.responseText,
                    ujudgl=app.getValue('ujudgl','session'),
                    url=JSON.parse(target).url;
                if(ujudgl==1){
                    app.storeValue("specialtyImgUrl", url ,'session');
                    vm.cosUrl=url;
                    vm.isHet=false;
                    vm.isFet=true
                }else{
                    app.storeValue("identityCardImgUrl", url ,'session');
                    vm.gosUrl=url;
                    vm.isAet=false;
                    vm.isGet=true
                }

            }
 * 
 */

const Vue = require("vue");
Vue.component('vue-upload', {
    template: `
            <div class="vue-base64-file-upload" >
                    <input type="file"  @change="onFileChange" id="fileId" name="picture" >
                </i>
            </div>
        `,
    props: {
        target: {
            type: String
        },
        action: {
            type: String,
            default: 'POST'
        },
        imageClass: {
            type: String,
            default: ''
        },
        inputClass: {
            type: String,
            default: ''
        },
        accept: {
            type: String,
            default: 'image/png,image/gif,image/jpeg'
        },
        maxSize: {
            type: Number,
            default: 10 // megabytes
        },
        disablePreview: {
            type: Boolean,
            default: false
        },
        fileName: {
            type: String,
            default: ''
        },
        placeholder: {
            type: String,
            default: 'Click here to upload image'
        },
        defaultPreview: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            file: null,
            preview: null,
            visiblePreview: false
        };
    },

    computed: {
        wrapperStyles() {
            return {
                'position': 'relative',
                'width': '100%'
            };
        },
        fileInputStyles() {
            return {
                'width': '100%',
                'position': 'absolute',
                'top': 0,
                'left': 0,
                'right': 0,
                'bottom': 0,
                'opacity': 0,
                'overflow': 'hidden',
                'outline': 'none',
                'cursor': 'pointer'
            };
        },

        textInputStyles() {
            return {
                'width': '100%',
                'cursor': 'pointer'
            };
        },

        previewImage() {
            return this.preview || this.defaultPreview;
        }
    },
    methods: {

        emitter(event, data) {
            this.$emit(event, data)
        },
        uploadProgress(oEvent) {
            let vm = this
            if (oEvent.lengthComputable) {
                let percentComplete = Math.round(oEvent.loaded * 100 / oEvent.total)
                vm.emitter('progress', percentComplete)
            } else {
                // Unable to compute progress information since the total size is unknown
                vm.emitter('progress', false)
            }
        },
        onChange(e) {
            const files = e.target.files || e.dataTransfer.files;

            if (!files.length) {
                return;
            }
            const file = files[0];
            const size = file.size && (file.size / Math.pow(1000, 2));

            // check file max size
            if (size > this.maxSize) {
                this.$emit('size-exceeded', size);
                return;
            }

            // update file
            this.file = file;
            this.$emit('file', file);

            const reader = new FileReader();

            reader.onload = e => {
                const dataURI = e.target.result;

                if (dataURI) {
                    this.$emit('load', dataURI);

                    this.preview = dataURI;
                }
            };

            // read blob url from file data
            reader.readAsDataURL(file);


        },
        onFileChange(e) {
            let vm = this
            if (!this.target || this.target === '') {
                console.log('Please provide the target url')
            } else if (!this.action || this.action === '') {
                console.log('Please provide file upload action ( POST / PUT )')
            } else if (this.action !== 'POST' && this.action !== 'PUT') {
                console.log('File upload component only allows POST and PUT Actions')
            } else {
                let files = e.target.files || e.dataTransfer.files
                if (!files.length) {
                    return
                };
                /*global FormData XMLHttpRequest:true*/
                /*eslint no-undef: "error"*/
                this.file = files[0]
                let formData = new FormData()
                formData.append('picture', this.file)
                var xhr = new XMLHttpRequest()
                xhr.open(this.action, this.target)
                xhr.onloadstart = function (e) {
                    vm.emitter('start', e)
                }
                xhr.onloadend = function (e) {
                    vm.emitter('finish', e)
                }
                xhr.upload.onprogress = vm.uploadProgress

                xhr.send(formData)
            }
        }

    }

});