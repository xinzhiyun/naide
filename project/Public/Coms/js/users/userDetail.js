// 实例化vue
var detail = new Vue({
    el: ".main",
    data() {
        return {
            // 用户列表
            userList: {},
            // 设备列表
            devicesList: [],
        }
    },
    created() {
        var colorList = ["#51CEE4", "#F8A56D", "#42D5B8", "#AD6BD0", "#F08686", "#51CEE4", "#F8A56D", "#42D5B8"];
        var perflow, perday;
        getDetail(function(userList, devicesList){
            detail.userList = userList;
            detail.devicesList = devicesList;
            detail.devicesList.type_name = [];
            detail.devicesList['filter'] = [];
            // 数据转换
            detail.devicesList.forEach(function(item, index){
                console.log('item: ',item);
                // 按设备分离数据
                detail.devicesList['filter'].push([]);
                for(var filter in item.type_name){

                    // 过滤出有数据的滤芯项目（实际的滤芯数量）
                    if(filter.indexOf('filter') > -1 && item.type_name[filter]){
                        // 遍历滤芯数据
                        var _index = filter.indexOf('filter') + 6;
                        // 天数，流量剩余比例
                        perday = item.dev_status["ReDayFilter" + filter.substring(_index,)]/item.dev_status["DayLifeFiter" + filter.substring(_index,)];
                        perflow = item.dev_status["ReFlowFilter" + filter.substring(_index,)]/item.dev_status["FlowLifeFilter" + filter.substring(_index,)];
                        detail.devicesList['filter'][index].push({
                            index: filter.substring(_index,),
                            name: item.type_name[filter],
                            dayLife: item.dev_status["DayLifeFiter" + filter.substring(_index,)],
                            reday: item.dev_status["ReDayFilter" + filter.substring(_index,)],
                            flowLife: item.dev_status["FlowLifeFilter" + filter.substring(_index,)],
                            reflow: item.dev_status["ReFlowFilter" + filter.substring(_index,)],
                        })
                        // 调用设备详情小圆圈
                        ;(function(container, colorindex){
                            console.log('colorindex: ',colorindex);
                            console.log('colorList[colorindex]: ',colorList[colorindex]);
                            console.log('container: ',container);
                            console.log('per: ',1 - Math.floor(Math.max(perday, perflow)*100)/100/100);
                            setTimeout(function(){
                                circle(container, colorList[colorindex], 1 - Math.floor(Math.max(perday, perflow)*100)/100/100);
                            },0);
                        })("#container" + index + (filter.substring(_index,) - 0 - 1), (filter.substring(_index,) - 0 - 1));
                        // console.log('filter: ',filter);
                    }
                }
                console.log("detail.devicesList['filter']: ",detail.devicesList['filter']);
                // 时间转换
                item.bindtime = getLocalTime(item.bindtime);
            })
            console.log('detail.userList: ',detail.userList);
            console.log('detail.devicesList: ',detail.devicesList);

        })
    },
    mounted() {},
    methods: {}
});

// 设备详情 小圆圈
function circle(el, color, percent) {
    var bar = new ProgressBar.Circle(el, {
        color: '#aaa',
        strokeWidth: 7,
        trailWidth: 5,
        easing: 'easeInOut',
        duration: 1400,
        text: {
            autoStyleContainer: false
        },
        from: { color: color, width: 5 },
        to: { color: color, width: 7 },
        step: function(state, circle) {
            circle.path.setAttribute('stroke', state.color);
            circle.path.setAttribute('stroke-width', state.width);
            var value = Math.round(circle.value() * 100) + '%';
            if (value === 0) {
                circle.setText('');
            } else {
                circle.setText(value);
            }

        } 
    });
    bar.text.style.fontFamily = '"Raleway", Helvetica, sans-serif';
    bar.text.style.fontSize = '.5rem';
    bar.animate(percent);  // 占得百分比  
}