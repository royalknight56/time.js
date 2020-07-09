/*
 * @Description: 
 * @Version: 2.0
 * @Autor: RoyalKnight
 * @Date: 2020-07-01 09:45:44
 * @LastEditors: RoyalKnight
 * @LastEditTime: 2020-07-09 17:45:08
 */

class timeJS {

    constructor(opt) {
        this.AUTO_TAG = "autotp";
        this.TP_TAG = "tp";

        this.TP_TIME_ART = "f-time";
        this.TP_VALUE_ART = "f-value";
        this.TP_SAVE_ART = "f-ifsave";
        this.TP_BIND_ART = "f-bind";
        this.TP_BIND_OPT_ART = "f-opt";


        this._manTime = 0;
        this._autoTime = 0;

        this.ifStop = false;

        this.timeCtrl = [];
        this.autoTimeCtrl = [];
        this.speed = 1;
        this.autoSpeed = 1;
        this.birth = 0;
        this.death = Number.MAX_VALUE;

        console.log("%c[START]---------------时间轴JS--------------", "color: green");
        console.log("%c[START]-----------持续改进中-1.0------------", "color: green");
        console.log("%c[START]-------------------------------------", "color: green");



        var moveAuto = document.getElementsByTagName(this.AUTO_TAG);

        for (let i = 0; i < moveAuto.length; i++) {
            moveAuto[i].setAttribute("f-start-time", moveAuto[i].getAttribute(this.TP_TIME_ART))

            this.render(moveAuto[i], 0);
        }


        var moveAuto = document.getElementsByTagName(this.TP_TAG);

        for (let i = 0; i < moveAuto.length; i++) {
            moveAuto[i].setAttribute("f-start-time", moveAuto[i].getAttribute(this.TP_TIME_ART))
            this.hideElement(moveAuto[i]);
            this.render(moveAuto[i], 0);
        }

        /**
         * @description: 检查配置
         * @author: RoyalKnight
         */
        if (opt == null) {
            console.log("%c[ERROR]---tp-conf didn't exist-------", "color: red;background-color:white;font-size:15px");
        } else {
            if (opt.autoSpeed == null) {
                console.log("%c[WARN]---autoSpeed didn't initialization-------", "color: yellow;background-color:black;font-size:15px");
                console.log("%c[WARN]---autoSpeed is defult value:1-----------", "color: yellow;background-color:black;font-size:15px");
            } else {
                this.autoSpeed = opt.autoSpeed;
            }
            if (opt.speed == null) {
                console.log("%c[WARN]---speed didn't initialization-------", "color: yellow;background-color:black;font-size:15px");
                console.log("%c[WARN]---speed is defult value:1-----------", "color: yellow;background-color:black;font-size:15px");
            } else {
                this.speed = opt.speed;
            }
            if(opt.birth){
                this.birth=opt.birth;
            }else{
            }
            if(opt.death){
                this.death=opt.death;
            }else{
            }
        }

        /**
         * @description: 添加动作执行触发事件
         * @author: RoyalKnight
         */
        var $this = this
        //Auto渲染
        window.setInterval(function () {
            $this.callRender($this.autoSpeed, 1);
        }, 100)

        //Key事件
        window.addEventListener("keydown", function (e) {

            if (e.key == "ArrowDown" || e.key == "ArrowRight") {
                $this.callRender($this.speed, 0);
            } else if (e.key == "ArrowUp" || e.key == "ArrowLeft") {
                $this.callRender(-$this.speed, 0);
            }
        })
        //Wheel事件
        window.addEventListener("mousewheel", function (e) {
            $this.callRender(e.deltaY / Math.abs(e.deltaY) * $this.speed, 0);
        })


    }
    //隐藏元素
    hideElement(e) {
        e.style.opacity = '0';
        //e.style.display = "none"
    }
    //显示元素
    showElement(e) {
        //e.style.display = "block";
        e.style.opacity = '1';
    }

    callRender(num, type) {
        //时间轴
        if (this.ifStop) {/////判断是否暂停

        } else {
            if (type == 0) {//非自动
                this.manTime = this.manTime + num;
            } else if (type == 1) {//自动
                if(this.autoTime<this.death&&this.autoTime>=this.birth){
                    this.autoTime = this.autoTime + num;
                }
            }
        }
    }

    /**
     * @description: 对内部时间控制变量的代理
     * @author: RoyalKnight
     */

    get manTime() {

        return this._manTime;
    }
    set manTime(value) {
        let i = this._manTime;
        if (this._manTime > value) {
            for (i--; i >= value; i--) {
                if (this.timeCtrl[i] != undefined) {
                    this.timeCtrl[i].fun();
                    if (this.timeCtrl[i].ifonce) {
                        this.timeCtrl[i] = undefined;
                    }
                }
            }
        } else if (this._manTime < value) {
            for (i++; i <= value; i++) {
                if (this.timeCtrl[i] != undefined) {
                    this.timeCtrl[i].fun();
                    if (this.timeCtrl[i].ifonce) {
                        this.timeCtrl[i] = undefined;
                    }
                }
            }
        }
        this._manTime = value;
        let manAll = document.getElementsByTagName(this.TP_TAG);
        for (let i = 0; i < manAll.length; i++) {

            this.render(manAll[i], value);
        }
    }
    get autoTime() {
        return this._autoTime;
    }
    set autoTime(value) {
        let i = this._autoTime;
        if (this._autoTime > value) {
            for (i--; i >= value; i--) {
                if (this.autoTimeCtrl[i] != undefined) {
                    this.autoTimeCtrl[i].fun();
                    if (this.autoTimeCtrl[i].ifonce) {
                        this.autoTimeCtrl[i] = undefined;
                    }
                }
            }
        } else if (this._autoTime < value) {
            for (i++; i <= value; i++) {
                if (this.autoTimeCtrl[i] != undefined) {
                    this.autoTimeCtrl[i].fun();
                    if (this.autoTimeCtrl[i].ifonce) {
                        this.autoTimeCtrl[i] = undefined;
                    }
                }
            }
        }
        this._autoTime = value;
        let autoAll = document.getElementsByTagName(this.AUTO_TAG);
        for (let i = 0; i < autoAll.length; i++) {
            this.render(autoAll[i], value);
        }

    }

    //渲染core
    render(moveElement, autoTime) {
        /**
         * @description: 渲染时对元素的配置的判断
         * @author: RoyalKnight
         */
        let timeArt = moveElement.getAttribute(this.TP_TIME_ART);
        if (timeArt) {//有time属性
            let valueArt = moveElement.getAttribute(this.TP_VALUE_ART);
            if (valueArt) {

            } else {
                console.log("%c[WARN]---no f-value-------", "color: yellow;background-color:black;font-size:15px")
                return
            }
        } else {//无time属性

            console.log("%c[WARN]---no f-time-------", "color: yellow;background-color:black;font-size:15px")
            let valueArt = moveElement.getAttribute(this.TP_VALUE_ART);
            if (valueArt) {//无time属性有value属性
                //管道
                if (moveElement.getAttribute(this.TP_BIND_OPT_ART) != null) {
                    let funArry = moveElement.getAttribute(this.TP_BIND_OPT_ART).split("/");
                    let ifmark = 0;
                    for (let i = 0; i < funArry.length; i++) {
                        let values = moveElement.getAttribute(this.TP_VALUE_ART).split('/');

                        for (let j = 0; j < values.length; j++) {
                            if (this[funArry[i]]) {
                                this[funArry[i]](values[j])
                                ifmark = 1;
                            } else {

                            }
                            //this[funArry[i]]?.(values[j]);
                        }
                    }
                    if (ifmark == 1) {
                        moveElement.parentNode.removeChild(moveElement)
                    }
                    this.hideElement(moveElement)
                    //moveElement.parentNode.removeChild(moveElement)
                }
            } else {
                console.log("%c[WARN]---no f-value-------", "color: yellow;background-color:black;font-size:15px")
                return
            }
            return
        }
        
        /**
         * @description: 进行计算
         * @author: RoyalKnight
         */
        let timearr = timeArt.split("/");
        var j = 0;
        for (j = 0; j < timearr.length; j++) {
            if (autoTime >= timearr[j] && autoTime <= timearr[j + 1]) {
                break;
            }
        }
        let timefrom;
        let timeto;
        if (j == timearr.length) {
            timefrom = timearr[j - 1];
            timeto = timearr[j - 1];
        } else {
            timefrom = timearr[j];
            timeto = timearr[j + 1];
        }

        if (autoTime >= timefrom && autoTime <= timeto) {
            //显示时渲染
            this.showElement(moveElement);

            let posfrom = moveElement.getAttribute(this.TP_VALUE_ART).split('/')[j];
            let posto = moveElement.getAttribute(this.TP_VALUE_ART).split('/')[j + 1];

            let bindarr;
            if (moveElement.getAttribute(this.TP_BIND_ART) == null) {
                console.log("%c[WARN]---one element's bind didn't initialization-------", "color: yellow;background-color:black;font-size:15px");
                let filler = (parseInt(posfrom) +
                    (autoTime - timefrom) * (posto - posfrom) /
                    (timeto - timefrom));
                //filler为计算出的值

                //管道
                if (moveElement.getAttribute(this.TP_BIND_OPT_ART) != null) {
                    let funArry = moveElement.getAttribute(this.TP_BIND_OPT_ART).split("/");

                    for (let i = 0; i < funArry.length; i++) {
                        filler = this[funArry[i]]?.(filler);
                    }
                }
            } else {
                bindarr = moveElement.getAttribute(this.TP_BIND_ART).split('/');
                var k = 0;
                for (k = 0; k < bindarr.length; k++) {

                    let filler = (parseInt(posfrom.split(",")[k]) +
                        (autoTime - timefrom) * (posto.split(",")[k] - posfrom.split(",")[k]) /
                        (timeto - timefrom));
                    //filler为计算出的值

                    //管道
                    if (moveElement.getAttribute(this.TP_BIND_OPT_ART) != null) {
                        let funArry = moveElement.getAttribute(this.TP_BIND_OPT_ART).split("/");

                        for (let i = 0; i < funArry.length; i++) {
                            filler = this[funArry[i]]?.(filler);
                        }
                    }
                    let bindArt = bindarr[k].split(",")[0];
                    let bindVal = bindarr[k].split(",")[1];
                    if (bindVal[bindVal.length - 1] == ";") {
                        bindVal = bindVal.slice(0, bindVal.length - 1)
                    }
                    moveElement.style[bindArt] = bindVal.replace("$", filler);//将$替换为值

                }
            }


        } else if (autoTime > timeto) {
            //结束处理
            if (moveElement.getAttribute(this.TP_SAVE_ART) == "true") {

                this.showElement(moveElement);
            } else if (moveElement.getAttribute(this.TP_SAVE_ART) == "auto") {
                ///循环动画处理
                let startTime = moveElement.getAttribute("f-start-time");
                let startArray = startTime.split("/");
                let distance = startArray[startArray.length - 1] - startArray[0];
                let endTimeDistance = parseInt((autoTime - startArray[0]) / distance) * distance;
                let endTime = "";
                for (let i = 0; i < startArray.length - 1; i++) {
                    endTime += parseInt(parseInt(startArray[i]) + parseInt(endTimeDistance));
                    endTime += "/";
                }

                endTime += parseInt(parseInt(startArray[startArray.length - 1]) + parseInt(endTimeDistance));
                moveElement.setAttribute(this.TP_TIME_ART, endTime);

            } else {
                this.hideElement(moveElement);

            }
        } else if (autoTime <= timeto) {
            //返回处理
            if (moveElement.getAttribute(this.TP_SAVE_ART) == "true") {

                this.hideElement(moveElement);

            } else if (moveElement.getAttribute(this.TP_SAVE_ART) == "auto") {
                ///循环动画处理

                let startTime = moveElement.getAttribute("f-start-time");


                let startArray = startTime.split("/");

                if (autoTime < startArray[0]) {
                    this.hideElement(moveElement);
                    return;
                }

                let distance = startArray[startArray.length - 1] - startArray[0];

                let endTimeDistance = parseInt((autoTime - startArray[0]) / distance) * distance;
                let endTime = "";
                for (let i = 0; i < startArray.length - 1; i++) {
                    endTime += parseInt(parseInt(startArray[i]) + parseInt(endTimeDistance));
                    endTime += "/";
                }
                endTime += parseInt(parseInt(startArray[startArray.length - 1]) + parseInt(endTimeDistance));
                moveElement.setAttribute(this.TP_TIME_ART, endTime);

            } else {
                this.hideElement(moveElement);

            }
        } else {
            this.hideElement(moveElement);

        }
    }
    /**
     * @description: 绑定管道
     * @param {Object} {"funName":function(){}}
     * @return {NULL}
     * @author: RoyalKnight
     */
    bind(opt) {
        for (let key in opt) {
            if (key == "bind") {
            } else {
                this[key] = opt[key];
            }
        }
    }
    /**
     * @description: 停止播放
     * @param {NULL} 
     * @return {NULL} 
     * @author: RoyalKnight
     */
    stop() {
        this.ifStop = true;
    }
    /**
     * @description: 开始播放
     * @param {NULL} 
     * @return {NULL} 
     * @author: RoyalKnight
     */
    start() {
        this.ifStop = false;
    }

    bindCtrl(num, fun, ifonce) {
        for (let i = 0; i < num.length; i++) {
            this.timeCtrl[num[i]] = { fun, ifonce };
        }
    }
    bindAutoCtrl(num, fun, ifonce) {
        for (let i = 0; i < num.length; i++) {
            this.autoTimeCtrl[num[i]] = { fun, ifonce };
        }
    }
    setTime(num) {
        this.manTime = num;
    }
    getTime() {
        return this.manTime;
    }
    setAutoTime(num) {
        this.autoTime = num;
    }
    getAutoTime() {
        return this.autoTime;
    }
    
}